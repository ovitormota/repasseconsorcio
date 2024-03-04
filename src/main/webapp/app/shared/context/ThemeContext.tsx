import React, { useCallback, useContext, useMemo, useState } from 'react'
import { createContext } from 'react'
import { ThemeProvider } from '@mui/material'
import { defaultTheme } from '../layout/themes'

interface IThemeContextData {
  themeName: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext({} as IThemeContextData)

export const useAppThemeContext = () => {
  return useContext(ThemeContext)
}

const mergeThemes = (mainTheme, additionalTheme) => {
  return {
    ...mainTheme,
    components: {
      ...mainTheme.components,
      ...additionalTheme.components,
    },
  }
}

export const AppThemeProvider: React.FC = ({ children }) => {
  const initialTheme = localStorage.getItem('USER_THEME') as 'light' | 'dark' | null
  const [themeName, setThemeName] = useState<'light' | 'dark'>(initialTheme || 'light')
  const toggleTheme = useCallback(() => {
    setThemeName((oldThemeName) => {
      const newThemeName = oldThemeName === 'light' ? 'dark' : 'light'
      localStorage.setItem('USER_THEME', newThemeName)

      return newThemeName
    })
  }, [])

  const baseTheme = useMemo(() => {
    if (themeName === 'light') return defaultTheme

    return defaultTheme
  }, [themeName])

  const theme = useMemo(() => mergeThemes(baseTheme, defaultTheme), [baseTheme])

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
