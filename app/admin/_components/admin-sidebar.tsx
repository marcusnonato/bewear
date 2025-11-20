"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { Button } from "@/app/_components/ui/button";
import Image from "next/image";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Produtos",
    icon: Package,
    href: "/admin/products",
  },
  {
    label: "Categorias",
    icon: ListOrdered,
    href: "/admin/categories",
  },
  {
    label: "Pedidos",
    icon: ShoppingBag,
    href: "/admin/orders",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-background flex h-full w-64 flex-col border-r">
      <Link href={"/"}>
        <Image
          width={130}
          height={33}
          className="mx-4 mt-4 object-contain"
          src={"/logo.svg"}
          alt="BEWARE"
        />
      </Link>
      <div className="flex-1 overflow-y-auto py-4 pt-10">
        <nav className="grid gap-3 px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          Sair da Loja
        </Button>
      </div>
    </div>
  );
}
