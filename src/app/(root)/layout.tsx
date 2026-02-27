import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/shared";
import { NextAuthProvider } from "@/providers/next-auth-provider";

const nunito = Nunito({
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "TaskManager",
  description: "Created by DaDim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <NextAuthProvider>
          <main className="min-h-screen">
            <Header />
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
