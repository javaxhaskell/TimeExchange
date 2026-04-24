import type { Metadata } from "next";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "TimeExchange — Global Expertise Exchange",
  description:
    "Spot access and forward discovery for expert time across technology, finance, education, strategy, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
