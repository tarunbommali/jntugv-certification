import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const STORAGE_KEY = 'app_theme';
const DEFAULT_THEME = 'light';

// Comprehensive color system based on the provided specification
const THEME_COLORS = {
    light: {
        // Primary Accent (Instagram-like)
        primary: '#155dfc',
        primaryHover: '#C13584',
        primaryLight: '#FFF0F6',

        // Background
        background: '#FFFFFF',
        backgroundAlt: '#FAFAFA',

        // Surface/Card Background
        surface: '#FFFFFF',
        surfaceElevated: '#FFFFFF',

        // Text Colors
        textHigh: '#1C1E21',
        textMedium: '#65676B',
        textLow: '#A8A8A8',

        // Feedback Colors
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',

        // Border and Divider
        border: '#E4E6EB',
        divider: '#E4E6EB',

        // Interactive States
        hover: '#F5F5F5',
        active: '#FFF0F6',
        disabled: '#E0E0E0',
    },
    dark: {
        primary: '#155dfc',
        primaryHover: '#F77737',
        primaryLight: '#2C2C2C',

        background: '#121212',
        backgroundAlt: '#181818',

        surface: '#1F1F1F',
        surfaceElevated: '#242424',

        textHigh: '#F5F5F5',
        textMedium: '#B0B0B0',
        textLow: '#6E6E6E',

        success: '#34D399',
        error: '#F87171',
        warning: '#FBBF24',

        border: '#2E2E2E',
        divider: '#2E2E2E',

        hover: '#2A2A2A',
        active: '#E1306C22',
        disabled: '#555555',
    }
};

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
            const colors = THEME_COLORS[theme];
            
            // Apply CSS custom properties
            Object.entries(colors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value);
            });
            
            // Set theme attribute for conditional styling
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

    const getColor = useCallback((colorKey) => {
        return THEME_COLORS[theme][colorKey] || colorKey;
    }, [theme]);

    const value = useMemo(() => ({ 
        theme, 
        setTheme, 
        toggleTheme, 
        isDark: theme === 'dark',
        isLight: theme === 'light',
        colors: THEME_COLORS[theme],
        getColor
    }), [theme, toggleTheme, getColor]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;


