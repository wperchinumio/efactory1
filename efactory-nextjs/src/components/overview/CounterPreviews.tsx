import React from 'react';
import { IconShoppingCart, IconTruck, IconAlertTriangle, IconTags, IconClipboardList, IconPackage, IconBox } from '@tabler/icons-react';
import type { FulfillmentRowDto, OverviewTileName } from '@/types/api/overview';

interface CounterPreviewProps {
  name: OverviewTileName;
  fulfillments: FulfillmentRowDto[];
}

interface SingleValueCounterProps {
  icon: React.ReactNode;
  value: number;
  title: string;
  colorClass: string;
}

interface MultiValueCounterProps {
  icon: React.ReactNode;
  title: string;
  values: Array<{ value: number; label: string }>;
  colorClass: string;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

function SingleValueCounter({ icon, value, title, colorClass }: SingleValueCounterProps) {
  return (
    <div className={`bg-gradient-to-br ${colorClass} rounded-lg border p-2 min-h-[80px] flex flex-col`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex-1">
          <div className="text-sm font-bold text-white leading-tight">{formatNumber(value)}</div>
          <div className="text-xs text-white/80 leading-tight">{title}</div>
        </div>
        <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
          <div className="text-white text-xs">{icon}</div>
        </div>
      </div>
    </div>
  );
}

function MultiValueCounter({ icon, title, values, colorClass }: MultiValueCounterProps) {
  return (
    <div className={`bg-gradient-to-br ${colorClass} rounded-lg border p-2 min-h-[80px] flex flex-col`}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold text-white/90 uppercase tracking-wide leading-tight">{title}</div>
        <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center">
          <div className="text-white text-xs">{icon}</div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-1 text-center">
        {values.map((item, index) => (
          <div key={index}>
            <div className="text-xs font-bold text-white leading-tight">{formatNumber(item.value)}</div>
            <div className="text-xs text-white/70 leading-tight">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CounterPreview({ name, fulfillments }: CounterPreviewProps) {
  // Calculate totals from fulfillments data
  const totals = React.useMemo(() => {
    return fulfillments.reduce((acc, item) => {
      acc.orders_today += item.orders_today || 0;
      acc.shipped_today += item.shipped_today || 0;
      acc.back_orders += item.back_orders || 0;
      acc.open_rmas += item.open_rmas || 0;
      acc.recv_today_lines += item.recv_today_lines || 0;
      acc.recv_today_units += item.recv_today_units || 0;
      acc.ship_today_lines += item.ship_today_lines || 0;
      acc.ship_today_units += item.ship_today_units || 0;
      acc.issued_rmas_today += item.issued_rmas_today || 0;
      acc.rma_units_auth += item.rma_units_auth || 0;
      acc.total_open_orders += item.total_open_orders || 0;
      acc.total_open_lines += item.total_open_lines || 0;
      acc.total_open_qty += item.total_open_qty || 0;
      acc.total_back_orders += item.total_back_orders || 0;
      acc.total_back_lines += item.total_back_lines || 0;
      acc.back_qty += item.back_qty || 0;
      acc.subtotal_received_today += item.subtotal_received_today || 0;
      acc.subtotal_shipped_today += item.subtotal_shipped_today || 0;
      acc.subtotal_open += item.subtotal_open || 0;
      acc.sh_received_today += item.sh_received_today || 0;
      acc.sh_shipped_today += item.sh_shipped_today || 0;
      acc.sh_open += item.sh_open || 0;
      return acc;
    }, {
      orders_today: 0,
      shipped_today: 0,
      back_orders: 0,
      open_rmas: 0,
      recv_today_lines: 0,
      recv_today_units: 0,
      ship_today_lines: 0,
      ship_today_units: 0,
      issued_rmas_today: 0,
      rma_units_auth: 0,
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
    });
  }, [fulfillments]);

  switch (name) {
    case 'orders_received_today':
      return (
        <SingleValueCounter
          icon={<IconShoppingCart className="w-4 h-4" />}
          value={totals.orders_today}
          title="Orders Received Today"
          colorClass="from-primary to-primary-10 border-primary"
        />
      );

    case 'orders_shipped_today':
      return (
        <SingleValueCounter
          icon={<IconTruck className="w-4 h-4" />}
          value={totals.shipped_today}
          title="Orders Shipped Today"
          colorClass="from-success to-success-10 border-success"
        />
      );

    case 'back_orders':
      return (
        <SingleValueCounter
          icon={<IconAlertTriangle className="w-4 h-4" />}
          value={totals.back_orders}
          title="Back Orders"
          colorClass="from-rose-500 to-rose-200 border-rose-500"
        />
      );

    case 'open_rma':
      return (
        <SingleValueCounter
          icon={<IconTags className="w-4 h-4" />}
          value={totals.open_rmas}
          title="Open RMAs"
          colorClass="from-warning to-warning-10 border-warning"
        />
      );

    case 'multi_received_today':
      return (
        <MultiValueCounter
          icon={<IconShoppingCart className="w-4 h-4" />}
          title="Received Today"
          values={[
            { value: totals.orders_today, label: 'Orders' },
            { value: totals.recv_today_lines, label: 'Lines' },
            { value: totals.recv_today_units, label: 'Units' },
          ]}
          colorClass="from-primary to-primary-10 border-primary"
        />
      );

    case 'multi_shipped_today':
      return (
        <MultiValueCounter
          icon={<IconTruck className="w-4 h-4" />}
          title="Shipped Today"
          values={[
            { value: totals.shipped_today, label: 'Orders' },
            { value: totals.ship_today_lines, label: 'Lines' },
            { value: totals.ship_today_units, label: 'Units' },
          ]}
          colorClass="from-success to-success-10 border-success"
        />
      );

    case 'multi_rmas_today':
      return (
        <MultiValueCounter
          icon={<IconTags className="w-4 h-4" />}
          title="RMAs Today"
          values={[
            { value: totals.issued_rmas_today, label: 'Issued' },
            { value: 0, label: 'Received' },
            { value: totals.rma_units_auth, label: 'Units' },
          ]}
          colorClass="from-warning to-warning-10 border-warning"
        />
      );

    case 'multi_rma_units_today':
      return (
        <MultiValueCounter
          icon={<IconBox className="w-4 h-4" />}
          title="RMA Units Today"
          values={[
            { value: totals.rma_units_auth, label: 'Auth' },
            { value: 0, label: 'Recv' },
            { value: 0, label: 'Open' },
          ]}
          colorClass="from-amber-500 to-amber-200 border-amber-500"
        />
      );

    case 'multi_open_orders':
      return (
        <MultiValueCounter
          icon={<IconClipboardList className="w-4 h-4" />}
          title="Open Orders"
          values={[
            { value: totals.total_open_orders, label: 'Orders' },
            { value: totals.total_open_lines, label: 'Lines' },
            { value: totals.total_open_qty, label: 'Qty' },
          ]}
          colorClass="from-info to-info-10 border-info"
        />
      );

    case 'multi_backorders':
      return (
        <MultiValueCounter
          icon={<IconAlertTriangle className="w-4 h-4" />}
          title="Backorders"
          values={[
            { value: totals.total_back_orders, label: 'Orders' },
            { value: totals.total_back_lines, label: 'Lines' },
            { value: totals.back_qty, label: 'Qty' },
          ]}
          colorClass="from-purple-500 to-purple-200 border-purple-500"
        />
      );

    case 'multi_subtotal':
      return (
        <MultiValueCounter
          icon={<IconPackage className="w-4 h-4" />}
          title="Subtotal"
          values={[
            { value: totals.subtotal_received_today, label: 'Received' },
            { value: totals.subtotal_shipped_today, label: 'Shipped' },
            { value: totals.subtotal_open, label: 'Open' },
          ]}
          colorClass="from-slate-500 to-slate-200 border-slate-500"
        />
      );

    case 'multi_sh':
      return (
        <MultiValueCounter
          icon={<IconTruck className="w-4 h-4" />}
          title="S&H"
          values={[
            { value: totals.sh_received_today, label: 'Received' },
            { value: totals.sh_shipped_today, label: 'Shipped' },
            { value: totals.sh_open, label: 'Open' },
          ]}
          colorClass="from-rose-500 to-rose-200 border-rose-500"
        />
      );

    default:
      return (
        <div className="rounded-lg border border-border-color bg-card-color p-4">
          <div className="text-sm text-font-color-100">{name}</div>
        </div>
      );
  }
}
