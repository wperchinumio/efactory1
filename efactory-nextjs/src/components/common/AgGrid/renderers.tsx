import React from 'react';
import { useRouter } from 'next/router';
import { downloadFtpAck, downloadFtpBatch } from '@/services/api';

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
  return <span className={cls.trim()} style={{ display: 'inline-block', minWidth: 0 }}>{formatted}</span>;
}

export function PrimaryLinkRenderer({ value, data, field }: { value: any; data?: any; field?: string }) {
  const router = useRouter();
  if (!value) return <span />;
  const f = (field || '').toLowerCase();
  let orderNum: string | undefined;
  let accountNum: string | undefined;
  if (f === 'order_number') {
    orderNum = data?.order_number;
    accountNum = data?.account_number;
  } else if (f === 'original_order_number') {
    orderNum = data?.original_order_number;
    accountNum = data?.original_account_number;
  } else if (f === 'replacement_order_number') {
    orderNum = data?.replacement_order_number;
    accountNum = data?.shipping_account_number;
  } else {
    orderNum = String(value);
    accountNum = data?.account_number;
  }
  const base = typeof window !== 'undefined' ? window.location.pathname : router.pathname;
  const url = `${base}?orderNum=${encodeURIComponent(orderNum || String(value))}` + (accountNum ? `&accountNum=${encodeURIComponent(accountNum)}` : '');
  const onClick = (e: React.MouseEvent) => {
    // Do not stop propagation so the grid row click can capture rows for navigation context
    e.preventDefault();
    router.push(url);
  };
  return <a className="text-primary hover:underline font-semibold" style={{ display: 'inline-block', minWidth: 0 }} href={url} onClick={onClick}>{String(value)}</a>;
}

export function RmaLinkRenderer({ value, data }: { value: any; data?: any }) {
  const router = useRouter();
  if (!value) return <span />;
  const rmaNum = String(value);
  const accountNum = data?.account_number;
  const base = typeof window !== 'undefined' ? window.location.pathname : router.pathname;
  const url = `${base}?rmaNum=${encodeURIComponent(rmaNum)}` + (accountNum ? `&accountNum=${encodeURIComponent(accountNum)}` : '');
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(url);
  };
  return <a className="text-primary hover:underline font-semibold" href={url} onClick={onClick}>{String(value)}</a>;
}

export function StrongTextRenderer({ value }: { value: any }) {
  if (value === null || value === undefined) return <span />;
  return <strong>{String(value)}</strong>;
}

export function PrimaryEmphasisRenderer({ value }: { value: any }) {
  if (value === null || value === undefined) return <span />;
  return <span className="text-primary font-semibold">{String(value)}</span>;
}

export function WarningTextRenderer({ value }: { value: any }) {
  if (value === null || value === undefined) return <span />;
  return <span className="font-semibold" style={{ color: '#c11515' }}>{String(value)}</span>;
}

export function BoolRenderer({ value }: { value: any }) {
  return <span>{value ? '1' : '0'}</span>;
}

export function RmaTypeRenderer({ value }: { value: any }) {
  return <span>{String(value || '')}</span>;
}

export function BundleTypeRenderer({ value }: { value: any }) {
  const v = Number(value);
  const text = v === 1 ? 'Assembled' : v === 2 ? 'Bundled' : v === 9 ? 'Expired' : 'Configured';
  return <span>{text}</span>;
}

export function BundlePLRenderer({ value }: { value: any }) {
  const v = Number(value);
  return <span>{v === 0 ? '' : 'Print'}</span>;
}

// Generic filter link renderer: bold number formatted; clicking appends simple query params (qf_field/qf_value)
export function FilterLinkNumberRenderer({ value, field, decimals = 0 }: { value: any; field: string; decimals?: number }) {
  const router = useRouter();
  const num = Number(value ?? 0);
  const formatted = num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const base = typeof window !== 'undefined' ? window.location.pathname : router.pathname;
  const url = `${base}?qf_field=${encodeURIComponent(field)}&qf_value=${encodeURIComponent(String(value ?? ''))}`;
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(url);
  };
  return (
    <a href={url} onClick={onClick} className="text-primary font-semibold" style={{ display: 'inline-block', minWidth: 0 }}>
      {formatted}
    </a>
  );
}

// Item link: EXACT same pattern as orders, but with ?itemNum
export function ItemLinkRenderer({ value, data, field = 'item_number' }: { value: any; data?: any; field?: string }) {
  const router = useRouter();
  const item = String(value ?? (data ? data[field] : '') ?? '');
  if (!item) return <span />;
  const base = typeof window !== 'undefined' ? window.location.pathname : router.pathname;
  const url = `${base}?itemNum=${encodeURIComponent(item)}`;
  const onClick = (e: React.MouseEvent) => {
    // Mirror order renderer behavior: allow row click to capture navigation list
    e.preventDefault();
    router.push(url);
  };
  return <a href={url} onClick={onClick} className="text-primary font-semibold" style={{ display: 'inline-block', minWidth: 0 }}>{item}</a>;
}

