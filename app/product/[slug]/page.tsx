import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import ProductList from "@/app/_components/product-list";
import { db } from "@/app/_db";
import { productTable, productVariantTable } from "../../_db/schema";
import { formatCentsToBRL } from "@/app/_helpers/money";

import ProductActions from "./_components/product-actions";
import VariantSelector from "./_components/variant-selector";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  if (!productVariant) {
    return notFound();
  }
  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });
  return (
    <>
      <Header />

      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 gap-6 px-5 md:mt-12 md:px-11 lg:grid-cols-2">
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <Image
              src={productVariant.imageUrl}
              alt={productVariant.name}
              sizes="100vw"
              height={0}
              width={0}
              className="h-auto w-full object-cover lg:mx-auto lg:max-h-[700px] lg:w-auto lg:max-w-[700px] lg:rounded-2xl"
            />
          </div>

          <div className="flex flex-col space-y-6">
            <div className="px-5 lg:px-0">
              <h2 className="text-lg font-semibold md:text-3xl">
                {productVariant.product.name}
              </h2>
              <h3 className="text-muted-foreground text-sm md:text-base">
                {productVariant.name}
              </h3>
              <h3 className="text-lg font-semibold md:text-xl">
                {formatCentsToBRL(productVariant.priceInCents)}
              </h3>
            </div>

            <div className="px-5 lg:px-0">
              <VariantSelector
                selectedVariantSlug={productVariant.slug}
                variants={productVariant.product.variants}
              />
            </div>

            <ProductActions productVariantId={productVariant.id} />

            <div className="px-5 lg:px-0">
              <p className="text-shadow-amber-600">
                {productVariant.product.description}
              </p>
            </div>
          </div>
        </div>

        <div className="md:mt-14">
          <ProductList
            title="Você também pode gostar"
            products={likelyProducts}
          />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ProductVariantPage;
