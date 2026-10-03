import { useState } from 'react'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import FloatingActionButton from './components/Layout/FloatingActionButton'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Analytics from './pages/Analytics'
import BillSplitter from './pages/BillSplitter'
import EMICalculator from './pages/EMICalculator'
import SavingsGoal from './pages/SavingsGoal'
import CurrencyConverter from './pages/CurrencyConverter'
import ExportData from './pages/ExportData'
import TransactionForm from './components/TransactionForm'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'transactions', label: 'Transactions', icon: '💳' },
  { key: 'budget', label: 'Budget', icon: '🎯' },
  { key: 'analytics', label: 'Analytics', icon: '📈' },
  { key: 'bill-splitter', label: 'Split Bills', icon: '🍕' },
  { key: 'emi-calculator', label: 'EMI Calculator', icon: '🏦' },
  { key: 'savings-goal', label: 'Savings Goals', icon: '💰' },
  { key: 'currency-converter', label: 'Currency', icon: '💱' },
  { key: 'export', label: 'Export', icon: '📥' },
]

const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  budget: Budget,
  analytics: Analytics,
  'bill-splitter': BillSplitter,
  'emi-calculator': EMICalculator,
  'savings-goal': SavingsGoal,
  'currency-converter': CurrencyConverter,
  export: ExportData,
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const PageComponent = PAGES[currentPage] || Dashboard

  const navigate = (page) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  return (
    <div className="app">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        navItems={NAV_ITEMS}
      />
      <Sidebar
        items={NAV_ITEMS}
        current={currentPage}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main-content">
        <PageComponent onNavigate={navigate} />
      </main>
      <nav className="bottom-nav">
        {NAV_ITEMS.slice(0, 5).map(item => (
          <button
            key={item.key}
            className={`bottom-nav-item ${currentPage === item.key ? 'active' : ''}`}
            onClick={() => navigate(item.key)}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <FloatingActionButton onClick={() => setShowAddForm(true)} />
      {showAddForm && (
        <TransactionForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  )
}
