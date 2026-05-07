import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AustraleHub | Tableau de bord de formation",
  description: "Plateforme centralisée pour la gestion des formations professionnelles à La Réunion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Le Header, la Sidebar et les Providers de contexte (Auth, Fetch) viendront s'injecter ici */}
        <main className="flex h-screen overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}