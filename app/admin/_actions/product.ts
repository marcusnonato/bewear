"use server";

import { db } from "@/app/_db";
import { productTable, productVariantTable } from "@/app/_db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  slug: z.string().min(1, "Slug é obrigatório"),
});

export type State = {
  message: string;
  errors?: {
    [key: string]: string[];
  };
  success?: boolean;
};

export async function upsertProduct(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-"); // Simple slug generation

  const parsed = productSchema.safeParse({
    id,
    name,
    description,
    categoryId,
    slug,
  });

  if (!parsed.success) {
    return {
      message: "Dados inválidos",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    if (id) {
      await db
        .update(productTable)
        .set({
          name,
          description,
          categoryId,
          slug,
        })
        .where(eq(productTable.id, id));
    } else {
      await db.insert(productTable).values({
        name,
        description,
        categoryId,
        slug,
      });
    }

    revalidatePath("/admin/products");
    return { message: "Produto salvo com sucesso!", success: true };
  } catch (e) {
    console.error(e);
    return { message: "Erro ao salvar produto." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.delete(productTable).where(eq(productTable.id, id));
    revalidatePath("/admin/products");
    return { message: "Produto deletado com sucesso!", success: true };
  } catch (e) {
    return { message: "Erro ao deletar produto." };
  }
}
