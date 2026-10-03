import { useState, useEffect } from 'react'

const STATIC_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.78,
  AUD: 0.018,
  CAD: 0.016,
  SGD: 0.016,
  AED: 0.044,
  SAR: 0.045,
}

const CURRENCY_NAMES = {
  INR: '🇮🇳 Indian Rupee',
  USD: '🇺🇸 US Dollar',
  EUR: '🇪🇺 Euro',
  GBP: '🇬🇧 British Pound',
  JPY: '🇯🇵 Japanese Yen',
  AUD: '🇦🇺 Australian Dollar',
  CAD: '🇨🇦 Canadian Dollar',
  SGD: '🇸🇬 Singapore Dollar',
  AED: '🇦🇪 UAE Dirham',
  SAR: '🇸🇦 Saudi Riyal',
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1000)
  const [from, setFrom] = useState('INR')
  const [to, setTo] = useState('USD')
  const [rates, setRates] = useState(STATIC_RATES)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('https://api.exchangerate-api.com/v4/latest/INR')
      .then(r => r.json())
      .then(data => {
        if (cancelled || !data.rates) return
        setRates(data.rates)
        setIsLive(true)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const convert = (amt, fromCur, toCur) => {
    if (fromCur === toCur) return amt
    const inINR = fromCur === 'INR' ? amt : amt / (rates[fromCur] || 1)
    return inINR * (rates[toCur] || 1)
  }

  const result = convert(Number(amount) || 0, from, to)
  const rateDisplay = convert(1, from, to)

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  const currencies = Object.keys(CURRENCY_NAMES)

  return (
    <div className="tool-page">
      <div className="tool-card">
        <h2 className="tool-title">💱 Currency Converter</h2>
        <span className={`rate-status ${isLive ? 'live' : 'offline'}`}>
          {isLive ? '● Live rates' : '○ Offline rates'}
        </span>

        <div className="converter-form">
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="0"
            />
          </div>

          <div className="converter-row">
            <div className="form-group">
              <label className="form-label">From</label>
              <select className="form-select" value={from} onChange={e => setFrom(e.target.value)}>
                {currencies.map(c => (
                  <option key={c} value={c}>{CURRENCY_NAMES[c]}</option>
                ))}
              </select>
            </div>

            <button className="swap-btn" onClick={swap} aria-label="Swap currencies">⇄</button>

            <div className="form-group">
              <label className="form-label">To</label>
              <select className="form-select" value={to} onChange={e => setTo(e.target.value)}>
                {currencies.map(c => (
                  <option key={c} value={c}>{CURRENCY_NAMES[c]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {(Number(amount) || 0) > 0 && (
        <div className="tool-card result-card">
          <div className="conversion-result">
            <span className="result-from">{Number(amount).toLocaleString('en-IN')} {from}</span>
            <span className="result-equals">=</span>
            <span className="result-amount">{result.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}</span>
          </div>
          <p className="result-rate">1 {from} = {rateDisplay.toFixed(4)} {to}</p>
        </div>
      )}

      <div className="tool-card">
        <h3>Popular Conversions</h3>
        <div className="quick-links">
          {[
            ['INR', 'USD'],
            ['INR', 'EUR'],
            ['INR', 'GBP'],
            ['USD', 'INR'],
            ['EUR', 'INR'],
            ['GBP', 'INR'],
          ].map(([f, t]) => (
            <button
              key={`${f}-${t}`}
              className="quick-link"
              onClick={() => { setFrom(f); setTo(t) }}
            >
              {f} → {t}: {convert(1, f, t).toFixed(4)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
