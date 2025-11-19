"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import { Badge } from "@/app/_components/ui/badge";
import { formatCentsToBRL } from "@/app/_helpers/money";
import { Separator } from "@/app/_components/ui/separator";
import Image from "next/image";

interface OrderListProps {
  orders: {
    id: string;
    status: string;
    totalPriceInCents: number;
    createdAt: Date;
    user: { name: string };
    items: {
      priceInCents: number;
      quantity: number;
      productVariant: {
        imageUrl: string;
        product: { name: string };
      };
    }[];
  }[];
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {orders.map((order) => (
        <AccordionItem
          value={order.id}
          key={order.id}
          className="rounded-lg border bg-card px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="grid w-full grid-cols-2 gap-4 text-left md:grid-cols-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Número do Pedido
                </span>
                <span className="text-sm font-medium">
                  #{order.id.substring(0, 8).toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Status
                </span>
                <Badge
                  variant={order.status === "paid" ? "default" : "secondary"}
                  className="w-fit"
                >
                  {order.status === "paid"
                    ? "Pago"
                    : order.status === "pending"
                      ? "Pendente"
                      : order.status === "canceled"
                        ? "Cancelado"
                        : order.status}
                </Badge>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Data
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Total
                </span>
                <span className="text-sm font-medium">
                  {formatCentsToBRL(order.totalPriceInCents)}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Separator className="my-4" />
            <div className="space-y-6">
              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                      <Image
                        src={item.productVariant.imageUrl}
                        alt={item.productVariant.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="font-medium">
                        {item.productVariant.product.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Quantidade: {item.quantity}
                      </span>
                    </div>
                    <div className="font-medium">
                      {formatCentsToBRL(item.priceInCents * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCentsToBRL(order.totalPriceInCents)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Entrega</span>
                  <span>GRÁTIS</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Descontos</span>
                  <span>- R$ 0,00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatCentsToBRL(order.totalPriceInCents)}</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
