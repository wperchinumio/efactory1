import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { postJson } from '@/lib/api/http';

interface ChartRow {
	id?: string;
	name?: string;
	orders?: number;
	lines?: number;
	packages?: number;
	units?: number;
}

export default function AdminAnalyticsByAccount() {
	const [rows, setRows] = useState<ChartRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function runReport() {
		setLoading(true);
		setError(null);
		try {
			const res = await postJson<{ chart?: ChartRow[] }>(
				'/api/analytics',
				{
					stats: 'time_historical_account',
					global_analytics: true,
					filter: { and: [{ field: 'shipped_date', value: '-90D', oper: '=' }] },
				},
			);
			setRows(res.data?.chart || []);
			setLoaded(true);
		} catch (e: any) {
			setError(e?.message || 'Failed to load report');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		runReport();
	}, []);

	const data = useMemo(() => rows, [rows]);

	const ReactApexChart = useMemo(() => dynamic(() => import('react-apexcharts'), { ssr: false }), []);

	const chartSeries = useMemo(() => {
		if (!rows?.length) return [] as any[];
		return [
			{ name: 'Orders', data: rows.map((r) => r.orders ?? 0) },
			{ name: 'Lines', data: rows.map((r) => r.lines ?? 0) },
			{ name: 'Packages', data: rows.map((r) => r.packages ?? 0) },
			{ name: 'Units', data: rows.map((r) => r.units ?? 0) },
		] as any[];
	}, [rows]);

	const chartOptions = useMemo(() => {
		const categories = rows.map((r) => r.name || r.id || '');
		return {
			chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
			stroke: { curve: 'smooth', width: 2 },
			colors: ['var(--chart-color1)', 'var(--chart-color2)', 'var(--chart-color3)', 'var(--chart-color4)'],
			xaxis: { categories },
			yaxis: { labels: { formatter: (v: number) => `${Math.round(v)}` } },
			legend: { position: 'top' },
			grid: { borderColor: 'var(--border-color)' },
		} as any;
	}, [rows]);

	return (
		<div className='md:px-6 sm:px-3 pt-4'>
			<div className='container-fluid'>
				<div className='card bg-card-color border border-dashed border-border-color rounded-2xl p-4 shadow-shadow-lg'>
					<div className='flex items-center justify-between gap-3 mb-4'>
						<div className='text-[18px]/[26px] font-semibold'>Analytics - By Account</div>
						<div className='flex items-center gap-2'>
							<button className='btn btn-secondary' onClick={runReport} disabled={loading}>Run report</button>
						</div>
					</div>
					{loaded && chartSeries.length > 0 ? (
						<div className='md:px-6 -mt-2 mb-4'>
							<ReactApexChart options={chartOptions as any} series={chartSeries as any} type='line' height={300} width='100%' />
						</div>
					) : null}
					{error ? <div className='text-danger text-[13px]'>{error}</div> : null}
					{!loaded && !loading ? (
						<div className='text-[14px] text-font-color-100'>Choose filters and click RUN REPORT.</div>
					) : null}
					{loaded ? (
						<div className='overflow-auto'>
							<table className='w-full min-w-[800px]'>
								<thead>
									<tr className='text-left text-font-color-100 text-[12px]/[1] uppercase border-b border-dashed border-border-color'>
										<th className='py-2 px-2'>Account</th>
										<th className='py-2 px-2 text-right'>Orders</th>
										<th className='py-2 px-2 text-right'>Lines</th>
										<th className='py-2 px-2 text-right'>Packages</th>
										<th className='py-2 px-2 text-right'>Units</th>
									</tr>
								</thead>
								<tbody>
									{data.map((r, i) => (
										<tr key={(r.id || r.name || i).toString()} className='border-b border-dashed border-border-color hover:bg-primary-10'>
											<td className='py-2 px-2'>{r.name || r.id}</td>
											<td className='py-2 px-2 text-right'>{r.orders ?? 0}</td>
											<td className='py-2 px-2 text-right'>{r.lines ?? 0}</td>
											<td className='py-2 px-2 text-right'>{r.packages ?? 0}</td>
											<td className='py-2 px-2 text-right'>{r.units ?? 0}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
