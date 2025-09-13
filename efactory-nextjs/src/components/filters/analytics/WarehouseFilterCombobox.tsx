import React from 'react';
import { IconBuilding } from '@tabler/icons-react';
import MultiSelectCombobox from '@/components/ui/MultiSelectCombobox';
import { useGlobalFilterData } from '@/hooks/useGlobalFilterData';

interface WarehouseFilterComboboxProps {
	value?: string[];
	onValueChange: (value: string[]) => void;
	className?: string;
	disabled?: boolean;
}

const WarehouseFilterCombobox = ({ 
	value = [], 
	onValueChange, 
	className = "",
	disabled = false 
}: WarehouseFilterComboboxProps) => {
	const globalData = useGlobalFilterData();
	
	// Get warehouse options from global data using the getFilterOptions function
	const warehouseOptions = globalData?.loading ? [] : globalData?.getFilterOptions?.()?.getWarehouseOptions?.() || [];
	
	
	const hasActiveSelection = Array.isArray(value) && value.length > 0;

	return (
		<div className={className}>
			<label className={`block text-[12px] font-semibold mb-1 ${hasActiveSelection ? 'text-red-500' : 'text-font-color-100'}`}>
				WAREHOUSE
			</label>
			<MultiSelectCombobox
				value={value}
				onValueChange={onValueChange}
				options={warehouseOptions}
				placeholder="Select warehouses..."
				searchPlaceholder="Search warehouses..."
				icon={IconBuilding}
				disabled={disabled}
				emptyMessage="No warehouses found."
				title="Warehouse"
			/>
		</div>
	);
};

export default WarehouseFilterCombobox;
