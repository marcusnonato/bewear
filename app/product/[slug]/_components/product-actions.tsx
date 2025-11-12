"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/app/_components/ui/button";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <>
      <div className="px-5 lg:px-0">
        <div className="space-y-4">
          <h3 className="font-medium">Quantidade</h3>
          <div className="flex w-[100px] items-center justify-between rounded-lg border">
            <Button size="icon" variant="ghost" onClick={handleDecrement}>
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button size="icon" variant="ghost" onClick={handleIncrement}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 px-5 lg:flex-row lg:space-y-0 lg:space-x-4 lg:px-0">
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
        />
        <Button
          className="cursor-pointer rounded-full md:px-16 md:py-6"
          size="lg"
        >
          Comprar agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
