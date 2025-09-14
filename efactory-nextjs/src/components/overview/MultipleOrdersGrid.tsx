import React from 'react'
import { useRouter } from 'next/router'
import type { OrderDetailDto } from '@/types/api/orders'
import { Button } from '@/components/ui/shadcn/button'

export default function MultipleOrdersGrid({ orders, onClose }: { orders: OrderDetailDto[]; onClose?: () => void }) {
  const router = useRouter()
  function openOrder(order_number: string, account_number: string) {
    const current = router.pathname
    const href = `${current}?orderNum=${encodeURIComponent(order_number)}&accountNum=${encodeURIComponent(account_number || '')}`
    router.push(href)
  }

  return (
    <div className="bg-card-color border border-border-color rounded-xl overflow-hidden">
      {onClose && (
        <div className="flex items-center justify-between p-3 border-b border-border-color bg-card-color">
          <Button onClick={onClose} variant="destructive" className="uppercase tracking-wide">Close</Button>
          <div className="text-sm text-font-color-100">Multiple orders found · Select account</div>
        </div>
      )}
      <div className="px-4 py-3 border-b border-border-color text-sm text-font-color">
        There are (<b>{orders.length}</b>) orders with the same order number. Please select an account.
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-primary-10 border-b border-border-color text-xs uppercase text-font-color">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left"></th>
              <th className="px-3 py-2 text-left">Account #</th>
              <th className="px-3 py-2 text-left">Order Stage</th>
              <th className="px-3 py-2 text-left">Ship To</th>
              <th className="px-3 py-2 text-left">Receipt Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {orders.map((o, idx) => (
              <tr key={o.id} className="hover:bg-primary-5 transition-colors">
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2">
                  <button
                    className="text-primary hover:underline font-semibold"
                    onClick={() => openOrder(o.order_number, o.account_number)}
                  >
                    {o.account_number}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-10 text-primary text-xs font-semibold">
                    {o.stage_description || o.order_stage}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {o.shipping_address && (
                    <div>
                      <div className="text-primary text-xs">
                        {(o.shipping_address.company || '') + (o.shipping_address.company && o.shipping_address.attention ? ' | ' : '') + (o.shipping_address.attention || '')}
                      </div>
                      <div className="text-xs text-font-color-100">
                        {(o.shipping_address.city ? o.shipping_address.city + ',' : '')}
                        {o.shipping_address.state_province || ''}
                        {(o.shipping_address.postal_code ? ' ' + o.shipping_address.postal_code : '')}
                        {(o.shipping_address.country ? ' - ' + o.shipping_address.country : '')}
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">{o.received_date ? new Date(o.received_date).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


