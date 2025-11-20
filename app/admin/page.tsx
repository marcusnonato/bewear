import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { DollarSign, ShoppingBag, Package, Layers } from "lucide-react";
import { db } from "@/app/_db";
import {
  categoryTable,
  orderItemTable,
  orderTable,
  productTable,
  productVariantTable,
} from "@/app/_db/schema";
import { count, desc, eq, sum, and, gte, sql } from "drizzle-orm";
import { Progress } from "@/app/_components/ui/progress";
import { Badge } from "@/app/_components/ui/badge";
import Image from "next/image";

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [productsCount] = await db
    .select({ count: count() })
    .from(productTable);

  const [categoriesCount] = await db
    .select({ count: count() })
    .from(categoryTable);

  const [ordersStats] = await db
    .select({
      totalRevenue: sum(orderTable.totalPriceInCents),
      totalOrders: count(),
    })
    .from(orderTable)
    .where(eq(orderTable.status, "paid"));

  const [todayRevenue] = await db
    .select({
      revenue: sum(orderTable.totalPriceInCents),
    })
    .from(orderTable)
    .where(
      and(eq(orderTable.status, "paid"), gte(orderTable.createdAt, today)),
    );

  const [itemsSold] = await db
    .select({
      totalSold: sum(orderItemTable.quantity),
    })
    .from(orderItemTable)
    .innerJoin(orderTable, eq(orderTable.id, orderItemTable.orderId))
    .where(eq(orderTable.status, "paid"));

  const bestSellingProducts = await db
    .select({
      productId: productTable.id,
      name: productTable.name,
      totalSold: sum(orderItemTable.quantity),
      price: productVariantTable.priceInCents,
      imageUrl: productVariantTable.imageUrl,
    })
    .from(orderItemTable)
    .innerJoin(
      productVariantTable,
      eq(productVariantTable.id, orderItemTable.productVariantId),
    )
    .innerJoin(productTable, eq(productTable.id, productVariantTable.productId))
    .innerJoin(orderTable, eq(orderTable.id, orderItemTable.orderId))
    .where(eq(orderTable.status, "paid"))
    .groupBy(
      productTable.id,
      productTable.name,
      productVariantTable.priceInCents,
      productVariantTable.imageUrl,
    )
    .orderBy(desc(sum(orderItemTable.quantity)))
    .limit(5);

  const bestSellingCategories = await db
    .select({
      categoryId: categoryTable.id,
      name: categoryTable.name,
      totalSold: sum(orderItemTable.quantity),
    })
    .from(orderItemTable)
    .innerJoin(
      productVariantTable,
      eq(productVariantTable.id, orderItemTable.productVariantId),
    )
    .innerJoin(productTable, eq(productTable.id, productVariantTable.productId))
    .innerJoin(categoryTable, eq(categoryTable.id, productTable.categoryId))
    .innerJoin(orderTable, eq(orderTable.id, orderItemTable.orderId))
    .where(eq(orderTable.status, "paid"))
    .groupBy(categoryTable.id, categoryTable.name)
    .orderBy(desc(sum(orderItemTable.quantity)))
    .limit(5);

  const totalRevenue = Number(ordersStats?.totalRevenue || 0) / 100;
  const revenueToday = Number(todayRevenue?.revenue || 0) / 100;
  const totalOrders = Number(ordersStats?.totalOrders || 0);
  const totalItemsSold = Number(itemsSold?.totalSold || 0);
  const activeProducts = Number(productsCount?.count || 0);
  const activeCategories = Number(categoriesCount?.count || 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(revenueToday)}
            </div>
            <p className="text-muted-foreground text-xs">
              Receita de pedidos pagos hoje
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Itens Vendidos
            </CardTitle>
            <ShoppingBag className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsSold}</div>
            <p className="text-muted-foreground text-xs">
              Total de itens vendidos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-muted-foreground text-xs">
              Total de pedidos pagos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Layers className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-muted-foreground text-xs">
              {activeCategories} categorias cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>
              Os produtos com maior volume de vendas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {bestSellingProducts.map((product, index) => (
                <div
                  key={`${product.productId}-${index}`}
                  className="flex items-center"
                >
                  <div className="relative mr-4 h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {product.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {Number(product.totalSold)} vendidos
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(product.price / 100)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Categorias Mais Vendidas</CardTitle>
            <CardDescription>
              Distribuição de vendas por categoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {bestSellingCategories.map((category) => {
                const percentage =
                  totalItemsSold > 0
                    ? Math.round(
                        (Number(category.totalSold) / totalItemsSold) * 100,
                      )
                    : 0;

                return (
                  <div key={category.categoryId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-muted-foreground">
                        {percentage}% ({Number(category.totalSold)})
                      </div>
                    </div>
                    <Progress value={percentage} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
