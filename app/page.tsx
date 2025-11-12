import Image from "next/image";
import { Header } from "./_components/header";
import { db } from "./_db";
import ProductList from "./_components/product-list";
import CategorySelector from "./_components/category-selector";
import { desc } from "drizzle-orm";
import { productTable } from "./_db/schema";
import Footer from "./_components/footer";
import CategorySelectorDesktop from "./_components/category-selector-desktop";
import { PartnerBands } from "./_components/partner-bands";

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const categories = await db.query.categoryTable.findMany({});

  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header />
      <div className="mt-4 hidden px-11 md:block">
        <CategorySelectorDesktop categories={categories} />
      </div>
      <div className="space-y-6">
        <div className="px-5 md:hidden">
          <Image
            src={"/banner-01.png"}
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
        <div className="hidden px-11 md:block">
          <Image
            src={"/banner-desktop-01.png"}
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto max-h-[800px] w-full rounded-3xl object-cover object-top"
          />
        </div>
        <div className="mb-16 md:mt-12">
          <PartnerBands />
        </div>

        <div className="md:mt-16">
          <ProductList products={products} title="Mais vendidos" />
        </div>

        <div className="px-5 md:hidden">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-5 md:hidden">
          <Image
            src={"/banner-02.png"}
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
        <div className="mt-32 hidden px-11 md:block">
          <Image
            src={"/banner-desktop-01.png"}
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto max-h-[800px] w-full rounded-3xl object-cover object-top"
          />
        </div>
        <div className="md:mt-16 md:mb-16">
          <ProductList products={newlyCreatedProducts} title="Novidades" />
        </div>
      </div>
      <Footer />
    </>
  );
}
