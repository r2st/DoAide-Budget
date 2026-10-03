import { useState } from 'react'
import { useBudget } from '../contexts/BudgetContext'
import { formatCurrency, getCurrentMonth, formatMonth } from '../utils/formatters'
import { EXPENSE_CATEGORIES, getCategoryInfo } from '../utils/categories'

function changeMonth(month, delta) {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function Budget() {
  const { budgets, setBudget, deleteBudget, getCategoryTotal } = useBudget()
  const [month, setMonth] = useState(getCurrentMonth())
  const [newCategory, setNewCategory] = useState('food')
  const [newLimit, setNewLimit] = useState('')

  const monthBudgets = budgets.filter(b => b.month === month)
  const budgetedCategories = new Set(monthBudgets.map(b => b.category))
  const unbudgeted = EXPENSE_CATEGORIES.filter(c => !budgetedCategories.has(c))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newLimit || Number(newLimit) <= 0) return
    setBudget(newCategory, Number(newLimit), month)
    setNewLimit('')
  }

  return (
    <div className="budget-page">
      <div className="month-selector">
        <button className="month-nav-btn" onClick={() => setMonth(m => changeMonth(m, -1))}>‹</button>
        <span className="month-display">{formatMonth(month)}</span>
        <button className="month-nav-btn" onClick={() => setMonth(m => changeMonth(m, 1))}>›</button>
      </div>

      <form className="budget-form" onSubmit={handleAdd}>
        <h3>Set Budget</h3>
        <div className="budget-form-row">
          <select className="form-select" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
            {EXPENSE_CATEGORIES.map(key => {
              const info = getCategoryInfo(key)
              return <option key={key} value={key}>{info.emoji} {info.name}</option>
            })}
          </select>
          <input
            type="number"
            className="form-input"
            placeholder="₹ Limit"
            value={newLimit}
            onChange={e => setNewLimit(e.target.value)}
            min="0"
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </div>
      </form>

      <div className="budget-list">
        {monthBudgets.map(b => {
          const info = getCategoryInfo(b.category)
          const spent = getCategoryTotal(b.category, month)
          const pct = b.limit > 0 ? Math.min((spent / b.limit) * 100, 100) : 0
          const over = spent > b.limit

          return (
            <div key={b.id} className={`budget-item ${over ? 'over-budget' : ''}`}>
              <div className="budget-item-header">
                <div className="budget-item-info">
                  <span className="budget-category">
                    {info.emoji} {info.name}
                  </span>
                  <span className="budget-amounts">
                    {formatCurrency(spent)} / {formatCurrency(b.limit)}
                  </span>
                </div>
                <button className="budget-delete" onClick={() => deleteBudget(b.id)}>✕</button>
              </div>
              <div className="budget-progress">
                <div className="budget-progress-bar">
                  <div
                    className={`budget-progress-fill ${over ? 'over' : ''}`}
                    style={{ width: `${pct}%`, background: over ? '#FF6B6B' : info.color }}
                  />
                </div>
                <span className={`budget-percentage ${over ? 'over' : ''}`}>
                  {Math.round(spent / b.limit * 100)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {monthBudgets.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🎯</span>
          <p className="empty-text">No budgets set for this month</p>
        </div>
      )}

      {unbudgeted.length > 0 && monthBudgets.length > 0 && (
        <div className="unbudgeted-section">
          <h3>Unbudgeted Categories</h3>
          <div className="unbudgeted-list">
            {unbudgeted.map(key => {
              const info = getCategoryInfo(key)
              const spent = getCategoryTotal(key, month)
              return (
                <div key={key} className="unbudgeted-item">
                  <span>{info.emoji} {info.name}</span>
                  <span className="unbudgeted-spent">{formatCurrency(spent)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
