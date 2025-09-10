import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { IconShoppingCart, IconTruck, IconAlertTriangle, IconTags, IconClipboardList, IconPackage, IconBox, IconWand } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/shadcn/dropdown-menu';
import dynamic from 'next/dynamic';
import { fetch30DaysActivity, fetchFulfillments, fetchInventory, fetchLatest50Orders, fetchRma30Days, fetchDefaultOverviewLayout, saveOverviewLayout } from '@/services/api';
import type { ActivityPointDto, FulfillmentRowDto, InventoryFilters, InventoryItemDto, LatestOrderDto, RmaActivityPointDto } from '@/types/api/overview';
import type { OverviewArea, OverviewLayout, OverviewTileName } from '@/types/api/views';
import { useRouter } from 'next/router';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type CountersMap = Record<OverviewTileName, boolean>;

function getDefaultLayout(): OverviewLayout {
  return {
    areas: [
      {
        name: 'tiles',
        visible: true,
        areas: [
          { name: 'multi_received_today', visible: true },
          { name: 'multi_shipped_today', visible: true },
          { name: 'multi_open_orders', visible: true },
          { name: 'multi_backorders', visible: false },
          { name: 'multi_subtotal', visible: false },
          { name: 'multi_sh', visible: false },
          { name: 'open_rma', visible: false },
          { name: 'orders_received_today', visible: false },
          { name: 'orders_shipped_today', visible: false },
        ],
      },
      { name: 'fulfillment', visible: true },
      { name: '30days', visible: true },
      { name: 'inventory', visible: true },
      { name: '50orders', visible: true },
      { name: '30days_rmas', visible: true },
    ],
  };
}

function saveLayoutToStorage(layout: OverviewLayout) {
  if (typeof window === 'undefined') return;
  const tokenRaw = window.localStorage.getItem('authToken');
  const userId = tokenRaw ? (JSON.parse(tokenRaw)?.user_data?.user_id as number | undefined) : undefined;
  const key = userId ? `view.overview_layout.${userId}` : 'view.overview_layout';
  window.localStorage.setItem('overview_layout', JSON.stringify(layout));
  if (userId) window.localStorage.setItem(key, JSON.stringify({ data: [{ type: 'overview_layout' }], overview_layout: layout }));
}

function loadLayoutFromStorage(): OverviewLayout | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('overview_layout');
    return raw ? (JSON.parse(raw) as OverviewLayout) : null;
  } catch {
    return null;
  }
}

