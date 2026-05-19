import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Aucun compte avec cet email" }, { status: 404 });
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: new Date(Date.now() + 3600000) },
    });
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;
    await sendEmail(email, "Réinitialisation de mot de passe - Tomobilti", `
      <p>Bonjour,</p>
      <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
      <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Réinitialiser le mot de passe</a>
      <p>Ce lien expire dans 1 heure.</p>
    `);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
