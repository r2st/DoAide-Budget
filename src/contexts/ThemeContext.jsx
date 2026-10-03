import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('doaide-theme', 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