export default function OverviewPage() {
  const router = useRouter();
  const [layout, setLayout] = useState<OverviewLayout | null>(null);
  const [fulfillments, setFulfillments] = useState<FulfillmentRowDto[]>([]);
  const [activity, setActivity] = useState<ActivityPointDto[]>([]);
  const [rmaActivity, setRmaActivity] = useState<RmaActivityPointDto[]>([]);
  const [inventory, setInventory] = useState<InventoryItemDto[]>([]);
  const [orders, setOrders] = useState<LatestOrderDto[]>([]);
  const [ordersTab, setOrdersTab] = useState<'received' | 'shipped'>('received');
  const [invFilters, setInvFilters] = useState<InventoryFilters>({ hasKey: true, isShort: false, needReorder: false });
  const [isSavingLayout, setIsSavingLayout] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hideZeroQty, setHideZeroQty] = useState(true);

  // Load layout
  useEffect(() => {
    (async () => {
      const local = loadLayoutFromStorage();
      if (local) {
        setLayout(local);
      } else {
        try {
          const remote = await fetchDefaultOverviewLayout();
          setLayout(remote);
          saveLayoutToStorage(remote);
        } catch {
          const fallback = getDefaultLayout();
          setLayout(fallback);
        }
      }
    })();
  }, []);

  const visibleTiles = useMemo(() => {
    const area = layout?.areas.find(a => a.name === 'tiles');
    return (area?.areas || []).filter(a => a.visible).slice(0, 4).map(a => a.name);
  }, [layout]);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [f, a, r, i, o] = await Promise.all([
        fetchFulfillments(),
        fetch30DaysActivity(),
        fetchRma30Days(),
        fetchInventory(invFilters),
        fetchLatest50Orders(ordersTab),
      ]);
      setFulfillments(f);
      setActivity(a);
      setRmaActivity(r);
      setInventory(i as any);
      setOrders(o);
    } finally {
      setIsRefreshing(false);
    }
  }, [invFilters, ordersTab]);

  useEffect(() => {
    if (!layout) return;
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  // Inventory filters change
  useEffect(() => {
    (async () => {
      const data = await fetchInventory(invFilters);
      setInventory(data as any);
    })();
  }, [invFilters]);

  // Latest orders tab change
  useEffect(() => {
    (async () => setOrders(await fetchLatest50Orders(ordersTab)))();
  }, [ordersTab]);

  function toggleTile(name: OverviewTileName) {
    if (!layout) return;
    const next: OverviewLayout = JSON.parse(JSON.stringify(layout));
    const tiles = next.areas.find(a => a.name === 'tiles');
    if (!tiles || !tiles.areas) return;
    const entry = tiles.areas.find(t => t.name === name);
    if (!entry) return;
    const currentlyVisible = tiles.areas.filter(t => t.visible).length;
    entry.visible = entry.visible ? false : currentlyVisible < 4;
    setLayout(next);
  }

  async function onSaveLayout() {
    if (!layout) return;
    setIsSavingLayout(true);
    try {
      const saved = await saveOverviewLayout(layout);
      setLayout(saved);
      saveLayoutToStorage(saved);
    } finally {
      setIsSavingLayout(false);
    }
  }

  // COUNTERS: aggregate from fulfillments
  const totals = useMemo(() => {
    const initial = {
      orders_today: 0,
      shipped_today: 0,
      back_orders: 0,
      open_rmas: 0,
      recv_today_lines: 0,
      recv_today_units: 0,
      ship_today_lines: 0,
      ship_today_units: 0,
      issued_rmas_today: 0,
      received_rmas_today: 0,
      rma_units_auth: 0,
      rma_units_recv: 0,
      rma_units_open: 0,
      total_open_orders: 0,
      total_open_lines: 0,
      total_open_qty: 0,
      total_back_orders: 0,
      total_back_lines: 0,
      back_qty: 0,
      subtotal_received_today: 0,
      subtotal_shipped_today: 0,
      subtotal_open: 0,
      sh_received_today: 0,
      sh_shipped_today: 0,
      sh_open: 0,
    } as Record<string, number>;
    return fulfillments.reduce((acc, it) => {
      Object.keys(acc).forEach(k => {
        const v = (it as any)[k];
        if (typeof v === 'number') acc[k] += v;
      });
      return acc;
    }, initial);
  }, [fulfillments]);

  function CounterTile({ title, value, variant, icon }: { title: string; value: number; variant: 'primary' | 'success' | 'warning' | 'info' | 'purple' | 'amber' | 'slate' | 'red'; icon: React.ReactNode }) {
    const variantMap: Record<string, { from: string; to: string; border: string }> = {
      primary: { from: 'from-primary', to: 'to-primary-10', border: 'border-primary' },
      success: { from: 'from-success', to: 'to-success-10', border: 'border-success' },
      warning: { from: 'from-warning', to: 'to-warning-10', border: 'border-warning' },
      info: { from: 'from-info', to: 'to-info-10', border: 'border-info' },
      purple: { from: 'from-purple-500', to: 'to-purple-200', border: 'border-purple-500' },
      amber: { from: 'from-amber-500', to: 'to-amber-200', border: 'border-amber-500' },
      slate: { from: 'from-slate-500', to: 'to-slate-200', border: 'border-slate-500' },
      red: { from: 'from-rose-500', to: 'to-rose-200', border: 'border-rose-500' },
    };
    const v = variantMap[variant];
    return (
      <div className={`card bg-gradient-to-br ${v.from} ${v.to} rounded-xl p-3 md:p-4 border ${v.border} h-[110px]`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg md:text-xl font-bold text-white leading-6">{Intl.NumberFormat().format(value || 0)}</div>
            <div className="text-[11px] text-white/80">{title}</div>
          </div>
          <div className="w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center">
            <div className="text-white">{icon}</div>
          </div>
        </div>
      </div>
    );
  }

  function renderTile(name: OverviewTileName) {
    switch (name) {
      case 'orders_received_today':
      case 'multi_received_today':
        return (
          <div className="card bg-gradient-to-br from-primary to-primary-10 rounded-xl p-3 md:p-4 border border-primary h-[110px]">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold text-white/80">RECEIVED TODAY</div>
              <div className="w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center">
                <IconShoppingCart className="w-[14px] h-[14px] text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-white/20 h-[58px]">
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.orders_today)}</div><div className="text-[11px] text-white/80">Orders</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.recv_today_lines)}</div><div className="text-[11px] text-white/80">Lines</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.recv_today_units)}</div><div className="text-[11px] text-white/80">Units</div></div>
            </div>
          </div>
        );
      case 'orders_shipped_today':
      case 'multi_shipped_today':
        return (
          <div className="card bg-gradient-to-br from-success to-success-10 rounded-xl p-3 md:p-4 border border-success h-[110px]">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold text-white/80">SHIPPED TODAY</div>
              <div className="w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center">
                <IconTruck className="w-[14px] h-[14px] text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-white/20 h-[58px]">
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.shipped_today)}</div><div className="text-[11px] text-white/80">Orders</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.ship_today_lines)}</div><div className="text-[11px] text-white/80">Lines</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.ship_today_units)}</div><div className="text-[11px] text-white/80">Units</div></div>
            </div>
          </div>
        );
      case 'back_orders':
        return <CounterTile title="Backorders (orders)" value={totals.back_orders} variant="warning" icon={<IconAlertTriangle className="w-[14px] h-[14px]" />} />;
      case 'open_rma':
        return <CounterTile title="Open RMAs" value={totals.open_rmas} variant="amber" icon={<IconTags className="w-[14px] h-[14px]" />} />;
      case 'multi_open_orders':
        return (
          <div className="card bg-gradient-to-br from-slate-500 to-slate-200 rounded-xl p-3 md:p-4 border border-slate-500 h-[110px]">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold text-white/80">OPEN ORDERS</div>
              <div className="w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center">
                <IconClipboardList className="w-[14px] h-[14px] text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-white/20 h-[58px]">
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.total_open_orders)}</div><div className="text-[11px] text-white/80">Orders</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.total_open_lines)}</div><div className="text-[11px] text-white/80">Lines</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.total_open_qty)}</div><div className="text-[11px] text-white/80">Units</div></div>
            </div>
          </div>
        );
      case 'multi_backorders':
        return (
          <div className="card bg-gradient-to-br from-purple-500 to-purple-200 rounded-xl p-3 md:p-4 border border-purple-500 h-[110px]">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold text-white/80">BACK ORDERS</div>
              <div className="w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center">
                <IconAlertTriangle className="w-[14px] h-[14px] text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-white/20 h-[58px]">
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.total_back_orders)}</div><div className="text-[11px] text-white/80">Orders</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.total_back_lines)}</div><div className="text-[11px] text-white/80">Lines</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.back_qty)}</div><div className="text-[11px] text-white/80">Units</div></div>
            </div>
          </div>
        );
      case 'multi_subtotal':
        return <CounterTile title="Order Value Open ($)" value={totals.subtotal_open} variant="primary" icon={<IconClipboardList className="w-[14px] h-[14px]" />} />;
      case 'multi_sh':
        return <CounterTile title="Order S & H ($) Open" value={totals.sh_open} variant="red" icon={<IconPackage className="w-[14px] h-[14px]" />} />;
      case 'multi_rmas_today':
        return (
          <div className="card bg-gradient-to-br from-amber-500 to-amber-300 rounded-xl p-3 md:p-4 border border-amber-500 h-[110px]">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold text-white/80">RMA TODAY</div>
              <div className="w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center">
                <IconTags className="w-[14px] h-[14px] text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-white/20 h-[58px]">
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.issued_rmas_today)}</div><div className="text-[11px] text-white/80">Authorized</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.received_rmas_today)}</div><div className="text-[11px] text-white/80">Received</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.open_rmas)}</div><div className="text-[11px] text-white/80">Total Open</div></div>
            </div>
          </div>
        );
      case 'multi_rma_units_today':
        return (
          <div className="card bg-gradient-to-br from-amber-500 to-amber-300 rounded-xl p-3 md:p-4 border border-amber-500 h-[110px]">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold text-white/80">RMA UNITS TODAY</div>
              <div className="w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center">
                <IconBox className="w-[14px] h-[14px] text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-white/20 h-[58px]">
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.rma_units_auth)}</div><div className="text-[11px] text-white/80">Authorized</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.rma_units_recv)}</div><div className="text-[11px] text-white/80">Received</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.rma_units_open)}</div><div className="text-[11px] text-white/80">Total Open</div></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  function Chart30Days() {
    const option = useMemo(() => ({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['Received', 'Shipped'], top: 0 },
      grid: { left: 36, right: 20, bottom: 40, top: 36, containLabel: true },
      xAxis: {
        type: 'category',
        data: activity.map(p => new Date(p.date).getDate()),
        name: 'Day',
        nameLocation: 'middle',
        nameGap: 24,
      },
      yAxis: {
        type: 'value',
        name: 'Orders',
      },
      series: [
        { name: 'Received', type: 'bar', stack: 'orders', data: activity.map(p => p.received), itemStyle: { color: '#a3d5ff' } },
        { name: 'Shipped', type: 'bar', stack: 'orders', data: activity.map(p => p.shipped), itemStyle: { color: '#34d399' } },
        {
          name: 'Total', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
          data: activity.map(p => (p.received || 0) + (p.shipped || 0)),
          itemStyle: { color: '#6b7280' }, lineStyle: { width: 2, color: '#6b7280' }
        }
      ],
    }), [activity]);
    return <ReactECharts style={{ height: 240 }} option={option} />;
  }

  function ChartRma30Days() {
    const option = useMemo(() => ({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['Authorized', 'Closed', 'Total'], top: 0 },
      grid: { left: 36, right: 20, bottom: 40, top: 36, containLabel: true },
      xAxis: {
        type: 'category',
        data: rmaActivity.map(p => new Date(p.date).getDate()),
        name: 'Day',
        nameLocation: 'middle',
        nameGap: 24,
      },
      yAxis: {
        type: 'value',
        name: 'RMAs',
      },
      series: [
        { name: 'Authorized', type: 'bar', stack: 'rma', data: rmaActivity.map(p => p.issued), itemStyle: { color: '#fde68a' } },
        { name: 'Closed', type: 'bar', stack: 'rma', data: rmaActivity.map(p => p.closed), itemStyle: { color: '#f59e0b' } },
        {
          name: 'Total', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
          data: rmaActivity.map(p => (p.issued || 0) + (p.closed || 0)),
          itemStyle: { color: '#6b7280' }, lineStyle: { width: 2, color: '#6b7280' }
        }
      ],
    }), [rmaActivity]);
    return <ReactECharts style={{ height: 280 }} option={option} />;
  }

  function FulfillmentTable() {
    const visibleFulfillments = useMemo(() => {
      if (!hideZeroQty) return fulfillments;
      return fulfillments.filter(f => (
        (f.orders_today || 0) + (f.back_orders || 0) + (f.ff_hold || 0) +
        ((f.pre_release || 0) + (f.ready_to_print || 0) + (f.ready_to_release || 0) + (f.ready_to_ship || 0)) +
        (f.total_open_orders || 0) + (f.total_open_qty || 0) + (f.shipped_today || 0) + (f.ship_today_units || 0) +
        (f.shipped_others || 0) + (f.shipped_units_others || 0)
      ) > 0);
    }, [fulfillments, hideZeroQty]);

    return (
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">Hide zero qty</span>
            <button
              className={`inline-flex items-center h-5 w-9 rounded-full transition-colors ${hideZeroQty ? 'bg-primary' : 'bg-muted'} shadow-inner`}
              onClick={() => setHideZeroQty(v => !v)}
              aria-label="Hide zero quantity"
            >
              <span className={`inline-block h-4 w-4 bg-white rounded-full transform transition-transform ${hideZeroQty ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
          </div>
          <div>
            <Button size="sm" variant="outline" onClick={() => fetchFulfillments().then(setFulfillments)} title="Refresh Fulfillment">
              Refresh
            </Button>
          </div>
        </div>
        <table className="min-w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Account #</th>
              <th className="px-3 py-2">Group</th>
              <th className="px-3 py-2">Warehouse</th>
              <th className="px-3 py-2">Orders Today</th>
              <th className="px-3 py-2">Back Orders</th>
              <th className="px-3 py-2">Hold</th>
              <th className="px-3 py-2">In Process</th>
              <th className="px-3 py-2">Total Open</th>
              <th className="px-3 py-2">Total Open Units</th>
              <th className="px-3 py-2">Shipped Today</th>
              <th className="px-3 py-2">Shipped Today Units</th>
              <th className="px-3 py-2">Others</th>
              <th className="px-3 py-2">Others Units</th>
            </tr>
          </thead>
          <tbody>
            {visibleFulfillments.map((row, idx) => (
              <tr key={idx} className="odd:bg-muted/40">
                <td className="px-3 py-2 font-medium">{row.account_number}</td>
                <td className="px-3 py-2 text-center">{row.group}</td>
                <td className="px-3 py-2 text-center">{row.region}</td>
                <td className="px-3 py-2 text-center">{row.orders_today}</td>
                <td className="px-3 py-2 text-center">{row.back_orders}</td>
                <td className="px-3 py-2 text-center">{row.ff_hold}</td>
                <td className="px-3 py-2 text-center">{row.pre_release + row.ready_to_print + row.ready_to_release + row.ready_to_ship}</td>
                <td className="px-3 py-2 text-center">{row.total_open_orders}</td>
                <td className="px-3 py-2 text-center">{row.total_open_qty}</td>
                <td className="px-3 py-2 text-center">{row.shipped_today}</td>
                <td className="px-3 py-2 text-center">{row.ship_today_units}</td>
                <td className="px-3 py-2 text-center">{row.shipped_others}</td>
                <td className="px-3 py-2 text-center">{row.shipped_units_others}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function InventoryTable() {
    return (
      <div className="overflow-x-auto">
        <div className="flex items-center gap-3 mb-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={invFilters.hasKey} onChange={e => setInvFilters(v => ({ ...v, hasKey: e.target.checked }))} /> Key</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={invFilters.needReorder} onChange={e => setInvFilters(v => ({ ...v, needReorder: e.target.checked }))} /> Reorder</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={invFilters.isShort} onChange={e => setInvFilters(v => ({ ...v, isShort: e.target.checked }))} /> Short</label>
          <Button size="icon" variant="ghost" onClick={refreshAll} title="Refresh"><i className="icon-reload" /></Button>
        </div>
        <table className="min-w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Warehouse</th>
              <th className="px-3 py-2">Item #</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Flags</th>
              <th className="px-3 py-2 text-right">On Hand</th>
              <th className="px-3 py-2 text-right">On Hold</th>
              <th className="px-3 py-2 text-right">Comm</th>
              <th className="px-3 py-2 text-right">Proc</th>
              <th className="px-3 py-2 text-right">FF</th>
              <th className="px-3 py-2 text-right">Net</th>
              <th className="px-3 py-2 text-right">Min</th>
              <th className="px-3 py-2 text-right">DCL</th>
              <th className="px-3 py-2 text-right">WO</th>
              <th className="px-3 py-2 text-right">PO</th>
              <th className="px-3 py-2 text-right">RMA</th>
            </tr>
          </thead>
          <tbody>
            {inventory.slice(0, 10).map((it, idx) => (
              <tr key={idx} className="odd:bg-muted/40">
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3 py-2 text-center font-medium">{it.warehouse}</td>
                <td className="px-3 py-2 font-medium">{it.item_number}</td>
                <td className="px-3 py-2">{it.description}</td>
                <td className="px-3 py-2 text-center">{it.flags}</td>
                <td className="px-3 py-2 text-right">{it.qty_onhand}</td>
                <td className="px-3 py-2 text-right">{it.qty_onhold}</td>
                <td className="px-3 py-2 text-right">{it.qty_committed}</td>
                <td className="px-3 py-2 text-right">{it.qty_inproc}</td>
                <td className="px-3 py-2 text-right">{it.qty_onff}</td>
                <td className="px-3 py-2 text-right font-semibold">{it.qty_net}</td>
                <td className="px-3 py-2 text-right">{it.qty_min}</td>
                <td className="px-3 py-2 text-right">{it.qty_dcl}</td>
                <td className="px-3 py-2 text-right">{it.qty_openwo}</td>
                <td className="px-3 py-2 text-right">{it.qty_openpo}</td>
                <td className="px-3 py-2 text-right">{it.qty_openrma}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function LatestOrders() {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="btn-group">
            <Button variant={ordersTab === 'received' ? 'default' : 'outline'} size="sm" onClick={() => setOrdersTab('received')}>Received</Button>
            <Button variant={ordersTab === 'shipped' ? 'default' : 'outline'} size="sm" onClick={() => setOrdersTab('shipped')}>Shipped</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2 text-left">Order #</th>
                <th className="px-3 py-2">Received</th>
                <th className="px-3 py-2">Order Stage</th>
                <th className="px-3 py-2 text-left">Ship To</th>
                <th className="px-3 py-2">Shipped</th>
                <th className="px-3 py-2">Carrier</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((o, idx) => (
                <tr key={idx} className="odd:bg-muted/40">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium">{o.order_number}</td>
                  <td className="px-3 py-2">{o.received || ''}</td>
                  <td className="px-3 py-2">{o.stage_description || o.order_stage}</td>
                  <td className="px-3 py-2">{o.ship_to}<br/><span className="text-xs text-muted-foreground">{o.ship_address}</span></td>
                  <td className="px-3 py-2">{o.shipped || ''}</td>
                  <td className="px-3 py-2">{o.carrier} {o.service}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!layout) return null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Overview</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => router.push('/overview/customize')}>
            <IconWand className="w-4 h-4 mr-2" /> Customize
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="default" disabled={isRefreshing}>
                {isRefreshing ? 'Refreshing…' : 'Refresh'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={refreshAll}>Refresh Now</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={isSavingLayout} onClick={onSaveLayout}>{isSavingLayout ? 'Saving…' : 'Save Layout'}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Counters */}
      {layout.areas.find(a => a.name === 'tiles')?.visible && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {visibleTiles.map(t => (
            <div key={t}>{renderTile(t)}</div>
          ))}
        </div>
      )}

      {/* Fulfillment */}
      {layout.areas.find(a => a.name === 'fulfillment')?.visible && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Fulfillment</CardTitle></CardHeader>
          <CardContent><FulfillmentTable /></CardContent>
        </Card>
      )}

      {/* 30 Days Activity */}
      {layout.areas.find(a => a.name === '30days')?.visible && (
        <Card className="mt-6">
          <CardHeader><CardTitle>30 Days Activity</CardTitle></CardHeader>
          <CardContent><Chart30Days /></CardContent>
        </Card>
      )}

      {/* Inventory */}
      {layout.areas.find(a => a.name === 'inventory')?.visible && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
          <CardContent><InventoryTable /></CardContent>
        </Card>
      )}

      {/* Latest 50 Orders */}
      {layout.areas.find(a => a.name === '50orders')?.visible && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Latest 50 Orders</CardTitle></CardHeader>
          <CardContent><LatestOrders /></CardContent>
        </Card>
      )}

      {/* 30 Days RMA Activity */}
      {layout.areas.find(a => a.name === '30days_rmas')?.visible && (
        <Card className="mt-6 mb-10">
          <CardHeader><CardTitle>30 Days RMA Activity</CardTitle></CardHeader>
          <CardContent><ChartRma30Days /></CardContent>
        </Card>
      )}
    </div>
  );
}


