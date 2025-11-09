"use client";

import { Header } from "@/app/_components/header";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import Image from "next/image";
import Link from "next/link";

function CancelPage() {
  return (
    <>
      <Header />
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <Image
            src="/illustration.svg"
            alt="Success"
            width={300}
            height={300}
            className="mx-auto"
          />
          <DialogTitle className="mt-4 text-2xl">Pedido cancelado!</DialogTitle>
          <DialogDescription className="font-medium">
            Opa! Parece que você cancelou seu pedido. Se mudou de ideia,
            sinta-se à vontade para continuar navegando em nossa loja e explorar
            nossos produtos incríveis.
          </DialogDescription>

          <DialogFooter>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/my-orders">Ver meus pedidos</Link>
            </Button>
            <Button
              className="rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CancelPage;
