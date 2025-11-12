"use client";

import {
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ShoppingBasketIcon,
  ShoppingCartIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { authClient } from "../_lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Cart } from "./cart";

interface HeaderProps {
  logoOnly?: boolean;
}

export const Header = ({ logoOnly = false }: HeaderProps) => {
  const { data: session } = authClient.useSession();

  if (logoOnly) {
    return (
      <header className="flex items-center justify-center p-5">
        <Link href="/">
          <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
        </Link>
      </header>
    );
  }

  return (
    <header className="relative flex items-center justify-between p-5 md:px-11">
      <div className="hidden md:block">
        {session?.user ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image as string | undefined}
                  />
                  <AvatarFallback>
                    {session?.user?.name?.split(" ")?.[0]?.[0]}
                    {session?.user?.name?.split(" ")?.[1]?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-semibold">
                    Olá, {session?.user?.name.split(" ")?.[0]}!
                  </h3>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold">Olá. Faça seu login!</h2>
            <Button size="icon" asChild variant="outline">
              <Link href="/auth">
                <LogInIcon />
              </Link>
            </Button>
          </div>
        )}
      </div>
      <Link className="md:hidden" href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>
      <Link
        className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
        href="/"
      >
        <Image src="/logo.svg" alt="BEWEAR" width={129} height={34} />
      </Link>
      <Link
        className="absolute left-1/2 hidden -translate-x-1/2 md:block lg:hidden"
        href="/"
      >
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>
      <div className="hidden md:flex">
        <Cart />
        {session?.user.id && (
          <Button
            variant="outline"
            className="ml-2 cursor-pointer"
            size={"icon"}
            onClick={() => authClient.signOut()}
          >
            <LogOutIcon />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {session?.user ? (
                <>
                  <div className="flex justify-between space-y-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{session?.user?.name}</h3>
                        <span className="text-muted-foreground block text-xs">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => authClient.signOut()}
                    >
                      <LogOutIcon />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button size="icon" asChild variant="outline">
                    <Link href="/auth">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <Cart />
      </div>
    </header>
  );
};
