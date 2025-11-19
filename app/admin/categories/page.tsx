import { db } from "@/app/_db";
import { categoryTable } from "@/app/_db/schema";
import { desc } from "drizzle-orm";
import { CreateCategorySheet } from "./_components/create-category-sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";

export default async function CategoriesPage() {
  const categories = await db.query.categoryTable.findMany({
    with: {
      products: true,
    },
    orderBy: [desc(categoryTable.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <CreateCategorySheet />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={category.imageUrl as string}
                      alt={category.name}
                    />
                    <AvatarFallback>
                      {category.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.products.length}</TableCell>
                <TableCell className="text-right">
                  {/* Add Edit/Delete buttons here later */}
                  ...
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
