const currencyFormatters = {}

function getCurrencyFormatter(currency) {
  if (!currencyFormatters[currency]) {
    currencyFormatters[currency] = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }
  return currencyFormatters[currency]
}

export function formatCurrency(amount, currency = 'INR') {
  return getCurrencyFormatter(currency).format(amount)
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatMonth(dateStr) {
  const d = new Date(dateStr + '-01T00:00:00')
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export function getCurrentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function getToday() {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