// Bundle link: similar filter-link UX by bundle item number if present
export function BundleLinkRenderer({ value, data }: { value: any; data?: any }) {
  const router = useRouter();
  const bundle = String(value ?? data?.bundle_item_number ?? '');
  if (!bundle) return <span />;
  const base = typeof window !== 'undefined' ? window.location.pathname : router.pathname;
  const url = `${base}?qf_field=bundle_item_number&qf_value=${encodeURIComponent(bundle)}`;
  const onClick = (e: React.MouseEvent) => { e.preventDefault(); router.push(url); };
  return <a href={url} onClick={onClick} className="text-primary font-semibold" style={{ display: 'inline-block', minWidth: 0 }}>{bundle}</a>;
}

// Map order type to a color class similar to legacy
export function getOrderTypePillClass(orderType?: string): string {
  switch ((orderType || '').toUpperCase()) {
    case 'EDE':
      return 'bg-purple-400 text-white';
    case 'EDI':
      return 'bg-red-400 text-white';
    case 'REST':
    case 'SOAP':
    case 'RTRE':
    case 'RTSO':
      return 'bg-neutral-600 text-white';
    case 'AMZN':
    case 'BIGP':
    case 'CHAD':
    case 'MAGP':
    case 'MAGS':
    case 'SHOP':
    case 'SHST':
    case 'STLS':
    case 'WOOP':
      return 'bg-blue-400 text-white';
    case 'OPEF':
    case 'RTEF':
      return 'bg-emerald-500 text-white';
    default:
      return 'bg-gray-400 text-white';
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

// Legacy-like order stage bar
export function OrderStageRenderer({ value, data }: { value: number; data?: any }) {
  const stage = Number(value || 0);
  const label: string = data?.stage_description || '';
  const colorMap = {
    dark: '#111827',
    redThunderbird: '#D91E18',
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
    <div className="flex flex-col gap-0" style={{ width: '100%' }}>
      <div className="flex items-center justify-between" style={{ width: '100%' }}>
        <span className="text-[12px] text-[var(--font-color)]">{isNaN(stage) ? '' : stage}</span>
        <span className="text-[11px] text-[var(--font-color-100)]">{label}</span>
      </div>
      <div style={{ width: '100%', height: 6, background: '#d0d0d0', borderRadius: 2, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${percent}%`, background: barColor, borderRadius: 2 }} />
      </div>
    </div>
  );
}

export function OrderStatusRenderer({ value }: { value: any }) {
  const status = Number(value);
  const label = status === 0 ? 'On Hold' : status === 1 ? 'Normal' : status === 2 ? 'Rush' : 'Unknown';
  if (status === 0) return <span className="font-semibold" style={{ color: '#c11515' }}>{label}</span>;
  if (status === 2) return <span className="font-semibold" style={{ color: '#8775a7' }}>{label}</span>;
  return <span>{label}</span>;
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
        <a href={trl} target="_blank" rel="noreferrer" className="text-primary text-[14px]" onClick={(e) => { e.stopPropagation(); }}>
          {tr}
        </a>
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
        <a href={trl} target="_blank" rel="noreferrer" onClick={(e) => { e.stopPropagation(); }}>{tr}</a>
      </span>
    );
  }
  return <span className="text-primary font-semibold">{tr}</span>;
}

export function InvoiceRenderer({ data }: { data?: any }) {
  const hasInvoice = !!data?.url_invoice;
  if (!hasInvoice) return <span />;
  return (
    <span className="inline-flex gap-2">
      <span title="Invoice (PDF)">🧾</span>
      <span title="Invoice Detail (Excel)">📊</span>
    </span>
  );
}

export function InvoiceLinksRenderer({ data }: { data?: any }) {
  return <InvoiceRenderer data={data} />;
}

// ==========================
// FTP Batches custom cells
// ==========================

export function FtpBatchFileRenderer({ data }: { data: any }) {
  const id = data?.id ?? data?.batch_id;
  const filename = data?.filename;
  if (!id || !filename) return <span />;
  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try { await downloadFtpBatch(id); } catch {}
  };
  return (
    <a href="#" onClick={onClick} className="text-primary font-semibold" title="Download batch file">
      {String(filename)}
    </a>
  );
}

export function FtpAckFileRenderer({ data }: { data: any }) {
  const id = data?.id ?? data?.batch_id;
  const filename = data?.ack_filename;
  if (!id || !filename) return <span />;
  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try { await downloadFtpAck(id); } catch {}
  };
  return (
    <a href="#" onClick={onClick} className="text-primary font-semibold" title="Download ACK file">
      {String(filename)}
    </a>
  );
}

export function FtpTotalImportedRenderer({ value, data }: { value: any; data: any }) {
  const router = useRouter();
  const count = Number(value ?? 0);
  if (!count) return <span>0</span>;
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to Orders All with query params similar to legacy quick filter behavior
    const received = data?.received_date ? String(data.received_date).slice(0, 10) : '';
    const batch = data?.name ? String(data.name) : '';
    const url = `/orders/all?received_date=${encodeURIComponent(received)}&batch=${encodeURIComponent(batch)}`;
    router.push(url);
  };
  return (
    <a href="#" onClick={onClick} className="text-primary font-semibold">
      {count.toLocaleString()}
    </a>
  );
}