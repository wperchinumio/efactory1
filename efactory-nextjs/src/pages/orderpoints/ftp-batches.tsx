import React, { useMemo, useRef, useState } from 'react';
import type { GridFieldDef, GridFilter, GridRowResponse, GridSelectedView, GridSortSpec } from '@/types/api/grid';
import type { FtpBatchRow } from '@/types/api/orderpoints';
import LunoAgGrid from '@/components/common/AgGrid/LunoAgGrid';
import GridToolbar from '@/components/common/GridToolbar';
import type { FilterConfig } from '@/types/api/filters';
import { DateTimeRenderer, NumberRenderer, FtpAckFileRenderer, FtpBatchFileRenderer, FtpTotalImportedRenderer } from '@/components/common/AgGrid/renderers';
import { listFtpBatches } from '@/services/api';

// Fixed column definitions based on legacy viewFieldsConfig.js
function getFixedColumns(): GridFieldDef[] {
  const fields: GridFieldDef[] = [
    // Index column is provided by LunoAgGrid (showIndexColumn)
    { field: 'account_number', alias: 'ACCT #', sortable: true, align: 'left', width: 55 },
    { field: 'location', alias: 'Warehouse', sortable: true, align: 'center', width: 100 },
    { field: 'received_date', alias: 'Received Date', sortable: true, align: 'left', width: 120, render: 'fmtdatetime' },
    { field: 'name', alias: 'Batch Name', sortable: true, align: 'left', width: 130 },
    { field: 'filename', alias: 'Batch File', sortable: false, align: 'left', width: 180, render: 'downloadbatch' as any },
    { field: 'ack_filename', alias: 'Ack File', sortable: false, align: 'left', width: 150, render: 'downloadackfile' as any },
    { field: 'total_orders', alias: 'Tot Orders', sortable: true, align: 'right', width: 100, render: 'fmtnumber,0,false,true' },
    { field: 'total_imported', alias: 'Tot Imported', sortable: true, align: 'right', width: 115, render: 'totalimported' as any },
    { field: 'error_message', alias: 'Error Message', sortable: false, align: 'left', width: 285 },
    { field: 'has_email', alias: 'View Report', sortable: false, align: 'center', width: 120 },
  ];
  return fields;
}

// Map legacy render ids to custom cell renderers for this page
function useRendererOverrides() {
  return {
    fmtdatetime: (p: any) => <DateTimeRenderer value={p.value} />,
    fmtnumber: (p: any) => <NumberRenderer value={p.value} decimals={0} strong={false} dimZero={true} hideNull={false} />,
    downloadbatch: (p: any) => <FtpBatchFileRenderer data={p.data} />,
    downloadackfile: (p: any) => <FtpAckFileRenderer data={p.data} />,
    totalimported: (p: any) => <FtpTotalImportedRenderer value={p.value} data={p.data} />,
  } as Record<string, (p: any) => React.ReactNode>;
}

export default function FtpBatchesPage() {
  // Build a pseudo-view so LunoAgGrid can render without /views
  const selectedView: GridSelectedView = useMemo(() => ({
    id: 0,
    fields: getFixedColumns(),
    filter: { and: [
      { field: 'received_date', oper: '=', value: '0D' },
      { field: 'with_error', oper: '=', value: true },
    ]},
    sort: [{ field: 'received_date', dir: 'desc' }],
    rows_per_page: 100,
  }), []);

  const rendererOverrides = useRendererOverrides();

  // Custom fetch using /api/orderpoints action=list_batches
  async function onFetchRows(page: number, pageSize: number, filter: GridFilter, sort: Array<Record<string, 'asc' | 'desc'>>): Promise<GridRowResponse<FtpBatchRow>> {
    try {
      const res = await listFtpBatches(page, pageSize, filter, sort);
      return { resource: 'ftp-batches', rows: res.rows, total: res.total };
    } catch (e) {
      return { resource: 'ftp-batches', rows: [], total: 0 };
    }
  }

  // Inject our custom renderers by temporarily monkey-patching the map function
  // This leverages the existing mapping in LunoAgGrid which uses string ids
  const [refreshKey, setRefreshKey] = useState(0);
  const gridApiRef = useRef<{ refresh: () => void } | null>(null);

  // Predefined filter set (ACCOUNT, RECEIVED DATE, WITH ERROR ONLY)
  const filters: Record<string, FilterConfig> = useMemo(() => ({
    account_number: {
      field: 'account_number',
      title: 'ACCOUNT',
      type: 'DROPDOWN_QF',
      options: [],
      iconClassName: 'fa fa-user',
      width: '100px'
    } as any,
    received_date: {
      field: 'received_date',
      title: 'RECEIVED DATE',
      type: 'DATE_RANGE_CUSTOM_QF',
      iconClassName: 'fa fa-calendar',
      width: '140px',
      allowClear: false
    } as any,
    with_error: {
      field: 'with_error',
      title: 'WITH ERROR ONLY',
      type: 'BOOLEAN_QF'
    } as any,
  }), []);

  return (
    <div>
      <GridToolbar
        resource="ftp-batches"
        rowsUrl="/api/orderpoints"
        views={[{ id: 0, name: 'Fixed', selected: true } as any]}
        selectedViewId={0}
        title={'FTP BATCHES'}
        onRefresh={() => {
          if (gridApiRef.current) { try { gridApiRef.current.refresh(); return; } catch {} }
          setRefreshKey((v) => v + 1);
        }}
        onViewChange={() => {}}
        currentFilter={selectedView.filter}
        currentSort={selectedView.sort.map(s => ({ [s.field as string]: s.dir })) as any}
        showViewsActions={false}
        showFilterActions={false}
        showRefresh={true}
      />

      <LunoAgGrid<FtpBatchRow>
        key={refreshKey}
        resource="ftp-batches"
        rowsUrl="/api/orderpoints"
        selectedView={selectedView}
        onFetchRows={(page, size, filter, serverSort) => onFetchRows(page, size, filter, serverSort as any)}
        paginationWord="record"
        showIndexColumn={true}
        showOrderTypeColumn={false}
        showFilters={true}
        filters={filters}
        onProvideRefresh={(api) => { gridApiRef.current = { refresh: api.refresh }; }}
      />
    </div>
  );
}


