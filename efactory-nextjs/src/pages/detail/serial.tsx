import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function DetailSerialPage() {
  return (
    <GridPage
      resource="fulfillment-serial"
      pageKey="detail-serial"
      paginationWord="serial numbers"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
