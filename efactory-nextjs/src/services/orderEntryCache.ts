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
    // First check sessionStorage (from drafts page, clone action, and edit action)
    let raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      window.sessionStorage.removeItem(STORAGE_KEY)
      const parsed: ReadUnion = JSON.parse(raw)
      
      // Handle different response structures:
      // 1. Draft: { data: { draft_order: { order_header: {...}, order_detail: [...] } } }
      // 2. Regular order: { data: { order_header: {...}, order_detail: [...] } }
      let base
      if ((parsed as any).data?.draft_order) {
        // Draft order structure
        base = (parsed as any).data.draft_order
      } else if ((parsed as any).data?.order_header) {
        // Regular order structure
        base = (parsed as any).data
      } else {
        // Fallback to direct structure
        base = (parsed as any).draft_order || parsed
      }
      
      const order_header = (base as any).order_header || {}
      const order_detail = (base as any).order_detail || []
      
      // Return additional metadata about whether this is a draft
      const isDraft = (parsed as any).data?.draft_order !== undefined
      return { order_header, order_detail, isDraft }
    }
    
    // Then check localStorage (legacy fallback)
    raw = window.localStorage.getItem('orderDraft')
    if (raw) {
      window.localStorage.removeItem('orderDraft')
      const parsed = JSON.parse(raw)
            const order_header = parsed.order_header || {}
            const order_detail = parsed.order_detail || []
            return { order_header, order_detail, isDraft: false } // localStorage fallback is not a draft
    }
    
    return null
  } catch (error) {
    console.error('Error consuming draft data:', error)
    return null
  }
}


