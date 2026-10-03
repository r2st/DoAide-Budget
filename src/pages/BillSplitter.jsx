import { useState } from 'react'

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n)

const TIP_OPTIONS = [0, 5, 10, 15, 20]

export default function BillSplitter() {
  const [total, setTotal] = useState('')
  const [people, setPeople] = useState(2)
  const [tipPct, setTipPct] = useState(0)
  const [copied, setCopied] = useState(false)

  const billAmount = Number(total) || 0
  const tipAmount = billAmount * tipPct / 100
  const totalWithTip = billAmount + tipAmount
  const perPerson = people > 0 ? totalWithTip / people : 0
  const tipPerPerson = people > 0 ? tipAmount / people : 0

  const handleShare = async () => {
    const text = `Bill: ${fmt(billAmount)} | People: ${people} | Tip: ${tipPct}% | Each pays: ${fmt(perPerson)} — Split with DoAide Budget at budget.doaide.com`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="tool-page">
      <div className="tool-card">
        <h2 className="tool-title">🍕 Split Bills</h2>
        <p className="tool-desc">Split any bill quickly among friends</p>

        <div className="form-group">
          <label className="form-label">Bill Amount (₹)</label>
          <input
            type="number"
            className="form-input"
            value={total}
            onChange={e => setTotal(e.target.value)}
            placeholder="0"
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Number of People</label>
          <div className="stepper">
            <button className="stepper-btn" onClick={() => setPeople(p => Math.max(1, p - 1))}>−</button>
            <span className="stepper-value">{people}</span>
            <button className="stepper-btn" onClick={() => setPeople(p => p + 1)}>+</button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tip: {tipPct}%</label>
          <div className="tip-buttons">
            {TIP_OPTIONS.map(t => (
              <button
                key={t}
                className={`tip-btn ${tipPct === t ? 'active' : ''}`}
                onClick={() => setTipPct(t)}
              >
                {t}%
              </button>
            ))}
          </div>
          <input
            type="range"
            className="tip-slider"
            min="0"
            max="50"
            value={tipPct}
            onChange={e => setTipPct(Number(e.target.value))}
          />
        </div>
      </div>

      {billAmount > 0 && (
        <div className="tool-card result-card">
          <div className="result-row">
            <span className="result-label">Bill Amount</span>
            <span className="result-value">{fmt(billAmount)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Tip ({tipPct}%)</span>
            <span className="result-value">{fmt(tipAmount)}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Total with Tip</span>
            <span className="result-value">{fmt(totalWithTip)}</span>
          </div>
          <div className="result-divider" />
          <div className="result-row highlight">
            <span className="result-label">Each Person Pays</span>
            <span className="result-value result-highlight">{fmt(perPerson)}</span>
          </div>
          {tipPct > 0 && (
            <div className="result-row">
              <span className="result-label">Tip per Person</span>
              <span className="result-value">{fmt(tipPerPerson)}</span>
            </div>
          )}
          <button className="btn btn-primary share-btn" onClick={handleShare}>
            {copied ? '✓ Copied!' : '📋 Copy & Share'}
          </button>
        </div>
      )}
    </div>
  )
}
