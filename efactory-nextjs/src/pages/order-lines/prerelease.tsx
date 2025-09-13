import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrderLinesPrereleasePage() {
  return (
    <GridPage
      resource="fulfillment-lines-risk"
      pageKey="order-lines-prerelease"
      paginationWord="lines"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
