import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { 
  IconTruck, 
  IconPackage, 
  IconList,
  IconChevronDown,
  IconChevronRight,
  IconExternalLink,
  IconBarcode
} from '@tabler/icons-react'
import type { OrderDetailDto, ShipmentsOverviewSerialRowDto } from '@/types/api/orders'

// Utility function to display placeholder dashes as barely visible
const PlaceholderDash = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  if (children === '-') {
    return <span className={`text-font-color-100 opacity-30 ${className}`}>-</span>
  }
  return <span className={className}>{children}</span>
}

// Table components will be created inline for now

type Props = {
  data: OrderDetailDto
}

type ViewMode = 'table' | 'hierarchy'

export default function ShipmentsSection({ data }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy') // Default to hierarchy
  
  // Default ALL expanded - get all IDs and set them as expanded by default
  const getAllShipmentIds = () => {
    const shipmentIds = new Set<number>()
    data.shipments?.forEach(shipment => shipmentIds.add(shipment.id))
    return shipmentIds
  }
  
  const getAllPackageIds = () => {
    const packageIds = new Set<number>()
    data.shipments?.forEach(shipment => {
      shipment.packages?.forEach(pkg => packageIds.add(pkg.id))
    })
    return packageIds
  }
  
  const getAllPackageDetailIds = () => {
    const detailIds = new Set<number>()
    data.shipments?.forEach(shipment => {
      shipment.packages?.forEach(pkg => {
        pkg.shipped_items?.forEach(item => detailIds.add(item.id))
      })
    })
    return detailIds
  }

  const [expandedShipments, setExpandedShipments] = useState<Set<number>>(getAllShipmentIds())
  const [expandedPackages, setExpandedPackages] = useState<Set<number>>(getAllPackageIds())
  const [expandedPackageDetails, setExpandedPackageDetails] = useState<Set<number>>(getAllPackageDetailIds())

  // Check if order has shipments (is shipped)
  const hasShipments = data.shipments && data.shipments.length > 0
  
  if (!hasShipments) {
    // Show only Order Lines if not shipped
    return null
  }

  // Use hierarchical data.shipments for hierarchy view and shipments_overview for table view
  // This ensures we get all available data from both structures
  const overviewShipments = data.shipments_overview?.shipments || []
  const overviewPackages = data.shipments_overview?.packages || []
  const overviewPackageDetails = data.shipments_overview?.package_details || []
  
  // For serials, we need to cross-reference with the hierarchical shipments data to get Type information
  // since shipments_overview doesn't include the Type field
  const getSerialsWithType = () => {
    const serialsWithType: any[] = []
    
    data.shipments?.forEach(shipment => {
      shipment.packages?.forEach(pkg => {
        pkg.shipped_items?.forEach(item => {
          if (item.serials && Array.isArray(item.serials)) {
            item.serials.forEach(serial => {
              serialsWithType.push({
                id: serialsWithType.length + 1, // Generate ID if not available
                line_index: item.line_number,
                ship_date: shipment.ship_date,
                package_number: pkg.carton_id,
                line_number: item.line_number,
                item_number: item.item_number,
                description: item.description,
                Type: serial.Type, // This is the key field we need!
                serial_no: serial.SerialNo,
                quantity: serial.Quantity
              })
            })
          }
        })
      })
    })
    
    return serialsWithType
  }
  
  const overviewSerials = getSerialsWithType()

  const toggleShipment = (shipmentId: number) => {
    const newExpanded = new Set(expandedShipments)
    if (newExpanded.has(shipmentId)) {
      newExpanded.delete(shipmentId)
    } else {
      newExpanded.add(shipmentId)
    }
    setExpandedShipments(newExpanded)
  }

  const togglePackage = (packageId: number) => {
    const newExpanded = new Set(expandedPackages)
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId)
    } else {
      newExpanded.add(packageId)
    }
    setExpandedPackages(newExpanded)
  }

  const togglePackageDetail = (detailId: number) => {
    const newExpanded = new Set(expandedPackageDetails)
    if (newExpanded.has(detailId)) {
      newExpanded.delete(detailId)
    } else {
      newExpanded.add(detailId)
    }
    setExpandedPackageDetails(newExpanded)
  }

  const renderTableView = () => (
    <div className="space-y-2">
      {/* Shipments Table */}
      <Card>
        <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
          <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
            <IconTruck className="w-4 h-4" />
            SHIPMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-10 border-b border-border-color">
                <tr>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Line #</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Ship Date</th>
                  <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Packages</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-font-color-100 uppercase tracking-wider">Weight</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Carrier</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Service</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">REF 1</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">REF 2</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">REF 3</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">REF 4</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">RS TRACKING #</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">DOCUMENTS</th>
                </tr>
              </thead>
              <tbody>
                {overviewShipments.map((shipment, index) => (
                  <tr key={shipment.id} className={index % 2 === 0 ? 'bg-card-color' : 'bg-body-color'}>
                    <td className="px-2 py-1.5 text-center text-sm font-bold text-font-color">{shipment.line_index}</td>
                    <td className="px-2 py-1.5 text-center text-sm text-font-color">{new Date(shipment.ship_date).toLocaleDateString()}</td>
                    <td className="px-2 py-1.5 text-center text-sm font-bold text-font-color">{shipment.packages}</td>
                    <td className="px-2 py-1.5 text-right text-sm font-bold text-font-color">{shipment.total_weight} lbs</td>
                    <td className="px-2 py-1.5 text-sm text-font-color">{shipment.shipping_carrier}</td>
                    <td className="px-2 py-1.5 text-sm text-font-color">{shipment.shipping_service}</td>
                    <td className="px-2 py-1.5 text-xs text-font-color-100 font-mono"><PlaceholderDash>{shipment.reference1 || '-'}</PlaceholderDash></td>
                    <td className="px-2 py-1.5 text-xs text-font-color-100 font-mono"><PlaceholderDash>{shipment.reference2 || '-'}</PlaceholderDash></td>
                    <td className="px-2 py-1.5 text-xs text-font-color-100 font-mono"><PlaceholderDash>{shipment.reference3 || '-'}</PlaceholderDash></td>
                    <td className="px-2 py-1.5 text-xs text-font-color-100 font-mono"><PlaceholderDash>{shipment.reference4 || '-'}</PlaceholderDash></td>
                    <td className="px-2 py-1.5 text-xs text-font-color-100 font-mono"><PlaceholderDash>{shipment.rs_tr || '-'}</PlaceholderDash></td>
                    <td className="px-2 py-1.5">
                      <div className="flex flex-wrap gap-2">
                        {shipment.pl_link && (
                          <a href={shipment.pl_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-600 text-xs inline-flex items-center gap-1">
                            <IconExternalLink className="w-3 h-3" />
                            Packing List
                          </a>
                        )}
                        {shipment.ci_link && (
                          <a href={shipment.ci_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-600 text-xs inline-flex items-center gap-1">
                            <IconExternalLink className="w-3 h-3" />
                            Comm. Invoice
                          </a>
                        )}
                        {shipment.bol_link && (
                          <a href={shipment.bol_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-600 text-xs inline-flex items-center gap-1">
                            <IconExternalLink className="w-3 h-3" />
                            BOL
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Packages Table */}
      <Card>
        <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
          <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
            <IconPackage className="w-4 h-4" />
            PACKAGES
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-10 border-b border-border-color">
                <tr>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Ship Date</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Package #</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Tracking #</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-font-color-100 uppercase tracking-wider">Weight</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-font-color-100 uppercase tracking-wider">Rated Weight</th>
                  <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Dimensions</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-font-color-100 uppercase tracking-wider">Charge</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">ASN</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Pallet #</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Pallet ASN</th>
                  <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Delivery Date</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">ProWay Bill</th>
                </tr>
              </thead>
              <tbody>
                {overviewPackages.map((pkg, index) => (
                  <tr key={pkg.id} className={index % 2 === 0 ? 'bg-card-color' : 'bg-body-color'}>
                    <td className="px-2 py-1.5 text-sm text-font-color">{new Date(pkg.ship_date).toLocaleDateString()}</td>
                    <td className="px-2 py-1.5 text-sm font-bold text-font-color font-mono">{pkg.package_number}</td>
                    <td className="px-2 py-1.5">
                      {pkg.tracking_link ? (
                        <a href={pkg.tracking_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-600 text-sm font-mono">
                          {pkg.tracking_number}
                        </a>
                      ) : (
                        <span className="text-font-color text-sm font-mono"><PlaceholderDash>{pkg.tracking_number || '-'}</PlaceholderDash></span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 text-right text-sm font-bold text-font-color">{pkg.package_weight} lbs</td>
                    <td className="px-2 py-1.5 text-right text-sm font-bold text-font-color">{pkg.package_rated_weight} lbs</td>
                    <td className="px-2 py-1.5 text-center text-sm text-font-color"><PlaceholderDash>{pkg.package_dimension || '-'}</PlaceholderDash></td>
                    <td className="px-2 py-1.5 text-right text-sm font-bold text-font-color">{Intl.NumberFormat().format(pkg.package_charge || 0)}</td>
                    <td className="px-2 py-1.5 text-xs text-font-color-100 font-mono"><PlaceholderDash>{pkg.asn || '-'}</PlaceholderDash></td>
                    <td className="px-2 py-1.5 text-xs text-font-color-100 font-mono"><PlaceholderDash>{pkg.pallet_number || '-'}</PlaceholderDash></td>
                    <td className="px-2 py-1.5 text-xs text-font-color-100 font-mono"><PlaceholderDash>{pkg.pallet_asn || '-'}</PlaceholderDash></td>
                    <td className="px-2 py-1.5 text-center text-sm text-font-color">{pkg.delivery_date ? new Date(pkg.delivery_date).toLocaleDateString() : '-'}</td>
                    <td className="px-2 py-1.5 text-xs text-font-color-100 font-mono"><PlaceholderDash>{pkg.proway_bill_number || '-'}</PlaceholderDash></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Package Details Table */}
      <Card>
        <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
          <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
            <IconList className="w-4 h-4" />
            PACKAGE DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-10 border-b border-border-color">
                <tr>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Ship Date</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Package #</th>
                  <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Line #</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Item #</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Description</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-font-color-100 uppercase tracking-wider">Quantity</th>
                  <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Extra Field 1</th>
                  <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Serial/Lot Count</th>
                </tr>
              </thead>
              <tbody>
                {overviewPackageDetails.map((detail, index) => (
                  <tr key={detail.id} className={index % 2 === 0 ? 'bg-card-color' : 'bg-body-color'}>
                    <td className="px-2 py-1.5 text-sm text-font-color">{new Date(detail.ship_date).toLocaleDateString()}</td>
                    <td className="px-2 py-1.5 text-sm font-bold text-font-color font-mono">{detail.package_number}</td>
                    <td className="px-2 py-1.5 text-center text-sm font-bold text-font-color">{detail.line_number}</td>
                    <td className="px-2 py-1.5 text-sm font-bold text-font-color font-mono">{detail.item_number}</td>
                    <td className="px-2 py-1.5 text-sm text-font-color overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{detail.description}</td>
                    <td className="px-2 py-1.5 text-right text-sm font-bold text-font-color">{detail.quantity}</td>
                    <td className="px-2 py-1.5 text-center text-xs text-font-color-100">-</td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="px-1.5 py-0.5 bg-primary-10 text-font-color rounded text-xs font-medium">
                        See Serials Table
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Serial/Lot Numbers Table */}
      <Card>
        <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
          <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
            <IconBarcode className="w-4 h-4" />
            SERIAL/LOT NUMBERS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-10 border-b border-border-color">
                <tr>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Ship Date</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Package #</th>
                  <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Line #</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Item #</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Description</th>
                  <th className="px-2 py-1.5 text-center text-xs font-bold text-font-color-100 uppercase tracking-wider">Type</th>
                  <th className="px-2 py-1.5 text-left text-xs font-bold text-font-color-100 uppercase tracking-wider">Serial/Lot #</th>
                  <th className="px-2 py-1.5 text-right text-xs font-bold text-font-color-100 uppercase tracking-wider">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {overviewSerials && Array.isArray(overviewSerials) ? (
                  overviewSerials.map((serial, index) => (
                    <tr key={serial.id || index} className={index % 2 === 0 ? 'bg-card-color' : 'bg-body-color'}>
                      <td className="px-2 py-1.5 text-sm text-font-color">{new Date(serial.ship_date).toLocaleDateString()}</td>
                      <td className="px-2 py-1.5 text-sm font-bold text-font-color font-mono">{serial.package_number}</td>
                      <td className="px-2 py-1.5 text-center text-sm font-bold text-font-color">{serial.line_number}</td>
                      <td className="px-2 py-1.5 text-sm font-bold text-font-color font-mono">{serial.item_number}</td>
                      <td className="px-2 py-1.5 text-sm text-font-color overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{serial.description}</td>
                      <td className="px-2 py-1.5 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold ${
                          serial.Type === 'L' || serial.Type === 'l' ? 'bg-warning text-black' : 
                          'bg-info text-white'
                        }`}>
                          {serial.Type === 'L' || serial.Type === 'l' ? 'LOT' : 'SN'}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-sm font-mono text-font-color">
                        {serial.serial_no}
                      </td>
                      <td className="px-2 py-1.5 text-right text-sm font-bold text-font-color">{serial.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-2 py-4 text-center text-font-color-100">
                      No serial/lot numbers available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderHierarchyView = () => (
    <div className="space-y-2">
      {data.shipments?.map((shipment) => (
        <Card key={shipment.id} className="overflow-hidden">
          <CardHeader 
            className="bg-primary-10 border-b border-border-color py-2 px-3 cursor-pointer hover:bg-primary-20 transition-colors"
            onClick={() => toggleShipment(shipment.id)}
          >
            <CardTitle className="text-sm font-semibold text-font-color flex items-center justify-between">
              <div className="flex items-center gap-2">
                {expandedShipments.has(shipment.id) ? (
                  <IconChevronDown className="w-4 h-4" />
                ) : (
                  <IconChevronRight className="w-4 h-4" />
                )}
                <IconTruck className="w-4 h-4" />
                SHIPMENT #{shipment.ship_id} - {new Date(shipment.ship_date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">{shipment.status === 2 ? 'Shipped' : 'Pending'}</Badge>
                <span className="text-xs font-normal">
                  {shipment.shipping_carrier} {shipment.shipping_service}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          
          {expandedShipments.has(shipment.id) && (
            <CardContent className="p-0">
              {/* Shipment Details */}
              <div className="p-2 bg-primary-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="font-medium text-font-color-100">Weight:</span>
                    <span className="ml-2 text-font-color font-medium">{shipment.total_weight} lbs</span>
                  </div>
                  <div>
                    <span className="font-medium text-font-color-100">Charge:</span>
                    <span className="ml-2 text-font-color font-medium">${Intl.NumberFormat().format(shipment.total_charge || 0)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-font-color-100">Packages:</span>
                    <span className="ml-2 text-font-color font-medium">{shipment.packages?.length || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium text-font-color-100">Carrier ID:</span>
                    <span className="ml-2 text-font-color font-medium"><PlaceholderDash>{shipment.carrier_id || '-'}</PlaceholderDash></span>
                  </div>
                </div>
                
                {/* Reference Fields */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-2">
                  <div>
                    <span className="font-medium text-font-color-100">REF 1:</span>
                    <span className="ml-2 text-font-color font-mono font-medium"><PlaceholderDash>{shipment.reference1 || '-'}</PlaceholderDash></span>
                  </div>
                  <div>
                    <span className="font-medium text-font-color-100">REF 2:</span>
                    <span className="ml-2 text-font-color font-mono font-medium"><PlaceholderDash>{shipment.reference2 || '-'}</PlaceholderDash></span>
                  </div>
                  <div>
                    <span className="font-medium text-font-color-100">REF 3:</span>
                    <span className="ml-2 text-font-color font-mono font-medium"><PlaceholderDash>{shipment.reference3 || '-'}</PlaceholderDash></span>
                  </div>
                  <div>
                    <span className="font-medium text-font-color-100">REF 4:</span>
                    <span className="ml-2 text-font-color font-mono font-medium"><PlaceholderDash>{shipment.reference4 || '-'}</PlaceholderDash></span>
                  </div>
                </div>
                
                {/* RS Tracking */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-2">
                  <div>
                    <span className="font-medium text-font-color-100">RS Tracking #:</span>
                    <span className="ml-2 text-font-color font-mono font-medium"><PlaceholderDash>{shipment.rs_tr || '-'}</PlaceholderDash></span>
                  </div>
                  <div>
                    <span className="font-medium text-font-color-100">Freight Account:</span>
                    <span className="ml-2 text-font-color font-medium"><PlaceholderDash>{shipment.freight_account || '-'}</PlaceholderDash></span>
                  </div>
                  <div>
                    <span className="font-medium text-font-color-100">Carrier DCLN2:</span>
                    <span className="ml-2 text-font-color font-medium"><PlaceholderDash>{shipment.carrier_dcln2 || '-'}</PlaceholderDash></span>
                  </div>
                </div>

                {/* Document Links */}
                <div className="mt-2 flex flex-wrap gap-3">
                  {shipment.pl_link && (
                    <a 
                      href={shipment.pl_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-600 text-sm"
                    >
                      <IconExternalLink className="w-3 h-3" />
                      Packing List
                    </a>
                  )}
                  {shipment.ci_link && (
                    <a 
                      href={shipment.ci_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-600 text-sm"
                    >
                      <IconExternalLink className="w-3 h-3" />
                      Comm. Invoice
                    </a>
                  )}
                  {shipment.bol_link && (
                    <a 
                      href={shipment.bol_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-600 text-sm"
                    >
                      <IconExternalLink className="w-3 h-3" />
                      Bill of Lading
                    </a>
                  )}
                </div>
              </div>

              {/* Packages */}
              <div className="pl-4">
                {shipment.packages?.map((pkg) => (
                  <div key={pkg.id} className="">
                    <div 
                      className="p-2 cursor-pointer hover:bg-primary-10 transition-colors"
                      onClick={() => togglePackage(pkg.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedPackages.has(pkg.id) ? (
                            <IconChevronDown className="w-4 h-4" />
                          ) : (
                            <IconChevronRight className="w-4 h-4" />
                          )}
                          <IconPackage className="w-4 h-4 text-primary" />
                          <span className="font-medium text-font-color">
                            Package: {pkg.carton_id}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-font-color-100">
                          <span>Weight: <span className="font-medium text-font-color">{pkg.weight} lbs</span></span>
                          <span>Rated: <span className="font-medium text-font-color">{pkg.rated_weight} lbs</span></span>
                          <span>Dim: <span className="font-medium text-font-color">{pkg.dimension}</span></span>
                          <span>Freight: <span className="font-medium text-font-color">${Intl.NumberFormat().format(pkg.freight || 0)}</span></span>
                          {pkg.tracking_number && (
                            <a 
                              href={pkg.tracking_number_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-600"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Track: {pkg.tracking_number}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedPackages.has(pkg.id) && (
                      <div className="pl-4 bg-body-color">
                        {/* Package Details */}
                        <div className="p-2">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="font-medium text-font-color-100">Carton Count:</span>
                              <span className="ml-2 text-font-color font-medium">{pkg.carton_count_number}</span>
                            </div>
                            <div>
                              <span className="font-medium text-font-color-100">ASN:</span>
                              <span className="ml-2 text-font-color font-mono font-medium"><PlaceholderDash>{pkg.asn || '-'}</PlaceholderDash></span>
                            </div>
                            <div>
                              <span className="font-medium text-font-color-100">Pallet ID:</span>
                              <span className="ml-2 text-font-color font-mono font-medium"><PlaceholderDash>{pkg.pallet_id || '-'}</PlaceholderDash></span>
                            </div>
                            <div>
                              <span className="font-medium text-font-color-100">Pallet ASN:</span>
                              <span className="ml-2 text-font-color font-mono font-medium"><PlaceholderDash>{pkg.pallet_asn || '-'}</PlaceholderDash></span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-2">
                            <div>
                              <span className="font-medium text-font-color-100">Delivery Date:</span>
                              <span className="ml-2 text-font-color font-medium">{pkg.delivery_date ? new Date(pkg.delivery_date).toLocaleDateString() : '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-font-color-100">Promised Date:</span>
                              <span className="ml-2 text-font-color font-medium">{pkg.promised_date ? new Date(pkg.promised_date).toLocaleDateString() : '-'}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium text-font-color-100">Delivery Info:</span>
                              <span className="ml-2 text-font-color font-medium"><PlaceholderDash>{pkg.delivery_info || '-'}</PlaceholderDash></span>
                            </div>
                          </div>
                        </div>
                        {/* Package Items */}
                        {pkg.shipped_items?.map((item) => (
                          <div key={item.id} className="">
                            <div 
                              className="p-2 cursor-pointer hover:bg-primary-10 transition-colors"
                              onClick={() => togglePackageDetail(item.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {expandedPackageDetails.has(item.id) ? (
                                    <IconChevronDown className="w-3 h-3" />
                                  ) : (
                                    <IconChevronRight className="w-3 h-3" />
                                  )}
                                  <IconList className="w-3 h-3 text-secondary" />
                                  <span className="font-medium text-sm text-font-color">
                                    Line {item.line_number}: {item.item_number}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-font-color-100">
                                  <span><span className="font-medium text-font-color">{item.description}</span></span>
                                  <span>Qty: <span className="font-medium text-font-color">{item.quantity}</span></span>
                                </div>
                              </div>
                            </div>

                            {(expandedPackageDetails.has(item.id) && item.serials && Array.isArray(item.serials) && item.serials.length > 0) ? (
                              <div className="pl-4 bg-primary-10">
                                <div className="p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <IconBarcode className="w-3 h-3 text-accent" />
                                    <span className="text-xs font-medium text-font-color-100">Serial/Lot Numbers:</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1.5">
                                    {(item.serials as any[]).map((serial: any, idx) => (
                                      <div key={idx} className="text-xs bg-card-color rounded px-1.5 py-0.5 border border-border-color">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <span className={`inline-block px-1 py-0.5 rounded text-[10px] font-medium mr-1 ${
                                              serial.Type === 'L' ? 'bg-warning text-black' : 
                                              'bg-info text-white'
                                            }`}>
                                              {serial.Type === 'L' ? 'LOT' : 'SN'}
                                            </span>
                                            <span className="font-mono text-font-color">
                                              {serial.SerialNo}
                                            </span>
                                          </div>
                                          {serial.Quantity > 1 && (
                                            <span className="text-font-color-100 font-medium">(×{serial.Quantity})</span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-2">
      {/* View Toggle */}
      <Card>
        <CardHeader className="bg-primary-10 border-b border-border-color py-1.5 px-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-2">
              <IconTruck className="w-4 h-4" />
              SHIPMENTS & PACKAGES
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'hierarchy' ? 'primary' : 'outline'}
                size="small"
                onClick={() => setViewMode('hierarchy')}
                className="text-xs"
              >
                <IconPackage className="w-3 h-3 mr-1" />
                Hierarchy View
              </Button>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size="small"
                onClick={() => setViewMode('table')}
                className="text-xs"
              >
                <IconList className="w-3 h-3 mr-1" />
                Table View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          {viewMode === 'table' ? renderTableView() : renderHierarchyView()}
        </CardContent>
      </Card>
    </div>
  )
}
