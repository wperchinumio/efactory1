import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import OrderOverview from '@/components/overview/OrderOverview'
import { readOrderDetail } from '@/services/api'
import type { OrderDetailDto } from '@/types/api/orders'

export default function OrderOverviewPage() {
  const router = useRouter()
  const { orderNum, accountNum } = router.query
  const [orderData, setOrderData] = useState<OrderDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNavigatingAway, setIsNavigatingAway] = useState(false)

  useEffect(() => {
    if (orderNum && accountNum) {
      fetchOrderDetail(orderNum as string, accountNum as string)
    }
  }, [orderNum, accountNum])

  const fetchOrderDetail = async (orderNumber: string, accountNumber: string) => {
    try {
      setLoading(true)
      setError(null)
      // NO forceRefresh - use cached data
      const result = await readOrderDetail(orderNumber, accountNumber, undefined, false)
      
      if (result.kind === 'single') {
        setOrderData(result.order)
      } else if (result.kind === 'multiple') {
        // For now, just take the first order. In a real implementation,
        // you might want to show a selection dialog
        setOrderData(result.orders?.[0] || null)
      } else {
        setError('Order not found')
      }
    } catch (err) {
      console.error('Error fetching order detail:', err)
      setError('Failed to load order details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsNavigatingAway(true)
    router.back()
  }

  const handlePrevious = () => {
    // Implementation would depend on how you track order navigation
  }

  const handleNext = () => {
    // Implementation would depend on how you track order navigation
  }

  const handleRefresh = () => {
    if (orderNum && accountNum) {
      fetchOrderDetail(orderNum as string, accountNum as string)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-font-color-100">Loading order details...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-font-color mb-2">Error Loading Order</h2>
            <p className="text-font-color-100 mb-4">{error}</p>
            <button
              onClick={() => fetchOrderDetail(orderNum as string, accountNum as string)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (!orderData && !isNavigatingAway) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-font-color mb-2">Order Not Found</h2>
            <p className="text-font-color-100 mb-4">
              The requested order could not be found.
            </p>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // Show loading state when navigating away to prevent flash
  if (isNavigatingAway) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-font-color-100">Returning to grid...</div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
        <OrderOverview
        data={orderData}
        onClose={handleClose}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={false} // Would be determined by your navigation logic
        hasNext={false}     // Would be determined by your navigation logic
        currentIndex={1}    // Would be determined by your navigation logic
        totalItems={1}      // Would be determined by your navigation logic
        variant="inline"
        onRefresh={handleRefresh}
      />
    </Layout>
  )
}
