import { useState } from 'react'
import { useBudget } from '../contexts/BudgetContext'
import { formatCurrency, getToday } from '../utils/formatters'

export default function SavingsGoal() {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useBudget()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [initial, setInitial] = useState('')
  const [addAmounts, setAddAmounts] = useState({})

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name || !target || Number(target) <= 0) return
    addSavingsGoal({
      name,
      target: Number(target),
      current: Number(initial) || 0,
      deadline: deadline || null,
    })
    setName('')
    setTarget('')
    setDeadline('')
    setInitial('')
    setShowForm(false)
  }

  const handleAddSavings = (id, current) => {
    const amt = Number(addAmounts[id])
    if (!amt || amt <= 0) return
    updateSavingsGoal(id, { current: current + amt })
    setAddAmounts(prev => ({ ...prev, [id]: '' }))
  }

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null
    const diff = new Date(deadline) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="tool-page">
      <div className="tool-card">
        <div className="tool-header-row">
          <h2 className="tool-title">💰 Savings Goals</h2>
          <button className="btn btn-primary btn-small" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Goal'}
          </button>
        </div>

        {showForm && (
          <form className="add-goal-form" onSubmit={handleAdd}>
            <div className="form-group">
              <label className="form-label">Goal Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Emergency Fund"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Target (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder="100000"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Already Saved (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={initial}
                  onChange={e => setInitial(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Target Date (optional)</label>
              <input
                type="date"
                className="form-input"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                min={getToday()}
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Goal</button>
          </form>
        )}
      </div>

      {savingsGoals.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎯</span>
          <p className="empty-text">No savings goals yet. Set one to start!</p>
        </div>
      ) : (
        <div className="goals-grid">
          {savingsGoals.map(goal => {
            const pct = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0
            const daysLeft = getDaysRemaining(goal.deadline)
            const completed = goal.current >= goal.target

            return (
              <div key={goal.id} className={`goal-card ${completed ? 'completed' : ''}`}>
                <div className="goal-header">
                  <h3 className="goal-name">{goal.name}</h3>
                  <button className="goal-delete" onClick={() => deleteSavingsGoal(goal.id)}>✕</button>
                </div>

                <div className="goal-progress-ring" style={{ '--pct': `${pct}%` }}>
                  <div className="goal-progress-text">
                    <span className="goal-pct">{Math.round(pct)}%</span>
                    {completed && <span className="goal-done">✓</span>}
                  </div>
                </div>

                <div className="goal-amounts">
                  <span>{formatCurrency(goal.current)}</span>
                  <span className="goal-of">of</span>
                  <span>{formatCurrency(goal.target)}</span>
                </div>

                {daysLeft !== null && (
                  <div className="goal-deadline">
                    {daysLeft === 0 ? 'Deadline today!' : `${daysLeft} days remaining`}
                  </div>
                )}

                {!completed && (
                  <div className="goal-add-form">
                    <input
                      type="number"
                      className="form-input"
                      placeholder="₹ Add savings"
                      value={addAmounts[goal.id] || ''}
                      onChange={e => setAddAmounts(prev => ({ ...prev, [goal.id]: e.target.value }))}
                      min="0"
                    />
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => handleAddSavings(goal.id, goal.current)}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
