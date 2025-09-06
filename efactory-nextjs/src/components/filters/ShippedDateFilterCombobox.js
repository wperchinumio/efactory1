import React from 'react';
import { IconCalendar } from '@tabler/icons-react';
import DateRangeCombobox from '@/components/ui/DateRangeCombobox';

const ShippedDateFilterCombobox = ({ 
	value, 
	onValueChange, 
	className = "",
	disabled = false 
}) => {
	// Shipped date filter always has a selection (default: -90D), so title is always red
	// Also, no "Clear Date" option for this filter
	const hasActiveSelection = true;

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				SHIPPED DATE
			</label>
			<DateRangeCombobox
				value={value}
				onValueChange={onValueChange}
				placeholder="Select date range..."
				title="Shipped Date"
				allowClear={false} // No clear option for shipped date
				disabled={disabled}
			/>
		</div>
	);
};

export default ShippedDateFilterCombobox;
