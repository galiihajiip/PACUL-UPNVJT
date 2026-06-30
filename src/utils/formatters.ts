export function formatCO2(value: number): string {
  return `${value.toLocaleString("id-ID")} kg`;
}

export function formatXP(value: number): string {
  return `${value.toLocaleString("id-ID")} XP`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
