import { Store, Package, Eye } from "lucide-react";
import { Stats } from "@/app/page";

interface StatsSectionProps {
  stats: Stats;
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  const statsData = [
    {
      icon: Store,
      value: stats.umkm,
      label: "UMKM Terdaftar",
      gradient: "from-blue-500 to-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Package,
      value: stats.products,
      label: "Produk Tersedia",
      gradient: "from-purple-500 to-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Eye,
      value: stats.views.toLocaleString("id-ID"),
      label: "Total Kunjungan",
      gradient: "from-green-500 to-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group animate-fade-up bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-border hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform`}
              >
                <Icon className={`h-8 w-8 ${stat.iconColor}`} />
              </div>
            </div>
            <div
              className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
            >
              {stat.value}+
            </div>
            <div className="text-muted-foreground text-lg">
              {stat.label}
            </div>
          </div>
        );
      })}
    </section>
  );
};
