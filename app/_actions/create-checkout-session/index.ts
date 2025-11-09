"use server";

import { auth } from "@/app/_lib/auth";
import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
} from "./schema";
import { headers } from "next/headers";
import { db } from "@/app/_db";
import { eq } from "drizzle-orm";
import { orderItemTable, orderTable } from "@/app/_db/schema";
import Stripe from "stripe";

export const createCheckoutSession = async (
  data: CreateCheckoutSessionSchema,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    throw new Error("Usuário não autenticado");
  }

  const { orderId } = createCheckoutSessionSchema.parse(data);

  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  if (order.userId !== session.user.id) {
    throw new Error("Pedido não encontrado");
  }

  const orderItems = await db.query.orderItemTable.findMany({
    where: eq(orderItemTable.orderId, orderId),
    with: {
      productVariant: { with: { product: true } },
    },
  });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/confirmation`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      orderId,
    },
    line_items: orderItems.map((item) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: `${item.productVariant.product.name} - ${item.productVariant.name}`,
          description: item.productVariant.product.description,
          images: [item.productVariant.imageUrl],
        },
        unit_amount: item.productVariant.priceInCents,
      },
      quantity: item.quantity,
    })),
  });
  return checkoutSession;
};
