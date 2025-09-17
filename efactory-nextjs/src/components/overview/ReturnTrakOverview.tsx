import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
  IconPrinter,
  IconEdit,
  IconMail,
  IconTrash,
  IconCalendarX,
  IconMailOff,
  IconX,
  IconSettings,
  IconChevronDown,
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { RmaDetailResponse } from '@/types/api/returntrak'
import { cancelRma, expireRma, issueRmaEmail, readRmaDetail, resetRmaAcknowledged, updateRmaCustomFields } from '@/services/api'
import { useRmaNavigation } from '@/contexts/RmaNavigationContext'

type Props = {
  data: RmaDetailResponse
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

const ConfirmDialog: React.FC<{ open: boolean; title: string; confirmText?: string; onConfirm: () => void; onOpenChange: (v: boolean) => void; children?: React.ReactNode }>
  = ({ open, title, confirmText = 'Confirm', onConfirm, onOpenChange, children }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="py-2">{children}</div>
      <DialogFooter>
        <Button variant="primary" onClick={onConfirm}>{confirmText}</Button>
        <Button variant="danger" onClick={() => onOpenChange(false)}>Cancel</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default function ReturnTrakOverview({ data, onClose, variant = 'inline', onPrevious, onNext, hasPrevious, hasNext, currentIndex, totalItems, onRefresh }: Props) {
  const router = useRouter()
  const nav = useRmaNavigation()
  const [email, setEmail] = useState<string>(data?.rma_header?.shipping_address?.email || '')
  const [showCancel, setShowCancel] = useState(false)
  const [showExpire, setShowExpire] = useState(false)
  const [showResetAck, setShowResetAck] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const [showEditCustom, setShowEditCustom] = useState(false)
  const [savingCustom, setSavingCustom] = useState(false)
  const customFieldsRef = useRef<Record<string, string>>({})

  const rmaHeader = data?.rma_header || {}
  const rmaId = rmaHeader?.rma_id as number | undefined
  const canRequestCancel = Boolean(rmaHeader?.open)
  const acknowledged = Boolean((rmaHeader as any)?.acknowledged)
  const hasCustomFields = Array.isArray((data as any)?.custom_fields) && ((data as any)?.custom_fields as any[]).length > 0

  const handleRefresh = useCallback(async () => {
    if (onRefresh) return onRefresh()
    const q = new URLSearchParams((router as any).asPath.split('?')[1] || '')
    const rmaNum = q.get('rmaNum') || ''
    const accountNum = q.get('accountNum') || undefined
    await readRmaDetail(rmaNum, accountNum, false, true) // forceRefresh = true
  }, [onRefresh, router])

  const handlePrev = useCallback(() => { if (onPrevious) onPrevious() }, [onPrevious])
  const handleNext = useCallback(() => { if (onNext) onNext() }, [onNext])

  const statusText = useMemo(() => {
    if (!('open' in rmaHeader)) return ''
    const open = (rmaHeader as any).open
    const cancelled_date = (rmaHeader as any).cancelled_date
    const expired_date = (rmaHeader as any).expired_date
    if (open) return 'OPEN'
    if (!cancelled_date && !expired_date) return 'CLOSED'
    if (cancelled_date) return `CANCELED ON ${(cancelled_date as string).slice(0, 10)}`
    return `EXPIRED ON ${(expired_date as string).slice(0, 10)}`
  }, [rmaHeader])

  return (
    <div className={variant === 'overlay' ? 'fixed inset-0 bg-black/40 z-50 flex p-4' : 'w-full'}>
      <div className={variant === 'overlay' ? 'bg-background rounded-xl shadow-2xl w-full max-w-[1800px] mx-auto overflow-hidden flex flex-col max-h-[95vh]' : 'bg-background rounded-xl border border-border-color shadow w-full max-w-[1800px] mx-auto overflow-hidden flex flex-col'}>
        {/* Header section - EXACT same layout as OrderOverview */}
        <div className="bg-background border-b border-border-color">
          <div className="px-6 py-2">
            {/* Single Row Header - Everything in one line */}
            <div className="flex items-center justify-between">
              {/* Left Side - Close Button + RMA Info */}
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
                  <h1 className="text-lg font-bold text-font-color">RMA #{rmaHeader?.rma_number}</h1>
                  {statusText && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-orange-500 text-white rounded">
                      {statusText}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  {(rmaHeader as any)?.account_number && (
                    <div>
                      <span className="text-font-color-100">Account:</span>
                      <span className="ml-1 font-medium text-font-color">{(rmaHeader as any).account_number}</span>
                    </div>
                  )}
                  {(rmaHeader as any)?.location && (
                    <div>
                      <span className="text-font-color-100">WH:</span>
                      <span className="ml-1 font-medium text-font-color">{(rmaHeader as any).location}</span>
                    </div>
                  )}
                  {(rmaHeader as any)?.rma_type_code && (
                    <div>
                      <span className="text-font-color-100">Type:</span>
                      <span className="ml-1 font-medium text-font-color">{(rmaHeader as any).rma_type_code}</span>
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
                          disabled={!hasPrevious}
                          className="h-7 w-8 p-0"
                        />
                        <Button
                          onClick={onNext || (() => {})}
                          variant="outline"
                          size="small"
                          icon={<IconChevronRight />}
                          disabled={!hasNext}
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
                      className="px-3 py-1.5 text-sm"
                    >
                      <span>Actions</span>
                      <IconChevronDown className="ml-2 w-3 h-3" />
                    </Button>
                  </div>

                  {/* Print button */}
                  <Button
                    variant="outline"
                    size="small"
                    icon={<IconPrinter />}
                    onClick={() => window.print()}
                    className="h-7 w-8 p-0"
                    iconOnly
                  />

                  {/* Refresh button */}
                  {onRefresh && (
                    <Button
                      variant="outline"
                      size="small"
                      icon={<IconRefresh />}
                      onClick={handleRefresh}
                      className="h-7 w-8 p-0"
                      iconOnly
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area with proper padding */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>RMA Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 text-sm">
                  <div><span className="text-font-color-200">Account • WH:</span> {(rmaHeader as any)?.account_number} {((rmaHeader as any)?.location) ? `- ${(rmaHeader as any)?.location}` : ''}</div>
                  <div><span className="text-font-color-200">RMA Type:</span> <strong>{(rmaHeader as any)?.rma_type_code}</strong> {(rmaHeader as any)?.rma_type_name ? `- ${(rmaHeader as any)?.rma_type_name}` : ''}</div>
                  <div><span className="text-font-color-200">Disposition:</span> <strong>{(rmaHeader as any)?.disposition_code}</strong> {(rmaHeader as any)?.disposition_name ? `- ${(rmaHeader as any)?.disposition_name}` : ''}</div>
                  <div><span className="text-font-color-200">RMA Date:</span> {(rmaHeader as any)?.rma_date}</div>
                </div>
                <div className="space-y-1 text-sm">
                  <div><span className="text-font-color-200">Original Order #:</span> {(rmaHeader as any)?.original_order_number || ''}</div>
                  <div><span className="text-font-color-200">Replacement Order #:</span> {(rmaHeader as any)?.replacement_order_number || ''}</div>
                  <div><span className="text-font-color-200">Tracking #:</span> {(rmaHeader as any)?.return_label_tracking_number || ''}</div>
                </div>
              </div>

              {Array.isArray((data as any)?.custom_fields) && (
                <div className="mt-2">
                  <div className="text-xs font-semibold text-font-color-300 mb-1">Custom Fields</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {((data as any).custom_fields as any[]).map((cf: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="text-font-color-200">{cf.title}</div>
                        <div className="text-font-color-100">{cf.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="small" variant="danger" disabled={!canRequestCancel} onClick={() => setShowCancel(true)}>
                  <IconTrash className="w-4 h-4" /> Request Cancellation
                </Button>
                <Button size="small" variant="warning" disabled={!canRequestCancel} onClick={() => setShowExpire(true)}>
                  <IconCalendarX className="w-4 h-4" /> Expire RMA
                </Button>
                <Button size="small" variant="secondary" onClick={() => setShowResend(true)}>
                  <IconMail className="w-4 h-4" /> Re-send Issued RMA Email
                </Button>
                <Button size="small" variant="primary" disabled={!hasCustomFields} onClick={() => setShowEditCustom(true)}>
                  <IconEdit className="w-4 h-4" /> Edit Custom Fields
                </Button>
                <Button size="small" variant="outline" disabled={!acknowledged} onClick={() => setShowResetAck(true)}>
                  <IconMailOff className="w-4 h-4" /> Reset Acknowledged
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Items tables (authorized, received, to-ship) could be added later following parity if needed */}
        </div>

        {/* Modals */}
        <ConfirmDialog open={showCancel} title="Cancel RMA" onConfirm={async () => { setShowCancel(false); if (rmaId) { await cancelRma(rmaId); await handleRefresh() } }} onOpenChange={setShowCancel}>
          Are you sure you want to cancel this RMA?
        </ConfirmDialog>

        <ConfirmDialog open={showExpire} title="Expire RMA" onConfirm={async () => { setShowExpire(false); if (rmaId) { await expireRma(rmaId); await handleRefresh() } }} onOpenChange={setShowExpire}>
          Are you sure you want to expire this RMA?
        </ConfirmDialog>

        <ConfirmDialog open={showResetAck} title="Reset Acknowledged" onConfirm={async () => { setShowResetAck(false); if (rmaId) { await resetRmaAcknowledged(rmaId); await handleRefresh() } }} onOpenChange={setShowResetAck}>
          Are you sure you want to reset 'Acknowledged'?
        </ConfirmDialog>

        <Dialog open={showResend} onOpenChange={setShowResend}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Re-send 'Issued RMA' Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
            <DialogFooter>
              <Button onClick={async () => { setShowResend(false); if (rmaId && email) { await issueRmaEmail(rmaId, email); } }}>Send</Button>
              <Button variant="danger" onClick={() => setShowResend(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditCustom} onOpenChange={setShowEditCustom}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Custom Fields</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(((data as any)?.custom_fields) || []).map((cf: any, i: number) => {
                const fieldKey = `cf${i + 1}`
                const initial = cf?.value || ''
                if (!(fieldKey in customFieldsRef.current)) customFieldsRef.current[fieldKey] = initial
                return (
                  <div key={fieldKey} className="space-y-1">
                    <Label>{cf?.title || fieldKey}</Label>
                    <Input defaultValue={initial} onChange={(e) => { customFieldsRef.current[fieldKey] = e.target.value }} />
                  </div>
                )
              })}
            </div>
            <DialogFooter>
              <Button loading={savingCustom} onClick={async () => {
                if (!rmaId) return setShowEditCustom(false)
                try {
                  setSavingCustom(true)
                  await updateRmaCustomFields(rmaId, { ...customFieldsRef.current })
                  setShowEditCustom(false)
                  await handleRefresh()
                } finally {
                  setSavingCustom(false)
                }
              }}>Save Changes</Button>
              <Button variant="danger" onClick={() => setShowEditCustom(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}


