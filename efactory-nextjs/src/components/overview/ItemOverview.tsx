import React, { useEffect, useMemo } from 'react';
import { IconChevronLeft, IconChevronRight, IconRefresh, IconX, IconSettings, IconChevronDown, IconEdit } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EditItemDialog from '@/components/overview/EditItemDialog';
import type { ItemChartPointDto, ItemDetailResponseData, ItemStockRowDto } from '@/types/api/inventory';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type Props = {
  data: ItemDetailResponseData;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalItems?: number;
  onRefresh?: () => void;
  loading?: boolean;
};

export default function ItemOverview({ data, onClose, onPrevious, onNext, hasPrevious, hasNext, currentIndex, totalItems, onRefresh, loading }: Props) {
  useEffect(() => {
    // Suppress global nav loader while this component is mounted
    if (typeof window !== 'undefined') {
      ;(window as any).__EF_SUPPRESS_NAV_LOADING = true
    }
    return () => {
      if (typeof window !== 'undefined') {
        ;(window as any).__EF_SUPPRESS_NAV_LOADING = false
      }
    }
  }, [])

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when not in input fields
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement || 
          event.target instanceof HTMLSelectElement) {
        return;
      }

      if (event.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        event.preventDefault();
        onPrevious();
      } else if (event.key === 'ArrowRight' && hasNext && onNext) {
        event.preventDefault();
        onNext();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasPrevious, hasNext, onPrevious, onNext]);

  const charts = data.charts || [];
  const stock = data.stock || [];
  const detail = data.detail || {};
  const shipping = data.shipping || {};
  const exp = data.export || {};
  const dg = data.dg || {};
  const edi = data.edi || [];

  const shippedChart = useMemo(() => buildBarOption(charts, 'Qty Shipped/Returned', [
    { field: 'shipped', color: '#44bdae', border: '#249d8e', name: 'Qty Shipped' },
    { field: 'returned', color: '#e7505a', border: '#c7303a', name: 'Qty Returned' },
  ]), [charts]);

  const receivedChart = useMemo(() => buildBarOption(charts, 'Qty Received/Adjusted', [
    { field: 'received', color: '#337ab7', border: '#135a97', name: 'Qty Received' },
    { field: 'adjusted', color: '#777777', border: '#555555', name: 'Qty Adjusted' },
  ]), [charts]);

  const [showEdit, setShowEdit] = React.useState(false);
  const [showActionsMenu, setShowActionsMenu] = React.useState(false);

  return (
    <div className="bg-background rounded-xl border border-border-color shadow w-full max-w-[1800px] mx-auto overflow-hidden flex flex-col">
      {/* Header section - EXACT same layout as OrderOverview */}
      <div className="bg-background border-b border-border-color">
        <div className="px-6 py-2">
          {/* Single Row Header - Everything in one line */}
          <div className="flex items-center justify-between">
            {/* Left Side - Close Button + Item Info */}
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
                          <h1 className="text-lg font-bold text-font-color">Item #{detail.item_number}</h1>
                          {(detail as any).status && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-orange-500 text-white rounded">
                              {(detail as any).status}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          {(detail as any).account_number && (
                            <div>
                              <span className="text-font-color-100">Account:</span>
                              <span className="ml-1 font-medium text-font-color">{(detail as any).account_number}</span>
                            </div>
                          )}
                          {(detail as any).order_number && (
                            <div>
                              <span className="text-font-color-100">Order:</span>
                              <span className="ml-1 font-medium text-font-color">{(detail as any).order_number}</span>
                            </div>
                          )}
                          {detail.warehouse && (
                            <div>
                              <span className="text-font-color-100">Warehouse:</span>
                              <span className="ml-1 font-medium text-font-color">{detail.warehouse}</span>
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
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    className="px-3 py-1.5 text-sm"
                  >
                    <span>Actions</span>
                    <IconChevronDown className={`ml-2 w-3 h-3 transition-transform ${showActionsMenu ? 'rotate-180' : ''}`} />
                  </Button>
                  {showActionsMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowActionsMenu(false)} />
                      <div className="absolute right-0 top-full mt-1 w-56 bg-card-color border border-border-color rounded-lg shadow-xl z-50">
                        <div className="py-1">
                          <button
                            onClick={() => { setShowEdit(true); setShowActionsMenu(false); }}
                            className="w-full px-3 py-1.5 text-left text-sm text-font-color hover:bg-primary-10 hover:text-primary transition-all duration-200 flex items-center gap-2 rounded-sm"
                          >
                            <IconEdit className="w-4 h-4 text-font-color-100" />
                            Edit item
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Refresh button */}
                {onRefresh && (
                  <Button
                    variant="outline"
                    size="small"
                    icon={<IconRefresh />}
                    onClick={onRefresh}
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
        {/* Two column layout: Left (wider) + Right (narrower) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stock Distribution + Charts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stock distribution table */}
            <Card>
              <CardHeader>
                <CardTitle>Stock distribution by WH</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="table-auto w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="px-2 py-2 text-center">WH</th>
                        <th className="px-2 py-2 text-right">Q ON HAND</th>
                        <th className="px-2 py-2 text-right">Q ON HOLD</th>
                        <th className="px-2 py-2 text-right">Q COMMITTED</th>
                        <th className="px-2 py-2 text-right">Q IN PROCESS</th>
                        <th className="px-2 py-2 text-right">Q ON FF</th>
                        <th className="px-2 py-2 text-right">Q NET AVAIL.</th>
                        <th className="px-2 py-2 text-right">OPEN WO</th>
                        <th className="px-2 py-2 text-right">OPEN PO</th>
                        <th className="px-2 py-2 text-right">OPEN RMA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stock.length ? stock : new Array(loading ? 3 : 0).fill({} as ItemStockRowDto)).map((s, idx) => (
                        <tr key={idx} className="border-b last:border-b-0">
                          <td className="px-2 py-2 text-center font-semibold text-primary">{formatWh(s)}</td>
                          <TdNum v={s.qty_onhand} loading={!!loading && !stock.length} />
                          <TdNum v={s.qty_onhold} loading={!!loading && !stock.length} />
                          <TdNum v={s.qty_comm} loading={!!loading && !stock.length} />
                          <TdNum v={s.qty_proc} loading={!!loading && !stock.length} />
                          <TdNum v={s.qty_ff} loading={!!loading && !stock.length} />
                          <TdNum v={s.qty_net} strong loading={!!loading && !stock.length} />
                          <TdNum v={s.open_wo} loading={!!loading && !stock.length} />
                          <TdNum v={s.open_po} loading={!!loading && !stock.length} />
                          <TdNum v={s.open_rma} loading={!!loading && !stock.length} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle>Qty Shipped/Returned</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[260px]">
                    <ReactECharts option={shippedChart} style={{ height: '100%', width: '100%', opacity: loading ? 0.5 : 1 }} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Qty Received/Adjusted</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[260px]">
                    <ReactECharts option={receivedChart} style={{ height: '100%', width: '100%', opacity: loading ? 0.5 : 1 }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Dropdown + 5 Panels */}
          <div className="space-y-4">
            {/* Account/Warehouse Selector */}
            <Card>
              <CardHeader>
                <CardTitle>ACCOUNT # - WH:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <select className="w-full p-2 border border-border-color rounded">
                    <option>21590 - YK</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Panel */}
            <Card>
              <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">UPC</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Weight</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Dimension</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Serial/Lot No</label>
                  <div className="flex items-center gap-2">
                    <input type="text" className="flex-1 p-1 border border-border-color rounded text-xs" />
                    <input type="checkbox" className="w-4 h-4" />
                    <input type="text" placeholder="Format" className="flex-1 p-1 border border-border-color rounded text-xs" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Panel */}
            <Card>
              <CardHeader><CardTitle>Export</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">ECCN</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Harmonized Code</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Harmonized Code (CA)</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Country Of Origin</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">GL Symbol</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Category</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
              </CardContent>
            </Card>

            {/* DG Data Panel */}
            <Card>
              <CardHeader><CardTitle>DG Data</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Li Battery Category</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Li Battery Config.</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Li Battery Type</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Cell/Batt. Per Retail Pack.</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Retail Units Per Inner Carton</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Retail Units Per Master Carton</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Watt/Hour Per Cell/Battery (&lt;=)</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Net Wgt of Li Battery (g)</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
              </CardContent>
            </Card>

            {/* Basic Panel */}
            <Card>
              <CardHeader><CardTitle>Basic</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Warehouse</label>
                  <div className="text-sm text-font-color">YK - ZYKC</div>
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Cat 1.</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Cat 2.</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Cat 3.</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Lot # Assign.</label>
                  <input type="text" className="w-full p-1 border border-border-color rounded text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Shelf Life Days</label>
                  <div className="text-sm text-font-color">0</div>
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Re-Order Point</label>
                  <div className="text-sm text-font-color">0</div>
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Re-Order Quantity</label>
                  <div className="text-sm text-font-color">0</div>
                </div>
                <div>
                  <label className="block text-xs text-font-color-100 mb-1">Pack Multiple</label>
                  <div className="text-sm text-font-color">1</div>
                </div>
              </CardContent>
            </Card>

            {/* EDI Panel */}
            <Card>
              <CardHeader><CardTitle>EDI</CardTitle></CardHeader>
              <CardContent>
                <div className="bg-yellow-100 border border-yellow-300 rounded p-3 text-center text-sm text-yellow-800">
                  No TP Item Configured!
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <EditItemDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        item={data}
        accountWh={String((detail as any).account_wh || (detail as any).account_whs || '') || ''}
        onSaved={(updated) => {
          // naive update: replace local fields so UI reflects saved state; caller can refresh if needed
          (data as any).detail = updated.detail || (data as any).detail;
          (data as any).shipping = updated.shipping || (data as any).shipping;
          (data as any).export = updated.export || (data as any).export;
          (data as any).dg = updated.dg || (data as any).dg;
        }}
      />
    </div>
  );
}

function TdNum({ v, strong = false, loading = false }: { v: any; strong?: boolean; loading?: boolean }) {
  const num = Number(v ?? 0);
  const cls = strong ? 'font-semibold' : '';
  return <td className={`px-2 py-2 text-right ${cls}`}>{loading ? '—' : (Number.isFinite(num) ? num.toLocaleString() : '')}</td>;
}

function formatWh(s: ItemStockRowDto) {
  const loc = s.location || '';
  const br = s.branch || '';
  return `${loc}${loc && br ? ' - ' : ''}${br}`;
}

function toStr(v: any) {
  return v === undefined || v === null ? '' : String(v);
}

function LabeledValue({ label, value = '', placeholder = false }: { label: string; value?: string; placeholder?: boolean | undefined }) {
  return (
    <>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{placeholder ? '—' : value}</div>
    </>
  );
}

function buildBarOption(points: ItemChartPointDto[], title: string, seriesSpec: Array<{ field: keyof ItemChartPointDto; color: string; border: string; name: string }>) {
  const categories = points.map(p => p.period);
  const series = seriesSpec.map(s => ({
    name: s.name,
    type: 'bar',
    data: points.map(p => Number((p as any)[s.field] ?? 0)),
    itemStyle: { color: s.color, borderColor: s.border },
    barWidth: '55%',
  }));
  return {
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'category', data: categories, axisTick: { alignWithLabel: true } },
    yAxis: { type: 'value' },
    series,
  } as any;
}



