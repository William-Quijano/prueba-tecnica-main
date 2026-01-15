import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProducts } from "@/lib/services/products.service";
import ProductList from "@/components/product-list";
import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "@/components/language-toggle";
import { ModeToggle } from "@/components/mode-toggle";

interface HomeProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const queryClient = new QueryClient();
  const t = await getTranslations("General");

  //Se ha comentado para que funcionen los skeletos
  //de carga pero para mejor rendimiento se debe descomentar

  /* 
 
  const { search } = await searchParams;
  const searchTerm = search || '';

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['products', searchTerm],
    queryFn: ({ pageParam = 1 }) => getProducts(pageParam as number, 5, searchTerm),
    initialPageParam: 1,
  });
  */

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <div className="flex gap-2">
          <LanguageToggle />
          <ModeToggle />
        </div>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductList />
      </HydrationBoundary>
    </div>
  );
}
