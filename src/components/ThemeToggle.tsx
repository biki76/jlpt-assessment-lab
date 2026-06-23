import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();
  return (
    <button onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative flex items-center justify-center w-10 h-10 rounded-radius-md border border-border bg-bg-elevated text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40">
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
