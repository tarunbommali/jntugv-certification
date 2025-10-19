import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const STORAGE_KEY = 'app_theme';
const DEFAULT_THEME = 'light';

// LinkedIn-style color system for professional course website
const THEME_COLORS = {
  light: {
    // Primary Brand Colors (LinkedIn Blue)
    primary: '#0A66C2', // LinkedIn Blue
    primaryHover: '#004182', // Dark Blue for hover states
    primaryLight: '#E8F3FF', // Light Blue for backgrounds
    
    // Background Colors
    background: '#FFFFFF', // White background
    backgroundAlt: '#F3F2EF', // Light Gray surface
    
    // Surface/Card Background
    surface: '#F3F2EF', // Light Gray for cards
    surfaceElevated: '#FFFFFF', // White for elevated surfaces
    
    // Text Colors
    textHigh: '#191919', // Dark Gray for primary text
    textMedium: '#666666', // Medium Gray for secondary text
    textLow: '#8A8A8A', // Light Gray for hints/labels
    
    // Feedback Colors
    success: '#38A169', // Green for success
    error: '#D9534F', // Red for errors
    warning: '#F59E0B', // Orange for warnings
    
    // Border and Divider
    border: '#E0E0E0', // Light border
    divider: '#E0E0E0', // Divider color
    
    // Interactive States
    hover: '#F8FAFC', // Very light hover state
    active: '#E8F3FF', // Light blue active state
    disabled: '#CBD5E1', // Disabled state
  },
  dark: {
    // Primary Brand Colors (LinkedIn Blue - consistent across themes)
    primary: '#0A66C2', // LinkedIn Blue (same as light)
    primaryHover: '#378FE9', // Light Blue for hover in dark theme
    primaryLight: '#1A1D21', // Deep charcoal for backgrounds
    
    // Background Colors
    background: '#1A1D21', // Deep Charcoal background
    backgroundAlt: '#22272B', // Slightly lighter gray
    
    // Surface/Card Background
    surface: '#22272B', // Slightly lighter gray for cards
    surfaceElevated: '#2E3338', // Elevated dark surface
    
    // Text Colors
    textHigh: '#F3F6F8', // Off-White for primary text
    textMedium: '#A3A6AA', // Gray for secondary text
    textLow: '#757575', // Muted gray for hints/labels
    
    // Feedback Colors
    success: '#6EE7B7', // Light green for success
    error: '#FF6961', // Light red for errors
    warning: '#FBBF24', // Light orange for warnings
    
    // Border and Divider
    border: '#2E3338', // Dark border
    divider: '#2E3338', // Dark divider
    
    // Interactive States
    hover: '#3A3A3A', // Dark hover state
    active: '#2E3338', // Dark active state
    disabled: '#555555', // Disabled state
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


