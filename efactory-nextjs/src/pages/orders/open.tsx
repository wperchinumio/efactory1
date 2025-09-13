import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { LunoAgGrid } from '@/components/common/AgGrid/LunoAgGrid';
import { listGridViews, readGridRows } from '@/services/api';
import type { GridFilter, GridRowResponse, GridSelectedView } from '@/types/api/grid';

export default function OrdersOpenPage() {
  const [viewsUrl, setViewsUrl] = useState<string>('');
  const [resource, setResource] = useState<string>('fulfillment-open');
  const [selectedView, setSelectedView] = useState<GridSelectedView | null>(null);

  useEffect(() => {
    (async () => {
      const viewData = await listGridViews('fulfillment-open');
      setViewsUrl(viewData.url);
      const selected = viewData.views.find(v => v.selected) || viewData.views[0];
      setSelectedView(selected?.view || null);
    })();
  }, []);

  const onFetchRows = useCallback(
    async (page: number, pageSize: number, filter: GridFilter, sort: any, filter_id?: any): Promise<GridRowResponse<any>> => {
      if (!viewsUrl || !selectedView) return { resource, total: 0, rows: [] };
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
    },
    [viewsUrl, resource, selectedView]
  );

  const header = useMemo(() => ({
    pageIcon: 'icon-book-open',
    pageTitle: 'ORDERS',
    pageSubtitle: 'OPEN',
  }), []);

  return (
    <div className="space-y-4">
      <PageHeader iconClassName={header.pageIcon} title={`${header.pageTitle} · ${header.pageSubtitle}`} />
      {selectedView && (
        <LunoAgGrid
          resource={resource}
          rowsUrl={viewsUrl}
          selectedView={selectedView}
          paginationWord="orders"
          onFetchRows={onFetchRows}
          showIndexColumn
          showOrderTypeColumn
        />
      )}
    </div>
  );
}


