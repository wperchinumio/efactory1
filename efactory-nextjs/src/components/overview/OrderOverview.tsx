import React from 'react'
import { IconChevronLeft, IconFileText, IconPrinter } from '@tabler/icons-react'
import { Button } from '@/components/ui/shadcn/button'
import type { OrderDetailDto } from '@/types/api/orders'

type Props = {
  data: OrderDetailDto
  onClose: () => void
  variant?: 'overlay' | 'inline'
}

function LabelValue({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-5 gap-2 items-start py-1">
      <div className="col-span-2 text-xs text-font-color-100">{label}</div>
      <div className="col-span-3 text-sm text-font-color">{children}</div>
    </div>
  )
}

export function OrderOverviewHeader({ data, onClose }: Props) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-border-color bg-card-color rounded-t-xl">
      <div className="flex items-center gap-2">
        <Button onClick={onClose} variant="destructive" className="uppercase tracking-wide">
          <IconChevronLeft className="w-4 h-4 mr-2" /> Close
        </Button>
        <div className="text-font-color-100 text-sm">ORDER #:</div>
        <div className="text-font-color font-semibold">{data.order_number}</div>
        <div className="mx-2 text-font-color-100">|</div>
        <div className="text-font-color-100 text-sm">Stage:</div>
        <div className="text-xs px-2 py-0.5 rounded-full bg-primary-10 text-primary font-semibold">
          {data.stage_description || data.order_stage}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" title="Print" className="border-border-color">
          <IconPrinter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default function OrderOverview({ data, onClose, variant = 'overlay' }: Props) {
  const billing = data.billing_address || ({} as any)
  const shipping = data.shipping_address || ({} as any)
  const shipmentsOverview = data.shipments_overview || ({} as any)
  const shipments = (shipmentsOverview.shipments as any[]) || []
  const packages = (shipmentsOverview.packages as any[]) || []
  const package_details = (shipmentsOverview.package_details as any[]) || []

  return (
    <div className={variant === 'overlay' ? 'fixed inset-0 bg-black/40 z-50 flex p-4 md:p-8' : 'w-full'}>
      <div className={variant === 'overlay' ? 'bg-background rounded-xl shadow-2xl w-full max-w-[1400px] mx-auto overflow-hidden flex flex-col' : 'bg-background rounded-xl border border-border-color shadow w-full overflow-hidden flex flex-col'}>
        <OrderOverviewHeader data={data} onClose={onClose} />
        <div className="p-4 md:p-6">
          {/* Top blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Shipping Address */}
            <div className="card border border-border-color rounded-xl">
              <div className="px-4 py-2 border-b border-border-color bg-primary-10 rounded-t-xl text-sm font-semibold text-font-color">
                Shipping Address
              </div>
              <div className="p-4">
                <LabelValue label="Company:">{shipping.company}</LabelValue>
                <LabelValue label="Attention:">{shipping.attention}</LabelValue>
                <LabelValue label="Address 1:">{shipping.address1}</LabelValue>
                <LabelValue label="Address 2:">{shipping.address2}</LabelValue>
                <LabelValue label="City:">{shipping.city}</LabelValue>
                <LabelValue label="Postal Code:">{shipping.postal_code}</LabelValue>
                <LabelValue label="State:">{shipping.state_province}</LabelValue>
                <LabelValue label="Country:">{shipping.country}</LabelValue>
                <LabelValue label="Phone:">{shipping.phone}</LabelValue>
                <LabelValue label="Email:">{shipping.email}</LabelValue>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="card border border-border-color rounded-xl">
              <div className="px-4 py-2 border-b border-border-color bg-primary-10 rounded-t-xl text-sm font-semibold text-font-color">
                Shipping Method
              </div>
              <div className="p-4">
                <LabelValue label="Shipping WH:">{data.location}</LabelValue>
                <LabelValue label="Account #:">{data.account_number}</LabelValue>
                <LabelValue label="Receipt Date:">{new Date(data.received_date).toLocaleString()}</LabelValue>
                <LabelValue label="Order Status:">{data.order_status}</LabelValue>
                <LabelValue label="International Code:">{data.international_code}</LabelValue>
                <LabelValue label="Payment Type:">{data.payment_type}</LabelValue>
                <LabelValue label="Carrier:">{data.shipping_carrier}</LabelValue>
                <LabelValue label="Service:">{data.shipping_service}</LabelValue>
                <LabelValue label="Freight Account:">{data.freight_account}</LabelValue>
                <LabelValue label="Consignee #:">{data.consignee_number}</LabelValue>
                <LabelValue label="Incoterms:">{data.terms}</LabelValue>
                <LabelValue label="FOB Location:">{data.fob}</LabelValue>
              </div>
            </div>

            {/* General + Amounts */}
            <div className="card border border-border-color rounded-xl">
              <div className="px-4 py-2 border-b border-border-color bg-primary-10 rounded-t-xl text-sm font-semibold text-font-color">
                General
              </div>
              <div className="p-4 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-xs text-font-color-100">Channel</div>
                  <div className="text-sm text-font-color font-semibold">{data.order_type}</div>
                  <div className="text-xs text-font-color-100">Customer #</div>
                  <div className="text-sm text-font-color">{data.customer_number}</div>
                  <div className="text-xs text-font-color-100">PO #</div>
                  <div className="text-sm text-font-color">{data.po_number}</div>
                  <div className="text-xs text-font-color-100">Order Date</div>
                  <div className="text-sm text-font-color">{new Date(data.ordered_date).toLocaleDateString()}</div>
                  <div className="text-xs text-font-color-100">Packing List</div>
                  <div className="text-sm text-font-color">{data.packing_list_type}</div>
                </div>

                <div className="h-px bg-border-color my-2" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-xs text-font-color-100">Order Amount</div>
                  <div className="text-right text-sm font-semibold">{Intl.NumberFormat().format(data.order_subtotal || 0)}</div>
                  <div className="text-xs text-font-color-100">S & H</div>
                  <div className="text-right text-sm">{Intl.NumberFormat().format(data.shipping_handling || 0)}</div>
                  <div className="text-xs text-font-color-100">Sales Taxes</div>
                  <div className="text-right text-sm">{Intl.NumberFormat().format(data.sales_tax || 0)}</div>
                  <div className="text-xs text-font-color-100">Discount/Add. Chgs.</div>
                  <div className="text-right text-sm">{Intl.NumberFormat().format(data.international_handling || 0)}</div>
                  <div className="text-xs text-font-color-100">Total Amount</div>
                  <div className="text-right text-sm">{Intl.NumberFormat().format(data.total_due || 0)}</div>
                  <div className="text-xs text-font-color-100">Amount Paid</div>
                  <div className="text-right text-sm">{Intl.NumberFormat().format(data.amount_paid || 0)}</div>
                  <div className="text-xs text-font-color-100">Net Due</div>
                  <div className="text-right text-sm">{Intl.NumberFormat().format(data.net_due_currency || 0)}</div>
                  <div className="text-xs text-font-color-100">Balance Due (US)</div>
                  <div className="text-right text-sm">{Intl.NumberFormat().format(data.balance_due_us || 0)}</div>
                  <div className="text-xs text-font-color-100">Int. Decl. Value</div>
                  <div className="text-right text-sm">{Intl.NumberFormat().format(data.international_declared_value || 0)}</div>
                  <div className="text-xs text-font-color-100">Insurance</div>
                  <div className="text-right text-sm">{Intl.NumberFormat().format(data.insurance || 0)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing + Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div className="card border border-border-color rounded-xl">
              <div className="px-4 py-2 border-b border-border-color bg-primary-10 rounded-t-xl text-sm font-semibold text-font-color">Billing Address</div>
              <div className="p-4 space-y-1 text-sm">
                <div>{billing.company}</div>
                <div>{billing.attention}</div>
                <div>
                  {billing.address1} {billing.address2}
                </div>
                <div>
                  {billing.city}
                  {billing.state_province && <span>&nbsp;,&nbsp;</span>}
                  {billing.state_province}
                  {billing.postal_code && <span>&nbsp;-&nbsp;</span>}
                  {billing.postal_code}
                </div>
                <div>{billing.country}</div>
                <div className="flex items-center gap-2">
                  <span>{billing.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{billing.email}</span>
                </div>
              </div>
            </div>

            <div className="card border border-border-color rounded-xl">
              <div className="px-4 py-2 border-b border-border-color bg-primary-10 rounded-t-xl text-sm font-semibold text-font-color">Shipping Instructions</div>
              <div className="p-4 min-h-[130px] text-sm whitespace-pre-wrap">{data.shipping_instructions}</div>
            </div>

            <div className="card border border-border-color rounded-xl">
              <div className="px-4 py-2 border-b border-border-color bg-primary-10 rounded-t-xl text-sm font-semibold text-font-color">Packing List Comments</div>
              <div className="p-4 min-h-[130px] text-sm whitespace-pre-wrap">{data.packing_list_comments}</div>
            </div>
          </div>

          {/* Order Lines */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-danger">ORDER LINES</div>
            </div>
            <div className="bg-card-color border border-border-color rounded-xl overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-primary-10 border-b border-border-color text-xs uppercase text-font-color">
                    <th className="px-3 py-2 text-left">DCL / CUST LINE #</th>
                    <th className="px-3 py-2 text-left">ITEM # / DESCRIPTION</th>
                    <th className="px-3 py-2 text-center">QTY</th>
                    <th className="px-3 py-2 text-center">SHIP QTY</th>
                    <th className="px-3 py-2 text-center">BL QTY</th>
                    <th className="px-3 py-2 text-right">PRICE</th>
                    <th className="px-3 py-2 text-right">SUBTOTAL</th>
                    <th className="px-3 py-2 text-center">DON'T SHIP BEFORE</th>
                    <th className="px-3 py-2 text-center">SHIP BY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {data.order_lines?.map((item) => (
                    <tr key={item.id} className={item.voided ? 'line-through text-font-color-100' : ''}>
                      <td className="px-3 py-2 align-top">
                        <div className="font-semibold">{item.line_number}</div>
                        {item.custom_field3 && <div className="text-xs text-font-color-100 ml-2">{item.custom_field3}</div>}
                      </td>
                      <td className="px-3 py-2 w-[30%] align-top">
                        <div className="font-semibold">{item.item_number}</div>
                        <div className="text-primary text-xs mt-1">{item.description}</div>
                        <div className="text-xs mt-1 space-x-3">
                          {item.custom_field1 && (
                            <span>
                              <span className="font-semibold">CF1:</span> {item.custom_field1}
                            </span>
                          )}
                          {item.custom_field2 && (
                            <span>
                              <span className="font-semibold">CF2:</span> {item.custom_field2}
                            </span>
                          )}
                          {item.custom_field5 && (
                            <span>
                              <span className="font-semibold">CF5:</span> {item.custom_field5}
                            </span>
                          )}
                          {item.comments && (
                            <span>
                              <span className="font-semibold">Comments:</span> {item.comments}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center font-semibold">{Intl.NumberFormat().format(item.quantity || 0)}</td>
                      <td className="px-3 py-2 text-center font-semibold">{Intl.NumberFormat().format(item.shipped || 0)}</td>
                      <td className="px-3 py-2 text-center">{Intl.NumberFormat().format((item.quantity || 0) - (item.shipped || 0))}</td>
                      <td className="px-3 py-2 text-right">{Intl.NumberFormat().format(item.price || 0)}</td>
                      <td className="px-3 py-2 text-right">{Intl.NumberFormat().format((item.price || 0) * (item.quantity || 0))}</td>
                      <td className="px-3 py-2 text-center">{item.do_not_ship_before ? new Date(item.do_not_ship_before).toLocaleDateString() : ''}</td>
                      <td className="px-3 py-2 text-center">{item.ship_by ? new Date(item.ship_by).toLocaleDateString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-2">
              <div className="px-3 py-2 bg-primary-10 text-font-color rounded-lg border border-border-color">
                <div className="font-semibold">
                  Total Price Item : <span className="ml-2">{Intl.NumberFormat().format(data.total_price_line || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipments */}
          {shipments.length > 0 && (
            <div className="mt-8 space-y-6">
              <div>
                <div className="text-danger font-semibold mb-2">Shipment</div>
                <div className="bg-card-color border border-border-color rounded-xl overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-primary-10 border-b border-border-color text-xs uppercase text-font-color">
                        <th className="px-3 py-2 text-center">#</th>
                        <th className="px-3 py-2 text-center">SHIP DATE</th>
                        <th className="px-3 py-2 text-center">PACKAGES</th>
                        <th className="px-3 py-2 text-right">WEIGHT</th>
                        <th className="px-3 py-2 text-left">CARRIER</th>
                        <th className="px-3 py-2 text-left">SERVICE</th>
                        <th className="px-3 py-2 text-left">REF 1</th>
                        <th className="px-3 py-2 text-left">REF 2</th>
                        <th className="px-3 py-2 text-left">REF 3</th>
                        <th className="px-3 py-2 text-left">REF 4</th>
                        <th className="px-3 py-2 text-left">RS TRACKING #</th>
                        <th className="px-3 py-2 text-left">DOCUMENTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                      {shipments.map((s: any) => (
                        <tr key={s.id}>
                          <td className="px-3 py-2 text-center">{s.line_index}</td>
                          <td className="px-3 py-2 text-center">{s.ship_date ? new Date(s.ship_date).toLocaleDateString() : ''}</td>
                          <td className="px-3 py-2 text-center">{s.packages}</td>
                          <td className="px-3 py-2 text-right">{Intl.NumberFormat().format(s.total_weight || 0)}</td>
                          <td className="px-3 py-2">{s.shipping_carrier}</td>
                          <td className="px-3 py-2">{s.shipping_service}</td>
                          <td className="px-3 py-2">{s.reference1}</td>
                          <td className="px-3 py-2">{s.reference2}</td>
                          <td className="px-3 py-2">{s.reference3}</td>
                          <td className="px-3 py-2">{s.reference4}</td>
                          <td className="px-3 py-2">{s.rs_tr}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {s.pl_link && (
                              <a className="inline-flex items-center text-danger hover:underline" href={s.pl_link} target="_blank" rel="noreferrer">
                                <IconFileText className="w-4 h-4 mr-1" /> Packing List
                              </a>
                            )}
                            {s.ci_link && (
                              <a className="inline-flex items-center text-danger hover:underline ml-3" href={s.ci_link} target="_blank" rel="noreferrer">
                                <IconFileText className="w-4 h-4 mr-1" /> Comm. Invoice
                              </a>
                            )}
                            {s.bol_link && (
                              <a className="inline-flex items-center text-danger hover:underline ml-3" href={s.bol_link} target="_blank" rel="noreferrer">
                                <IconFileText className="w-4 h-4 mr-1" /> BOL
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="text-danger font-semibold mb-2">Package</div>
                <div className="bg-card-color border border-border-color rounded-xl overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-primary-10 border-b border-border-color text-xs uppercase text-font-color">
                        <th className="px-3 py-2 text-center">#</th>
                        <th className="px-3 py-2 text-center">SHIP DATE</th>
                        <th className="px-3 py-2 text-center">DELIVERY DATE</th>
                        <th className="px-3 py-2 text-left">DELIVERY STATUS</th>
                        <th className="px-3 py-2 text-left">PACKAGE #</th>
                        <th className="px-3 py-2 text-left">SSCC</th>
                        <th className="px-3 py-2 text-left">CARRIER</th>
                        <th className="px-3 py-2 text-left">SERVICE</th>
                        <th className="px-3 py-2 text-left">TRACKING #</th>
                        <th className="px-3 py-2 text-left">FREIGHT BILL TO</th>
                        <th className="px-3 py-2 text-right">ACTUAL WT</th>
                        <th className="px-3 py-2 text-right">RATED WT</th>
                        <th className="px-3 py-2 text-center">DIM</th>
                        <th className="px-3 py-2 text-right">FREIGHT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                      {packages.map((p: any) => (
                        <tr key={p.id}>
                          <td className="px-3 py-2 text-center">{p.line_index}</td>
                          <td className="px-3 py-2 text-center">{p.ship_date ? new Date(p.ship_date).toLocaleDateString() : ''}</td>
                          <td className="px-3 py-2 text-center">{p.delivery_date ? new Date(p.delivery_date).toLocaleDateString() : ''}</td>
                          <td className="px-3 py-2">{p.delivery_info}</td>
                          <td className="px-3 py-2">{p.package_number}{p.pallet_number ? <div className="text-xs text-primary">{p.pallet_number}</div> : null}</td>
                          <td className="px-3 py-2">{p.asn}{p.pallet_asn ? <div className="text-xs text-primary">{p.pallet_asn}</div> : null}</td>
                          <td className="px-3 py-2">{p.shipping_carrier}</td>
                          <td className="px-3 py-2">{p.shipping_service}</td>
                          <td className="px-3 py-2">{p.tracking_link ? <a className="text-primary hover:underline" href={p.tracking_link} target="_blank" rel="noreferrer">{p.tracking_number}</a> : p.tracking_number}</td>
                          <td className="px-3 py-2">{p.freight_bill_to}</td>
                          <td className="px-3 py-2 text-right">{Intl.NumberFormat().format(p.package_weight || 0)}</td>
                          <td className="px-3 py-2 text-right">{Intl.NumberFormat().format(p.package_rated_weight || 0)}</td>
                          <td className="px-3 py-2 text-center">{p.package_dimension}</td>
                          <td className="px-3 py-2 text-right">{Intl.NumberFormat().format(p.package_charge || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="text-danger font-semibold mb-2">Package Detail</div>
                <div className="bg-card-color border border-border-color rounded-xl overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-primary-10 border-b border-border-color text-xs uppercase text-font-color">
                        <th className="px-3 py-2 text-center">#</th>
                        <th className="px-3 py-2 text-center">SHIP DATE</th>
                        <th className="px-3 py-2 text-left">PACKAGE #</th>
                        <th className="px-3 py-2 text-center">LINE #</th>
                        <th className="px-3 py-2 text-left">ITEM #</th>
                        <th className="px-3 py-2 text-left">DESCRIPTION</th>
                        <th className="px-3 py-2 text-right">QTY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                      {package_details.map((d: any) => (
                        <tr key={d.id}>
                          <td className="px-3 py-2 text-center">{d.line_index}</td>
                          <td className="px-3 py-2 text-center">{d.ship_date ? new Date(d.ship_date).toLocaleDateString() : ''}</td>
                          <td className="px-3 py-2">{d.package_number}</td>
                          <td className="px-3 py-2 text-center">{d.line_number}</td>
                          <td className="px-3 py-2">{d.item_number}</td>
                          <td className="px-3 py-2">{d.description}</td>
                          <td className="px-3 py-2 text-right">{Intl.NumberFormat().format(d.quantity || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}


