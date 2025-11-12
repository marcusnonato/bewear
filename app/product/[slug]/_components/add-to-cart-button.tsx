"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogInIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { authClient } from "@/app/_lib/auth-client";
import { addProductToCart } from "@/app/_actions/add-cart-product";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
}: AddToCartButtonProps) => {
  const { data: session } = authClient.useSession();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleAddToCart = () => {
    if (!session) {
      setLoginDialogOpen(true);
      return;
    }
    mutate();
  };

  return (
    <>
      <Button
        className="cursor-pointer rounded-full md:px-16 md:py-6"
        size="lg"
        variant="outline"
        disabled={isPending}
        onClick={handleAddToCart}
      >
        {isPending && <Loader2 className="animate-spin" />}
        Adicionar à sacola
      </Button>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <LogInIcon className="text-primary h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl">Login necessário</DialogTitle>
            <DialogDescription className="text-base">
              Para adicionar produtos à sacola, você precisa estar logado em sua
              conta.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-center">
            <Button className="rounded-full" size="lg" asChild>
              <Link href="/auth">Fazer login</Link>
            </Button>
            <Button
              className="rounded-full"
              variant="outline"
              size="lg"
              onClick={() => setLoginDialogOpen(false)}
            >
              Continuar navegando
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddToCartButton;
