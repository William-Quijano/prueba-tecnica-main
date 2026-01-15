import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import productsRouter from "./routes/products";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (c) => {
  return c.json({
    message: "Products CRUD API - Prueba Técnica Frontend",
    version: "1.0.0",
    stack: "Bun + Hono + Drizzle ORM + Neon Database",
    endpoints: {
      "GET /api/products": "Listar productos (soporta ?search=...)",
      "GET /api/products/:id": "Obtener producto por ID",
      "POST /api/products": "Crear producto",
      "PUT /api/products/:id": "Actualizar producto",
      "DELETE /api/products/:id": "Eliminar producto",
    },
  });
});

app.route("/api/products", productsRouter);

app.notFound((c) => {
  return c.json({ error: "Ruta no encontrada" }, 404);
});

app.onError((err, c) => {
  return c.json({ error: "Error interno del servidor" }, 500);
});

const port = process.env.PORT || 3001;

export default {
  port,
  fetch: app.fetch,
};
