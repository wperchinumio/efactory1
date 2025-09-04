import React, { useState, useRef, useEffect } from 'react';
import { IconCalendar, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const DatePicker = ({ value, onChange, placeholder = "Select date", className = "", disabled = false }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const containerRef = useRef(null);
	const inputRef = useRef(null);

	// Close when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Initialize current month based on value
	useEffect(() => {
		if (value) {
			setCurrentMonth(new Date(value));
		}
	}, [value]);

	const formatDate = (dateStr) => {
		if (!dateStr) return '';
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

	const handleDateSelect = (date) => {
		const dateStr = date.toISOString().split('T')[0];
		onChange(dateStr);
		setIsOpen(false);
	};

	const getDaysInMonth = (date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days = [];
		
		// Add empty cells for days before the first day of the month
		for (let i = 0; i < startingDayOfWeek; i++) {
			days.push(null);
		}
		
		// Add days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(new Date(year, month, day));
		}
		
		return days;
	};

	const navigateMonth = (direction) => {
		setCurrentMonth(prev => {
			const newDate = new Date(prev);
			newDate.setMonth(prev.getMonth() + direction);
			return newDate;
		});
	};

	const isToday = (date) => {
		const today = new Date();
		return date && 
			   date.getDate() === today.getDate() &&
			   date.getMonth() === today.getMonth() &&
			   date.getFullYear() === today.getFullYear();
	};

	const isSelected = (date) => {
		if (!value || !date) return false;
		const selectedDate = new Date(value);
		return date.getDate() === selectedDate.getDate() &&
			   date.getMonth() === selectedDate.getMonth() &&
			   date.getFullYear() === selectedDate.getFullYear();
	};

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	return (
		<div className={`relative ${className}`} ref={containerRef}>
			{/* Input Field */}
			<div className="relative">
				<input
					ref={inputRef}
					type="text"
					value={formatDate(value)}
					placeholder={placeholder}
					readOnly
					disabled={disabled}
					className={`
						w-full pl-10 pr-3 py-2 bg-card-color border border-border-color rounded-lg 
						text-font-color placeholder:text-font-color-100 cursor-pointer
						focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20
						transition-all duration-200 hover:shadow-md
						${disabled ? 'opacity-50 cursor-not-allowed' : ''}
						${isOpen ? 'border-primary ring-2 ring-primary ring-opacity-20' : ''}
					`}
					style={{ textIndent: '1.75rem' }}
					onClick={() => !disabled && setIsOpen(!isOpen)}
				/>
				<IconCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-font-color-100 pointer-events-none z-10" />
			</div>

			{/* Calendar Dropdown */}
			{isOpen && (
				<div 
					className="absolute top-full left-0 mt-2 z-[99999] bg-card-color border border-border-color rounded-xl shadow-2xl overflow-hidden min-w-[320px]"
					style={{ zIndex: 99999 }}
				>
					{/* Calendar Header */}
					<div className="bg-primary-10 px-4 py-3 border-b border-border-color">
						<div className="flex items-center justify-between">
							<button
								type="button"
								onClick={() => navigateMonth(-1)}
								className="w-8 h-8 rounded-lg hover:bg-primary-20 flex items-center justify-center transition-colors"
							>
								<IconChevronLeft className="w-4 h-4 text-font-color" />
							</button>
							
							<div className="flex items-center gap-2">
								<h3 className="text-[15px] font-bold text-font-color">
									{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
								</h3>
							</div>
							
							<button
								type="button"
								onClick={() => navigateMonth(1)}
								className="w-8 h-8 rounded-lg hover:bg-primary-20 flex items-center justify-center transition-colors"
							>
								<IconChevronRight className="w-4 h-4 text-font-color" />
							</button>
						</div>
					</div>

					{/* Calendar Body */}
					<div className="p-4">
						{/* Day Headers */}
						<div className="grid grid-cols-7 gap-1 mb-2">
							{dayNames.map(day => (
								<div key={day} className="text-center text-[11px] font-semibold text-font-color-100 py-2">
									{day}
								</div>
							))}
						</div>

						{/* Calendar Days */}
						<div className="grid grid-cols-7 gap-1">
							{getDaysInMonth(currentMonth).map((date, index) => (
								<button
									key={index}
									type="button"
									disabled={!date}
									onClick={() => date && handleDateSelect(date)}
									className={`
										w-8 h-8 rounded-lg text-[13px] font-medium transition-all duration-200
										flex items-center justify-center
										${!date ? 'invisible' : ''}
										${isSelected(date) 
											? 'bg-primary text-white shadow-lg' 
											: isToday(date)
											? 'bg-primary-20 text-primary font-bold'
											: 'text-font-color hover:bg-primary-10 hover:text-primary'
										}
									`}
								>
									{date?.getDate()}
								</button>
							))}
						</div>

						{/* Quick Actions */}
						<div className="mt-4 pt-3 border-t border-border-color">
							<div className="flex items-center justify-between gap-2">
								<button
									type="button"
									onClick={() => handleDateSelect(new Date())}
									className="text-[12px] text-primary hover:text-primary-dark font-medium transition-colors"
								>
									Today
								</button>
								<button
									type="button"
									onClick={() => {
										onChange('');
										setIsOpen(false);
									}}
									className="text-[12px] text-font-color-100 hover:text-font-color transition-colors"
								>
									Clear
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DatePicker;
