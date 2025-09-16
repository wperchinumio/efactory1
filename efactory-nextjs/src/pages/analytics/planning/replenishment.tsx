import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function PlanningReplenishmentPage() {
  return (
    <GridPage
      resource="inventory-replenishment"
      pageKey="analytics-planning-replenishment"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


