import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthState } from '@/lib/auth/guards';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, CheckBox, ScrollArea, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { deleteRmaDrafts, listRmaDrafts, readRmaEntry } from '@/services/api';
import { IconEdit, IconFilter, IconRefresh, IconSearch, IconTrash } from '@tabler/icons-react';
import { storeRmaDraft } from '@/services/returnTrakEntryCache';

export default function ReturnTrakDraftsPage() {
  const auth = getAuthState();
  if (!auth.isAuthenticated) {
    if (typeof window !== 'undefined') window.location.href = '/auth/sign-in';
  }
  const router = useRouter();

  const [rows, setRows] = useState<Array<{ rma_id: number; rma_number?: string; rma_type?: string; rma_type_code?: string; receiving_account_number?: string; receiving_warehouse?: string; original_order_number?: string; shipping_address?: any }>>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await listRmaDrafts();
        if (!mounted) return;
        setRows(Array.isArray(res) ? res : []);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  async function onDeleteSelected() {
    const ids = Object.keys(selected).filter(k => selected[Number(k)]).map(k => Number(k));
    if (!ids.length) return;
    await deleteRmaDrafts(ids);
    const res = await listRmaDrafts();
    setRows(Array.isArray(res) ? res : []);
    setSelected({});
  }

  function getVisibleRows() {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r: any) => {
      const paddedId = String(r.rma_id).padStart(6, '0');
      const idMatches = paddedId.startsWith(q) || paddedId.includes(q) || String(r.rma_id).includes(q);
      const rmaNum = String(r?.rma_number || '').toLowerCase();
      const rmaType = String(r?.rma_type || '').toLowerCase();
      const rmaTypeCode = String(r?.rma_type_code || '').toLowerCase();
      const account = String(r?.receiving_account_number || '').toLowerCase();
      const wh = String(r?.receiving_warehouse || '').toLowerCase();
      const orig = String(r?.original_order_number || '').toLowerCase();
      const shipCompany = String(r?.shipping_address?.company || '').toLowerCase();
      const shipCity = String(r?.shipping_address?.city || '').toLowerCase();
      return (
        idMatches || rmaNum.includes(q) || rmaType.includes(q) || rmaTypeCode.includes(q) || account.includes(q) || wh.includes(q) || orig.includes(q) || shipCompany.includes(q) || shipCity.includes(q)
      );
    });
  }

  const allChecked = useMemo(() => {
    const visible = getVisibleRows();
    if (!visible.length) return false;
    return visible.every(d => !!selected[d.rma_id]);
  }, [selected, rows, filter]);

  function toggleAll() {
    const next: Record<number, boolean> = { ...selected };
    const visible = getVisibleRows();
    const shouldSelectAll = !allChecked;
    visible.forEach(d => { next[d.rma_id] = shouldSelectAll; });
    setSelected(next);
  }

  async function onEdit(rma_id: number) {
    const data = await readRmaEntry(rma_id);
    storeRmaDraft(data as any);
    router.push('/returntrak');
  }

  return (
    <div className="md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color">
      <div className="container-fluid mb-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-[24px]/[32px] font-bold text-font-color mb-1">ReturnTrak Drafts</h1>
              <p className="text-font-color-100 text-[14px]/[20px]">Manage your saved RMA drafts</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={async()=>{ setLoading(true); const res = await listRmaDrafts(); setRows(Array.isArray(res)?res:[]); setLoading(false); }}>
                <IconRefresh className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="danger" onClick={onDeleteSelected} disabled={!Object.values(selected).some(Boolean)}>
                <IconTrash className="w-4 h-4" />
                Delete Selected
              </Button>
            </div>
          </div>

          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="relative w-full sm:w-[340px]">
                <IconSearch className="w-[16px] h-[16px] text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input className="pl-9" placeholder="Search drafts..." value={filter} onChange={e=>setFilter(e.target.value)} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px]">
                <thead className="bg-body-color border-b border-border-color">
                  <tr className="text-left text-font-color text-[13px] font-semibold">
                    <th className="py-2.5 px-3 w-[44px]"><CheckBox checked={allChecked} onChange={toggleAll} /></th>
                    <th className="py-2.5 px-3">Draft #</th>
                    <th className="py-2.5 px-3">RMA #</th>
                    <th className="py-2.5 px-3">RMA Type</th>
                    <th className="py-2.5 px-3">Account #</th>
                    <th className="py-2.5 px-3">Warehouse</th>
                    <th className="py-2.5 px-3">Original Order #</th>
                    <th className="py-2.5 px-3">Ship To</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getVisibleRows().length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-font-color-100">No drafts found</td>
                    </tr>
                  ) : (
                    getVisibleRows().map((r: any) => {
                      const isSelected = !!selected[r.rma_id];
                      return (
                        <tr key={r.rma_id} className="border-b border-border-color hover:bg-primary-10 transition-colors">
                          <td className="py-2.5 px-3">
                            <CheckBox checked={isSelected} onChange={()=>setSelected(prev=>({ ...prev, [r.rma_id]: !isSelected }))} />
                          </td>
                          <td className="py-2.5 px-3">
                            <button className="text-primary hover:underline font-semibold" onClick={()=>onEdit(r.rma_id)}>
                              {String(r.rma_id).padStart(6, '0')}
                            </button>
                          </td>
                          <td className="py-2.5 px-3">{r?.rma_number || '-'}</td>
                          <td className="py-2.5 px-3">
                            {r?.rma_type_code ? (
                              <span><b>{r.rma_type_code}</b> : {r?.rma_type || '-'}</span>
                            ) : (r?.rma_type || '-')}
                          </td>
                          <td className="py-2.5 px-3">{r?.receiving_account_number || '-'}</td>
                          <td className="py-2.5 px-3">{r?.receiving_warehouse || '-'}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">{r?.original_order_number || '-'}</td>
                          <td className="py-2.5 px-3">
                            <div className="text-[13px] text-font-color">
                              <i className="text-info">{`${r?.shipping_address?.company || ''}${(r?.shipping_address?.company && r?.shipping_address?.attention) ? ' | ' : ''}${r?.shipping_address?.attention || ''}`}</i>
                              <div className="text-font-color-100">{`${r?.shipping_address?.city ? r.shipping_address.city + ',' : ''} ${r?.shipping_address?.state_province || ''} ${r?.shipping_address?.postal_code ? r.shipping_address.postal_code + '-' : ''} ${r?.shipping_address?.country || ''}`}</div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <Button size="small" className="mr-2" onClick={()=>onEdit(r.rma_id)}>
                              <IconEdit className="w-4 h-4" />
                              Edit
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


