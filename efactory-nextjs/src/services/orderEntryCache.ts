import type { DraftOrderReadResponse, OrderReadResponse, OrderDetailDto, OrderHeaderDto } from '@/types/api/orderpoints'

const STORAGE_KEY = 'efactory_orderpoints_draft_payload'

type ReadUnion = OrderReadResponse | DraftOrderReadResponse

export interface NormalizedDraftData {
  order_header: OrderHeaderDto
  order_detail: OrderDetailDto[]
}

export function storeOrderDraft(payload: ReadUnion): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {}
}

export function consumeOrderDraft(): NormalizedDraftData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    window.sessionStorage.removeItem(STORAGE_KEY)
    const parsed: ReadUnion = JSON.parse(raw)
    const base = (parsed as any).draft_order ? (parsed as any).draft_order : parsed
    const order_header = (base as any).order_header || {}
    const order_detail = (base as any).order_detail || []
    return { order_header, order_detail }
  } catch {
    return null
  }
}


