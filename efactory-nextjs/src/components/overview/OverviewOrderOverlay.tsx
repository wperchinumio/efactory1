import React from 'react'
import type { OrderDetailResult } from '@/types/api/orders'
import OrderOverview from './OrderOverview'
import MultipleOrdersGrid from './MultipleOrdersGrid'

export default function OverviewOrderOverlay({ result, onClose, onRefresh }: { result: OrderDetailResult; onClose: () => void; onRefresh?: () => void }) {
  if (result.kind === 'not_found') {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex p-4 md:p-8">
        <div className="bg-background rounded-xl shadow-2xl w-full max-w-[700px] mx-auto overflow-hidden">
          <div className="p-6 text-center text-font-color">Order not found.</div>
        </div>
      </div>
    )
  }
  if (result.kind === 'multiple') {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex p-4 md:p-8">
        <div className="bg-background rounded-xl shadow-2xl w-full max-w-[1000px] mx-auto overflow-hidden p-4 md:p-6">
          <MultipleOrdersGrid orders={result.orders} />
        </div>
      </div>
    )
  }
  return <OrderOverview data={result.order} onClose={onClose} variant="overlay" onRefresh={onRefresh} />
}


