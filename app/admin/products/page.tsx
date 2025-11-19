import { db } from "@/app/_db";
import { productTable, categoryTable } from "@/app/_db/schema";
import { desc, eq } from "drizzle-orm";
import { CreateProductSheet } from "./_components/create-product-sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";

export default async function ProductsPage() {
  const products = await db.query.productTable.findMany({
    with: {
      category: true,
      variants: true,
    },
    orderBy: [desc(productTable.createdAt)],
  });

  const categories = await db.query.categoryTable.findMany({
    orderBy: [desc(categoryTable.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <CreateProductSheet categories={categories} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Variantes</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {product.category?.name || "Sem Categoria"}
                  </Badge>
                </TableCell>
                <TableCell>{product.variants.length}</TableCell>
                <TableCell className="text-right">
                  {/* Add Edit/Delete buttons here later */}
                  ...
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
