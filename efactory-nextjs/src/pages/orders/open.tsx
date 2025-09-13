import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { LunoAgGrid } from '@/components/common/AgGrid/LunoAgGrid';
import { listGridViews, readGridRows } from '@/services/api';
import { getFiltersForPage } from '@/lib/filters/filterConfigs';
import type { GridFilter, GridRowResponse, GridSelectedView } from '@/types/api/grid';

export default function OrdersOpenPage() {
  const [viewsUrl, setViewsUrl] = useState<string>('');
  const [resource, setResource] = useState<string>('fulfillment-open');
  const [selectedView, setSelectedView] = useState<GridSelectedView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const viewData = await listGridViews('fulfillment-open');
        setViewsUrl(viewData.url);
        const selected = viewData.views.find(v => v.selected) || viewData.views[0];
        setSelectedView(selected?.view || null);
      } catch (err) {
        console.error('Failed to load grid view:', err);
        setError('Failed to load orders data. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onFetchRows = useCallback(
    async (page: number, pageSize: number, filter: GridFilter, sort: any, filter_id?: any): Promise<GridRowResponse<any>> => {
      if (!viewsUrl || !selectedView) return { resource, total: 0, rows: [] };
      try {
        return await readGridRows<any>(viewsUrl, {
          action: 'read',
          fields: ['*'],
          filter,
          page_num: page,
          page_size: pageSize,
          resource,
          sort,
          filter_id: filter_id ?? '',
        });
      } catch (err) {
        console.error('Failed to fetch rows:', err);
        return { resource, total: 0, rows: [] };
      }
    },
    [viewsUrl, resource, selectedView]
  );

  const onRowClicked = useCallback((row: any) => {
    console.log('Row clicked:', row);
    // TODO: Implement row click handler (e.g., navigate to order detail)
  }, []);

  const header = useMemo(() => ({
    pageIcon: 'icon-book-open',
    pageTitle: 'ORDERS',
    pageSubtitle: 'OPEN',
  }), []);

  // Get filter configuration for orders-open page
  const filters = useMemo(() => getFiltersForPage('orders-open'), []);

  if (loading) {
    return (
      <div>
        <PageHeader iconClassName={header.pageIcon} title={`${header.pageTitle} · ${header.pageSubtitle}`} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader iconClassName={header.pageIcon} title={`${header.pageTitle} · ${header.pageSubtitle}`} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedView) {
    return (
      <div>
        <PageHeader iconClassName={header.pageIcon} title={`${header.pageTitle} · ${header.pageSubtitle}`} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-muted text-6xl mb-4">📊</div>
            <p className="text-muted">No view configuration found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <PageHeader iconClassName={header.pageIcon} title={`${header.pageTitle} · ${header.pageSubtitle}`} />
      <LunoAgGrid
        resource={resource}
        rowsUrl={viewsUrl}
        selectedView={selectedView}
        paginationWord="orders"
        onFetchRows={onFetchRows}
        onRowClicked={onRowClicked}
        showIndexColumn
        showOrderTypeColumn
        filters={filters}
        showFilters={true}
      />
    </div>
  );
}


