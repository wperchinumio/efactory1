import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthState } from '@/lib/auth/guards';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, CheckBox, ScrollArea, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui';
import { deleteRmaDrafts, listRmaDrafts, readRmaEntry } from '@/services/api';
import { IconEdit, IconFilter, IconRefresh, IconSearch, IconTrash, IconPlus, IconFileText, IconShoppingCart, IconChevronDown, IconX } from '@tabler/icons-react';
import { storeRmaDraft } from '@/services/returnTrakEntryCache';

export default function ReturnTrakDraftsPage() {
  const auth = getAuthState();
  if (!auth.isAuthenticated) {
    if (typeof window !== 'undefined') window.location.href = '/auth/sign-in';
  }
  const router = useRouter();

  const [rows, setRows] = useState<Array<{ rma_id: number; rma_number?: string; rma_type?: string; rma_type_code?: string; receiving_account_number?: string; receiving_warehouse?: string; original_order_number?: string; shipping_address?: any }>>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const res = await listRmaDrafts();
      setRows(Array.isArray(res) ? res : []);
      setSelected({});
    } catch (error) {
      console.error('Failed to load RMA drafts:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault();
            reload();
            break;
          case 'a':
            e.preventDefault();
            toggleAll();
            break;
          case 'd':
            e.preventDefault();
            if (Object.values(selected).some(Boolean)) {
              setShowDeleteConfirm(true);
            }
            break;
        }
      } else if (e.key === 'Escape') {
        setShowDeleteConfirm(false);
        setShowBulkActions(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selected]);

  async function onDelete() {
    const ids = Object.keys(selected).filter(k => selected[+k]).map(k => +k);
    if (!ids.length) return;
    
    setDeleting(true);
    try {
      await deleteRmaDrafts(ids);
      await reload();
    } catch (error) {
      console.error('Failed to delete RMA drafts:', error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
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

  const draftCount = rows.length;
  const selectedCount = Object.values(selected).filter(Boolean).length;

  async function onEdit(rma_id: number) {
    const data = await readRmaEntry(rma_id);
    storeRmaDraft(data as any);
    router.push('/returntrak');
  }

  return (
    <div className="min-h-screen bg-body-color">
      {/* Header Section */}
      <div className="bg-card-color border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-font-color mb-2">ReturnTrak Drafts</h1>
              <p className="text-font-color-100 text-sm">Manage your saved RMA drafts and templates</p>
              
              {/* Status Cards */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <IconFileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {draftCount} Drafts
                  </span>
                </div>
                {selectedCount > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <IconShoppingCart className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      {selectedCount} Selected
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button 
                variant="outline" 
                onClick={reload} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                <IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              {selectedCount > 0 && (
                <div className="relative">
                  <Button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Bulk Actions
                    <IconChevronDown className="w-4 h-4" />
                  </Button>
                  
                  {showBulkActions && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card-color border border-border-color rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <Button 
                          variant="danger" 
                          size="small" 
                          className="w-full justify-start"
                          onClick={() => {
                            setShowDeleteConfirm(true);
                            setShowBulkActions(false);
                          }}
                        >
                          <IconTrash className="w-4 h-4 mr-2" />
                          Delete Selected
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <Button onClick={() => router.push('/returntrak')} className="flex items-center gap-2">
                <IconPlus className="w-4 h-4" />
                New RMA
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Table in Same Panel */}
        <Card className="overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 border-b border-border-color bg-card-color">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-96">
                <IconSearch className="w-4 h-4 text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  className="pl-10" 
                  placeholder="Search drafts by ID, RMA number, type, account, warehouse, or address..." 
                  value={filter} 
                  onChange={e => setFilter(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-font-color-100">
                <IconRefresh className="w-5 h-5 animate-spin" />
                <span>Loading drafts...</span>
              </div>
            </div>
          ) : getVisibleRows().length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <IconFileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-font-color mb-1">No drafts found</h3>
                  <p className="text-font-color-100 text-sm">
                    {filter ? 'Try adjusting your search criteria' : 'Create your first RMA draft to get started'}
                  </p>
                </div>
                {!filter && (
                  <Button onClick={() => router.push('/returntrak')} className="mt-2">
                    <IconPlus className="w-4 h-4 mr-2" />
                    Create New RMA
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-primary-10 border-b border-border-color">
                  <tr className="text-left text-font-color text-sm font-semibold">
                    <th className="py-4 px-4 w-12">
                      <CheckBox checked={allChecked} onChange={toggleAll} />
                    </th>
                    <th className="py-4 px-4">Draft #</th>
                    <th className="py-4 px-4">RMA #</th>
                    <th className="py-4 px-4">RMA Type</th>
                    <th className="py-4 px-4">Account #</th>
                    <th className="py-4 px-4">Warehouse</th>
                    <th className="py-4 px-4">Original Order #</th>
                    <th className="py-4 px-4">Ship To</th>
                    <th className="py-4 px-4 text-right w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {getVisibleRows().map((r: any) => {
                    const isSelected = !!selected[r.rma_id];
                    const shipLine = `${r?.shipping_address?.company || ''}${(r?.shipping_address?.company && r?.shipping_address?.attention) ? ' | ' : ''}${r?.shipping_address?.attention || ''}`.trim();
                    const shipCity = `${r?.shipping_address?.city ? r.shipping_address.city + ',' : ''} ${r?.shipping_address?.state_province || ''} ${r?.shipping_address?.postal_code ? r.shipping_address.postal_code + '-' : ''} ${r?.shipping_address?.country || ''}`.trim();
                    
                    return (
                      <tr 
                        key={r.rma_id} 
                        className={`hover:bg-primary-10 transition-colors ${isSelected ? 'bg-primary-10' : ''}`}
                      >
                        <td className="py-4 px-4">
                          <CheckBox 
                            checked={isSelected} 
                            onChange={() => setSelected(prev => ({ ...prev, [r.rma_id]: !isSelected }))} 
                          />
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            className="text-primary hover:underline font-semibold text-sm" 
                            onClick={() => onEdit(r.rma_id)}
                          >
                            {String(r.rma_id).padStart(6, '0')}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-sm">{r?.rma_number || '-'}</td>
                        <td className="py-4 px-4 text-sm">
                          {r?.rma_type_code ? (
                            <span><b>{r.rma_type_code}</b> : {r?.rma_type || '-'}</span>
                          ) : (r?.rma_type || '-')}
                        </td>
                        <td className="py-4 px-4 text-sm">{r?.receiving_account_number || '-'}</td>
                        <td className="py-4 px-4 text-sm">{r?.receiving_warehouse || '-'}</td>
                        <td className="py-4 px-4 text-sm whitespace-nowrap">{r?.original_order_number || '-'}</td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            {shipLine ? (
                              <>
                                <div className="text-secondary italic font-medium">
                                  {shipLine}
                                </div>
                                <div className="text-font-color text-xs mt-1">
                                  {shipCity}
                                </div>
                              </>
                            ) : (
                              <span className="text-font-color-100">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right w-32">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="small" 
                              variant="outline"
                              onClick={() => onEdit(r.rma_id)}
                              className="flex items-center gap-1 whitespace-nowrap"
                            >
                              <IconEdit className="w-3 h-3" />
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Drafts</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} selected RMA draft{selectedCount > 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={onDelete}
              disabled={deleting}
              className="flex items-center gap-2"
            >
              {deleting ? (
                <>
                  <IconRefresh className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <IconTrash className="w-4 h-4" />
                  Delete {selectedCount} Draft{selectedCount > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


