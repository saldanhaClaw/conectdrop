import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DropConnect — Dropshipping Multi-Marketplace",
  description:
    "Conecte fornecedores qualificados com vendedores que querem vender online sem estoque. Mercado Livre, Shopee e Magalu em um só lugar.",
  keywords: "dropshipping, mercado livre, shopee, magalu, fornecedores, vendedores online",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased bg-background text-foreground">{children}</body>
    </html>
  );
}
