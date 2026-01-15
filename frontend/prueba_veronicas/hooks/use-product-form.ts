import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProductById } from "@/lib/services/products.service";
import { createProductAction, updateProductAction } from "@/actions/products.actions";

interface UseProductFormProps {
  productId?: string | null;
  onSuccess?: () => void;
}

export function useProductForm({ productId, onSuccess }: UseProductFormProps) {
  const tForm = useTranslations("ProductForm");
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const formSchema = z.object({
    name: z.string().min(1, tForm("validation.nameRequired")),
    description: z.string().min(1, tForm("validation.descriptionRequired")),
    price: z.coerce.number().min(0, tForm("validation.pricePositive")),
    category: z.string().min(1, tForm("validation.categoryRequired")),
    image: z
      .custom<File | string>(
        (val) => {
          if (!productId && !val) return false;
          if (val instanceof File) return true;
          if (typeof val === "string" && val.length > 0) return true;
          if (productId && !val) return true;
          return false;
        },
        {
          message: productId
            ? tForm("validation.imageFile")
            : tForm("validation.imageRequired"),
        }
      )
      .refine(
        (file) => {
          if (file instanceof File) {
            const validTypes = [
              "image/jpg",
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/avif",
            ];
            
            const isValidType = validTypes.includes(file.type);
            const isValidSize = file.size <= 1024 * 1024;
            return isValidType && isValidSize;
          }
          return true;
        },
        {
          message: "Formato de imagen no soportado o tamaño excedido",
        }
      ),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      image: undefined,
    },
  });

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
  });

  const lastLoadedId = useRef<string | null>(null);

  useEffect(() => {
    if (product && product.id !== lastLoadedId.current) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
      });
      lastLoadedId.current = product.id;
    }
  }, [product, form]);

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("category", values.category);
    if (values.image) {
      formData.append("image", values.image);
    }

    let result;
    if (productId) {
      result = await updateProductAction(productId, null, formData);
    } else {
      result = await createProductAction(null, formData);
    }

    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (productId)
        queryClient.invalidateQueries({ queryKey: ["product", productId] });
      onSuccess?.();
    } else {
      toast.error(result.message);
    }
  };

  return {
    form,
    onSubmit,
    isLoadingProduct,
    product,
    previewUrl,
    setPreviewUrl,
    fileInputKey,
    setFileInputKey,
    tForm,
  };
}
