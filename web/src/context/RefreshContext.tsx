import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';

interface RefreshContextType {
  isRefreshing: boolean;
  lastRefreshed: Date | null;
  refresh: () => Promise<void>;
  registerRefreshHandler: (handler: () => Promise<void> | void) => () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(new Date());
  
  // Storage for custom page-level refresh handlers
  const handlersRef = useRef<Set<() => Promise<void> | void>>(new Set());
  const isRefreshingRef = useRef(false);

  const registerRefreshHandler = useCallback((handler: () => Promise<void> | void) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  const refresh = useCallback(async () => {
    // Prevent duplicate requests
    if (isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    setIsRefreshing(true);

    try {
      if (handlersRef.current.size > 0) {
        // Execute all registered page-level refresh callbacks concurrently
        const promises = Array.from(handlersRef.current).map(async (fn) => {
          try {
            await fn();
          } catch (err) {
            console.error('Page refresh handler error:', err);
          }
        });
        await Promise.all(promises);
      } else {
        // Fallback settling if page has no custom callback
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      setLastRefreshed(new Date());
    } finally {
      // Clean settling without artificial delay
      setTimeout(() => {
        isRefreshingRef.current = false;
        setIsRefreshing(false);
      }, 80);
    }
  }, []);

  // Keyboard shortcut listener: Shift + R triggers desktop refresh
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing inside an input or textarea
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if (!isInput && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        refresh();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refresh]);

  return (
    <RefreshContext.Provider
      value={{
        isRefreshing,
        lastRefreshed,
        refresh,
        registerRefreshHandler,
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = (): RefreshContextType => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};
