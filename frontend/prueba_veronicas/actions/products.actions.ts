'use server';

import { createProduct, updateProduct, deleteProduct } from '@/lib/services/products.service';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, ''),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  image: z.union([z.instanceof(File), z.string()]).optional(),
});

const updateProductSchema = productSchema.partial();

export async function createProductAction(prevState: unknown, formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      category: formData.get('category'),
    };

    // Validate text fields
    productSchema.parse({ ...rawData, image: undefined });
    
    // Pass formData directly to support file upload
    await createProduct(formData);
    revalidatePath('/');
    return { success: true, message: 'Product created successfully' };
  } catch (error) {
    if (error instanceof z.ZodError) {
        return { success: false, message: error.issues[0].message };
    }
    return { success: false, message: 'Failed to create product' };
  }
}

export async function updateProductAction(id: string, prevState: unknown, formData: FormData) {
    try {
      const rawData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        category: formData.get('category'),
      };
  
      // Validate text fields
      updateProductSchema.parse({ ...rawData, image: undefined });
      
      await updateProduct(id, formData);
      revalidatePath('/');
      return { success: true, message: 'Product updated successfully' };
    } catch (error) {
      if (error instanceof z.ZodError) {
          return { success: false, message: error.issues[0].message };
      }
      return { success: false, message: 'Failed to update product' };
    }
  }

export async function deleteProductAction(id: string) {
  try {
    await deleteProduct(id);
    revalidatePath('/');
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return { success: false, message: 'Failed to delete product' };
  }
}
