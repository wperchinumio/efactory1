import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function InvoicesAllPage() {
  return (
    <GridPage
      resource="invoice-all"
      pageKey="invoices-all"
      paginationWord="invoice"
      showIndexColumn
      showOrderTypeColumn={false}
      showInvoiceAllColumn={true}
    />
  );
}


