import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import ScheduleReportModal from '@/components/common/ScheduleReportModal';
import ManageFiltersModal from '@/components/common/ManageFiltersModal';
import type { SchedulerTask } from '@/types/api/scheduler';
import { createSchedule } from '@/services/api';
import { listSavedFilters, selectSavedFilter, unsetSavedFilter, selectGridView, exportGridRows } from '@/services/api';
import type { GridFilter, GridSelectedView, GridViewItemMeta } from '@/types/api/grid';
import type { FilterState } from '@/types/api/filters';
import { IconRefresh, IconChevronDown, IconSettings, IconDownload, IconCalendar, IconFilter, IconCheck, IconX } from '@tabler/icons-react';

export interface GridToolbarProps {
  resource: string; // e.g., 'fulfillment-shipped'
  rowsUrl: string; // e.g., '/api/fulfillment'
  views: GridViewItemMeta[];
  selectedViewId: number;
  title: string; // e.g., 'ORDERS - OPEN'
  onViewChange?: (view: GridSelectedView, meta: GridViewItemMeta[]) => void;
  onRefresh?: () => void; // Callback to refresh the grid data
  // Current effective filter and sort provided by the page/grid
  currentFilter: GridFilter;
  currentSort: Array<Record<string, 'asc' | 'desc'>>;
  // Latest filter state from LunoAgGrid (used for export conversion)
  filterState?: FilterState;
  // Visibility toggles (for pages without views/filters/export)
  showViewsActions?: boolean;
  showFilterActions?: boolean;
  showRefresh?: boolean;
}

function buildExportFilter(filterState?: FilterState, fallback?: GridFilter): GridFilter {
  if (!filterState || Object.keys(filterState).length === 0) return fallback || { and: [] };
  const and = [] as any[];
  Object.values(filterState).forEach((v: any) => {
    if (!v) return;
    if (Array.isArray(v)) {
      v.forEach((fv) => {
        if (fv && fv.value !== '' && fv.value !== null) and.push({ field: fv.field, oper: fv.oper, value: fv.value });
      });
    } else if (typeof v === 'object') {
      if (typeof v.value === 'string' && v.value.includes(',')) {
        and.push({ field: v.field, oper: 'in', value: v.value });
      } else {
        and.push({ field: v.field, oper: v.oper, value: v.value });
      }
    }
  });
  return and.length ? { and } : (fallback || { and: [] });
}

