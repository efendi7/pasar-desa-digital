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
  className?: string; // tambah ini
}


export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    // Tambahkan bg-transparent di sini untuk memastikan tidak ada background
    <div className="relative z-20 px-6 sm:px-8 py-3 bg-transparent">
      <nav className="flex items-center text-xs sm:text-sm text-muted-foreground overflow-hidden">
        <div className="flex items-center space-x-1 min-w-0">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-1 flex-shrink-0 last:flex-shrink last:min-w-0">
              {index > 0 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-ring flex-shrink-0" />}
              
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1 font-semibold text-foreground truncate">
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}