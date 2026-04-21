export interface ChipPos {
  label: string
  x: number
  y: number
  w: number
}

export function estimateChipWidth(label: string): number {
  return Math.ceil(label.length * 6.5 + 16)
}

export function layoutChips(
  labels: string[],
  startX: number,
  maxX: number,
  chipH = 16,
  hGap = 4,
  vGap = 4,
): { chips: ChipPos[]; totalHeight: number } {
  if (labels.length === 0) return { chips: [], totalHeight: 0 }

  const chips: ChipPos[] = []
  let x = startX
  let y = 0

  for (const label of labels) {
    const w = estimateChipWidth(label)
    if (x + w > maxX && x > startX) {
      y += chipH + vGap
      x = startX
    }
    chips.push({ label, x, y, w })
    x += w + hGap
  }

  return { chips, totalHeight: y + chipH }
}
