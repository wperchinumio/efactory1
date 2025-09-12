import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
// Styles are imported globally in _app.tsx for reliability
import { Button, Card, CardContent, CardHeader, CardTitle, Input, CheckBox, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Label } from '@/components/ui'
import { toast } from '@/components/ui/use-toast'
import { IconTruck, IconCurrency, IconEdit, IconMapPin, IconBuilding, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconFileText, IconShoppingCart, IconMessageCircle } from '@tabler/icons-react'
import { getAuthState } from '@/lib/auth/guards'
import {
  generateOrderNumber,
  saveDraft,
  saveEntry,
  fetchInventoryForCart,
  readOrderPointsSettings,
} from '@/services/api'
import type { OrderHeaderDto, OrderDetailDto, InventoryStatusForCartBody, AddressDto, OrderPointsSettingsDto } from '@/types/api/orderpoints'


function isFiniteNumber(v: any): v is number {
  const n = +v
  return Number.isFinite(n)
}

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
  const [accountDisplayLabel, setAccountDisplayLabel] = useState('')
  const [orderStatusDisplayLabel, setOrderStatusDisplayLabel] = useState('')
  const [shippingAddress, setShippingAddress] = useState<AddressDto>({ country: 'US' })
  const [billingAddress, setBillingAddress] = useState<AddressDto>({})
  // Shipping settings state
  const [shippingSettings, setShippingSettings] = useState<OrderPointsSettingsDto['shipping'] | null>(null)
  const [findItemValue, setFindItemValue] = useState('')
  // Browse Items modal state
  const [browseOpen, setBrowseOpen] = useState(false)
  const [itemFilter, setItemFilter] = useState('')
  const [showZeroQty, setShowZeroQty] = useState(false)
  const [warehouses, setWarehouses] = useState<string>('')
  const [inventory, setInventory] = useState<Record<string, { item_number: string; description: string; qty_net: number; quantity?: number; price?: number }>>({})
  const [matchedWarehouse, setMatchedWarehouse] = useState('')
  
  // Determine if form fields should be disabled based on warehouse matching
  const formFieldsDisabled = warehouses === '' || 
                           matchedWarehouse === '' ||
                           matchedWarehouse !== warehouses
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(100)
  // Amounts & extra fields
  const [amounts, setAmounts] = useState({
    shipping_handling: 0,
    sales_tax: 0,
    discounts: 0,
    amount_paid: 0,
    insurance: 0,
    international_handling: 0,
    international_declared_value: 0,
    balance_due_us: 0
  })
  const [extraLabels, setExtraLabels] = useState({
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
  const [selectedRowsCount, setSelectedRowsCount] = useState(0)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  
  // Edit panel modals
  const [editBillingAddressOpen, setEditBillingAddressOpen] = useState(false)
  const [editShippingDetailsOpen, setEditShippingDetailsOpen] = useState(false)
  const [editAmountsOpen, setEditAmountsOpen] = useState(false)
  const [editExtraFieldsOpen, setEditExtraFieldsOpen] = useState(false)
  
  // Temporary state for editing (only updated on save)
  const [tempBillingAddress, setTempBillingAddress] = useState<AddressDto>({})
  const [tempShippingDetails, setTempShippingDetails] = useState({
    international_code: '',
    shipping_carrier: '',
    shipping_service: '',
    freight_account: '',
    consignee_number: '',
    terms: '',
    fob: '',
    payment_type: '',
    packing_list_type: ''
  })
  const [tempAmounts, setTempAmounts] = useState({
    shipping_handling: 0,
    sales_tax: 0,
    discounts: 0,
    amount_paid: 0,
    international_handling: 0,
    balance_due_us: 0,
    international_declared_value: 0,
    insurance: 0
  })
  const [tempExtraFields, setTempExtraFields] = useState({
    custom_field1: '',
    custom_field2: '',
    custom_field3: '',
    custom_field4: '',
    custom_field5: ''
  })

  // Load shipping settings on component mount
  useEffect(() => {
    const loadShippingSettings = async () => {
      try {
        const settings = await readOrderPointsSettings()
        setShippingSettings(settings.shipping)
        
        // Update custom field labels
        if (settings.custom_fields) {
          setExtraLabels(prev => ({
            ...prev,
            header_cf_1: settings.custom_fields.header_cf_1 || 'Custom Field 1',
            header_cf_2: settings.custom_fields.header_cf_2 || 'Custom Field 2',
            header_cf_3: settings.custom_fields.header_cf_3 || 'Custom Field 3',
            header_cf_4: settings.custom_fields.header_cf_4 || 'Custom Field 4',
            header_cf_5: settings.custom_fields.header_cf_5 || 'Custom Field 5',
            detail_cf_1: settings.custom_fields.detail_cf_1 || 'Custom Field 1',
            detail_cf_2: settings.custom_fields.detail_cf_2 || 'Custom Field 2',
            detail_cf_5: settings.custom_fields.detail_cf_5 || 'Custom Field 5'
          }))
        }
      } catch (error) {
        console.error('Failed to load shipping settings:', error)
      }
    }
    loadShippingSettings()
  }, [])

  // Pre-populate shipping details when country changes
  useEffect(() => {
    if (!shippingSettings) return

    const country = shippingAddress.country?.toUpperCase() || ''
    const isDomestic = country === 'US' || country === 'USA' || country === 'UNITED STATES' || country === 'UNITED_STATES'
    
    const whichShipping = isDomestic ? shippingSettings.domestic : shippingSettings.international
    
    if (whichShipping) {
      const {
        carrier: shipping_carrier,
        service: shipping_service,
        packing_list_type,
        freight_account,
        consignee_number,
        terms,
        int_code: international_code,
        comments = ''
      } = whichShipping

      // Update order header with shipping details
      setOrderHeader(prev => ({
        ...prev,
        shipping_carrier,
        shipping_service,
        packing_list_type,
        freight_account,
        consignee_number,
        terms,
        international_code,
        packing_list_comments: comments.trim().length > 0 ? comments : (prev.packing_list_comments || '')
      }))
    }
  }, [shippingAddress.country, shippingSettings])

  // Functions to handle modal opening and saving
  const openBillingAddressModal = () => {
    setTempBillingAddress({ ...billingAddress })
    setEditBillingAddressOpen(true)
  }
  
  const saveBillingAddress = () => {
    setBillingAddress({ ...tempBillingAddress })
    setEditBillingAddressOpen(false)
  }
  
  const openShippingDetailsModal = () => {
    setTempShippingDetails({
      international_code: String(orderHeader.international_code || ''),
      shipping_carrier: orderHeader.shipping_carrier || '',
      shipping_service: orderHeader.shipping_service || '',
      freight_account: orderHeader.freight_account || '',
      consignee_number: orderHeader.consignee_number || '',
      terms: orderHeader.terms || '',
      fob: orderHeader.fob || '',
      payment_type: orderHeader.payment_type || '',
      packing_list_type: String(orderHeader.packing_list_type || '')
    })
    setEditShippingDetailsOpen(true)
  }
  
  const saveShippingDetails = () => {
    setOrderHeader(prev => ({
      ...prev,
      international_code: tempShippingDetails.international_code,
      shipping_carrier: tempShippingDetails.shipping_carrier,
      shipping_service: tempShippingDetails.shipping_service,
      freight_account: tempShippingDetails.freight_account,
      consignee_number: tempShippingDetails.consignee_number,
      terms: tempShippingDetails.terms,
      fob: tempShippingDetails.fob,
      payment_type: tempShippingDetails.payment_type,
      packing_list_type: tempShippingDetails.packing_list_type
    }))
    setEditShippingDetailsOpen(false)
  }
  
  const openAmountsModal = () => {
    setTempAmounts({ ...amounts })
    setEditAmountsOpen(true)
  }
  
  const saveAmounts = () => {
    setAmounts({ ...tempAmounts })
    setEditAmountsOpen(false)
  }
  
  const openExtraFieldsModal = () => {
    setTempExtraFields({
      custom_field1: orderHeader.custom_field1 || '',
      custom_field2: orderHeader.custom_field2 || '',
      custom_field3: orderHeader.custom_field3 || '',
      custom_field4: orderHeader.custom_field4 || '',
      custom_field5: orderHeader.custom_field5 || ''
    })
    setEditExtraFieldsOpen(true)
  }
  
  const saveExtraFields = () => {
    setOrderHeader(prev => ({
      ...prev,
      custom_field1: tempExtraFields.custom_field1,
      custom_field2: tempExtraFields.custom_field2,
      custom_field3: tempExtraFields.custom_field3,
      custom_field4: tempExtraFields.custom_field4,
      custom_field5: tempExtraFields.custom_field5
    }))
    setEditExtraFieldsOpen(false)
  }


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
    try {
      const number = await generateOrderNumber()
      const safeNumber: string = typeof number === 'string' ? number : String(number ?? '')
      setOrderHeader({ ...orderHeader, order_number: safeNumber })
      
      // Show success toaster for new order number
      toast({
        title: "New Order Created",
        description: `Order #${safeNumber} has been generated.`,
        variant: "default",
      })
    } catch (error: any) {
      // Show error toaster with error message
      const errorMessage = error?.error_message || error?.message || "An error occurred while generating order number."
      toast({
        title: "Order Generation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  async function onSaveDraft() {
    try {
      const header = buildOrderHeaderForSubmit(true)
      const res = await saveDraft(header, orderDetail)
      
      if (res?.order_number) {
        // Show success toaster for draft save
        toast({
          title: "Draft Saved Successfully!",
          description: `Draft #${res.order_number} has been saved.`,
          variant: "default",
        })
        
        // Update order header with new order number
        setOrderHeader({ ...orderHeader, order_number: res.order_number })
      } else {
        // Show error toaster if no order number returned
        toast({
          title: "Draft Save Failed",
          description: "Failed to save draft. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      // Show error toaster with error message
      const errorMessage = error?.error_message || error?.message || "An error occurred while saving the draft."
      toast({
        title: "Draft Save Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  async function onPlaceOrder() {
    try {
      const header = buildOrderHeaderForSubmit(false)
      const res = await saveEntry(header, orderDetail)
      
      if (res?.order_number) {
        // Show success toaster with order number
        toast({
          title: "Order Placed Successfully!",
          description: `Order #${res.order_number} has been placed successfully.`,
          variant: "default",
        })
        
        // Navigate to order details
        router.push(`/orders/${res.order_number}`)
      } else {
        // Show error toaster if no order number returned
        toast({
          title: "Order Placement Failed",
          description: "Failed to place order. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      // Show error toaster with error message
      const errorMessage = error?.error_message || error?.message || "An error occurred while placing the order."
      toast({
        title: "Order Placement Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
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
    // Determine matched warehouse based on Order Header account location
    let matchedWarehouseValue = ''
    if (orderHeader.account_number && orderHeader.location) {
      try {
        const authTokenStr = window.localStorage.getItem('authToken')
        if (authTokenStr) {
          const authToken = JSON.parse(authTokenStr)
          const warehousesData = authToken?.user_data?.warehouses || {}
          
          // Find matching warehouse based on account_number.location format
          const locationDerived = orderHeader.location
          const accountDerived = orderHeader.account_number
          
          // Look for matching warehouse
          const matchedLocation = Object.keys(warehousesData).find(
            w => w.toLowerCase() === locationDerived.toLowerCase()
          )
          
          if (matchedLocation) {
            // Find matching branch within the warehouse
            const warehouse = warehousesData[matchedLocation]
            for (const branch of warehouse) {
              for (const [branchKey, accounts] of Object.entries(branch)) {
                if (Array.isArray(accounts) && accounts.includes(accountDerived)) {
                  matchedWarehouseValue = `${matchedLocation}-${branchKey}`
                  break
                }
              }
              if (matchedWarehouseValue) break
            }
          }
        }
      } catch (error) {
        console.error('Error determining matched warehouse:', error)
      }
    }
    
    setMatchedWarehouse(matchedWarehouseValue)
    
    // Set the warehouse filter to match the Order Header warehouse
    if (matchedWarehouseValue) {
      setWarehouses(matchedWarehouseValue)
    }
    
    // Quick add if toolbar has a value and single match exists; else open modal
    const trimmed = (findItemValue || '').trim()
    if (trimmed) {
      const response = await fetchInventoryForCart({
        page_num: 1,
        page_size: 5,
        filter: { and: [ { field: 'omit_zero_qty', oper: '=', value: true }, { field: 'name', oper: '=', value: trimmed } ] }
      } as any)
      const rows = response.rows || []
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
    if (selectedRows.length === 0) return

    // Remove selected rows; include their kit components
    const selectedItems = selectedRows.map(index => orderDetail[index]).filter(Boolean)
    const selectedKeys = new Set(selectedItems.map(r => `${r?.item_number || ''}#${r?.line_number || ''}`))
    const selectedParentLines = new Set(selectedItems.filter(r => !r?.is_kit_component).map(r => r?.line_number || 0))
    
    const remaining = orderDetail.filter((r, index) => {
      // Don't remove if not selected
      if (!selectedRows.includes(index)) return true
      
      // Don't remove voided items (they should stay but be crossed out)
      if (r.voided) return true
      
      const key = `${r.item_number}#${r.line_number}`
      if (selectedKeys.has(key)) return false
      if (r.is_kit_component) {
        const parent = Math.floor(r.line_number/1000)
        if (selectedParentLines.has(parent)) return false
      }
      return true
    })
    
    setOrderDetail(renumberDraftLines(remaining))
    setSelectedRows([])
    setSelectedRowsCount(0)
  }

  // Helper function to safely get warehouse options
  function getWarehouseOptions(): Array<{value: string, label: string}> {
    try {
      const auth = getAuthState() as any;
      if (!auth?.userApps) return [];
      
      // Get warehouses data from auth token (same as legacy getUserData('warehouses'))
      const authTokenStr = window.localStorage.getItem('authToken');
      if (!authTokenStr) return [];
      
      const authToken = JSON.parse(authTokenStr);
      const warehousesData = authToken?.user_data?.warehouses;
      
      console.log('Warehouse Debug:', { 
        authToken: !!authToken, 
        userData: !!authToken?.user_data, 
        warehouses: warehousesData,
        warehousesType: typeof warehousesData 
      });
      
      if (!warehousesData || typeof warehousesData !== 'object') return [];
      
      const options: Array<{value: string, label: string}> = [];
      
      // Process warehouses exactly like legacy code
      Object.keys(warehousesData).forEach((aWarehouse) => {
        const branches = warehousesData[aWarehouse];
        if (Array.isArray(branches)) {
          branches.forEach((branchObj: any) => {
            if (branchObj && typeof branchObj === 'object') {
              Object.keys(branchObj).forEach((anInvType) => {
                const optionValue = `${aWarehouse}-${anInvType}`;
                const optionLabel = `${aWarehouse} - ${anInvType}`;
                options.push({ value: optionValue, label: optionLabel });
              });
            }
          });
        }
      });
      
      console.log('Warehouse Options Generated:', options);
      return options;
    } catch (error) {
      console.error('Error loading warehouse options:', error);
      return [];
    }
  }

  // Helper function to get account options from calc_account_regions
  function getAccountOptions(): Array<{value: string, label: string}> {
    try {
      const authTokenStr = window.localStorage.getItem('authToken');
      if (!authTokenStr) return [];

      const authToken = JSON.parse(authTokenStr);
      const calcAccountRegions = authToken?.user_data?.calc_account_regions || {};

      const accountKeys = Object.keys(calcAccountRegions);
      accountKeys.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      return accountKeys.map(key => ({
        value: key,
        label: calcAccountRegions[key]
      }));
    } catch (error) {
      console.error('Error loading account options:', error);
      return [];
    }
  }

  function getOrderStatusOptions(): Array<{value: string, label: string}> {
    return [
      { value: '1', label: 'Normal' },
      { value: '2', label: 'On Hold' },
      { value: '0', label: 'Canceled' }
    ];
  }

  function handleAccountLocationChange(value: string) {
    setAccountNumberLocation(value);
    
    // Find and set the display label
    const accountOptions = getAccountOptions();
    const selectedOption = accountOptions.find(opt => opt.value === value);
    setAccountDisplayLabel(selectedOption ? selectedOption.label : '');
    
    if (value) {
      // Parse account_number.location format (e.g., "123.ABC" -> account_number: "123", location: "ABC")
      const accountNumber = value.replace(/\.\w+/, '');
      const location = value.replace(/\d+\./, '');
      setOrderHeader(prev => ({
        ...prev,
        account_number: accountNumber,
        location: location
      }));
    } else {
      setOrderHeader(prev => ({
        ...prev,
        account_number: '',
        location: ''
      }));
    }
  }

  function handleOrderStatusChange(value: string) {
    setOrderHeader(prev => ({
      ...prev,
      order_status: +value
    }));

    // Find and set the display label
    const orderStatusOptions = getOrderStatusOptions();
    const selectedOption = orderStatusOptions.find(opt => opt.value === value);
    setOrderStatusDisplayLabel(selectedOption ? selectedOption.label : '');
  }

  async function reloadInventory(page = currentPage) {
    console.log('reloadInventory called with:', { page, itemFilter, warehouses, showZeroQty });
    
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
      and.push({ field: 'name', oper: 'like', value: `%${itemFilter}%` })
    }
    
    console.log('Search filters:', and);

    const payload: Omit<InventoryStatusForCartBody,'resource'|'action'> = {
      page_num: page,
      page_size: pageSize,
      sort: [{ item_number: 'asc' } as any],
      filter: { and },
    }
    const response = await fetchInventoryForCart(payload)
    const rows = response.rows || []
    const total = response.total || 0
    
    console.log('Inventory API Response:', { total, rowsCount: rows.length, page, pageSize })
    
    setTotalItems(total)
    setCurrentPage(page)
    
    const hash: any = {}
    const existing = new Map(orderDetail.map(od => [od.item_number, od]))
    rows.forEach((r: any) => {
      const added = existing.get(r.item_number)
      hash[r.item_number] = {
        ...r,
        quantity: added ? added.quantity : undefined,
        price: added ? added.price : undefined,
      }
    })
    setInventory(hash)
  }

  // Pagination functions
  function goToPage(page: number) {
    const totalPages = Math.ceil(totalItems / pageSize)
    const targetPage = Math.max(1, Math.min(page, totalPages))
    if (targetPage !== currentPage) {
      reloadInventory(targetPage)
    }
  }

  function goToFirstPage() { goToPage(1) }
  function goToPrevPage() { goToPage(currentPage - 1) }
  function goToNextPage() { goToPage(currentPage + 1) }
  function goToLastPage() { goToPage(Math.ceil(totalItems / pageSize)) }

  useEffect(()=>{ 
    if (browseOpen) {
      setCurrentPage(1)
      reloadInventory(1) 
    }
  }, [browseOpen])

  // Debug pagination state
  useEffect(() => {
    console.log('Pagination State:', { totalItems, pageSize, currentPage, showPagination: totalItems > pageSize })
  }, [totalItems, pageSize, currentPage])

  // Initialize accountNumberLocation from orderHeader
  useEffect(() => {
    if (orderHeader.account_number && orderHeader.location) {
      const accountLocation = `${orderHeader.account_number}.${orderHeader.location}`;
      setAccountNumberLocation(accountLocation);

      // Also set the display label
      const accountOptions = getAccountOptions();
      const selectedOption = accountOptions.find(opt => opt.value === accountLocation);
      setAccountDisplayLabel(selectedOption ? selectedOption.label : '');
    }
  }, [orderHeader.account_number, orderHeader.location]);

  useEffect(() => {
    // Initialize order status display label
    const orderStatusOptions = getOrderStatusOptions();
    const selectedOption = orderStatusOptions.find(opt => opt.value === String(orderHeader.order_status ?? 1));
    setOrderStatusDisplayLabel(selectedOption ? selectedOption.label : '');
  }, [orderHeader.order_status]);

  // Handle search input changes with debouncing
  useEffect(() => {
    if (!browseOpen) return;

    console.log('Search Effect Triggered:', { itemFilter, browseOpen });

    // If search is empty, reload immediately to show all items
    if (itemFilter === '') {
      console.log('Empty search - reloading immediately');
      setCurrentPage(1);
      reloadInventory(1);
      return;
    }

    // If search has content, use debounced search
    console.log('Setting debounced search for:', itemFilter);
    const timeoutId = setTimeout(() => {
      console.log('Debounced search executing for:', itemFilter);
      setCurrentPage(1);
      reloadInventory(1);
    }, 350);

    return () => {
      console.log('Clearing timeout for:', itemFilter);
      clearTimeout(timeoutId);
    };
  }, [itemFilter, browseOpen])

  // Handle showZeroQty changes (immediate reload)
  useEffect(() => {
    if (browseOpen) {
      setCurrentPage(1)
      reloadInventory(1)
    }
  }, [showZeroQty, browseOpen])

  // Handle warehouse changes (immediate reload)
  useEffect(() => {
    if (browseOpen) {
      setCurrentPage(1)
      reloadInventory(1)
    }
  }, [warehouses, browseOpen])

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
      {/* Header with Title and Actions */}
      <div className="bg-card-color border-b border-border-color px-6 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-font-color mb-0.5">OrderPoints - Order Entry</h1>
            <p className="text-sm text-font-color-100">Create and manage purchase orders</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onNewOrderNumber} className="bg-primary text-white hover:bg-primary/90 px-4 py-2">
              New Order
            </Button>
            <Button onClick={onSaveDraft} variant="outline" className="border-border-color px-4 py-2">
              Save Draft
            </Button>
            <Button onClick={onPlaceOrder} className="bg-success text-white hover:bg-success/90 px-4 py-2">
              Place Order
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto p-6 space-y-6" style={{ maxWidth: '1600px' }}>

        {/* Main Layout: Left side (9) + Right Sidebar (3) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-9 space-y-4">
            {/* Order Header and Shipping Address on same row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Order Header */}
              <Card className="shadow-sm border-border-color">
                <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3">
                <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                  <IconFileText className="w-3.5 h-3.5" />
                  ORDER HEADER
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                  <div className="space-y-3">
                    {/* Row 1: Account # - Warehouse | Order # */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="text-font-color-100 text-sm">Account # - Warehouse</Label>
                        <Select value={accountNumberLocation} onValueChange={handleAccountLocationChange}>
                        <SelectTrigger className="bg-card-color border-border-color text-font-color h-8 text-sm">
                            <span className="truncate">
                              {accountDisplayLabel || "Select Account - Warehouse"}
                            </span>
                        </SelectTrigger>
                        <SelectContent className="bg-card-color border-border-color">
                            <SelectItem value="" className="text-font-color hover:bg-body-color">
                              Select Account - Warehouse
                            </SelectItem>
                            {getAccountOptions().map(option => (
                              <SelectItem key={option.value} value={option.value} className="text-font-color hover:bg-body-color">
                                <span className="whitespace-nowrap">{option.label}</span>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                      <div>
                        <Label className="text-font-color-100 text-sm">Order #</Label>
                        <div className="font-mono text-font-color bg-body-color p-1 rounded border border-border-color h-8 text-sm flex items-center">
                          {orderHeader.order_number || '-'}
                  </div>
                      </div>
                    </div>
                    
                    {/* Row 2: Customer # | PO # */}
                    <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm">Customer #</Label>
                  <Input 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                          value={orderHeader.customer_number || ''} 
                          onChange={e=>setOrderHeader(p=>({ ...p, customer_number: e.target.value }))} 
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
                    </div>
                    
                    {/* Row 3: Order Status | PO Date */}
                    <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm">Order Status</Label>
                        <Select value={String(orderHeader.order_status ?? 1)} onValueChange={handleOrderStatusChange}>
                          <SelectTrigger className="bg-card-color border-border-color text-font-color h-8 text-sm">
                            <span className="truncate">
                              {orderStatusDisplayLabel || "Select Order Status"}
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-card-color border-border-color">
                            {getOrderStatusOptions().map(option => (
                              <SelectItem key={option.value} value={option.value} className="text-font-color hover:bg-body-color">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm">PO Date</Label>
                  <Input 
                          type="date" 
                    className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                          value={orderHeader.ordered_date || ''} 
                          onChange={e=>setOrderHeader(p=>({ ...p, ordered_date: e.target.value }))} 
                  />
                </div>
                    </div>
                    
                    {/* Row 4: Shipping Instructions | Comments */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                  <Label className="text-font-color-100 text-sm">Shipping Instructions</Label>
                  <Textarea 
                    className="bg-card-color border-border-color text-font-color text-sm" 
                          rows={3} 
                    value={orderHeader.shipping_instructions || ''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, shipping_instructions: e.target.value }))} 
                  />
                </div>
                      <div>
                  <Label className="text-font-color-100 text-sm">Comments</Label>
                  <Textarea 
                    className="bg-card-color border-border-color text-font-color text-sm" 
                          rows={3} 
                    value={orderHeader.packing_list_comments || ''} 
                    onChange={e=>setOrderHeader(p=>({ ...p, packing_list_comments: e.target.value }))} 
                  />
                      </div>
                </div>
              </div>
            </CardContent>
          </Card>

              {/* Shipping Address - SAME ROW as Order Header */}
            <Card className="shadow-sm border-border-color">
              <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                    <IconTruck className="w-3.5 h-3.5" />
                    SHIPPING ADDRESS
                  </CardTitle>
                <div className="flex gap-2">
                    <Button 
                      size="small" 
                      variant="outline" 
                      className="border-border-color text-font-color hover:bg-body-color text-xs px-3 py-1"
                      onClick={()=>router.push('/orderpoints/addressbook')}
                    >
                      Address Book…
                    </Button>
                    <Button 
                      size="small" 
                      className="bg-primary text-white hover:bg-primary/90 text-xs px-3 py-1"
                      onClick={onValidateAddress}
                    >
                      Validate
                    </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-font-color-100 text-sm">Company</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                      value={shippingAddress.company||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,company:e.target.value})} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm">Attention</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color h-8 text-sm" 
                      value={shippingAddress.attention||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,attention:e.target.value})} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium">Address 1</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color h-9 text-sm mt-1" 
                      placeholder="Street address" 
                      value={shippingAddress.address1||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,address1:e.target.value})} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium">Address 2</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color h-9 text-sm mt-1" 
                      placeholder="Apt, suite, etc." 
                      value={shippingAddress.address2||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,address2:e.target.value})} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium">City</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color h-9 text-sm mt-1" 
                      placeholder="City" 
                      value={shippingAddress.city||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,city:e.target.value})} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium">State</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color h-9 text-sm mt-1" 
                      placeholder="State" 
                      value={shippingAddress.state_province||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,state_province:e.target.value})} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium">Postal Code</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color h-9 text-sm mt-1" 
                      placeholder="ZIP/Postal" 
                      value={shippingAddress.postal_code||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,postal_code:e.target.value})} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium">Country</Label>
                    <Select value={shippingAddress.country||'US'} onValueChange={(v: string)=>setShippingAddress({...shippingAddress,country:v})}>
                      <SelectTrigger className="bg-card-color border-border-color text-font-color h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card-color border-border-color">
                        <SelectItem value="US" className="text-font-color hover:bg-body-color">United States - US</SelectItem>
                        <SelectItem value="CA" className="text-font-color hover:bg-body-color">Canada - CA</SelectItem>
                        <SelectItem value="MX" className="text-font-color hover:bg-body-color">Mexico - MX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium">Phone</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color h-9 text-sm mt-1" 
                      placeholder="Phone number" 
                      value={shippingAddress.phone||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,phone:e.target.value})} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium">Email</Label>
                    <Input 
                      className="bg-card-color border-border-color text-font-color h-9 text-sm mt-1" 
                      placeholder="Email address" 
                      type="email"
                      value={shippingAddress.email||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,email:e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>

            {/* Items */}
            <Card className="shadow-sm border-border-color">
              <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                    <IconShoppingCart className="w-3.5 h-3.5" />
                    ITEMS
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add item…"
                      className="bg-card-color border-border-color text-font-color w-48 h-8 text-sm"
                      value={findItemValue}
                      onChange={e=>setFindItemValue(e.target.value)}
                      onKeyDown={e=>{ if (e.key === 'Enter') onBrowseItems() }}
                    />
                    <Button 
                      size="small" 
                      className="bg-primary text-white hover:bg-primary/90 whitespace-nowrap text-xs"
                      onClick={onBrowseItems}
                    >
                      Browse Items…
                    </Button>
                    <Button 
                      size="small" 
                      className={`whitespace-nowrap ${
                        selectedRowsCount > 0 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                      onClick={onRemoveSelected}
                      disabled={selectedRowsCount === 0}
                    >
                      Remove selected {selectedRowsCount > 0 && `(${selectedRowsCount})`}
                    </Button>
                  </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                {orderDetail.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No items in cart
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-color bg-body-color">
                        <th className="text-left p-2 w-8">
                          <CheckBox
                            checked={selectedRowsCount === orderDetail.filter(r => !r.is_kit_component && !r.voided).length && orderDetail.filter(r => !r.is_kit_component && !r.voided).length > 0}
                            onChange={(checked) => {
                              if (checked) {
                                const selectableIndices = orderDetail.map((r, i) => !r.is_kit_component && !r.voided ? i : -1).filter(i => i !== -1)
                                setSelectedRows(selectableIndices)
                                setSelectedRowsCount(selectableIndices.length)
                              } else {
                                setSelectedRows([])
                                setSelectedRowsCount(0)
                              }
                            }}
                            size="normal"
                            mode="emulated"
                          />
                        </th>
                        <th className="text-center p-2 font-medium text-font-color-100">#</th>
                        <th className="text-left p-2 font-medium text-font-color-100">Item #</th>
                        <th className="text-left p-2 font-medium text-font-color-100">Description</th>
                        <th className="text-center p-2 font-medium text-font-color-100">Qty</th>
                        <th className="text-right p-2 font-medium text-font-color-100">Unit Price</th>
                        <th className="text-right p-2 font-medium text-font-color-100">Ext Price</th>
                        <th className="text-center p-2 font-medium text-font-color-100">Don't Ship</th>
                        <th className="text-center p-2 font-medium text-font-color-100">Ship By</th>
                        <th className="text-center p-2 font-medium text-font-color-100">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetail.map((item, index) => {
                        const isSelectable = !item.is_kit_component && !item.voided
                        const isSelected = selectedRows.includes(index)
                        const isBundleComponent = item.is_kit_component
                        const isVoided = item.voided
                        
                        return (
                          <tr 
                            key={`${item.item_number}-${item.line_number}`}
                            className={`border-b border-border-color hover:bg-body-color ${
                              isBundleComponent ? 'bg-gray-50 text-gray-500' : ''
                            } ${isVoided ? 'line-through opacity-60' : ''}`}
                          >
                            <td className="p-2">
                              {isSelectable && (
                                <CheckBox
                                  checked={isSelected}
                                  onChange={(checked) => {
                                    if (checked) {
                                      setSelectedRows([...selectedRows, index])
                                      setSelectedRowsCount(selectedRowsCount + 1)
                                    } else {
                                      setSelectedRows(selectedRows.filter(i => i !== index))
                                      setSelectedRowsCount(selectedRowsCount - 1)
                                    }
                                  }}
                                  size="normal"
                                  mode="emulated"
                                />
                              )}
                            </td>
                            <td className="p-2 text-center text-font-color">
                              <div className="flex items-center justify-center gap-1">
                                <span>{item.line_number}</span>
                                {(item.comments || item.custom_field1 || item.custom_field2 || item.custom_field5) && (
                                  <IconMessageCircle className="w-3 h-3 text-gray-400" />
                                )}
                              </div>
                            </td>
                            <td className="p-2 text-font-color">
                              {isBundleComponent && <span className="text-gray-400 mr-2">└─</span>}
                              {item.item_number}
                            </td>
                            <td className="p-2 text-font-color">
                              {isBundleComponent && <span className="text-gray-400 mr-2">└─</span>}
                              {item.description}
                            </td>
                            <td className="p-2 text-center text-font-color">{item.quantity}</td>
                            <td className="p-2 text-right text-font-color">{item.price ? Number(item.price).toFixed(2) : ''}</td>
                            <td className="p-2 text-right text-font-color">
                              {((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                            </td>
                            <td className="p-2 text-center text-font-color">
                              {item.do_not_ship_before ? new Date(item.do_not_ship_before).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}
                            </td>
                            <td className="p-2 text-center text-font-color">
                              {item.ship_by ? new Date(item.ship_by).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}
                            </td>
                            <td className="p-2 text-center">
                              {!isBundleComponent && !isVoided && (
                                <Button 
                                  size="small" 
                                  variant="outline" 
                                  className="text-xs px-2 py-1" 
                                  onClick={() => { 
                                    setEditLineIndex(index); 
                                    setEditLineData({ 
                                      description: item.description || '', 
                                      quantity: item.quantity || 0, 
                                      price: item.price || 0, 
                                      do_not_ship_before: item.do_not_ship_before || '', 
                                      ship_by: item.ship_by || '',
                                      custom_field1: item.custom_field1 || '', 
                                      custom_field2: item.custom_field2 || '', 
                                      custom_field5: item.custom_field5 || '', 
                                      comments: item.comments || '' 
                                    }); 
                                    setEditLineOpen(true); 
                                  }}
                                >
                                  Edit
                                </Button>
                              )}
                              {isBundleComponent && (
                                <span className="text-xs text-gray-400">Component</span>
                              )}
                              {isVoided && (
                                <span className="text-xs text-gray-400">Voided</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
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
                      <span className="font-mono font-semibold">{orderDetail.reduce((t,l)=> t + (Number(l.quantity)||0)*(Number(l.price)||0), 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

           {/* Right Sidebar - All 4 panels stacked vertically */}
           <div className="xl:col-span-3 space-y-3">
           <Card className="shadow-sm border-border-color">
             <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3">
               <div className="flex justify-between items-center">
                 <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                   <IconTruck className="w-3.5 h-3.5" />
                   SHIPPING
                 </CardTitle>
                 <Button
                   size="small"
                   variant="outline"
                   className="text-xs px-2 py-1 h-6 text-gray-600 border-gray-300"
                   onClick={openShippingDetailsModal}
                 >
                   <IconEdit className="h-3 w-3 mr-1" />
                   Edit...
                 </Button>
               </div>
               </CardHeader>
               <CardContent className="p-3">
               <div className="space-y-1 text-xs">
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Int. Code:</span> <span className="text-font-color text-right truncate max-w-[120px]" title={String(orderHeader.international_code || '0')}>{orderHeader.international_code || '0'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Shipping Carrier:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.shipping_carrier ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.shipping_carrier || '-'}>{orderHeader.shipping_carrier || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Shipping Service:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.shipping_service ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.shipping_service || '-'}>{orderHeader.shipping_service || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Freight Account:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.freight_account ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.freight_account || '-'}>{orderHeader.freight_account || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Consignee #:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.consignee_number ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.consignee_number || '-'}>{orderHeader.consignee_number || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Incoterms:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.terms ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.terms || '-'}>{orderHeader.terms || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">FOB Location:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.fob ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.fob || '-'}>{orderHeader.fob || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Payment Type:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.payment_type ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.payment_type || '-'}>{orderHeader.payment_type || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Packing List:</span> <span className="text-font-color text-right truncate max-w-[120px]" title={String(orderHeader.packing_list_type || '100')}>{orderHeader.packing_list_type || '100'}</span></div>
                 </div>
               </CardContent>
             </Card>

          <Card className="shadow-sm border-border-color">
            <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                  <IconBuilding className="w-3.5 h-3.5" />
                  BILLING ADDRESS
                </CardTitle>
                <Button
                  size="small"
                  variant="outline"
                  className="text-xs px-2 py-1 h-6 text-gray-600 border-gray-300"
                  onClick={openBillingAddressModal}
                >
                  <IconEdit className="h-3 w-3 mr-1" />
                  Edit...
                </Button>
              </div>
              </CardHeader>
              <CardContent className="p-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Company:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.company ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.company || '-'}>{billingAddress.company || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Attention:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.attention ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.attention || '-'}>{billingAddress.attention || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Address 1:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.address1 ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.address1 || '-'}>{billingAddress.address1 || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Address 2:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.address2 ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.address2 || '-'}>{billingAddress.address2 || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">City:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.city ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.city || '-'}>{billingAddress.city || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">State/Province:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.state_province ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.state_province || '-'}>{billingAddress.state_province || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Postal Code:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.postal_code ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.postal_code || '-'}>{billingAddress.postal_code || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Country:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.country ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.country || '-'}>{billingAddress.country || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Phone:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.phone ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.phone || '-'}>{billingAddress.phone || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Email:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.email ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.email || '-'}>{billingAddress.email || '-'}</span></div>
                </div>
              </CardContent>
            </Card>

          <Card className="shadow-sm border-border-color">
            <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                  <IconCurrency className="w-3.5 h-3.5" />
                  AMOUNTS
                </CardTitle>
                <Button
                  size="small"
                  variant="outline"
                  className="text-xs px-2 py-1 h-6 text-gray-600 border-gray-300"
                  onClick={openAmountsModal}
                >
                  <IconEdit className="h-3 w-3 mr-1" />
                  Edit...
                </Button>
              </div>
              </CardHeader>
              <CardContent className="p-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-font-color-100 whitespace-nowrap">Order Amount:</span>
                  <span className="font-mono text-font-color text-right truncate max-w-[120px]" title={`${orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0).toFixed(2)}`}>{orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0).toFixed(2)}</span>
                    </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-font-color-100 whitespace-nowrap">S & H:</span>
                  <span className={`font-mono text-right truncate max-w-[120px] ${amounts.shipping_handling > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.shipping_handling.toFixed(2)}`}>{amounts.shipping_handling.toFixed(2)}</span>
                  </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-font-color-100 whitespace-nowrap">Sales Taxes:</span>
                  <span className={`font-mono text-right truncate max-w-[120px] ${amounts.sales_tax > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.sales_tax.toFixed(2)}`}>{amounts.sales_tax.toFixed(2)}</span>
                  </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-font-color-100 whitespace-nowrap">Discount/Add. Chgs.:</span>
                  <span className={`font-mono text-right truncate max-w-[120px] ${amounts.international_handling > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.international_handling.toFixed(2)}`}>{amounts.international_handling.toFixed(2)}</span>
                  </div>
                <div className="flex justify-between items-center py-0.5 border-t border-border-color pt-1 font-bold">
                  <span className="text-font-color whitespace-nowrap">Total Amount:</span>
                  <span className="font-mono text-font-color text-right truncate max-w-[120px]" title={`${(orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0) + amounts.shipping_handling + amounts.sales_tax + amounts.international_handling).toFixed(2)}`}>{(orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0) + amounts.shipping_handling + amounts.sales_tax + amounts.international_handling).toFixed(2)}</span>
                  </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-font-color-100 whitespace-nowrap">Amount Paid:</span>
                  <span className={`font-mono text-right truncate max-w-[120px] ${amounts.amount_paid > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.amount_paid.toFixed(2)}`}>{amounts.amount_paid.toFixed(2)}</span>
                  </div>
                <div className="flex justify-between items-center py-0.5 border-t-2 border-border-color pt-1 font-bold">
                  <span className="text-font-color whitespace-nowrap">Net Due:</span>
                  <span className="font-mono text-font-color text-right truncate max-w-[120px]" title={`${(orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0) + amounts.shipping_handling + amounts.sales_tax + amounts.international_handling - amounts.amount_paid).toFixed(2)}`}>{(orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0) + amounts.shipping_handling + amounts.sales_tax + amounts.international_handling - amounts.amount_paid).toFixed(2)}</span>
                  </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-font-color-100 whitespace-nowrap">Balance Due (US):</span>
                  <span className={`font-mono text-right truncate max-w-[120px] ${amounts.balance_due_us > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.balance_due_us.toFixed(2)}`}>{amounts.balance_due_us.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-font-color-100 whitespace-nowrap">Int. Decl. Value:</span>
                  <span className={`font-mono text-right truncate max-w-[120px] ${amounts.international_declared_value > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.international_declared_value.toFixed(2)}`}>{amounts.international_declared_value.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-font-color-100 whitespace-nowrap">Insurance:</span>
                  <span className={`font-mono text-right truncate max-w-[120px] ${amounts.insurance > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.insurance.toFixed(2)}`}>{amounts.insurance.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          <Card className="shadow-sm border-border-color">
            <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                  <IconEdit className="w-3.5 h-3.5" />
                  EXTRA FIELDS
                </CardTitle>
                <Button
                  size="small"
                  variant="outline"
                  className="text-xs px-2 py-1 h-6 text-gray-600 border-gray-300"
                  onClick={openExtraFieldsModal}
                >
                  <IconEdit className="h-3 w-3 mr-1" />
                  Edit...
                </Button>
              </div>
              </CardHeader>
              <CardContent className="p-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">{extraLabels.header_cf_1}:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.custom_field1 ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.custom_field1 || '-'}>{orderHeader.custom_field1 || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">{extraLabels.header_cf_2}:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.custom_field2 ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.custom_field2 || '-'}>{orderHeader.custom_field2 || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">{extraLabels.header_cf_3}:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.custom_field3 ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.custom_field3 || '-'}>{orderHeader.custom_field3 || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">{extraLabels.header_cf_4}:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.custom_field4 ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.custom_field4 || '-'}>{orderHeader.custom_field4 || '-'}</span></div>
                <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">{extraLabels.header_cf_5}:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.custom_field5 ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.custom_field5 || '-'}>{orderHeader.custom_field5 || '-'}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      {/* Browse Items Modal */}
      <Dialog open={browseOpen} onOpenChange={setBrowseOpen}>
        <DialogContent className="flex flex-col overflow-hidden" style={{ width: '900px', height: '720px', maxWidth: '90vw', maxHeight: '90vh', minWidth: '900px', minHeight: '720px' }}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Browse Items</DialogTitle>
          </DialogHeader>
          
          {/* Filters */}
          <div className="flex items-center justify-between gap-3 mb-3 flex-shrink-0">
            <Input
              placeholder="Search by item # or description"
              value={itemFilter}
              onChange={e=>setItemFilter(e.target.value)}
              className="w-48 h-8 text-sm"
            />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-font-color whitespace-nowrap">
              <CheckBox checked={showZeroQty} onChange={(checked)=>setShowZeroQty(checked)} />
              Show 0 QTY
            </label>
            <Select value={warehouses} onValueChange={setWarehouses}>
                <SelectTrigger className="bg-card-color border-border-color text-font-color h-8 text-sm" style={{ width: '200px' }}>
                <SelectValue placeholder="Warehouse: All" />
              </SelectTrigger>
                <SelectContent className="bg-card-color border-border-color" style={{ width: '200px' }}>
                <SelectItem value="" className="text-font-color hover:bg-body-color">Warehouse: All</SelectItem>
                {getWarehouseOptions().map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-font-color hover:bg-body-color">
                      <span className="whitespace-nowrap">{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
                className="bg-primary text-white hover:bg-primary/90 whitespace-nowrap"
              onClick={()=>reloadInventory()}
            >
              Refresh
            </Button>
          </div>
          </div>
          
          {/* Table Area - Flexible height */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full bg-card-color">
            <table className="w-full text-sm table-fixed" style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead>
                <tr className="border-b border-border-color">
                  <th className="text-left py-1 px-3 text-font-color-100 w-12">#</th>
                  <th className="text-left py-1 px-3 text-font-color-100 w-64">Item # / Description</th>
                  <th className="text-right py-1 px-3 text-font-color-100 w-20">Qty</th>
                  <th className="text-right py-1 px-3 text-font-color-100 w-24">Unit Price</th>
                  <th className="text-right py-1 px-3 text-font-color-100 whitespace-nowrap w-20">Net Avail</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(inventory).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-font-color-100">
                      <div className="text-lg mb-2">No items found</div>
                      <div className="text-sm">Try adjusting your search criteria or filters</div>
                    </td>
                  </tr>
                ) : (
                  Object.keys(inventory).map((key, idx)=>{
                  const it = inventory[key]!
                  return (
                    <tr key={key} className="border-t border-border-color hover:bg-body-color">
                        <td className="py-1 px-3 text-font-color w-12">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="py-1 px-3 w-64">
                          <div className="font-medium text-font-color truncate" title={it.item_number}>{it.item_number}</div>
                          <div className="text-font-color-100 text-sm truncate" title={it.description}>{it.description}</div>
                      </td>
                        <td className="py-1 px-3 text-right w-20">
                        <Input
                          value={typeof it.quantity === 'number' ? String(it.quantity) : ''}
                          onChange={e=>updateInventoryField(it.item_number, 'quantity', e.target.value)}
                            className="text-right bg-card-color border-border-color text-font-color w-full h-8 text-sm"
                          type="number"
                          min="0"
                          disabled={formFieldsDisabled}
                        />
                      </td>
                        <td className="py-1 px-3 text-right w-24">
                        <Input
                          value={typeof it.price === 'number' ? String(it.price) : ''}
                          onChange={e=>updateInventoryField(it.item_number, 'price', e.target.value)}
                            className="text-right bg-card-color border-border-color text-font-color w-full h-8 text-sm"
                          type="number"
                          step="0.01"
                          min="0"
                          disabled={formFieldsDisabled}
                        />
                      </td>
                        <td className="py-1 px-3 text-right text-font-color font-mono whitespace-nowrap w-20">{it.qty_net}</td>
                    </tr>
                  )
                  })
                )}
              </tbody>
            </table>
          </ScrollArea>
          </div>
          
          <DialogFooter className="flex-shrink-0 flex flex-col gap-4">
            {/* Pagination Controls */}
            {totalItems > pageSize && (
              <div className="flex items-center justify-between p-4 border-t border-border-color">
                <div className="flex items-center gap-2">
                  <Button
                    size="small"
                    variant="outline"
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                  >
                    <IconChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="small"
                    variant="outline"
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-font-color px-2">
                    Page {currentPage} of {Math.ceil(totalItems / pageSize)}
                  </span>
                  <Button
                    size="small"
                    variant="outline"
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={goToNextPage}
                    disabled={currentPage >= Math.ceil(totalItems / pageSize)}
                  >
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="small"
                    variant="outline"
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={goToLastPage}
                    disabled={currentPage >= Math.ceil(totalItems / pageSize)}
                  >
                    <IconChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-font-color-100">
                  <strong>{totalItems}</strong> items on <strong>{Math.ceil(totalItems / pageSize)}</strong> pages
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
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
            </div>
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
        <DialogContent style={{ maxWidth: 800 }}>
          <DialogHeader>
            <DialogTitle>Edit Line Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Main Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Description</Label>
                <Input 
                  className="bg-card-color border-border-color text-font-color mt-1" 
                  value={editLineData.description || ''} 
                  onChange={e=>setEditLineData(d=>({ ...d, description: e.target.value }))} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Quantity</Label>
                <Input 
                  type="number"
                  className="bg-card-color border-border-color text-font-color mt-1" 
                  value={editLineData.quantity || 0} 
                  onChange={e=>setEditLineData(d=>({ ...d, quantity: Number(e.target.value) }))} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Unit Price</Label>
                <Input 
                  type="number"
                  step="0.01"
                  className="bg-card-color border-border-color text-font-color mt-1" 
                  value={editLineData.price || 0} 
                  onChange={e=>setEditLineData(d=>({ ...d, price: Number(e.target.value) }))} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Extended Price</Label>
                <Input 
                  className="bg-card-color border-border-color text-font-color mt-1" 
                  value={((editLineData.quantity || 0) * (editLineData.price || 0)).toFixed(2)}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Don't Ship Before</Label>
                <Input 
                  type="date"
                  className="bg-card-color border-border-color text-font-color mt-1" 
                  value={editLineData.do_not_ship_before || ''} 
                  onChange={e=>setEditLineData(d=>({ ...d, do_not_ship_before: e.target.value }))} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Ship By</Label>
                <Input 
                  type="date"
                  className="bg-card-color border-border-color text-font-color mt-1" 
                  value={editLineData.ship_by || ''} 
                  onChange={e=>setEditLineData(d=>({ ...d, ship_by: e.target.value }))} 
                />
              </div>
            </div>

            {/* Custom Fields Row */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Custom Field 1</Label>
                <Input 
                  className="bg-card-color border-border-color text-font-color mt-1" 
                  value={editLineData.custom_field1 || ''} 
                  onChange={e=>setEditLineData(d=>({ ...d, custom_field1: e.target.value }))} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Custom Field 2</Label>
                <Input 
                  className="bg-card-color border-border-color text-font-color mt-1" 
                  value={editLineData.custom_field2 || ''} 
                  onChange={e=>setEditLineData(d=>({ ...d, custom_field2: e.target.value }))} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Custom Field 5</Label>
                <Input 
                  className="bg-card-color border-border-color text-font-color mt-1" 
                  value={editLineData.custom_field5 || ''} 
                  onChange={e=>setEditLineData(d=>({ ...d, custom_field5: e.target.value }))} 
                />
              </div>
            </div>

            <div>
              <Label className="text-font-color-100 text-sm">Comments</Label>
              <Textarea 
                className="bg-card-color border-border-color text-font-color mt-1" 
                rows={4} 
                value={editLineData.comments || ''} 
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

      {/* Edit Billing Address Modal */}
      <Dialog open={editBillingAddressOpen} onOpenChange={setEditBillingAddressOpen}>
        <DialogContent style={{ maxWidth: 600 }}>
          <DialogHeader>
            <DialogTitle>Edit Billing Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Company</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempBillingAddress.company || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, company: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Attention</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempBillingAddress.attention || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, attention: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Address 1</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempBillingAddress.address1 || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, address1: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Address 2</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempBillingAddress.address2 || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, address2: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">City</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempBillingAddress.city || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, city: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">State/Province</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempBillingAddress.state_province || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, state_province: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Postal Code</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempBillingAddress.postal_code || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, postal_code: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Country</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempBillingAddress.country || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, country: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Phone</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempBillingAddress.phone || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Email</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempBillingAddress.email || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBillingAddressOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={saveBillingAddress}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Shipping Details Modal */}
      <Dialog open={editShippingDetailsOpen} onOpenChange={setEditShippingDetailsOpen}>
        <DialogContent style={{ maxWidth: 600 }}>
          <DialogHeader>
            <DialogTitle>Edit Shipping Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">International Code</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempShippingDetails.international_code || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, international_code: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Shipping Carrier</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempShippingDetails.shipping_carrier || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, shipping_carrier: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Shipping Service</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempShippingDetails.shipping_service || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, shipping_service: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Freight Account</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempShippingDetails.freight_account || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, freight_account: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Consignee #</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempShippingDetails.consignee_number || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, consignee_number: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Incoterms</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempShippingDetails.terms || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, terms: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">FOB Location</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempShippingDetails.fob || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, fob: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Payment Type</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempShippingDetails.payment_type || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, payment_type: e.target.value }))}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-font-color-100 text-sm">Packing List Type</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempShippingDetails.packing_list_type || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, packing_list_type: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditShippingDetailsOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={saveShippingDetails}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Amounts Modal */}
      <Dialog open={editAmountsOpen} onOpenChange={setEditAmountsOpen}>
        <DialogContent style={{ maxWidth: 500 }}>
          <DialogHeader>
            <DialogTitle>Edit Amounts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">S & H</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.shipping_handling}
                  onChange={e => setTempAmounts(p => ({ ...p, shipping_handling: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Sales Taxes</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.sales_tax}
                  onChange={e => setTempAmounts(p => ({ ...p, sales_tax: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Amount Paid</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.amount_paid}
                  onChange={e => setTempAmounts(p => ({ ...p, amount_paid: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Discount/Add. Chgs.</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.international_handling}
                  onChange={e => setTempAmounts(p => ({ ...p, international_handling: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Balance Due (US)</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.balance_due_us}
                  onChange={e => setTempAmounts(p => ({ ...p, balance_due_us: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Int. Decl. Value</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.international_declared_value}
                  onChange={e => setTempAmounts(p => ({ ...p, international_declared_value: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Insurance</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.insurance}
                  onChange={e => setTempAmounts(p => ({ ...p, insurance: +e.target.value || 0 }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAmountsOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={saveAmounts}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Extra Fields Modal */}
      <Dialog open={editExtraFieldsOpen} onOpenChange={setEditExtraFieldsOpen}>
        <DialogContent style={{ maxWidth: 500 }}>
          <DialogHeader>
            <DialogTitle>Edit Extra Fields</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_1}</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempExtraFields.custom_field1 || ''}
                  onChange={e => setTempExtraFields(p => ({ ...p, custom_field1: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_2}</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempExtraFields.custom_field2 || ''}
                  onChange={e => setTempExtraFields(p => ({ ...p, custom_field2: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_3}</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempExtraFields.custom_field3 || ''}
                  onChange={e => setTempExtraFields(p => ({ ...p, custom_field3: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_4}</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempExtraFields.custom_field4 || ''}
                  onChange={e => setTempExtraFields(p => ({ ...p, custom_field4: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_5}</Label>
                <Input
                  className="bg-card-color border-border-color text-font-color h-8 text-sm"
                  value={tempExtraFields.custom_field5 || ''}
                  onChange={e => setTempExtraFields(p => ({ ...p, custom_field5: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExtraFieldsOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={saveExtraFields}
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


