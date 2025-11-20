"use server";

import { db } from "@/app/_db";
import { categoryTable } from "@/app/_db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  imageUrl: z.string().min(1, "Imagem é obrigatória"),
  slug: z.string().min(1, "Slug é obrigatório"),
});

export type State = {
  message: string;
  errors?: {
    [key: string]: string[];
  };
  success?: boolean;
};

export async function upsertCategory(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const parsed = categorySchema.safeParse({
    id,
    name,
    imageUrl,
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
        .update(categoryTable)
        .set({
          name,
          imageUrl,
          slug,
        })
        .where(eq(categoryTable.id, id));
    } else {
      await db.insert(categoryTable).values({
        name,
        imageUrl,
        slug,
      });
    }

    revalidatePath("/admin/categories");
    return { message: "Categoria salva com sucesso!", success: true };
  } catch (e) {
    console.error(e);
    return { message: "Erro ao salvar categoria." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categoryTable).where(eq(categoryTable.id, id));
    revalidatePath("/admin/categories");
    return { message: "Categoria deletada com sucesso!", success: true };
  } catch (e) {
    return { message: "Erro ao deletar categoria." };
  }
}
