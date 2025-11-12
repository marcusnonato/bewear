"use client";

import { ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";
import { formatCentsToBRL } from "../_helpers/money";
import { useCart } from "../_hooks/queries/use-cart";

import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import CartItem from "./cart-item";

export const Cart = () => {
  const { data: cart } = useCart();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative cursor-pointer"
          size="icon"
        >
          {cart && cart.items.length > 0 && (
            <span className="bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-medium text-white">
              {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col px-5 pb-5">
          <div className="flex h-full max-h-full flex-col overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col gap-8">
                {cart?.items && cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productVariantId={item.productVariant.id}
                      productName={item.productVariant.product.name}
                      productVariantName={item.productVariant.name}
                      productVariantImageUrl={item.productVariant.imageUrl}
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
                      quantity={item.quantity}
                    />
                  ))
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                    <ShoppingBasketIcon className="text-muted-foreground/50 h-16 w-16" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        Seu carrinho está vazio
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Adicione produtos para começar suas compras
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {cart?.items && cart?.items.length > 0 && (
            <div className="flex flex-col gap-4">
              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Subtotal</p>
                <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Entrega</p>
                <p>GRÁTIS</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Total</p>
                <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Button className="mt-5 rounded-full" asChild>
                <Link href="/cart/identification">Finalizar compra</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// SERVER ACTION
