import { db } from "@/app/_db";
import Stripe from "stripe";
import { orderTable } from "@/app/_db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe secret key not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature") as string;
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const text = await req.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return new Response("Missing orderId in metadata", { status: 400 });
    }
    await db
      .update(orderTable)
      .set({ status: "paid" })
      .where(eq(orderTable.id, orderId));
  }

  return NextResponse.json({ received: true });
}
