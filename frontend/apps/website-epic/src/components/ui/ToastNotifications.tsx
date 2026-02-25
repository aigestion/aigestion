// ============================================
// TOAST NOTIFICATIONS SYSTEM
// Sistema de notificaciones elegante y personalizable
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

// ============================================
// TIPOS DE NOTIFICACIONES
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export interface ToastState {
  toasts: Toast[];
  queue: Toast[];
  maxToasts: number;
  defaultDuration: number;
}

// ============================================
// CONFIGURACIONES POR TIPO
// ============================================

const toastConfig = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    bgColor: 'bg-green-500',
    borderColor: 'border-green-500',
    textColor: 'text-white',
    duration: 4000,
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    bgColor: 'bg-red-500',
    borderColor: 'border-red-500',
    textColor: 'text-white',
    duration: 6000,
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-500',
    textColor: 'text-white',
    duration: 5000,
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-white',
    duration: 4000,
  },
  loading: {
    icon: <Loader2 className="w-5 h-5 animate-spin" />,
    bgColor: 'bg-nexus-cyan',
    borderColor: 'border-nexus-cyan',
    textColor: 'text-white',
    duration: 0, // Loading toasts don't auto-dismiss
  },
} as const;

// ============================================
// REDUCER PARA GESTIÓN DE ESTADO
// ============================================

type ToastAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'UPDATE_TOAST'; payload: { id: string; update: Partial<Toast> } }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'SET_MAX_TOASTS'; payload: number }
  | { type: 'SET_DEFAULT_DURATION'; payload: number };

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      const newToasts = [...state.toasts, action.payload];
      return {
        ...state,
        toasts: newToasts.slice(-state.maxToasts),
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(toast =>
          toast.id === action.payload.id
            ? { ...toast, ...action.payload.update }
            : toast
        ),
      };

    case 'CLEAR_QUEUE':
      return {
        ...state,
        queue: [],
      };

    case 'SET_MAX_TOASTS':
      return {
        ...state,
        maxToasts: action.payload,
      };

    case 'SET_DEFAULT_DURATION':
      return {
        ...state,
        defaultDuration: action.payload,
      };

    default:
      return state;
  }
}

// ============================================
// CONTEXT PARA NOTIFICACIONES
// ============================================

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id' | 'position'>) => string;
  success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'position'>>) => string;
  error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'position'>>) => string;
  warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'position'>>) => string;
  info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'position'>>) => string;
  loading: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'position'>>) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  setMaxToasts: (max: number) => void;
  setDefaultDuration: (duration: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ============================================
// PROVIDER DE NOTIFICACIONES
// ============================================

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  defaultDuration?: number;
}

