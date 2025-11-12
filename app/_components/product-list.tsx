"use client";

import { productTable, productVariantTable } from "../_db/schema";

import ProductItem from "./product-item";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductList = ({ title, products }: ProductListProps) => {
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold md:px-11 md:text-xl">{title}</h3>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0 px-5 md:px-11">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-[200px] pl-4 md:basis-[300px]"
            >
              <ProductItem product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ProductList;
