import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface BreadcrumbItem {
  href?: string;
  label: string;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="relative z-20 mt-16 sm:mt-20 bg-white px-6 sm:px-8 py-3">
      <nav className="flex items-center text-sm text-gray-600 space-x-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-1">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center hover:text-green-600 transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-800">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};
