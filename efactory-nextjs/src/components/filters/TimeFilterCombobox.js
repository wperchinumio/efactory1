import React from 'react';
import { IconClock } from '@tabler/icons-react';
import Combobox from '@/components/ui/Combobox';

const TimeFilterCombobox = ({ 
	value, 
	onValueChange, 
	className = "",
	disabled = false 
}) => {
	const timeOptions = [
		{ value: 'daily', label: 'Daily' },
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'quarterly', label: 'Quarterly' },
		{ value: 'yearly', label: 'Yearly' }
	];

	// Time filter always has a selection (default: weekly), so title is always red
	const hasActiveSelection = true;

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				TIME
			</label>
			<Combobox
				value={value}
				onValueChange={onValueChange}
				options={timeOptions}
				placeholder="Select time..."
				icon={IconClock}
				disabled={disabled}
				showSearch={false}
			/>
		</div>
	);
};

export default TimeFilterCombobox;
