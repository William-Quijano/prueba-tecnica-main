"use client";

import { useProductGrid } from "@/hooks/use-product-grid";
import { ProductSkeleton } from "@/components/skeletons/product-skeleton";
import { Product } from "@/lib/types/product";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ProductGridProps {
  data: Product[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onEdit: (product: Product) => void;
}

export function ProductGrid({
  data,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onEdit,
}: ProductGridProps) {
  const {
    t,
    tGrid,
    deleteId,
    setDeleteId,
    handleDelete,
    ref,
  } = useProductGrid({ hasNextPage, fetchNextPage });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_: unknown, i: number) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      {data.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          {tGrid("noProducts")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((product: Product, index: number) => (
            <Card
              key={product.id}
              className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={
                    product.image ||
                    `https://picsum.photos/seed/${product.id}/400/300`
                  }
                  alt={product.name}
                  width={400}
                  height={300}
                  priority={index < 2}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="p-4">
                <div className="h-7 flex items-center">
                  <CardTitle
                    className="text-lg truncate w-full"
                    title={product.name}
                  >
                    {product.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-2 overflow-hidden">
                  {product.description}
                </p>
                <div className="flex justify-between items-center font-medium mb-2">
                  <span className="text-lg">${product.price.toFixed(2)}</span>
                  <Badge variant="secondary" className="truncate">
                    {product.category}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" /> {t("edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteId(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={`skeleton-${i}`} />
            ))}

          {(hasNextPage || isFetchingNextPage) && (
            <div ref={ref} className="col-span-full h-1 w-full" />
          )}
        </div>
      )}

      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tGrid("deleteTitle")}</DialogTitle>
            <DialogDescription>{tGrid("deleteDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
