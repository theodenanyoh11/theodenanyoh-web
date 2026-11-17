'use client'

import React, { createContext, use } from 'react'

import type { Theme, ThemeContextType } from './types'

// The site is light mode only. The provider and hook stay so existing
// components that read the theme keep working.
const value: ThemeContextType = {
  setTheme: () => undefined,
  theme: 'light' as Theme,
}

const ThemeContext = createContext(value)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeContext value={value}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
