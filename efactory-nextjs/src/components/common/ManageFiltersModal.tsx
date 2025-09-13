import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui';
import { Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
import type { GridFilter } from '@/types/api/grid';
import { listSavedFilters, createSavedFilter, updateSavedFilter, deleteSavedFilter, getSavedFilterDetail } from '@/services/api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: string;
}

export default function ManageFiltersModal({ open, onOpenChange, resource }: Props) {
  const [filters, setFilters] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<GridFilter>({ and: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      try {
        const list = await listSavedFilters(resource);
        setFilters((list as any).map((f: any) => ({ id: f.id, name: f.name })));
      } finally {
        setLoading(false);
      }
    })();
  }, [open, resource]);

  async function startEdit(id: number) {
    setEditingId(id);
    const detail = await getSavedFilterDetail(id);
    setName(detail.name || '');
    setDescription(detail.description || '');
    setFilter(detail.filter || { and: [] });
  }

  function startCreate() {
    setEditingId(null);
    setName('');
    setDescription('');
    setFilter({ and: [] });
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editingId) {
        await updateSavedFilter(editingId, name, description, filter);
      } else {
        await createSavedFilter(resource, name, description, filter);
      }
      const list = await listSavedFilters(resource);
      setFilters((list as any).map((f: any) => ({ id: f.id, name: f.name })));
      startCreate();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    await deleteSavedFilter(id);
    const list = await listSavedFilters(resource);
    setFilters((list as any).map((f: any) => ({ id: f.id, name: f.name })));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage filters</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-2 text-xs text-muted">Saved Filters</div>
            <div className="space-y-1 max-h-[360px] overflow-auto border rounded p-2">
              {filters.map((f) => (
                <div key={f.id} className="flex items-center justify-between">
                  <button className="text-left text-sm" onClick={() => startEdit(f.id)}>{f.name}</button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(f.id)}>Delete</Button>
                </div>
              ))}
              {filters.length === 0 && <div className="text-xs text-muted">No filters yet.</div>}
            </div>
            <Button className="mt-2" size="sm" onClick={startCreate}>New Filter</Button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted">Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted">Filter JSON (advanced)</label>
              <textarea
                className="w-full border rounded p-2 text-xs"
                rows={10}
                value={JSON.stringify(filter, null, 2)}
                onChange={(e) => {
                  try { setFilter(JSON.parse(e.target.value)); } catch {}
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button onClick={handleSave} disabled={saving || !name}>{saving ? 'Saving…' : 'Save'}</Button>
            </div>
          </div>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}


