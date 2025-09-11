import React, { useEffect, useState } from 'react'
import { Button, Card, ScrollArea } from '@/components/ui'
import { listDrafts, deleteDrafts, readOrderPoints } from '@/services/api'
import type { ListDraftsResponse } from '@/types/api/orderpoints'
import { useRouter } from 'next/router'

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<ListDraftsResponse['draft_orders']>([])
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const router = useRouter()

  async function reload() {
    const res = await listDrafts()
    setDrafts(res.draft_orders || [])
    setSelected({})
  }

  useEffect(()=>{ reload() }, [])

  async function onDelete() {
    const ids = Object.keys(selected).filter(k => selected[+k]).map(k => +k)
    if (!ids.length) return
    await deleteDrafts(ids)
    await reload()
  }

  async function onEdit(order_id: number) {
    await readOrderPoints({ action: 'read', order_id, from_draft: true })
    router.push('/orderpoints')
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Button onClick={reload}>Refresh</Button>
        <Button variant="danger" onClick={onDelete}>Delete Selected</Button>
      </div>
      <Card>
        <ScrollArea style={{ maxHeight: 520 }}>
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Order #</th>
                <th className="p-2 text-left">Account</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Template</th>
                <th className="p-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((d, idx)=> (
                <tr key={d.order_id} className="border-t">
                  <td className="p-2"><input type="checkbox" checked={!!selected[d.order_id]} onChange={e=>setSelected(prev=>({ ...prev, [d.order_id]: e.target.checked }))} /></td>
                  <td className="p-2">{(d as any).order_number || '-'}</td>
                  <td className="p-2">{(d as any).account_number || '-'}</td>
                  <td className="p-2">{(d as any).location || '-'}</td>
                  <td className="p-2">{(d as any).is_template ? 'Yes' : 'No'}</td>
                  <td className="p-2"><Button size="small" onClick={()=>onEdit(d.order_id)}>Edit</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </Card>
    </div>
  )
}


