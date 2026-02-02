import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTheme, ThemeProvider } from '../../contexts/ThemeContext';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock matchMedia
const mockMatchMedia = vi.fn();
Object.defineProperty(globalThis, 'matchMedia', {
  value: mockMatchMedia,
  writable: true,
});

// Mock document
Object.defineProperty(globalThis, 'document', {
  value: {
    documentElement: {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(),
      },
      style: {
        setProperty: vi.fn(),
      },
    },
    querySelector: vi.fn(),
    referrer: '',
  },
  writable: true,
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('useTheme Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it('returns default theme values', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme.mode).toBe('light');
    expect(result.current.themeMode).toBe('system');
    expect(result.current.systemTheme).toBe('light');
    expect(result.current.isSystemTheme).toBe(true);
  });

  it('loads saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.themeMode).toBe('dark');
    expect(result.current.theme.mode).toBe('dark');
  });

  it('detects system dark theme preference', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.systemTheme).toBe('dark');
  });

  it('sets theme to dark when mode is dark', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('dark');
    });

    expect(result.current.themeMode).toBe('dark');
    expect(result.current.theme.mode).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
  });

  it('sets theme to light when mode is light', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('light');
    });

    expect(result.current.themeMode).toBe('light');
    expect(result.current.theme.mode).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'light');
  });

  it('sets theme to system when mode is system', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('system');
    });

    expect(result.current.themeMode).toBe('system');
    expect(result.current.isSystemTheme).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'system');
  });

  it('toggles theme correctly', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    // Initial state: system -> light
    expect(result.current.theme.mode).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    // Should switch to dark
    expect(result.current.theme.mode).toBe('dark');
    expect(result.current.themeMode).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    // Should switch back to light
    expect(result.current.theme.mode).toBe('light');
    expect(result.current.themeMode).toBe('light');
  });

  it('toggles from system to opposite theme', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Initial state: system -> dark (system preference is dark)
    expect(result.current.theme.mode).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    // Should switch to light (opposite of system)
    expect(result.current.theme.mode).toBe('light');
    expect(result.current.themeMode).toBe('light');
  });

  it('applies CSS classes to document element', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('dark');
    });

    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light');
  });

  it('sets CSS custom properties', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('dark');
    });

    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      '--color-primary',
      '#60a5fa'
    );
  });

  it('listens to system theme changes', () => {
    const addEventListenerSpy = vi.fn();
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: addEventListenerSpy,
      removeEventListener: vi.fn(),
    });

    renderHook(() => useTheme(), { wrapper });

    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates theme when system preference changes', () => {
    let changeCallback: ((event: MediaQueryListEvent) => void) | null = null;

    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: (event, callback) => {
        if (event === 'change') {
          changeCallback = callback as any;
        }
      },
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Simulate system theme change to dark
    act(() => {
      changeCallback!({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current.systemTheme).toBe('dark');
  });

  it('uses light theme when system preference is light', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: light)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.systemTheme).toBe('light');
  });

  it('provides correct theme colors', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme.colors.primary).toBe('#3b82f6');
    expect(result.current.theme.colors.background).toBe('#ffffff');
    expect(result.current.theme.colors.text).toBe('#1e293b');
  });

  it('provides correct dark theme colors', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('dark');
    });

    expect(result.current.theme.colors.primary).toBe('#60a5fa');
    expect(result.current.theme.colors.background).toBe('#0f172a');
    expect(result.current.theme.colors.text).toBe('#f1f5f9');
  });

  it('provides transition properties', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme.transitions.duration).toBe('200ms');
    expect(result.current.theme.transitions.easing).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
  });

  it('provides shadow properties', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme.shadows.sm).toBe('0 1px 2px 0 rgba(0, 0, 0, 0.05)');
    expect(result.current.theme.shadows.lg).toBe('0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)');
  });

  it('handles invalid theme mode gracefully', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('invalid' as any);
    });

    // Should remain unchanged for invalid mode
    expect(result.current.themeMode).toBe('system');
  });

  it('uses default theme when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.themeMode).toBe('system');
  });

  it('handles localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(() => {
      act(() => {
        result.current.setThemeMode('dark');
      });
    }).not.toThrow();
  });
});
