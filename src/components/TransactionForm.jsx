import { useState } from 'react'
import { useBudget } from '../contexts/BudgetContext'
import { CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories'
import { getToday } from '../utils/formatters'

export default function TransactionForm({ onClose, editTransaction }) {
  const { addTransaction, updateTransaction } = useBudget()
  const [type, setType] = useState(editTransaction?.type || 'expense')
  const [amount, setAmount] = useState(editTransaction?.amount || '')
  const [category, setCategory] = useState(editTransaction?.category || 'food')
  const [date, setDate] = useState(editTransaction?.date || getToday())
  const [note, setNote] = useState(editTransaction?.note || '')
  const [recurring, setRecurring] = useState(editTransaction?.recurring || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return

    const txn = {
      type,
      amount: Number(amount),
      category: type === 'income' ? 'income' : category,
      date,
      note,
      recurring: recurring || null,
    }

    if (editTransaction) {
      updateTransaction(editTransaction.id, txn)
    } else {
      addTransaction(txn)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="type-toggle">
            <button
              type="button"
              className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setType('expense')}
            >
              💸 Expense
            </button>
            <button
              type="button"
              className={`type-btn ${type === 'income' ? 'active income' : ''}`}
              onClick={() => setType('income')}
            >
              💵 Income
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input amount-input"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              autoFocus
              required
            />
          </div>

          {type === 'expense' && (
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                {EXPENSE_CATEGORIES.map(key => (
                  <option key={key} value={key}>
                    {CATEGORIES[key].emoji} {CATEGORIES[key].name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Recurring</label>
              <select className="form-select" value={recurring} onChange={e => setRecurring(e.target.value)}>
                <option value="">None</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Note</label>
            <input
              type="text"
              className="form-input"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="What was this for?"
              maxLength={100}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editTransaction ? 'Update' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
