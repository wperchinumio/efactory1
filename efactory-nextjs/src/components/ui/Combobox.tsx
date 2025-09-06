import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconCheck, IconSearch } from '@tabler/icons-react';

interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface ComboboxProps {
	value: string;
	onValueChange: (value: string) => void;
	options?: ComboboxOption[];
	placeholder?: string;
	searchPlaceholder?: string;
	className?: string;
	disabled?: boolean;
	icon?: React.ComponentType<any>;
	emptyMessage?: string;
	showSearch?: boolean;
}

const Combobox = ({ 
	value, 
	onValueChange, 
	options = [], 
	placeholder = "Select option...", 
	searchPlaceholder = "Search...",
	className = "",
	disabled = false,
  icon: Icon = undefined,
	emptyMessage = "No options found.",
	showSearch = true
}: ComboboxProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Filter options based on search query (only if search is enabled)
	const filteredOptions = showSearch 
		? options.filter(option =>
			option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
			option.value.toLowerCase().includes(searchQuery.toLowerCase())
		)
		: options;

	// Get selected option
	const selectedOption = options.find(option => option.value === value);

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

  const handleSelect = (optionValue: string) => {
		onValueChange(optionValue);
		setIsOpen(false);
		setSearchQuery('');
	};

	const handleToggle = () => {
		if (!disabled) {
			setIsOpen(!isOpen);
			setSearchQuery('');
		}
	};

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
					<span className={`truncate ${selectedOption ? 'text-font-color' : 'text-font-color-100'}`}>
						{selectedOption ? selectedOption.label : placeholder}
					</span>
				</div>
				<IconChevronDown 
					className={`w-4 h-4 text-font-color-100 flex-shrink-0 transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''
					}`} 
				/>
			</button>

			{/* Dropdown Content - Using fixed positioning to escape stacking context */}
			{isOpen && (
				<div 
					className="fixed mt-1 z-[99999] bg-card-color border border-border-color rounded-lg shadow-xl overflow-hidden min-w-[200px]"
                                        style={{
                                                top: (containerRef.current?.getBoundingClientRect().bottom || 0) + window.scrollY + 4,
                                                left: containerRef.current?.getBoundingClientRect().left || 0 + window.scrollX,
                                                width: containerRef.current?.getBoundingClientRect().width || 200
                                        }}
				>
						{/* Search Input - Only show if showSearch is true */}
						{showSearch && (
							<div className="p-2 border-b border-border-color">
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
							{filteredOptions.length === 0 ? (
								<div className="px-3 py-2 text-[13px] text-font-color-100 text-center">
									{emptyMessage}
								</div>
							) : (
								filteredOptions.map((option) => (
									option.disabled ? (
										<div
											key={option.value}
											className="w-full py-2 cursor-default"
										>
											<div className="w-full h-px bg-border-color mx-0"></div>
										</div>
									) : (
										<button
											key={option.value}
											type="button"
											className={`
												w-full px-3 py-2 text-left text-[14px] hover:bg-primary-10 
												transition-colors duration-150 flex items-center justify-between gap-2
												${value === option.value ? 'bg-primary-10 text-primary' : 'text-font-color'}
											`}
											onClick={() => handleSelect(option.value)}
										>
											<span className="truncate">{option.label}</span>
											{value === option.value && (
												<IconCheck className="w-4 h-4 text-primary flex-shrink-0" />
											)}
										</button>
									)
								))
							)}
						</div>
				</div>
			)}
		</div>
	);
};

export default Combobox;
