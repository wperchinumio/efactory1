import React, { useState } from 'react'
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconPrinter, 
  IconRefresh, 
  IconSettings, 
  IconFileText, 
  IconTruck, 
  IconPackage, 
  IconMapPin,
  IconCreditCard,
  IconBuilding,
  IconPhone,
  IconMail,
  IconMessageShare,
  IconBan,
  IconTrash,
  IconExchange,
  IconShoppingCart,
  IconCopy,
  IconMail as IconEnvelope,
  IconArrowsRightLeft,
  IconFileCode,
  IconX,
  IconCheck,
  IconAlertCircle
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { OrderDetailDto } from '@/types/api/orders'
import { 
  orderPutOnHold, 
  orderPutOffHold, 
  orderCancel, 
  orderTransfer, 
  orderCloneToDraft, 
  resendShipConfirmation,
  readRmaFromOrder
} from '@/services/api'

// Import components
import ShipmentsSection from './ShipmentsSection'

type Props = {
  data: OrderDetailDto
  onClose: () => void
  variant?: 'overlay' | 'inline'
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
  currentIndex?: number
  totalItems?: number
}

type OrderTopBarProps = {
  data: OrderDetailDto
  onClose: () => void
  onPrevious?: (() => void) | undefined
  onNext?: (() => void) | undefined
  hasPrevious?: boolean | undefined
  hasNext?: boolean | undefined
  currentIndex?: number | undefined
  totalItems?: number | undefined
}

const ORDER_STAGES = [
  { stage: 10, label: 'New Order', color: 'bg-blue-500' },
  { stage: 20, label: 'Processing', color: 'bg-yellow-500' },
  { stage: 30, label: 'Picking', color: 'bg-orange-500' },
  { stage: 40, label: 'Packed', color: 'bg-purple-500' },
  { stage: 50, label: 'Shipped', color: 'bg-indigo-500' },
  { stage: 60, label: 'Fully Shipped', color: 'bg-green-500' },
  { stage: 70, label: 'Delivered', color: 'bg-emerald-500' },
  { stage: 80, label: 'Completed', color: 'bg-gray-500' }
]

