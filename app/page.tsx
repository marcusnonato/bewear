import Image from "next/image";
import { Header } from "./_components/header";
import { db } from "./_db";
import ProductList from "./_components/product-list";
import CategorySelector from "./_components/category-selector";
import { desc } from "drizzle-orm";
import { productTable } from "./_db/schema";
import Footer from "./_components/footer";

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
      <div className="space-y-6 px-5">
        <Image
          src={"/banner-01.png"}
          alt="Leve uma vida com estilo"
          height={0}
          width={0}
          sizes="100vw"
          className="h-auto w-full"
        />

        <ProductList products={products} title="Mais vendidos" />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <Image
          src={"/banner-02.png"}
          alt="Leve uma vida com estilo"
          height={0}
          width={0}
          sizes="100vw"
          className="h-auto w-full"
        />

        <ProductList products={newlyCreatedProducts} title="Novidades" />
      </div>
      <Footer />
    </>
  );
}
