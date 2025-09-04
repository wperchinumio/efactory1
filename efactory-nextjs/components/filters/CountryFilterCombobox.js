import React from 'react';
import { IconWorld } from '@tabler/icons-react';
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
	const countryOptions = globalData?.loading ? [] : globalData?.getFilterOptions?.()?.countryOptions || [];
	
	const hasActiveSelection = value && value !== '';

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				COUNTRY
			</label>
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
		</div>
	);
};

export default CountryFilterCombobox;
