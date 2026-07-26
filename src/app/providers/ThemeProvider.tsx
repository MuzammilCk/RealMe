import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

type ThemeMode = 'warm' | 'cool' | 'auto';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedTheme: 'warm' | 'cool';
  toggleTheme: () => void;
  reducedMotion: boolean;
  highContrast: boolean;
  colorBlindSafe: boolean;
  toggleColorBlindSafe: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'warm' | 'cool'>('warm');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [colorBlindSafe, setColorBlindSafe] = useState(false);

  // Detect system preferences
  useEffect(() => {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    const handleColorSchemeChange = () => {
      if (mode === 'auto') {
        const isDark = colorSchemeQuery.matches;
        setResolvedTheme(isDark ? 'warm' : 'cool');
        applyTheme(isDark ? 'warm' : 'cool');
      }
    };

    const handleReducedMotionChange = () => {
      setReducedMotion(reducedMotionQuery.matches);
    };

    const handleContrastChange = () => {
      setHighContrast(contrastQuery.matches);
    };

    // Initial checks
    handleColorSchemeChange();
    handleReducedMotionChange();
    handleContrastChange();

    // Add listeners
    colorSchemeQuery.addEventListener('change', handleColorSchemeChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      colorSchemeQuery.removeEventListener('change', handleColorSchemeChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, [mode]);

  // Apply color-blind safe mode
  useEffect(() => {
    const root = document.documentElement;
    if (colorBlindSafe) {
      root.classList.add('color-blind-safe');
    } else {
      root.classList.remove('color-blind-safe');
    }
  }, [colorBlindSafe]);

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
    } else {
      // Cool variant (for light mode preference)
      root.style.setProperty('--bg-scene', 'oklch(0.95 0.005 240)');
      root.style.setProperty('--bg-canvas', 'oklch(0.92 0.008 240)');
      root.style.setProperty('--bg-card', 'oklch(0.88 0.01 240)');
      root.style.setProperty('--text-primary', 'oklch(0.25 0.03 45)');
      root.style.setProperty('--text-secondary', 'oklch(0.45 0.04 50)');
      root.style.setProperty('--text-accent', 'oklch(0.42 0.14 75)');
      root.style.setProperty('--border-subtle', 'oklch(0.52 0.12 75 / 0.3)');
    }
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    if (newMode !== 'auto') {
      const theme = newMode === 'warm' ? 'warm' : 'cool';
      setResolvedTheme(theme);
      applyTheme(theme);
    } else {
      // Re-evaluate system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'warm' : 'cool');
      applyTheme(isDark ? 'warm' : 'cool');
    }
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const newMode = resolvedTheme === 'warm' ? 'cool' : 'warm';
    setMode(newMode);
  }, [resolvedTheme, setMode]);

  const toggleColorBlindSafe = useCallback(() => {
    setColorBlindSafe(prev => !prev);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        resolvedTheme,
        toggleTheme,
        reducedMotion,
        highContrast,
        colorBlindSafe,
        toggleColorBlindSafe,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}