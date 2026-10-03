import { useState, useMemo, useRef } from 'react'
import { useBudget } from '../contexts/BudgetContext'
import { formatCurrency, formatDate, getCurrentMonth, formatMonth } from '../utils/formatters'
import { getCategoryInfo, EXPENSE_CATEGORIES } from '../utils/categories'
import TransactionForm from '../components/TransactionForm'

function changeMonth(month, delta) {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function SwipeableCard({ txn, onDelete, onEdit }) {
  const [offset, setOffset] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const startX = useRef(0)

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX
    setSwiping(true)
  }
  const onTouchMove = (e) => {
    if (!swiping) return
    const dx = e.touches[0].clientX - startX.current
    setOffset(Math.min(0, Math.max(-100, dx)))
  }
  const onTouchEnd = () => {
    setSwiping(false)
    setOffset(offset < -50 ? -80 : 0)
  }

  const info = getCategoryInfo(txn.category)

  return (
    <div className="transaction-card">
      <div className="txn-delete-bg" onClick={() => onDelete(txn.id)}>
        🗑️ Delete
      </div>
      <div
        className="transaction-card-inner"
        style={{ transform: `translateX(${offset}px)`, transition: swiping ? 'none' : 'transform 0.2s' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => offset === 0 && onEdit(txn)}
      >
        <div className="txn-left">
          <span className="txn-category-dot" style={{ background: info.color }}>{info.emoji}</span>
          <div className="txn-info">
            <span className="txn-note">{txn.note || info.name}</span>
            <span className="txn-date">
              {formatDate(txn.date)}
              {txn.recurring && <span className="txn-recurring"> 🔄 {txn.recurring}</span>}
            </span>
          </div>
        </div>
        <span className={`txn-amount ${txn.type}`}>
          {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
        </span>
      </div>
    </div>
  )
}

export default function Transactions() {
  const { transactions, deleteTransaction } = useBudget()
  const [month, setMonth] = useState(getCurrentMonth())
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [editTxn, setEditTxn] = useState(null)

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (!t.date.startsWith(month)) return false
      if (search && !(t.note || '').toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      return true
    })
  }, [transactions, month, search, categoryFilter, typeFilter])

  return (
    <div className="transactions-page">
      <div className="month-selector">
        <button className="month-nav-btn" onClick={() => setMonth(m => changeMonth(m, -1))}>‹</button>
        <span className="month-display">{formatMonth(month)}</span>
        <button className="month-nav-btn" onClick={() => setMonth(m => changeMonth(m, 1))}>›</button>
      </div>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-row">
          <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="income">💵 Income</option>
            {EXPENSE_CATEGORIES.map(key => {
              const info = getCategoryInfo(key)
              return <option key={key} value={key}>{info.emoji} {info.name}</option>
            })}
          </select>
          <div className="filter-tabs">
            {['all', 'income', 'expense'].map(t => (
              <button
                key={t}
                className={`filter-tab ${typeFilter === t ? 'active' : ''}`}
                onClick={() => setTypeFilter(t)}
              >
                {t === 'all' ? 'All' : t === 'income' ? 'Income' : 'Expense'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p className="empty-text">No transactions found</p>
        </div>
      ) : (
        <div className="transaction-list">
          {filtered.map(txn => (
            <SwipeableCard
              key={txn.id}
              txn={txn}
              onDelete={deleteTransaction}
              onEdit={setEditTxn}
            />
          ))}
        </div>
      )}

      {editTxn && (
        <TransactionForm
          editTransaction={editTxn}
          onClose={() => setEditTxn(null)}
        />
      )}
    </div>
  )
}
