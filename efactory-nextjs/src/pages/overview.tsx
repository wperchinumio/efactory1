import dynamic from 'next/dynamic';
const OverviewPage = dynamic(() => import('@/components/overview/OverviewPage'), { ssr: false });

export default function OverviewRoute() {
  return <OverviewPage/>;
}


