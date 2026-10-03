import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import { BudgetProvider } from './contexts/BudgetContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BudgetProvider>
        <App />
      </BudgetProvider>
    </ThemeProvider>
  </React.StrictMode>
)
