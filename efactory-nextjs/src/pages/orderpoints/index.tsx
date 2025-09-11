import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { Button, Card, Input, CheckBox, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, ScrollArea } from '@/components/ui'
import { getAuthState } from '@/lib/auth/guards'
import {
  generateOrderNumber,
  saveDraft,
  saveEntry,
  fetchInventoryForCart,
} from '@/services/api'
import type { OrderHeaderDto, OrderDetailDto, InventoryStatusForCartBody, AddressDto } from '@/types/api/orderpoints'

export default function OrderPointsPage() {
  // Guard: redirect handled globally; here ensure auth exists
  const auth = getAuthState()
  if (!auth.isAuthenticated) {
    if (typeof window !== 'undefined') window.location.href = '/auth/sign-in'
  }
  const router = useRouter()

  const [orderHeader, setOrderHeader] = useState<OrderHeaderDto>({ order_status: 1, ordered_date: new Date().toISOString().slice(0,10) })
  const [orderDetail, setOrderDetail] = useState<OrderDetailDto[]>([])
  const [accountNumberLocation, setAccountNumberLocation] = useState('')
  const [shippingAddress, setShippingAddress] = useState<AddressDto>({ country: 'US' })
  const [billingAddress, setBillingAddress] = useState<AddressDto>({})
  const [findItemValue, setFindItemValue] = useState('')
  const gridRef = useRef<AgGridReact<OrderDetailDto>>(null)
  // Browse Items modal state
  const [browseOpen, setBrowseOpen] = useState(false)
  const [itemFilter, setItemFilter] = useState('')
  const [showZeroQty, setShowZeroQty] = useState(false)
  const [warehouses, setWarehouses] = useState<string>('')
  const [inventory, setInventory] = useState<Record<string, { item_number: string; description: string; qty_net: number; quantity?: number; price?: number }>>({})

  const columns = useMemo<any[]>(() => ([
    { headerName: '#', field: 'line_number', width: 90, sortable: false },
    { headerName: 'Item #', field: 'item_number', width: 140 },
    { headerName: 'Description', field: 'description', flex: 1 },
    { headerName: 'Qty', field: 'quantity', width: 110, editable: (p:any) => !p.data?.is_kit_component && !p.data?.voided, cellClass: (p:any)=> p.data?.is_kit_component? 'ag-disabled': '' },
    { headerName: 'Unit Price', field: 'price', width: 120, editable: true },
    { headerName: 'Ext Price', valueGetter: (params:any) => (params.data.quantity || 0) * (params.data.price || 0), width: 130 },
    { headerName: "Don't Ship Before", field: 'do_not_ship_before', width: 160, editable: (p:any)=> !p.data?.is_kit_component },
    { headerName: 'Ship By', field: 'ship_by', width: 130, editable: (p:any)=> !p.data?.is_kit_component },
  ]), [])

  function renumberDraftLines(lines: OrderDetailDto[]): OrderDetailDto[] {
    // Re-sequence master lines 1..N and kit components 1001/2001 under their parent
    let masterCounter = 0
    const parentMap: Record<number, number> = {}
    const compCounters: Record<number, number> = {}
    const sorted = [...lines].sort((a,b)=>{
      const aKey = a.line_number > 1000 ? Math.floor(a.line_number/1000) + (a.line_number%1000)/1000 : a.line_number
      const bKey = b.line_number > 1000 ? Math.floor(b.line_number/1000) + (b.line_number%1000)/1000 : b.line_number
      return aKey - bKey
    })
    return sorted.map(row => {
      if (!row.is_kit_component) {
        const newLine = ++masterCounter
        parentMap[Math.floor(row.line_number || 0)] = newLine
        return { ...row, line_number: newLine }
      } else {
        const oldParent = Math.floor(row.line_number / 1000)
        const newParent = parentMap[oldParent] || oldParent
        compCounters[newParent] = (compCounters[newParent] || 0) + 1
        const compLine = newParent * 1000 + compCounters[newParent]
        return { ...row, line_number: compLine }
      }
    })
  }

  async function onNewOrderNumber() {
    const number = await generateOrderNumber()
    const safeNumber: string = typeof number === 'string' ? number : String(number ?? '')
    setOrderHeader({ ...orderHeader, order_number: safeNumber })
  }

  async function onSaveDraft() {
    const header = buildOrderHeaderForSubmit(true)
    const res = await saveDraft(header, orderDetail)
    if (res?.order_number) setOrderHeader({ ...orderHeader, order_number: res.order_number })
  }

  async function onPlaceOrder() {
    const header = buildOrderHeaderForSubmit(false)
    const res = await saveEntry(header, orderDetail)
    if (res?.order_number) router.push(`/orders/${res.order_number}`)
  }

  function buildOrderHeaderForSubmit(toDraft: boolean): OrderHeaderDto {
    let account_number = ''
    let location = ''
    if (accountNumberLocation.trim()) {
      const parts = accountNumberLocation.split('.')
      account_number = parts[0] || ''
      location = parts[1] || ''
    }
    const amounts = {
      order_subtotal: orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0),
      shipping_handling: 0,
      balance_due_us: 0,
      amount_paid: 0,
      total_due: 0,
      net_due_currency: 0,
      international_handling: 0,
      international_declared_value: 0,
      sales_tax: 0,
      insurance: 0,
    }
    return {
      ...orderHeader,
      ...amounts,
      account_number,
      location,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    }
  }

  async function onBrowseItems() {
    setBrowseOpen(true)
  }

  function onRemoveSelected() {
    const api = gridRef.current?.api
    if (!api) return
    const selected = api.getSelectedRows() as OrderDetailDto[]
    if (!selected.length) return

    // Remove selected master rows; include their kit components
    const selectedKeys = new Set(selected.map(r => `${r.item_number}#${r.line_number}`))
    const selectedParentLines = new Set(selected.filter(r => !r.is_kit_component).map(r => r.line_number))
    const remaining = orderDetail.filter(r => {
      const key = `${r.item_number}#${r.line_number}`
      if (selectedKeys.has(key)) return false
      if (r.is_kit_component) {
        const parent = Math.floor(r.line_number/1000)
        if (selectedParentLines.has(parent)) return false
      }
      return true
    })
    setOrderDetail(renumberDraftLines(remaining))
  }

  // Warehouses options sourced from user token (same pattern as legacy). We keep basic select for now.
  function renderWarehouseOptions(): React.ReactNode {
    const auth = getAuthState()
    const all = (auth as any)?.userApps ? (window.localStorage.getItem('globalApiData') ? JSON.parse(window.localStorage.getItem('globalApiData') as string)?.warehouses : {}) : {}
    const options: React.ReactNode[] = []
    Object.keys(all || {}).forEach((loc)=>{
      const arr = all[loc] || []
      arr.forEach((w: any)=>{
        Object.keys(w).forEach((invType)=>{
          const val = `${loc}-${invType}`
          options.push(<option key={val} value={val}>{loc} - {invType}</option>)
        })
      })
    })
    return options
  }

  async function reloadInventory() {
    const and: any[] = []
    // Warehouse filter
    if (warehouses) {
      const [inv_region, inv_type] = warehouses.split('-')
      and.push({ field: 'inv_type', oper: '=', value: inv_type })
      and.push({ field: 'inv_region', oper: '=', value: inv_region })
    }
    and.push({ field: 'omit_zero_qty', oper: '=', value: !showZeroQty })
    if (itemFilter) {
      and.push({ field: 'name', oper: '=', value: itemFilter })
    }

    const payload: Omit<InventoryStatusForCartBody,'resource'|'action'> = {
      page_num: 1,
      page_size: 100,
      sort: [{ item_number: 'asc' } as any],
      filter: { and },
    }
    const rows = await fetchInventoryForCart(payload)
    const hash: any = {}
    const existing = new Map(orderDetail.map(od => [od.item_number, od]))
    rows.forEach(r => {
      const added = existing.get(r.item_number)
      hash[r.item_number] = {
        ...r,
        quantity: added ? added.quantity : undefined,
        price: added ? added.price : undefined,
      }
    })
    setInventory(hash)
  }

  useEffect(()=>{ if (browseOpen) reloadInventory() }, [browseOpen])

  function updateInventoryField(item_number: string, field: 'quantity' | 'price', value: string) {
    const v = value.trim()
    if (v !== '' && !isFiniteNumber(v)) return
    setInventory(prev => {
      const current = prev[item_number]
      if (!current) return prev
      return {
        ...prev,
        [item_number]: {
          ...current,
          [field]: v === '' ? undefined : +v
        }
      }
    })
  }

  function addSelectedItemsToOrder() {
    const items = Object.values(inventory).filter((it): it is NonNullable<typeof inventory[string]> => isFiniteNumber((it as any).quantity))
    if (!items.length) { setBrowseOpen(false); return }
    const hash = new Map(orderDetail.map(od => [od.item_number, od]))
    let next = [...orderDetail]
    items.forEach(it => {
      const exists = hash.get(it.item_number)
      if (exists) {
        exists.quantity = (it.quantity as number)
        exists.price = (isFiniteNumber((it as any).price) ? (it.price as number) : (exists.price || 0))
      } else {
        const maxLine = next.filter(l => !l.is_kit_component).reduce((m,l) => Math.max(m, l.line_number||0), 0)
        next.push({
          detail_id: 0,
          line_number: maxLine + 1,
          item_number: it.item_number,
          description: it.description,
          quantity: ((it as any).quantity as number) || 1,
          price: (isFiniteNumber((it as any).price) ? (it.price as number) : 0),
          do_not_ship_before: new Date().toISOString().slice(0,10),
          ship_by: new Date(Date.now() + 86400000).toISOString().slice(0,10),
          voided: false,
        })
      }
    })
    setOrderDetail(renumberDraftLines(next))
    setBrowseOpen(false)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={onNewOrderNumber} variant="primary">New Order</Button>
        <Button onClick={onSaveDraft} variant="secondary">Save Draft</Button>
        <Button onClick={onPlaceOrder} variant="primary">Place Order</Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Items</h3>
            <div className="flex gap-2">
              <input
                placeholder="Add item…"
                className="border rounded px-2 py-1 text-xs"
                value={findItemValue}
                onChange={e=>setFindItemValue(e.target.value)}
                onKeyDown={e=>{ if (e.key === 'Enter') onBrowseItems() }}
                style={{ width: 200 }}
              />
              <Button size="small" onClick={onBrowseItems}>Browse Items…</Button>
              <Button size="small" variant="danger" onClick={onRemoveSelected}>Remove selected</Button>
            </div>
          </div>
          <div className="ag-theme-alpine" style={{ height: 420 }}>
            <AgGridReact
              ref={gridRef as any}
              columnDefs={columns as any}
              rowData={orderDetail}
              rowSelection="multiple"
              isRowSelectable={(p:any)=> !p.data?.is_kit_component && !p.data?.voided}
              suppressRowClickSelection={true}
              onCellValueChanged={(e:any)=>{
              const idx = e.node.rowIndex
              setOrderDetail(prev => {
                const updated = prev.map((r,i)=> i===idx? { ...r, [e.colDef.field!]: Number.isFinite(+e.newValue)? +e.newValue : e.newValue }: r)
                return renumberDraftLines(updated)
              })
            }} />
          </div>
        </Card>

        <div className="col-span-4 space-y-4">
          <Card>
            <h3 className="text-sm font-semibold mb-2">Order Header</h3>
            <div className="text-xs grid grid-cols-2 gap-2">
              <div>
                <div className="text-muted-foreground">Order #</div>
                <div className="font-mono">{orderHeader.order_number || '-'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">PO #</div>
                <input className="w-full border rounded px-2 py-1 text-xs" value={orderHeader.po_number || ''} onChange={e=>setOrderHeader(p=>({ ...p, po_number: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <div className="text-muted-foreground">Account# . Warehouse</div>
                <input className="w-full border rounded px-2 py-1 text-xs" value={accountNumberLocation} onChange={e=>setAccountNumberLocation(e.target.value)} placeholder="12345.LOC" />
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-2">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input className="border rounded px-2 py-1" placeholder="Address 1" value={shippingAddress.address1||''} onChange={e=>setShippingAddress({...shippingAddress,address1:e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="Address 2" value={shippingAddress.address2||''} onChange={e=>setShippingAddress({...shippingAddress,address2:e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="City" value={shippingAddress.city||''} onChange={e=>setShippingAddress({...shippingAddress,city:e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="State" value={shippingAddress.state_province||''} onChange={e=>setShippingAddress({...shippingAddress,state_province:e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="Postal Code" value={shippingAddress.postal_code||''} onChange={e=>setShippingAddress({...shippingAddress,postal_code:e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="Country" value={shippingAddress.country||''} onChange={e=>setShippingAddress({...shippingAddress,country:e.target.value})} />
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-2">Billing Address</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input className="border rounded px-2 py-1" placeholder="Address 1" value={billingAddress.address1||''} onChange={e=>setBillingAddress({...billingAddress,address1:e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="Address 2" value={billingAddress.address2||''} onChange={e=>setBillingAddress({...billingAddress,address2:e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="City" value={billingAddress.city||''} onChange={e=>setBillingAddress({...billingAddress,city:e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="State" value={billingAddress.state_province||''} onChange={e=>setBillingAddress({...billingAddress,state_province:e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="Postal Code" value={billingAddress.postal_code||''} onChange={e=>setBillingAddress({...billingAddress,postal_code:e.target.value})} />
              <input className="border rounded px-2 py-1" placeholder="Country" value={billingAddress.country||''} onChange={e=>setBillingAddress({...billingAddress,country:e.target.value})} />
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-2">Amounts</h3>
            <div className="text-xs grid grid-cols-2 gap-1">
              <div>Order Amount:</div>
              <div className="text-right font-mono">{orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0).toFixed(2)}</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Browse Items Modal */}
      <Dialog open={browseOpen} onOpenChange={setBrowseOpen}>
        <DialogContent style={{ maxWidth: 900 }}>
          <DialogHeader>
            <DialogTitle>Browse Items</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 mb-3">
            <Input
              placeholder="Search by item # or description"
              value={itemFilter}
              onChange={e=>setItemFilter(e.target.value)}
              style={{ maxWidth: 280 }}
            />
            <label className="flex items-center gap-2 text-xs">
              <CheckBox checked={showZeroQty} onChange={(checked)=>setShowZeroQty(checked)} />
              Show 0 QTY
            </label>
            <select
              className="border rounded px-2 py-1 text-xs"
              value={warehouses}
              onChange={e=>setWarehouses(e.target.value)}
            >
              <option value="">Warehouse: All</option>
              {renderWarehouseOptions()}
            </select>
            <Button size="small" onClick={()=>reloadInventory()}>Refresh</Button>
          </div>
          <ScrollArea style={{ maxHeight: 420 }}>
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Item # / Description</th>
                  <th className="text-right p-2">Qty</th>
                  <th className="text-right p-2">Unit Price</th>
                  <th className="text-right p-2">Net Avail</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(inventory).map((key, idx)=>{
                  const it = inventory[key]!
                  return (
                    <tr key={key} className="border-t">
                      <td className="p-2">{idx+1}</td>
                      <td className="p-2">
                        <div className="font-medium">{it.item_number}</div>
                        <div className="opacity-70">{it.description}</div>
                      </td>
                      <td className="p-2 text-right">
                        <Input
                          value={typeof it.quantity === 'number' ? String(it.quantity) : ''}
                          onChange={e=>updateInventoryField(it.item_number, 'quantity', e.target.value)}
                          className="text-right"
                          style={{ width: 80 }}
                        />
                      </td>
                      <td className="p-2 text-right">
                        <Input
                          value={typeof it.price === 'number' ? String(it.price) : ''}
                          onChange={e=>updateInventoryField(it.item_number, 'price', e.target.value)}
                          className="text-right"
                          style={{ width: 90 }}
                        />
                      </td>
                      <td className="p-2 text-right">{it.qty_net}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </ScrollArea>
          <DialogFooter>
            <Button variant="ghost" onClick={()=>setBrowseOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={addSelectedItemsToOrder}>Add to order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function isFiniteNumber(v: any): v is number {
  const n = +v
  return Number.isFinite(n)
}


