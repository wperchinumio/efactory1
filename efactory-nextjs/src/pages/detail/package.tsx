import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function DetailPackagePage() {
  return (
    <GridPage
      resource="fulfillment-package"
      pageKey="detail-package"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
