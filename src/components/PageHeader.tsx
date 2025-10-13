import Link from "next/link";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  actionButton?: ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  count,
  actionButton,
  gradientFrom = "from-green-50",
  gradientTo = "to-green-100/50",
}: PageHeaderProps) => {
  return (
    <div
      className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} px-6 sm:px-8 py-6 border-b border-green-200`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          {count !== undefined && (
            <p className="text-gray-600 mt-1">Total {count} item</p>
          )}
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>
    </div>
  );
};
