import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function InvoicesFreightChargesPage() {
  return (
    <GridPage
      resource="freight-charges"
      pageKey="invoices-freight-charges"
      paginationWord="records"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


