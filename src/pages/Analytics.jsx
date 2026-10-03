import { useState, useMemo } from 'react'
import { useBudget } from '../contexts/BudgetContext'
import { formatCurrency, getCurrentMonth } from '../utils/formatters'
import { getCategoryInfo } from '../utils/categories'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

function changeMonth(month, delta) {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { transactions } = useBudget()
  const [month, setMonth] = useState(getCurrentMonth())
  const [view, setView] = useState('daily')

  const dailyData = useMemo(() => {
    const [y, m] = month.split('-').map(Number)
    const daysInMonth = new Date(y, m, 0).getDate()
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = String(i + 1).padStart(2, '0')
      const dateStr = `${month}-${day}`
      const dayTxns = transactions.filter(t => t.date === dateStr)
      return {
        label: `${i + 1}`,
        expenses: dayTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        income: dayTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      }
    })
    return days
  }, [transactions, month])

  const monthlyTrend = useMemo(() => {
    const months = []
    let m = month
    for (let i = 5; i >= 0; i--) {
      const target = changeMonth(month, -i)
      const mTxns = transactions.filter(t => t.date.startsWith(target))
      const [, mo] = target.split('-')
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      months.push({
        label: monthNames[Number(mo) - 1],
        income: mTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expenses: mTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      })
    }
    return months
  }, [transactions, month])

  const categoryBreakdown = useMemo(() => {
    const mTxns = transactions.filter(t => t.date.startsWith(month) && t.type === 'expense')
    const total = mTxns.reduce((s, t) => s + t.amount, 0)
    const byCategory = {}
    mTxns.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
    })
    return Object.entries(byCategory)
      .map(([key, value]) => {
        const info = getCategoryInfo(key)
        return { key, name: info.name, emoji: info.emoji, color: info.color, value, pct: total > 0 ? (value / total * 100) : 0 }
      })
      .sort((a, b) => b.value - a.value)
  }, [transactions, month])

  const formatMonthDisplay = (m) => {
    const d = new Date(m + '-01T00:00:00')
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="analytics">
      <div className="month-selector">
        <button className="month-nav-btn" onClick={() => setMonth(m => changeMonth(m, -1))}>‹</button>
        <span className="month-display">{formatMonthDisplay(month)}</span>
        <button className="month-nav-btn" onClick={() => setMonth(m => changeMonth(m, 1))}>›</button>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <h3>Daily Spending</h3>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="expenses" fill="#FF6B6B" radius={[4, 4, 0, 0]} name="Expenses" />
              <Bar dataKey="income" fill="#58D68D" radius={[4, 4, 0, 0]} name="Income" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-section">
        <h3>6-Month Trend</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#58D68D" strokeWidth={2} dot={{ r: 4 }} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 4 }} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-section">
        <h3>Category Breakdown</h3>
        {categoryBreakdown.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📊</span>
            <p className="empty-text">No expenses this month</p>
          </div>
        ) : (
          <div className="category-bars">
            {categoryBreakdown.map(cat => (
              <div key={cat.key} className="category-bar-item">
                <div className="category-bar-label">
                  <span>{cat.emoji} {cat.name}</span>
                  <span className="category-bar-amount">{formatCurrency(cat.value)}</span>
                </div>
                <div className="category-bar-track">
                  <div
                    className="category-bar-fill"
                    style={{ width: `${cat.pct}%`, background: cat.color }}
                  />
                </div>
                <span className="category-bar-pct">{Math.round(cat.pct)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