export function ToastProvider({
  children,
  maxToasts = 5,
  defaultDuration = 4000,
}: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
    queue: [],
    maxToasts,
    defaultDuration,
  });

  const toast = useCallback((toastOptions: Omit<Toast, 'id' | 'position'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      id,
      position: 'top-right',
      duration: state.defaultDuration,
      ...toastConfig[toastOptions.type || 'info'],
      ...toastOptions,
    };

    dispatch({ type: 'ADD_TOAST', payload: toast });
    return id;
  }, [state.defaultDuration]);

  const success = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'position'>>) => {
    return toast({ ...options, type: 'success', message });
  }, [toast]);

  const error = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'position'>>) => {
    return toast({ ...options, type: 'error', message });
  }, [toast]);

  const warning = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'position'>>) => {
    return toast({ ...options, type: 'warning', message });
  }, [toast]);

  const info = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'position'>>) => {
    return toast({ ...options, type: 'info', message });
  }, [toast]);

  const loading = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'position'>>) => {
      return toast({ ...options, type: 'loading', message, duration: 0 });
  }, [toast]);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR_QUEUE' });
  }, []);

  const setMaxToasts = useCallback((max: number) => {
    dispatch({ type: 'SET_MAX_TOASTS', payload: max });
  }, []);

  const setDefaultDuration = useCallback((duration: number) => {
    dispatch({ type: 'SET_DEFAULT_DURATION', payload: duration });
  }, []);

  // Auto-dismiss toasts
  useEffect(() => {
    state.toasts.forEach(toast => {
      if (toast.duration && toast.duration > 0 && !toast.persistent) {
        const timer = setTimeout(() => {
          dismiss(toast.id);
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [state.toasts, dismiss]);

  const value: ToastContextType = {
    toasts: state.toasts,
    toast,
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    clear,
    setMaxToasts,
    setDefaultDuration,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// ============================================
// CONTENEDOR DE TOASTS
// ============================================

function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

// ============================================
// COMPONENTE INDIVIDUAL DE TOAST
// ============================================

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const { dismiss } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => dismiss(toast.id), 300);
  }, [dismiss, toast.id]);

  const config = toastConfig[toast.type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border',
            config.bgColor,
            config.borderColor,
            {
              'mb-4': toast.position?.includes('top'),
              'mt-4': toast.position?.includes('bottom'),
              'ml-4': toast.position?.includes('right'),
              'mr-4': toast.position?.includes('left'),
              'mx-auto': toast.position?.includes('center'),
            }
          )}
          style={{
            minWidth: '300px',
            maxWidth: '500px',
          }}
        >
          {/* Icon */}
          <div className={cn('flex-shrink-0 mt-0.5', config.textColor)}>
            {toast.icon || config.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className={cn('font-semibold text-sm', config.textColor)}>
                {toast.title}
              </h4>
            )}
            <p className={cn('text-sm opacity-90', config.textColor)}>
              {toast.message}
            </p>

            {/* Action */}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className={cn(
                  'mt-2 text-sm underline',
                  config.textColor,
                  'hover:opacity-80'
                )}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          {/* Close Button */}
          {!toast.persistent && (
            <button
              onClick={handleDismiss}
              className={cn(
                'flex-shrink-0 p-1 rounded-md',
                config.textColor,
                'hover:bg-white/20'
              )}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// HOOKS CONVENIENTES
// ============================================

export function useToastAutoDismiss(
  duration: number,
  options?: Partial<Omit<Toast, 'id' | 'duration'>>
) {
  const { toast } = useToast();

  return useCallback((toastOptions: Omit<Toast, 'id' | 'duration'>) => {
    return toast({ ...toastOptions, duration });
  }, [toast]);
}

export function useToastPromise<T>() {
  const { toast, dismiss } = useToast();

  const promise = useCallback(
    (promise: Promise<T>, options?: Partial<Omit<Toast, 'id'>>) => {
      const id = toast({
        ...options,
        type: 'loading',
        message: 'Loading...',
      });

      return promise
        .then((result) => {
          dispatch({ type: 'UPDATE_TOAST', payload: { id, update: { type: 'success', message: 'Success!' } } });
          return result;
        })
        .catch((error) => {
          dispatch({ type: 'UPDATE_TOAST', payload: { id, update: { type: 'error', message: error.message } } });
          throw error;
        })
        .finally(() => {
          setTimeout(() => dismiss(id), 2000);
        });
    },
    [toast, dismiss]
  );

  return { promise };
}

// ============================================
// COMPONENTES DE NOTIFICACIÓN ESPECIALIZADOS
// ============================================

interface SuccessToastProps {
  message: string;
  title?: string;
  duration?: number;
  onDismiss?: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  message,
  title,
  duration,
  onDismiss,
}) => {
  const { success } = useToast();
  const [id, setId] = useState<string>('');

  useEffect(() => {
    const toastId = success(message, { title, duration });
    setId(toastId);
  }, [message, title, duration, success]);

  useEffect(() => {
    if (id && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  return null;
};

interface ErrorToastProps {
  message: string;
  title?: string;
  duration?: number;
  onDismiss?: () => void;
  persistent?: boolean;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  message,
  title,
  duration,
  onDismiss,
  persistent = false,
}) => {
  const { error } = useToast();
  const [id, setId] = useState<string>('');

  useEffect(() => {
    const toastId = error(message, { title, duration, persistent });
    setId(toastId);
  }, [message, title, duration, persistent, error]);

  useEffect(() => {
    if (id && onDismiss && !persistent) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration || 6000);
      return () => clearTimeout(timer);
    }
  }, [id, duration, persistent, onDismiss]);

  return null;
};

// ============================================
// EXPORTS
// ============================================

export {
  ToastProvider,
  ToastContext,
  ToastType,
  type Toast,
  type ToastState,
};

export default ToastProvider;
