import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export function ThemeToggle() {
  const { themeMode, setThemeMode, toggleTheme, systemTheme } = useTheme();

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
  };

  const getCurrentIcon = () => {
    if (themeMode === 'system') {
      return <Monitor className="w-4 h-4" />;
    }
    return themeMode === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;
  };

  const getCurrentLabel = () => {
    if (themeMode === 'system') {
      return `System (${systemTheme})`;
    }
    return themeMode.charAt(0).toUpperCase() + themeMode.slice(1);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="relative"
        title={`Current theme: ${getCurrentLabel()}`}
      >
        <div className="flex items-center space-x-2">
          {getCurrentIcon()}
          <span className="text-xs font-medium">
            {getCurrentLabel()}
          </span>
        </div>
      </Button>

      {/* Theme selector dropdown */}
      <div className="flex items-center space-x-1">
        <Button
          variant={themeMode === 'light' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => handleThemeChange('light')}
          title="Light theme"
        >
          <Sun className="w-3 h-3" />
        </Button>
        
        <Button
          variant={themeMode === 'dark' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => handleThemeChange('dark')}
          title="Dark theme"
        >
          <Moon className="w-3 h-3" />
        </Button>
        
        <Button
          variant={themeMode === 'system' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => handleThemeChange('system')}
          title="System theme"
        >
          <Monitor className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// Compact theme toggle for mobile
export function CompactThemeToggle() {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="p-2"
      title={`Toggle theme (current: ${themeMode})`}
    >
      {themeMode === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : themeMode === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Monitor className="w-4 h-4" />
      )}
    </Button>
  );
}

// Theme toggle with animation
export function AnimatedThemeToggle() {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative overflow-hidden group"
    >
      <div className="relative flex items-center justify-center w-6 h-6">
        <Sun 
          className={`absolute w-4 h-4 transition-all duration-300 ${
            themeMode === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          }`} 
        />
        <Moon 
          className={`absolute w-4 h-4 transition-all duration-300 ${
            themeMode === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`} 
        />
        <Monitor 
          className={`absolute w-4 h-4 transition-all duration-300 ${
            themeMode === 'system' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-180 scale-0'
          }`} 
        />
      </div>
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded" />
    </Button>
  );
}
