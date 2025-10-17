import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DesktopNavLinks() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <>
      <Link
        href="/"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isActive('/')
            ? 'text-green-600 bg-green-50'
            : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
        }`}
      >
        Beranda
      </Link>
      <Link
        href="/products"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isActive('/products')
            ? 'text-green-600 bg-green-50'
            : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
        }`}
      >
        Produk
      </Link>
    </>
  );
}