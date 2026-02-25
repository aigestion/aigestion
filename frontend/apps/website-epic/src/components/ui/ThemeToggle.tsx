import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export function ThemeToggle() {
  const { themeMode, setThemeMode, toggleTheme, systemTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    setIsExpanded(false);
  };

  const getCurrentIcon = () => {
    if (!mounted) return <Monitor className="w-4 h-4" />;

    if (themeMode === 'system') {
      return <Monitor className="w-4 h-4" />;
    }
    return themeMode === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;
  };

  const getCurrentLabel = () => {
    if (!mounted) return 'Loading...';

    if (themeMode === 'system') {
      return `System (${systemTheme})`;
    }
    return themeMode.charAt(0).toUpperCase() + themeMode.slice(1);
  };

  const getThemeIcon = (mode: 'light' | 'dark' | 'system') => {
    switch (mode) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative"
        aria-label="Toggle theme"
        aria-expanded={isExpanded}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={themeMode}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {getCurrentIcon()}
          </motion.div>
        </AnimatePresence>
        <span className="sr-only">{getCurrentLabel()}</span>
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsExpanded(false)}
            />

            {/* Theme Options */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 bg-nexus-dark border border-nexus-cyan/20 rounded-lg shadow-lg p-1 min-w-[140px]"
            >
              <div className="space-y-1">
                {/* Light Theme */}
                <button
                  onClick={() => handleThemeChange('light')}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    'hover:bg-nexus-cyan/10 hover:text-nexus-cyan',
                    themeMode === 'light' && 'bg-nexus-cyan/10 text-nexus-cyan'
                  )}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                  {themeMode === 'light' && (
                    <div className="w-2 h-2 bg-nexus-cyan rounded-full ml-auto" />
                  )}
                </button>

                {/* Dark Theme */}
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    'hover:bg-nexus-cyan/10 hover:text-nexus-cyan',
                    themeMode === 'dark' && 'bg-nexus-cyan/10 text-nexus-cyan'
                  )}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                  {themeMode === 'dark' && (
                    <div className="w-2 h-2 bg-nexus-cyan rounded-full ml-auto" />
                  )}
                </button>

                {/* System Theme */}
                <button
                  onClick={() => handleThemeChange('system')}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    'hover:bg-nexus-cyan/10 hover:text-nexus-cyan',
                    themeMode === 'system' && 'bg-nexus-cyan/10 text-nexus-cyan'
                  )}
                >
                  <Monitor className="w-4 h-4" />
                  <span>System</span>
                  {themeMode === 'system' && (
                    <div className="w-2 h-2 bg-nexus-cyan rounded-full ml-auto" />
                  )}
                </button>
              </div>

              {/* System Info */}
              <div className="border-t border-nexus-cyan/20 pt-2 mt-1">
                <div className="px-3 py-2 text-xs text-nexus-cyan/60">System: {systemTheme}</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
            themeMode === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
          }`}
        />
        <Moon
          className={`absolute w-4 h-4 transition-all duration-300 ${
            themeMode === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
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
