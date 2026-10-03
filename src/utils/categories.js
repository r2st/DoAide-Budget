export const CATEGORIES = {
  food: { name: 'Food', emoji: '🍔', color: '#FF6B6B' },
  transport: { name: 'Transport', emoji: '🚗', color: '#4ECDC4' },
  shopping: { name: 'Shopping', emoji: '🛍️', color: '#45B7D1' },
  bills: { name: 'Bills', emoji: '📄', color: '#96CEB4' },
  entertainment: { name: 'Entertainment', emoji: '🎬', color: '#FF8C42' },
  health: { name: 'Health', emoji: '💊', color: '#DDA0DD' },
  education: { name: 'Education', emoji: '📚', color: '#98D8C8' },
  rent: { name: 'Rent', emoji: '🏠', color: '#F7DC6F' },
  emi: { name: 'EMI', emoji: '🏦', color: '#BB8FCE' },
  savings: { name: 'Savings', emoji: '💰', color: '#82E0AA' },
  investment: { name: 'Investment', emoji: '📈', color: '#85C1E9' },
  other: { name: 'Other', emoji: '📌', color: '#AEB6BF' },
}

export const INCOME_CATEGORY = { name: 'Income', emoji: '💵', color: '#58D68D' }

export function getCategoryInfo(key) {
  if (key === 'income') return INCOME_CATEGORY
  return CATEGORIES[key] || CATEGORIES.other
}

export const EXPENSE_CATEGORIES = Object.keys(CATEGORIES)
