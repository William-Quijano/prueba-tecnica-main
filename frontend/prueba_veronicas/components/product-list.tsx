"use client";

import { useProductList } from '@/hooks/use-product-list';
import { ProductGrid } from '@/components/product-grid';
import { ProductForm } from '@/components/product-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Product } from '@/lib/types/product';

export default function ProductList() {
  const {
    t,
    tForm,
    search,
    handleSearch,
    isCreateOpen,
    setIsCreateOpen,
    editingId,
    setEditingId,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    products
  } = useProductList();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder={t('searchPlaceholder')}
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm outline-solid"
        />
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingId(null)}>
              <Plus className="mr-2 h-4 w-4" /> {t('addProduct')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tForm('createTitle')}</DialogTitle>
              <DialogDescription className="sr-only">
                {tForm('createTitle')}
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
                onSuccess={() => {
                    setIsCreateOpen(false);
                    refetch();
                }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{tForm('editTitle')}</DialogTitle>
                <DialogDescription className="sr-only">
                    {tForm('editTitle')}
                </DialogDescription>
            </DialogHeader>
            {editingId && (
                 <ProductForm 
                 key={editingId}
                 productId={editingId}
                 onSuccess={() => {
                     setEditingId(null);
                     refetch();
                 }} 
             />
            )}
        </DialogContent>
      </Dialog>

      <ProductGrid 
        data={products} 
        isLoading={status === 'pending'} 
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onEdit={(product: Product) => setEditingId(product.id)}
      />
    </div>
  );
}
