import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const admin = await prisma.admin.findUnique({ where: { email: session.user.email! } });
  if (!admin) redirect("/admin/login");

  const stats = {
    annonces: await prisma.annonce.count(),
    users: await prisma.user.count(),
    favoris: await prisma.favori.count(),
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-3xl font-bold text-primary-600">{stats.annonces}</p>
          <p className="text-sm text-gray-500">Annonces</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
          <p className="text-sm text-gray-500">Utilisateurs</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-3xl font-bold text-green-600">{stats.favoris}</p>
          <p className="text-sm text-gray-500">Favoris</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Link href="/admin/dashboard/annonces" className="bg-primary-600 text-white px-4 py-2 rounded text-sm">Gérer les annonces</Link>
        <Link href="/admin/dashboard/utilisateurs" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Gérer les utilisateurs</Link>
      </div>
    </div>
  );
}
