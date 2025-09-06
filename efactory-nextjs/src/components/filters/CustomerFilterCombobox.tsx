import React from 'react';
import { IconBuilding } from '@tabler/icons-react';

interface CustomerFilterComboboxProps {
	value?: string;
	onValueChange: (value: string) => void;
	className?: string;
	disabled?: boolean;
}

const CustomerFilterCombobox = ({ 
	value = '', 
	onValueChange, 
	className = "",
	disabled = false 
}: CustomerFilterComboboxProps) => {
	const hasActiveSelection = value && value !== '';

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				CUSTOMER
			</label>
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<IconBuilding className="h-4 w-4 text-font-color-100" />
				</div>
				<input
					type="text"
					value={value}
					onChange={(e) => onValueChange(e.target.value)}
					placeholder="Enter customer..."
					disabled={disabled}
					className="w-full pl-10 pr-3 py-2 text-[14px] bg-white dark:bg-gray-800 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-font-color placeholder-font-color-100"
				/>
			</div>
		</div>
	);
};

export default CustomerFilterCombobox;
