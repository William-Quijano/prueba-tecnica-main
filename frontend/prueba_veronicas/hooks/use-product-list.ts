import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getProducts } from '@/lib/services/products.service';
import { useTranslations } from 'next-intl';

export function useProductList() {
  const t = useTranslations('General');
  const tForm = useTranslations('ProductForm');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const search = searchParams.get('search') || '';
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: ['products', search],
    queryFn: ({ pageParam = 1 }) => getProducts(pageParam as number, 5, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
        return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return {
    t,
    tForm,
    search,
    handleSearch,
    isCreateOpen,
    setIsCreateOpen,
    editingId,
    setEditingId,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    products: data?.pages.flatMap((page) => page.data) || []
  };
}
