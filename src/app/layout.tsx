import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AuthProvider } from "../components/AuthProvider";
import CookieConsent from "../components/CookieConsent";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-gray-100">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
