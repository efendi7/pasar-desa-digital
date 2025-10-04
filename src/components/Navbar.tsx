// src/components/Navbar.tsx
import type { FC } from 'react'; // Impor tipe FunctionComponent
import Link from 'next/link';

// Menambahkan tipe 'FC' (FunctionComponent) ke komponen
const Navbar: FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Pasar Desa
          </Link>
          <div>
            <Link href="/login" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Login UMKM
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;