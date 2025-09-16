import React, { useEffect, useMemo } from 'react';
import { IconChevronLeft, IconChevronRight, IconRefresh, IconX } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
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

  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button variant="danger" size="small" onClick={onClose}>
            Close
          </Button>
          <div className="text-base font-semibold">
            <span className="text-success">ITEM #:</span>
            <span className="ml-2">{detail.item_number}</span>
            {detail.desc1 && (
              <span className="ml-3 text-sm text-font-color-100">{detail.desc1}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {typeof currentIndex === 'number' && typeof totalItems === 'number' && (
            <div className="hidden md:flex items-center text-sm text-muted-foreground mr-2">
              <span>{currentIndex}</span>
              <span className="mx-1">/</span>
              <span>{totalItems}</span>
            </div>
          )}
          {onPrevious && (
            <Button variant="ghost" size="small" disabled={!hasPrevious} onClick={onPrevious}>
              <IconChevronLeft size={18} />
            </Button>
          )}
          {onNext && (
            <Button variant="ghost" size="small" disabled={!hasNext} onClick={onNext}>
              <IconChevronRight size={18} />
            </Button>
          )}
          {onRefresh && (
            <Button variant="ghost" size="small" onClick={onRefresh}>
              <IconRefresh size={18} />
            </Button>
          )}
          <Button variant="ghost" size="small" onClick={onClose}>
            <IconX size={18} />
          </Button>
        </div>
      </div>

      {/* Stock distribution table */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Warehouse Distribution</CardTitle>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader><CardTitle>Last 10 days/weeks</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ReactECharts option={shippedChart} style={{ height: '100%', width: '100%', opacity: loading ? 0.5 : 1 }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>&nbsp;</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ReactECharts option={receivedChart} style={{ height: '100%', width: '100%', opacity: loading ? 0.5 : 1 }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side data panels: mimic legacy layout as stacked cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
          <CardContent className="text-sm grid grid-cols-2 gap-y-2">
            <LabeledValue label="UPC" value={(loading ? '' : (shipping.upc || ''))} placeholder={loading} />
            <LabeledValue label="Weight" value={String(shipping.weight || '')} />
            <LabeledValue label="Dimension" value={(loading ? '' : (shipping.dimension || ''))} placeholder={loading} />
            <LabeledValue label="Serial/Lot No" value={(loading ? '' : (shipping.serial_no || ''))} placeholder={loading} />
            <LabeledValue label="Serial Format" value={(loading ? '' : (shipping.serial_format || ''))} placeholder={loading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Export</CardTitle></CardHeader>
          <CardContent className="text-sm grid grid-cols-2 gap-y-2">
            <LabeledValue label="ECCN" value={(loading ? '' : (exp.eccn || ''))} placeholder={loading} />
            <LabeledValue label="Harmonized Code" value={(loading ? '' : (exp.hcode || ''))} placeholder={loading} />
            <LabeledValue label="Harmonized Code (CA)" value={(loading ? '' : (exp.hcode_ca || ''))} placeholder={loading} />
            <LabeledValue label="Country Of Origin" value={(loading ? '' : (exp.coo || ''))} placeholder={loading} />
            <LabeledValue label="GL Symbol" value={(loading ? '' : (exp.gl || ''))} placeholder={loading} />
            <LabeledValue label="Category" value={(loading ? '' : (exp.cat || ''))} placeholder={loading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>DG Data</CardTitle></CardHeader>
          <CardContent className="text-sm grid grid-cols-2 gap-y-2">
            <LabeledValue label="Li Battery Category" value={(loading ? '' : (dg.li_b_cat || ''))} placeholder={loading} />
            <LabeledValue label="Li Battery Config." value={(loading ? '' : (dg.li_b_conf || ''))} placeholder={loading} />
            <LabeledValue label="Li Battery Type" value={(loading ? '' : (dg.li_t_type || ''))} placeholder={loading} />
            <LabeledValue label="Cell/Batt. Per Retail Pack." value={toStr(dg.cell_rp)} />
            <LabeledValue label="Retail Units Per Inner Carton" value={toStr(dg.unit_innerc)} />
            <LabeledValue label="Retail Units Per Master Carton" value={toStr(dg.unit_masterc)} />
            <LabeledValue label="Watt/Hour Per Cell/Battery (<=)" value={toStr(dg.wh_cell)} />
            <LabeledValue label="Net Wgt of Li Battery (g)" value={toStr(dg.net_wh)} />
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader><CardTitle>Basic</CardTitle></CardHeader>
          <CardContent className="text-sm grid grid-cols-2 md:grid-cols-4 gap-y-2">
            <LabeledValue label="Warehouse" value={(loading ? '' : (detail.warehouse || ''))} placeholder={loading} />
            <LabeledValue label="Cat 1." value={(loading ? '' : (detail.cat1 || ''))} placeholder={loading} />
            <LabeledValue label="Cat 2." value={(loading ? '' : (detail.cat2 || ''))} placeholder={loading} />
            <LabeledValue label="Cat 3." value={(loading ? '' : (detail.cat3 || ''))} placeholder={loading} />
            <LabeledValue label="Lot # Assign." value={(loading ? '' : (detail.lot_assign || ''))} placeholder={loading} />
            <LabeledValue label="Shelf Life Days" value={toStr(detail.lot_exp)} />
            <LabeledValue label="Re-Order Point" value={toStr(detail.reorder)} />
            <LabeledValue label="Re-Order Quantity" value={toStr(detail.reorder_qty)} />
            <LabeledValue label="Pack Multiple" value={toStr(detail.pack)} />
          </CardContent>
        </Card>
      </div>
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



