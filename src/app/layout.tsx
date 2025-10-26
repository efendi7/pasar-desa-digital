import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner"; // <-- tambahkan ini

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const mova = localFont({
  src: "./fonts/Mova.ttf",
  variable: "--font-mova",
  display: "swap",
});

const seagram = localFont({
  src: "./fonts/Seagram tfb.ttf",
  variable: "--font-seagram",
  display: "swap",
});

const madeTommy = localFont({
  src: "./fonts/MADE Tommy Soft Regular PERSONAL USE.otf",
  variable: "--font-made-tommy",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pasar Desa Digital",
  description: "Etalase Digital untuk Produk UMKM Desa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${mova.variable} ${seagram.variable} ${madeTommy.variable}`}
    >
      <body className="font-sans bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
        {children}
        <Toaster richColors position="top-right" /> {/* ✅ Tambahkan ini */}
      </body>
    </html>
  );
}
