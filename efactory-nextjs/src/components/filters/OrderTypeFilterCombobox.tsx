import React from 'react';
import { IconCloud } from '@tabler/icons-react';
import Combobox from '@/components/ui/Combobox';
import { useGlobalFilterData } from '@/hooks/useGlobalFilterData';

interface OrderTypeFilterComboboxProps {
	value?: string;
	onValueChange: (value: string) => void;
	className?: string;
	disabled?: boolean;
}

const OrderTypeFilterCombobox = ({ 
	value = '', 
	onValueChange, 
	className = "",
	disabled = false 
}: OrderTypeFilterComboboxProps) => {
	const globalData = useGlobalFilterData();
	
	// Get order type options from global data
	const orderTypeOptions = globalData?.loading ? [] : (globalData?.getFilterOptions?.()?.getOrderTypeOptions?.() || [
		{ value: 'STANDARD', label: 'Standard' },
		{ value: 'RUSH', label: 'Rush' },
		{ value: 'EXPEDITED', label: 'Expedited' },
		{ value: 'BACKORDER', label: 'Backorder' },
		{ value: 'DROPSHIP', label: 'Dropship' }
	]);
	
	const hasActiveSelection = value && value !== '';

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				CHANNEL
			</label>
			<Combobox
				value={value}
				onValueChange={onValueChange}
				options={orderTypeOptions}
				placeholder="Select channel..."
				searchPlaceholder="Search channels..."
				icon={IconCloud}
				disabled={disabled}
				emptyMessage="No channels found."
			/>
		</div>
	);
};

export default OrderTypeFilterCombobox;
