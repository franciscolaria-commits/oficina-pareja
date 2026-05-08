import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nuestra Oficina",
  description: "Espacio compartido",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        {/* Navbar persistente */}
        <nav className="bg-gray-800 p-4 shadow-md flex justify-center space-x-6 border-b border-gray-700">
          <Link href="/compartido" className="hover:text-blue-400 transition font-bold">Compartido</Link>
          <Link href="/fran" className="hover:text-blue-400 transition font-bold">Fran</Link>
          <Link href="/jooo" className="hover:text-blue-400 transition font-bold">jooo</Link>
        </nav>

        {/* Contenido principal */}
        <main className="p-6">
          {children}
        </main>
      </body>
    </html>
  );
}