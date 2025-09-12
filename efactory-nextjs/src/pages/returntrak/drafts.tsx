import React, { useEffect, useState } from 'react';
import { getAuthState } from '@/lib/auth/guards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import Button from '@/components/ui/Button';
import { deleteRmaDrafts, listRmaDrafts } from '@/services/api';

export default function ReturnTrakDraftsPage() {
  const auth = getAuthState();
  if (!auth.isAuthenticated) {
    if (typeof window !== 'undefined') window.location.href = '/auth/sign-in';
  }

  const [rows, setRows] = useState<Array<{ rma_id: number; rma_header?: any }>>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<number, boolean>>({});

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

  return (
    <div className="container mx-auto max-w-[1000px] px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">ReturnTrak - Drafts</h2>
        <Button variant="destructive" size="sm" onClick={onDeleteSelected} disabled={loading}>Delete Selected</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Draft RMAs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Draft ID</th>
                <th className="p-2 text-left">RMA #</th>
                <th className="p-2 text-left">Account</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.rma_id} className="border-t">
                  <td className="p-2">
                    <input type="checkbox" checked={!!selected[r.rma_id]} onChange={e=>setSelected(prev=>({ ...prev, [r.rma_id]: e.target.checked }))} />
                  </td>
                  <td className="p-2">{r.rma_id}</td>
                  <td className="p-2">{r.rma_header?.rma_number || ''}</td>
                  <td className="p-2">{r.rma_header?.account_number ? `${r.rma_header.account_number}.${r.rma_header.location || ''}` : ''}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-font-color-100">No drafts</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}


