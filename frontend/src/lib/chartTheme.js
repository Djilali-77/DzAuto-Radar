// Recharts needs real color values (not Tailwind classes), so we compute them per theme
export function getChartTheme(isDark) {
  return {
    grid: isDark ? "#475569" : "#cbd5e1",
    axis: isDark ? "#94a3b8" : "#64748b",
    text: isDark ? "#f8fafc" : "#0f172a",
    tooltip: {
      backgroundColor: isDark ? "#1e293b" : "#ffffff",
      border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
      borderRadius: "8px",
    },
  };
}