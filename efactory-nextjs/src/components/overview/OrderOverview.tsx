import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { 
  IconChevronLeft, 
  IconChevronRight, 
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
  IconAlertCircle,
  IconEdit,
  IconChevronDown,
  IconChevronUp
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
import { useOrderNavigation } from '@/contexts/OrderNavigationContext'
import { OrderStageRenderer, OrderTypePill } from '@/components/common/AgGrid/renderers'

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
  onRefresh?: () => void
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
  onRefresh?: (() => void) | undefined
  isNavigating?: boolean | undefined
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

function OrderTopBar({ data, onClose, onPrevious, onNext, hasPrevious, hasNext, currentIndex, totalItems, onRefresh, isNavigating }: OrderTopBarProps) {
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
    if (onRefresh) {
      onRefresh()
    } else {
      window.location.reload()
    }
  }

  const handleCloneOrder = async () => {
    try {
      const result = await orderCloneToDraft(data.order_number, data.account_number)
      
      // Store the draft data using the proper format that orderpoints expects
      if (result.draft_order) {
        // Use the same format as the legacy system - wrap in response structure
        const responseData = {
          data: {
            draft_order: result.draft_order,
            total_drafts: result.total_drafts
          }
        }
        
        
        // Store using the proper cache function
        const { storeOrderDraft } = await import('@/services/orderEntryCache')
        storeOrderDraft(responseData as any)
        
        
        // Navigate to order points page using Next.js router (no page refresh)
        // We'll pass the navigation function as a prop from the parent component
        if (typeof window !== 'undefined') {
          // For now, we'll use a custom event to communicate with the parent component
          window.dispatchEvent(new CustomEvent('navigateToOrderPoints'))
        }
      }
    } catch (error) {
      console.error('Error cloning order:', error)
      // You might want to show a toast notification here
    }
  }


  const handlePutOnHold = async () => {
    try {
      await orderPutOnHold(data.order_id, data.location, holdReason)
      setShowPutOnHoldModal(false)
      setHoldReason('')
    } catch (error) {
      console.error('Error putting order on hold:', error)
      // You might want to show a toast notification here
    }
  }

  const handlePutOffHold = async () => {
    try {
      await orderPutOffHold(data.order_id, data.location)
      setShowPutOffHoldModal(false)
    } catch (error) {
      console.error('Error putting order off hold:', error)
      // You might want to show a toast notification here
    }
  }

  const handleCancelOrder = async () => {
    try {
      await orderCancel(data.order_id, data.location)
      setShowCancelModal(false)
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
      // window.location.href = '/returntrak/entry'
    } catch (error) {
      console.error('Error creating RMA:', error)
      // You might want to show a toast notification here
    }
  }

  const handleEditInOrderpoints = async () => {
    try {
      // Check if order can be edited (same conditions as legacy)
      const canEdit = data.order_stage === 10 || (data.order_stage < 10 && data.order_status === 0)
      if (!canEdit) {
        return
      }
      
      // Call the readOrderFrom API (same as legacy)
      const { readOrderFrom } = await import('@/services/api')
      const result = await readOrderFrom(data.order_id, data.location, false)
      
      // Store the order data using the same format as legacy system
      if (result) {
        const responseData = {
          data: result
        }
        
        
        // Store using the proper cache function
        const { storeOrderDraft } = await import('@/services/orderEntryCache')
        storeOrderDraft(responseData as any)
        
        
        // Navigate to order points page using custom event (no page refresh)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('navigateToOrderPoints'))
        }
      }
    } catch (error) {
      console.error('Error reading order for edit:', error)
      // You might want to show a toast notification here
    }
  }




  const handleResendShipConfirmation = async () => {
    try {
      await resendShipConfirmation(data.order_number, data.account_number, shipToEmail, billToEmail)
      setShowResendModal(false)
      // Show success message - you might want to show a toast notification here
    } catch (error) {
      console.error('Error resending ship confirmation:', error)
      // You might want to show a toast notification here
    }
  }

  return (
    <>
      <div className="bg-background border-b border-border-color">
        <div className="px-6 py-2">
          {/* Single Row Header - Everything in one line */}
          <div className="flex items-center justify-between">
            {/* Left Side - Close Button + Order Info */}
            <div className="flex items-center gap-4 flex-1">
              {/* Close Button - moved to left side */}
              <div className="flex items-center">
                <Button
                  onClick={onClose}
                  variant="danger"
                  size="small"
                  icon={<IconX className="w-5 h-5" />}
                  className="h-8 w-8 p-0"
                  iconOnly
                />
                <div className="h-4 w-px bg-border-color ml-3"></div>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-font-color">Order #{data.order_number}</h1>
                <Badge 
                  variant="secondary" 
                  className={`px-2 py-0.5 text-xs font-medium ${
                    data.order_stage >= 60 ? 'bg-green-700 text-white' :
                    data.order_stage === 2 ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-white' :
                    'bg-orange-500 text-white'
                  }`}
                >
                  {data.stage_description}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-font-color-100">Account:</span>
                  <span className="ml-1 font-medium text-font-color">{data.account_number}</span>
                </div>
                <div>
                  <span className="text-font-color-100">Type:</span>
                  <span className="ml-1 font-medium text-font-color">{data.order_type}</span>
                </div>
                {data.customer_number && (
                  <div>
                    <span className="text-font-color-100">Customer:</span>
                    <span className="ml-1 font-medium text-font-color">{data.customer_number}</span>
                  </div>
                )}
                {data.po_number && (
                  <div>
                    <span className="text-font-color-100">PO:</span>
                    <span className="ml-1 font-medium text-font-color">{data.po_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Navigation + Actions */}
            <div className="flex items-center">
              {/* Navigation arrows and counter */}
              {(hasPrevious || hasNext) && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={onPrevious || (() => {})}
                        variant="outline"
                        size="small"
                        icon={<IconChevronLeft />}
                        disabled={!hasPrevious || !!isNavigating}
                        className="h-7 w-8 p-0"
                      />
                      <Button
                        onClick={onNext || (() => {})}
                        variant="outline"
                        size="small"
                        icon={<IconChevronRight />}
                        disabled={!hasNext || !!isNavigating}
                        className="h-7 w-8 p-0"
                      />
                    </div>
                    
                    {currentIndex && totalItems && (
                      <div className="text-xs text-font-color-100 font-medium">
                        {currentIndex} of {totalItems}
                      </div>
                    )}
                  </div>
                  
                  {/* Vertical separator */}
                  <div className="h-4 w-px bg-border-color mx-3"></div>
                </>
              )}
              
              <div className="flex items-center gap-1">
                <div className="relative">
                  <Button
                    variant="primary"
                    size="small"
                    icon={<IconSettings />}
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    className="px-3 py-1.5 text-sm"
                  >
                    <span>Actions</span>
                    <IconChevronDown className={`ml-2 w-3 h-3 transition-transform ${showActionsMenu ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {showActionsMenu && (
                    <>
                      {/* Backdrop overlay to prevent content showing through */}
                      <div className="fixed inset-0 z-40" onClick={() => setShowActionsMenu(false)} />
                      <div className="absolute right-0 top-full mt-1 w-64 bg-card-color border border-border-color rounded-lg shadow-xl z-50">
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
                          className="w-full px-3 py-1.5 text-left text-sm text-font-color hover:bg-primary-10 hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-sm"
                        >
                          <IconBan className="w-4 h-4 text-font-color-100" />
                          Put {isOnHold ? 'Off' : 'On'} Hold
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowCancelModal(true)
                            setShowActionsMenu(false)
                          }}
                          disabled={!canCancel}
                          className="w-full px-3 py-1.5 text-left text-sm text-font-color hover:bg-primary-10 hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-sm"
                        >
                          <IconTrash className="w-4 h-4 text-font-color-100" />
                          Request Cancellation
                        </button>
                        
                        <button
                          onClick={() => {
                            handleCreateRMA()
                            setShowActionsMenu(false)
                          }}
                          disabled={!canCreateRMA}
                          className="w-full px-3 py-1.5 text-left text-sm text-font-color hover:bg-primary-10 hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-sm"
                        >
                          <IconExchange className="w-4 h-4 text-font-color-100" />
                          Create RMA
                        </button>
                        
                        <button
                          onClick={() => {
                            handleEditInOrderpoints()
                            setShowActionsMenu(false)
                          }}
                          disabled={!canCancel}
                          className="w-full px-3 py-1.5 text-left text-sm text-font-color hover:bg-primary-10 hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-sm"
                        >
                          <IconShoppingCart className="w-4 h-4 text-font-color-100" />
                          Edit in Orderpoints
                        </button>
                        
                        <button
                          onClick={() => {
                            handleCloneOrder()
                            setShowActionsMenu(false)
                          }}
                          className="w-full px-3 py-1.5 text-left text-sm text-font-color hover:bg-primary-10 hover:text-primary transition-all duration-200 flex items-center gap-2 rounded-sm"
                        >
                          <IconCopy className="w-4 h-4 text-font-color-100" />
                          Copy as Draft
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowResendModal(true)
                            setShowActionsMenu(false)
                          }}
                          disabled={!canResend}
                          className="w-full px-3 py-1.5 text-left text-sm text-font-color hover:bg-primary-10 hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-sm"
                        >
                          <IconEnvelope className="w-4 h-4 text-font-color-100" />
                          Re-send Ship Confirmation
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowTransferModal(true)
                            setShowActionsMenu(false)
                          }}
                          disabled={!canTransfer}
                          className="w-full px-3 py-1.5 text-left text-sm text-font-color hover:bg-primary-10 hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-sm"
                        >
                          <IconArrowsRightLeft className="w-4 h-4 text-font-color-100" />
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
                              className="w-full px-3 py-1.5 text-left text-sm text-font-color hover:bg-primary-10 hover:text-primary transition-all duration-200 flex items-center gap-2 rounded-sm"
                            >
                              <IconFileCode className="w-4 h-4 text-font-color-100" />
                              {showOriginal ? 'Show DCL Order' : 'Show Original Order'}
                            </button>
                          </>
                        )}
                        
                        {isEDI && (
                          <>
                            {!hasOriginalData && <div className="border-t border-border-color my-1"></div>}
                            <button
                              onClick={() => {
                                setShowActionsMenu(false)
                              }}
                              className="w-full px-3 py-1.5 text-left text-sm text-font-color hover:bg-primary-10 hover:text-primary transition-all duration-200 flex items-center gap-2 rounded-sm"
                            >
                              <IconFileCode className="w-4 h-4 text-font-color-100" />
                              Show EDI Documents
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="small"
                  icon={<IconRefresh />}
                  iconOnly
                  onClick={handleRefresh}
                  className="h-6 w-6 p-0"
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
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold text-font-color">Request Cancellation</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-[var(--danger-50)] border border-[var(--danger)] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[var(--danger)] rounded-full flex items-center justify-center">
                    <IconAlertCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[var(--danger)] mb-1">Warning</h3>
                  <p className="text-sm text-font-color leading-relaxed">
                    Are you sure you want to cancel this order? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-body-color rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-font-color-100">Order #:</span>
                <span className="text-sm font-semibold text-font-color">{data.order_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-font-color-100">Account:</span>
                <span className="text-sm font-semibold text-font-color">{data.account_number}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-6 flex gap-3">
            <Button variant="outline" onClick={() => setShowCancelModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleCancelOrder} className="flex-1">
              Request Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold text-font-color">Warehouse Transfer</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-body-color rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-font-color-100">Transfer Order #:</span>
                <span className="text-sm font-semibold text-font-color">{data.order_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-font-color-100">From Warehouse:</span>
                <span className="text-sm font-semibold text-font-color">{data.location}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationWarehouse" className="text-sm font-medium text-font-color">
                To Warehouse:
              </Label>
              <Select value={destinationWarehouse} onValueChange={setDestinationWarehouse}>
                <SelectTrigger className="h-10">
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
          <DialogFooter className="pt-6 flex gap-3">
            <Button variant="outline" onClick={() => setShowTransferModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleTransferOrder}
              disabled={!destinationWarehouse}
              className="flex-1"
            >
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResendModal} onOpenChange={setShowResendModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold text-font-color">Re-send Ship Confirmation</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-body-color rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-font-color-100">Order #:</span>
                <span className="text-sm font-semibold text-font-color">{data.order_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-font-color-100">Account:</span>
                <span className="text-sm font-semibold text-font-color">{data.account_number}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipToEmail" className="text-sm font-medium text-font-color">
                  Ship to e-mail:
                </Label>
                <Input
                  id="shipToEmail"
                  type="email"
                  value={shipToEmail}
                  onChange={(e) => setShipToEmail(e.target.value)}
                  className="h-10"
                  placeholder="Enter ship-to email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billToEmail" className="text-sm font-medium text-font-color">
                  Bill to e-mail:
                </Label>
                <Input
                  id="billToEmail"
                  type="email"
                  value={billToEmail}
                  onChange={(e) => setBillToEmail(e.target.value)}
                  className="h-10"
                  placeholder="Enter bill-to email address"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-6 flex gap-3">
            <Button variant="outline" onClick={() => setShowResendModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResendShipConfirmation} className="flex-1">
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Utility function to display placeholder dashes as barely visible
const PlaceholderDash = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  if (children === '-') {
    return <span className={`text-font-color-100 opacity-30 ${className}`}>-</span>
  }
  return <span className={className}>{children}</span>
}

export default function OrderOverview({ data, onClose, variant = 'overlay', onPrevious, onNext, hasPrevious, hasNext, currentIndex, totalItems, onRefresh }: Props) {
  const router = useRouter()
  const billing = data.billing_address || ({} as any)
  const shipping = data.shipping_address || ({} as any)
  
  // Loading state for navigation - tied to actual API calls
  const [isNavigating, setIsNavigating] = useState(false)
  
  // Track when navigation starts and stops based on data changes
  const currentOrderNumber = data.order_number
  const prevOrderNumberRef = useRef(currentOrderNumber)
  
  useEffect(() => {
    // If order number changed, we're done navigating
    if (prevOrderNumberRef.current !== currentOrderNumber) {
      setIsNavigating(false)
      prevOrderNumberRef.current = currentOrderNumber
    }
  }, [currentOrderNumber])
  
  // Enhanced navigation handlers - start loading immediately
  const handlePrevious = () => {
    if (onPrevious && hasPrevious) {
      setIsNavigating(true) // Start blur immediately
      onPrevious() // This triggers API call
      // Fallback: clear loading after max 3 seconds if API doesn't respond
      setTimeout(() => setIsNavigating(false), 3000)
    }
  }
  
  const handleNext = () => {
    if (onNext && hasNext) {
      setIsNavigating(true) // Start blur immediately  
      onNext() // This triggers API call
      // Fallback: clear loading after max 3 seconds if API doesn't respond
      setTimeout(() => setIsNavigating(false), 3000)
    }
  }

  // Dialog states for expandable text areas
  const [shippingInstructionsDialog, setShippingInstructionsDialog] = useState(false)
  const [commentsDialog, setCommentsDialog] = useState(false)
  
  // Table row limiting states
  const [showAllOrderLines, setShowAllOrderLines] = useState(false)

  // Listen for navigation events from OrderTopBar
  useEffect(() => {
    const handleNavigateToOrderPoints = () => {
      router.push('/orderpoints')
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('navigateToOrderPoints', handleNavigateToOrderPoints)
      return () => {
        window.removeEventListener('navigateToOrderPoints', handleNavigateToOrderPoints)
      }
    }
  }, [router])
  
  // Panel expand/collapse states
  const [amountsExpanded, setAmountsExpanded] = useState(false)
  const [generalExpanded, setGeneralExpanded] = useState(false)
  const [customFieldsExpanded, setCustomFieldsExpanded] = useState(false)
  const [billingExpanded, setBillingExpanded] = useState(false)
  const shipmentsOverview = data.shipments_overview || ({} as any)
  const shipments = (shipmentsOverview.shipments as any[]) || []
  const packages = (shipmentsOverview.packages as any[]) || []
  const packageDetails = (shipmentsOverview.package_details as any[]) || []
  const serialLots = (shipmentsOverview.serials as any[]) || []
  
  // Helper functions for filtering fields with values
  const getAmountsFieldsWithValues = () => {
    const fields = [
      { key: 'order_subtotal', label: 'Order Amount', value: data.order_subtotal || 0, alwaysShow: true },
      { key: 'shipping_handling', label: 'S & H', value: data.shipping_handling || 0 },
      { key: 'sales_tax', label: 'Sales Taxes', value: data.sales_tax || 0 },
      { key: 'international_handling', label: 'Discount/Add. Chgs.', value: data.international_handling || 0 },
      { key: 'total_due', label: 'Total Amount', value: data.total_due || 0, alwaysShow: true, isBold: true },
      { key: 'amount_paid', label: 'Amount Paid', value: data.amount_paid || 0 },
      { key: 'net_due_currency', label: 'Net Due', value: data.net_due_currency || 0, alwaysShow: true, isBold: true },
      { key: 'balance_due_us', label: 'Balance Due (US)', value: data.balance_due_us || 0 },
      { key: 'international_declared_value', label: 'Int. Decl. Value', value: data.international_declared_value || 0 },
      { key: 'insurance', label: 'Insurance', value: data.insurance || 0 }
    ]
    return amountsExpanded ? fields : fields.filter(field => field.alwaysShow || field.value > 0)
  }
  
  const getGeneralFieldsWithValues = () => {
    const fields = [
      { key: 'po_number', label: 'PO Number', value: data.po_number },
      { key: 'ordered_date', label: 'Ordered Date', value: data.ordered_date ? new Date(data.ordered_date).toLocaleDateString() : '' },
      { key: 'received_date', label: 'Received Date', value: data.received_date ? new Date(data.received_date).toLocaleDateString() : '' },
      { key: 'payment_type', label: 'Payment Type', value: data.payment_type },
      { key: 'terms', label: 'Terms', value: data.terms },
      { key: 'fob', label: 'FOB', value: data.fob },
      { key: 'shipping_carrier', label: 'Shipping Carrier', value: data.shipping_carrier },
      { key: 'shipping_service', label: 'Shipping Service', value: data.shipping_service }
    ]
    return generalExpanded ? fields : fields.filter(field => field.value && field.value.toString().trim() !== '')
  }
  
  const getCustomFieldsWithValues = () => {
    const fields = [
      { key: 'custom_field1', label: 'Custom Field 1', value: data.custom_field1 },
      { key: 'custom_field2', label: 'Custom Field 2', value: data.custom_field2 },
      { key: 'custom_field3', label: 'Custom Field 3', value: data.custom_field3 },
      { key: 'custom_field4', label: 'Custom Field 4', value: data.custom_field4 },
      { key: 'custom_field5', label: 'Custom Field 5', value: data.custom_field5 }
    ]
    return customFieldsExpanded ? fields : fields.filter(field => field.value && field.value.toString().trim() !== '')
  }
  
  const getBillingFieldsWithValues = () => {
    const fields = [
      { key: 'company', label: 'Company', value: billing.company },
      { key: 'attention', label: 'Attention', value: billing.attention },
      { key: 'address1', label: 'Address 1', value: billing.address1 },
      { key: 'address2', label: 'Address 2', value: billing.address2 },
      { key: 'city', label: 'City', value: billing.city },
      { key: 'state_province', label: 'State/Province', value: billing.state_province },
      { key: 'postal_code', label: 'Postal Code', value: billing.postal_code },
      { key: 'country', label: 'Country', value: billing.country },
      { key: 'phone', label: 'Phone', value: billing.phone },
      { key: 'email', label: 'Email', value: billing.email }
    ]
    return billingExpanded ? fields : fields.filter(field => field.value && field.value.trim() !== '')
  }

  return (
    <div className={variant === 'overlay' ? 'fixed inset-0 bg-black/40 z-50 flex p-4' : 'w-full'}>
      <div className={variant === 'overlay' ? 'bg-background rounded-xl shadow-2xl w-full max-w-[1800px] mx-auto overflow-hidden flex flex-col max-h-[95vh]' : 'bg-background rounded-xl border border-border-color shadow w-full max-w-[1800px] mx-auto overflow-hidden flex flex-col'}>
        <OrderTopBar 
          data={data} 
          onClose={onClose}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          currentIndex={currentIndex}
          totalItems={totalItems}
          onRefresh={onRefresh}
          isNavigating={isNavigating}
        />
        
        <div className={`flex-1 overflow-y-auto transition-all duration-200 relative ${isNavigating ? 'blur-sm opacity-60 pointer-events-none' : ''}`}>
          {/* Loading overlay during navigation */}
          {isNavigating && (
            <div className="absolute inset-0 bg-background/20 z-10 flex items-center justify-center">
              <div className="bg-background border border-border-color rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-font-color-100">Loading order...</span>
                </div>
              </div>
            </div>
          )}
          <div className="p-3 space-y-2">
            {/* Main Layout: 2 MAIN COLUMNS */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
              
              {/* LEFT COLUMN - 3 columns wide - Contains 2 rows */}
              <div className="lg:col-span-3 space-y-2">
                
                {/* Left Column - Row 1: Shipping Address + Shipping Method (2 panels side by side) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {/* Shipping Address */}
                  <Card>
                    <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconMapPin className="w-4 h-4" />
                        SHIPPING ADDRESS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="font-medium text-font-color-100 mb-0.5">Company:</div>
                            <div className="font-semibold text-font-color">{shipping.company}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-0.5">Attention:</div>
                            <div className="font-medium text-font-color"><PlaceholderDash>{shipping.attention || '-'}</PlaceholderDash></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="font-medium text-font-color-100 mb-0.5">Address 1:</div>
                            <div className="font-medium text-font-color">{shipping.address1}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-0.5">Address 2:</div>
                            <div className="font-medium text-font-color"><PlaceholderDash>{shipping.address2 || '-'}</PlaceholderDash></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="font-medium text-font-color-100 mb-0.5">City:</div>
                            <div className="font-medium text-font-color">{shipping.city}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-0.5">Postal Code:</div>
                            <div className="font-medium text-font-color">{shipping.postal_code}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="font-medium text-font-color-100 mb-0.5">State:</div>
                            <div className="font-medium text-font-color">{shipping.state_province}</div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-0.5">Country:</div>
                            <div className="font-medium text-font-color">{shipping.country}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="font-medium text-font-color-100 mb-0.5">Phone:</div>
                            <div className="font-medium text-font-color"><PlaceholderDash>{shipping.phone || '-'}</PlaceholderDash></div>
                          </div>
                          <div>
                            <div className="font-medium text-font-color-100 mb-0.5">Email:</div>
                            <div className="font-medium text-font-color"><PlaceholderDash>{shipping.email || '-'}</PlaceholderDash></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Method */}
                  <Card>
                    <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconTruck className="w-4 h-4" />
                        SHIPPING METHOD
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">Shipping WH:</span>
                          </div>
                          <div>
                            <span className="font-medium text-font-color"><PlaceholderDash>{data.location || '-'}</PlaceholderDash></span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">Receipt Date:</span>
                          </div>
                          <div>
                            <span className="font-medium text-font-color">{data.received_date ? new Date(data.received_date).toLocaleString() : '-'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">International Code:</span>
                          </div>
                          <div>
                            <span className="font-medium text-font-color">{data.international_code || '0'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">Carrier:</span>
                          </div>
                          <div>
                            <span className="font-medium text-font-color"><PlaceholderDash>{data.shipping_carrier || '-'}</PlaceholderDash></span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">Freight Account:</span>
                          </div>
                          <div>
                            <span className="font-medium text-font-color"><PlaceholderDash>{data.freight_account || '-'}</PlaceholderDash></span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">Account #:</span>
                          </div>
                          <div>
                            <span className="font-medium text-font-color">{data.account_number}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">Order Status:</span>
                          </div>
                          <div>
                            <Badge variant={data.is_cancelled ? 'danger' : data.order_status === 0 ? 'warning' : 'success'}>
                              {data.is_cancelled ? 'Cancelled' : data.order_status === 0 ? 'On Hold' : 'Normal'}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">Payment Type:</span>
                          </div>
                          <div>
                            <span className="font-medium text-font-color"><PlaceholderDash>{data.payment_type || '-'}</PlaceholderDash></span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">Service:</span>
                          </div>
                          <div>
                            <span className="font-medium text-font-color"><PlaceholderDash>{data.shipping_service || '-'}</PlaceholderDash></span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">Consignee #:</span>
                          </div>
                          <div>
                            <span className="font-medium text-font-color"><PlaceholderDash>{data.consignee_number || '-'}</PlaceholderDash></span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-font-color-100">FOB Location:</span>
                          </div>
                          <div>
                            <span className="font-medium text-font-color"><PlaceholderDash>{data.fob || '-'}</PlaceholderDash></span>
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
                    <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                          <IconBuilding className="w-4 h-4" />
                          BILLING ADDRESS
                        </CardTitle>
                        {!billingExpanded && (() => {
                          const allBillingFields = [
                            billing.company, billing.attention, billing.address1, billing.address2,
                            billing.city, billing.state_province, billing.postal_code, billing.country,
                            billing.phone, billing.email
                          ];
                          return allBillingFields.some(field => field && field.trim() !== '');
                        })() && (
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => setBillingExpanded(true)}
                            className="flex items-center gap-1"
                          >
                            <IconChevronDown className="w-4 h-4" />
                            Show All
                          </Button>
                        )}
                        {billingExpanded && (
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => setBillingExpanded(false)}
                            className="flex items-center gap-1"
                          >
                            <IconChevronUp className="w-4 h-4" />
                            Show Less
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="space-y-1 text-sm">
                        {billingExpanded ? (
                          // Show all fields when expanded
                          <>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-font-color-100">Company:</span>
                              <span className={`font-medium ${billing.company ? 'text-font-color' : 'text-font-color-100'}`}>
                                <PlaceholderDash>{billing.company || '-'}</PlaceholderDash>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-font-color-100">Attention:</span>
                              <span className={`font-medium ${billing.attention ? 'text-font-color' : 'text-font-color-100'}`}>
                                <PlaceholderDash>{billing.attention || '-'}</PlaceholderDash>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-font-color-100">Address 1:</span>
                              <span className={`font-medium ${billing.address1 ? 'text-font-color' : 'text-font-color-100'}`}>
                                <PlaceholderDash>{billing.address1 || '-'}</PlaceholderDash>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-font-color-100">Address 2:</span>
                              <span className={`font-medium ${billing.address2 ? 'text-font-color' : 'text-font-color-100'}`}>
                                <PlaceholderDash>{billing.address2 || '-'}</PlaceholderDash>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-font-color-100">City:</span>
                              <span className={`font-medium ${billing.city ? 'text-font-color' : 'text-font-color-100'}`}>
                                <PlaceholderDash>{billing.city || '-'}</PlaceholderDash>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-font-color-100">State/Province:</span>
                              <span className={`font-medium ${billing.state_province ? 'text-font-color' : 'text-font-color-100'}`}>
                                <PlaceholderDash>{billing.state_province || '-'}</PlaceholderDash>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-font-color-100">Postal Code:</span>
                              <span className={`font-medium ${billing.postal_code ? 'text-font-color' : 'text-font-color-100'}`}>
                                <PlaceholderDash>{billing.postal_code || '-'}</PlaceholderDash>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-font-color-100">Country:</span>
                              <span className={`font-medium ${billing.country ? 'text-font-color' : 'text-font-color-100'}`}>
                                <PlaceholderDash>{billing.country || '-'}</PlaceholderDash>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-font-color-100">Phone:</span>
                              <span className={`font-medium ${billing.phone ? 'text-font-color' : 'text-font-color-100'}`}>
                                <PlaceholderDash>{billing.phone || '-'}</PlaceholderDash>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-font-color-100">Email:</span>
                              <span className={`font-medium ${billing.email ? 'text-font-color' : 'text-font-color-100'}`}>
                                <PlaceholderDash>{billing.email || '-'}</PlaceholderDash>
                              </span>
                            </div>
                          </>
                        ) : (
                          // Show only fields with values when collapsed
                          getBillingFieldsWithValues().length > 0 ? (
                            getBillingFieldsWithValues().map(field => (
                              <div key={field.key} className="flex justify-between items-center">
                                <span className="font-medium text-font-color-100">{field.label}:</span>
                                <span className="font-medium text-font-color">{field.value}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-font-color-100 italic py-4">
                              No billing address information
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Instructions */}
                  <Card>
                    <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconMessageShare className="w-4 h-4" />
                        SHIPPING INSTRUCTIONS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="text-sm">
                        <div className="relative">
                          <div 
                            className="text-font-color leading-relaxed min-h-[120px] bg-body-color p-3 pr-12 rounded cursor-pointer hover:bg-primary-10 transition-colors"
                            onClick={() => setShippingInstructionsDialog(true)}
                          >
                            {data.shipping_instructions ? (
                              <div className="line-clamp-6">
                                {data.shipping_instructions}
                              </div>
                            ) : (
                              <span className="text-font-color-100 italic">No shipping instructions</span>
                            )}
                          </div>
                          {data.shipping_instructions && (
                            <button
                              type="button"
                              onClick={() => setShippingInstructionsDialog(true)}
                              className="absolute top-1 right-1 p-1.5 text-font-color-100 hover:text-font-color transition-colors rounded"
                              title="Expand to view full content"
                            >
                              <IconEdit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Packing List Comments */}
                  <Card>
                    <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconPackage className="w-4 h-4" />
                        PACKING LIST COMMENTS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="text-sm">
                        <div className="relative">
                          <div 
                            className="text-font-color leading-relaxed min-h-[120px] bg-body-color p-3 pr-12 rounded cursor-pointer hover:bg-primary-10 transition-colors"
                            onClick={() => setCommentsDialog(true)}
                          >
                            {data.packing_list_comments ? (
                              <div className="line-clamp-6">
                                {data.packing_list_comments}
                              </div>
                            ) : (
                              <span className="text-font-color-100 italic">No packing list comments</span>
                            )}
                          </div>
                          {data.packing_list_comments && (
                            <button
                              type="button"
                              onClick={() => setCommentsDialog(true)}
                              className="absolute top-1 right-1 p-1.5 text-font-color-100 hover:text-font-color transition-colors rounded"
                              title="Expand to view full content"
                            >
                              <IconEdit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* RIGHT COLUMN - 1 column wide - Stacked panels: General, Amounts, Custom Fields */}
              <div className="lg:col-span-1 space-y-2">
                {/* General Panel */}
                <Card>
                  <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconFileText className="w-4 h-4" />
                        GENERAL
                      </CardTitle>
                      {!generalExpanded && getGeneralFieldsWithValues().length > 0 && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => setGeneralExpanded(true)}
                          className="flex items-center gap-1"
                        >
                          <IconChevronDown className="w-4 h-4" />
                          Show All
                        </Button>
                      )}
                      {generalExpanded && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => setGeneralExpanded(false)}
                          className="flex items-center gap-1"
                        >
                          <IconChevronUp className="w-4 h-4" />
                          Show Less
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="space-y-2 text-sm">
                      {/* Always show key fields */}
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Channel:</span>
                        <OrderTypePill orderType={data.order_type} />
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Order Stage:</span>
                        <div className="flex-1 max-w-[200px]">
                          <OrderStageRenderer value={data.order_stage} data={data} />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-font-color-100">Customer #:</span>
                        <span className="font-medium text-font-color"><PlaceholderDash>{data.customer_number || '-'}</PlaceholderDash></span>
                      </div>
                      
                      {/* Show additional fields based on expand state */}
                      {getGeneralFieldsWithValues().map(field => (
                        <div key={field.key} className="flex justify-between">
                          <span className="font-medium text-font-color-100">{field.label}:</span>
                          <span className="font-medium text-font-color"><PlaceholderDash>{field.value || '-'}</PlaceholderDash></span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Amounts Panel */}
                <Card>
                  <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconCreditCard className="w-4 h-4" />
                        AMOUNTS
                      </CardTitle>
                      {!amountsExpanded && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => setAmountsExpanded(true)}
                          className="flex items-center gap-1"
                        >
                          <IconChevronDown className="w-4 h-4" />
                          Show All
                        </Button>
                      )}
                      {amountsExpanded && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => setAmountsExpanded(false)}
                          className="flex items-center gap-1"
                        >
                          <IconChevronUp className="w-4 h-4" />
                          Show Less
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="space-y-2 text-sm">
                      {getAmountsFieldsWithValues().map(field => (
                        <div key={field.key} className={`flex justify-between ${field.isBold ? 'border-t border-border-color pt-2 font-bold' : ''}`}>
                          <span className={`${field.isBold ? 'text-font-color' : 'font-medium text-font-color-100'}`}>
                            {field.label}:
                          </span>
                          <span className={`font-mono font-medium ${field.isBold ? 'text-font-color' : 'text-font-color'}`}>
                            {field.value.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Fields Panel */}
                <Card>
                  <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
                        <IconSettings className="w-4 h-4" />
                        CUSTOM FIELDS
                      </CardTitle>
                      {!customFieldsExpanded && getCustomFieldsWithValues().length > 0 && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => setCustomFieldsExpanded(true)}
                          className="flex items-center gap-1"
                        >
                          <IconChevronDown className="w-4 h-4" />
                          Show All
                        </Button>
                      )}
                      {customFieldsExpanded && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => setCustomFieldsExpanded(false)}
                          className="flex items-center gap-1"
                        >
                          <IconChevronUp className="w-4 h-4" />
                          Show Less
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="space-y-2 text-sm">
                      {getCustomFieldsWithValues().length > 0 ? (
                        getCustomFieldsWithValues().map(field => (
                          <div key={field.key} className="flex justify-between">
                            <span className="font-medium text-font-color-100">{field.label}:</span>
                            <span className="font-medium text-font-color">{field.value}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-font-color-100 italic py-4">
                          No custom fields with values
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>


            {/* Order Lines */}
            <OrderLinesTable 
              orderLines={data.order_lines} 
              showAll={showAllOrderLines}
              onToggleShowAll={() => setShowAllOrderLines(!showAllOrderLines)}
            />

            {/* Shipments and Packages - with Table/Hierarchy View Toggle */}
            <ShipmentsSection data={data} />
          </div>
        </div>
      </div>

      {/* Shipping Instructions Dialog */}
      <Dialog open={shippingInstructionsDialog} onOpenChange={setShippingInstructionsDialog}>
        <DialogContent style={{ width: '800px', maxWidth: '90vw' }}>
          <DialogHeader>
            <DialogTitle>Shipping Instructions</DialogTitle>
          </DialogHeader>
          <div className="text-sm p-3 bg-body-color rounded border border-border-color min-h-[300px] max-h-[400px] overflow-auto">
            <div className="text-font-color leading-relaxed whitespace-pre-wrap">
              {data.shipping_instructions || ''}
            </div>
          </div>
          <DialogFooter className="pt-3">
            <Button onClick={() => setShippingInstructionsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={commentsDialog} onOpenChange={setCommentsDialog}>
        <DialogContent style={{ width: '800px', maxWidth: '90vw' }}>
          <DialogHeader>
            <DialogTitle>Packing List Comments</DialogTitle>
          </DialogHeader>
          <div className="text-sm p-3 bg-body-color rounded border border-border-color min-h-[300px] max-h-[400px] overflow-auto">
            <div className="text-font-color leading-relaxed whitespace-pre-wrap">
              {data.packing_list_comments || 'No packing list comments'}
            </div>
          </div>
          <DialogFooter className="pt-3">
            <Button onClick={() => setCommentsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Table components (same as before but with improved styling)
function OrderLinesTable({ orderLines, showAll, onToggleShowAll }: { 
  orderLines: any[], 
  showAll: boolean, 
  onToggleShowAll: () => void 
}) {
  const ROWS_TO_SHOW = 5
  const displayedLines = showAll ? orderLines : orderLines?.slice(0, ROWS_TO_SHOW) || []
  const hasMore = orderLines?.length > ROWS_TO_SHOW

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-font-color">
            <IconPackage className="w-5 h-5 text-primary" />
            ORDER LINES ({orderLines?.length || 0})
          </CardTitle>
          {hasMore && (
            <Button
              variant="ghost"
              size="small"
              onClick={onToggleShowAll}
              className="flex items-center gap-1"
            >
              {showAll ? (
                <>
                  <IconChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <IconChevronDown className="w-4 h-4" />
                  Show All ({orderLines.length})
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-body-color border-b border-border-color">
            <tr>
              <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Line #</th>
              <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Item Details</th>
              <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Qty</th>
              <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Shipped</th>
              <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Backlog</th>
              <th className="px-2 py-1.5 text-right text-xs font-bold text-font-color-100 uppercase tracking-wider">Price</th>
              <th className="px-2 py-1.5 text-right text-xs font-bold text-font-color-100 uppercase tracking-wider">Subtotal</th>
              <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Don't Ship Before</th>
              <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Ship By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {displayedLines?.map((item, index) => {
              const isVoided = item.voided
              const isBundleComponent = item.is_kit_component
              const isBundle = item.kit_id && item.kit_id > 0
              return (
                <tr key={item.id || index} className={`transition-colors border-b border-border-color/30 ${
                  isBundle ? 'bg-theme-green-soft hover:bg-theme-green-soft' : ''
                } ${
                  isBundleComponent ? 'bg-theme-green-soft-light hover:bg-theme-green-soft-light' : ''
                } ${
                  !isBundle && !isBundleComponent && !isVoided ? 'hover:bg-primary-5/20' : ''
                }`}>
                <td className="px-2 py-1.5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-font-color">{item.line_number}</div>
                      {isVoided && (
                        <span className="text-[9px] font-bold text-[var(--danger)] bg-[var(--danger-50)] px-1.5 py-0.5 rounded">
                          VOIDED
                        </span>
                      )}
                    </div>
                    {item.custom_field3 && (
                      <div className="text-xs text-font-color-100 leading-tight">{item.custom_field3}</div>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-font-color">{item.item_number}</div>
                      <div className="flex gap-1">
                        {item.custom_field1 && (
                          <Badge variant="default" outline className="text-xs px-1.5 py-0.5 h-5">
                            CF1: {item.custom_field1}
                          </Badge>
                        )}
                        {item.custom_field2 && (
                          <Badge variant="default" outline className="text-xs px-1.5 py-0.5 h-5">
                            CF2: {item.custom_field2}
                          </Badge>
                        )}
                        {item.custom_field5 && (
                          <Badge variant="default" outline className="text-xs px-1.5 py-0.5 h-5">
                            CF5: {item.custom_field5}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-primary leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{item.description}</div>
                    {item.comments && (
                      <div className="text-xs text-font-color-100 italic leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical'}}>
                        💬 {item.comments}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1.5 text-center">
                  <div className="text-sm font-bold text-font-color">
                    {Intl.NumberFormat().format(item.quantity || 0)}
                  </div>
                </td>
                <td className="px-2 py-1.5 text-center">
                  <div className="text-sm font-bold text-green-600">
                    {Intl.NumberFormat().format(item.shipped || 0)}
                  </div>
                </td>
                <td className="px-2 py-1.5 text-center">
                  <div className="text-sm font-bold text-orange-600">
                    {Intl.NumberFormat().format((item.quantity || 0) - (item.shipped || 0))}
                  </div>
                </td>
                <td className="px-2 py-1.5 text-right">
                  <div className="text-sm font-bold text-font-color">
                    {Intl.NumberFormat().format(item.price || 0)}
                  </div>
                </td>
                <td className="px-2 py-1.5 text-right">
                  <div className="text-sm font-bold text-font-color">
                    {Intl.NumberFormat().format((item.price || 0) * (item.quantity || 0))}
                  </div>
                </td>
                <td className="px-2 py-1.5 text-center">
                  <div className="text-xs text-font-color-100">
                    <PlaceholderDash>{item.do_not_ship_before ? new Date(item.do_not_ship_before).toLocaleDateString() : '-'}</PlaceholderDash>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-center">
                  <div className="text-xs text-font-color-100">
                    <PlaceholderDash>{item.ship_by ? new Date(item.ship_by).toLocaleDateString() : '-'}</PlaceholderDash>
                  </div>
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="px-2 py-2 border-t border-border-color bg-primary-5">
        <div className="flex justify-end">
          <div className="text-sm font-bold text-font-color-100">
            Total: <span className="text-primary">{Intl.NumberFormat().format(orderLines?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0) || 0)}</span>
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
      <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-font-color">
          <IconTruck className="w-5 h-5 text-primary" />
          SHIPMENTS
        </CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-body-color border-b border-border-color">
            <tr>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">#</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Ship Date</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Packages</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Weight</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Carrier</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Service</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Tracking</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Documents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {shipments.map((shipment, index) => (
              <tr key={shipment.id || index} className="hover:bg-primary-5/30 transition-colors">
                <td className="px-2 py-2 text-center text-sm font-semibold text-font-color">
                  {shipment.line_index || index + 1}
                </td>
                <td className="px-2 py-2 text-center text-sm text-font-color">
                  {shipment.ship_date ? new Date(shipment.ship_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-2 py-2 text-center text-sm text-font-color">
                  {shipment.package_count || shipment.packages || '-'}
                </td>
                <td className="px-2 py-2 text-right text-sm text-font-color">
                  {Intl.NumberFormat().format(shipment.total_weight || shipment.weight || 0)} lbs
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {shipment.shipping_carrier || shipment.carrier || '-'}
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {shipment.shipping_service || shipment.service || '-'}
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {shipment.rs_tr || shipment.tracking_number || '-'}
                </td>
                <td className="px-2 py-2">
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
      <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-font-color">
          <IconPackage className="w-5 h-5 text-primary" />
          PACKAGES
        </CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-body-color border-b border-border-color">
            <tr>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">#</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Ship Date</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Delivery Date</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Delivery Status</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Package #</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Tracking #</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Weight</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Rated Weight</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Dimensions</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Charge</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">ASN</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Pallet #</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Pallet ASN</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Proway Bill</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {packages.map((pkg, index) => (
              <tr key={pkg.id || index} className="hover:bg-primary-5/30 transition-colors">
                <td className="px-2 py-2 text-center text-sm font-semibold text-font-color">
                  {pkg.line_index || index + 1}
                </td>
                <td className="px-2 py-2 text-center text-sm text-font-color">
                  {pkg.ship_date ? new Date(pkg.ship_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-2 py-2 text-center text-sm text-font-color">
                  {pkg.delivery_date ? new Date(pkg.delivery_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-2 py-2">
                  <Badge variant="info" outline>
                    {pkg.delivery_info || 'In Transit'}
                  </Badge>
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  <div>{pkg.package_number}</div>
                  {pkg.pallet_number && (
                    <div className="text-xs text-primary mt-1">{pkg.pallet_number}</div>
                  )}
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {pkg.tracking_link || pkg.tracking_number_link ? (
                    <a href={pkg.tracking_link || pkg.tracking_number_link} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      {pkg.tracking_number}
                    </a>
                  ) : (
                    <PlaceholderDash>{pkg.tracking_number || '-'}</PlaceholderDash>
                  )}
                </td>
                <td className="px-2 py-2 text-right text-sm text-font-color">
                  <PlaceholderDash>{pkg.package_weight || pkg.weight ? `${Intl.NumberFormat().format(pkg.package_weight || pkg.weight || 0)} lbs` : '-'}</PlaceholderDash>
                </td>
                <td className="px-2 py-2 text-right text-sm text-font-color">
                  <PlaceholderDash>{pkg.package_rated_weight ? `${Intl.NumberFormat().format(pkg.package_rated_weight)} lbs` : '-'}</PlaceholderDash>
                </td>
                <td className="px-2 py-2 text-center text-sm text-font-color">
                  <PlaceholderDash>{pkg.package_dimension || pkg.dimension || '-'}</PlaceholderDash>
                </td>
                <td className="px-2 py-2 text-right text-sm text-font-color">
                  <PlaceholderDash>{pkg.package_charge ? `${Intl.NumberFormat().format(pkg.package_charge)}` : '-'}</PlaceholderDash>
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  <PlaceholderDash>{pkg.asn || '-'}</PlaceholderDash>
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  <PlaceholderDash>{pkg.pallet_number || '-'}</PlaceholderDash>
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  <PlaceholderDash>{pkg.pallet_asn || '-'}</PlaceholderDash>
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  <PlaceholderDash>{pkg.proway_bill_number || '-'}</PlaceholderDash>
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
      <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-font-color">
          <IconPackage className="w-5 h-5 text-primary" />
          PACKAGE DETAILS
        </CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-body-color border-b border-border-color">
            <tr>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">#</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Ship Date</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Package #</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Line #</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Item #</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Description</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {packageDetails.map((detail, index) => (
              <tr key={detail.id || index} className="hover:bg-primary-5/30 transition-colors">
                <td className="px-2 py-2 text-center text-sm font-semibold text-font-color">
                  {detail.line_index || index + 1}
                </td>
                <td className="px-2 py-2 text-center text-sm text-font-color">
                  {detail.ship_date ? new Date(detail.ship_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {detail.package_number}
                </td>
                <td className="px-2 py-2 text-center text-sm text-font-color">
                  {detail.line_number}
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {detail.item_number}
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {detail.description}
                </td>
                <td className="px-2 py-2 text-right text-sm font-semibold text-font-color">
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
      <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-font-color">
          <IconPackage className="w-5 h-5 text-primary" />
          SERIAL/LOT NUMBERS
        </CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-body-color border-b border-border-color">
            <tr>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">#</th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-font-color-100 uppercase tracking-wider">Ship Date</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Package #</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Item #</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Description</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-font-color-100 uppercase tracking-wider">Serial/Lot #</th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-font-color-100 uppercase tracking-wider">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {serialLots.map((serial, index) => (
              <tr key={serial.id || index} className="hover:bg-primary-5/30 transition-colors">
                <td className="px-2 py-2 text-center text-sm font-semibold text-font-color">
                  {serial.line_index || index + 1}
                </td>
                <td className="px-2 py-2 text-center text-sm text-font-color">
                  {serial.ship_date ? new Date(serial.ship_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {serial.package_number || serial.carton_id || '-'}
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {serial.item_number || '-'}
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {serial.description || '-'}
                </td>
                <td className="px-2 py-2 text-sm text-font-color">
                  {serial.serial_lot_number || serial.serial_number || serial.serial_no || serial.extrafield_1 || '-'}
                </td>
                <td className="px-2 py-2 text-right text-sm font-semibold text-font-color">
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
