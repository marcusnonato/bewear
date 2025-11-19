import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { DollarSign, ShoppingBag, Users } from "lucide-react";
import { db } from "@/app/_db";
import { orderTable, productTable } from "@/app/_db/schema";
import { count, eq, sum } from "drizzle-orm";

export default async function AdminDashboardPage() {
  const [productsCount] = await db
    .select({ count: count() })
    .from(productTable);

  const [ordersStats] = await db
    .select({
      totalRevenue: sum(orderTable.totalPriceInCents),
      totalSales: count(),
    })
    .from(orderTable)
    .where(eq(orderTable.status, "paid"));

  const totalRevenue = Number(ordersStats?.totalRevenue || 0) / 100;
  const totalSales = Number(ordersStats?.totalSales || 0);
  const activeProducts = Number(productsCount?.count || 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalRevenue)}
            </div>
            <p className="text-muted-foreground text-xs">
              Receita total de pedidos pagos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <ShoppingBag className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-muted-foreground text-xs">
              Total de pedidos pagos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Ativos
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-muted-foreground text-xs">
              Total de produtos cadastrados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
