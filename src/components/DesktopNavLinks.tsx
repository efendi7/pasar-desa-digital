import Link from "next/link";

interface DesktopNavLinksProps {
  pathname: string;
}

export default function DesktopNavLinks({ pathname }: DesktopNavLinksProps) {
  const isActive = (path: string) => pathname === path;

  return (
    <>
      <Link
        href="/"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
          ${
            isActive("/")
              ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30"
              : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
          }`}
      >
        Beranda
      </Link>

      <Link
        href="/products"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
          ${
            isActive("/products")
              ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30"
              : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
          }`}
      >
        Produk
      </Link>
    </>
  );
}
