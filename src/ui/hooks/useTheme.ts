import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from '../app/providers/ThemeProvider';

/**
 * Hook to access theme context (mode, resolved theme, toggle functions)
 * Provides type-safe access to ThemeProvider values
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}