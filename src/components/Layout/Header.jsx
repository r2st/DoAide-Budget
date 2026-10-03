import { useTheme } from '../../contexts/ThemeContext'

export default function Header({ onMenuClick, currentPage, navItems }) {
  const { theme, toggleTheme } = useTheme()
  const current = navItems.find(n => n.key === currentPage)

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="brand">
          <span className="brand-name">DoAide</span>
          <span className="brand-product">Budget</span>
        </div>
      </div>
      <div className="header-center">
        <h1 className="page-title">{current?.icon} {current?.label}</h1>
      </div>
      <div className="header-right">
        <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}
