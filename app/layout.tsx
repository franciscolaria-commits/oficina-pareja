import type { Metadata } from "next";
// Importamos las nuevas fuentes tiernas
import { Lora, Quicksand } from "next/font/google";
import "./globals.css";
import Link from "next/link";

// Títulos elegantes de cuento
const storybookSerif = Lora({
  subsets: ["latin"],
  variable: '--font-storybook-serif',
  display: 'swap',
});

// Texto redondeado y tierno
const tiernoSans = Quicksand({
  subsets: ["latin"],
  variable: '--font-tierno-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nuestra Oficina | Un cuento de nosotros",
  description: "Espacio compartido lleno de ternura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Aplicamos las variables de fuente al HTML
    <html lang="es" translate="no" suppressHydrationWarning className={`${storybookSerif.variable} ${tiernoSans.variable}`}>
      {/* bg-stone-50 es el blanco crema suave */}
      <body className="bg-stone-50 text-stone-900 min-h-screen font-tierno-sans antialiased">
        {/* Navbar persistente Clara - Usamos un verde menta pastel suave para los bordes y links */}
        <nav className="bg-white p-4 shadow-sm flex justify-center space-x-6 border-b border-emerald-100 sticky top-0 z-50">
          <Link href="/compartido" className="text-emerald-800 hover:text-emerald-600 transition font-bold font-storybook-serif text-lg">Compartido</Link>
          <Link href="/fran" className="text-emerald-800 hover:text-emerald-600 transition font-medium">Fran</Link>
          {/* jooo como pediste en el menu */}
          <Link href="/jooo" className="text-emerald-800 hover:text-emerald-600 transition font-medium">jooo</Link>
        </nav>

        {/* Contenido principal p-6 es mucho espacio, lo reducimos para dar mas aire */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}