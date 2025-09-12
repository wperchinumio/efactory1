import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { readGeneralSettings } from '@/services/api'
import { getAuthState } from '@/lib/auth/guards'

interface OrderSettings {
  manual: boolean
  prefix: string
  suffix: string
  starting_number: number
  minimum_number_of_digits: number
}

interface OrderSettingsContextType {
  orderSettings: OrderSettings
  isLoading: boolean
  error: string | null
}

const OrderSettingsContext = createContext<OrderSettingsContextType | undefined>(undefined)

interface OrderSettingsProviderProps {
  children: ReactNode
}

export function OrderSettingsProvider({ children }: OrderSettingsProviderProps) {
  const [orderSettings, setOrderSettings] = useState<OrderSettings>({
    manual: true,
    prefix: '',
    suffix: '',
    starting_number: 1,
    minimum_number_of_digits: 4
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings once when component mounts (like legacy)
  useEffect(() => {
    let isMounted = true

    const loadSettings = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const settings = await readGeneralSettings()
        console.log('API returned settings:', settings)
        
        if (isMounted) {
          setOrderSettings(settings)
          setIsLoading(false)
          console.log('Settings updated in context:', settings)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load order settings:', err)
          setError(err instanceof Error ? err.message : 'Failed to load settings')
          setIsLoading(false)
          // Keep default settings on error
        }
      }
    }

    loadSettings()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <OrderSettingsContext.Provider value={{ orderSettings, isLoading, error }}>
      {children}
    </OrderSettingsContext.Provider>
  )
}

export function useOrderSettings() {
  const context = useContext(OrderSettingsContext)
  if (context === undefined) {
    throw new Error('useOrderSettings must be used within an OrderSettingsProvider')
  }
  return context
}
