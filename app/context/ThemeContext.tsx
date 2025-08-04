import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'skillswap-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    const initialTheme = savedTheme && ['dark', 'light', 'system'].includes(savedTheme) 
      ? savedTheme 
      : defaultTheme;
    
    setThemeState(initialTheme);
    setIsMounted(true);
  }, [defaultTheme, storageKey]);

  // Resolve theme based on current theme setting
  useEffect(() => {
    if (!isMounted) return;

    const resolveTheme = (currentTheme: Theme): ResolvedTheme => {
      if (currentTheme === 'system') {
        return getSystemTheme();
      }
      return currentTheme;
    };

    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);

    // Apply to DOM
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    // Save to localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, isMounted, storageKey]);

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (!isMounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const systemTheme = getSystemTheme();
      setResolvedTheme(systemTheme);
      
      // Update DOM
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, isMounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4 transition-transform duration-200" />;
      case 'dark':
        return <Moon className="h-4 w-4 transition-transform duration-200" />;
      case 'system':
        return <Monitor className="h-4 w-4 transition-transform duration-200" />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
      title={`Current theme: ${theme}`}
    >
      {getIcon()}
      <span className="sr-only">Toggle theme (current: {theme})</span>
    </button>
  );
}