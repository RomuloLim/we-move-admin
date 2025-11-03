import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeContextType = {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'we-move-theme'
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem(storageKey) as Theme) || defaultTheme
        }
        return defaultTheme
    })

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const root = window.document.documentElement

        // Remove previous theme classes
        root.classList.remove('light', 'dark')

        let resolved: 'light' | 'dark'

        if (theme === 'system') {
            resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else {
            resolved = theme
        }

        setResolvedTheme(resolved)

        // Add the appropriate theme classes
        if (resolved === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.add('light')
        }

        // Store theme preference
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, theme)
        }
    }, [theme, storageKey])

    // Listen for system theme changes when using system theme
    useEffect(() => {
        if (theme !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = () => {
            const root = window.document.documentElement
            root.classList.remove('light', 'dark')

            const resolved = mediaQuery.matches ? 'dark' : 'light'
            setResolvedTheme(resolved)

            if (resolved === 'dark') {
                root.classList.add('dark')
            } else {
                root.classList.add('light')
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme])

    const value: ThemeContextType = {
        theme,
        setTheme,
        resolvedTheme,
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }

    return context
}
