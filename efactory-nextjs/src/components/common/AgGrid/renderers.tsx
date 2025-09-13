import React from 'react';

export function NumberRenderer({ value }: { value: any }) {
  if (value === null || value === undefined) return null;
  return <span>{Number(value).toLocaleString()}</span>;
}

export function DateRenderer({ value }: { value: any }) {
  if (!value) return null;
  const d = new Date(value);
  return <span>{isNaN(d.getTime()) ? '' : d.toLocaleDateString()}</span>;
}

export function PrimaryLinkRenderer({ value }: { value: any }) {
  return <span className="text-primary font-semibold">{value ?? ''}</span>;
}

// Map legacy order type to color class
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
      return 'bg-emerald-600 text-white'; // legacy green-haze
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

// Order Stage renderer (bar + label) matching legacy colors
export function getOrderStageBarClass(stage?: number): string {
  const s = Number(stage ?? 0);
  if (s === 2) return 'bg-neutral-800'; // dark
  if (s > 2 && s < 10) return 'bg-red-700'; // red-thunderbird
  if (s === 10) return 'bg-red-500'; // red
  if (s === 20) return 'bg-yellow-500'; // yellow-gold
  if (s === 40) return 'bg-yellow-400'; // yellow-haze
  if (s > 40 && s < 60) return 'bg-yellow-300'; // yellow-mint
  if (s >= 60) return 'bg-green-400'; // green-soft
  return 'bg-yellow-500';
}

export function OrderStageRenderer({ value, data }: { value: number; data?: any }) {
  const stage = Number(value || 0);
  const label: string = data?.stage_description || '';
  // Legacy hex colors
  const colorMap = {
    dark: '#111827',            // approx for "dark"
    redThunderbird: '#D91E18',  // red-thunderbird
    red: '#EF4444',             // fallback red
    yellowGold: '#E87E04',      // yellow-gold
    yellowHaze: '#c5bf66',      // yellow-haze
    yellowMint: '#c5b96b',      // yellow-mint
    greenSoft: '#3faba4',       // green-soft
  } as const;
  let barColor = colorMap.yellowGold;
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


