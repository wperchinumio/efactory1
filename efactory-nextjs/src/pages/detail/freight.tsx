import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function DetailFreightPage() {
  return (
    <GridPage
      resource="fulfillment-freight"
      pageKey="detail-freight"
      paginationWord="packages"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
