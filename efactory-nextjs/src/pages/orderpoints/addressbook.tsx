import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Label, Textarea } from '@/components/ui'
import CountryFilterCombobox from '@/components/filters/analytics/CountryFilterCombobox'
import StateFilterCombobox from '@/components/filters/analytics/StateFilterCombobox'
import { validateAddress as apiValidateAddress } from '@/services/api'
import { readAddresses, createAddress, updateAddress, deleteAddress as apiDeleteAddress, validateAddress, exportAddresses, importAddresses } from '@/services/api'
import { toast } from '@/components/ui/use-toast'
import type { AddressDto, ReadAddressesResponse } from '@/types/api/orderpoints'
import { IconDownload, IconUpload, IconPlus, IconCopy, IconTrash, IconEdit, IconSearch, IconChevronDown } from '@tabler/icons-react'

export default function AddressBookPage() {
  const [rows, setRows] = useState<ReadAddressesResponse['rows']>([])
  const [filter, setFilter] = useState('')
  const [activePagination, setActivePagination] = useState(1)
  const [pageSize] = useState(50)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const actionsRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<number | string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editMode, setEditMode] = useState<'add'|'edit'|'duplicate'>('add')
  const [editData, setEditData] = useState<any>(null)

  async function reload() {
    setLoading(true)
    try {
      const res = await readAddresses({ action: 'read_addresses', page_num: activePagination, page_size: pageSize, filter: filter ? { field: '*', value: filter } : null })
      setRows(res.rows || [])
    } catch (err: any) {
      const msg = err?.error_message || err?.message || 'Failed to load addresses'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ reload() }, [activePagination])

  // Close actions menu on outside click or Escape
  useEffect(() => {
    function handleDocumentClick(e: MouseEvent){
      if (!showActions) return
      const target = e.target as Node | null
      if (actionsRef.current && target && !actionsRef.current.contains(target)) {
        setShowActions(false)
      }
    }
    function handleKey(e: KeyboardEvent){
      if (e.key === 'Escape') setShowActions(false)
    }
    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [showActions])

  function openEditDialog(mode: 'add'|'edit'|'duplicate', row?: any) {
    setEditMode(mode)
    setEditData(mode==='add' ? null : (row || rows.find(r => r.id===selected)))
    setEditOpen(true)
  }

  async function onDuplicate(row?: any) {
    openEditDialog('duplicate', row)
  }

  async function onDelete(row?: any) {
    const id = (row?.id) ?? selected
    if (!id) return
    try {
      await apiDeleteAddress({ action: 'delete_address', id: id as any })
      const successMsg = 'Address deleted successfully'
      toast({ title: 'Success', description: successMsg })
      await reload()
    } catch (err: any) {
      const msg = err?.error_message || err?.message || err?.detail || 'Failed to delete address'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    }
  }

  async function onExport() {
    try {
      setExporting(true)
      await exportAddresses(filter ? { field: '*', value: filter } : null)
      toast({ title: 'Export Success', description: 'Your file is downloading.' })
    } catch (err: any) {
      const msg = err?.message || err?.error_message || 'Failed to export addresses'
      toast({ title: 'Export Error', description: msg, variant: 'destructive' })
    } finally {
      setExporting(false)
    }
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importAddresses(file, 'import')
      const successMsg = 'Addresses imported successfully'
      toast({ title: 'Import Success', description: successMsg })
      e.currentTarget.value = ''
      await reload()
    } catch (err:any) {
      const msg = err?.error_message || err?.message || err?.detail || 'Failed to import addresses'
      toast({ title: 'Import Error', description: msg, variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-body-color">
      {/* Header with Title and Actions */}
      <div className="bg-card-color border-b border-border-color px-6 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-font-color mb-0.5 flex items-center gap-2">
              Address Books
            </h1>
            <p className="text-sm text-font-color-100">
              Manage your saved shipping and billing contacts
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Input className="w-56 sm:w-64 md:w-72" placeholder="Search contact title..." value={filter} onChange={e=>setFilter(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter') reload() }} />
              <Button onClick={reload} disabled={loading} aria-label="Search">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <IconSearch className="w-4 h-4"/>
                )}
              </Button>
            </div>
            <div className="hidden sm:block w-px self-stretch bg-border-color" />
            <div className="flex items-center gap-2">
              <Button onClick={()=>openEditDialog('add')}><IconPlus className="w-4 h-4"/>Add</Button>
              <Button onClick={()=>openEditDialog('edit')} disabled={!selected}><IconEdit className="w-4 h-4"/>Edit</Button>
              <div className="relative" ref={actionsRef}>
                <Button 
                  variant="outline"
                  onClick={()=>setShowActions(!showActions)}
                  className="flex items-center gap-2"
                >
                  <IconChevronDown className="w-4 h-4" />
                  Actions
                </Button>
                {showActions && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-card-color border border-border-color rounded-lg shadow-lg z-10">
                    <div className="p-2 text-left">
                      <Button
                        size="small"
                        variant="ghost"
                        className="w-full !justify-start !text-left text-sm hover:bg-primary-10 rounded-md flex items-center h-8 px-3"
                        onClick={()=>{ onDuplicate(); setShowActions(false) }}
                        disabled={!selected}
                      >
                        <span className="w-4 inline-flex justify-start mr-2">
                          <IconCopy className="w-4 h-4" />
                        </span>
                        <span>Duplicate</span>
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        className="w-full !justify-start !text-left text-sm hover:bg-primary-10 rounded-md mt-1 flex items-center h-8 px-3"
                        onClick={()=>{ onExport(); setShowActions(false) }}
                        disabled={exporting}
                      >
                        <span className="w-4 inline-flex justify-start mr-2">
                          <IconDownload className="w-4 h-4" />
                        </span>
                        <span>Export</span>
                      </Button>
                      <input ref={fileInputRef} type="file" className="hidden" onChange={onImport} />
                      <Button
                        size="small"
                        variant="ghost"
                        className="w-full !justify-start !text-left text-sm hover:bg-primary-10 rounded-md mt-1 flex items-center h-8 px-3"
                        onClick={()=>{ fileInputRef.current?.click(); setShowActions(false) }}
                      >
                        <span className="w-4 inline-flex justify-start mr-2">
                          <IconUpload className="w-4 h-4" />
                        </span>
                        <span>Import...</span>
                      </Button>
                      <div className="my-2 border-t border-border-color" />
                      <Button
                        size="small"
                        variant="ghost"
                        className="w-full !justify-start !text-left text-sm rounded-md flex items-center text-danger hover:bg-danger/10 h-8 px-3"
                        onClick={()=>{ onDelete(); setShowActions(false) }}
                        disabled={!selected}
                      >
                        <span className="w-4 inline-flex justify-start mr-2 text-danger">
                          <IconTrash className="w-4 h-4" />
                        </span>
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Card className="shadow-sm border-border-color">
            <CardContent className="p-0">
                  <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-body-color border-b border-border-color">
                      <tr className="text-left text-font-color text-[13px] font-semibold">
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Shipping Address</th>
                        <th className="py-2.5 px-3">Billing Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length === 0 ? (
                        <tr><td className="px-4 py-8 text-center text-font-color-100" colSpan={3}>{loading? 'Loading...' : 'No contacts found'}</td></tr>
                      ) : rows.map((r:any) => (
                        <tr key={r.id} className={`border-b border-border-color hover:bg-primary-10 transition-colors ${selected===r.id?'bg-primary-10':''}`} onClick={()=>setSelected(r.id)}>
                          <td className="py-2.5 px-3 text-primary underline cursor-pointer" onClick={()=>openEditDialog('edit', r)}>{r.title}</td>
                          <td className="py-2.5 px-3">{displayRich(r.ship_to)}</td>
                          <td className="py-2.5 px-3">{displayRich(r.bill_to)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </CardContent>
          </Card>
      </div>

      {/* Add/Edit Dialog */}
      <EditDialog open={editOpen} onOpenChange={setEditOpen} mode={editMode} data={editData} onSaved={reload} />
    </div>
  )
}

function displayAddr(a?: AddressDto) {
  if (!a) return '-'
  const parts = [a.address1, a.address2, a.city, a.state_province, a.postal_code].filter(Boolean)
  return parts.join(', ')
}

function displayRich(a?: AddressDto) {
  if (!a) return '-'
  const top = `${a.company || ''}${a.company && a.attention ? ' | ' : ''}${a.attention || ''}`
  const line = `${a.address1 || ''}${a.address2 ? ', ' + a.address2 : ''}`
  const city = `${a.city ? a.city + ',' : ''} ${a.state_province || ''} ${a.postal_code || ''} ${a.country || ''}`
  return (
    <div className="text-[13px]">
      <i className="text-info">{top}</i>
      <div>{line}</div>
      <div className="text-font-color-100">{city}</div>
    </div>
  )
}

function EditDialog({ open, onOpenChange, mode, data, onSaved }: { open: boolean; onOpenChange: (v:boolean)=>void; mode: 'add'|'edit'|'duplicate'; data: any; onSaved: ()=>void }){
  const [title, setTitle] = useState<string>(data?.title || '')
  const [ship, setShip] = useState<AddressDto>(data?.ship_to || {})
  const [bill, setBill] = useState<AddressDto>(data?.bill_to || {})
  const [validateOpen, setValidateOpen] = useState(false)
  const [validateResult, setValidateResult] = useState<{warnings?: any; errors?: any; correct_address?: AddressDto}>({})
  const [validatingAddress, setValidatingAddress] = useState<'shipping' | 'billing' | null>(null)
  useEffect(()=>{ if (open){ setTitle(data?.title||''); setShip(data?.ship_to||{}); setBill(data?.bill_to||{}) } }, [open, data])

  async function onSave(){
    if (mode==='add' || mode==='duplicate'){
      try {
        await createAddress({ action: 'create_address', data: { title, ship_to: ship, bill_to: bill, is_validate: false } })
        const successMsg = 'Address created successfully'
        toast({ title: 'Success', description: successMsg })
        onOpenChange(false); onSaved()
      } catch (err:any) {
        const msg = err?.error_message || err?.message || err?.detail || 'Failed to create address'
        toast({ title: 'Error', description: msg, variant: 'destructive' })
        return
      }
    } else {
      // Legacy expects flat data fields under data with ship_to/bill_to
      try {
        await updateAddress({ action: 'update_address', data: { id: data?.id, title, ship_to: ship, bill_to: bill } as any })
        const successMsg = 'Address updated successfully'
        toast({ title: 'Success', description: successMsg })
        onOpenChange(false); onSaved()
      } catch (err:any) {
        const msg = err?.error_message || err?.message || err?.detail || 'Failed to update address'
        toast({ title: 'Error', description: msg, variant: 'destructive' })
        return
      }
    }
  }

  function copyShipping(){ setBill({ ...ship }) }

  async function onValidateAddress() {
    setValidatingAddress('shipping')
    try {
      const res = await apiValidateAddress({ action: 'validate_address', data: {
        address1: ship.address1 || '',
        address2: ship.address2 || '',
        city: ship.city || '',
        state_province: ship.state_province || '',
        postal_code: ship.postal_code || ''
      } })
      console.log('Validation API response:', res)
      
      // Only show dialog if there are warnings or errors
      if (res.warnings || res.errors) {
        setValidateResult(res as any)
        setValidateOpen(true)
        // Don't reset validatingAddress here - keep it for the Accept button
      } else if (res.correct_address) {
        // Auto-update address on success (no warnings/errors)
        const corrected = { ...res.correct_address, country: 'US' }
        setShip(prev => ({ ...prev, ...corrected }))
        toast({
          title: 'Address Validated Successfully!',
          description: 'The address has been validated and updated automatically.',
        })
        setValidatingAddress(null) // Reset here for auto-update
      } else {
        setValidatingAddress(null) // Reset here if no correct_address
      }
    } catch (err: any) {
      const msg = err?.error_message || err?.message || 'Address validation failed'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      setValidatingAddress(null) // Reset here on error
    }
  }

  function onAcceptCorrectAddress() {
    if (validateResult?.correct_address) {
      const corrected = { ...validateResult.correct_address, country: 'US' }
      console.log('Accepting corrected address:', corrected)
      
      // Only update shipping address since that's the only one with validation
      setShip(prev => {
        const updated = { ...prev, ...corrected }
        console.log('Updated shipping address:', updated)
        return updated
      })
      toast({ title: 'Success', description: 'Shipping address updated with validated information' })
    }
    setValidateOpen(false)
    setValidatingAddress(null)
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: 1100 }}>
        <DialogHeader>
          <DialogTitle>{mode==='add'?'Add Address': mode==='edit'?'Edit Address':'Duplicate Address'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-font-color-100 text-sm flex items-center">Address Title</Label>
            <Input className="h-8 text-sm mt-1" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Shipping Address</div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-font-color-100">USA only validation</div>
                  <Button size="small" variant="outline" disabled={!canValidate(ship) || validatingAddress === 'shipping'} onClick={onValidateAddress}>
                    {validatingAddress === 'shipping' ? 'Validating...' : 'Validate Address'}
                  </Button>
                </div>
              </div>
              {renderAddressForm(ship, setShip)}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Billing Address</div>
                <Button size="small" variant="outline" onClick={copyShipping}>Copy Shipping Address</Button>
              </div>
              {renderAddressForm(bill, setBill)}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={()=>onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>{mode==='edit'?'Save':'Add'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Validate Address Modal */}
    <Dialog open={validateOpen} onOpenChange={setValidateOpen}>
      <DialogContent style={{ maxWidth: 800 }}>
        <DialogHeader>
          <DialogTitle>Address validation</DialogTitle>
          <DialogDescription>
            The address verification program has suggested an update to the address you entered. Please{' '}
            <strong>Accept</strong> the updated address, or <strong>Cancel</strong> to return to the previous page.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Address As-Entered Column */}
            <div>
              <h4 className="text-yellow-500 font-bold mb-4">Address As-Entered</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Address 1:</Label>
                  <Input 
                    className="mt-1" 
                    value={validatingAddress === 'shipping' ? (ship.address1 || '') : (bill.address1 || '')} 
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Address 2:</Label>
                  <Input 
                    className="mt-1" 
                    value={validatingAddress === 'shipping' ? (ship.address2 || '') : (bill.address2 || '')} 
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">City:</Label>
                  <Input 
                    className="mt-1" 
                    value={validatingAddress === 'shipping' ? (ship.city || '') : (bill.city || '')} 
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">State:</Label>
                  <Input 
                    className="mt-1" 
                    value={validatingAddress === 'shipping' ? (ship.state_province || '') : (bill.state_province || '')} 
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Postal Code:</Label>
                  <Input 
                    className="mt-1" 
                    value={validatingAddress === 'shipping' ? (ship.postal_code || '') : (bill.postal_code || '')} 
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Updated Address Column */}
            <div>
              <h4 className="text-yellow-500 font-bold mb-4">Updated Address</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Address 1:</Label>
                  <Input 
                    className="mt-1" 
                    value={validateResult?.correct_address?.address1 || ''} 
                    onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), address1: e.target.value } }))} 
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Address 2:</Label>
                  <Input 
                    className="mt-1" 
                    value={validateResult?.correct_address?.address2 || ''} 
                    onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), address2: e.target.value } }))} 
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">City:</Label>
                  <Input 
                    className="mt-1" 
                    value={validateResult?.correct_address?.city || ''} 
                    onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), city: e.target.value } }))} 
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">State:</Label>
                  <Input 
                    className="mt-1" 
                    value={validateResult?.correct_address?.state_province || ''} 
                    onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), state_province: e.target.value } }))} 
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Postal Code:</Label>
                  <Input 
                    className="mt-1" 
                    value={validateResult?.correct_address?.postal_code || ''} 
                    onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), postal_code: e.target.value } }))} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages at Bottom */}
          <div className="mt-4 space-y-2">
            {validateResult?.errors && (
              <div className="text-red-600 font-bold text-sm">
                Errors: {Array.isArray(validateResult.errors) ? validateResult.errors.join(', ') : validateResult.errors}
              </div>
            )}
            {validateResult?.warnings && (
              <div className="text-yellow-600 font-bold text-sm">
                Warnings: {Array.isArray(validateResult.warnings) ? validateResult.warnings.join(', ') : validateResult.warnings}
              </div>
            )}
            {!validateResult?.errors && !validateResult?.warnings && (
              <div className="text-green-600 font-bold text-sm">
                Status: VALIDATED_CHANGED
              </div>
            )}
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
            disabled={!!validateResult?.errors}
            onClick={onAcceptCorrectAddress}
          >
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  )
}

