import type { RmaReadResponse } from '@/types/api/returntrak'

const STORAGE_KEY = 'efactory_returntrak_draft_payload'

export function storeRmaDraft(payload: RmaReadResponse): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {}
}

export function consumeRmaDraft(): RmaReadResponse | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    window.sessionStorage.removeItem(STORAGE_KEY)
    const parsed: RmaReadResponse = JSON.parse(raw)
    return parsed
  } catch {
    return null
  }
}


