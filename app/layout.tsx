import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Dashboard de Impacto del Curso de IA 2025",
  description:
    "Resumen ejecutivo de adopción, percepción de valor, aplicación práctica y alineación estratégica."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="executive-bg font-sans">{children}</body>
    </html>
  );
}

