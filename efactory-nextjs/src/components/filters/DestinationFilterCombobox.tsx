import React from 'react';
import { IconMapPin } from '@tabler/icons-react';
import Combobox from '@/components/ui/Combobox';

interface DestinationFilterComboboxProps {
	value: string;
	onValueChange: (value: string) => void;
	className?: string;
	disabled?: boolean;
}

const DestinationFilterCombobox = ({ 
	value, 
	onValueChange, 
	className = "",
	disabled = false 
}: DestinationFilterComboboxProps) => {
	// Hardcoded destination options (not from API)
	const destinationOptions = [
		{ value: '', label: 'All Destinations' },
		{ value: '0', label: 'Domestic' },
		{ value: '1', label: 'International' }
	];

	const hasActiveSelection = value && value !== '';

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				DESTINATION
			</label>
			<Combobox
				value={value}
				onValueChange={onValueChange}
				options={destinationOptions}
				placeholder="Select destination..."
				icon={IconMapPin}
				disabled={disabled}
				showSearch={false}
			/>
		</div>
	);
};

export default DestinationFilterCombobox;
