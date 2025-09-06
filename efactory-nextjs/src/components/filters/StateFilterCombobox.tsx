import React from 'react';
import { IconMapPin, IconX } from '@tabler/icons-react';
import Combobox from '@/components/ui/Combobox';
import { useGlobalFilterData } from '@/hooks/useGlobalFilterData';

interface StateFilterComboboxProps {
	value: string;
	onValueChange: (value: string) => void;
	className?: string;
	disabled?: boolean;
	countryValue?: string; // To determine visibility
}

const StateFilterCombobox = ({ 
	value, 
	onValueChange, 
	className = "",
	disabled = false,
	countryValue = '' // To determine visibility
}: StateFilterComboboxProps) => {
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
			<div className="relative">
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
				{hasActiveSelection && (
					<button
						type="button"
						onClick={() => onValueChange('')}
						className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-border-color rounded transition-colors duration-200 z-10"
						title="Clear state"
					>
						<IconX className="w-3 h-3 text-font-color-100" />
					</button>
				)}
			</div>
		</div>
	);
};

export default StateFilterCombobox;
