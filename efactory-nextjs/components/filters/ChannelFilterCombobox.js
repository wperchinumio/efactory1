import React from 'react';
import { IconShoppingCart } from '@tabler/icons-react';
import MultiSelectCombobox from '@/components/ui/MultiSelectCombobox';
import { useGlobalFilterData } from '@/hooks/useGlobalFilterData';

const ChannelFilterCombobox = ({ 
	value = [], 
	onValueChange, 
	className = "",
	disabled = false 
}) => {
	const globalData = useGlobalFilterData();
	
	// Get channel options from global data using the getFilterOptions function
	const channelOptions = globalData?.loading ? [] : globalData?.getFilterOptions?.()?.getChannelOptions?.() || [];
	
	
	const hasActiveSelection = Array.isArray(value) && value.length > 0;

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				CHANNEL
			</label>
			<MultiSelectCombobox
				value={value}
				onValueChange={onValueChange}
				options={channelOptions}
				placeholder="Select channels..."
				searchPlaceholder="Search channels..."
				icon={IconShoppingCart}
				disabled={disabled}
				emptyMessage="No channels found."
				title="Channel"
			/>
		</div>
	);
};

export default ChannelFilterCombobox;
