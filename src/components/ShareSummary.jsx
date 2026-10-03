import { useState } from 'react'
import { useBudget } from '../contexts/BudgetContext'
import { formatCurrency, getCurrentMonth, formatMonth } from '../utils/formatters'

export default function ShareSummary() {
  const { getMonthlyTotal, getBalance } = useBudget()
  const [copied, setCopied] = useState(false)
  const month = getCurrentMonth()

  const income = getMonthlyTotal(month, 'income')
  const expenses = getMonthlyTotal(month, 'expense')
  const balance = getBalance(month)

  const shareText = `📊 My ${formatMonth(month)} Budget Summary
💰 Income: ${formatCurrency(income)}
💸 Expenses: ${formatCurrency(expenses)}
💵 Balance: ${formatCurrency(balance)}

Track your budget free at budget.doaide.com`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareText
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'DoAide Budget Summary', text: shareText })
      } catch { /* user cancelled */ }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="share-card">
      <h3>Share Your Summary</h3>
      <pre className="share-text">{shareText}</pre>
      <div className="share-actions">
        <button className="btn btn-secondary" onClick={handleCopy}>
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
        <button className="btn btn-primary" onClick={handleShare}>
          📤 Share
        </button>
      </div>
    </div>
  )
}
