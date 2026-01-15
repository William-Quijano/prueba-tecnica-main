import { Hono } from "hono";
import { db } from "../db";
import { products, type NewProduct } from "../db/schema";
import { eq, or, ilike, count, desc } from "drizzle-orm";
import { storageService } from "../lib/storage";

const productsRouter = new Hono();

// GET /products
productsRouter.get("/", async (c) => {
  try {
    const { search, limit, offset, page } = c.req.query();
    const limitNum = limit ? parseInt(limit) : 10;
    
    let offsetNum = 0;
    if (offset) {
      offsetNum = parseInt(offset);
    } else if (page) {
      offsetNum = (parseInt(page) - 1) * limitNum;
    }

    let whereClause = undefined;
    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      whereClause = or(
        ilike(products.name, searchLower),
        ilike(products.description, searchLower),
        ilike(products.category, searchLower)
      );
    }

    const [totalResult] = await db
      .select({ count: count() })
      .from(products)
      .where(whereClause);

    const total = totalResult?.count || 0;
    const totalPages = Math.ceil(total / limitNum);

    const data = await db
      .select()
      .from(products)
      .where(whereClause)
      .limit(limitNum)
      .offset(offsetNum)
      .orderBy(desc(products.createdAt));

    return c.json({
      data,
      total,
      page: Math.floor(offsetNum / limitNum) + 1,
      limit: limitNum,
      totalPages,
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return c.json({ error: "Error al obtener los productos" }, 500);
  }
});

// GET /products/:id
productsRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const result = await db.select().from(products).where(eq(products.id, id));

    if (result.length === 0) {
      return c.json({ error: "Producto no encontrado" }, 404);
    }

    return c.json(result[0]);
  } catch (error) {
    return c.json({ error: "Error al obtener el producto" }, 500);
  }
});

// POST /products
productsRouter.post("/", async (c) => {
  let uploadedImageUrl: string | null = null;

  try {
    const body = await c.req.parseBody();

    if (
      !body.name ||
      !body.description ||
      !body.price ||
      !body.category ||
      !body.image
    ) {
      return c.json(
        {
          error:
            "Campos requeridos: name, price, description, category, image",
        },
        400
      );
    }

    const productToInsert = {
      id: crypto.randomUUID(),
      name: body.name as string,
      description: body.description as string,
      price: parseFloat(body["price"] as string),
      category: body.category as string,
      image: body.image as string,
    };

    if (body.image && body.image instanceof File) {
      try {
        uploadedImageUrl = await storageService.upload(
          body.image,
          "products"
        );

        productToInsert.image = uploadedImageUrl;
      } catch (uploadError) {
        console.error("Error al subir la imagen:", uploadError);
        return c.json({ error: "Error al subir la imagen" }, 500);
      }
    }else{
      console.error("La imagen tiene que ser un archivo de tipo File")
      return c.json({ error: "La imagen tiene que ser un archivo de tipo File" }, 400);
    }

    const [newProduct] = await db
      .insert(products)
      .values(productToInsert)
      .returning();

    return c.json(newProduct, 201);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    if (uploadedImageUrl) {
      await storageService.delete(uploadedImageUrl);
    }

    return c.json({ error: "Error al crear el producto" }, 500);
  }
});

// PUT /products/:id
productsRouter.put("/:id", async (c) => {
  let newUploadedImageUrl: string | null = null;

  try {
    const id = c.req.param("id");
    const body = await c.req.parseBody();
    
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    if (!existingProduct) {
      return c.json({ error: "Product not found" }, 404);
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    const name = body["name"] as string;
    const description = body["description"] as string;
    const price = body["price"]
      ? parseFloat(body["price"] as string)
      : undefined;
    const category = body["category"] as string;
    const image = body["image"] as string | File | undefined;


    if (image && image instanceof File) {
      try {
        newUploadedImageUrl = await storageService.upload(
          image,
          "products"
        );
      } catch (uploadError) {
        return c.json({ error: "Error al subir la imagen" }, 500);
      }
    }

    // Fallback for partial updates if logic skips above
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (price) updateData.price = price;

    if (newUploadedImageUrl) {
      updateData.image = newUploadedImageUrl;
    } else if (typeof image === "string" && image !== existingProduct.image) {
      updateData.image = image;
    }

    const [updatedProduct] = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();

    if (newUploadedImageUrl && existingProduct.image) {
      await storageService.delete(existingProduct.image);
    }

    return c.json(updatedProduct);
  } catch (error) {
    if (newUploadedImageUrl) {
      await storageService.delete(newUploadedImageUrl);
    }

    return c.json({ error: "Error al actualizar el producto" }, 500);
  }
});

// DELETE /products/:id
productsRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    await db.delete(products).where(eq(products.id, id));

    if (product.image) {
      await storageService.delete(product.image);
    }

    return c.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});


export default productsRouter;