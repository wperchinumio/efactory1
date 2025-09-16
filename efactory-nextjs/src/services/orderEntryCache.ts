import type { DraftOrderReadResponse, OrderReadResponse, OrderDetailDto, OrderHeaderDto } from '@/types/api/orderpoints'

const STORAGE_KEY = 'efactory_orderpoints_draft_payload'

type ReadUnion = OrderReadResponse | DraftOrderReadResponse

export interface NormalizedDraftData {
  order_header: OrderHeaderDto
  order_detail: OrderDetailDto[]
  isDraft: boolean
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
    // First check sessionStorage (from drafts page, clone action, and edit action)
    let raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      window.sessionStorage.removeItem(STORAGE_KEY)
      const parsed: any = JSON.parse(raw)
      
      // Handle different response structures:
      // 1. Draft: { data: { draft_order: { order_header: {...}, order_detail: [...] } } }
      // 2. Read-from-draft: { data: { ... }, from_draft: true }
      // 3. Fallback: { draft_order: {...} }
      let base: any
      if (parsed?.data?.draft_order) {
        base = parsed.data.draft_order
      } else if (parsed?.draft_order) {
        base = parsed.draft_order
      } else if (parsed?.data?.order_header) {
        base = parsed.data
      } else {
        base = parsed
      }
      
      const order_header = (base as any).order_header || {}
      const order_detail = (base as any).order_detail || []
      
      // Determine draft status robustly
      const readFlag = parsed?.from_draft === true || parsed?.data?.from_draft === true
      const hasDraftOrder = !!(parsed?.draft_order || parsed?.data?.draft_order)
      // Only trust explicit legacy signals; do not infer by order_id shape
      const isDraft = !!(readFlag || hasDraftOrder)
      return { order_header, order_detail, isDraft }
    }
    
    // Then check localStorage (legacy fallback)
    raw = window.localStorage.getItem('orderDraft')
    if (raw) {
      window.localStorage.removeItem('orderDraft')
      const parsed = JSON.parse(raw)
      const order_header = parsed.order_header || {}
      const order_detail = parsed.order_detail || []
      // LocalStorage fallback originates from older flows; treat as non-draft by default
      return { order_header, order_detail, isDraft: false }
    }
    
    return null
  } catch (error) {
    console.error('Error consuming draft data:', error)
    return null
  }
}