export default function GridToolbar({
  resource,
  rowsUrl,
  views,
  selectedViewId,
  title,
  onViewChange,
  onRefresh,
  currentFilter,
  currentSort,
  filterState,
  showViewsActions = true,
  showFilterActions = true,
  showRefresh = true,
}: GridToolbarProps) {
  const [savedFilters, setSavedFilters] = useState<{ id: number; name: string; selected?: boolean }[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const selectedLabel = useMemo(() => {
    const meta = views.find(v => v.id === selectedViewId) || views.find(v => v.selected);
    return meta?.name || 'Views';
  }, [views, selectedViewId]);
  const [exporting, setExporting] = useState<'excel' | 'csv' | 'zip' | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [viewsOpen, setViewsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectedView = useMemo(() => views.find((v) => v.selected) || views.find((v) => v.id === selectedViewId) || views[0], [views, selectedViewId]);

  // Lazy-load saved filters only when filters dropdown opens
  async function ensureFiltersLoaded() {
    if (filtersLoaded) return;
    try {
      setLoadingFilters(true);
      const list = await listSavedFilters(resource);
      setSavedFilters(list as any);
      setFiltersLoaded(true);
    } catch {
      setSavedFilters([]);
    } finally {
      setLoadingFilters(false);
    }
  }

  async function handleSelectView(id: number) {
    const viewMeta = await selectGridView(resource, id);
    // Find selected view and notify
    const selected = viewMeta.views.find((v) => v.selected)?.view;
    onViewChange?.(selected!, viewMeta.views);
  }

  async function handleSelectSavedFilter(id: number) {
    await selectSavedFilter(id);
    // refresh filter list to reflect selection mark
    const list = await listSavedFilters(resource);
    setSavedFilters(list as any);
  }

  async function handleUnsetSavedFilter() {
    await unsetSavedFilter(resource);
    const list = await listSavedFilters(resource);
    setSavedFilters(list as any);
  }

  async function handleExport(format: 'excel' | 'csv' | 'zip') {
    setExporting(format);
    try {
      const exportFilter = buildExportFilter(filterState, currentFilter);
      await exportGridRows(rowsUrl, {
        action: 'export',
        fields: ['*'],
        filter: exportFilter,
        page_num: 1,
        page_size: 100000, // export all rows that server allows
        resource,
        sort: currentSort,
        format
      });
    } finally {
      setExporting(null);
    }
  }

  return (
    <>
      <ScheduleReportModal
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        defaultTask={{
          report_type_id: 0,
          view_type: resource,
          frequency: { type: 'daily', days_interval: 1 },
          start_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
          format: 'excel',
          active: true,
          delivery_options: { email: { to: '' } },
          filter: currentFilter,
          sort: currentSort,
        } as SchedulerTask}
        onSubmit={async (task) => { await createSchedule(task); }}
      />
      <ManageFiltersModal open={manageOpen} onOpenChange={setManageOpen} resource={resource} />
      
    {/* Luno-themed toolbar with gradient header */}
    <div className="bg-gradient-to-r from-card-color to-card-color/95 border border-border-color p-3 mb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          {/* Left side - Title with gradient accent */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/70 rounded-full"></div>
              <h2 className="text-lg font-bold text-font-color tracking-tight">
                {title}
              </h2>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {showViewsActions ? (
              <div className="inline-flex rounded-md border border-border-color bg-card-color shadow-sm">
                <button 
                  onClick={() => { onRefresh?.(); }}
                  className="inline-flex items-center h-8 px-3 text-xs font-medium rounded-l-md border-r border-border-color bg-card-color text-font-color hover:bg-primary-10 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 min-w-[100px]"
                >
                  <IconRefresh size={12} className="mr-2" />
                  {selectedLabel}
                </button>
                <div className="relative">
                  <button 
                    className="inline-flex items-center justify-center h-8 px-2 text-xs font-medium rounded-r-md bg-card-color text-font-color hover:bg-primary-10 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => setViewsOpen(!viewsOpen)}
                  >
                    <IconChevronDown size={12} />
                  </button>
                  {viewsOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setViewsOpen(false)} />
                      <div 
                        className="absolute right-0 top-full mt-1 min-w-[200px] bg-card-color border border-border-color text-font-color shadow-xl rounded-md z-20"
                        style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-color)', color: 'var(--font-color)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                      >
                        <div className="text-sm font-medium text-font-color px-2 py-1.5 border-b border-border-color">Views</div>
                        {views.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => { handleSelectView(v.id); setViewsOpen(false); }}
                            className={`w-full text-left text-sm px-2 py-1.5 hover:bg-primary-10 flex items-center ${v.selected ? 'bg-primary-10' : ''}`}
                            style={{ backgroundColor: v.selected ? 'var(--primary-10)' : 'transparent' }}
                          >
                            <div className="w-3 h-3 mr-2 flex items-center justify-center">{v.selected && <IconCheck size={12} className="text-primary" />}</div>
                            <span className={v.selected ? 'font-semibold text-primary' : 'text-font-color'}>{v.name}</span>
                          </button>
                        ))}
                        <div className="border-t border-border-color my-1"></div>
                        <button onClick={() => { setManageOpen(true); setViewsOpen(false); }} className="w-full text-left text-sm px-2 py-1.5 hover:bg-primary-10 text-font-color flex items-center">
                          <IconSettings size={12} className="mr-2" />
                          Customize…
                        </button>
                        <div className="border-t border-border-color my-1"></div>
                        <button onClick={() => { handleExport('excel'); setViewsOpen(false); }} disabled={!!exporting} className="w-full text-left text-sm px-2 py-1.5 hover:bg-primary-10 text-font-color disabled:opacity-50">{exporting === 'excel' ? 'Exporting…' : 'Export to Excel'}</button>
                        <button onClick={() => { handleExport('csv'); setViewsOpen(false); }} disabled={!!exporting} className="w-full text-left text-sm px-2 py-1.5 hover:bg-primary-10 text-font-color disabled:opacity-50">{exporting === 'csv' ? 'Exporting…' : 'Export to CSV'}</button>
                        <button onClick={() => { handleExport('zip'); setViewsOpen(false); }} disabled={!!exporting} className="w-full text-left text-sm px-2 py-1.5 hover:bg-primary-10 text-font-color disabled:opacity-50">{exporting === 'zip' ? 'Exporting…' : 'Export to Zip'}</button>
                        <div className="border-t border-border-color my-1"></div>
                        <button onClick={() => { setScheduleOpen(true); setViewsOpen(false); }} className="w-full text-left text-sm px-2 py-1.5 hover:bg-primary-10 text-font-color flex items-center">
                          <IconCalendar size={12} className="mr-2" />
                          Schedule report…
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              showRefresh ? (
                <button 
                  onClick={() => { onRefresh?.(); }}
                  className="inline-flex items-center h-8 px-3 text-xs font-medium rounded-md border border-border-color bg-card-color text-font-color hover:bg-primary-10 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IconRefresh size={12} className="mr-2" />
                  Refresh
                </button>
              ) : null
            )}

            {showFilterActions && (
            <div className="relative">
              <button 
                className={`inline-flex items-center justify-between h-8 px-3 text-xs font-medium rounded-md border focus:outline-none focus:ring-1 focus:ring-opacity-20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 min-w-[100px] ${
                  savedFilters.find((f) => f.selected) 
                    ? 'border-red-500 bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-500' 
                    : 'border-border-color bg-card-color text-font-color hover:bg-primary-10 focus:ring-primary'
                }`}
                onClick={async () => {
                  const next = !filtersOpen;
                  setFiltersOpen(next);
                  if (next) await ensureFiltersLoaded();
                }}
              >
                <div className="flex items-center">
                  <IconFilter size={12} className="mr-2" />
                  {savedFilters.find((f) => f.selected)?.name || 'Filters'}
                </div>
                <IconChevronDown size={12} />
              </button>
              
              {filtersOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setFiltersOpen(false)}
                  />
                  <div 
                    className="absolute right-0 top-full mt-1 min-w-[180px] bg-card-color border border-border-color text-font-color shadow-lg rounded-md z-20"
                    style={{ 
                      backgroundColor: 'var(--card-color)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--font-color)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <button 
                      onClick={() => {
                        setManageOpen(true);
                        setFiltersOpen(false);
                      }} 
                      className="w-full text-left text-sm px-2 py-1.5 hover:bg-primary-10 text-font-color flex items-center"
                    >
                      <IconSettings size={12} className="mr-2" />
                      Save current filter…
                    </button>
                    <div className="border-t border-border-color my-1"></div>
                    <button 
                      onClick={() => {
                        handleUnsetSavedFilter();
                        setFiltersOpen(false);
                      }} 
                      className="w-full text-left text-sm px-2 py-1.5 hover:bg-primary-10 text-font-color flex items-center"
                    >
                      <IconX size={12} className="mr-2" />
                      Reset
                    </button>
                    <div className="border-t border-border-color my-1"></div>
                    <button 
                      onClick={() => {
                        setManageOpen(true);
                        setFiltersOpen(false);
                      }} 
                      className="w-full text-left text-sm px-2 py-1.5 hover:bg-primary-10 text-font-color flex items-center"
                    >
                      <IconSettings size={12} className="mr-2" />
                      Manage filters…
                    </button>
                    {savedFilters.length > 0 && (
                      <>
                        <div className="border-t border-border-color my-1"></div>
                        {savedFilters.map((f) => (
                          <button
                            key={f.id} 
                            onClick={() => {
                              handleSelectSavedFilter(f.id);
                              setFiltersOpen(false);
                            }} 
                            className={`w-full text-left text-sm px-2 py-1.5 hover:bg-primary-10 flex items-center ${f.selected ? 'bg-primary-10' : ''} text-font-color`}
                            style={{ backgroundColor: f.selected ? 'var(--primary-10)' : 'transparent' }}
                          >
                            {f.selected && <IconCheck size={12} className="mr-2 text-primary" />}
                            {!f.selected && <div className="w-3 mr-2" />}
                            <span className={f.selected ? 'font-semibold text-primary' : 'text-font-color'}>{f.name}</span>
                          </button>
                        ))}
                      </>
                    )}
                    {loadingFilters && (
                      <div className="px-2 py-2 text-xs text-font-color-100">Loading filters…</div>
                    )}
                  </div>
                </>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


