import { inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import ProductList from "@/app/_components/product-list";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { db } from "@/app/_db";
import { productTable } from "@/app/_db/schema";
import { auth } from "@/app/_lib/auth";

import CartStepper from "../_components/cart-stepper";
import CartSummary from "../_components/cart-summary";
import { formatAddress } from "../_helpers/address";
import FinishOrderButton from "./components/finish-order-button";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }
  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }

  // Buscar produtos relacionados baseados nas categorias dos itens no carrinho
  const categoryIds = [
    ...new Set(
      cart.items.map((item) => item.productVariant.product.categoryId),
    ),
  ];
  const relatedProducts = await db.query.productTable.findMany({
    where: inArray(productTable.categoryId, categoryIds),
    with: {
      variants: true,
    },
    limit: 8,
  });

  return (
    <div>
      <Header />
      <CartStepper currentStep="confirmation" />
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 gap-6 px-5 md:px-11 lg:grid-cols-[1fr_400px]">
          <Card className="border-none shadow-none lg:border lg:shadow-sm">
            <CardHeader className="px-0 lg:px-6">
              <CardTitle>Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-0 lg:px-6">
              <Card className="transition-colors">
                <CardContent className="p-3 lg:p-4">
                  <p className="text-sm">
                    {formatAddress(cart.shippingAddress)}
                  </p>
                </CardContent>
              </Card>
              <FinishOrderButton />
            </CardContent>
          </Card>

          <div className="lg:sticky lg:top-6 lg:h-fit">
            <CartSummary
              subtotalInCents={cartTotalInCents}
              totalInCents={cartTotalInCents}
              products={cart.items.map((item) => ({
                id: item.productVariant.id,
                name: item.productVariant.product.name,
                variantName: item.productVariant.name,
                quantity: item.quantity,
                priceInCents: item.productVariant.priceInCents,
                imageUrl: item.productVariant.imageUrl,
              }))}
            />
          </div>
        </div>

        <div className="mt-12 hidden lg:block">
          <ProductList
            title="Você também pode gostar"
            products={relatedProducts}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ConfirmationPage;
