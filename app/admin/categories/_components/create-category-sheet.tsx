"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/app/_components/ui/sheet";
import { useActionState } from "react";
import { upsertCategory, State } from "../../_actions/category";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const initialState: State = {
  message: "",
  errors: {},
  success: false,
};

export function CreateCategorySheet() {
  const [state, formAction, isPending] = useActionState(
    upsertCategory,
    initialState,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Categoria
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicionar Categoria</SheetTitle>
          <SheetDescription>
            Crie uma nova categoria para sua loja.
          </SheetDescription>
        </SheetHeader>
        <form action={formAction} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nome da categoria"
              required
            />
            {state.errors?.name && (
              <p className="text-sm text-red-500">{state.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="https://..."
              required
            />
            {state.errors?.imageUrl && (
              <p className="text-sm text-red-500">{state.errors.imageUrl}</p>
            )}
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Categoria"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