function renderAddressForm(value: AddressDto, setValue: (v: AddressDto)=>void){
  return (
    <div className="space-y-3">
      {/* Row 1: Company | Attention */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-font-color-100 text-sm flex items-center">Company</Label>
          <Input className="h-8 text-sm mt-1" value={value.company||''} onChange={e=>setValue({ ...value, company: e.target.value })} />
        </div>
        <div>
          <Label className="text-font-color-100 text-sm flex items-center">Attention</Label>
          <Input className="h-8 text-sm mt-1" value={value.attention||''} onChange={e=>setValue({ ...value, attention: e.target.value })} />
        </div>
      </div>
      
      {/* Row 2: Address 1 | Address 2 */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-font-color-100 text-sm font-medium flex items-center">Address 1</Label>
          <Input className="h-9 text-sm mt-1" value={value.address1||''} onChange={e=>setValue({ ...value, address1: e.target.value })} />
        </div>
        <div>
          <Label className="text-font-color-100 text-sm font-medium flex items-center">Address 2</Label>
          <Input className="h-9 text-sm mt-1" value={value.address2||''} onChange={e=>setValue({ ...value, address2: e.target.value })} />
        </div>
      </div>
      
      {/* Row 3: City | Postal Code */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-font-color-100 text-sm font-medium flex items-center">City</Label>
          <Input className="h-9 text-sm mt-1" value={value.city||''} onChange={e=>setValue({ ...value, city: e.target.value })} />
        </div>
        <div>
          <Label className="text-font-color-100 text-sm font-medium flex items-center">Postal Code</Label>
          <Input className="h-9 text-sm mt-1" value={value.postal_code||''} onChange={e=>setValue({ ...value, postal_code: e.target.value })} />
        </div>
      </div>
      
      {/* Row 4: Country | State */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-font-color-100 text-sm font-medium flex items-center">Country</Label>
          <div className="mt-1">
            <div className="relative">
              <CountryFilterCombobox
                value={value.country||''}
                onValueChange={(v: string) => setValue({ ...value, country: v, state_province: '' })}
                boldWhenSelected={true}
              />
              <style jsx>{`
                .relative :global(label) {
                  display: none !important;
                }
              `}</style>
            </div>
          </div>
        </div>
        <div>
          <Label className="text-font-color-100 text-sm font-medium flex items-center">State</Label>
          <div className="mt-1">
            <div className="relative">
              <StateFilterCombobox
                value={value.state_province||''}
                onValueChange={(v: string) => setValue({ ...value, state_province: v })}
                countryValue={value.country||''}
                boldWhenSelected={true}
              />
              <style jsx>{`
                .relative :global(label) {
                  display: none !important;
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
      
      {/* Row 5: Phone | Email */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-font-color-100 text-sm font-medium flex items-center">Phone</Label>
          <Input className="h-9 text-sm mt-1" value={value.phone||''} onChange={e=>setValue({ ...value, phone: e.target.value })} />
        </div>
        <div>
          <Label className="text-font-color-100 text-sm font-medium flex items-center">Email</Label>
          <Input className="h-9 text-sm mt-1" type="email" value={value.email||''} onChange={e=>setValue({ ...value, email: e.target.value })} />
        </div>
      </div>
    </div>
  )
}

function canValidate(addr: AddressDto){
  const { address1, country } = addr || {}
  const hasAddress1 = address1 && String(address1).trim().length > 0
  const c = (country || '').toUpperCase()
  const isUS = c === 'US' || c === 'UNITED STATES' || c.startsWith('US -')
  return Boolean(hasAddress1 && isUS)
}


