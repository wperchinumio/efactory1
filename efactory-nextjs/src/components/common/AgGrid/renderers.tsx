import React from 'react';

export function DateRenderer({ value }: { value: any }) {
  if (!value) return <span />;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return <span />;
  return <span>{d.toISOString().slice(0, 10)}</span>;
}

export function DateTimeRenderer({ value }: { value: any }) {
  if (!value) return <span />;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return <span />;
  const iso = d.toISOString().replace('T', ' ').slice(0, 19);
  return <span>{iso}</span>;
}

export function NumberRenderer({ value, decimals = 0, strong = false, dimZero = false, hideNull = false }: { value: any; decimals?: number; strong?: boolean; dimZero?: boolean; hideNull?: boolean }) {
  if (hideNull && (value === null || value === undefined)) return <span />;
  const num = Number(value ?? 0);
  const formatted = num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const cls = [strong ? 'font-semibold' : '', dimZero && num === 0 ? 'opacity-60' : ''].join(' ');
  return <span className={cls.trim()}>{formatted}</span>;
}

export function PrimaryLinkRenderer({ value }: { value: any }) {
  if (!value) return <span />;
  return <a className="text-primary" href="#">{String(value)}</a>;
}

// Map order type to a color class similar to legacy
export function getOrderTypePillClass(orderType?: string): string {
  switch ((orderType || '').toUpperCase()) {
    case 'EDE':
      return 'bg-purple-600 text-white';
    case 'EDI':
      return 'bg-red-500 text-white';
    case 'REST':
    case 'SOAP':
    case 'RTRE':
    case 'RTSO':
      return 'bg-neutral-800 text-white';
    case 'AMZN':
    case 'BIGP':
    case 'CHAD':
    case 'MAGP':
    case 'MAGS':
    case 'SHOP':
    case 'SHST':
    case 'STLS':
    case 'WOOP':
      return 'bg-blue-600 text-white';
    case 'OPEF':
    case 'RTEF':
      return 'bg-emerald-600 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

export function OrderTypePill({ orderType }: { orderType?: string }) {
  const cls = getOrderTypePillClass(orderType);
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${cls}`}>
      {orderType || ''}
    </span>
  );
}

// Legacy-like order stage: color-coded bar with label (kept as originally implemented)
export function OrderStageRenderer({ value, data }: { value: number; data?: any }) {
  const stage = Number(value || 0);
  const label: string = data?.stage_description || '';
  const colorMap = {
    dark: '#111827',            // dark
    redThunderbird: '#D91E18',  // thunderbird
    red: '#EF4444',
    yellowGold: '#E87E04',
    yellowHaze: '#c5bf66',
    yellowMint: '#c5b96b',
    greenSoft: '#3faba4',
  } as const;
  let barColor: string = colorMap.yellowGold;
  if (stage === 2) barColor = colorMap.dark;
  else if (stage > 2 && stage < 10) barColor = colorMap.redThunderbird;
  else if (stage === 10) barColor = colorMap.red;
  else if (stage === 20) barColor = colorMap.yellowGold;
  else if (stage === 40) barColor = colorMap.yellowHaze;
  else if (stage > 40 && stage < 60) barColor = colorMap.yellowMint;
  else if (stage >= 60) barColor = colorMap.greenSoft;

  const percent = Math.min(stage >= 60 ? 62 : stage, 62) / 62 * 100;
  return (
    <div className="flex flex-col gap-1" style={{ width: '100%' }}>
      <div className="flex items-center justify-between" style={{ width: '100%' }}>
        <span className="text-[12px] text-[var(--font-color)]">{isNaN(stage) ? '' : stage}</span>
        <span className="text-[11px] text-[var(--font-color-100)]">{label}</span>
      </div>
      <div style={{ width: '100%', height: 8, background: '#d0d0d0', borderRadius: 2, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${percent}%`, background: barColor, borderRadius: 2 }} />
      </div>
    </div>
  );
}

export function OrderStatusRenderer({ value }: { value: any }) {
  const status = Number(value);
  const label = status === 0 ? 'On Hold' : status === 1 ? 'Normal' : status === 2 ? 'Rush' : 'Unknown';
  const cls = status === 0 ? 'text-red-500 font-semibold' : status === 2 ? 'text-purple-600 font-semibold' : '';
  return <span className={cls}>{label}</span>;
}

export function ShipToRenderer({ data }: { data: any }) {
  const shipping = data?.shipping_address || {};
  const line1 = `${shipping.company || ''}${shipping.company && shipping.attention ? ' | ' : ''}${shipping.attention || ''}`;
  const line2 = `${shipping.city || ''}, ${shipping.state_province || ''} ${shipping.postal_code || ''} - ${shipping.country || ''}`;
  return (
    <div className="leading-tight">
      <div className="text-primary italic">{line1.trim()}</div>
      <div className="text-xs text-muted">{line2.trim()}</div>
    </div>
  );
}

export function CarrierRenderer({ data }: { data: any }) {
  const carrier = data?.shipping_carrier || '';
  const service = data?.shipping_service || '';
  const tr = data?.tr || '';
  const trl = data?.trl || '';
  return (
    <span className="leading-tight text-[14px]">
      <span className="font-semibold">{carrier}</span> - <span>{service}</span>
      <br />
      {trl ? (
        <a href={trl} target="_blank" rel="noreferrer" className="text-primary text-[14px]">{tr}</a>
      ) : (
        <span className="text-primary font-semibold text-[14px]">{tr}</span>
      )}
    </span>
  );
}

export function TrackingRenderer({ data, field }: { data: any; field: string }) {
  if (field !== 'trl') return <span>Unknown</span>;
  const trl = data?.trl;
  const tr = data?.tr;
  if (trl) {
    return (
      <span className="text-primary font-semibold">
        <a href={trl} target="_blank" rel="noreferrer">{tr}</a>
      </span>
    );
  }
  return <span className="text-primary font-semibold">{tr}</span>;
}