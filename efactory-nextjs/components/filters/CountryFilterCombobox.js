import React from 'react';
import { IconWorld, IconX } from '@tabler/icons-react';
import Combobox from '@/components/ui/Combobox';
import { useGlobalFilterData } from '@/hooks/useGlobalFilterData';

const CountryFilterCombobox = ({ 
	value, 
	onValueChange, 
	className = "",
	disabled = false 
}) => {
	const globalData = useGlobalFilterData();
	
	// Get country options from global data using the getFilterOptions function
	const countryOptions = globalData?.loading ? [] : globalData?.getFilterOptions?.()?.getCountryOptions?.() || [];
	
	const hasActiveSelection = value && value !== '';

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				COUNTRY
			</label>
			<div className="relative">
				<Combobox
					value={value}
					onValueChange={onValueChange}
					options={countryOptions}
					placeholder="Select country..."
					searchPlaceholder="Search countries..."
					icon={IconWorld}
					disabled={disabled}
					emptyMessage="No countries found."
				/>
				{hasActiveSelection && (
					<button
						type="button"
						onClick={() => onValueChange('')}
						className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-border-color rounded transition-colors duration-200 z-10"
						title="Clear country"
					>
						<IconX className="w-3 h-3 text-font-color-100" />
					</button>
				)}
			</div>
		</div>
	);
};

export default CountryFilterCombobox;
