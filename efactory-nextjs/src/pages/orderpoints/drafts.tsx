import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, ScrollArea, Input, CheckBox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@/components/ui'
import { listDrafts, deleteDrafts, readOrderPoints, toggleDraftTemplate } from '@/services/api'
import type { ListDraftsResponse } from '@/types/api/orderpoints'
import { useRouter } from 'next/router'
import { IconRefresh, IconTrash, IconEdit, IconFilter, IconCube, IconSearch } from '@tabler/icons-react'
import { storeOrderDraft } from '@/services/orderEntryCache'

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<ListDraftsResponse['draft_orders']>([])
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'draft' | 'template'>('all')
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
    const data = await readOrderPoints({ action: 'read', order_id, from_draft: true })
    storeOrderDraft(data as any)
    router.push('/orderpoints')
  }

  const allChecked = useMemo(() => {
    const visible = getVisibleDrafts()
    if (!visible.length) return false
    return visible.every(d => !!selected[d.order_id])
  }, [selected, drafts, filter, typeFilter])

  function toggleAll() {
    const next: Record<number, boolean> = { ...selected }
    const visible = getVisibleDrafts()
    const shouldSelectAll = !allChecked
    visible.forEach(d => { next[d.order_id] = shouldSelectAll })
    setSelected(next)
  }

  function getVisibleDrafts() {
    const q = filter.trim().toLowerCase()
    let rows = drafts
    if (typeFilter !== 'all') rows = rows.filter(r => !!(r as any).is_template === (typeFilter === 'template'))
    if (!q) return rows
    return rows.filter((d: any) => {
      const paddedId = String(d.order_id).padStart(6, '0')
      const draftIdMatches = paddedId.startsWith(q) || paddedId.includes(q) || String(d.order_id).includes(q)
      const orderNumMatches = String(d.order_number || '').toLowerCase().includes(q)
      const accountMatches = String(d.account_number || '').toLowerCase().includes(q)
      const locationMatches = String(d.location || '').toLowerCase().includes(q)
      const poMatches = String(d.po_number || '').toLowerCase().includes(q)
      const shipCompanyMatches = String(d?.shipping_address?.company || '').toLowerCase().includes(q)
      const shipCityMatches = String(d?.shipping_address?.city || '').toLowerCase().includes(q)
      return (
        draftIdMatches || orderNumMatches || accountMatches || locationMatches || poMatches || shipCompanyMatches || shipCityMatches
      )
    })
  }

  async function onToggleTemplate(order_id: number, current: boolean) {
    await toggleDraftTemplate(order_id, !current)
    await reload()
  }

  const rows = getVisibleDrafts()

  return (
    <div className="md:px-6 sm:px-3 pt-6 md:pt-8 bg-body-color">
      <div className="container-fluid mb-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-[24px]/[32px] font-bold text-font-color mb-1">OrderPoints Drafts</h1>
              <p className="text-font-color-100 text-[14px]/[20px]">Manage your saved drafts and templates</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={reload}>
                <IconRefresh className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="danger" onClick={onDelete} disabled={!Object.values(selected).some(Boolean)}>
                <IconTrash className="w-4 h-4" />
                Delete Selected
              </Button>
            </div>
          </div>

          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="relative w-full sm:w-[340px]">
                <IconSearch className="w-[16px] h-[16px] text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input className="pl-9" placeholder="Search drafts..." value={filter} onChange={e=>setFilter(e.target.value)} />
              </div>
              <div className="flex items-center gap-3">
                <Select value={typeFilter} onValueChange={(v: string)=>setTypeFilter(v as any)}>
                  <SelectTrigger className="min-w-[160px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                    <SelectItem value="template">Templates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead className="bg-body-color border-b border-border-color">
                  <tr className="text-left text-font-color text-[13px] font-semibold">
                    <th className="py-2.5 px-3 w-[44px]">
                      <CheckBox checked={allChecked} onChange={toggleAll} />
                    </th>
                    <th className="py-2.5 px-3">Draft #</th>
                    <th className="py-2.5 px-3">Order #</th>
                    <th className="py-2.5 px-3">Account</th>
                    <th className="py-2.5 px-3">Warehouse</th>
                    <th className="py-2.5 px-3">PO #</th>
                    <th className="py-2.5 px-3">Ship To</th>
                    <th className="py-2.5 px-3 text-center">Type</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-font-color-100">No drafts found</td>
                    </tr>
                  ) : (
                    rows.map((d: any) => {
                      const isSelected = !!selected[d.order_id]
                      const shipLine = d?.shipping_address ? `${d.shipping_address.company || ''}${(d.shipping_address.company && d.shipping_address.attention) ? ' | ' : ''}${d.shipping_address.attention || ''}` : ''
                      const shipCity = d?.shipping_address ? `${d.shipping_address.city ? d.shipping_address.city + ',' : ''} ${d.shipping_address.state_province || ''} ${d.shipping_address.postal_code ? d.shipping_address.postal_code + '-' : ''} ${d.shipping_address.country || ''}` : ''
                      return (
                        <tr key={d.order_id} className="border-b border-border-color hover:bg-primary-10 transition-colors">
                          <td className="py-2.5 px-3">
                            <CheckBox checked={isSelected} onChange={()=>setSelected(prev=>({ ...prev, [d.order_id]: !isSelected }))} />
                          </td>
                          <td className="py-2.5 px-3">
                            <button className="text-primary hover:underline font-semibold flex items-center gap-2" onClick={()=>onEdit(d.order_id)}>
                              {d.is_template && <IconCube className="w-4 h-4 text-info" />}
                              {String(d.order_id).padStart(6, '0')}
                            </button>
                          </td>
                          <td className="py-2.5 px-3">{d.order_number || '-'}</td>
                          <td className="py-2.5 px-3">{d.account_number || '-'}</td>
                          <td className="py-2.5 px-3">{d.location || '-'}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">{d.po_number || '-'}</td>
                          <td className="py-2.5 px-3">
                            <div className="text-[13px] text-font-color">
                              <i className="text-info">{shipLine}</i>
                              <div className="text-font-color-100">{shipCity}</div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {d.is_template ? (
                              <Badge className="min-w-[84px] justify-center" variant="info" outline>Template</Badge>
                            ) : (
                              <Badge className="min-w-[84px] justify-center" variant="default" outline>Draft</Badge>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <Button size="small" className="mr-2" onClick={()=>onEdit(d.order_id)}>
                              <IconEdit className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button size="small" variant="outline" onClick={()=>onToggleTemplate(d.order_id, !!d.is_template)}>
                              <IconFilter className="w-4 h-4" />
                              {d.is_template ? 'Unset Template' : 'Set Template'}
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}


