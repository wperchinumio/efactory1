import React from 'react';
import { IconMapPin } from '@tabler/icons-react';
import Combobox from '@/components/ui/Combobox';
import { useGlobalFilterData } from '@/hooks/useGlobalFilterData';

const StateFilterCombobox = ({ 
	value, 
	onValueChange, 
	className = "",
	disabled = false,
	countryValue = '' // To determine visibility
}) => {
	const globalData = useGlobalFilterData();
	
	// Get state options from global data using the getFilterOptions function
	// Always show the filter, but change options based on country selection
	const stateOptions = globalData?.loading 
		? [] 
		: countryValue 
			? globalData?.getFilterOptions?.()?.getStateOptions?.(countryValue) || []
			: [{ value: '', label: 'Select country first' }];
	
	const hasActiveSelection = value && value !== '';
	
	// Disable the filter when no country is selected
	const isDisabled = disabled || !countryValue;

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				STATE
			</label>
			<Combobox
				value={value}
				onValueChange={onValueChange}
				options={stateOptions}
				placeholder={countryValue ? "Select state..." : "Select country first"}
				searchPlaceholder="Search states..."
				icon={IconMapPin}
				disabled={isDisabled}
				emptyMessage="No states found."
				showSearch={countryValue ? true : false}
			/>
		</div>
	);
};

export default StateFilterCombobox;
