import { Activity } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./ui/Card";
import SectionTitle from "./ui/SectionTitle";
import { getChartTheme } from "../lib/chartTheme";

export default function PriceTrendChart({ history, isDark }) {
  const theme = getChartTheme(isDark);

  return (
    <Card delay={0.1} className="p-6">
      <SectionTitle icon={Activity} accent="purple" title="Market Price Trend" />

      {history.length < 2 && (
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Only one data point so far. Run the pipeline on different days to see the trend.
        </p>
      )}

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} opacity={0.5} />
            <XAxis dataKey="Date" stroke={theme.axis} tick={{ fontSize: 12 }} />
            <YAxis
              domain={["auto", "auto"]}
              stroke={theme.axis}
              unit="M"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={theme.tooltip}
              itemStyle={{ color: theme.text }}
              labelStyle={{ color: theme.text }}
            />
            <Line
              type="monotone"
              dataKey="Average_Price"
              name="Avg price (M)"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ r: 5, fill: "#a855f7" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}