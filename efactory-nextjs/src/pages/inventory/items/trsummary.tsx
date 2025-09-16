import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsTransactionSummaryPage() {
  return (
    <GridPage
      resource="inventory-transaction-summary"
      pageKey="items-trsummary"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


