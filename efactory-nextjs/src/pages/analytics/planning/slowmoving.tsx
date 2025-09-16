import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function PlanningSlowMovingPage() {
  return (
    <GridPage
      resource="inventory-slowmoving"
      pageKey="analytics-planning-slowmoving"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


