import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const STORAGE_KEY = 'app_theme';
const DEFAULT_THEME = 'light';

// Comprehensive color system based on the provided specification
const THEME_COLORS = {
  light: {
    // Primary Accent (CTA)
    primary: '#007AFF', // Vibrant Blue
    primaryHover: '#0056CC',
    
    // Background
    background: '#F7F7F7', // Off-White/Very Light Gray
    backgroundAlt: '#FFFFFF', // Pure White for contrast
    
    // Surface/Card Background
    surface: '#FFFFFF', // Pure White
    surfaceElevated: '#EFEFEF', // Light Gray for elevation
    
    // Text Colors
    textHigh: '#1A1A1A', // Near-Black for headings
    textMedium: '#4A4A4A', // Dark Gray for body text
    textLow: '#8A8A8A', // Medium Gray for hints/labels
    
    // Feedback Colors
    success: '#38A169', // Bright Green
    error: '#D9534F', // Vibrant Red/Orange
    warning: '#F59E0B', // Orange for warnings
    
    // Border and Divider
    border: '#E2E8F0', // Light border
    divider: '#F1F5F9', // Very light divider
    
    // Interactive States
    hover: '#F8FAFC', // Very light hover state
    active: '#E2E8F0', // Light active state
    disabled: '#CBD5E1', // Disabled state
  },
  dark: {
    // Primary Accent (CTA)
    primary: '#4D9FFF', // Lighter/Desaturated Accent
    primaryHover: '#66B3FF',
    
    // Background
    background: '#121212', // Soft Charcoal/Dark Gray
    backgroundAlt: '#1E1E1E', // Slightly lighter dark gray
    
    // Surface/Card Background
    surface: '#2C2C2C', // Elevated Dark Gray (1dp)
    surfaceElevated: '#212121', // Elevated Dark Gray (2dp)
    
    // Text Colors
    textHigh: '#E0E0E0', // Off-White for headings
    textMedium: '#AFAFAF', // Light Gray for body text
    textLow: '#757575', // Muted Gray for hints/labels
    
    // Feedback Colors
    success: '#6EE7B7', // Lighter Green
    error: '#FF6961', // Lighter Red/Orange
    warning: '#FBBF24', // Lighter Orange for warnings
    
    // Border and Divider
    border: '#404040', // Dark border
    divider: '#2A2A2A', // Dark divider
    
    // Interactive States
    hover: '#3A3A3A', // Dark hover state
    active: '#4A4A4A', // Dark active state
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


