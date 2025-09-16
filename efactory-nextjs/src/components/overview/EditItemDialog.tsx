import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import type { ItemDetailResponseData, ItemDgDto, ItemExportDto, ItemShippingDto, UpdateItemBody } from '@/types/api/inventory';
import { updateItem } from '@/services/api';

export type EditItemTabs = 'shipping' | 'export' | 'dg' | 'edi';

export interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemDetailResponseData;
  accountWh: string; // e.g. 10501.FR
  onSaved?: (updated: ItemDetailResponseData) => void;
}

interface EditState {
  shipping: ItemShippingDto;
  export: ItemExportDto;
  dg: ItemDgDto;
  edi: Array<{ tp?: string; item_number?: string }>;
  updateParams: {
    account_wh: string;
    item_number: string;
    key_item?: boolean;
    desc1?: string;
  };
}

export default function EditItemDialog({ open, onOpenChange, item, accountWh, onSaved }: EditItemDialogProps) {
  const [activeTab, setActiveTab] = useState<EditItemTabs>('shipping');
  const [savingThisWh, setSavingThisWh] = useState(false);
  const [savingAllWh, setSavingAllWh] = useState(false);
  const detail = item?.detail || {};
  const initialEdi = useMemo(() => {
    const list = (item?.edi || []).slice(0, 8);
    // Filter out company_code entries if present (legacy parity); we do not have token here so keep as-is
    return list;
  }, [item]);

  const [edit, setEdit] = useState<EditState>(() => ({
    shipping: item?.shipping || {},
    export: item?.export || {},
    dg: item?.dg || {},
    edi: initialEdi,
    updateParams: {
      account_wh: accountWh || '',
      item_number: detail?.item_number || '',
      key_item: (detail?.cat3 || '') === 'KEY',
      desc1: detail?.desc1 || ''
    }
  }));

  useEffect(() => {
    if (!open) return;
    setActiveTab('shipping');
    setEdit({
      shipping: item?.shipping || {},
      export: item?.export || {},
      dg: item?.dg || {},
      edi: initialEdi,
      updateParams: {
        account_wh: accountWh || '',
        item_number: (item?.detail?.item_number as any) || '',
        key_item: (item?.detail?.cat3 as any) === 'KEY',
        desc1: (item?.detail?.desc1 as any) || ''
      }
    });
  }, [open, item, accountWh, initialEdi]);

  function onField<K extends keyof ItemShippingDto | keyof ItemExportDto | keyof ItemDgDto>(section: 'shipping' | 'export' | 'dg', field: K, value: any) {
    setEdit(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value,
      },
    }));
  }

  function onEdiChange(index: number, buyerItemNumber: string) {
    setEdit(prev => ({
      ...prev,
      edi: [
        ...prev.edi.slice(0, index),
        { tp: prev.edi[index]?.tp, item_number: buyerItemNumber },
        ...prev.edi.slice(index + 1)
      ]
    }));
  }

  function onToggleKeyItem(checked: boolean) {
    setEdit(prev => ({
      ...prev,
      updateParams: { ...prev.updateParams, key_item: checked }
    }));
  }

  async function doSave(allWarehouses: boolean) {
    const setSaving = allWarehouses ? setSavingAllWh : setSavingThisWh;
    try {
      setSaving(true);
      const payload: UpdateItemBody = {
        action: 'update',
        resource: 'item',
        account_wh: allWarehouses ? '' : (edit.updateParams.account_wh || ''),
        item_number: edit.updateParams.item_number,
        key_item: !!edit.updateParams.key_item,
        data: {
          shipping: { ...edit.shipping },
          export: { ...edit.export },
          dg: { ...edit.dg },
          edi: [...edit.edi]
        }
      };
      const updated = await updateItem(payload);
      if (onSaved) onSaved(updated as any);
      onOpenChange(false);
    } catch (e) {
      // Surface error minimally; rely on global toast system if present
      console.error('Failed to save item changes', e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[920px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>EDIT ITEM</DialogTitle>
        </DialogHeader>

        <div className="mb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm"><span className="font-semibold">Item #:</span> <span className="text-primary">{edit.updateParams.item_number}</span></div>
              <div className="text-xs text-font-color-100">{edit.updateParams.desc1}</div>
            </div>
            <label className="text-sm flex items-center gap-2">
              <input type="checkbox" checked={!!edit.updateParams.key_item} onChange={e => onToggleKeyItem(e.target.checked)} />
              Mark as Key Item
            </label>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-semibold">Account # - WH:</span>
            <span className="ml-2">{(edit.updateParams.account_wh || '').replace(/\.(\w+)/, (_, r) => ` - ${r}`)}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as EditItemTabs)}>
          <TabsList>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="dg">DG Data</TabsTrigger>
            <TabsTrigger value="edi">EDI</TabsTrigger>
          </TabsList>

          <TabsContent value="shipping">
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs text-font-color-100 mb-1">UPC</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={edit.shipping.upc || ''} onChange={e => onField('shipping', 'upc', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Weight</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={(edit.shipping.weight as any) || ''} onChange={e => onField('shipping', 'weight', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Dimension</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={edit.shipping.dimension || ''} onChange={e => onField('shipping', 'dimension', e.target.value)} placeholder="LxWxH e.g. 12x6x4" />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Serial/Lot #</label>
                <select className="w-full p-2 border border-border-color rounded text-sm" value={edit.shipping.serial_no || ''} onChange={e => onField('shipping', 'serial_no', e.target.value)}>
                  <option value="0">No serial / No Lot</option>
                  <option value="1">Serialized (1 serial #)</option>
                  <option value="2">Serialized (2 serial #)</option>
                  <option value="99">Lot # (with verification)</option>
                  <option value="90">Lot # (capture only)</option>
                  <option value="91">Lot # and Serial #</option>
                  <option value="98">FIFO</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Serial # Format</label>
                <input className="w-full p-2 border border-border-color rounded text-sm bg-muted" readOnly value={edit.shipping.serial_format || ''} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export">
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs text-font-color-100 mb-1">ECCN</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={edit.export.eccn || ''} onChange={e => onField('export', 'eccn', e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Harmonized Code</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={edit.export.hcode || ''} onChange={e => onField('export', 'hcode', e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Harmonized Code (CA)</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={edit.export.hcode_ca || ''} onChange={e => onField('export', 'hcode_ca', e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Country Of Origin</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={edit.export.coo || ''} onChange={e => onField('export', 'coo', e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">GL Symbol</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={edit.export.gl || ''} onChange={e => onField('export', 'gl', e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Category</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={edit.export.cat || ''} onChange={e => onField('export', 'cat', e.target.value.toUpperCase())} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dg">
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Lithium Battery Category</label>
                <select className="w-full p-2 border border-border-color rounded text-sm" value={edit.dg.li_b_cat || ''} onChange={e => onField('dg', 'li_b_cat', e.target.value)}>
                  <option value=""></option>
                  <option value="ION">Ion</option>
                  <option value="MTL">Metal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Lithium Battery Configuration</label>
                <select className="w-full p-2 border border-border-color rounded text-sm" value={edit.dg.li_b_conf || ''} onChange={e => onField('dg', 'li_b_conf', e.target.value)}>
                  <option value=""></option>
                  <option value="PCK">Packed with Product</option>
                  <option value="CNT">Contained in Product</option>
                  <option value="SKU">Battery SKU Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Lithium Battery Type</label>
                <select className="w-full p-2 border border-border-color rounded text-sm" value={edit.dg.li_t_type || ''} onChange={e => onField('dg', 'li_t_type', e.target.value)}>
                  <option value=""></option>
                  <option value="CBT">CBT - Button</option>
                  <option value="CCN">CCN - Cell</option>
                  <option value="BTT">BTT - Battery</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Cell/Batt. Per Retail Pack.</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={(edit.dg.cell_rp as any) || ''} onChange={e => onField('dg', 'cell_rp', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Retail Units Per Inner Carton</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={(edit.dg.unit_innerc as any) || ''} onChange={e => onField('dg', 'unit_innerc', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Retail Units Per Master Carton</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={(edit.dg.unit_masterc as any) || ''} onChange={e => onField('dg', 'unit_masterc', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Watt/Hour Per Cell/Battery (&lt;=)</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={(edit.dg as any).wh_cell ?? ''} onChange={e => onField('dg', 'wh_cell' as any, e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-font-color-100 mb-1">Net Wgt of Lithium Battery (g)</label>
                <input className="w-full p-2 border border-border-color rounded text-sm" value={(edit.dg.net_wh as any) || ''} onChange={e => onField('dg', 'net_wh', e.target.value)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edi">
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-4 text-xs font-medium text-font-color-100">
                <div>TRADING PARTNER</div>
                <div>BUYER ITEM #</div>
              </div>
              {edit.edi.map((row, idx) => (
                <div key={`edi-${idx}`} className="grid grid-cols-2 gap-4 items-center">
                  <div className="text-sm font-medium">{row.tp}</div>
                  <input className="w-full p-2 border border-border-color rounded text-sm" value={row.item_number || ''} onChange={e => onEdiChange(idx, e.target.value)} />
                </div>
              ))}
              {edit.edi.length === 0 && (
                <div className="text-sm text-font-color-100">No TP Item Configured!</div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="danger" loading={savingAllWh} onClick={() => void doSave(true)}>Save Changes all WHs</Button>
          <Button variant="success" loading={savingThisWh} onClick={() => void doSave(false)}>Save Changes this WH</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


