import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ReturnTrakRmasOpenPage() {
  return (
    <GridPage
      resource="returntrak-open"
      pageKey="returntrak-rmas-open"
      paginationWord="rmas"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


