import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";

export default async function AdminUtilisateursPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const admin = await prisma.admin.findUnique({ where: { email: session.user.email! } });
  if (!admin) redirect("/admin/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { annonces: true, favoris: true } } },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Utilisateurs ({users.length})</h1>
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Nom</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Email</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Annonces</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Favoris</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Inscrit</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2">{u.name || "—"}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{u.email || "—"}</td>
                <td className="px-3 py-2">{u._count.annonces}</td>
                <td className="px-3 py-2">{u._count.favoris}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString("fr-DZ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
