import React from 'react';

interface ChartControlsProps {
	// Dataset selection
	selectedDataset: 'orders' | 'lines' | 'packages' | 'units';
	onDatasetChange: (dataset: 'orders' | 'lines' | 'packages' | 'units') => void;
	
	// Comparison options
	compareYears: boolean;
	onCompareYearsChange: (checked: boolean) => void;
	
	// Show trend line (optional - only for some charts)
	showTrendLine?: boolean;
	onShowTrendLineChange?: (checked: boolean) => void;
	
	// Active filters display
	activeFilters: React.ReactNode;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
	selectedDataset,
	onDatasetChange,
	compareYears,
	onCompareYearsChange,
	showTrendLine,
	onShowTrendLineChange,
	activeFilters
}) => {
	return (
		<div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-6 p-4 bg-primary-5 border border-border-color rounded-lg'>
			{/* Dataset Selection Buttons */}
			<div className='flex-1'>
				<label className='block text-xs font-medium text-font-color-100 uppercase tracking-wider mb-2'>Dataset</label>
				<div className='flex flex-wrap gap-2'>
					{(['orders', 'lines', 'packages', 'units'] as const).map((dataset) => (
						<button
							key={dataset}
							onClick={() => onDatasetChange(dataset)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								selectedDataset === dataset
									? 'bg-primary text-white shadow-sm'
									: 'bg-card-bg border border-border-color text-font-color hover:bg-primary-10'
							}`}
						>
							{dataset.charAt(0).toUpperCase() + dataset.slice(1)}
						</button>
					))}
				</div>
			</div>
			
			{/* Comparison Options */}
			<div className='flex-1'>
				<label className='block text-xs font-medium text-font-color-100 uppercase tracking-wider mb-2'>Options</label>
				<div className='space-y-3'>
					<div className="form-check">
						<input
							type="checkbox"
							id="compareYears"
							checked={compareYears}
							onChange={(e) => onCompareYearsChange(e.target.checked)}
							className="form-check-input"
						/>
						<label className="form-check-label" htmlFor="compareYears">
							Compare to previous 2 years
						</label>
					</div>
					{/* Show Trend Line checkbox - only render if props are provided */}
					{showTrendLine !== undefined && onShowTrendLineChange && (
						<div className="form-check">
							<input
								type="checkbox"
								id="showTrendLine"
								checked={showTrendLine}
								onChange={(e) => onShowTrendLineChange(e.target.checked)}
								className="form-check-input"
							/>
							<label className="form-check-label" htmlFor="showTrendLine">
								Show Trend Line
							</label>
						</div>
					)}
				</div>
			</div>
			
			{/* Active Filters Display */}
			<div className='flex-1'>
				<label className='block text-xs font-medium text-font-color-100 uppercase tracking-wider mb-2'>Active Filters</label>
				<div className='space-y-1 text-xs text-font-color-100'>
					{activeFilters}
				</div>
			</div>
		</div>
	);
};
