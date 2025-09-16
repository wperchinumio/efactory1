import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ReturnTrakRmasItemsPage() {
  return (
    <GridPage
      resource="returntrak-items"
      pageKey="returntrak-rmas-items"
      paginationWord="rows"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


