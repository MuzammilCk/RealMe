import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

type ThemeMode = 'warm' | 'cool' | 'auto';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedTheme: 'warm' | 'cool';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'warm' | 'cool'>('warm');

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'auto') {
        const isDark = mediaQuery.matches;
        setResolvedTheme(isDark ? 'warm' : 'cool');
        applyTheme(isDark ? 'warm' : 'cool');
      }
    };

    // Initial check
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Apply theme to CSS custom properties
  const applyTheme = useCallback((theme: 'warm' | 'cool') => {
    const root = document.documentElement;

    if (theme === 'warm') {
      // Warm candlelit workshop (default locked theme)
      root.style.setProperty('--bg-scene', 'oklch(0.08 0.005 240)');
      root.style.setProperty('--bg-canvas', 'oklch(0.12 0.008 240)');
      root.style.setProperty('--bg-card', 'oklch(0.18 0.01 240)');
      root.style.setProperty('--text-primary', 'oklch(0.55 0.03 45)');
      root.style.setProperty('--text-secondary', 'oklch(0.75 0.04 50)');
      root.style.setProperty('--text-accent', 'oklch(0.72 0.14 85)');
      root.style.setProperty('--border-subtle', 'oklch(0.35 0.08 75 / 0.3)');
      root.style.setProperty('--border-default', 'oklch(0.52 0.12 75 / 0.4)');
      root.style.setProperty('--interactive-default', 'oklch(0.52 0.12 75)');
      root.style.setProperty('--interactive-hover', 'oklch(0.72 0.14 85)');
      root.style.setProperty('--glow-ember', 'oklch(0.75 0.16 45)');
      root.style.setProperty('--glow-mystery', 'oklch(0.62 0.18 285)');
      root.style.setProperty('--glow-teal', 'oklch(0.68 0.14 185)');
    } else {
      // Cool variant (future use)
      root.style.setProperty('--bg-scene', 'oklch(0.08 0.01 260)');
      root.style.setProperty('--bg-canvas', 'oklch(0.12 0.015 260)');
      root.style.setProperty('--bg-card', 'oklch(0.18 0.02 260)');
      root.style.setProperty('--text-primary', 'oklch(0.75 0.02 260)');
      root.style.setProperty('--text-secondary', 'oklch(0.65 0.03 260)');
      root.style.setProperty('--text-accent', 'oklch(0.68 0.14 185)');
      root.style.setProperty('--border-subtle', 'oklch(0.4 0.08 185 / 0.3)');
      root.style.setProperty('--border-default', 'oklch(0.55 0.12 185 / 0.4)');
      root.style.setProperty('--interactive-default', 'oklch(0.55 0.12 185)');
      root.style.setProperty('--interactive-hover', 'oklch(0.68 0.14 185)');
      root.style.setProperty('--glow-ember', 'oklch(0.68 0.14 185)');
      root.style.setProperty('--glow-mystery', 'oklch(0.62 0.18 285)');
      root.style.setProperty('--glow-teal', 'oklch(0.68 0.14 185)');
    }
  }, []);

  // Apply initial theme
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme, applyTheme]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    if (newMode !== 'auto') {
      const theme = newMode === 'warm' ? 'warm' : 'cool';
      setResolvedTheme(theme);
      applyTheme(theme);
    } else {
      // Re-check system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = isDark ? 'warm' : 'cool';
      setResolvedTheme(theme);
      applyTheme(theme);
    }
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const newMode: ThemeMode = mode === 'warm' ? 'cool' : 'warm';
    setMode(newMode);
  }, [mode]);

  const value: ThemeContextValue = {
    mode,
    setMode,
    resolvedTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}