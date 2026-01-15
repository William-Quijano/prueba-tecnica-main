"use client";

import { useProductForm } from "@/hooks/use-product-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import Image from "next/image";

interface ProductFormProps {
  productId?: string | null;
  onSuccess?: () => void;
}

export function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const {
    form,
    onSubmit,
    isLoadingProduct,
    product,
    previewUrl,
    setPreviewUrl,
    fileInputKey,
    setFileInputKey,
    tForm,
  } = useProductForm({ productId, onSuccess });

  if (productId && isLoadingProduct) {
    return <div className="p-4 text-center">Loading product...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tForm("name")}</FormLabel>
              <FormControl>
                <Input className="outline-solid" placeholder={tForm("name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tForm("description")}</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  className="resize-none outline-solid"
                  placeholder={tForm("description")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tForm("price")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    className="outline-solid"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tForm("category")}</FormLabel>
                <FormControl>
                  <Input className="outline-solid" placeholder={tForm("category")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Current Image (Update Mode) */}
        {productId && product?.image && (
          <div className={`space-y-2 ${previewUrl ? 'border-b pb-4' : ''}`}>
            <FormLabel>Imagen Actual</FormLabel>
            <div className="relative aspect-video w-40 overflow-hidden rounded-md border text-center bg-muted/50 flex items-center justify-center">
              <Image
                src={product.image}
                alt="Actual"
                width={160}
                height={160}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
        
        {/* New Image Preview */}
        {previewUrl && (
           <div className="space-y-2">
            <FormLabel>{productId ? "Imagen Nueva (Reemplazará a la actual)" : "Previsualización"}</FormLabel>
             <div className="relative aspect-video w-40 overflow-hidden rounded-md border bg-muted/50 flex items-center justify-center">
    
              <Image
                src={previewUrl}
                alt="Preview"
                width={160}
                height={160}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
           </div>
        )}

        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value: _value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel htmlFor="image-input">{tForm("image")}</FormLabel>
              <FormControl>
                <div className="flex gap-2 items-center">
                    <Input
                    id="image-input" // Manual ID for accessibility
                    key={fileInputKey}
                    type="file"
                    className="outline-solid flex-1"
                    {...fieldProps}
                    value={undefined}
                    onChange={(event) => {
                        const file = event.target.files && event.target.files[0];
                        if (file) {
                            onChange(file);
                            const url = URL.createObjectURL(file);
                            setPreviewUrl(url);
                        }
                    }}
                    />
                     {previewUrl && (
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                                onChange(undefined);
                                setPreviewUrl(null);
                                setFileInputKey(prev => prev + 1);
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                     )}
                </div>
              </FormControl>
              <FormDescription>
                JPG, PNG, WEBP, AVIF (Max 1MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {productId ? tForm("update") : tForm("save")}
        </Button>
      </form>
    </Form>
  );
}
