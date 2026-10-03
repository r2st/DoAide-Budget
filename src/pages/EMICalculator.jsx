import { useState, useMemo } from 'react'

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n)

export default function EMICalculator() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [tenureVal, setTenureVal] = useState('')
  const [tenureUnit, setTenureUnit] = useState('years')

  const P = Number(principal) || 0
  const annualRate = Number(rate) || 0
  const months = tenureUnit === 'years' ? (Number(tenureVal) || 0) * 12 : (Number(tenureVal) || 0)

  const { emi, totalInterest, totalPayment, schedule } = useMemo(() => {
    if (P <= 0 || annualRate <= 0 || months <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0, schedule: [] }
    }

    const r = annualRate / 12 / 100
    const n = months
    const emiVal = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const totalPay = emiVal * n
    const totalInt = totalPay - P

    const sched = []
    let balance = P
    for (let i = 1; i <= n; i++) {
      const interest = balance * r
      const principalPart = emiVal - interest
      balance = Math.max(0, balance - principalPart)
      sched.push({
        month: i,
        emi: emiVal,
        principal: principalPart,
        interest,
        balance,
      })
    }

    return { emi: emiVal, totalInterest: totalInt, totalPayment: totalPay, schedule: sched }
  }, [P, annualRate, months])

  const principalPct = totalPayment > 0 ? (P / totalPayment * 100) : 50
  const interestPct = totalPayment > 0 ? (totalInterest / totalPayment * 100) : 50

  return (
    <div className="tool-page">
      <div className="tool-card">
        <h2 className="tool-title">🏦 EMI Calculator</h2>
        <p className="tool-desc">Calculate your monthly EMI for home, car, or personal loans</p>

        <div className="form-group">
          <label className="form-label">Loan Amount (₹)</label>
          <input
            type="number"
            className="form-input"
            value={principal}
            onChange={e => setPrincipal(e.target.value)}
            placeholder="e.g. 1000000"
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Interest Rate (% per annum)</label>
          <input
            type="number"
            className="form-input"
            value={rate}
            onChange={e => setRate(e.target.value)}
            placeholder="e.g. 8.5"
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Loan Tenure</label>
          <div className="tenure-row">
            <input
              type="number"
              className="form-input"
              value={tenureVal}
              onChange={e => setTenureVal(e.target.value)}
              placeholder={tenureUnit === 'years' ? 'e.g. 20' : 'e.g. 240'}
              min="1"
            />
            <div className="tenure-toggle">
              <button
                className={`tenure-btn ${tenureUnit === 'years' ? 'active' : ''}`}
                onClick={() => setTenureUnit('years')}
              >
                Years
              </button>
              <button
                className={`tenure-btn ${tenureUnit === 'months' ? 'active' : ''}`}
                onClick={() => setTenureUnit('months')}
              >
                Months
              </button>
            </div>
          </div>
        </div>
      </div>

      {emi > 0 && (
        <>
          <div className="tool-card emi-results">
            <div className="emi-result-grid">
              <div className="emi-result-card primary">
                <span className="emi-result-label">Monthly EMI</span>
                <span className="emi-result-value">{fmt(emi)}</span>
              </div>
              <div className="emi-result-card">
                <span className="emi-result-label">Total Interest</span>
                <span className="emi-result-value">{fmt(totalInterest)}</span>
              </div>
              <div className="emi-result-card">
                <span className="emi-result-label">Total Payment</span>
                <span className="emi-result-value">{fmt(totalPayment)}</span>
              </div>
            </div>

            <div className="emi-donut-wrapper">
              <div
                className="emi-donut"
                style={{
                  background: `conic-gradient(#58D68D 0% ${principalPct}%, #FF6B6B ${principalPct}% 100%)`
                }}
              >
                <div className="emi-donut-inner">
                  <span className="emi-donut-label">Total</span>
                  <span className="emi-donut-value">{fmt(totalPayment)}</span>
                </div>
              </div>
              <div className="emi-donut-legend">
                <span className="emi-legend-item"><span className="dot" style={{ background: '#58D68D' }} /> Principal ({Math.round(principalPct)}%)</span>
                <span className="emi-legend-item"><span className="dot" style={{ background: '#FF6B6B' }} /> Interest ({Math.round(interestPct)}%)</span>
              </div>
            </div>
          </div>

          <div className="tool-card">
            <h3>Amortization Schedule</h3>
            <div className="amortization-scroll">
              <table className="amortization-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>EMI</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.slice(0, 60).map(row => (
                    <tr key={row.month}>
                      <td>{row.month}</td>
                      <td>{fmt(row.emi)}</td>
                      <td>{fmt(row.principal)}</td>
                      <td>{fmt(row.interest)}</td>
                      <td>{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {schedule.length > 60 && (
                <p className="table-note">Showing first 60 of {schedule.length} months</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
