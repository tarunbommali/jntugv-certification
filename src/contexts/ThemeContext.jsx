import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const STORAGE_KEY = 'app_theme';
const DEFAULT_THEME = 'light';

const ThemeContext = createContext(undefined);

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(DEFAULT_THEME);

    useEffect(() => {
        const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
        if (saved === 'light' || saved === 'dark') {
            setTheme(saved);
        } else {
            setTheme(DEFAULT_THEME);
        }
    }, []);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            if (theme === 'dark') {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.removeAttribute('data-theme');
            }
        }
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, theme);
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    const value = useMemo(() => ({ theme, setTheme, toggleTheme, isDark: theme === 'dark' }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;


