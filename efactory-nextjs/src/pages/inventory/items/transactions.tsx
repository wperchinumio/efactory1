import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsTransactionsPage() {
  return (
    <GridPage
      resource="inventory-transactions"
      pageKey="items-transactions"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


