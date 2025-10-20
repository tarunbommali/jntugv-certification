/**
 * Theme utility functions and constants for consistent theme usage
 */

// Theme-aware class name generators
export const themeClasses = {
  // Background classes
  background: {
    primary: 'bg-app',
    secondary: 'bg-app-alt',
    surface: 'bg-surface',
    surfaceElevated: 'bg-surface-elevated',
  },
  
  // Text classes
  text: {
    high: 'text-high',
    medium: 'text-medium',
    low: 'text-low',
    primary: 'text-primary',
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
  },
  
  // Button classes
  button: {
    primary: 'btn-primary',
    success: 'btn-success',
    error: 'btn-error',
  },
  
  // Card classes
  card: {
    default: 'card',
    elevated: 'card-elevated',
  },
  
  // Border classes
  border: {
    theme: 'border-theme',
    primary: 'border-primary',
    success: 'border-success',
    error: 'border-error',
  },
  
  // Interactive classes
  interactive: {
    hover: 'hover-bg',
    active: 'active-bg',
    disabled: 'disabled',
    focus: 'focus-ring',
  },
  
  // Transition classes
  transition: 'theme-transition',
};

// Helper function to combine multiple theme classes
export const combineThemeClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Helper function to get theme-aware styles for inline styling
export const getThemeStyles = (theme, styleType) => {
  const styles = {
    background: {
      primary: theme.colors.background,
      secondary: theme.colors.backgroundAlt,
      surface: theme.colors.surface,
      surfaceElevated: theme.colors.surfaceElevated,
      primaryLight: theme.colors.primaryLight,
    },
    text: {
      high: theme.colors.textHigh,
      medium: theme.colors.textMedium,
      low: theme.colors.textLow,
      primary: theme.colors.primary,
      success: theme.colors.success,
      error: theme.colors.error,
      warning: theme.colors.warning,
    },
    border: {
      default: theme.colors.border,
      primary: theme.colors.primary,
      success: theme.colors.success,
      error: theme.colors.error,
    },
    interactive: {
      primary: theme.colors.primary,
      primaryHover: theme.colors.primaryHover,
      hover: theme.colors.hover,
      active: theme.colors.active,
      disabled: theme.colors.disabled,
    },
  };
  
  return styles[styleType] || {};
};

// Common component style combinations
export const componentStyles = {
  // Header styles
  header: {
    container: 'sticky top-0 z-40 shadow-sm theme-transition',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
  },
  
  // Card styles
  card: {
    container: 'card theme-transition',
    elevated: 'card-elevated theme-transition',
  },
  
  // Button styles
  button: {
    primary: 'btn-primary theme-transition',
    success: 'btn-success theme-transition',
    error: 'btn-error theme-transition',
  },
  
  // Input styles
  input: {
    container: 'w-full px-3 py-2 border border-theme rounded-md focus-ring theme-transition',
    background: 'var(--color-surface)',
    text: 'var(--color-textHigh)',
    placeholder: 'var(--color-textLow)',
  },
  
  // Navigation styles
  nav: {
    item: 'px-3 py-2 rounded-md theme-transition hover-bg',
    active: 'bg-primary text-white',
    inactive: 'text-medium hover:text-high',
  },
};

// Accessibility helpers
export const accessibility = {
  // Screen reader only text
  srOnly: 'sr-only',
  
  // Focus management
  focusable: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  
  // High contrast mode support
  highContrast: 'contrast-more:border-2 contrast-more:border-primary',
};

// Animation helpers
export const animations = {
  // Theme transitions
  themeTransition: 'transition-colors duration-300 ease-in-out',
  
  // Hover animations
  hover: 'transition-transform duration-200 ease-in-out hover:-translate-y-1',
  
  // Focus animations
  focus: 'transition-shadow duration-200 ease-in-out',
  
  // Loading animations
  loading: 'animate-pulse',
  spin: 'animate-spin',
};

// Responsive design helpers
export const responsive = {
  // Mobile first approach
  mobile: 'sm:',
  tablet: 'md:',
  desktop: 'lg:',
  wide: 'xl:',
  
  // Common breakpoints
  hideOnMobile: 'hidden sm:block',
  showOnMobile: 'block sm:hidden',
  hideOnTablet: 'hidden md:block',
  showOnTablet: 'block md:hidden',
};

// Color contrast helpers for accessibility
export const contrast = {
  // Ensure sufficient contrast ratios
  getContrastColor: (backgroundColor, theme) => {
    // This would need a proper contrast calculation library
    // For now, return appropriate text colors based on theme
    return theme === 'dark' ? theme.colors.textHigh : theme.colors.textHigh;
  },
  
  // High contrast mode support
  highContrast: 'contrast-more:border-2 contrast-more:border-primary contrast-more:bg-surface',
};

export default {
  themeClasses,
  combineThemeClasses,
  getThemeStyles,
  componentStyles,
  accessibility,
  animations,
  responsive,
  contrast,
};