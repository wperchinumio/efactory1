import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconCheck, IconSearch } from '@tabler/icons-react';

interface MultiSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface MultiSelectComboboxProps {
	value?: string[];
	onValueChange: (value: string[]) => void;
	options?: MultiSelectOption[];
	placeholder?: string;
	searchPlaceholder?: string;
	className?: string;
	disabled?: boolean;
	icon?: React.ComponentType<any>;
	emptyMessage?: string;
	showSearch?: boolean;
	title?: string;
}

const MultiSelectCombobox = ({ 
	value = [], 
	onValueChange, 
	options = [], 
	placeholder = "Select options...", 
	searchPlaceholder = "Search...",
	className = "",
	disabled = false,
  icon: Icon = undefined,
	emptyMessage = "No options found.",
	showSearch = true,
	title = "Filter"
}: MultiSelectComboboxProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [selectedValues, setSelectedValues] = useState<string[]>(Array.isArray(value) ? value : []);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Sync with external value changes
	useEffect(() => {
		setSelectedValues(Array.isArray(value) ? value : []);
	}, [value]);

	// Filter options based on search query
	const filteredOptions = showSearch 
		? options.filter(option =>
			option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
			option.value.toLowerCase().includes(searchQuery.toLowerCase())
		)
		: options;

	// Close dropdown when clicking outside
	useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
                  if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
				setSearchQuery('');
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Focus search input when dropdown opens
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

  const handleToggleOption = (optionValue: string) => {
		const newSelectedValues = selectedValues.includes(optionValue)
			? selectedValues.filter(v => v !== optionValue)
			: [...selectedValues, optionValue];
		
		setSelectedValues(newSelectedValues);
	};

	const handleApply = () => {
		onValueChange(selectedValues);
		setIsOpen(false);
		setSearchQuery('');
	};

	const handleClearAll = () => {
		setSelectedValues([]);
	};

	const handleToggle = () => {
		if (!disabled) {
			setIsOpen(!isOpen);
			setSearchQuery('');
		}
	};

	const getDisplayText = () => {
		if (selectedValues.length === 0) return placeholder;
		if (selectedValues.length === 1) {
			const option = options.find(o => o.value === selectedValues[0]);
			return option ? option.label : selectedValues[0];
		}
		return `${selectedValues.length} selected`;
	};

	const hasActiveSelection = selectedValues.length > 0;

	return (
		<div className={`relative ${className}`} ref={containerRef} style={{ zIndex: isOpen ? 99999 : 'auto' }}>
			{/* Trigger Button */}
			<button
				type="button"
				className={`
					cursor-pointer rounded-lg bg-card-color border border-border-color 
					px-3 py-2 text-[14px]/[20px] w-full
					focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary 
					shadow-sm hover:shadow-md transition-all duration-200 text-font-color
					flex items-center justify-between gap-2
					${disabled ? 'opacity-50 cursor-not-allowed' : ''}
					${isOpen ? 'ring-2 ring-primary ring-opacity-20 border-primary' : ''}
				`}
				onClick={handleToggle}
				disabled={disabled}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<div className="flex items-center gap-2 flex-1 min-w-0">
					{Icon && <Icon className="w-4 h-4 text-font-color-100 flex-shrink-0" />}
					<span className={`truncate ${hasActiveSelection ? 'text-font-color font-medium' : 'text-font-color-100'}`}>
						{getDisplayText()}
					</span>
				</div>
				<IconChevronDown 
					className={`w-4 h-4 text-font-color-100 flex-shrink-0 transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''
					}`} 
				/>
			</button>

			{/* Dropdown Content */}
			{isOpen && (
				<div 
					className="fixed mt-1 z-[99999] bg-card-color border border-border-color rounded-lg shadow-xl overflow-hidden min-w-[250px]"
                                        style={{
                                                top: (containerRef.current?.getBoundingClientRect().bottom || 0) + window.scrollY + 4,
                                                left: (containerRef.current?.getBoundingClientRect().left || 0) + window.scrollX,
                                                width: Math.max(containerRef.current?.getBoundingClientRect().width || 0, 250)
                                        }}
				>
					{/* Search Input */}
					{showSearch && (
						<div className="p-3 border-b border-border-color">
							<div className="relative">
								<IconSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-font-color-100" />
								<input
									ref={inputRef}
									type="text"
									className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-transparent border-0 outline-none text-font-color placeholder:text-font-color-100"
									placeholder={searchPlaceholder}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>
					)}

					{/* Options List */}
					<div className="max-h-[300px] overflow-y-auto">
						{/* Clear All Option */}
						<div className="p-2 border-b border-border-color">
							<button
								type="button"
								className="w-full text-left px-2 py-1.5 text-[13px] text-font-color-100 hover:bg-primary-10 hover:text-primary rounded transition-colors"
								onClick={handleClearAll}
							>
								Clear All
							</button>
						</div>

						{/* Checkbox Options */}
						{filteredOptions.length === 0 ? (
							<div className="px-3 py-4 text-[13px] text-font-color-100 text-center">
								{emptyMessage}
							</div>
						) : (
							filteredOptions.map((option) => (
								<label
									key={option.value}
									className="flex items-center gap-3 px-3 py-2 hover:bg-primary-10 cursor-pointer transition-colors"
								>
									<input
										type="checkbox"
										checked={selectedValues.includes(option.value)}
										onChange={() => handleToggleOption(option.value)}
										className="w-4 h-4 text-primary bg-card-color border-border-color rounded focus:ring-primary focus:ring-2"
									/>
									<span className="text-[14px] text-font-color flex-1 truncate">
										{option.label}
									</span>
								</label>
							))
						)}
					</div>

					{/* Apply Button */}
					<div className="p-3 border-t border-border-color bg-primary-5">
						<button
							type="button"
							className="w-full btn btn-primary btn-sm"
							onClick={handleApply}
						>
							<IconCheck className="w-3 h-3 me-1" />
							Apply ({selectedValues.length})
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MultiSelectCombobox;
