import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { IconArrowLeft, IconDeviceFloppy, IconGripVertical, IconEye, IconEyeOff, IconRefresh, IconX } from '@tabler/icons-react';
import { fetchDefaultOverviewLayout, saveOverviewLayout, fetchFulfillments } from '@/services/api';
import type { OverviewArea, OverviewLayout, OverviewTileName } from '@/types/api/views';
import type { FulfillmentRowDto } from '@/types/api/overview';
import { CounterPreview } from '@/components/overview/CounterPreviews';
import { useRouter } from 'next/router';

export default function CustomizeOverview() {
  const router = useRouter();
  const [layout, setLayout] = useState<OverviewLayout | null>(null);
  const [fulfillments, setFulfillments] = useState<FulfillmentRowDto[]>([]);
  const [saving, setSaving] = useState(false);
  const [working, setWorking] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setWorking(true);
        const [remote, fulfillmentData] = await Promise.all([
          fetchDefaultOverviewLayout(),
          fetchFulfillments()
        ]);
        setLayout(remote);
        setFulfillments(fulfillmentData);
      } catch {
        setLayout({ areas: [] });
        setFulfillments([]);
      } finally { setWorking(false); }
    })();
  }, []);

  const tiles = useMemo(() => layout?.areas.find(a => a.name === 'tiles') || null, [layout]);

  const getSectionTitle = (name: string) => {
    const titleMap: Record<string, string> = {
      'tiles': 'Tiles',
      'fulfillment': 'Fulfillment',
      '30days': '30 Days Activity',
      'inventory': 'Inventory',
      '50orders': 'Latest 50 Orders',
      '30days_rmas': '30 Days RMA Activity',
    };
    return titleMap[name] || name;
  };

  const getTileTitle = (name: string) => {
    const titleMap: Record<string, string> = {
      'orders_received_today': 'Orders Received Today',
      'orders_shipped_today': 'Orders Shipped Today',
      'back_orders': 'Back Orders',
      'open_rma': 'Open RMAs',
      'multi_received_today': 'Received Today',
      'multi_shipped_today': 'Shipped Today',
      'multi_rmas_today': 'RMAs Today',
      'multi_rma_units_today': 'RMA Units Today',
      'multi_open_orders': 'Open Orders',
      'multi_backorders': 'Backorders',
      'multi_subtotal': 'Subtotal',
      'multi_sh': 'S&H',
    };
    return titleMap[name] || name;
  };

  function toggleTile(name: OverviewTileName) {
    if (!tiles || !layout) return;
    const next = JSON.parse(JSON.stringify(layout)) as OverviewLayout;
    const tileArea = next.areas.find(a => a.name === 'tiles')!;
    const entry = tileArea.areas?.find(t => t.name === name);
    if (!entry) return;
    const visibleCount = tileArea.areas?.filter(t => t.visible).length || 0;
    entry.visible = entry.visible ? false : visibleCount < 4;
    setLayout(next);
  }

  function onDragStart(index: number) { setDragIndex(index); }
  function onDragOver(index: number, e: React.DragEvent) {
    e.preventDefault();
    if (dragIndex === null || !tiles || !layout) return;
    if (index === dragIndex) return;
    const next = JSON.parse(JSON.stringify(layout)) as OverviewLayout;
    const arr = next.areas.find(a => a.name === 'tiles')!.areas || [];
    const moved = arr.splice(dragIndex, 1)[0];
    if (moved) arr.splice(index, 0, moved);
    next.areas.find(a => a.name === 'tiles')!.areas = arr;
    setLayout(next);
    setDragIndex(index);
  }

  async function onSave() {
    if (!layout) return;
    setSaving(true);
    try {
      const saved = await saveOverviewLayout(layout);
      setLayout(saved);
      router.push('/overview');
    } finally { setSaving(false); }
  }

  async function onRestoreDefault() {
    setWorking(true);
    try {
      const def = await fetchDefaultOverviewLayout();
      setLayout(def);
    } finally { setWorking(false); }
  }

  if (!layout) return null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/overview')}>
            <IconArrowLeft className="w-4 h-4 mr-2" /> Close
          </Button>
          <h1 className="text-xl font-semibold">Customize Counters</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRestoreDefault} disabled={working} className="bg-primary text-white border-primary hover:bg-primary hover:text-white">
            <IconRefresh className="w-4 h-4 mr-2" /> Restore Default View
          </Button>
          <Button size="sm" variant="outline" onClick={onSave} disabled={saving} className="bg-primary text-white border-primary hover:bg-primary hover:text-white">
            <IconDeviceFloppy className="w-4 h-4 mr-2" /> {saving ? 'Saving…' : 'Save & Close'}
          </Button>
        </div>
      </div>

      {/* Overview sections info */}
      <div className="mb-6 p-4 bg-card-color border border-border-color rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-font-color">Overview Layout</h2>
        <p className="text-sm text-font-color-100 mb-3">
          The overview page displays sections in a fixed, optimized order for the best user experience:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-font-color-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Key Performance Counters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Fulfillment Summary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Activity Charts (side-by-side)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Inventory & Latest Orders</span>
          </div>
        </div>
      </div>

      {/* Counter Selection */}
      {tiles && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-font-color">Select Key Performance Counters</h2>
          <p className="text-sm text-font-color-100 mb-4">Choose which counters to display on your overview page. You can drag to reorder and select up to 4 counters to show.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {(tiles.areas || []).map((t, i) => (
              <div key={t.name}
                   draggable
                   onDragStart={() => onDragStart(i)}
                   onDragOver={(e) => onDragOver(i, e)}
                   className={`rounded-lg border p-2 flex flex-col gap-2 ${t.visible ? 'border-primary bg-primary-10' : 'border-border-color'}`}>
                <div className="flex items-center gap-1">
                  <IconGripVertical className="w-3 h-3 text-font-color-100" />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => toggleTile(t.name)}
                    className={`text-xs px-2 py-1 ${t.visible ? 'bg-primary text-white border-primary hover:bg-primary hover:text-white' : 'bg-card-color text-font-color-100 hover:bg-primary-10'}`}
                  >
                    {t.visible ? 'Visible' : 'Hidden'}
                  </Button>
                </div>
                <div className="flex-1">
                  <CounterPreview name={t.name} fulfillments={fulfillments} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