function OrderTopBar({ data, onClose, onPrevious, onNext, hasPrevious, hasNext, currentIndex, totalItems }: OrderTopBarProps) {
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [showPutOnHoldModal, setShowPutOnHoldModal] = useState(false)
  const [showPutOffHoldModal, setShowPutOffHoldModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showResendModal, setShowResendModal] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const [holdReason, setHoldReason] = useState('')
  const [destinationWarehouse, setDestinationWarehouse] = useState('')
  const [shipToEmail, setShipToEmail] = useState(data.shipping_address?.email || '')
  const [billToEmail, setBillToEmail] = useState(data.billing_address?.email || '')

  const currentStage = ORDER_STAGES.find(s => s.stage === data.order_stage) || ORDER_STAGES[0]
  const isOnHold = data.order_status === 0
  const canPutOnHold = data.order_stage !== 2 && data.order_stage <= 40
  const canCancel = data.order_stage === 10 || (data.order_stage < 10 && data.order_status === 0)
  const canCreateRMA = data.order_stage >= 50
  const canTransfer = data.order_stage === 10 && data.home_dir && data.home_dir.length > 0
  const canResend = data.allow_resent_ship_notification
  const isEDI = data.order_type === 'EDI'
  const hasOriginalData = data.custom_data !== null

  const handleRefresh = () => {
    window.location.reload()
  }

  const handlePrint = () => {
    window.print()
  }

  const handlePutOnHold = async () => {
    try {
      await orderPutOnHold(data.order_id, data.location, holdReason)
      setShowPutOnHoldModal(false)
      setHoldReason('')
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error('Error putting order on hold:', error)
      // You might want to show a toast notification here
    }
  }

  const handlePutOffHold = async () => {
    try {
      await orderPutOffHold(data.order_id, data.location)
      setShowPutOffHoldModal(false)
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error('Error putting order off hold:', error)
      // You might want to show a toast notification here
    }
  }

  const handleCancelOrder = async () => {
    try {
      await orderCancel(data.order_id, data.location)
      setShowCancelModal(false)
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error('Error cancelling order:', error)
      // You might want to show a toast notification here
    }
  }

  const handleTransferOrder = async () => {
    try {
      const sourceWarehouse = data.location?.split(' - ')[0] || ''
      await orderTransfer(data.order_id, sourceWarehouse, destinationWarehouse)
      setShowTransferModal(false)
      setDestinationWarehouse('')
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error('Error transferring order:', error)
      // You might want to show a toast notification here
    }
  }

  const handleCreateRMA = async () => {
    try {
      // First try to create RMA from the order
      await readRmaFromOrder(data.account_number, data.order_number)
      // Navigate to RMA page - you would implement this navigation
      console.log('Navigate to RMA creation for order:', data.order_number)
      // window.location.href = '/returntrak/entry'
    } catch (error) {
      console.error('Error creating RMA:', error)
      // You might want to show a toast notification here
    }
  }

  const handleEditInOrderpoints = () => {
    // Navigate to order points edit page - you would implement this navigation
    console.log('Navigate to edit in orderpoints:', data.order_id)
    // window.location.href = `/orderpoints/edit?orderId=${data.order_id}`
  }

  const handleCloneOrder = async () => {
    try {
      await orderCloneToDraft(data.order_number, data.account_number)
      // Navigate to order points - you would implement this navigation
      console.log('Order cloned, navigate to orderpoints')
      // window.location.href = '/orderpoints'
    } catch (error) {
      console.error('Error cloning order:', error)
      // You might want to show a toast notification here
    }
  }

  const handleResendShipConfirmation = async () => {
    try {
      await resendShipConfirmation(data.order_number, data.account_number, shipToEmail, billToEmail)
      setShowResendModal(false)
      // Show success message - you might want to show a toast notification here
      console.log('Ship confirmation resent successfully')
    } catch (error) {
      console.error('Error resending ship confirmation:', error)
      // You might want to show a toast notification here
    }
  }

  return (
    <>
      <div className="bg-primary-10 border-b border-border-color">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onClose}
                variant="outline"
                size="small"
                icon={<IconX />}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Close
              </Button>

              {(hasPrevious || hasNext) && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => hasPrevious && onPrevious?.()}
                    variant="outline"
                    size="small"
                    icon={<IconChevronLeft />}
                    disabled={!hasPrevious}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => hasNext && onNext?.()}
                    variant="outline"
                    size="small"
                    icon={<IconChevronRight />}
                    iconPosition="right"
                    disabled={!hasNext}
                  >
                    Next
                  </Button>
                </div>
              )}

              <div className="h-6 w-px bg-border-color"></div>

              <div>
                <h1 className="text-xl font-bold text-font-color-100">Order #{data.order_number}</h1>
                <div className="flex items-center gap-3 text-sm text-font-color-100/70">
                  <span>Account: {data.account_number}</span>
                  <span>•</span>
                  <span>{data.order_type}</span>
                  {data.customer_number && (
                    <>
                      <span>•</span>
                      <span>Customer: {data.customer_number}</span>
                    </>
                  )}
                  {data.po_number && (
                    <>
                      <span>•</span>
                      <span>PO: {data.po_number}</span>
                    </>
                  )}
                  {currentIndex && totalItems && (
                    <>
                      <span>•</span>
                      <span>{currentIndex} of {totalItems}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-font-color-100/70">Order Stage</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-font-color-100">{data.stage_description}</div>
                  <div className={`w-3 h-3 rounded-full ${currentStage?.color || 'bg-gray-400'}`}></div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <div className="relative">
                  <Button
                    variant="primary"
                    size="small"
                    icon={<IconSettings />}
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                  >
                    Actions
                  </Button>
                  
                  {showActionsMenu && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-background border border-border-color rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            if (isOnHold) {
                              setShowPutOffHoldModal(true)
                            } else if (canPutOnHold) {
                              setShowPutOnHoldModal(true)
                            }
                            setShowActionsMenu(false)
                          }}
                          disabled={!isOnHold && !canPutOnHold}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-primary-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <IconBan className="w-4 h-4" />
                          Put {isOnHold ? 'Off' : 'On'} Hold
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowCancelModal(true)
                            setShowActionsMenu(false)
                          }}
                          disabled={!canCancel}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-primary-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <IconTrash className="w-4 h-4" />
                          Request Cancellation
                        </button>
                        
                        <button
                          onClick={() => {
                            handleCreateRMA()
                            setShowActionsMenu(false)
                          }}
                          disabled={!canCreateRMA}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-primary-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <IconExchange className="w-4 h-4" />
                          Create RMA
                        </button>
                        
                        <button
                          onClick={() => {
                            handleEditInOrderpoints()
                            setShowActionsMenu(false)
                          }}
                          disabled={!canCancel}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-primary-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <IconShoppingCart className="w-4 h-4" />
                          Edit in Orderpoints
                        </button>
                        
                        <button
                          onClick={() => {
                            handleCloneOrder()
                            setShowActionsMenu(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-primary-5 flex items-center gap-2"
                        >
                          <IconCopy className="w-4 h-4" />
                          Copy as Draft
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowResendModal(true)
                            setShowActionsMenu(false)
                          }}
                          disabled={!canResend}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-primary-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <IconEnvelope className="w-4 h-4" />
                          Re-send Ship Confirmation
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowTransferModal(true)
                            setShowActionsMenu(false)
                          }}
                          disabled={!canTransfer}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-primary-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <IconArrowsRightLeft className="w-4 h-4" />
                          Warehouse Transfer
                        </button>
                        
                        {hasOriginalData && (
                          <>
                            <div className="border-t border-border-color my-1"></div>
                            <button
                              onClick={() => {
                                setShowOriginal(!showOriginal)
                                setShowActionsMenu(false)
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-primary-5 flex items-center gap-2"
                            >
                              <IconFileCode className="w-4 h-4" />
                              {showOriginal ? 'Show DCL Order' : 'Show Original Order'}
                            </button>
                          </>
                        )}
                        
                        {isEDI && (
                          <>
                            {!hasOriginalData && <div className="border-t border-border-color my-1"></div>}
                            <button
                              onClick={() => {
                                console.log('Show EDI Documents')
                                setShowActionsMenu(false)
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-primary-5 flex items-center gap-2"
                            >
                              <IconFileCode className="w-4 h-4" />
                              Show EDI Documents
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="small"
                  icon={<IconPrinter />}
                  iconOnly
                  onClick={handlePrint}
                />
                <Button
                  variant="outline"
                  size="small"
                  icon={<IconRefresh />}
                  iconOnly
                  onClick={handleRefresh}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showPutOnHoldModal} onOpenChange={setShowPutOnHoldModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Put Order On Hold</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="holdReason">Reason to put on hold:</Label>
              <Textarea
                id="holdReason"
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                placeholder="Enter reason for putting order on hold..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPutOnHoldModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePutOnHold}>
              Put On Hold
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPutOffHoldModal} onOpenChange={setShowPutOffHoldModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Put Order Off Hold</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to put this order off hold?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPutOffHoldModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePutOffHold}>
              Put Off Hold
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Cancellation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <IconAlertCircle className="w-5 h-5" />
              <p>Are you sure you want to cancel this order?</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleCancelOrder}>
              Request Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Warehouse Transfer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p><strong>Transfer Order #:</strong> {data.order_number}</p>
              <p><strong>From Warehouse:</strong> {data.location}</p>
            </div>
            <div>
              <Label htmlFor="destinationWarehouse">To Warehouse:</Label>
              <Select value={destinationWarehouse} onValueChange={setDestinationWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {data.home_dir?.map((warehouse) => (
                    <SelectItem key={warehouse} value={warehouse}>
                      {warehouse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleTransferOrder}
              disabled={!destinationWarehouse}
            >
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResendModal} onOpenChange={setShowResendModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Re-send Ship Confirmation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="shipToEmail">Ship to e-mail:</Label>
              <Input
                id="shipToEmail"
                type="email"
                value={shipToEmail}
                onChange={(e) => setShipToEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="billToEmail">Bill to e-mail:</Label>
              <Input
                id="billToEmail"
                type="email"
                value={billToEmail}
                onChange={(e) => setBillToEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResendModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResendShipConfirmation}>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function OrderOverview({ data, onClose, variant = 'overlay', onPrevious, onNext, hasPrevious, hasNext, currentIndex, totalItems }: Props) {
  const billing = data.billing_address || ({} as any)
  const shipping = data.shipping_address || ({} as any)
  const shipmentsOverview = data.shipments_overview || ({} as any)
  const shipments = (shipmentsOverview.shipments as any[]) || []
  const packages = (shipmentsOverview.packages as any[]) || []
  const packageDetails = (shipmentsOverview.package_details as any[]) || []
  const serialLots = (shipmentsOverview.serials as any[]) || []

  return (
    <div className={variant === 'overlay' ? 'fixed inset-0 bg-black/40 z-50 flex p-4' : 'w-full'}>
      <div className={variant === 'overlay' ? 'bg-background rounded-xl shadow-2xl w-full max-w-[1800px] mx-auto overflow-hidden flex flex-col max-h-[95vh]' : 'bg-background rounded-xl border border-border-color shadow w-full overflow-hidden flex flex-col'}>
        <OrderTopBar 
          data={data} 
          onClose={onClose}
          onPrevious={onPrevious}
          onNext={onNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          currentIndex={currentIndex}
          totalItems={totalItems}
        />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Main Layout: 2 MAIN COLUMNS */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* LEFT COLUMN - 3 columns wide - Contains 2 rows */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Left Column - Row 1: Shipping Address + Shipping Method (2 panels side by side) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <Card>
                    <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconMapPin className="w-4 h-4" />
                        SHIPPING ADDRESS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Company:</div>
                            <div className="font-semibold text-font-color">{shipping.company}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Attention:</div>
                            <div className="text-font-color">{shipping.attention || '-'}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Address 1:</div>
                            <div className="text-font-color">{shipping.address1}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Address 2:</div>
                            <div className="text-font-color">{shipping.address2 || '-'}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">City:</div>
                            <div className="text-font-color">{shipping.city}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Postal Code:</div>
                            <div className="text-font-color">{shipping.postal_code}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">State:</div>
                            <div className="text-font-color">{shipping.state_province}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Country:</div>
                            <div className="text-font-color">{shipping.country}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Phone:</div>
                            <div className="text-font-color">{shipping.phone || '-'}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Email:</div>
                            <div className="text-font-color">{shipping.email || '-'}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Method */}
                  <Card>
                    <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconTruck className="w-4 h-4" />
                        SHIPPING METHOD
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">Shipping WH:</span>
                          </div>
                          <div>
                            <span className="text-font-color">{data.location || '-'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">Receipt Date:</span>
                          </div>
                          <div>
                            <span className="text-font-color">{data.received_date ? new Date(data.received_date).toLocaleString() : '-'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">International Code:</span>
                          </div>
                          <div>
                            <span className="text-font-color">{data.international_code || '0'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">Carrier:</span>
                          </div>
                          <div>
                            <span className="text-font-color">{data.shipping_carrier || '-'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">Freight Account:</span>
                          </div>
                          <div>
                            <span className="text-font-color">{data.freight_account || '-'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">Account #:</span>
                          </div>
                          <div>
                            <span className="text-font-color">{data.account_number}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">Order Status:</span>
                          </div>
                          <div>
                            <Badge variant={data.is_cancelled ? 'danger' : data.order_status === 0 ? 'warning' : 'success'}>
                              {data.is_cancelled ? 'Cancelled' : data.order_status === 0 ? 'On Hold' : 'Normal'}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">Payment Type:</span>
                          </div>
                          <div>
                            <span className="text-font-color">{data.payment_type || '-'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">Service:</span>
                          </div>
                          <div>
                            <span className="text-font-color">{data.shipping_service || '-'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">Consignee #:</span>
                          </div>
                          <div>
                            <span className="text-font-color">{data.consignee_number || '-'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-font-color-100">FOB Location:</span>
                          </div>
                          <div>
                            <span className="text-font-color">{data.fob || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Left Column - Row 2: Billing Address + Shipping Instructions + Packing List Comments (3 panels side by side) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Billing Address */}
                  <Card>
                    <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconBuilding className="w-4 h-4" />
                        BILLING ADDRESS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Company:</div>
                            <div className="font-semibold text-font-color">{billing.company || '-'}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Attention:</div>
                            <div className="text-font-color">{billing.attention || '-'}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Address 1:</div>
                            <div className="text-font-color">{billing.address1 || '-'}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Address 2:</div>
                            <div className="text-font-color">{billing.address2 || '-'}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">City:</div>
                            <div className="text-font-color">{billing.city || '-'}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Postal Code:</div>
                            <div className="text-font-color">{billing.postal_code || '-'}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">State:</div>
                            <div className="text-font-color">{billing.state_province || '-'}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Country:</div>
                            <div className="text-font-color">{billing.country || '-'}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Phone:</div>
                            <div className="text-font-color">{billing.phone || '-'}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-1">Email:</div>
                            <div className="text-font-color">{billing.email || '-'}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Instructions */}
                  <Card>
                    <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconMessageShare className="w-4 h-4" />
                        SHIPPING INSTRUCTIONS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-sm">
                        <div className="text-font-color leading-relaxed min-h-[120px] bg-body-color p-3 rounded">
                          {data.shipping_instructions || (
                            <span className="text-font-color-100 italic">No shipping instructions</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Packing List Comments */}
                  <Card>
                    <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconPackage className="w-4 h-4" />
                        PACKING LIST COMMENTS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-sm">
                        <div className="text-font-color leading-relaxed min-h-[120px] bg-body-color p-3 rounded">
                          {data.packing_list_comments || (
                            <span className="text-font-color-100 italic">No packing list comments</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* RIGHT COLUMN - 1 column wide - Stacked panels: General, Amounts, Custom Fields */}
              <div className="lg:col-span-1 space-y-6">
                {/* General Panel */}
                <Card>
                  <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
                    <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                      <IconFileText className="w-4 h-4" />
                      GENERAL
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Channel:</span>
                        <Badge variant="default">{data.order_type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Order Stage:</span>
                        <Badge variant="success">Fully Shipped</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Customer #:</span>
                        <span className="text-font-color">{data.customer_number || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">PO #:</span>
                        <span className="text-font-color">{data.po_number || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Order Date:</span>
                        <span className="text-font-color">{new Date(data.ordered_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Packing List:</span>
                        <span className="text-font-color">{data.packing_list_type || '-'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Amounts Panel */}
                <Card>
                  <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
                    <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                      <IconCreditCard className="w-4 h-4" />
                      AMOUNTS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Order Amount:</span>
                        <span className="font-mono text-font-color">${Intl.NumberFormat().format(data.order_subtotal || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">S & H:</span>
                        <span className="font-mono text-font-color">${Intl.NumberFormat().format(data.shipping_handling || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Sales Taxes:</span>
                        <span className="font-mono text-font-color">${Intl.NumberFormat().format(data.sales_tax || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Discount/Add. Chgs.:</span>
                        <span className="font-mono text-font-color">${Intl.NumberFormat().format(data.international_handling || 0)}</span>
                      </div>
                      <div className="flex justify-between border-t border-border-color pt-2 font-bold">
                        <span className="text-font-color">Total Amount:</span>
                        <span className="font-mono text-font-color">${Intl.NumberFormat().format(data.total_due || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Amount Paid:</span>
                        <span className="font-mono text-font-color">${Intl.NumberFormat().format(data.amount_paid || 0)}</span>
                      </div>
                      <div className="flex justify-between border-t-2 border-border-color pt-2 font-bold text-primary">
                        <span>Net Due:</span>
                        <span className="font-mono">${Intl.NumberFormat().format(data.net_due_currency || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Balance Due (US):</span>
                        <span className="font-mono text-font-color">${Intl.NumberFormat().format(data.balance_due_us || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Int. Decl. Value:</span>
                        <span className="font-mono text-font-color">${Intl.NumberFormat().format(data.international_declared_value || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Insurance:</span>
                        <span className="font-mono text-font-color">${Intl.NumberFormat().format(data.insurance || 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Fields Panel */}
                <Card>
                  <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
                    <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                      <IconSettings className="w-4 h-4" />
                      CUSTOM FIELDS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Custom Field 1:</span>
                        <span className="text-font-color">{data.custom_field1 || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Custom Field 2:</span>
                        <span className="text-font-color">{data.custom_field2 || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Custom Field 3:</span>
                        <span className="text-font-color">{data.custom_field3 || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Custom Field 4:</span>
                        <span className="text-font-color">{data.custom_field4 || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Custom Field 5:</span>
                        <span className="text-font-color">{data.custom_field5 || '-'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>


            {/* Order Lines */}
            <OrderLinesTable orderLines={data.order_lines} />

            {/* Shipments and Packages - with Table/Hierarchy View Toggle */}
            <ShipmentsSection data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Table components (same as before but with improved styling)
function OrderLinesTable({ orderLines }: { orderLines: any[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-font-color">
          <IconPackage className="w-5 h-5 text-primary" />
          ORDER LINES
        </CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-body-color border-b border-border-color">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Line #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Item Details</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Qty</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Shipped</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Backlog</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Subtotal</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Ship By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {orderLines?.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-primary-5/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold text-font-color">{item.line_number}</div>
                  {item.custom_field3 && (
                    <div className="text-xs text-font-color-100 mt-1">{item.custom_field3}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold text-font-color">{item.item_number}</div>
                  <div className="text-sm text-primary mt-1">{item.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.custom_field1 && (
                      <Badge variant="default" outline className="text-xs">
                        CF1: {item.custom_field1}
                      </Badge>
                    )}
                    {item.custom_field2 && (
                      <Badge variant="default" outline className="text-xs">
                        CF2: {item.custom_field2}
                      </Badge>
                    )}
                    {item.custom_field5 && (
                      <Badge variant="default" outline className="text-xs">
                        CF5: {item.custom_field5}
                      </Badge>
                    )}
                  </div>
                  {item.comments && (
                    <div className="text-xs text-font-color-100 mt-1 italic">
                      {item.comments}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="text-sm font-semibold text-font-color">
                    {Intl.NumberFormat().format(item.quantity || 0)}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="text-sm font-semibold text-green-600">
                    {Intl.NumberFormat().format(item.shipped || 0)}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="text-sm text-orange-600">
                    {Intl.NumberFormat().format((item.quantity || 0) - (item.shipped || 0))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="text-sm font-semibold text-font-color">
                    ${Intl.NumberFormat().format(item.price || 0)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="text-sm font-semibold text-font-color">
                    ${Intl.NumberFormat().format((item.price || 0) * (item.quantity || 0))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="text-sm text-font-color">
                    {item.ship_by ? new Date(item.ship_by).toLocaleDateString() : '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-border-color bg-primary-5">
        <div className="flex justify-end">
          <div className="text-sm font-bold text-font-color-100">
            Total: <span className="text-primary">${Intl.NumberFormat().format(orderLines?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0) || 0)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function ShipmentTable({ shipments }: { shipments: any[] }) {
  if (!shipments || shipments.length === 0) return null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-font-color">
          <IconTruck className="w-5 h-5 text-primary" />
          SHIPMENTS
        </CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-body-color border-b border-border-color">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Ship Date</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Packages</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Weight</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Carrier</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Service</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Tracking</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Documents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {shipments.map((shipment, index) => (
              <tr key={shipment.id || index} className="hover:bg-primary-5/30 transition-colors">
                <td className="px-4 py-3 text-center text-sm font-semibold text-font-color">
                  {shipment.line_index || index + 1}
                </td>
                <td className="px-4 py-3 text-center text-sm text-font-color">
                  {shipment.ship_date ? new Date(shipment.ship_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 text-center text-sm text-font-color">
                  {shipment.package_count || shipment.packages || '-'}
                </td>
                <td className="px-4 py-3 text-right text-sm text-font-color">
                  {Intl.NumberFormat().format(shipment.total_weight || shipment.weight || 0)} lbs
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {shipment.shipping_carrier || shipment.carrier || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {shipment.shipping_service || shipment.service || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {shipment.rs_tr || shipment.tracking_number || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {shipment.pl_link && (
                      <Button
                        variant="outline"
                        size="small"
                        icon={<IconFileText />}
                        onClick={() => window.open(shipment.pl_link, '_blank')}
                      >
                        Packing List
                      </Button>
                    )}
                    {shipment.ci_link && (
                      <Button
                        variant="outline"
                        size="small"
                        icon={<IconFileText />}
                        onClick={() => window.open(shipment.ci_link, '_blank')}
                      >
                        Invoice
                      </Button>
                    )}
                    {shipment.bol_link && (
                      <Button
                        variant="outline"
                        size="small"
                        icon={<IconFileText />}
                        onClick={() => window.open(shipment.bol_link, '_blank')}
                      >
                        BOL
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function PackageTable({ packages }: { packages: any[] }) {
  if (!packages || packages.length === 0) return null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-font-color">
          <IconPackage className="w-5 h-5 text-primary" />
          PACKAGES
        </CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-body-color border-b border-border-color">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Ship Date</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Delivery Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Package #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Tracking</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Weight</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Dimensions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {packages.map((pkg, index) => (
              <tr key={pkg.id || index} className="hover:bg-primary-5/30 transition-colors">
                <td className="px-4 py-3 text-center text-sm font-semibold text-font-color">
                  {pkg.line_index || index + 1}
                </td>
                <td className="px-4 py-3 text-center text-sm text-font-color">
                  {pkg.ship_date ? new Date(pkg.ship_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 text-center text-sm text-font-color">
                  {pkg.delivery_date ? new Date(pkg.delivery_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="info" outline>
                    {pkg.delivery_info || 'In Transit'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  <div>{pkg.package_number}</div>
                  {pkg.pallet_number && (
                    <div className="text-xs text-primary mt-1">{pkg.pallet_number}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {pkg.tracking_link || pkg.tracking_number_link ? (
                    <a href={pkg.tracking_link || pkg.tracking_number_link} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      {pkg.tracking_number}
                    </a>
                  ) : (
                    pkg.tracking_number || '-'
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm text-font-color">
                  {Intl.NumberFormat().format(pkg.package_weight || pkg.weight || 0)} lbs
                </td>
                <td className="px-4 py-3 text-center text-sm text-font-color">
                  {pkg.package_dimension || pkg.dimension || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function PackageDetailTable({ packageDetails }: { packageDetails: any[] }) {
  if (!packageDetails || packageDetails.length === 0) return null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-font-color">
          <IconPackage className="w-5 h-5 text-primary" />
          PACKAGE DETAILS
        </CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-body-color border-b border-border-color">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Ship Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Package #</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Line #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Item #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {packageDetails.map((detail, index) => (
              <tr key={detail.id || index} className="hover:bg-primary-5/30 transition-colors">
                <td className="px-4 py-3 text-center text-sm font-semibold text-font-color">
                  {detail.line_index || index + 1}
                </td>
                <td className="px-4 py-3 text-center text-sm text-font-color">
                  {detail.ship_date ? new Date(detail.ship_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {detail.package_number}
                </td>
                <td className="px-4 py-3 text-center text-sm text-font-color">
                  {detail.line_number}
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {detail.item_number}
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {detail.description}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-font-color">
                  {Intl.NumberFormat().format(detail.quantity || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function SerialLotTable({ serialLots }: { serialLots: any[] }) {
  if (!serialLots || serialLots.length === 0) return null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary-10 border-b border-border-color py-3 px-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-font-color">
          <IconPackage className="w-5 h-5 text-primary" />
          SERIAL/LOT NUMBERS
        </CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-body-color border-b border-border-color">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Ship Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Package #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Item #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Serial/Lot #</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {serialLots.map((serial, index) => (
              <tr key={serial.id || index} className="hover:bg-primary-5/30 transition-colors">
                <td className="px-4 py-3 text-center text-sm font-semibold text-font-color">
                  {serial.line_index || index + 1}
                </td>
                <td className="px-4 py-3 text-center text-sm text-font-color">
                  {serial.ship_date ? new Date(serial.ship_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {serial.package_number || serial.carton_id || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {serial.item_number || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {serial.description || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-font-color">
                  {serial.serial_lot_number || serial.serial_number || serial.serial_no || serial.extrafield_1 || '-'}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-font-color">
                  {Intl.NumberFormat().format(serial.quantity || 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
