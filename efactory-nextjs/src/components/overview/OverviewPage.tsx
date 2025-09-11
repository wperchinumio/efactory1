import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { IconShoppingCart, IconTruck, IconAlertTriangle, IconTags, IconClipboardList, IconPackage, IconBox, IconWand, IconRefresh } from '@tabler/icons-react';
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { useChartTheme } from '@/hooks/useChartTheme';
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

  // Chart theme and animation hooks
  const { echartsThemeName } = useChartTheme();
  const { triggerDataLoadAnimation, getAnimationSettings } = useChartAnimation();

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
      // Trigger chart animations after data load
      triggerDataLoadAnimation();
    } finally {
      setIsRefreshing(false);
    }
  }, [invFilters, ordersTab, triggerDataLoadAnimation]);

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
      if (!it) return acc;
      Object.keys(acc).forEach(k => {
        const v = (it as any)[k];
        if (typeof v === 'number' && !isNaN(v)) {
          acc[k] = (acc[k] || 0) + v;
        }
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
    const v = variantMap[variant] || variantMap.primary;
    if (!v) return null;
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
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.orders_today || 0)}</div><div className="text-[11px] text-white/80">Orders</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.recv_today_lines || 0)}</div><div className="text-[11px] text-white/80">Lines</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.recv_today_units || 0)}</div><div className="text-[11px] text-white/80">Units</div></div>
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
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.shipped_today || 0)}</div><div className="text-[11px] text-white/80">Orders</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.ship_today_lines || 0)}</div><div className="text-[11px] text-white/80">Lines</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.ship_today_units || 0)}</div><div className="text-[11px] text-white/80">Units</div></div>
            </div>
          </div>
        );
      case 'back_orders':
        return <CounterTile title="Backorders (orders)" value={totals.back_orders || 0} variant="warning" icon={<IconAlertTriangle className="w-[14px] h-[14px]" />} />;
      case 'open_rma':
        return <CounterTile title="Open RMAs" value={totals.open_rmas || 0} variant="amber" icon={<IconTags className="w-[14px] h-[14px]" />} />;
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
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.total_open_orders || 0)}</div><div className="text-[11px] text-white/80">Orders</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.total_open_lines || 0)}</div><div className="text-[11px] text-white/80">Lines</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.total_open_qty || 0)}</div><div className="text-[11px] text-white/80">Units</div></div>
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
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.total_back_orders || 0)}</div><div className="text-[11px] text-white/80">Orders</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.total_back_lines || 0)}</div><div className="text-[11px] text-white/80">Lines</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.back_qty || 0)}</div><div className="text-[11px] text-white/80">Units</div></div>
            </div>
          </div>
        );
      case 'multi_subtotal':
        return <CounterTile title="Order Value Open ($)" value={totals.subtotal_open || 0} variant="primary" icon={<IconClipboardList className="w-[14px] h-[14px]" />} />;
      case 'multi_sh':
        return <CounterTile title="Order S & H ($) Open" value={totals.sh_open || 0} variant="red" icon={<IconPackage className="w-[14px] h-[14px]" />} />;
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
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.issued_rmas_today || 0)}</div><div className="text-[11px] text-white/80">Authorized</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.received_rmas_today || 0)}</div><div className="text-[11px] text-white/80">Received</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.open_rmas || 0)}</div><div className="text-[11px] text-white/80">Total Open</div></div>
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
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.rma_units_auth || 0)}</div><div className="text-[11px] text-white/80">Authorized</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.rma_units_recv || 0)}</div><div className="text-[11px] text-white/80">Received</div></div>
              <div className="flex-1 text-center px-2"><div className="text-white text-lg md:text-xl font-bold leading-6">{Intl.NumberFormat().format(totals.rma_units_open || 0)}</div><div className="text-[11px] text-white/80">Total Open</div></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  function Chart30Days() {
    const option = useMemo(() => {
      if (!activity?.length) return {};
      
      return {
        ...getAnimationSettings(),
        tooltip: { 
          trigger: 'axis', 
          axisPointer: { type: 'shadow' }
        },
        legend: { 
          data: ['Received', 'Shipped'], 
          top: 0
        },
        grid: { 
          left: '3%', 
          right: '4%', 
          bottom: '15%', 
          top: '15%', 
          containLabel: true 
        },
        xAxis: {
          type: 'category',
          data: activity.map(p => new Date(p.date).getDate()),
          name: 'Day of Month',
          nameLocation: 'middle',
          nameGap: 30,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'Orders',
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(128, 128, 128, 0.3)'],
              type: 'solid'
            }
          }
        },
        series: [
          { 
            name: 'Received', 
            type: 'bar', 
            stack: 'orders', 
            data: activity.map(p => p.received || null),
            emphasis: { focus: 'series' },
            label: {
              show: true,
              position: 'inside',
              formatter: (params: any) => params.value > 0 ? params.value : ''
            }
          },
          { 
            name: 'Shipped', 
            type: 'bar', 
            stack: 'orders', 
            data: activity.map(p => p.shipped || null),
            emphasis: { focus: 'series' },
            label: {
              show: true,
              position: 'inside',
              formatter: (params: any) => params.value > 0 ? params.value : ''
            }
          }
        ],
      };
    }, [activity, getAnimationSettings]);
    
    return (
      <ReactECharts 
        style={{ height: 280 }} 
        option={option} 
        theme={echartsThemeName}
        key={`activity-chart-${echartsThemeName}`}
        opts={{ renderer: 'canvas' }}
      />
    );
  }

  function ChartRma30Days() {
    const option = useMemo(() => {
      if (!rmaActivity?.length) return {};
      
      return {
        ...getAnimationSettings(),
        tooltip: { 
          trigger: 'axis', 
          axisPointer: { type: 'shadow' }
        },
        legend: { 
          data: ['Authorized', 'Closed'], 
          top: 0
        },
        grid: { 
          left: '3%', 
          right: '4%', 
          bottom: '15%', 
          top: '15%', 
          containLabel: true 
        },
        xAxis: {
          type: 'category',
          data: rmaActivity.map(p => new Date(p.date).getDate()),
          name: 'Day of Month',
          nameLocation: 'middle',
          nameGap: 30,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'RMAs',
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(128, 128, 128, 0.3)'],
              type: 'solid'
            }
          }
        },
        series: [
          { 
            name: 'Authorized', 
            type: 'bar', 
            stack: 'rma', 
            data: rmaActivity.map(p => p.issued || null),
            emphasis: { focus: 'series' },
            label: {
              show: true,
              position: 'inside',
              formatter: (params: any) => params.value > 0 ? params.value : ''
            }
          },
          { 
            name: 'Closed', 
            type: 'bar', 
            stack: 'rma', 
            data: rmaActivity.map(p => p.closed || null),
            emphasis: { focus: 'series' },
            label: {
              show: true,
              position: 'inside',
              formatter: (params: any) => params.value > 0 ? params.value : ''
            }
          }
        ],
      };
    }, [rmaActivity, getAnimationSettings]);
    
    return (
      <ReactECharts 
        style={{ height: 300 }} 
        option={option} 
        theme={echartsThemeName}
        key={`rma-chart-${echartsThemeName}`}
        opts={{ renderer: 'canvas' }}
      />
    );
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

    // Calculate totals for the summary row
    const fulfillmentTotals = useMemo(() => {
      return visibleFulfillments.reduce((acc, row) => ({
        orders_today: acc.orders_today + (row.orders_today || 0),
        back_orders: acc.back_orders + (row.back_orders || 0),
        ff_hold: acc.ff_hold + (row.ff_hold || 0),
        in_process: acc.in_process + ((row.pre_release || 0) + (row.ready_to_print || 0) + (row.ready_to_release || 0) + (row.ready_to_ship || 0)),
        total_open_orders: acc.total_open_orders + (row.total_open_orders || 0),
        total_open_qty: acc.total_open_qty + (row.total_open_qty || 0),
        shipped_today: acc.shipped_today + (row.shipped_today || 0),
        ship_today_units: acc.ship_today_units + (row.ship_today_units || 0),
        shipped_others: acc.shipped_others + (row.shipped_others || 0),
        shipped_units_others: acc.shipped_units_others + (row.shipped_units_others || 0),
      }), {
        orders_today: 0,
        back_orders: 0,
        ff_hold: 0,
        in_process: 0,
        total_open_orders: 0,
        total_open_qty: 0,
        shipped_today: 0,
        ship_today_units: 0,
        shipped_others: 0,
        shipped_units_others: 0,
      });
    }, [visibleFulfillments]);

    function formatNumber(num: number): string {
      return Intl.NumberFormat().format(num || 0);
    }

    function ClickableCell({ value, className = "" }: { value: number; className?: string }) {
      return (
        <button 
          className={`text-primary hover:text-primary-600 font-semibold transition-colors duration-200 hover:underline ${className}`}
          onClick={() => {
            // TODO: Add navigation logic here
            console.log('Navigate to filtered view with value:', value);
          }}
        >
          {formatNumber(value)}
        </button>
      );
    }

    return (
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-font-color-100">Hide zero qty</span>
            <button
              className={`inline-flex items-center h-6 w-11 rounded-full transition-all duration-300 ${hideZeroQty ? 'bg-primary shadow-lg' : 'bg-border-color'} shadow-inner`}
              onClick={() => setHideZeroQty(v => !v)}
              aria-label="Hide zero quantity"
            >
              <span className={`inline-block h-5 w-5 bg-card-color rounded-full transform transition-transform duration-300 shadow-md ${hideZeroQty ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div>
            <Button size="sm" variant="outline" onClick={() => fetchFulfillments().then(setFulfillments)} title="Refresh Fulfillment" className="hover:bg-primary/10">
              <IconRefresh className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="bg-card-color border border-border-color rounded-xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-primary-10 border-b border-border-color">
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-font-color uppercase text-xs">ACCOUNT #</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">GROUP</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">WAREHOUSE</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">ORDERS TODAY</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">BACK ORDERS</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">HOLD</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">IN PROCESS</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">TOTAL OPEN</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">TOTAL OPEN UNITS</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">SHIPPED TODAY</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">SHIPPED TODAY UNITS</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">OTHERS</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">OTHERS UNITS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {visibleFulfillments.map((row, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-primary-5 transition-colors duration-200"
                >
                  <td className="px-4 py-3 font-bold text-font-color">{row.account_number}</td>
                  <td className="px-4 py-3 text-center font-semibold text-font-color-100">{row.group}</td>
                  <td className="px-4 py-3 text-center font-semibold text-font-color-100">{row.region}</td>
                  <td className="px-4 py-3 text-center">
                    <ClickableCell value={row.orders_today || 0} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ClickableCell value={row.back_orders || 0} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ClickableCell value={row.ff_hold || 0} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-font-color-100">
                      {formatNumber((row.pre_release || 0) + (row.ready_to_print || 0) + (row.ready_to_release || 0) + (row.ready_to_ship || 0))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ClickableCell value={row.total_open_orders || 0} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ClickableCell value={row.total_open_qty || 0} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ClickableCell value={row.shipped_today || 0} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ClickableCell value={row.ship_today_units || 0} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-font-color-100">{formatNumber(row.shipped_others || 0)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-font-color-100">{formatNumber(row.shipped_units_others || 0)}</span>
                  </td>
                </tr>
              ))}
              
              {/* Totals Row - Only show if there are multiple fulfillments */}
              {visibleFulfillments.length > 1 && (
                <tr className="bg-primary-20 border-t border-border-color font-bold">
                  <td className="px-4 py-3 font-bold text-font-color"></td>
                  <td className="px-4 py-3 text-center font-bold text-font-color"></td>
                  <td className="px-4 py-3 text-center font-bold text-font-color"></td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-primary hover:text-primary-600 font-bold transition-colors duration-200 hover:underline">
                      {formatNumber(fulfillmentTotals.orders_today)}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-primary hover:text-primary-600 font-bold transition-colors duration-200 hover:underline">
                      {formatNumber(fulfillmentTotals.back_orders)}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-primary hover:text-primary-600 font-bold transition-colors duration-200 hover:underline">
                      {formatNumber(fulfillmentTotals.ff_hold)}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-font-color">
                    {formatNumber(fulfillmentTotals.in_process)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-primary hover:text-primary-600 font-bold transition-colors duration-200 hover:underline">
                      {formatNumber(fulfillmentTotals.total_open_orders)}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-primary hover:text-primary-600 font-bold transition-colors duration-200 hover:underline">
                      {formatNumber(fulfillmentTotals.total_open_qty)}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-primary hover:text-primary-600 font-bold transition-colors duration-200 hover:underline">
                      {formatNumber(fulfillmentTotals.shipped_today)}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-primary hover:text-primary-600 font-bold transition-colors duration-200 hover:underline">
                      {formatNumber(fulfillmentTotals.ship_today_units)}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-font-color">
                    {formatNumber(fulfillmentTotals.shipped_others)}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-font-color">
                    {formatNumber(fulfillmentTotals.shipped_units_others)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function InventoryTable() {
    return (
      <div>
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="hasKey"
                checked={invFilters.hasKey} 
                onCheckedChange={(checked) => setInvFilters(v => ({ ...v, hasKey: !!checked }))} 
              />
              <label htmlFor="hasKey" className="text-sm font-medium text-font-color-100 cursor-pointer">Key</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="needReorder"
                checked={invFilters.needReorder} 
                onCheckedChange={(checked) => setInvFilters(v => ({ ...v, needReorder: !!checked }))} 
              />
              <label htmlFor="needReorder" className="text-sm font-medium text-font-color-100 cursor-pointer">Reorder</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="isShort"
                checked={invFilters.isShort} 
                onCheckedChange={(checked) => setInvFilters(v => ({ ...v, isShort: !!checked }))} 
              />
              <label htmlFor="isShort" className="text-sm font-medium text-font-color-100 cursor-pointer">Short</label>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={refreshAll} title="Refresh Inventory">
            <IconRefresh className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="bg-card-color border border-border-color rounded-xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-primary-10 border-b border-border-color">
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-font-color uppercase text-xs">#</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">Warehouse</th>
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-font-color uppercase text-xs">Item #</th>
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-font-color uppercase text-xs">Description</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">Flags</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">On Hand</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">On Hold</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">Comm</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">Proc</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">FF</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">Net</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">Min</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">DCL</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">WO</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">PO</th>
                <th className="px-4 py-3 text-right font-semibold tracking-wide text-font-color uppercase text-xs">RMA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {inventory.slice(0, 10).map((it, idx) => (
                <tr key={idx} className="hover:bg-primary-5 transition-colors duration-200">
                  <td className="px-4 py-3 text-font-color-100">{idx + 1}</td>
                  <td className="px-4 py-3 text-center font-bold text-font-color">{it.warehouse}</td>
                  <td className="px-4 py-3 font-bold text-font-color">
                    <button className="text-primary hover:text-primary-600 font-bold transition-colors duration-200 hover:underline">
                      {it.item_number}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-font-color-100">{it.description}</td>
                  <td className="px-4 py-3 text-center">
                    {it.flags && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-10 text-warning">
                        {it.flags}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-font-color">{it.qty_onhand || 0}</td>
                  <td className="px-4 py-3 text-right text-font-color-100">{it.qty_onhold || 0}</td>
                  <td className="px-4 py-3 text-right text-font-color-100">{it.qty_committed || 0}</td>
                  <td className="px-4 py-3 text-right text-font-color-100">{it.qty_inproc || 0}</td>
                  <td className="px-4 py-3 text-right text-font-color-100">{it.qty_onff || 0}</td>
                  <td className="px-4 py-3 text-right font-bold text-primary">{it.qty_net || 0}</td>
                  <td className="px-4 py-3 text-right text-font-color-100">{it.qty_min || 0}</td>
                  <td className="px-4 py-3 text-right text-font-color-100">{it.qty_dcl || 0}</td>
                  <td className="px-4 py-3 text-right text-font-color-100">{it.qty_openwo || 0}</td>
                  <td className="px-4 py-3 text-right text-font-color-100">{it.qty_openpo || 0}</td>
                  <td className="px-4 py-3 text-right text-font-color-100">{it.qty_openrma || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function LatestOrders() {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex border border-border-color rounded-lg overflow-hidden">
            <button
              onClick={() => setOrdersTab('received')}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                ordersTab === 'received' 
                  ? 'bg-primary text-white' 
                  : 'bg-card-color text-font-color-100 hover:bg-primary-10'
              }`}
            >
              Received
            </button>
            <div className="w-px h-6 bg-border-color opacity-50 self-center"></div>
            <button
              onClick={() => setOrdersTab('shipped')}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                ordersTab === 'shipped' 
                  ? 'bg-primary text-white' 
                  : 'bg-card-color text-font-color-100 hover:bg-primary-10'
              }`}
            >
              Shipped
            </button>
          </div>
        </div>
        
        <div className="bg-card-color border border-border-color rounded-xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-primary-10 border-b border-border-color">
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-font-color uppercase text-xs">#</th>
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-font-color uppercase text-xs">Order #</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">Received</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">Order Stage</th>
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-font-color uppercase text-xs">Ship To</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">Shipped</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-font-color uppercase text-xs">Carrier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {orders.slice(0, 10).map((o, idx) => (
                <tr key={idx} className="hover:bg-primary-5 transition-colors duration-200">
                  <td className="px-4 py-3 text-font-color-100">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold text-font-color">
                    <button className="text-primary hover:text-primary-600 font-bold transition-colors duration-200 hover:underline">
                      {o.order_number}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center text-font-color-100">{o.received || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-10 text-primary">
                      {o.stage_description || o.order_stage}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-font-color font-medium">{o.ship_to}</div>
                    <div className="text-xs text-font-color-100 mt-1">{o.ship_address}</div>
                  </td>
                  <td className="px-4 py-3 text-center text-font-color-100">{o.shipped || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-font-color-100">
                      <div className="font-medium">{o.carrier}</div>
                      {o.service && <div className="text-xs">{o.service}</div>}
                    </div>
                  </td>
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
        <Card className="mt-6 border-border-color">
          <CardHeader><CardTitle>Fulfillment</CardTitle></CardHeader>
          <CardContent><FulfillmentTable /></CardContent>
        </Card>
      )}

      {/* 30 Days Activity */}
      {layout.areas.find(a => a.name === '30days')?.visible && (
        <Card className="mt-6 border-border-color">
          <CardHeader><CardTitle>30 Days Activity</CardTitle></CardHeader>
          <CardContent><Chart30Days /></CardContent>
        </Card>
      )}

      {/* Inventory */}
      {layout.areas.find(a => a.name === 'inventory')?.visible && (
        <Card className="mt-6 border-border-color">
          <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
          <CardContent><InventoryTable /></CardContent>
        </Card>
      )}

      {/* Latest 50 Orders */}
      {layout.areas.find(a => a.name === '50orders')?.visible && (
        <Card className="mt-6 border-border-color">
          <CardHeader><CardTitle>Latest 50 Orders</CardTitle></CardHeader>
          <CardContent><LatestOrders /></CardContent>
        </Card>
      )}

      {/* 30 Days RMA Activity */}
      {layout.areas.find(a => a.name === '30days_rmas')?.visible && (
        <Card className="mt-6 mb-10 border-border-color">
          <CardHeader><CardTitle>30 Days RMA Activity</CardTitle></CardHeader>
          <CardContent><ChartRma30Days /></CardContent>
        </Card>
      )}
    </div>
  );
}


