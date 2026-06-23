import { useState, useEffect, useCallback } from 'react';
type Theme = 'dark' | 'light';
const STORAGE_KEY = 'nihonsync-theme';
const DEFAULT_THEME: Theme = 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return DEFAULT_THEME;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem(STORAGE_KEY, theme); }, [theme]);
  const toggleTheme = useCallback(() => { setTheme((p) => (p === 'dark' ? 'light' : 'dark')); }, []);
  return { theme, toggleTheme, isDark: theme === 'dark' };
}
