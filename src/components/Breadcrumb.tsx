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
      <nav className="flex items-center text-xs sm:text-sm text-gray-600 overflow-hidden">
        <div className="flex items-center space-x-1 min-w-0">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-1 flex-shrink-0 last:flex-shrink last:min-w-0">
              {index > 0 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center hover:text-green-600 transition-colors flex-shrink-0"
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              ) : (
                <span className="font-semibold text-gray-800 truncate">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};