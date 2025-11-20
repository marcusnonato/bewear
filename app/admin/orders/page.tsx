import { db } from "@/app/_db";
import { orderTable } from "@/app/_db/schema";
import { desc } from "drizzle-orm";
import { OrderList } from "./_components/order-list";

export default async function OrdersPage() {
  const orders = await db.query.orderTable.findMany({
    with: {
      user: true,
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
    orderBy: [desc(orderTable.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedidos</h1>
      </div>

      <div className="rounded-md">
        {orders.length > 0 ? (
          <OrderList orders={orders} />
        ) : (
          <div className="text-muted-foreground flex h-24 items-center justify-center rounded-md border">
            Nenhum pedido encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
