/**
 * 全站主题引擎 (Dark Mode)
 */

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'oucloud_theme'

/**
 * 解析当前是否应该激活暗黑模式
 */
export function resolveIsDark(theme: Theme, systemPrefersDark: boolean): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return systemPrefersDark
}

/**
 * 安全从本地存储读取主题偏好，非法值回退至 'system'
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'system'
  }
  try {
    const val = localStorage.getItem(STORAGE_KEY)
    if (val === 'light' || val === 'dark' || val === 'system') {
      return val
    }
  } catch {
    // 隐身模式或配额受限时安全容错
  }
  return 'system'
}

/**
 * 持久化主题设置到本地存储
 */
export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // 安全容错
  }
}

/**
 * 将主题应用到 document.documentElement 的 classList 中
 */
export function applyThemeToDom(theme: Theme, systemPrefersDark?: boolean): boolean {
  if (typeof document === 'undefined') return false

  const sysDark =
    systemPrefersDark !== undefined
      ? systemPrefersDark
      : typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false

  const isDark = resolveIsDark(theme, sysDark)

  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  return isDark
}
