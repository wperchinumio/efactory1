import { IconFilter, IconChartBar, IconTable, IconX } from '@tabler/icons-react';

interface AnalyticsFilterHeaderProps {
	viewMode: string;
	onViewModeChange: (mode: string) => void;
	hasActiveFilters: boolean;
	onClearAllFilters: () => void;
	showViewModeToggle?: boolean;
	showClearAllButton?: boolean;
	showActiveFilters?: boolean;
	title?: string;
	subtitle?: string;
	children?: React.ReactNode;
}

const AnalyticsFilterHeader = ({
	viewMode,
	onViewModeChange,
	hasActiveFilters,
	onClearAllFilters,
	showViewModeToggle = true,
	showClearAllButton = true,
	showActiveFilters = false,
	title = "Filters",
	subtitle = "Configure your report parameters",
	children
}: AnalyticsFilterHeaderProps) => {
	return (
		<div className='bg-card-color border border-border-color rounded-xl overflow-hidden mb-6'>
			{/* Filter Header */}
			<div className='bg-primary-10 border-b border-border-color px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center'>
							<IconFilter className='w-4 h-4' />
						</div>
						<div>
							<h3 className='text-[16px] font-bold text-font-color'>{title}</h3>
							<p className='text-[12px] text-font-color-100'>{subtitle}</p>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						{/* VIEW MODE Toggle */}
						{showViewModeToggle && (
							<div className='flex items-center gap-3'>
								<span className='text-[12px] font-semibold text-font-color-100 uppercase tracking-wider'>View Mode:</span>
								<div className='flex border border-border-color rounded-lg overflow-hidden'>
									<button
										onClick={() => onViewModeChange('chart')}
										className={`px-3 py-1.5 text-[12px] font-medium flex items-center gap-2 transition-colors ${
											viewMode === 'chart' 
												? 'bg-primary text-white' 
												: 'bg-card-color text-font-color-100 hover:bg-primary-10'
										}`}
									>
										<IconChartBar className='w-3 h-3' />
										Chart View
									</button>
									<div className='w-px h-6 bg-border-color opacity-50'></div>
									<button
										onClick={() => onViewModeChange('table')}
										className={`px-3 py-1.5 text-[12px] font-medium flex items-center gap-2 transition-colors ${
											viewMode === 'table' 
												? 'bg-primary text-white' 
												: 'bg-card-color text-font-color-100 hover:bg-primary-10'
										}`}
									>
										<IconTable className='w-3 h-3' />
										Table View
									</button>
								</div>
							</div>
						)}

						{/* Vertical Separator */}
						{showViewModeToggle && showClearAllButton && (
							<div className='w-px h-6 bg-border-color opacity-50'></div>
						)}

						{/* Clear All Filters Button */}
						{showClearAllButton && (
							<button 
								className={`btn btn-sm ${hasActiveFilters ? 'btn-light-secondary' : 'btn-light-secondary opacity-75'}`}
								onClick={onClearAllFilters}
								title='Clear All Filters'
							>
								<IconX className='w-3 h-3 me-1' />
								Clear All
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Filter Controls */}
			{children && (
				<div className='p-6'>
					{showActiveFilters ? children : (
						// Only render the first child (filter controls), skip Active Filters Summary
						Array.isArray(children) ? children[0] : children
					)}
				</div>
			)}
		</div>
	);
};

export default AnalyticsFilterHeader;
