import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
// Styles are imported globally in _app.tsx for reliability
import { Button, Card, CardContent, CardHeader, CardTitle, Input, CheckBox, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Label } from '@/components/ui'
import { getAuthState } from '@/lib/auth/guards'
import {
  generateOrderNumber,
  saveDraft,
  saveEntry,
  fetchInventoryForCart,
} from '@/services/api'
import type { OrderHeaderDto, OrderDetailDto, InventoryStatusForCartBody, AddressDto } from '@/types/api/orderpoints'

// AG Grid must be client-only in Next.js
const AgGridReact = dynamic(() => 
  import('ag-grid-react').then(async (mod) => {
    // Register AG Grid modules and suppress console warnings
    const { ModuleRegistry, AllCommunityModule } = await import('ag-grid-community')
    ModuleRegistry.registerModules([AllCommunityModule])
    
    // Suppress deprecation warnings in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (args[0]?.includes?.('AG Grid:') && args[0]?.includes?.('deprecated')) {
          return; // Suppress AG Grid deprecation warnings
        }
        originalWarn.apply(console, args);
      };
    }
    
    return { default: mod.AgGridReact }
  }), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 text-font-color">Loading grid...</div>
}) as any

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
  const gridRef = useRef<any>(null)
  // Browse Items modal state
  const [browseOpen, setBrowseOpen] = useState(false)
  const [itemFilter, setItemFilter] = useState('')
  const [showZeroQty, setShowZeroQty] = useState(false)
  const [warehouses, setWarehouses] = useState<string>('')
  const [inventory, setInventory] = useState<Record<string, { item_number: string; description: string; qty_net: number; quantity?: number; price?: number }>>({})
  // Amounts & extra fields
  const [amounts, setAmounts] = useState({
    shipping_handling: 0,
    sales_tax: 0,
    discounts: 0,
    amount_paid: 0,
    insurance: 0,
    international_handling: 0,
    international_declared_value: 0,
  })
  const [extraLabels] = useState({
    header_cf_1: 'Custom Field 1',
    header_cf_2: 'Custom Field 2',
    header_cf_3: 'Custom Field 3',
    header_cf_4: 'Custom Field 4',
    header_cf_5: 'Custom Field 5',
    detail_cf_1: 'Custom Field 1',
    detail_cf_2: 'Custom Field 2',
    detail_cf_5: 'Custom Field 5'
  })
  // Address validation
  const [validateOpen, setValidateOpen] = useState(false)
  const [validateResult, setValidateResult] = useState<{warnings?: any; errors?: any; correct_address?: AddressDto}>({})
  // Edit line modal
  const [editLineOpen, setEditLineOpen] = useState(false)
  const [editLineIndex, setEditLineIndex] = useState<number | null>(null)
  const [editLineData, setEditLineData] = useState<Partial<OrderDetailDto>>({})

  const columns = useMemo<any[]>(() => ([
    { headerName: '#', field: 'line_number', width: 60, sortable: false },
    { headerName: 'Item #', field: 'item_number', width: 120 },
    { headerName: 'Description', field: 'description', flex: 1, minWidth: 200 },
    { headerName: 'Qty', field: 'quantity', width: 80, editable: (p:any) => !p.data?.is_kit_component && !p.data?.voided, cellClass: (p:any)=> p.data?.is_kit_component? 'ag-disabled': '' },
    { headerName: 'Unit Price', field: 'price', width: 100, editable: true, valueFormatter: (params:any) => params.value ? `$${Number(params.value).toFixed(2)}` : '' },
    { headerName: 'Ext Price', valueGetter: (params:any) => (params.data.quantity || 0) * (params.data.price || 0), width: 100, valueFormatter: (params:any) => `$${Number(params.value || 0).toFixed(2)}` },
    { headerName: "Don't Ship", field: 'do_not_ship_before', width: 100, editable: (p:any)=> !p.data?.is_kit_component },
    { headerName: 'Ship By', field: 'ship_by', width: 100, editable: (p:any)=> !p.data?.is_kit_component },
    { headerName: '', width: 70, cellRenderer: (p:any)=> (
        <Button size="small" variant="outline" className="text-xs px-2 py-1" onClick={()=>{ setEditLineIndex(p.rowIndex); setEditLineData({ custom_field1: p.data.custom_field1||'', custom_field2: p.data.custom_field2||'', custom_field5: p.data.custom_field5||'', comments: p.data.comments||'' }); setEditLineOpen(true); }}>Edit</Button>
      )
    }
  ]), [])

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: false,
    menuTabs: [],
  }), [])

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
    const totals = orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0)
    const subtotal = totals
    const total_due = subtotal + (amounts.shipping_handling||0) + (amounts.sales_tax||0) + (amounts.international_handling||0)
    const net_due_currency = total_due - (amounts.amount_paid||0)
    return {
      ...orderHeader,
      order_subtotal: subtotal,
      shipping_handling: amounts.shipping_handling,
      balance_due_us: 0,
      amount_paid: amounts.amount_paid,
      total_due,
      net_due_currency,
      international_handling: amounts.international_handling,
      international_declared_value: amounts.international_declared_value,
      sales_tax: amounts.sales_tax,
      insurance: amounts.insurance,
      account_number,
      location,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    }
  }

  async function onValidateAddress() {
    const res = await (await import('@/services/api')).validateAddress({ action: 'validate_address', data: {
      address1: shippingAddress.address1 || '',
      address2: shippingAddress.address2 || '',
      city: shippingAddress.city || '',
      state_province: shippingAddress.state_province || '',
      postal_code: shippingAddress.postal_code || ''
    }})
    setValidateResult(res)
    setValidateOpen(true)
  }

  function onAcceptCorrectAddress() {
    if (validateResult?.correct_address) {
      const corrected = { ...validateResult.correct_address, country: 'US' }
      setShippingAddress(prev => ({ ...prev, ...corrected }))
    }
    setValidateOpen(false)
  }

  async function onBrowseItems() {
    // Quick add if toolbar has a value and single match exists; else open modal
    const trimmed = (findItemValue || '').trim()
    if (trimmed) {
      const rows = await fetchInventoryForCart({
        page_num: 1,
        page_size: 5,
        filter: { and: [ { field: 'omit_zero_qty', oper: '=', value: true }, { field: 'name', oper: '=', value: trimmed } ] }
      } as any)
      if (rows && rows.length === 1) {
        const first = rows[0] as NonNullable<typeof rows[number]>
        const maxLine = orderDetail.filter(l => !l.is_kit_component).reduce((m,l) => Math.max(m, l.line_number||0), 0)
        const newLine: OrderDetailDto = {
          detail_id: 0,
          line_number: maxLine + 1,
          item_number: first.item_number,
          description: first.description,
          quantity: 1,
          price: 0,
          do_not_ship_before: new Date().toISOString().slice(0,10),
          ship_by: new Date(Date.now() + 86400000).toISOString().slice(0,10),
          voided: false,
        }
        setOrderDetail(prev => renumberDraftLines([ ...prev, newLine ]))
        setFindItemValue('')
        return
      }
    }
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

  // Helper function to safely get warehouse options
  function getWarehouseOptions(): Array<{value: string, label: string}> {
    try {
      const auth = getAuthState() as any;
      if (!auth?.userApps) return [];
      
      const globalApiDataStr = window.localStorage.getItem('globalApiData');
      if (!globalApiDataStr) return [];
      
      const globalApiData = JSON.parse(globalApiDataStr);
      const warehousesData = globalApiData?.warehouses;
      if (!warehousesData || typeof warehousesData !== 'object') return [];
      
      const options: Array<{value: string, label: string}> = [];
      Object.keys(warehousesData).forEach((loc) => {
        const arr = warehousesData[loc] || [];
        if (Array.isArray(arr)) {
          arr.forEach((w: any) => {
            if (w && typeof w === 'object') {
              Object.keys(w).forEach((invType) => {
                const val = `${loc}-${invType}`;
                options.push({ value: val, label: `${loc} - ${invType}` });
              });
            }
          });
        }
      });
      return options;
    } catch (error) {
      console.error('Error loading warehouse options:', error);
      return [];
    }
  }

  async function reloadInventory() {
    const and: any[] = []
    // Warehouse filter
    if (warehouses && typeof warehouses === 'string') {
      const parts = warehouses.split('-')
      if (parts.length >= 2) {
        const [inv_region, inv_type] = parts
        and.push({ field: 'inv_type', oper: '=', value: inv_type })
        and.push({ field: 'inv_region', oper: '=', value: inv_region })
      }
    }
    and.push({ field: 'omit_zero_qty', oper: '=', value: !showZeroQty })
    if (itemFilter && typeof itemFilter === 'string') {
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
    <div className="bg-body-color min-h-screen">
      {/* Top Action Bar */}
      <div className="bg-card-color border-b border-border-color p-4">
        <div className="flex items-center gap-3">
          <Button onClick={onNewOrderNumber} className="bg-primary text-white hover:bg-primary/90">
            New Order
          </Button>
          <Button onClick={onSaveDraft} variant="outline" className="border-border-color">
            Save Draft
          </Button>
          <Button onClick={onPlaceOrder} className="bg-success text-white hover:bg-success/90">
            Place Order
          </Button>
        </div>
      </div>

      <div className="container-fluid p-4 space-y-4">

        {/* Top row: Order Header (6) + Shipping Address (6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <Card className="lg:col-span-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Header</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-font-color-100 text-sm">Order #</Label>
                    <div className="font-mono text-font-color bg-body-color p-2 rounded border border-border-color">
                      {orderHeader.order_number || '-'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm">Order Status</Label>
                    <Select value={String(orderHeader.order_status ?? 1)} onValueChange={(v: string)=>setOrderHeader(p=>({ ...p, order_status: +v }))}>
                      <SelectTrigger className="bg-card-color border-border-color text-font-color h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card-color border-border-color">
                        <SelectItem value="1" className="text-font-color hover:bg-body-color">Normal</SelectItem>
                        <SelectItem value="2" className="text-font-color hover:bg-body-color">On Hold</SelectItem>
                        <SelectItem value="0" className="text-font-color hover:bg-body-color">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Order Date</Label>
                  <Input 
                    type="date" 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    value={orderHeader.ordered_date || ''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, ordered_date: e.target.value }))} 
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">PO #</Label>
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    value={orderHeader.po_number || ''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, po_number: e.target.value }))} 
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Customer #</Label>
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    value={orderHeader.customer_number || ''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, customer_number: e.target.value }))} 
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Account# . Warehouse</Label>
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    value={accountNumberLocation} 
                    onChange={e=>setAccountNumberLocation(e.target.value)} 
                    placeholder="12345.LOC" 
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-font-color-100 text-sm">Shipping Instructions</Label>
                  <Textarea 
                    className="bg-card-color border-border-color text-font-color text-sm" 
                    rows={2} 
                    value={orderHeader.shipping_instructions || ''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, shipping_instructions: e.target.value }))} 
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-font-color-100 text-sm">Comments</Label>
                  <Textarea 
                    className="bg-card-color border-border-color text-font-color text-sm" 
                    rows={2} 
                    value={orderHeader.packing_list_comments || ''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, packing_list_comments: e.target.value }))} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Shipping Address</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="small" 
                    variant="outline" 
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={()=>router.push('/orderpoints/addressbook')}
                  >
                    Address Book…
                  </Button>
                  <Button 
                    size="small" 
                    className="bg-primary text-white hover:bg-primary/90"
                    onClick={onValidateAddress}
                  >
                    Validate
                  </Button>
                </div>
              </div>
              <p className="text-font-color-100 text-sm mt-2">Enter or choose from address book</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                  placeholder="Address 1" 
                  value={shippingAddress.address1||''} 
                  onChange={e=>setShippingAddress({...shippingAddress,address1:e.target.value})} 
                />
                <Input 
                  className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                  placeholder="Address 2" 
                  value={shippingAddress.address2||''} 
                  onChange={e=>setShippingAddress({...shippingAddress,address2:e.target.value})} 
                />
                <Input 
                  className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                  placeholder="City" 
                  value={shippingAddress.city||''} 
                  onChange={e=>setShippingAddress({...shippingAddress,city:e.target.value})} 
                />
                <Input 
                  className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                  placeholder="State" 
                  value={shippingAddress.state_province||''} 
                  onChange={e=>setShippingAddress({...shippingAddress,state_province:e.target.value})} 
                />
                <Input 
                  className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                  placeholder="Postal Code" 
                  value={shippingAddress.postal_code||''} 
                  onChange={e=>setShippingAddress({...shippingAddress,postal_code:e.target.value})} 
                />
                <Input 
                  className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                  placeholder="Country" 
                  value={shippingAddress.country||''} 
                  onChange={e=>setShippingAddress({...shippingAddress,country:e.target.value})} 
                />
              </div>
            </CardContent>
          </Card>
      </div>

        {/* Second row: Items (9) + Right Sidebar (3) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <Card className="xl:col-span-9">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Items</CardTitle>
                <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
                  <Input
                    placeholder="Add item…"
                    className="bg-card-color border-border-color text-font-color w-48 h-8 text-sm"
                    value={findItemValue}
                    onChange={e=>setFindItemValue(e.target.value)}
                    onKeyDown={e=>{ if (e.key === 'Enter') onBrowseItems() }}
                  />
                  <Button 
                    size="small" 
                    className="bg-primary text-white hover:bg-primary/90"
                    onClick={onBrowseItems}
                  >
                    Browse Items…
                  </Button>
                  <Button 
                    size="small" 
                    className="bg-danger text-white hover:bg-danger/90"
                    onClick={onRemoveSelected}
                  >
                    Remove selected
                  </Button>
                  <Button 
                    size="small" 
                    variant="outline" 
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={()=>setOrderDetail(prev=>renumberDraftLines(prev.map(i=>!i.is_kit_component?{...i, do_not_ship_before:new Date().toISOString().slice(0,10)}:i)))}
                  >
                    Don't ship before: Today
                  </Button>
                  <Button 
                    size="small" 
                    variant="outline" 
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={()=>setOrderDetail(prev=>renumberDraftLines(prev.map(i=>!i.is_kit_component?{...i, ship_by:new Date(Date.now()+86400000).toISOString().slice(0,10)}:i)))}
                  >
                    Ship by: +1d
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="ag-theme-alpine w-full" 
                style={{ 
                  minHeight: 250, 
                  height: 350, 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 6,
                  backgroundColor: 'var(--card-color)'
                }}
              >
                <AgGridReact
                  ref={gridRef as any}
                  theme="legacy"
                  columnDefs={columns as any}
                  rowData={orderDetail}
                  defaultColDef={defaultColDef}
                  rowSelection="multiple"
                  suppressRowClickSelection={true}
                  isRowSelectable={(params: any) => !params.data?.is_kit_component && !params.data?.voided}
                  overlayNoRowsTemplate={'<span class="ag-no-rows">No items in cart</span>'}
                  onCellValueChanged={(e:any)=>{
                  const idx = e.node.rowIndex
                  setOrderDetail(prev => {
                    const updated = prev.map((r,i)=> i===idx? { ...r, [e.colDef.field!]: Number.isFinite(+e.newValue)? +e.newValue : e.newValue }: r)
                    return renumberDraftLines(updated)
                  })
                }} />
              </div>
              <div className="mt-4 grid grid-cols-3">
                <div></div><div></div>
                <div className="justify-self-end space-y-2 text-sm">
                  <div className="flex justify-between gap-4 text-font-color">
                    <span>Total Lines:</span>
                    <span className="font-mono font-semibold">{orderDetail.length}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-font-color">
                    <span>Total Qty:</span>
                    <span className="font-mono font-semibold">{orderDetail.reduce((t,l)=> t + (Number(l.quantity)||0), 0)}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-font-color">
                    <span>Total Ext Price:</span>
                    <span className="font-mono font-semibold">${orderDetail.reduce((t,l)=> t + (Number(l.quantity)||0)*(Number(l.price)||0), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="xl:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Address 1" 
                    value={billingAddress.address1||''} 
                    onChange={e=>setBillingAddress({...billingAddress,address1:e.target.value})} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Address 2" 
                    value={billingAddress.address2||''} 
                    onChange={e=>setBillingAddress({...billingAddress,address2:e.target.value})} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="City" 
                    value={billingAddress.city||''} 
                    onChange={e=>setBillingAddress({...billingAddress,city:e.target.value})} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="State" 
                    value={billingAddress.state_province||''} 
                    onChange={e=>setBillingAddress({...billingAddress,state_province:e.target.value})} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Postal Code" 
                    value={billingAddress.postal_code||''} 
                    onChange={e=>setBillingAddress({...billingAddress,postal_code:e.target.value})} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Country" 
                    value={billingAddress.country||''} 
                    onChange={e=>setBillingAddress({...billingAddress,country:e.target.value})} 
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Carrier" 
                    value={orderHeader.shipping_carrier||''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, shipping_carrier: e.target.value }))} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Service" 
                    value={orderHeader.shipping_service||''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, shipping_service: e.target.value }))} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Freight Account" 
                    value={orderHeader.freight_account||''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, freight_account: e.target.value }))} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Consignee #" 
                    value={orderHeader.consignee_number||''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, consignee_number: e.target.value }))} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Incoterms" 
                    value={orderHeader.fob||''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, fob: e.target.value }))} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Terms" 
                    value={orderHeader.terms||''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, terms: e.target.value }))} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="Payment Type" 
                    value={orderHeader.payment_type||''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, payment_type: e.target.value }))} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                    placeholder="International Code" 
                    value={String(orderHeader.international_code ?? '')} 
                    onChange={e=>setOrderHeader(p=>({ ...p, international_code: e.target.value }))} 
                  />
                  <Input 
                    className="bg-card-color border-border-color text-font-color col-span-2" 
                    placeholder="Packing List Type" 
                    value={String(orderHeader.packing_list_type ?? '')} 
                    onChange={e=>setOrderHeader(p=>({ ...p, packing_list_type: e.target.value }))} 
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Amounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-font-color-100 text-sm">Order Amount</Label>
                    <div className="text-right font-mono font-semibold text-font-color bg-body-color p-2 rounded border border-border-color">
                      ${orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-font-color-100 text-sm">S & H</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color text-right" 
                      type="number" 
                      step="0.01" 
                      value={amounts.shipping_handling} 
                      onChange={e=>setAmounts({ ...amounts, shipping_handling: +e.target.value || 0 })} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-font-color-100 text-sm">Sales Taxes</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color text-right" 
                      type="number" 
                      step="0.01" 
                      value={amounts.sales_tax} 
                      onChange={e=>setAmounts({ ...amounts, sales_tax: +e.target.value || 0 })} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-font-color-100 text-sm">Amount Paid</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color text-right" 
                      type="number" 
                      step="0.01" 
                      value={amounts.amount_paid} 
                      onChange={e=>setAmounts({ ...amounts, amount_paid: +e.target.value || 0 })} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-font-color-100 text-sm">Intl. Handling</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color text-right" 
                      type="number" 
                      step="0.01" 
                      value={amounts.international_handling} 
                      onChange={e=>setAmounts({ ...amounts, international_handling: +e.target.value || 0 })} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-font-color-100 text-sm">Intl. Declared Value</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color text-right" 
                      type="number" 
                      step="0.01" 
                      value={amounts.international_declared_value} 
                      onChange={e=>setAmounts({ ...amounts, international_declared_value: +e.target.value || 0 })} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-font-color-100 text-sm">Insurance</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color text-right" 
                      type="number" 
                      step="0.01" 
                      value={amounts.insurance} 
                      onChange={e=>setAmounts({ ...amounts, insurance: +e.target.value || 0 })} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Extra Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_1}</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color mt-1" 
                      value={orderHeader.custom_field1||''} 
                      onChange={e=>setOrderHeader(p=>({ ...p, custom_field1: e.target.value }))} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_2}</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color mt-1" 
                      value={orderHeader.custom_field2||''} 
                      onChange={e=>setOrderHeader(p=>({ ...p, custom_field2: e.target.value }))} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_3}</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color mt-1" 
                      value={orderHeader.custom_field3||''} 
                      onChange={e=>setOrderHeader(p=>({ ...p, custom_field3: e.target.value }))} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_4}</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color mt-1" 
                      value={orderHeader.custom_field4||''} 
                      onChange={e=>setOrderHeader(p=>({ ...p, custom_field4: e.target.value }))} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_5}</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color mt-1" 
                      value={orderHeader.custom_field5||''} 
                      onChange={e=>setOrderHeader(p=>({ ...p, custom_field5: e.target.value }))} 
                    />
                  </div>
                </div>
              </CardContent>
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
            <label className="flex items-center gap-2 text-sm text-font-color">
              <CheckBox checked={showZeroQty} onChange={(checked)=>setShowZeroQty(checked)} />
              Show 0 QTY
            </label>
            <Select value={warehouses} onValueChange={setWarehouses}>
              <SelectTrigger className="bg-card-color border-border-color text-font-color w-48">
                <SelectValue placeholder="Warehouse: All" />
              </SelectTrigger>
              <SelectContent className="bg-card-color border-border-color">
                <SelectItem value="" className="text-font-color hover:bg-body-color">Warehouse: All</SelectItem>
                {getWarehouseOptions().map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-font-color hover:bg-body-color">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              size="small" 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={()=>reloadInventory()}
            >
              Refresh
            </Button>
          </div>
          <ScrollArea style={{ maxHeight: 420 }} className="bg-card-color">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border-color">
                  <th className="text-left p-3 text-font-color-100">#</th>
                  <th className="text-left p-3 text-font-color-100">Item # / Description</th>
                  <th className="text-right p-3 text-font-color-100">Qty</th>
                  <th className="text-right p-3 text-font-color-100">Unit Price</th>
                  <th className="text-right p-3 text-font-color-100">Net Avail</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(inventory).map((key, idx)=>{
                  const it = inventory[key]!
                  return (
                    <tr key={key} className="border-t border-border-color hover:bg-body-color">
                      <td className="p-3 text-font-color">{idx+1}</td>
                      <td className="p-3">
                        <div className="font-medium text-font-color">{it.item_number}</div>
                        <div className="text-font-color-100 text-sm">{it.description}</div>
                      </td>
                      <td className="p-3 text-right">
                        <Input
                          value={typeof it.quantity === 'number' ? String(it.quantity) : ''}
                          onChange={e=>updateInventoryField(it.item_number, 'quantity', e.target.value)}
                          className="text-right bg-card-color border-border-color text-font-color w-20"
                          type="number"
                          min="0"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <Input
                          value={typeof it.price === 'number' ? String(it.price) : ''}
                          onChange={e=>updateInventoryField(it.item_number, 'price', e.target.value)}
                          className="text-right bg-card-color border-border-color text-font-color w-24"
                          type="number"
                          step="0.01"
                          min="0"
                        />
                      </td>
                      <td className="p-3 text-right text-font-color font-mono">{it.qty_net}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </ScrollArea>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-border-color text-font-color hover:bg-body-color"
              onClick={()=>setBrowseOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={addSelectedItemsToOrder}
            >
              Add to order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validate Address Modal */}
      <Dialog open={validateOpen} onOpenChange={setValidateOpen}>
        <DialogContent style={{ maxWidth: 700 }}>
          <DialogHeader>
            <DialogTitle>Validate Address</DialogTitle>
            <DialogDescription>Review suggested corrections</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {validateResult?.warnings && <div className="text-warning text-sm">Warnings: {JSON.stringify(validateResult.warnings)}</div>}
            {validateResult?.errors && <div className="text-danger text-sm">Errors: {JSON.stringify(validateResult.errors)}</div>}
            <div className="grid grid-cols-2 gap-3">
              <Input 
                className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                placeholder="Address 1" 
                value={validateResult?.correct_address?.address1||''} 
                onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), address1: e.target.value } }))} 
              />
              <Input 
                className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                placeholder="Address 2" 
                value={validateResult?.correct_address?.address2||''} 
                onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), address2: e.target.value } }))} 
              />
              <Input 
                className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                placeholder="City" 
                value={validateResult?.correct_address?.city||''} 
                onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), city: e.target.value } }))} 
              />
              <Input 
                className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                placeholder="State" 
                value={validateResult?.correct_address?.state_province||''} 
                onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), state_province: e.target.value } }))} 
              />
              <Input 
                className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                placeholder="Postal Code" 
                value={validateResult?.correct_address?.postal_code||''} 
                onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), postal_code: e.target.value } }))} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-border-color text-font-color hover:bg-body-color"
              onClick={()=>setValidateOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={onAcceptCorrectAddress}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Line Modal */}
      <Dialog open={editLineOpen} onOpenChange={setEditLineOpen}>
        <DialogContent style={{ maxWidth: 600 }}>
          <DialogHeader>
            <DialogTitle>Edit Line Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-font-color-100 text-sm">Custom Field 1</Label>
              <Input 
                className="bg-card-color border-border-color text-font-color mt-1" 
                value={editLineData.custom_field1 as any || ''} 
                onChange={e=>setEditLineData(d=>({ ...d, custom_field1: e.target.value }))} 
              />
            </div>
            <div>
              <Label className="text-font-color-100 text-sm">Custom Field 2</Label>
              <Input 
                className="bg-card-color border-border-color text-font-color mt-1" 
                value={editLineData.custom_field2 as any || ''} 
                onChange={e=>setEditLineData(d=>({ ...d, custom_field2: e.target.value }))} 
              />
            </div>
            <div>
              <Label className="text-font-color-100 text-sm">Custom Field 5</Label>
              <Input 
                className="bg-card-color border-border-color text-font-color mt-1" 
                value={editLineData.custom_field5 as any || ''} 
                onChange={e=>setEditLineData(d=>({ ...d, custom_field5: e.target.value }))} 
              />
            </div>
            <div>
              <Label className="text-font-color-100 text-sm">Comments</Label>
              <Textarea 
                className="bg-card-color border-border-color text-font-color mt-1" 
                rows={4} 
                value={editLineData.comments as any || ''} 
                onChange={e=>setEditLineData(d=>({ ...d, comments: e.target.value }))} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-border-color text-font-color hover:bg-body-color"
              onClick={()=>setEditLineOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={()=>{ if (editLineIndex==null) return; setOrderDetail(prev => prev.map((r,i)=> i===editLineIndex? { ...r, ...editLineData }: r)); setEditLineOpen(false) }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}

function isFiniteNumber(v: any): v is number {
  const n = +v
  return Number.isFinite(n)
}


