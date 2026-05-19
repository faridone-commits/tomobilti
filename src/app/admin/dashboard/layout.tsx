import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import Link from "next/link";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const admin = await prisma.admin.findUnique({ where: { email: session.user.email! } });
  if (!admin) redirect("/admin/login");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <span className="font-bold text-primary-600 text-sm">TOMOBILTI Admin</span>
        <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-primary-600">Dashboard</Link>
        <Link href="/admin/dashboard/annonces" className="text-sm text-gray-600 hover:text-primary-600">Annonces</Link>
        <Link href="/admin/dashboard/utilisateurs" className="text-sm text-gray-600 hover:text-primary-600">Utilisateurs</Link>
        <div className="flex-1" />
        <Link href="/" className="text-sm text-gray-500 hover:text-primary-600">Voir le site</Link>
      </nav>
      {children}
    </div>
  );
}
