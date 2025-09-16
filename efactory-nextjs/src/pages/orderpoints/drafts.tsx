import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, ScrollArea, Input, CheckBox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui'
import { listDrafts, deleteDrafts, readOrderPoints, toggleDraftTemplate } from '@/services/api'
import type { ListDraftsResponse } from '@/types/api/orderpoints'
import { useRouter } from 'next/router'
import { IconRefresh, IconTrash, IconEdit, IconFilter, IconCube, IconSearch, IconPlus, IconClock, IconCalendar, IconBuilding, IconMapPin, IconShoppingCart, IconTemplate, IconFileText, IconChevronDown, IconX } from '@tabler/icons-react'
import { storeOrderDraft } from '@/services/orderEntryCache'

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<ListDraftsResponse['draft_orders']>([])
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'draft' | 'template'>('all')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const bulkMenuRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  async function reload() {
    setLoading(true)
    try {
      const res = await listDrafts()
      setDrafts(res.draft_orders || [])
      setSelected({})
    } catch (error) {
      console.error('Failed to load drafts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ reload() }, [])

  // Close bulk actions menu on outside click / Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent){
      if (!showBulkActions) return
      const t = e.target as Node
      if (bulkMenuRef.current && t && !bulkMenuRef.current.contains(t)) setShowBulkActions(false)
    }
    function onKey(e: KeyboardEvent){ if (e.key === 'Escape') setShowBulkActions(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [showBulkActions])

  async function onDelete() {
    const ids = Object.keys(selected).filter(k => selected[+k]).map(k => +k)
    if (!ids.length) return
    
    setDeleting(true)
    try {
      await deleteDrafts(ids)
      await reload()
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Failed to delete drafts:', error)
    } finally {
      setDeleting(false)
    }
  }

  async function onEdit(order_id: number) {
    const data = await readOrderPoints({ action: 'read', order_id, from_draft: true })
    // Normalize to legacy draft shape so OrderPoints detects draft mode reliably
    const responseData = { data: { draft_order: data } } as any
    storeOrderDraft(responseData)
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
    try {
      await toggleDraftTemplate(order_id, !current)
      await reload()
    } catch (error) {
      console.error('Failed to toggle template:', error)
    }
  }



  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault()
            reload()
            break
          case 'a':
            e.preventDefault()
            toggleAll()
            break
          case 'd':
            e.preventDefault()
            if (Object.values(selected).some(Boolean)) {
              setShowDeleteConfirm(true)
            }
            break
        }
      }
      if (e.key === 'Escape') {
        setShowDeleteConfirm(false)
        setShowBulkActions(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selected])

  const rows = getVisibleDrafts()
  const selectedCount = Object.values(selected).filter(Boolean).length
  const draftCount = drafts.filter(d => !d.is_template).length
  const templateCount = drafts.filter(d => d.is_template).length

  return (
    <div className="min-h-screen bg-body-color">
      {/* Header with Title and Actions */}
      <div className="bg-card-color border-b border-border-color px-6 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-font-color mb-0.5 flex items-center gap-2">
              OrderPoints Drafts
            </h1>
            <p className="text-sm text-font-color-100">
              Manage your saved drafts and templates
              <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs">
                <IconFileText className="w-3 h-3" />
                {draftCount} Drafts
              </span>
              <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs">
                <IconTemplate className="w-3 h-3" />
                {templateCount} Templates
              </span>
              {selectedCount > 0 && (
                <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded text-xs">
                  <IconShoppingCart className="w-3 h-3" />
                  {selectedCount} Selected
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button 
                variant="outline" 
                onClick={reload} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                <IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              
              {selectedCount > 0 && (
                <div className="relative" ref={bulkMenuRef as any}>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="flex items-center gap-2"
                  >
                    <IconChevronDown className="w-4 h-4" />
                    Bulk Actions
                  </Button>
                  
                  {showBulkActions && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card-color border border-border-color rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <Button 
                          variant="danger" 
                          size="small" 
                          className="w-full justify-start"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          <IconTrash className="w-4 h-4 mr-2" />
                          Delete Selected
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <Button 
                onClick={() => router.push('/orderpoints')}
                className="flex items-center gap-2"
              >
                <IconPlus className="w-4 h-4" />
                New Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-6 border-b border-border-color bg-card-color">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <IconSearch className="w-4 h-4 text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  className="pl-10" 
                  placeholder="Search drafts by ID, order number, account, warehouse, PO, or address..." 
                  value={filter} 
                  onChange={e => setFilter(e.target.value)} 
                />
              </div>
              <div className="flex gap-3">
                <Select value={typeFilter} onValueChange={(v: string) => setTypeFilter(v as any)}>
                  <SelectTrigger className="w-56 sm:w-64">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="draft">Drafts Only</SelectItem>
                    <SelectItem value="template">Templates Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <IconRefresh className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-font-color-100">Loading drafts...</span>
                </div>
              </div>
            ) : rows.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <IconFileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-font-color mb-1">No drafts found</h3>
                    <p className="text-font-color-100 text-sm">
                      {filter ? 'Try adjusting your search criteria' : 'Create your first draft to get started'}
                    </p>
                  </div>
                  {!filter && (
                    <Button onClick={() => router.push('/orderpoints')} className="mt-2">
                      <IconPlus className="w-4 h-4 mr-2" />
                      Create New Draft
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <table className="w-full min-w-[1200px]">
                <thead className="bg-primary-10 border-b border-border-color">
                  <tr className="text-left text-font-color text-sm font-semibold">
                    <th className="py-4 px-4 w-12">
                      <CheckBox checked={allChecked} onChange={toggleAll} />
                    </th>
                    <th className="py-4 px-4">Draft #</th>
                    <th className="py-4 px-4">Order #</th>
                    <th className="py-4 px-4">Account</th>
                    <th className="py-4 px-4">Warehouse</th>
                    <th className="py-4 px-4">PO #</th>
                    <th className="py-4 px-4">Ship To</th>
                    <th className="py-4 px-4 text-center">Type</th>
                    <th className="py-4 px-4 text-right w-56">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {rows.map((d: any) => {
                    const isSelected = !!selected[d.order_id]
                    const shipLine = d?.shipping_address ? `${d.shipping_address.company || ''}${(d.shipping_address.company && d.shipping_address.attention) ? ' | ' : ''}${d.shipping_address.attention || ''}` : ''
                    const shipCity = d?.shipping_address ? `${d.shipping_address.city ? d.shipping_address.city + ',' : ''} ${d.shipping_address.state_province || ''} ${d.shipping_address.postal_code ? d.shipping_address.postal_code + '-' : ''} ${d.shipping_address.country || ''}` : ''
                    return (
                      <tr 
                        key={d.order_id} 
                        className={`hover:bg-primary-10 transition-colors ${isSelected ? 'bg-primary-10' : ''}`}
                      >
                        <td className="py-4 px-4">
                          <CheckBox 
                            checked={isSelected} 
                            onChange={() => setSelected(prev => ({ ...prev, [d.order_id]: !isSelected }))} 
                          />
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            className="text-primary hover:underline font-semibold flex items-center gap-2 group" 
                            onClick={() => onEdit(d.order_id)}
                          >
                            {d.is_template && <IconCube className="w-4 h-4 text-green-600 dark:text-green-400" />}
                            <span className="font-mono text-sm">{String(d.order_id).padStart(6, '0')}</span>
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-font-color">
                            {d.order_number || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-font-color">
                            {d.account_number || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-font-color">
                            {d.location || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-font-color whitespace-nowrap">
                            {d.po_number || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            {shipLine ? (
                              <>
                                <div className="text-secondary italic font-medium">
                                  {shipLine}
                                </div>
                                <div className="text-font-color text-xs mt-1">
                                  {shipCity}
                                </div>
                              </>
                            ) : (
                              <span className="text-font-color-100">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {d.is_template ? (
                            <Badge className="bg-green-600 text-white dark:bg-green-700 dark:text-green-100 border-green-600 dark:border-green-700">
                              <IconTemplate className="w-3 h-3 mr-1" />
                              Template
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-600 text-white dark:bg-blue-700 dark:text-blue-100 border-blue-600 dark:border-blue-700">
                              <IconFileText className="w-3 h-3 mr-1" />
                              Draft
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right w-56">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="small" 
                              variant="outline"
                              onClick={() => onEdit(d.order_id)}
                              className="flex items-center gap-1 whitespace-nowrap"
                            >
                              <IconEdit className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button 
                              size="small" 
                              variant="outline"
                              onClick={() => onToggleTemplate(d.order_id, !!d.is_template)}
                              className="flex items-center gap-1 whitespace-nowrap"
                            >
                              <IconFilter className="w-3 h-3" />
                              {d.is_template ? 'Unset Template' : 'Set Template'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Selected Drafts</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} selected draft{selectedCount > 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={onDelete}
              disabled={deleting}
              className="flex items-center gap-2"
            >
              {deleting ? (
                <>
                  <IconRefresh className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <IconTrash className="w-4 h-4" />
                  Delete {selectedCount} Draft{selectedCount > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


