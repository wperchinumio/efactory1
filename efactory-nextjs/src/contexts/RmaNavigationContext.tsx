import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export interface RmaNavigationItem {
  rma_number: string
  account_number?: string
  // Allow extra fields for display/restore
  [key: string]: any
}

interface RmaNavigationState {
  items: RmaNavigationItem[]
  currentIndex: number
  sourceContext?: string
}

interface RmaNavigationContextType {
  navigationState: RmaNavigationState | null
  setRmaList: (items: RmaNavigationItem[], currentRmaNumber: string, sourceContext?: string) => void
  getPreviousRma: () => RmaNavigationItem | null
  getNextRma: () => RmaNavigationItem | null
  navigateToPrevious: () => RmaNavigationItem | null
  navigateToNext: () => RmaNavigationItem | null
  hasNavigation: () => boolean
  canNavigatePrevious: () => boolean
  canNavigateNext: () => boolean
  getCurrentIndex: () => number
  getTotalCount: () => number
  clearNavigation: () => void
}

const RmaNavigationContext = createContext<RmaNavigationContextType | undefined>(undefined)

export const RmaNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<RmaNavigationState | null>(null)

  const setRmaList = (items: RmaNavigationItem[], currentRmaNumber: string, sourceContext?: string) => {
    const index = Math.max(0, items.findIndex(i => (i.rma_number || '').toString() === (currentRmaNumber || '').toString()))
    setNavigationState({ items, currentIndex: index, sourceContext })
  }

  const getPreviousRma = (): RmaNavigationItem | null => {
    if (!navigationState) return null
    const idx = navigationState.currentIndex - 1
    if (idx < 0 || idx >= navigationState.items.length) return null
    return navigationState.items[idx]
  }

  const getNextRma = (): RmaNavigationItem | null => {
    if (!navigationState) return null
    const idx = navigationState.currentIndex + 1
    if (idx < 0 || idx >= navigationState.items.length) return null
    return navigationState.items[idx]
  }

  const navigateToPrevious = (): RmaNavigationItem | null => {
    if (!navigationState) return null
    const prev = getPreviousRma()
    if (!prev) return null
    setNavigationState({ ...navigationState, currentIndex: navigationState.currentIndex - 1 })
    return prev
  }

  const navigateToNext = (): RmaNavigationItem | null => {
    if (!navigationState) return null
    const next = getNextRma()
    if (!next) return null
    setNavigationState({ ...navigationState, currentIndex: navigationState.currentIndex + 1 })
    return next
  }

  const hasNavigation = () => Boolean(navigationState && navigationState.items.length > 0)
  const canNavigatePrevious = () => Boolean(navigationState && navigationState.currentIndex > 0)
  const canNavigateNext = () => Boolean(navigationState && navigationState.currentIndex < (navigationState.items.length - 1))
  const getCurrentIndex = () => (navigationState ? navigationState.currentIndex + 1 : 0)
  const getTotalCount = () => (navigationState ? navigationState.items.length : 0)
  const clearNavigation = () => setNavigationState(null)

  const value: RmaNavigationContextType = useMemo(() => ({
    navigationState,
    setRmaList,
    getPreviousRma,
    getNextRma,
    navigateToPrevious,
    navigateToNext,
    hasNavigation,
    canNavigatePrevious,
    canNavigateNext,
    getCurrentIndex,
    getTotalCount,
    clearNavigation,
  }), [navigationState])

  return (
    <RmaNavigationContext.Provider value={value}>
      {children}
    </RmaNavigationContext.Provider>
  )
}

export const useRmaNavigation = (): RmaNavigationContextType => {
  const ctx = useContext(RmaNavigationContext)
  if (!ctx) throw new Error('useRmaNavigation must be used within an RmaNavigationProvider')
  return ctx
}


