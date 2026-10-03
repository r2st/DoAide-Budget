import { useState, useMemo } from 'react'
import { useBudget } from '../contexts/BudgetContext'
import { formatCurrency, getCurrentMonth, formatMonth } from '../utils/formatters'
import { getCategoryInfo } from '../utils/categories'
import SpendingPieChart from '../components/SpendingPieChart'

function changeMonth(month, delta) {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function Dashboard() {
  const { getMonthlyTransactions, getMonthlyTotal, getBalance } = useBudget()
  const [month, setMonth] = useState(getCurrentMonth())

  const income = getMonthlyTotal(month, 'income')
  const expenses = getMonthlyTotal(month, 'expense')
  const balance = getBalance(month)
  const txns = getMonthlyTransactions(month)

  const pieData = useMemo(() => {
    const byCategory = {}
    txns.filter(t => t.type === 'expense').forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
    })
    return Object.entries(byCategory).map(([key, value]) => {
      const info = getCategoryInfo(key)
      return { name: info.name, value, color: info.color, emoji: info.emoji }
    }).sort((a, b) => b.value - a.value)
  }, [txns])

  const recentTxns = txns.slice(0, 5)

  return (
    <div className="dashboard">
      <div className="month-selector">
        <button className="month-nav-btn" onClick={() => setMonth(m => changeMonth(m, -1))}>‹</button>
        <span className="month-display">{formatMonth(month)}</span>
        <button className="month-nav-btn" onClick={() => setMonth(m => changeMonth(m, 1))}>›</button>
      </div>

      <div className="summary-grid">
        <div className="summary-card income">
          <span className="summary-icon">💰</span>
          <span className="summary-label">Income</span>
          <span className="summary-amount">{formatCurrency(income)}</span>
        </div>
        <div className="summary-card expense">
          <span className="summary-icon">💸</span>
          <span className="summary-label">Expenses</span>
          <span className="summary-amount">{formatCurrency(expenses)}</span>
        </div>
        <div className="summary-card balance">
          <span className="summary-icon">💵</span>
          <span className="summary-label">Balance</span>
          <span className="summary-amount">{formatCurrency(balance)}</span>
        </div>
        <div className="summary-card count">
          <span className="summary-icon">📋</span>
          <span className="summary-label">Transactions</span>
          <span className="summary-amount">{txns.length}</span>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Spending Breakdown</h2>
        <SpendingPieChart data={pieData} />
      </div>

      <div className="section">
        <h2 className="section-title">Recent Transactions</h2>
        {recentTxns.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <p className="empty-text">No transactions this month</p>
          </div>
        ) : (
          <div className="recent-list">
            {recentTxns.map(txn => {
              const info = getCategoryInfo(txn.category)
              return (
                <div key={txn.id} className="recent-item">
                  <div className="recent-category">
                    <span className="category-emoji">{info.emoji}</span>
                  </div>
                  <div className="recent-info">
                    <span className="recent-note">{txn.note || info.name}</span>
                    <span className="recent-date">{txn.date}</span>
                  </div>
                  <span className={`recent-amount ${txn.type}`}>
                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
