import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Import font lokal hanya untuk elemen tertentu
const mova = localFont({
  src: './fonts/Mova.ttf',
  variable: '--font-mova',
  display: 'swap',
});

// Font Seagram
const seagram = localFont({
  src: './fonts/Seagram tfb.ttf',
  variable: '--font-seagram',
  display: 'swap',
});

const madeTommy = localFont({
  src: './fonts/MADE Tommy Soft Regular PERSONAL USE.otf',
  variable: '--font-made-tommy',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pasar Desa Digital',
  description: 'Etalase Digital untuk Produk UMKM Desa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${mova.variable} ${madeTommy.variable}`}>

      <body className="font-sans bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">

        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
