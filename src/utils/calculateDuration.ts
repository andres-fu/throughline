export function calculateDuration(startDate: string, endDate: string | 'present'): number {
  const [startYear, startMonth] = startDate.split('-').map(Number)

  let endYear: number
  let endMonth: number

  if (endDate === 'present') {
    const now = new Date()
    endYear = now.getFullYear()
    endMonth = now.getMonth() + 1
  } else {
    ;[endYear, endMonth] = endDate.split('-').map(Number)
  }

  const months = (endYear - startYear) * 12 + (endMonth - startMonth)
  return Math.max(0, months)
}
