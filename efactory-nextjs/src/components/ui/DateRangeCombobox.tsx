import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconCheck, IconCalendar, IconX } from '@tabler/icons-react';
import DatePicker from './DatePicker';

interface DateRangeComboboxProps {
	value: string;
	onValueChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	title?: string;
	allowClear?: boolean;
}

const DateRangeCombobox = ({ 
	value, 
	onValueChange, 
	placeholder = "Select date range...", 
	className = "",
	disabled = false,
	title = "Date Range",
	allowClear = true // New prop to control clear option
}: DateRangeComboboxProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showCustomPanel, setShowCustomPanel] = useState(false);
	const [customStartDate, setCustomStartDate] = useState('');
	const [customEndDate, setCustomEndDate] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);

	// Date range options matching legacy exactly
	const baseDateOptions = [
		{ value: '0D', label: 'Today' },
		{ value: '-1D', label: 'Yesterday' },
		{ value: '0W', label: 'This Week' },
		{ value: '-1W', label: 'Last Week' },
		{ value: '-10D', label: 'Last 10 Days' },
		{ value: '-30D', label: 'Last 30 Days' },
		{ value: '-90D', label: 'Last 90 Days' },
		{ value: '0M', label: 'This Month' },
		{ value: '-1M', label: 'Last Month' },
		{ value: '0Y', label: 'This Year' },
		{ value: 'CUSTOM', label: 'Custom Range' }
	];

	// Add clear option only if allowed
	const dateOptions = allowClear 
		? [{ value: '', label: 'Clear Date' }, ...baseDateOptions]
		: baseDateOptions;

	// Close dropdown when clicking outside (but not the custom panel)
	useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
                  if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				// Only close dropdown if we're not showing custom panel
				if (!showCustomPanel) {
					setIsOpen(false);
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showCustomPanel]);

  const handleSelect = (optionValue: string) => {
		if (optionValue === 'CUSTOM') {
			setShowCustomPanel(true);
			setIsOpen(false);
			// Initialize with current date
			const today = new Date().toISOString().split('T')[0];
			if (today) {
				setCustomStartDate(today);
				setCustomEndDate(today);
			}
		} else {
			onValueChange(optionValue);
			setIsOpen(false);
		}
	};

	const handleCustomApply = () => {
		if (customStartDate && customEndDate) {
			// Create a custom range value that includes both dates
			const customValue = `${customStartDate}|${customEndDate}`;
			onValueChange(customValue);
		}
		setShowCustomPanel(false);
	};

	const handleCustomCancel = () => {
		setShowCustomPanel(false);
		setCustomStartDate('');
		setCustomEndDate('');
	};

	const handleToggle = () => {
		if (!disabled) {
			setIsOpen(!isOpen);
		}
	};

	const getDisplayText = () => {
		if (!value || value === '') return placeholder;
		
		// Check if it's a custom range
		if (value.includes('|')) {
			const [start, end] = value.split('|');
			if (start && end) {
				return `${formatDate(start)} - ${formatDate(end)}`;
			}
		}
		
		// Find predefined option
		const option = dateOptions.find(o => o.value === value);
		return option ? option.label : value;
	};

        const formatDate = (dateStr: string) => {
		try {
			const date = new Date(dateStr);
			return date.toLocaleDateString('en-US', { 
				month: '2-digit', 
				day: '2-digit', 
				year: 'numeric' 
			});
		} catch {
			return dateStr;
		}
	};

	const getCurrentMonth = () => {
		const date = new Date();
		return date.toISOString().slice(0, 7); // YYYY-MM format
	};

	const getCurrentYear = () => {
		return new Date().getFullYear();
	};

	const hasActiveSelection = value && value !== '' && value !== '-90D';

	return (
		<>
			<div className={`relative ${className}`} ref={containerRef} style={{ zIndex: isOpen ? 99999 : 'auto' }}>
				{/* Trigger Button */}
				<button
					type="button"
					className={`
						cursor-pointer rounded-lg bg-card-color border border-border-color 
						px-3 py-2 text-[14px]/[20px] w-full
						focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary 
						shadow-sm hover:shadow-md transition-all duration-200 text-font-color
						flex items-center justify-between gap-2 relative
						${disabled ? 'opacity-50 cursor-not-allowed' : ''}
						${isOpen ? 'ring-2 ring-primary ring-opacity-20 border-primary' : ''}
					`}
					onClick={handleToggle}
					disabled={disabled}
					aria-expanded={isOpen}
					aria-haspopup="listbox"
				>
					{/* Calendar Icon - Positioned absolutely to avoid overlap */}
					<IconCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-font-color-100 pointer-events-none z-10" />
					
					{/* Text Content */}
					<div className="flex-1 min-w-0 text-left pl-7">
						<span className={`truncate block ${hasActiveSelection ? 'text-font-color font-medium' : 'text-font-color-100'}`}>
							{getDisplayText()}
						</span>
					</div>
					
					{/* Dropdown Arrow */}
					<IconChevronDown 
						className={`w-4 h-4 text-font-color-100 flex-shrink-0 transition-transform duration-200 ${
							isOpen ? 'rotate-180' : ''
						}`} 
					/>
				</button>

				{/* Dropdown Content */}
				{isOpen && (
					<div 
						className="fixed mt-1 z-[99999] bg-card-color border border-border-color rounded-lg shadow-xl overflow-hidden min-w-[200px]"
                                                style={{
                                                        top: (containerRef.current?.getBoundingClientRect().bottom || 0) + window.scrollY + 4,
                                                        left: (containerRef.current?.getBoundingClientRect().left || 0) + window.scrollX,
                                                        width: Math.max(containerRef.current?.getBoundingClientRect().width || 0, 200)
                                                }}
					>
						{/* Options List */}
						<div className="max-h-[400px] overflow-y-auto">
							{dateOptions.map((option) => (
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
							))}
						</div>
					</div>
				)}
			</div>

			{/* Custom Date Range Side Panel */}
			{showCustomPanel && (
				<div 
					className="fixed inset-0 z-[100000] flex items-center justify-center bg-black bg-opacity-50"
					onClick={(e) => {
						// Only close if clicking the backdrop, not the panel content
						if (e.target === e.currentTarget) {
							handleCustomCancel();
						}
					}}
				>
					<div 
						className="bg-card-color border border-border-color rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
						onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside panel
					>
						{/* Panel Header */}
						<div className="bg-primary-10 border-b border-border-color px-6 py-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
										<IconCalendar className="w-4 h-4" />
									</div>
									<div>
										<h3 className="text-[16px] font-bold text-font-color">Custom Date Range</h3>
										<p className="text-[12px] text-font-color-100">Select your custom date range</p>
									</div>
								</div>
								<button
									onClick={handleCustomCancel}
									className="w-8 h-8 rounded-lg hover:bg-primary-20 flex items-center justify-center transition-colors"
								>
									<IconX className="w-4 h-4 text-font-color-100" />
								</button>
							</div>
						</div>

						{/* Panel Content */}
						<div className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* From Date */}
								<div>
									<label className="block text-[13px] font-semibold text-font-color mb-2">
										From Date
									</label>
									<DatePicker
										value={customStartDate}
										onChange={setCustomStartDate}
										placeholder="Select start date"
									/>
								</div>

								{/* To Date */}
								<div>
									<label className="block text-[13px] font-semibold text-font-color mb-2">
										To Date
									</label>
									<DatePicker
										value={customEndDate}
										onChange={setCustomEndDate}
										placeholder="Select end date"
									/>
								</div>
							</div>

							{/* Quick Select Options */}
							<div className="mt-6">
								<h4 className="text-[13px] font-semibold text-font-color mb-3">Quick Select</h4>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
									{[
										{ label: 'Today', days: 0 },
										{ label: 'Last 7 Days', days: 7 },
										{ label: 'Last 30 Days', days: 30 },
										{ label: 'Last 90 Days', days: 90 }
									].map((quick) => (
										<button
											key={quick.label}
											type="button"
											className="px-3 py-2 text-[12px] bg-primary-10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
											onClick={() => {
												const today = new Date();
												const startDate = new Date(today);
												startDate.setDate(today.getDate() - quick.days);
												
                                                                                        const startDateStr = startDate.toISOString().split('T')[0];
                                                                                        const todayStr = today.toISOString().split('T')[0];
                                                                                        if (startDateStr && todayStr) {
                                                                                                setCustomStartDate(startDateStr);
                                                                                                setCustomEndDate(todayStr);
                                                                                        }
											}}
										>
											{quick.label}
										</button>
									))}
								</div>
							</div>

							{/* Preview */}
							{customStartDate && customEndDate && (
								<div className="mt-6 p-4 bg-primary-5 rounded-lg">
									<h4 className="text-[13px] font-semibold text-font-color mb-2">Preview</h4>
									<p className="text-[14px] text-font-color">
										<span className="font-medium">{formatDate(customStartDate)}</span>
										{' '} to {' '}
										<span className="font-medium">{formatDate(customEndDate)}</span>
									</p>
								</div>
							)}
						</div>

						{/* Panel Footer */}
						<div className="bg-primary-5 border-t border-border-color px-6 py-4">
							<div className="flex items-center justify-end gap-3">
								<button
									type="button"
									className="btn btn-light-secondary"
									onClick={handleCustomCancel}
								>
									Cancel
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={handleCustomApply}
									disabled={!customStartDate || !customEndDate}
								>
									<IconCheck className="w-4 h-4 me-2" />
									Apply Range
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default DateRangeCombobox;
