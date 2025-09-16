import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsStatusPage() {
  return (
    <GridPage
      resource="inventory-status"
      pageKey="items-status"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


