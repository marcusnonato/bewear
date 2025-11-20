import { AdminSidebar } from "./_components/admin-sidebar";
import { auth } from "@/app/_lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AdminSidebar />
      <main className="bg-muted/10 flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
