export function getFirstName(fullName: string | undefined | null): string {
  const trimmed = fullName?.trim();
  if (!trimmed) return "Kamu";
  return trimmed.split(/\s+/)[0];
}

export function makeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

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
