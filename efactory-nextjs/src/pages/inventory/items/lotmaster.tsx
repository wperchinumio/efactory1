import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsLotMasterPage() {
  return (
    <GridPage
      resource="inventory-lotmaster"
      pageKey="items-lotmaster"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


