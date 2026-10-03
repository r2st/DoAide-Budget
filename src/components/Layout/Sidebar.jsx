export default function Sidebar({ items, current, onNavigate, open, onClose }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-name">DoAide</span>
          <span className="brand-product">Budget</span>
        </div>
        <nav className="sidebar-nav">
          {items.map(item => (
            <button
              key={item.key}
              className={`sidebar-item ${current === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <a href="https://doaide.com" target="_blank" rel="noopener noreferrer" className="sidebar-link">
            doaide.com
          </a>
        </div>
      </aside>
    </>
  )
}
