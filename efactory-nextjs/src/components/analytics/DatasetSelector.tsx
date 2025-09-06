import React from 'react';
import { IconShoppingCart, IconList, IconPackage, IconBox } from '@tabler/icons-react';

interface DatasetSelectorProps {
	selectedDataset: 'orders' | 'lines' | 'packages' | 'units';
	onDatasetChange: (dataset: 'orders' | 'lines' | 'packages' | 'units') => void;
	compact?: boolean; // For table view - more compact layout
}

const datasetConfig = {
	orders: {
		label: 'Orders',
		icon: IconShoppingCart,
		color: 'text-blue-600'
	},
	lines: {
		label: 'Lines',
		icon: IconList,
		color: 'text-green-600'
	},
	packages: {
		label: 'Packages',
		icon: IconPackage,
		color: 'text-orange-600'
	},
	units: {
		label: 'Units',
		icon: IconBox,
		color: 'text-purple-600'
	}
};

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
	selectedDataset,
	onDatasetChange,
	compact = false
}) => {
	if (compact) {
		// Compact version for table view header
		return (
			<div className='flex items-center gap-2'>
				<span className='text-[12px] text-font-color-100'>Dataset:</span>
				<div className='flex items-center gap-1'>
					{(['orders', 'lines', 'packages', 'units'] as const).map((dataset) => {
						const config = datasetConfig[dataset];
						const Icon = config.icon;
						return (
							<button
								key={dataset}
								onClick={() => onDatasetChange(dataset)}
								className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
									selectedDataset === dataset
										? 'bg-primary text-white shadow-sm'
										: 'bg-card-bg border border-border-color text-font-color hover:bg-primary-10'
								}`}
								title={`Switch to ${config.label}`}
							>
								<Icon className='w-3 h-3' />
								{config.label}
							</button>
						);
					})}
				</div>
			</div>
		);
	}

	// Full version for chart view
	return (
		<div className='flex-1'>
			<label className='block text-xs font-medium text-font-color-100 uppercase tracking-wider mb-2'>
				Dataset
			</label>
			<div className='flex flex-wrap gap-2'>
				{(['orders', 'lines', 'packages', 'units'] as const).map((dataset) => {
					const config = datasetConfig[dataset];
					const Icon = config.icon;
					return (
						<button
							key={dataset}
							onClick={() => onDatasetChange(dataset)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								selectedDataset === dataset
									? 'bg-primary text-white shadow-sm'
									: 'bg-card-bg border border-border-color text-font-color hover:bg-primary-10'
							}`}
						>
							<Icon className='w-4 h-4' />
							{config.label}
						</button>
					);
				})}
			</div>
		</div>
	);
};
