import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Adjust path as needed

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      {resolvedTheme === 'light' ? (
        <Moon className="h-4 w-4 transition-transform duration-200" />
      ) : (
        <Sun className="h-4 w-4 transition-transform duration-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}