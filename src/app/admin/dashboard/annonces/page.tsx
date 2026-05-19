import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";
import Link from "next/link";

export default async function AdminAnnoncesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const admin = await prisma.admin.findUnique({ where: { email: session.user.email! } });
  if (!admin) redirect("/admin/login");

  const annonces = await prisma.annonce.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Gestion des annonces ({annonces.length})</h1>
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Titre</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Prix</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Utilisateur</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Date</th>
              <th className="text-right px-3 py-2 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {annonces.map(a => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 max-w-xs truncate">{a.titre}</td>
                <td className="px-3 py-2 whitespace-nowrap">{a.prix.toLocaleString()} DA</td>
                <td className="px-3 py-2 text-xs text-gray-500">{a.user?.name || a.user?.email || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">{new Date(a.createdAt).toLocaleDateString("fr-DZ")}</td>
                <td className="px-3 py-2 text-right">
                  <Link href={`/annonce/${a.id}`} className="text-primary-600 hover:underline text-xs mr-2">Voir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
