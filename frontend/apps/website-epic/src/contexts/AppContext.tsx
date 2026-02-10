import React, { createContext, useContext, ReactNode, useState } from 'react'

interface AppContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null)

  const value: AppContextType = {
    isLoading,
    setIsLoading,
    isContactModalOpen,
    setIsContactModalOpen,
    error,
    setError,
  };


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext debe usarse dentro de AppProvider')
  }
  return context
}
