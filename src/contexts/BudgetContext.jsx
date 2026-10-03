import { createContext, useContext, useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, getCurrentMonth } from '../utils/formatters'

const BudgetContext = createContext()

export function BudgetProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('doaide-transactions', [])
  const [budgets, setBudgets] = useLocalStorage('doaide-budgets', [])
  const [savingsGoals, setSavingsGoals] = useLocalStorage('doaide-savings-goals', [])

  const addTransaction = useCallback((txn) => {
    setTransactions(prev => [{ ...txn, id: generateId() }, ...prev])
  }, [setTransactions])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [setTransactions])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [setTransactions])

  const setBudget = useCallback((category, limit, month) => {
    setBudgets(prev => {
      const existing = prev.findIndex(b => b.category === category && b.month === month)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { ...updated[existing], limit }
        return updated
      }
      return [...prev, { id: generateId(), category, limit, month }]
    })
  }, [setBudgets])

  const deleteBudget = useCallback((id) => {
    setBudgets(prev => prev.filter(b => b.id !== id))
  }, [setBudgets])

  const addSavingsGoal = useCallback((goal) => {
    setSavingsGoals(prev => [...prev, { ...goal, id: generateId() }])
  }, [setSavingsGoals])

  const updateSavingsGoal = useCallback((id, updates) => {
    setSavingsGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
  }, [setSavingsGoals])

  const deleteSavingsGoal = useCallback((id) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id))
  }, [setSavingsGoals])

  const getMonthlyTransactions = useCallback((month) => {
    return transactions.filter(t => t.date.startsWith(month))
  }, [transactions])

  const getMonthlyTotal = useCallback((month, type) => {
    return transactions
      .filter(t => t.date.startsWith(month) && t.type === type)
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const getCategoryTotal = useCallback((category, month) => {
    return transactions
      .filter(t => t.date.startsWith(month) && t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const getBalance = useCallback((month) => {
    const income = getMonthlyTotal(month, 'income')
    const expense = getMonthlyTotal(month, 'expense')
    return income - expense
  }, [getMonthlyTotal])

  const value = useMemo(() => ({
    transactions,
    budgets,
    savingsGoals,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudget,
    deleteBudget,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    getMonthlyTransactions,
    getMonthlyTotal,
    getCategoryTotal,
    getBalance,
  }), [
    transactions, budgets, savingsGoals,
    addTransaction, updateTransaction, deleteTransaction,
    setBudget, deleteBudget,
    addSavingsGoal, updateSavingsGoal, deleteSavingsGoal,
    getMonthlyTransactions, getMonthlyTotal, getCategoryTotal, getBalance,
  ])

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  return useContext(BudgetContext)
}
