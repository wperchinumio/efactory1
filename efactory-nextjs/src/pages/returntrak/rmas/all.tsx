import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ReturnTrakRmasAllPage() {
  return (
    <GridPage
      resource="returntrak-all"
      pageKey="returntrak-rmas-all"
      paginationWord="rmas"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


