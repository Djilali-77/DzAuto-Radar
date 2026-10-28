// Prices are stored in "millions" (1 million = 10,000 DA)
export function formatMillions(value) {
  if (value === null || value === undefined) return "—";
  return `${Number(value).toLocaleString("en-US", { maximumFractionDigits: 1 })} M`;
}

export function formatDinars(millions) {
  if (millions === null || millions === undefined) return "—";
  return `${Math.round(millions * 10000).toLocaleString("fr-FR")} DA`;
}

export function formatPercent(value) {
  if (value === null || value === undefined) return "—";
  return `${Number(value).toFixed(0)}%`;
}