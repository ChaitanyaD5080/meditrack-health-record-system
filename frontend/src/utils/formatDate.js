const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Returns dates like "25-Jan-2026". Returns "—" for empty or invalid values.
export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (isNaN(date.getTime())) return '—'
  const day = String(date.getDate()).padStart(2, '0')
  return `${day}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`
}