import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./ui/Card";
import { getChartTheme } from "../lib/chartTheme";
import { formatMillions, formatPercent } from "../lib/format";

// Custom tooltip: it uses Tailwind dark: classes, so it follows the theme by itself
function CarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const car = payload[0].payload;

  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-lg dark:border-slate-600 dark:bg-slate-800">
      <p className="font-semibold text-slate-800 dark:text-slate-100">{car.Title}</p>
      <p className="text-slate-500 dark:text-slate-400">
        {car.Year} · {formatMillions(car.Price_Millions)}
      </p>
      <p className="text-slate-500 dark:text-slate-400">
        Fair price: {formatMillions(car.Predicted_Price)}
      </p>
      {car.Anomaly === -1 && (
        <p className="font-medium text-emerald-600 dark:text-emerald-400">
          {formatPercent(car.Discount_Pct)} below fair price
        </p>
      )}
    </div>
  );
}

export default function PriceScatterChart({ cars, isDark }) {
  const theme = getChartTheme(isDark);
  const normalCars = cars.filter((car) => car.Anomaly !== -1);
  const dealCars = cars.filter((car) => car.Anomaly === -1);

  return (
    <Card delay={0.2} className="p-6 lg:col-span-2">
      <h2 className="mb-1 text-xl font-bold text-slate-800 dark:text-slate-100">
        Price Distribution by Year
      </h2>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Showing {cars.length} listings. Hover a dot to see the car.
      </p>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} opacity={0.5} />
            <XAxis
              dataKey="Year"
              type="number"
              name="Year"
              domain={["dataMin - 1", "dataMax + 1"]}
              allowDecimals={false}
              stroke={theme.axis}
            />
            <YAxis
              dataKey="Price_Millions"
              type="number"
              name="Price"
              unit="M"
              stroke={theme.axis}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CarTooltip />} />
            <Scatter name="Normal" data={normalCars} fill="#3b82f6" fillOpacity={0.6} />
            <Scatter name="Good deal" data={dealCars} fill="#f43f5e" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500" /> Normal price
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500" /> Good deal
        </span>
      </div>
    </Card>
  );
}