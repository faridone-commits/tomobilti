import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    return transporter.sendMail({ from: process.env.SMTP_FROM || "noreply@tomobilti.dz", to, subject, html });
  }
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  const info = await transporter.sendMail({ from: "no-reply@tomobilti.dz", to, subject, html });
  console.log("📧 Email preview URL:", nodemailer.getTestMessageUrl(info));
  return info;
}
