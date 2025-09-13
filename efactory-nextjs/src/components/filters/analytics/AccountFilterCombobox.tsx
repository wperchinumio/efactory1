import React from 'react';
import { IconUser } from '@tabler/icons-react';
import MultiSelectCombobox from '@/components/ui/MultiSelectCombobox';
import { useGlobalFilterData } from '@/hooks/useGlobalFilterData';

interface AccountFilterComboboxProps {
	value?: string[];
	onValueChange: (value: string[]) => void;
	className?: string;
	disabled?: boolean;
}

const AccountFilterCombobox = ({ 
	value = [], 
	onValueChange, 
	className = "",
	disabled = false 
}: AccountFilterComboboxProps) => {
	const globalData = useGlobalFilterData();
	
	// Get account options from global data using the getFilterOptions function
	const accountOptions = globalData?.loading ? [] : globalData?.getFilterOptions?.()?.getAccountOptions?.([]) || [];
	
	
	const hasActiveSelection = Array.isArray(value) && value.length > 0;

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				ACCOUNT
			</label>
			<MultiSelectCombobox
				value={value}
				onValueChange={onValueChange}
				options={accountOptions}
				placeholder="Select accounts..."
				searchPlaceholder="Search accounts..."
				icon={IconUser}
				disabled={disabled}
				emptyMessage="No accounts found."
				title="Account"
			/>
		</div>
	);
};

export default AccountFilterCombobox;
