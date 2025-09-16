import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsAsOfADatePage() {
  return (
    <GridPage
      resource="inventory-asofadate"
      pageKey="items-asofadate"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


