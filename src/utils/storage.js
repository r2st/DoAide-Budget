export function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable
  }
}
