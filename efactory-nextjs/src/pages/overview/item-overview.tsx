import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import ItemOverview from '@/components/overview/ItemOverview';
import type { ItemDetailResponseData } from '@/types/api/inventory';

export default function ItemOverviewPage() {
  const router = useRouter();
  const { itemNum } = router.query as { itemNum?: string };
  const [data, setData] = useState<ItemDetailResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemNum) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { readItemDetail } = await import('@/services/api');
        const { getAuthToken } = await import('@/lib/auth/storage');
        const token = getAuthToken();
        const account = token?.user_data?.account || '';
        const region = (token?.user_data as any)?.region || (token?.user_data?.calc_locations?.[0] ?? '');
        const account_wh = account && region ? `${account}.${region}` : '';
        const payload: any = { action: 'item_detail', item_number: itemNum, warehouse: '', account_wh, weeks: false };
        const result = await readItemDetail(payload);
        setData(result);
      } catch (e) {
        setError('Failed to load item data');
      } finally {
        setLoading(false);
      }
    })();
  }, [itemNum]);

  const onClose = () => router.back();
  const onRefresh = () => {
    if (itemNum) {
      router.replace(router.asPath, undefined, { shallow: true });
    }
  };

  return (
    <Layout>
      {loading && <div className="p-6">Loading...</div>}
      {error && <div className="p-6 text-red-600">{error}</div>}
      {data && !loading && !error && (
        <div className="mt-4">
          <ItemOverview data={data} onClose={onClose} onRefresh={onRefresh} />
        </div>
      )}
    </Layout>
  );
}



