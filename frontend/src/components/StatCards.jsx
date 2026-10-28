import { Car, Flame, Tag } from "lucide-react";
import Card from "./ui/Card";
import { formatMillions } from "../lib/format";

// Full class names so Tailwind can detect them
const STYLES = {
  blue: { border: "border-t-blue-500", text: "text-blue-500", bg: "bg-blue-500/10" },
  emerald: { border: "border-t-emerald-500", text: "text-emerald-500", bg: "bg-emerald-500/10" },
  rose: { border: "border-t-rose-500", text: "text-rose-500", bg: "bg-rose-500/10" },
};

export default function StatCards({ stats }) {
  const items = [
    {
      label: "Total Listings",
      value: stats.total_cars.toLocaleString("en-US"),
      icon: Car,
      color: "blue",
    },
    {
      label: "Average Price",
      value: formatMillions(stats.average_price_millions),
      icon: Tag,
      color: "emerald",
    },
    {
      label: "Good Deals Found",
      value: stats.total_anomalies.toLocaleString("en-US"),
      icon: Flame,
      color: "rose",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map(({ label, value, icon: Icon, color }, index) => {
        const style = STYLES[color];
        return (
          <Card
            key={label}
            delay={index * 0.08}
            className={`flex items-center justify-between border-t-4 p-6 hover:shadow-md ${style.border}`}
          >
            <div>
              <h2 className={`text-sm font-bold uppercase tracking-wider ${style.text}`}>
                {label}
              </h2>
              <p className="mt-1 text-3xl font-black text-slate-800 dark:text-slate-100">
                {value}
              </p>
            </div>
            <div className={`rounded-xl p-3 ${style.bg}`}>
              <Icon className={style.text} size={32} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}