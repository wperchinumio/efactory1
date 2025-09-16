import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsDGDataPage() {
  return (
    <GridPage
      resource="inventory-dangerous-goods"
      pageKey="items-dg-data"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


