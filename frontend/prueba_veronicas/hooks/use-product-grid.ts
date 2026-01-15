import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { deleteProductAction } from "@/actions/products.actions";

interface UseProductGridProps {
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export function useProductGrid({ hasNextPage, fetchNextPage }: UseProductGridProps) {
  const t = useTranslations("General");
  const tGrid = useTranslations("ProductGrid");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteProductAction(deleteId);
    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteId(null);
    } else {
      toast.error(result.message);
    }
  };

  return {
    t,
    tGrid,
    deleteId,
    setDeleteId,
    handleDelete,
    ref,
  };
}
