import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../utils/formatters'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value, payload: p } = payload[0]
  return (
    <div className="chart-tooltip">
      <span>{p.emoji} {name}</span>
      <strong>{formatCurrency(value)}</strong>
    </div>
  )
}

export default function SpendingPieChart({ data }) {
  const filtered = data.filter(d => d.value > 0)

  if (!filtered.length) {
    return (
      <div className="pie-empty">
        <span className="empty-icon">📊</span>
        <p>No expenses yet</p>
      </div>
    )
  }

  return (
    <div className="pie-chart-container">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={filtered}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
          >
            {filtered.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pie-legend">
        {filtered.map((item, i) => (
          <div key={i} className="pie-legend-item">
            <span className="pie-legend-dot" style={{ background: item.color }} />
            <span className="pie-legend-name">{item.emoji} {item.name}</span>
            <span className="pie-legend-value">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
