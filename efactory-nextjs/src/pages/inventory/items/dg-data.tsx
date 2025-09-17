import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsDGDataPage() {
  return (
    <GridPage
      resource="inventory-dangerous-goods"
      pageKey="inventory-dangerous-goods"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


