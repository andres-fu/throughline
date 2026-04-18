export function formatDuration(months: number): string {
  if (months < 12) return `${months}mo`
  const years = Math.floor(months / 12)
  const remaining = months % 12
  return remaining === 0 ? `${years}y` : `${years}y ${remaining}mo`
}
