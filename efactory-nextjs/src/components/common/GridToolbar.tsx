import React, { useEffect, useMemo, useState } from 'react';
import { Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/shadcn/dropdown-menu';
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
  filterState
}: GridToolbarProps) {
  const [savedFilters, setSavedFilters] = useState<{ id: number; name: string; selected?: boolean }[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const selectedLabel = useMemo(() => {
    const meta = views.find(v => v.id === selectedViewId) || views.find(v => v.selected);
    return meta?.name || 'Views';
  }, [views, selectedViewId]);
  const [exporting, setExporting] = useState<'excel' | 'csv' | 'zip' | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const selectedView = useMemo(() => views.find((v) => v.selected) || views.find((v) => v.id === selectedViewId) || views[0], [views, selectedViewId]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingFilters(true);
        const list = await listSavedFilters(resource);
        setSavedFilters(list as any);
      } catch {
        setSavedFilters([]);
      } finally {
        setLoadingFilters(false);
      }
    })();
  }, [resource]);

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
      
      {/* Luno-themed toolbar */}
      <div className="bg-card-color border border-border-color rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <div className="flex items-center">
            <h2 className="text-sm font-semibold text-font-color">
              {title}
            </h2>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Views Split Button */}
            <div className="inline-flex rounded-md border border-border-color bg-card-color shadow-sm">
              {/* Left side - Refresh button */}
              <button 
                onClick={() => {
                  // Refresh the grid by calling the API again
                  onRefresh?.();
                }}
                className="inline-flex items-center h-8 px-3 text-xs font-medium rounded-l-md border-r border-border-color bg-card-color text-font-color hover:bg-primary-10 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 min-w-[100px]"
              >
                <IconRefresh size={12} className="mr-2" />
                {selectedLabel}
              </button>
              
              {/* Right side - Dropdown trigger */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="inline-flex items-center justify-center h-8 px-2 text-xs font-medium rounded-r-md bg-card-color text-font-color hover:bg-primary-10 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <IconChevronDown size={12} />
                  </button>
                </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="min-w-[200px] bg-card-color border-border-color text-font-color shadow-lg" 
                align="end"
                style={{ 
                  backgroundColor: 'var(--card-color)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--font-color)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
              >
                <DropdownMenuLabel className="text-xs font-medium text-font-color px-2 py-1.5">Views</DropdownMenuLabel>
                {views.map((v) => (
                  <DropdownMenuItem 
                    key={v.id} 
                    onClick={() => handleSelectView(v.id)} 
                    className={`text-xs px-2 py-1.5 hover:bg-primary-10 ${v.selected ? 'bg-primary-10' : ''}`}
                    style={{ backgroundColor: v.selected ? 'var(--primary-10)' : 'transparent' }}
                  >
                    <div className="w-3 h-3 mr-2 flex items-center justify-center">
                      {v.selected && <IconCheck size={12} className="text-primary" />}
                    </div>
                    <span className={v.selected ? 'font-semibold text-primary' : 'text-font-color'}>{v.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-border-color" />
                <DropdownMenuItem 
                  onClick={() => setManageOpen(true)} 
                  className="text-xs px-2 py-1.5 hover:bg-primary-10 text-font-color"
                >
                  <IconSettings size={12} className="mr-2" />
                  Customize…
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border-color" />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="text-xs px-2 py-1.5 hover:bg-primary-10 text-font-color">
                    <IconDownload size={12} className="mr-2" />
                    Export To
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent 
                    className="bg-card-color border-border-color text-font-color shadow-lg"
                    style={{ 
                      backgroundColor: 'var(--card-color)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--font-color)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <DropdownMenuItem 
                      onClick={() => handleExport('excel')} 
                      disabled={!!exporting} 
                      className="text-xs px-2 py-1.5 hover:bg-primary-10 text-font-color"
                    >
                      {exporting === 'excel' ? 'Exporting…' : 'Excel'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleExport('csv')} 
                      disabled={!!exporting} 
                      className="text-xs px-2 py-1.5 hover:bg-primary-10 text-font-color"
                    >
                      {exporting === 'csv' ? 'Exporting…' : 'CSV'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleExport('zip')} 
                      disabled={!!exporting} 
                      className="text-xs px-2 py-1.5 hover:bg-primary-10 text-font-color"
                    >
                      {exporting === 'zip' ? 'Exporting…' : 'Zip'}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="bg-border-color" />
                <DropdownMenuItem 
                  onClick={() => setScheduleOpen(true)} 
                  className="text-xs px-2 py-1.5 hover:bg-primary-10 text-font-color"
                >
                  <IconCalendar size={12} className="mr-2" />
                  Schedule report…
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`inline-flex items-center justify-between h-8 px-3 text-xs font-medium rounded-md border focus:outline-none focus:ring-1 focus:ring-opacity-20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 min-w-[100px] ${
                    savedFilters.find((f) => f.selected) 
                      ? 'border-red-500 bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-500' 
                      : 'border-border-color bg-card-color text-font-color hover:bg-primary-10 focus:ring-primary'
                  }`}
                >
                  <div className="flex items-center">
                    <IconFilter size={12} className="mr-2" />
                    {savedFilters.find((f) => f.selected)?.name || 'Filters'}
                  </div>
                  <IconChevronDown size={12} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="min-w-[180px] bg-card-color border-border-color text-font-color shadow-lg" 
                align="end"
                style={{ 
                  backgroundColor: 'var(--card-color)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--font-color)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
              >
                <DropdownMenuItem 
                  onClick={() => setManageOpen(true)} 
                  className="text-xs px-2 py-1.5 hover:bg-primary-10 text-font-color"
                >
                  <IconSettings size={12} className="mr-2" />
                  Save current filter…
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border-color" />
                <DropdownMenuItem 
                  onClick={handleUnsetSavedFilter} 
                  className="text-xs px-2 py-1.5 hover:bg-primary-10 text-font-color"
                >
                  <IconX size={12} className="mr-2" />
                  Reset
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border-color" />
                <DropdownMenuItem 
                  onClick={() => setManageOpen(true)} 
                  className="text-xs px-2 py-1.5 hover:bg-primary-10 text-font-color"
                >
                  <IconSettings size={12} className="mr-2" />
                  Manage filters…
                </DropdownMenuItem>
                {savedFilters.length > 0 && <DropdownMenuSeparator className="bg-border-color" />}
                {savedFilters.map((f) => (
                  <DropdownMenuItem 
                    key={f.id} 
                    onClick={() => handleSelectSavedFilter(f.id)} 
                    className={`text-xs px-2 py-1.5 hover:bg-primary-10 ${f.selected ? 'bg-primary-10' : ''} text-font-color`}
                    style={{ backgroundColor: f.selected ? 'var(--primary-10)' : 'transparent' }}
                  >
                    {f.selected && <IconCheck size={12} className="mr-2 text-primary" />}
                    {!f.selected && <div className="w-3 mr-2" />}
                    <span className={f.selected ? 'font-semibold text-primary' : 'text-font-color'}>{f.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}


