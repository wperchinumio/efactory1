import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
// Styles are imported globally in _app.tsx for reliability
import { Button, Card, CardContent, CardHeader, CardTitle, Input, CheckBox, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Label, DatePicker } from '@/components/ui'
import CountryFilterCombobox from '@/components/filters/CountryFilterCombobox'
import StateFilterCombobox from '@/components/filters/StateFilterCombobox'
import { toast } from '@/components/ui/use-toast'
import { IconTruck, IconCurrency, IconEdit, IconMapPin, IconBuilding, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconChevronDown, IconFileText, IconShoppingCart, IconMessageCircle, IconCalendar, IconPlus } from '@tabler/icons-react'
import { getAuthState } from '@/lib/auth/guards'
import {
  generateOrderNumber,
  saveDraft,
  saveEntry,
  fetchInventoryForCart,
  readOrderPointsSettings,
  readAddresses,
  createAddress,
} from '@/services/api'
import type { OrderHeaderDto, OrderDetailDto, InventoryStatusForCartBody, AddressDto, OrderPointsSettingsDto, ReadAddressesResponse } from '@/types/api/orderpoints'


function isFiniteNumber(v: any): v is number {
  const n = +v
  return Number.isFinite(n)
}

// Editable DatePicker component
const EditableDatePicker = ({ value, onChange, placeholder = "Select date", className = "", disabled = false }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when prop value changes
  useEffect(() => {
    if (value) {
      // If value is in ISO format (YYYY-MM-DD), convert to native format without timezone issues
      if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Parse ISO date components directly to avoid timezone conversion
        const parts = value.split('-').map(Number);
        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
          const [year, month, day] = parts;
          const date = new Date(year, month - 1, day); // month is 0-indexed
          setInputValue(date.toLocaleDateString());
        } else {
          setInputValue(value);
        }
      } else {
        // Value is already in native format
        setInputValue(value);
      }
    } else {
      setInputValue('');
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      // If it's already in native format, return as is
      if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateStr;
      }
      // If it's ISO format, convert to native
      const date = new Date(dateStr);
      return date.toLocaleDateString(); // Use browser's native format
    } catch {
      return dateStr;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Close calendar when user starts typing
    if (isOpen) {
      setIsOpen(false);
    }
    
    // Only update parent state if input is empty
    if (newValue === '') {
      onChange('');
    }
    // Don't try to parse while typing - let user finish typing first
  };

  const handleInputBlur = () => {
    // When user finishes typing, try to parse and format the date
    if (inputValue.trim() === '') {
      onChange('');
      return;
    }
    
    try {
      // Parse the date in local timezone to avoid timezone issues
      const dateParts = inputValue.split('/');
      if (dateParts.length === 3 && dateParts[0] && dateParts[1] && dateParts[2]) {
        const month = parseInt(dateParts[0], 10) - 1; // Month is 0-indexed
        const day = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10);
        
        if (month >= 0 && month <= 11 && day >= 1 && day <= 31 && year > 1900) {
          const date = new Date(year, month, day);
          if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
            // Create ISO date string directly without timezone conversion
            const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            onChange(isoDate);
            // Format the input value using native format
            setInputValue(date.toLocaleDateString());
            return;
          }
        }
      }
      
      // Fallback to regular parsing if the manual parsing fails
      const date = new Date(inputValue);
      if (!isNaN(date.getTime()) && date.getFullYear() > 1900) {
        const isoDate = date.toISOString().split('T')[0];
        onChange(isoDate || '');
        // Format the input value using native format
        setInputValue(date.toLocaleDateString());
      }
    } catch {
      // If parsing fails, keep the input value as is
    }
  };

  const handleDateSelect = (date: Date) => {
    // Create ISO date string directly without timezone conversion
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is 0-indexed, so add 1
    const day = date.getDate();
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    onChange(isoDate);
    setInputValue(date.toLocaleDateString()); // Use native format for display
    setIsOpen(false);
  };

  const handleIconClick = () => {
    // Try to parse the current input value to set the calendar date
    let calendarDate = new Date();
    
    if (inputValue.trim()) {
      try {
        // Try manual parsing first to avoid timezone issues
        const dateParts = inputValue.split('/');
        if (dateParts.length === 3 && dateParts[0] && dateParts[1] && dateParts[2]) {
          const month = parseInt(dateParts[0], 10) - 1; // Month is 0-indexed
          const day = parseInt(dateParts[1], 10);
          const year = parseInt(dateParts[2], 10);
          
          if (month >= 0 && month <= 11 && day >= 1 && day <= 31 && year > 1900) {
            const parsedDate = new Date(year, month, day);
            if (parsedDate.getFullYear() === year && parsedDate.getMonth() === month && parsedDate.getDate() === day) {
              calendarDate = parsedDate;
              // Set the calendar to show the month of the parsed date
              setCurrentMonth(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
            }
          }
        } else {
          // Fallback to regular parsing
          const parsedDate = new Date(inputValue);
          if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 1900) {
            calendarDate = parsedDate;
            // Set the calendar to show the month of the parsed date
            setCurrentMonth(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
          }
        }
      } catch {
        // If parsing fails, use current date
      }
    }
    
    // Open calendar
    setIsOpen(true);
  };

  const getDaysInMonth = (date: Date) => {
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

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date && 
           date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!value || !date) return false;
    
    // If value is in ISO format, parse it safely without timezone issues
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      try {
        const parts = value.split('-').map(Number);
        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
          const [year, month, day] = parts;
          const selectedDate = new Date(year, month - 1, day); // month is 0-indexed
          
          return date.getDate() === selectedDate.getDate() &&
                 date.getMonth() === selectedDate.getMonth() &&
                 date.getFullYear() === selectedDate.getFullYear();
        }
      } catch {
        return false;
      }
    }
    
    // Fallback to regular parsing for non-ISO formats
    try {
      const selectedDate = new Date(value);
      if (isNaN(selectedDate.getTime())) {
        return false;
      }
      
      return date.getDate() === selectedDate.getDate() &&
             date.getMonth() === selectedDate.getMonth() &&
             date.getFullYear() === selectedDate.getFullYear();
    } catch {
      return false;
    }
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
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={`
            w-full pl-2.5 pr-3 h-8 bg-card-color border border-border-color rounded-lg 
            text-font-color placeholder:text-font-color-100 cursor-text text-sm
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:ring-opacity-20
            transition-all duration-200 hover:shadow-md
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isOpen ? 'border-primary ring-1 ring-primary ring-opacity-20' : ''}
            ${inputValue ? 'font-medium' : ''}
          `}
          style={{ textIndent: '1.75rem' }}
        />
        <IconCalendar 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-font-color-100 cursor-pointer z-10" 
          onClick={handleIconClick}
        />
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
                className="w-8 h-9 rounded-lg hover:bg-primary-20 flex items-center justify-center transition-colors"
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
                className="w-8 h-9 rounded-lg hover:bg-primary-20 flex items-center justify-center transition-colors"
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
                    w-8 h-9 rounded-lg text-[13px] font-medium transition-all duration-200
                    flex items-center justify-center
                    ${!date ? 'invisible' : ''}
                    ${date && isSelected(date)
                      ? 'bg-primary text-white shadow-lg'
                      : date && isToday(date)
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
                    setInputValue('');
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

export default function OrderPointsPage() {
  // Guard: redirect handled globally; here ensure auth exists
  const auth = getAuthState()
  if (!auth.isAuthenticated) {
    if (typeof window !== 'undefined') window.location.href = '/auth/sign-in'
  }
  const router = useRouter()

  // Helper function to check if a required field is empty
  const isRequiredFieldEmpty = (value: any) => {
    if (value === null || value === undefined || value === '') return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return false;
  };

  // Helper function to check if at least one of two fields has a value
  const hasAtLeastOne = (value1: any, value2: any) => {
    return !isRequiredFieldEmpty(value1) || !isRequiredFieldEmpty(value2);
  };

  // Legacy-compliant required field checks
  const isOrderNumberRequired = () => {
    // Only required when manual order number generation is enabled
    // For now, assume it's always required (can be made dynamic later)
    return true;
  };

  const isPostalCodeRequired = () => {
    // Only required for US/CA countries
    return shippingAddress.country === 'US' || shippingAddress.country === 'CA';
  };

  const isStateRequired = () => {
    // Only required for US/CA/AU countries
    return ['US', 'CA', 'AU'].includes(shippingAddress.country || '');
  };

  // Clean small red dot component
  const RequiredDot = ({ show }: { show: boolean }) => (
    show ? <div className="w-1.5 h-1.5 bg-red-500 rounded-full ml-1"></div> : null
  );

  // Half dot for "at least one" scenarios
  const HalfRequiredDot = ({ show }: { show: boolean }) => (
    show ? <div className="w-1.5 h-1.5 bg-red-500 rounded-full ml-1 opacity-50"></div> : null
  );


  const [orderHeader, setOrderHeader] = useState<OrderHeaderDto>({ order_status: 1, ordered_date: new Date().toLocaleDateString() })
  const [orderDetail, setOrderDetail] = useState<OrderDetailDto[]>([])
  const [accountNumberLocation, setAccountNumberLocation] = useState('')
  const [accountDisplayLabel, setAccountDisplayLabel] = useState('')
  const [orderStatusDisplayLabel, setOrderStatusDisplayLabel] = useState('')
  const [shippingAddress, setShippingAddress] = useState<AddressDto>({ country: 'US' })
  const [billingAddress, setBillingAddress] = useState<AddressDto>({})
  // Shipping settings state
  const [shippingSettings, setShippingSettings] = useState<OrderPointsSettingsDto['shipping'] | null>(null)
  const [findItemValue, setFindItemValue] = useState('')
  // Browse Items modal state
  const [browseOpen, setBrowseOpen] = useState(false)
  const [itemFilter, setItemFilter] = useState('')
  const [showZeroQty, setShowZeroQty] = useState(false)
  const [warehouses, setWarehouses] = useState<string>('')
  const [inventory, setInventory] = useState<Record<string, { item_number: string; description: string; qty_net: number; quantity?: number; price?: number }>>({})
  const [matchedWarehouse, setMatchedWarehouse] = useState('')
  const [searchingItems, setSearchingItems] = useState(false)
  const [browseItemsLoading, setBrowseItemsLoading] = useState(false)
  
  // Determine if form fields should be disabled based on warehouse matching
  const formFieldsDisabled = warehouses === '' || 
                           matchedWarehouse === '' ||
                           matchedWarehouse !== warehouses
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(100)
  // Amounts & extra fields
  const [amounts, setAmounts] = useState({
    shipping_handling: 0,
    sales_tax: 0,
    discounts: 0,
    amount_paid: 0,
    insurance: 0,
    international_handling: 0,
    international_declared_value: 0,
    balance_due_us: 0
  })
  const [extraLabels, setExtraLabels] = useState({
    header_cf_1: 'Custom Field 1',
    header_cf_2: 'Custom Field 2',
    header_cf_3: 'Custom Field 3',
    header_cf_4: 'Custom Field 4',
    header_cf_5: 'Custom Field 5',
    detail_cf_1: 'Custom Field 1',
    detail_cf_2: 'Custom Field 2',
    detail_cf_5: 'Custom Field 5'
  })
  // Address validation
  const [validateOpen, setValidateOpen] = useState(false)
  const [validateResult, setValidateResult] = useState<{warnings?: any; errors?: any; correct_address?: AddressDto}>({})
  // Edit line modal
  const [editLineOpen, setEditLineOpen] = useState(false)
  const [editLineIndex, setEditLineIndex] = useState<number | null>(null)
  const [editLineData, setEditLineData] = useState<Partial<OrderDetailDto>>({})
  const [selectedRowsCount, setSelectedRowsCount] = useState(0)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  
  // Edit panel modals
  const [editBillingAddressOpen, setEditBillingAddressOpen] = useState(false)
  const [editShippingDetailsOpen, setEditShippingDetailsOpen] = useState(false)
  const [editAmountsOpen, setEditAmountsOpen] = useState(false)
  const [editExtraFieldsOpen, setEditExtraFieldsOpen] = useState(false)
  
  // Loading states for better UX
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  
  // Track if form has unsaved changes - simpler approach
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showNewOrderConfirm, setShowNewOrderConfirm] = useState(false)
  const [orderSettings, setOrderSettings] = useState({ manual: true, prefix: '', suffix: '', starting_number: 1, minimum_number_of_digits: 4 })
  
  const [showAddressBook, setShowAddressBook] = useState(false)
  const [showAddToAddressBook, setShowAddToAddressBook] = useState(false)
  const [addressBookTitle, setAddressBookTitle] = useState('')
  const [addressBookData, setAddressBookData] = useState<ReadAddressesResponse['rows']>([])
  const [addressBookFilter, setAddressBookFilter] = useState('')
  const [selectedAddress, setSelectedAddress] = useState<ReadAddressesResponse['rows'][0] | null>(null)
  const [addressBookPage, setAddressBookPage] = useState(1)
  const [addressBookTotal, setAddressBookTotal] = useState(0)
  const [addressBookLoading, setAddressBookLoading] = useState(false)
  
  // Text area dialog states
  const [shippingInstructionsDialog, setShippingInstructionsDialog] = useState(false)
  const [commentsDialog, setCommentsDialog] = useState(false)
  
  // Panel expand/collapse states
  const [billingExpanded, setBillingExpanded] = useState(false)
  const [amountsExpanded, setAmountsExpanded] = useState(false)
  const [extraFieldsExpanded, setExtraFieldsExpanded] = useState(false)
  
  // Helper functions to determine which fields have values
  const getBillingFieldsWithValues = () => {
    const fields = [
      { key: 'company', label: 'Company', value: billingAddress.company },
      { key: 'attention', label: 'Attention', value: billingAddress.attention },
      { key: 'address1', label: 'Address 1', value: billingAddress.address1 },
      { key: 'address2', label: 'Address 2', value: billingAddress.address2 },
      { key: 'city', label: 'City', value: billingAddress.city },
      { key: 'state_province', label: 'State/Province', value: billingAddress.state_province },
      { key: 'postal_code', label: 'Postal Code', value: billingAddress.postal_code },
      { key: 'country', label: 'Country', value: billingAddress.country },
      { key: 'phone', label: 'Phone', value: billingAddress.phone },
      { key: 'email', label: 'Email', value: billingAddress.email }
    ]
    return fields.filter(field => field.value && field.value.trim() !== '')
  }
  
  const getAmountsFieldsWithValues = () => {
    const orderAmount = orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0)
    const totalAmount = orderAmount + amounts.shipping_handling + amounts.sales_tax + amounts.international_handling
    const netDue = totalAmount - amounts.amount_paid
    
    const fields = [
      { key: 'order_amount', label: 'Order Amount', value: orderAmount, alwaysShow: true },
      { key: 'shipping_handling', label: 'S & H', value: amounts.shipping_handling },
      { key: 'sales_tax', label: 'Sales Taxes', value: amounts.sales_tax },
      { key: 'international_handling', label: 'Discount/Add. Chgs.', value: amounts.international_handling },
      { key: 'total_amount', label: 'Total Amount', value: totalAmount, alwaysShow: true, isBold: true },
      { key: 'amount_paid', label: 'Amount Paid', value: amounts.amount_paid },
      { key: 'net_due', label: 'Net Due', value: netDue, alwaysShow: true, isBold: true },
      { key: 'balance_due_us', label: 'Balance Due (US)', value: amounts.balance_due_us },
      { key: 'international_declared_value', label: 'Int. Decl. Value', value: amounts.international_declared_value },
      { key: 'insurance', label: 'Insurance', value: amounts.insurance }
    ]
    return fields.filter(field => field.alwaysShow || field.value !== 0)
  }
  
  const getExtraFieldsWithValues = () => {
    const fields = [
      { key: 'custom_field1', label: extraLabels.header_cf_1, value: orderHeader.custom_field1 },
      { key: 'custom_field2', label: extraLabels.header_cf_2, value: orderHeader.custom_field2 },
      { key: 'custom_field3', label: extraLabels.header_cf_3, value: orderHeader.custom_field3 },
      { key: 'custom_field4', label: extraLabels.header_cf_4, value: orderHeader.custom_field4 },
      { key: 'custom_field5', label: extraLabels.header_cf_5, value: orderHeader.custom_field5 }
    ]
    return fields.filter(field => field.value && field.value.trim() !== '')
  }
  
  // Mark form as having changes
  const markAsChanged = () => {
    if (isInitialized) {
      setHasUnsavedChanges(true)
    }
  }
  
  // Mark form as clean (no changes)
  const markAsClean = () => {
    setHasUnsavedChanges(false)
  }
  
  // Initialize the form as clean after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Handle browser beforeunload event to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have made some changes, are you sure to leave?'
        return 'You have made some changes, are you sure to leave?'
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])
  
  // Reset form function - defined before useEffect that uses it
  const resetForm = useCallback(() => {
    setOrderHeader({ order_status: 1, ordered_date: new Date().toLocaleDateString() })
    setOrderDetail([])
    setShippingAddress({ country: 'US' })
    setBillingAddress({})
    setAmounts({
      shipping_handling: 0,
      sales_tax: 0,
      discounts: 0,
      amount_paid: 0,
      insurance: 0,
      international_handling: 0,
      international_declared_value: 0,
      balance_due_us: 0
    })
    setAccountNumberLocation('')
    setAccountDisplayLabel('')
    setOrderStatusDisplayLabel('')
    setFindItemValue('')
    setSelectedRows([])
    setSelectedRowsCount(0)
    
    // Reset unsaved changes state
    markAsClean()
    
    // Show success toaster
    toast({
      title: "New Order Started",
      description: "Form has been reset for a new order.",
      variant: "default",
    })
  }, [])
  
  // Handle Next.js router navigation to warn about unsaved changes
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (hasUnsavedChanges) {
        const confirmed = window.confirm('You have made some changes, are you sure to leave?')
        if (!confirmed) {
          // Prevent navigation by throwing an error
          throw 'Route change aborted by user'
        } else {
          // User confirmed, reset the form and clear unsaved changes
          resetForm()
          setHasUnsavedChanges(false)
        }
      }
    }
    
    // Listen to router events
    router.events.on('routeChangeStart', handleRouteChange)
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [hasUnsavedChanges, router, resetForm])
  
  // Temporary state for editing (only updated on save)
  const [tempBillingAddress, setTempBillingAddress] = useState<AddressDto>({})
  const [tempShippingDetails, setTempShippingDetails] = useState({
    international_code: '',
    shipping_carrier: '',
    shipping_service: '',
    freight_account: '',
    consignee_number: '',
    terms: '',
    fob: '',
    payment_type: '',
    packing_list_type: ''
  })
  const [tempAmounts, setTempAmounts] = useState({
    shipping_handling: 0,
    sales_tax: 0,
    discounts: 0,
    amount_paid: 0,
    international_handling: 0,
    balance_due_us: 0,
    international_declared_value: 0,
    insurance: 0
  })
  const [tempExtraFields, setTempExtraFields] = useState({
    custom_field1: '',
    custom_field2: '',
    custom_field3: '',
    custom_field4: '',
    custom_field5: ''
  })

  // Load all settings on component mount (like legacy - single API call)
  useEffect(() => {
    const loadAllSettings = async () => {
      try {
        const settings = await readOrderPointsSettings()
        
        // Set shipping settings
        setShippingSettings(settings.shipping)
        
        // Set order settings (it's an object, not an array)
        if (settings.order && typeof settings.order === 'object') {
          setOrderSettings(settings.order)
        }
        
        // Update custom field labels
        if (settings.custom_fields) {
          setExtraLabels(prev => ({
            ...prev,
            header_cf_1: settings.custom_fields.header_cf_1 || 'Custom Field 1',
            header_cf_2: settings.custom_fields.header_cf_2 || 'Custom Field 2',
            header_cf_3: settings.custom_fields.header_cf_3 || 'Custom Field 3',
            header_cf_4: settings.custom_fields.header_cf_4 || 'Custom Field 4',
            header_cf_5: settings.custom_fields.header_cf_5 || 'Custom Field 5',
            detail_cf_1: settings.custom_fields.detail_cf_1 || 'Custom Field 1',
            detail_cf_2: settings.custom_fields.detail_cf_2 || 'Custom Field 2',
            detail_cf_5: settings.custom_fields.detail_cf_5 || 'Custom Field 5'
          }))
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
    loadAllSettings()
  }, [])

  // Pre-populate shipping details when country changes
  useEffect(() => {
    if (!shippingSettings) return

    const country = shippingAddress.country?.toUpperCase() || ''
    const isDomestic = country === 'US' || country === 'USA' || country === 'UNITED STATES' || country === 'UNITED_STATES'
    
    const whichShipping = isDomestic ? shippingSettings.domestic : shippingSettings.international
    
    if (whichShipping) {
      const {
        carrier: shipping_carrier,
        service: shipping_service,
        packing_list_type,
        freight_account,
        consignee_number,
        terms,
        int_code: international_code,
        comments = ''
      } = whichShipping

      // Update order header with shipping details
      setOrderHeader(prev => ({
        ...prev,
        shipping_carrier,
        shipping_service,
        packing_list_type,
        freight_account,
        consignee_number,
        terms,
        international_code,
        packing_list_comments: comments && comments.trim().length > 0 ? comments : (prev.packing_list_comments || '')
      }))
    }
  }, [shippingAddress.country, shippingSettings])

  // Functions to handle modal opening and saving
  const openBillingAddressModal = () => {
    setTempBillingAddress({ ...billingAddress })
    setEditBillingAddressOpen(true)
  }
  
  const saveBillingAddress = () => {
    setBillingAddress({ ...tempBillingAddress })
    setEditBillingAddressOpen(false)
  }
  
  const openShippingDetailsModal = () => {
    setTempShippingDetails({
      international_code: String(orderHeader.international_code || ''),
      shipping_carrier: orderHeader.shipping_carrier || '',
      shipping_service: orderHeader.shipping_service || '',
      freight_account: orderHeader.freight_account || '',
      consignee_number: orderHeader.consignee_number || '',
      terms: orderHeader.terms || '',
      fob: orderHeader.fob || '',
      payment_type: orderHeader.payment_type || '',
      packing_list_type: String(orderHeader.packing_list_type || '')
    })
    setEditShippingDetailsOpen(true)
  }
  
  const saveShippingDetails = () => {
    setOrderHeader(prev => ({
      ...prev,
      international_code: tempShippingDetails.international_code,
      shipping_carrier: tempShippingDetails.shipping_carrier,
      shipping_service: tempShippingDetails.shipping_service,
      freight_account: tempShippingDetails.freight_account,
      consignee_number: tempShippingDetails.consignee_number,
      terms: tempShippingDetails.terms,
      fob: tempShippingDetails.fob,
      payment_type: tempShippingDetails.payment_type,
      packing_list_type: tempShippingDetails.packing_list_type
    }))
    setEditShippingDetailsOpen(false)
  }
  
  const openAmountsModal = () => {
    setTempAmounts({ ...amounts })
    setEditAmountsOpen(true)
  }
  
  const saveAmounts = () => {
    setAmounts({ ...tempAmounts })
    setEditAmountsOpen(false)
  }
  
  const openExtraFieldsModal = () => {
    setTempExtraFields({
      custom_field1: orderHeader.custom_field1 || '',
      custom_field2: orderHeader.custom_field2 || '',
      custom_field3: orderHeader.custom_field3 || '',
      custom_field4: orderHeader.custom_field4 || '',
      custom_field5: orderHeader.custom_field5 || ''
    })
    setEditExtraFieldsOpen(true)
  }
  
  const saveExtraFields = () => {
    setOrderHeader(prev => ({
      ...prev,
      custom_field1: tempExtraFields.custom_field1,
      custom_field2: tempExtraFields.custom_field2,
      custom_field3: tempExtraFields.custom_field3,
      custom_field4: tempExtraFields.custom_field4,
      custom_field5: tempExtraFields.custom_field5
    }))
    setEditExtraFieldsOpen(false)
  }


  function renumberDraftLines(lines: OrderDetailDto[]): OrderDetailDto[] {
    // Re-sequence master lines 1..N and kit components 1001/2001 under their parent
    let masterCounter = 0
    const parentMap: Record<number, number> = {}
    const compCounters: Record<number, number> = {}
    const sorted = [...lines].sort((a,b)=>{
      const aKey = a.line_number > 1000 ? Math.floor(a.line_number/1000) + (a.line_number%1000)/1000 : a.line_number
      const bKey = b.line_number > 1000 ? Math.floor(b.line_number/1000) + (b.line_number%1000)/1000 : b.line_number
      return aKey - bKey
    })
    return sorted.map(row => {
      if (!row.is_kit_component) {
        const newLine = ++masterCounter
        parentMap[Math.floor(row.line_number || 0)] = newLine
        return { ...row, line_number: newLine }
      } else {
        const oldParent = Math.floor(row.line_number / 1000)
        const newParent = parentMap[oldParent] || oldParent
        compCounters[newParent] = (compCounters[newParent] || 0) + 1
        const compLine = newParent * 1000 + compCounters[newParent]
        return { ...row, line_number: compLine }
      }
    })
  }

  function onNewOrder() {
    // Check if there are unsaved changes
    if (hasUnsavedChanges) {
      setShowNewOrderConfirm(true)
      return
    }
    
    // Reset form to initial state (like legacy createNewOrder)
    resetForm()
  }


  function handleNewOrderConfirm() {
    setShowNewOrderConfirm(false)
    resetForm()
  }

  function handleNewOrderCancel() {
    setShowNewOrderConfirm(false)
  }

  // Address Book functions
  async function loadAddressBook() {
    setAddressBookLoading(true)
    try {
      const res = await readAddresses({ 
        action: 'read_addresses', 
        page_num: addressBookPage, 
        page_size: 100, 
        filter: addressBookFilter ? { and: [{ field: 'name', oper: '=', value: addressBookFilter }] } as any : undefined 
      })
      setAddressBookData(res.rows || [])
      setAddressBookTotal(res.total || 0)
    } catch (error) {
      console.error('Error loading address book:', error)
      toast({ title: 'Error', description: 'Failed to load address book', variant: 'destructive' })
    } finally {
      setAddressBookLoading(false)
    }
  }

  function handleAddressSelect(address: ReadAddressesResponse['rows'][0]) {
    setSelectedAddress(address)
    // Update shipping address
    setShippingAddress(address.ship_to || {})
    // Update billing address if available
    if (address.bill_to) {
      setBillingAddress(address.bill_to)
    }
    setShowAddressBook(false)
    setHasUnsavedChanges(true)
  }

  async function handleAddToAddressBook() {
    if (!addressBookTitle.trim()) return
    
    try {
      await createAddress({
        action: 'create_address',
        data: {
          title: addressBookTitle,
          ship_to: shippingAddress,
          bill_to: billingAddress,
          is_validate: false
        }
      })
      toast({ title: 'Success', description: 'Address added to address book' })
      setShowAddToAddressBook(false)
      setAddressBookTitle('')
      // Reload address book
      loadAddressBook()
    } catch (error) {
      console.error('Error adding to address book:', error)
      toast({ title: 'Error', description: 'Failed to add address to address book', variant: 'destructive' })
    }
  }

  // Helper function to format address for display
  function formatAddress(address: any): string {
    if (!address) return ''
    
    const parts = []
    if (address.company) parts.push(address.company)
    if (address.attention) parts.push(address.attention)
    if (address.address1) parts.push(address.address1)
    if (address.address2) parts.push(address.address2)
    if (address.city) parts.push(address.city)
    if (address.state) parts.push(address.state)
    if (address.postal_code) parts.push(address.postal_code)
    if (address.country) parts.push(address.country)
    
    return parts.join(', ')
  }

  // Check if validate address button should be enabled
  function canValidateAddress(): boolean {
    const { address1, country, international_code } = shippingAddress
    const hasAddress1 = address1 && String(address1).trim().length > 0
    const isUSCountry = country === 'US' || international_code === 0 || international_code === '0'
    return Boolean(hasAddress1 && isUSCountry)
  }

  // Text area dialog handlers
  function openShippingInstructionsDialog() {
    setShippingInstructionsDialog(true)
  }

  function closeShippingInstructionsDialog() {
    setShippingInstructionsDialog(false)
  }

  function openCommentsDialog() {
    setCommentsDialog(true)
  }

  function closeCommentsDialog() {
    setCommentsDialog(false)
  }



  async function onGenerateOrderNumber() {
    try {
      const response = await generateOrderNumber()
      // The response is directly the order number string, not an object with .number property
      if (response) {
        setOrderHeader(prev => ({ ...prev, order_number: response }))
        markAsChanged()
        
        // Show success message
        toast({
          title: "Order Number Generated",
          description: `Order #${response} has been assigned.`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error('Error generating order number:', error)
      toast({
        title: "Error",
        description: "Failed to generate order number. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function onSaveDraft() {
    if (isSavingDraft) return // Prevent multiple calls
    
    setIsSavingDraft(true)
    try {
    const header = buildOrderHeaderForSubmit(true)
    
    // Convert dates in order detail items from native format to ISO format
    const convertDateToISO = (dateStr: string): string => {
      if (!dateStr) return ''
      try {
        // If it's already in ISO format, return as is
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateStr
        }
        // If it's in native format, convert to ISO
        const date = new Date(dateStr)
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0] || dateStr
        }
        return dateStr
      } catch {
        return dateStr
      }
    }
    
    const convertedOrderDetail = orderDetail.map(item => ({
      ...item,
      do_not_ship_before: convertDateToISO(item.do_not_ship_before ?? ''),
      ship_by: convertDateToISO(item.ship_by ?? '')
    }))
    
    const res = await saveDraft(header, convertedOrderDetail)
      
      if (res?.order_number) {
        // Show success toaster for draft save
        toast({
          title: "Draft Saved Successfully!",
          description: `Draft #${res.order_number} has been saved.`,
          variant: "default",
        })
        
        // Update order header with new order number
        setOrderHeader({ ...orderHeader, order_number: res.order_number })
        
        // Reset unsaved changes state
        markAsClean()
      } else {
        // Show error toaster if no order number returned
        toast({
          title: "Draft Save Failed",
          description: "Failed to save draft. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      // Show error toaster with error message
      const errorMessage = error?.error_message || error?.message || "An error occurred while saving the draft."
      toast({
        title: "Draft Save Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSavingDraft(false)
    }
  }

  async function onPlaceOrder() {
    if (isPlacingOrder) return // Prevent multiple calls
    
    setIsPlacingOrder(true)
    try {
    const header = buildOrderHeaderForSubmit(false)
    
    // Convert dates in order detail items from native format to ISO format
    const convertDateToISO = (dateStr: string): string => {
      if (!dateStr) return ''
      try {
        // If it's already in ISO format, return as is
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateStr
        }
        // If it's in native format, convert to ISO
        const date = new Date(dateStr)
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0] || dateStr
        }
        return dateStr
      } catch {
        return dateStr
      }
    }
    
    const convertedOrderDetail = orderDetail.map(item => ({
      ...item,
      do_not_ship_before: convertDateToISO(item.do_not_ship_before ?? ''),
      ship_by: convertDateToISO(item.ship_by ?? '')
    }))
    
    const res = await saveEntry(header, convertedOrderDetail)
      
      if (res?.order_number) {
        // Show success toaster with order number
        toast({
          title: "Order Placed Successfully!",
          description: `Order #${res.order_number} has been placed successfully.`,
          variant: "default",
        })
        
        // Reset unsaved changes state
        markAsClean()
        
        // Navigate to order details
        router.push(`/orders/${res.order_number}`)
      } else {
        // Show error toaster if no order number returned
        toast({
          title: "Order Placement Failed",
          description: "Failed to place order. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      // Show error toaster with error message
      const errorMessage = error?.error_message || error?.message || "An error occurred while placing the order."
      toast({
        title: "Order Placement Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  function buildOrderHeaderForSubmit(toDraft: boolean): OrderHeaderDto {
    let account_number = ''
    let location = ''
    if (accountNumberLocation.trim()) {
      const parts = accountNumberLocation.split('.')
      account_number = parts[0] || ''
      location = parts[1] || ''
    }
    const totals = orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0)
    const subtotal = totals
    const total_due = subtotal + (amounts.shipping_handling||0) + (amounts.sales_tax||0) + (amounts.international_handling||0)
    const net_due_currency = total_due - (amounts.amount_paid||0)
    
    // Convert dates from native format to ISO format for API
    const convertDateToISO = (dateStr: string): string => {
      if (!dateStr) return ''
      try {
        // If it's already in ISO format, return as is
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateStr
        }
        // If it's in native format, convert to ISO
        const date = new Date(dateStr)
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0] || dateStr
        }
        return dateStr
      } catch {
        return dateStr
      }
    }
    
    return {
      ...orderHeader,
      ordered_date: convertDateToISO(orderHeader.ordered_date ?? ''),
      order_subtotal: subtotal,
      shipping_handling: amounts.shipping_handling,
      balance_due_us: 0,
      amount_paid: amounts.amount_paid,
      total_due,
      net_due_currency,
      international_handling: amounts.international_handling,
      international_declared_value: amounts.international_declared_value,
      sales_tax: amounts.sales_tax,
      insurance: amounts.insurance,
      account_number,
      location,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    }
  }

  async function onValidateAddress() {
    const res = await (await import('@/services/api')).validateAddress({ action: 'validate_address', data: {
      address1: shippingAddress.address1 || '',
      address2: shippingAddress.address2 || '',
      city: shippingAddress.city || '',
      state_province: shippingAddress.state_province || '',
      postal_code: shippingAddress.postal_code || ''
    }})
    
    // Only show dialog if there are warnings or errors
    if (res.warnings || res.errors) {
      setValidateResult(res)
      setValidateOpen(true)
    } else if (res.correct_address) {
      // Auto-update address on success (no warnings/errors)
      const corrected = { ...res.correct_address, country: 'US' }
      setShippingAddress(prev => ({ ...prev, ...corrected }))
      // Show success toast (matching legacy behavior)
      toast({
        title: 'Address Validated Successfully!',
        description: 'The address has been validated and updated automatically.',
        variant: 'success'
      })
    }
  }

  function onAcceptCorrectAddress() {
    if (validateResult?.correct_address) {
      const corrected = { ...validateResult.correct_address, country: 'US' }
      setShippingAddress(prev => ({ ...prev, ...corrected }))
    }
    setValidateOpen(false)
  }

  async function onBrowseItems() {
    // Determine matched warehouse based on Order Header account location
    let matchedWarehouseValue = ''
    if (orderHeader.account_number && orderHeader.location) {
      try {
        const authTokenStr = window.localStorage.getItem('authToken')
        if (authTokenStr) {
          const authToken = JSON.parse(authTokenStr)
          const warehousesData = authToken?.user_data?.warehouses || {}
          
          // Find matching warehouse based on account_number.location format
          const locationDerived = orderHeader.location
          const accountDerived = orderHeader.account_number
          
          // Look for matching warehouse
          const matchedLocation = Object.keys(warehousesData).find(
            w => w.toLowerCase() === locationDerived.toLowerCase()
          )
          
          if (matchedLocation) {
            // Find matching branch within the warehouse
            const warehouse = warehousesData[matchedLocation]
            for (const branch of warehouse) {
              for (const [branchKey, accounts] of Object.entries(branch)) {
                if (Array.isArray(accounts) && accounts.includes(accountDerived)) {
                  matchedWarehouseValue = `${matchedLocation}-${branchKey}`
                  break
                }
              }
              if (matchedWarehouseValue) break
            }
          }
        }
      } catch (error) {
        console.error('Error determining matched warehouse:', error)
      }
    }
    
    setMatchedWarehouse(matchedWarehouseValue)
    
    // Set the warehouse filter to match the Order Header warehouse
    if (matchedWarehouseValue) {
      setWarehouses(matchedWarehouseValue)
    }
    
    // Quick add if toolbar has a value and single match exists; else open modal
    const trimmed = (findItemValue || '').trim()
    if (trimmed) {
      // Show loading state for search
      setSearchingItems(true)
      
      // Call API to search for items (no cache)
      try {
        const response = await fetchInventoryForCart({
          page_num: 1,
          page_size: 5,
          filter: { and: [ { field: 'omit_zero_qty', oper: '=', value: true }, { field: 'name', oper: '=', value: trimmed } ] }
        } as any)
        const rows = response.rows || []
        
        if (rows.length === 1) {
          const first = rows[0] as NonNullable<typeof rows[number]>
          
          // Check if item already exists in cart
          const itemExists = orderDetail.some(item => item.item_number === first.item_number && !item.voided)
          if (itemExists) {
            setFindItemValue('')
            setSearchingItems(false)
            return
          }
          
          const maxLine = orderDetail.filter(l => !l.is_kit_component).reduce((m,l) => Math.max(m, l.line_number||0), 0)
          const newLine: OrderDetailDto = {
            detail_id: 0,
            line_number: maxLine + 1,
            item_number: first.item_number,
            description: first.description,
            quantity: 1,
            price: 0,
            do_not_ship_before: new Date().toLocaleDateString(),
            ship_by: new Date(Date.now() + 86400000).toLocaleDateString(),
            voided: false,
          }
          setOrderDetail(prev => renumberDraftLines([ ...prev, newLine ]))
          setFindItemValue('')
          markAsChanged()
          setSearchingItems(false)
          return
        }
      } catch (error) {
        console.error('Error searching for items:', error)
      } finally {
        setSearchingItems(false)
      }
    }
    
    // Open dialog immediately and load fresh inventory data inside
    setBrowseOpen(true)
    setBrowseItemsLoading(true)
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setBrowseItemsLoading(false)
    }, 10000) // 10 second timeout
    
    try {
      await reloadInventory(1)
    } catch (error) {
      console.error('Error loading inventory:', error)
    } finally {
      clearTimeout(timeoutId)
      setBrowseItemsLoading(false)
    }
  }


  function onRemoveSelected() {
    if (selectedRows.length === 0) return

    // Remove selected rows; include their kit components
    const selectedItems = selectedRows.map(index => orderDetail[index]).filter(Boolean)
    const selectedKeys = new Set(selectedItems.map(r => `${r?.item_number || ''}#${r?.line_number || ''}`))
    const selectedParentLines = new Set(selectedItems.filter(r => !r?.is_kit_component).map(r => r?.line_number || 0))
    
    const remaining = orderDetail.filter((r, index) => {
      // Don't remove if not selected
      if (!selectedRows.includes(index)) return true
      
      // Don't remove voided items (they should stay but be crossed out)
      if (r.voided) return true
      
      const key = `${r.item_number}#${r.line_number}`
      if (selectedKeys.has(key)) return false
      if (r.is_kit_component) {
        const parent = Math.floor(r.line_number/1000)
        if (selectedParentLines.has(parent)) return false
      }
      return true
    })
    
    setOrderDetail(renumberDraftLines(remaining))
    setSelectedRows([])
    setSelectedRowsCount(0)
    markAsChanged()
  }

  // Helper function to safely get warehouse options
  function getWarehouseOptions(): Array<{value: string, label: string}> {
    try {
      const auth = getAuthState() as any;
      if (!auth?.userApps) return [];
      
      // Get warehouses data from auth token (same as legacy getUserData('warehouses'))
      const authTokenStr = window.localStorage.getItem('authToken');
      if (!authTokenStr) return [];
      
      const authToken = JSON.parse(authTokenStr);
      const warehousesData = authToken?.user_data?.warehouses;
      
      
      if (!warehousesData || typeof warehousesData !== 'object') return [];
      
      const options: Array<{value: string, label: string}> = [];
      
      // Process warehouses exactly like legacy code
      Object.keys(warehousesData).forEach((aWarehouse) => {
        const branches = warehousesData[aWarehouse];
        if (Array.isArray(branches)) {
          branches.forEach((branchObj: any) => {
            if (branchObj && typeof branchObj === 'object') {
              Object.keys(branchObj).forEach((anInvType) => {
                const optionValue = `${aWarehouse}-${anInvType}`;
                const optionLabel = `${aWarehouse} - ${anInvType}`;
                options.push({ value: optionValue, label: optionLabel });
              });
            }
          });
        }
      });
      
      return options;
    } catch (error) {
      console.error('Error loading warehouse options:', error);
      return [];
    }
  }

  // Helper function to get account options from calc_account_regions
  function getAccountOptions(): Array<{value: string, label: string}> {
    try {
      const authTokenStr = window.localStorage.getItem('authToken');
      if (!authTokenStr) return [];

      const authToken = JSON.parse(authTokenStr);
      const calcAccountRegions = authToken?.user_data?.calc_account_regions || {};

      const accountKeys = Object.keys(calcAccountRegions);
      accountKeys.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      return accountKeys.map(key => ({
        value: key,
        label: calcAccountRegions[key]
      }));
    } catch (error) {
      console.error('Error loading account options:', error);
      return [];
    }
  }

  function getOrderStatusOptions(): Array<{value: string, label: string}> {
    return [
      { value: '1', label: 'Normal' },
      { value: '2', label: 'On Hold' },
      { value: '0', label: 'Canceled' }
    ];
  }

  function handleAccountLocationChange(value: string) {
    setAccountNumberLocation(value);
    
    // Find and set the display label
    const accountOptions = getAccountOptions();
    const selectedOption = accountOptions.find(opt => opt.value === value);
    setAccountDisplayLabel(selectedOption ? selectedOption.label : '');
    
    if (value) {
      // Parse account_number.location format (e.g., "123.ABC" -> account_number: "123", location: "ABC")
      const accountNumber = value.replace(/\.\w+/, '');
      const location = value.replace(/\d+\./, '');
      setOrderHeader(prev => ({
        ...prev,
        account_number: accountNumber,
        location: location
      }));
      markAsChanged();
    } else {
      setOrderHeader(prev => ({
        ...prev,
        account_number: '',
        location: ''
      }));
      markAsChanged();
    }
  }

  function handleOrderStatusChange(value: string) {
    setOrderHeader(prev => ({
      ...prev,
      order_status: +value
    }));

    // Find and set the display label
    const orderStatusOptions = getOrderStatusOptions();
    const selectedOption = orderStatusOptions.find(opt => opt.value === value);
    setOrderStatusDisplayLabel(selectedOption ? selectedOption.label : '');
    markAsChanged()
  }

  async function reloadInventory(page = currentPage) {
    
    const and: any[] = []
    // Warehouse filter
    if (warehouses && typeof warehouses === 'string') {
      const parts = warehouses.split('-')
      if (parts.length >= 2) {
        const [inv_region, inv_type] = parts
        and.push({ field: 'inv_type', oper: '=', value: inv_type })
        and.push({ field: 'inv_region', oper: '=', value: inv_region })
      }
    }
    and.push({ field: 'omit_zero_qty', oper: '=', value: !showZeroQty })
    if (itemFilter && typeof itemFilter === 'string') {
      and.push({ field: 'name', oper: 'like', value: `%${itemFilter}%` })
    }
    

    const payload: Omit<InventoryStatusForCartBody,'resource'|'action'> = {
      page_num: page,
      page_size: pageSize,
      sort: [{ item_number: 'asc' } as any],
      filter: { and },
    }
    const response = await fetchInventoryForCart(payload)
    const rows = response.rows || []
    const total = response.total || 0
    
    
    setTotalItems(total)
    setCurrentPage(page)
    
    const hash: any = {}
    const existing = new Map(orderDetail.map(od => [od.item_number, od]))
    rows.forEach((r: any) => {
      const added = existing.get(r.item_number)
      hash[r.item_number] = {
        ...r,
        quantity: added ? added.quantity : undefined,
        price: added ? added.price : undefined,
      }
    })
    setInventory(hash)
  }

  // Pagination functions
  function goToPage(page: number) {
    const totalPages = Math.ceil(totalItems / pageSize)
    const targetPage = Math.max(1, Math.min(page, totalPages))
    if (targetPage !== currentPage) {
      reloadInventory(targetPage)
    }
  }

  function goToFirstPage() { goToPage(1) }
  function goToPrevPage() { goToPage(currentPage - 1) }
  function goToNextPage() { goToPage(currentPage + 1) }
  function goToLastPage() { goToPage(Math.ceil(totalItems / pageSize)) }

  useEffect(()=>{ 
    if (browseOpen) {
      setCurrentPage(1)
      reloadInventory(1) 
    }
  }, [browseOpen])

  // Debug pagination state
  useEffect(() => {
  }, [totalItems, pageSize, currentPage])

  // Initialize accountNumberLocation from orderHeader
  useEffect(() => {
    if (orderHeader.account_number && orderHeader.location) {
      const accountLocation = `${orderHeader.account_number}.${orderHeader.location}`;
      setAccountNumberLocation(accountLocation);

      // Also set the display label
      const accountOptions = getAccountOptions();
      const selectedOption = accountOptions.find(opt => opt.value === accountLocation);
      setAccountDisplayLabel(selectedOption ? selectedOption.label : '');
    }
  }, [orderHeader.account_number, orderHeader.location]);

  useEffect(() => {
    // Initialize order status display label
    const orderStatusOptions = getOrderStatusOptions();
    const selectedOption = orderStatusOptions.find(opt => opt.value === String(orderHeader.order_status ?? 1));
    setOrderStatusDisplayLabel(selectedOption ? selectedOption.label : '');
  }, [orderHeader.order_status]);

  // Handle search input changes with debouncing
  useEffect(() => {
    if (!browseOpen) return;


    // If search is empty, reload immediately to show all items
    if (itemFilter === '') {
      setCurrentPage(1);
      reloadInventory(1);
      return;
    }

    // If search has content, use debounced search
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      reloadInventory(1);
    }, 350);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [itemFilter, browseOpen])

  // Handle showZeroQty changes (immediate reload)
  useEffect(() => {
    if (browseOpen) {
      setCurrentPage(1)
      reloadInventory(1)
    }
  }, [showZeroQty, browseOpen])

  // Handle warehouse changes (immediate reload)
  useEffect(() => {
    if (browseOpen) {
      setCurrentPage(1)
      reloadInventory(1)
    }
  }, [warehouses, browseOpen])

  // Load address book when dialog opens
  useEffect(() => {
    if (showAddressBook) {
      loadAddressBook()
    }
  }, [showAddressBook, addressBookPage, addressBookFilter])

  function updateInventoryField(item_number: string, field: 'quantity' | 'price', value: string) {
    const v = value.trim()
    if (v !== '' && !isFiniteNumber(v)) return
    setInventory(prev => {
      const current = prev[item_number]
      if (!current) return prev
      return {
        ...prev,
        [item_number]: {
          ...current,
          [field]: v === '' ? undefined : +v
        }
      }
    })
  }

  function addSelectedItemsToOrder() {
    const items = Object.values(inventory).filter((it): it is NonNullable<typeof inventory[string]> => isFiniteNumber((it as any).quantity))
    if (!items.length) { setBrowseOpen(false); return }
    const hash = new Map(orderDetail.map(od => [od.item_number, od]))
    let next = [...orderDetail]
    items.forEach(it => {
      const exists = hash.get(it.item_number)
      if (exists) {
        exists.quantity = (it.quantity as number)
        exists.price = (isFiniteNumber((it as any).price) ? (it.price as number) : (exists.price || 0))
      } else {
        const maxLine = next.filter(l => !l.is_kit_component).reduce((m,l) => Math.max(m, l.line_number||0), 0)
        next.push({
          detail_id: 0,
          line_number: maxLine + 1,
          item_number: it.item_number,
          description: it.description,
          quantity: ((it as any).quantity as number) || 1,
          price: (isFiniteNumber((it as any).price) ? (it.price as number) : 0),
          do_not_ship_before: new Date().toLocaleDateString(),
          ship_by: new Date(Date.now() + 86400000).toLocaleDateString(),
          voided: false,
        })
      }
    })
    setOrderDetail(renumberDraftLines(next))
    setBrowseOpen(false)
    markAsChanged()
  }

  return (
    <div className="bg-body-color">
      {/* Header with Title and Actions */}
      <div className="bg-card-color border-b border-border-color px-6 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-font-color mb-0.5 flex items-center gap-2">
              OrderPoints - Order Entry
            </h1>
            <p className="text-sm text-font-color-100">
              Create and manage purchase orders
              {hasUnsavedChanges && <span className="text-orange-500 ml-2">• Unsaved changes detected</span>}
              <button 
                onClick={() => {}}
                className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded"
              >
                Debug
              </button>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={onNewOrder} 
              disabled={isPlacingOrder || isSavingDraft}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              New Order
            </Button>
            <Button 
              onClick={onSaveDraft} 
              disabled={isSavingDraft || isPlacingOrder}
              variant="outline" 
              className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-blue-500 disabled:hover:text-blue-600 px-4 py-2"
            >
              {isSavingDraft ? "Saving..." : "Save Draft"}
            </Button>
            <Button 
              onClick={onPlaceOrder} 
              disabled={isPlacingOrder || isSavingDraft}
              className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto p-6 space-y-6" style={{ maxWidth: '1600px' }}>

        {/* Main Layout: Left side (9) + Right Sidebar (3) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-9 space-y-4">
            {/* Order Header and Shipping Address on same row */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Order Header - 40% width (5 columns) */}
              <Card className="shadow-sm border-border-color xl:col-span-5">
                <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
                <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                  <IconFileText className="w-3.5 h-3.5" />
                  ORDER HEADER
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                  <div className="space-y-3">
                    {/* Row 1: Account # - Warehouse | Order # */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          Account # - Warehouse
                          <RequiredDot show={isRequiredFieldEmpty(accountNumberLocation)} />
                        </Label>
                        <Select value={accountNumberLocation} onValueChange={handleAccountLocationChange}>
                        <SelectTrigger className={`h-9 text-sm mt-1 ${(isPlacingOrder || isSavingDraft) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <span className={`truncate ${accountDisplayLabel ? 'font-medium' : ''}`}>
                              {accountDisplayLabel || ""}
                            </span>
                        </SelectTrigger>
                        <SelectContent className="bg-card-color border-border-color">
                            <SelectItem value="" className="text-font-color hover:bg-body-color">
                              
                            </SelectItem>
                            {getAccountOptions().map(option => (
                              <SelectItem key={option.value} value={option.value} className="text-font-color hover:bg-body-color">
                                <span className="whitespace-nowrap">{option.label}</span>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                      <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          Order #
                        </Label>
                        {orderSettings.manual === false ? (
                          // Auto-generation mode: special styling with generate button
                          <div className="flex mt-1">
                            <div className="flex-1 relative">
                              <Input
                                value={orderHeader.order_number || ''}
                                onChange={e => {
                                  setOrderHeader(prev => ({ ...prev, order_number: e.target.value }))
                                  markAsChanged()
                                }}
                                readOnly={!orderHeader.order_number}
                                className={`font-mono h-9 text-sm rounded-r-none border-r-0 ${
                                  !orderHeader.order_number 
                                    ? 'bg-primary-10' 
                                    : 'bg-card-color'
                                } ${orderHeader.order_number ? 'font-medium' : ''}`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={onGenerateOrderNumber}
                              disabled={!!orderHeader.order_number}
                              className={`px-3 py-2 rounded-r-lg rounded-l-none border border-l-0 border-border-color h-9 text-sm font-medium transition-colors ${
                                orderHeader.order_number 
                                  ? 'bg-body-color text-font-color-100 cursor-not-allowed opacity-50' 
                                  : 'bg-primary text-white hover:bg-primary-20 cursor-pointer'
                              }`}
                              title={orderHeader.order_number ? "Order number already assigned" : "Assign Next Order #"}
                            >
                              &gt;&gt;
                            </button>
                          </div>
                        ) : (
                          // Manual mode: standard input field
                          <Input 
                            className={`h-9 text-sm mt-1 ${orderHeader.order_number ? 'font-medium' : ''}`} 
                            value={orderHeader.order_number || ''} 
                            onChange={e=>{setOrderHeader(p=>({ ...p, order_number: e.target.value })); markAsChanged()}} 
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Row 2: Customer # | PO # */}
                    <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          Customer #
                        </Label>
                        <Input 
                          className={`h-8 text-sm mt-1 ${orderHeader.customer_number ? 'font-medium' : ''}`} 
                          value={orderHeader.customer_number || ''} 
                          onChange={e=>{setOrderHeader(p=>({ ...p, customer_number: e.target.value })); markAsChanged()}} 
                        />
                  </div>
                <div>
                  <Label className="text-font-color-100 text-sm flex items-center">
                    PO #
                  </Label>
                  <Input 
                    className={`h-8 text-sm mt-1 ${orderHeader.po_number ? 'font-medium' : ''}`} 
                    value={orderHeader.po_number || ''} 
                    onChange={e=>{setOrderHeader(p=>({ ...p, po_number: e.target.value })); markAsChanged()}} 
                  />
                </div>
                    </div>
                    
                    {/* Row 3: Order Status | PO Date */}
                    <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          Order Status
                          <RequiredDot show={isRequiredFieldEmpty(orderHeader.order_status)} />
                        </Label>
                        <Select value={String(orderHeader.order_status ?? 1)} onValueChange={handleOrderStatusChange}>
                          <SelectTrigger className="h-8 text-sm mt-1">
                            <span className={`truncate ${orderStatusDisplayLabel ? 'font-medium' : ''}`}>
                              {orderStatusDisplayLabel || "Select Order Status"}
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-card-color border-border-color">
                            {getOrderStatusOptions().map(option => (
                              <SelectItem key={option.value} value={option.value} className="text-font-color hover:bg-body-color">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          PO Date
                          <RequiredDot show={isRequiredFieldEmpty(orderHeader.ordered_date)} />
                        </Label>
                        <EditableDatePicker 
                          value={orderHeader.ordered_date || ''} 
                          onChange={value=>{setOrderHeader(p=>({ ...p, ordered_date: value })); markAsChanged()}} 
                          placeholder="Select PO date"
                          className="h-8 mt-1"
                        />
                </div>
                    </div>
                    
                    {/* Row 4: Shipping Instructions | Comments */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                  <Label className="text-font-color-100 text-sm flex items-center">
                    Shipping Instructions
                  </Label>
                  <div className="relative">
                    <Textarea 
                      className="bg-card-color border-border-color text-font-color text-sm mt-1 pr-8 cursor-pointer" 
                      rows={4} 
                      value={orderHeader.shipping_instructions || ''} 
                      onChange={e=>{setOrderHeader(p=>({ ...p, shipping_instructions: e.target.value })); markAsChanged()}} 
                      onClick={openShippingInstructionsDialog}
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={openShippingInstructionsDialog}
                      className="absolute top-2 right-2 p-1 text-font-color-100 hover:text-font-color transition-colors"
                      title="Expand to edit"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                      <div>
                  <Label className="text-font-color-100 text-sm flex items-center">
                    Comments
                  </Label>
                  <div className="relative">
                    <Textarea 
                      className="bg-card-color border-border-color text-font-color text-sm mt-1 pr-8 cursor-pointer" 
                      rows={4} 
                      value={orderHeader.packing_list_comments || ''} 
                      onChange={e=>{setOrderHeader(p=>({ ...p, packing_list_comments: e.target.value })); markAsChanged()}} 
                      onClick={openCommentsDialog}
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={openCommentsDialog}
                      className="absolute top-2 right-2 p-1 text-font-color-100 hover:text-font-color transition-colors"
                      title="Expand to edit"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                  </div>
                      </div>
                </div>
              </div>
            </CardContent>
          </Card>

              {/* Shipping Address - 60% width (7 columns) */}
            <Card className="shadow-sm border-border-color xl:col-span-7">
              <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                    <IconTruck className="w-3.5 h-3.5" />
                    SHIPPING ADDRESS
                  </CardTitle>
                <div className="flex gap-2">
                    <Button
                      size="small"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-3 py-1"
                      onClick={() => setShowAddressBook(true)}
                    >
                      Address Book…
                    </Button>
                    <Button
                      size="small" 
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-green-500 disabled:hover:text-green-600 text-sm px-3 py-1"
                      onClick={onValidateAddress}
                      disabled={!canValidateAddress()}
                    >
                      Validate
                    </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-font-color-100 text-sm flex items-center">
                      Company
                      <HalfRequiredDot show={!hasAtLeastOne(shippingAddress.company, shippingAddress.attention)} />
                    </Label>
                    <Input 
                      className="h-8 text-sm mt-1" 
                      value={shippingAddress.company||''} 
                      onChange={e=>{setShippingAddress({...shippingAddress,company:e.target.value}); markAsChanged()}} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm flex items-center">
                      Attention
                      <HalfRequiredDot show={!hasAtLeastOne(shippingAddress.company, shippingAddress.attention)} />
                    </Label>
                    <Input 
                      className="h-8 text-sm mt-1" 
                      value={shippingAddress.attention||''} 
                      onChange={e=>{setShippingAddress({...shippingAddress,attention:e.target.value}); markAsChanged()}} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium flex items-center">
                      Address 1
                      <RequiredDot show={isRequiredFieldEmpty(shippingAddress.address1)} />
                    </Label>
                    <Input 
                      className="h-9 text-sm mt-1" 
                      value={shippingAddress.address1||''} 
                      onChange={e=>{setShippingAddress({...shippingAddress,address1:e.target.value}); markAsChanged()}} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium flex items-center">
                      Address 2
                    </Label>
                    <Input 
                      className="h-9 text-sm mt-1" 
                      value={shippingAddress.address2||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,address2:e.target.value})} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium flex items-center">
                      City
                      <RequiredDot show={isRequiredFieldEmpty(shippingAddress.city)} />
                    </Label>
                    <Input 
                      className="h-9 text-sm mt-1" 
                      value={shippingAddress.city||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,city:e.target.value})} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium flex items-center">
                      Postal Code
                      <RequiredDot show={isPostalCodeRequired() && isRequiredFieldEmpty(shippingAddress.postal_code)} />
                    </Label>
                    <Input 
                      className="h-9 text-sm mt-1" 
                      value={shippingAddress.postal_code||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,postal_code:e.target.value})} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium flex items-center">
                      Country
                      <RequiredDot show={isRequiredFieldEmpty(shippingAddress.country)} />
                    </Label>
                    <div className="mt-1">
                      <div className="relative">
                        <CountryFilterCombobox
                          value={shippingAddress.country || ''}
                          onValueChange={(v: string) => {
                            setShippingAddress({...shippingAddress, country: v, state_province: ''});
                            markAsChanged();
                          }}
                          boldWhenSelected={true}
                        />
                        <style jsx>{`
                          .relative :global(label) {
                            display: none !important;
                          }
                        `}</style>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium flex items-center">
                      State
                      <RequiredDot show={isStateRequired() && isRequiredFieldEmpty(shippingAddress.state_province)} />
                    </Label>
                    <div className="mt-1">
                      <div className="relative">
                        <StateFilterCombobox
                          value={shippingAddress.state_province||''}
                          onValueChange={(v: string) => {
                            setShippingAddress({...shippingAddress, state_province: v}); 
                            markAsChanged();
                          }}
                          countryValue={shippingAddress.country || ''}
                          boldWhenSelected={true}
                        />
                        <style jsx>{`
                          .relative :global(label) {
                            display: none !important;
                          }
                        `}</style>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium flex items-center">
                      Phone
                    </Label>
                    <Input 
                      className="h-9 text-sm mt-1" 
                      value={shippingAddress.phone||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,phone:e.target.value})} 
                    />
                  </div>
                  <div>
                    <Label className="text-font-color-100 text-sm font-medium flex items-center">
                      Email
                    </Label>
                    <Input 
                      className="h-9 text-sm mt-1" 
                      type="email"
                      value={shippingAddress.email||''} 
                      onChange={e=>setShippingAddress({...shippingAddress,email:e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>

            {/* Items */}
            <Card className="shadow-sm border-border-color">
              <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                    <IconShoppingCart className="w-3.5 h-3.5" />
                    ITEMS
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative w-48 sm:w-64 md:w-72 lg:w-80 xl:w-96">
                      <Input
                        placeholder="Add item…"
                        className="h-8 text-xs disabled:opacity-50 disabled:cursor-not-allowed w-full"
                        value={findItemValue}
                        onChange={e=>setFindItemValue(e.target.value)}
                        onKeyDown={e=>{ if (e.key === 'Enter') onBrowseItems() }}
                        disabled={isPlacingOrder || isSavingDraft || !accountNumberLocation || searchingItems}
                      />
                      {searchingItems && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-blue-600"></div>
                        </div>
                      )}
                    </div>
                    <Button
                      size="small"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 whitespace-nowrap text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={onBrowseItems}
                      disabled={isPlacingOrder || isSavingDraft}
                    >
                      Browse Items…
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      className="whitespace-nowrap border-red-500 text-red-600 hover:!bg-red-50 hover:!border-red-600 hover:!text-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:!bg-transparent disabled:hover:!border-red-500 disabled:hover:!text-red-600 transition-colors duration-200"
                      onClick={onRemoveSelected}
                      disabled={selectedRowsCount === 0 || isPlacingOrder || isSavingDraft}
                    >
                      Remove selected {selectedRowsCount > 0 && `(${selectedRowsCount})`}
                    </Button>
                  </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                {orderDetail.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No items in cart
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-color bg-body-color">
                        <th className="text-left p-2 w-8">
                          <CheckBox
                            checked={selectedRowsCount === orderDetail.filter(r => !r.is_kit_component && !r.voided).length && orderDetail.filter(r => !r.is_kit_component && !r.voided).length > 0}
                            onChange={(checked) => {
                              if (checked) {
                                const selectableIndices = orderDetail.map((r, i) => !r.is_kit_component && !r.voided ? i : -1).filter(i => i !== -1)
                                setSelectedRows(selectableIndices)
                                setSelectedRowsCount(selectableIndices.length)
                              } else {
                                setSelectedRows([])
                                setSelectedRowsCount(0)
                              }
                            }}
                            size="normal"
                            mode="emulated"
                          />
                        </th>
                        <th className="text-center p-2 font-medium text-font-color-100">#</th>
                        <th className="text-left p-2 font-medium text-font-color-100">Item #</th>
                        <th className="text-left p-2 font-medium text-font-color-100">Description</th>
                        <th className="text-center p-2 font-medium text-font-color-100">Qty</th>
                        <th className="text-right p-2 font-medium text-font-color-100">Unit Price</th>
                        <th className="text-right p-2 font-medium text-font-color-100">Ext Price</th>
                        <th className="text-center p-2 font-medium text-font-color-100">Don't Ship</th>
                        <th className="text-center p-2 font-medium text-font-color-100">Ship By</th>
                        <th className="text-center p-2 font-medium text-font-color-100">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetail.map((item, index) => {
                        const isSelectable = !item.is_kit_component && !item.voided
                        const isSelected = selectedRows.includes(index)
                        const isBundleComponent = item.is_kit_component
                        const isVoided = item.voided
                        
                        return (
                          <tr 
                            key={`${item.item_number}-${item.line_number}`}
                            className={`border-b border-border-color hover:bg-body-color ${
                              isBundleComponent ? 'bg-gray-50 text-gray-500' : ''
                            } ${isVoided ? 'line-through opacity-60' : ''}`}
                          >
                            <td className="p-2">
                              {isSelectable && (
                                <CheckBox
                                  checked={isSelected}
                                  onChange={(checked) => {
                                    if (checked) {
                                      setSelectedRows([...selectedRows, index])
                                      setSelectedRowsCount(selectedRowsCount + 1)
                                    } else {
                                      setSelectedRows(selectedRows.filter(i => i !== index))
                                      setSelectedRowsCount(selectedRowsCount - 1)
                                    }
                                  }}
                                  size="normal"
                                  mode="emulated"
                                />
                              )}
                            </td>
                            <td className="p-2 text-center text-font-color">
                              <div className="flex items-center justify-center gap-1">
                                <span>{item.line_number}</span>
                                {(item.comments || item.custom_field1 || item.custom_field2 || item.custom_field5) && (
                                  <IconMessageCircle className="w-3 h-3 text-gray-400" />
                                )}
                              </div>
                            </td>
                            <td className="p-2 text-font-color">
                              {isBundleComponent && <span className="text-gray-400 mr-2">└─</span>}
                              <span className="font-medium">{item.item_number}</span>
                            </td>
                            <td className="p-2 text-primary">
                              {isBundleComponent && <span className="text-gray-400 mr-2">└─</span>}
                              {item.description}
                            </td>
                            <td className="p-2 text-center text-font-color">{item.quantity}</td>
                            <td className="p-2 text-right text-font-color">{item.price ? Number(item.price).toFixed(2) : ''}</td>
                            <td className="p-2 text-right text-font-color">
                              {((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                            </td>
                            <td className="p-2 text-center text-font-color">
                              {item.do_not_ship_before ? new Date(item.do_not_ship_before).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}
                            </td>
                            <td className="p-2 text-center text-font-color">
                              {item.ship_by ? new Date(item.ship_by).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}
                            </td>
                            <td className="p-2 text-center">
                              {!isBundleComponent && !isVoided && (
                                <Button 
                                  size="small" 
                                  variant="outline" 
                                  className="text-sm px-2 py-1" 
                                  onClick={() => { 
                                    setEditLineIndex(index); 
                                    setEditLineData({ 
                                      description: item.description || '', 
                                      quantity: item.quantity || 0, 
                                      price: item.price || 0, 
                                      do_not_ship_before: item.do_not_ship_before || '', 
                                      ship_by: item.ship_by || '',
                                      custom_field1: item.custom_field1 || '', 
                                      custom_field2: item.custom_field2 || '', 
                                      custom_field5: item.custom_field5 || '', 
                                      comments: item.comments || '' 
                                    }); 
                                    setEditLineOpen(true); 
                                  }}
                                >
                                  Edit
                                </Button>
                              )}
                              {isBundleComponent && (
                                <span className="text-sm text-gray-400">Component</span>
                              )}
                              {isVoided && (
                                <span className="text-sm text-gray-400">Voided</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
                <div className="mt-4 grid grid-cols-3">
                  <div></div><div></div>
                  <div className="justify-self-end space-y-2 text-sm">
                    <div className="flex justify-between gap-4 text-font-color">
                      <span>Total Lines:</span>
                      <span className="font-mono font-semibold">{orderDetail.length}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-font-color">
                      <span>Total Qty:</span>
                      <span className="font-mono font-semibold">{orderDetail.reduce((t,l)=> t + (Number(l.quantity)||0), 0)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-font-color">
                      <span>Total Ext Price:</span>
                      <span className="font-mono font-semibold">{orderDetail.reduce((t,l)=> t + (Number(l.quantity)||0)*(Number(l.price)||0), 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - All 4 panels stacked vertically */}
           <div className="xl:col-span-3 space-y-3">
          <Card className="shadow-sm border-border-color">
             <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
              <div className="flex justify-between items-center">
                 <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                   <IconTruck className="w-3.5 h-3.5" />
                   SHIPPING
                </CardTitle>
                <Button
                  size="small"
                  variant="outline"
                  className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                  onClick={openShippingDetailsModal}
                  title="Edit"
                >
                  <IconEdit className="h-3 w-3" />
                </Button>
              </div>
              </CardHeader>
               <CardContent className="p-3">
               <div className="space-y-1 text-xs">
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Int. Code:</span> <span className="text-font-color text-right truncate max-w-[120px]" title={String(orderHeader.international_code || '0')}>{orderHeader.international_code || '0'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Shipping Carrier:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.shipping_carrier ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.shipping_carrier || '-'}>{orderHeader.shipping_carrier || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Shipping Service:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.shipping_service ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.shipping_service || '-'}>{orderHeader.shipping_service || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Freight Account:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.freight_account ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.freight_account || '-'}>{orderHeader.freight_account || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Consignee #:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.consignee_number ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.consignee_number || '-'}>{orderHeader.consignee_number || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Incoterms:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.terms ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.terms || '-'}>{orderHeader.terms || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">FOB Location:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.fob ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.fob || '-'}>{orderHeader.fob || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Payment Type:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.payment_type ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.payment_type || '-'}>{orderHeader.payment_type || '-'}</span></div>
                 <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Packing List:</span> <span className="text-font-color text-right truncate max-w-[120px]" title={String(orderHeader.packing_list_type || '100')}>{orderHeader.packing_list_type || '100'}</span></div>
                </div>
              </CardContent>
            </Card>

          <Card className="shadow-sm border-border-color">
            <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                  <IconBuilding className="w-3.5 h-3.5" />
                  BILLING ADDRESS
                </CardTitle>
                <div className="flex gap-2">
                <Button
                  size="small"
                  variant="outline"
                  className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                  onClick={() => setBillingExpanded(!billingExpanded)}
                  title={billingExpanded ? 'Collapse' : 'Expand'}
                >
                  <IconChevronDown className={`h-3 w-3 transition-transform ${billingExpanded ? 'rotate-180' : ''}`} />
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                  onClick={openBillingAddressModal}
                  title="Edit"
                >
                  <IconEdit className="h-3 w-3" />
                </Button>
                </div>
              </div>
              </CardHeader>
              <CardContent className="p-3">
              <div className="space-y-1 text-xs">
                {billingExpanded ? (
                  // Show all fields when expanded
                  <>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Company:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.company ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.company || '-'}>{billingAddress.company || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Attention:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.attention ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.attention || '-'}>{billingAddress.attention || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Address 1:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.address1 ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.address1 || '-'}>{billingAddress.address1 || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Address 2:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.address2 ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.address2 || '-'}>{billingAddress.address2 || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">City:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.city ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.city || '-'}>{billingAddress.city || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">State/Province:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.state_province ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.state_province || '-'}>{billingAddress.state_province || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Postal Code:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.postal_code ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.postal_code || '-'}>{billingAddress.postal_code || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Country:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.country ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.country || '-'}>{billingAddress.country || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Phone:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.phone ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.phone || '-'}>{billingAddress.phone || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Email:</span> <span className={`text-right truncate max-w-[120px] ${billingAddress.email ? 'text-font-color' : 'text-font-color-100'}`} title={billingAddress.email || '-'}>{billingAddress.email || '-'}</span></div>
                  </>
                ) : (
                  // Show only fields with values when collapsed
                  getBillingFieldsWithValues().length > 0 ? (
                    getBillingFieldsWithValues().map(field => (
                      <div key={field.key} className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">{field.label}:</span>
                        <span className="text-right truncate max-w-[120px] text-font-color" title={field.value}>{field.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-font-color-100 py-2">No billing address information</div>
                  )
                )}
                </div>
              </CardContent>
            </Card>

          <Card className="shadow-sm border-border-color">
            <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                  <IconCurrency className="w-3.5 h-3.5" />
                  AMOUNTS
                </CardTitle>
                <div className="flex gap-2">
                <Button
                  size="small"
                  variant="outline"
                  className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                  onClick={() => setAmountsExpanded(!amountsExpanded)}
                  title={amountsExpanded ? 'Collapse' : 'Expand'}
                >
                  <IconChevronDown className={`h-3 w-3 transition-transform ${amountsExpanded ? 'rotate-180' : ''}`} />
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                  onClick={openAmountsModal}
                  title="Edit"
                >
                  <IconEdit className="h-3 w-3" />
                </Button>
                </div>
              </div>
              </CardHeader>
              <CardContent className="p-3">
              <div className="space-y-1 text-xs">
                {amountsExpanded ? (
                  // Show all fields when expanded
                  <>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-font-color-100 whitespace-nowrap">Order Amount:</span>
                      <span className="font-mono text-font-color text-right truncate max-w-[120px]" title={`${orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0).toFixed(2)}`}>{orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-font-color-100 whitespace-nowrap">S & H:</span>
                      <span className={`font-mono text-right truncate max-w-[120px] ${amounts.shipping_handling > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.shipping_handling.toFixed(2)}`}>{amounts.shipping_handling.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-font-color-100 whitespace-nowrap">Sales Taxes:</span>
                      <span className={`font-mono text-right truncate max-w-[120px] ${amounts.sales_tax > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.sales_tax.toFixed(2)}`}>{amounts.sales_tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-font-color-100 whitespace-nowrap">Discount/Add. Chgs.:</span>
                      <span className={`font-mono text-right truncate max-w-[120px] ${amounts.international_handling > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.international_handling.toFixed(2)}`}>{amounts.international_handling.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-t border-border-color pt-1 font-bold">
                      <span className="text-font-color whitespace-nowrap">Total Amount:</span>
                      <span className="font-mono text-font-color text-right truncate max-w-[120px]" title={`${(orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0) + amounts.shipping_handling + amounts.sales_tax + amounts.international_handling).toFixed(2)}`}>{(orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0) + amounts.shipping_handling + amounts.sales_tax + amounts.international_handling).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-font-color-100 whitespace-nowrap">Amount Paid:</span>
                      <span className={`font-mono text-right truncate max-w-[120px] ${amounts.amount_paid > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.amount_paid.toFixed(2)}`}>{amounts.amount_paid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-t-2 border-border-color pt-1 font-bold">
                      <span className="text-font-color whitespace-nowrap">Net Due:</span>
                      <span className="font-mono text-font-color text-right truncate max-w-[120px]" title={`${(orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0) + amounts.shipping_handling + amounts.sales_tax + amounts.international_handling - amounts.amount_paid).toFixed(2)}`}>{(orderDetail.reduce((s,l)=> s + (l.quantity||0)*(l.price||0), 0) + amounts.shipping_handling + amounts.sales_tax + amounts.international_handling - amounts.amount_paid).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-font-color-100 whitespace-nowrap">Balance Due (US):</span>
                      <span className={`font-mono text-right truncate max-w-[120px] ${amounts.balance_due_us > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.balance_due_us.toFixed(2)}`}>{amounts.balance_due_us.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-font-color-100 whitespace-nowrap">Int. Decl. Value:</span>
                      <span className={`font-mono text-right truncate max-w-[120px] ${amounts.international_declared_value > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.international_declared_value.toFixed(2)}`}>{amounts.international_declared_value.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-font-color-100 whitespace-nowrap">Insurance:</span>
                      <span className={`font-mono text-right truncate max-w-[120px] ${amounts.insurance > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={`${amounts.insurance.toFixed(2)}`}>{amounts.insurance.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  // Show only fields with non-zero values when collapsed
                  getAmountsFieldsWithValues().map(field => (
                    <div key={field.key} className={`flex justify-between items-center py-0.5 ${field.isBold ? 'border-t border-border-color pt-1 font-bold' : ''}`}>
                      <span className={`whitespace-nowrap ${field.isBold ? 'text-font-color' : 'font-medium text-font-color-100'}`}>{field.label}:</span>
                      <span className={`font-mono text-right truncate max-w-[120px] ${field.isBold ? 'text-font-color' : 'text-font-color'}`} title={field.value.toFixed(2)}>{field.value.toFixed(2)}</span>
                    </div>
                  ))
                )}
                </div>
              </CardContent>
            </Card>

          <Card className="shadow-sm border-border-color">
            <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                  <IconEdit className="w-3.5 h-3.5" />
                  EXTRA FIELDS
                </CardTitle>
                <div className="flex gap-2">
                <Button
                  size="small"
                  variant="outline"
                  className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                  onClick={() => setExtraFieldsExpanded(!extraFieldsExpanded)}
                  title={extraFieldsExpanded ? 'Collapse' : 'Expand'}
                >
                  <IconChevronDown className={`h-3 w-3 transition-transform ${extraFieldsExpanded ? 'rotate-180' : ''}`} />
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                  onClick={openExtraFieldsModal}
                  title="Edit"
                >
                  <IconEdit className="h-3 w-3" />
                </Button>
                </div>
              </div>
              </CardHeader>
              <CardContent className="p-3">
              <div className="space-y-1 text-xs">
                {extraFieldsExpanded ? (
                  // Show all fields when expanded
                  <>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">{extraLabels.header_cf_1}:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.custom_field1 ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.custom_field1 || '-'}>{orderHeader.custom_field1 || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">{extraLabels.header_cf_2}:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.custom_field2 ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.custom_field2 || '-'}>{orderHeader.custom_field2 || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">{extraLabels.header_cf_3}:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.custom_field3 ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.custom_field3 || '-'}>{orderHeader.custom_field3 || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">{extraLabels.header_cf_4}:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.custom_field4 ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.custom_field4 || '-'}>{orderHeader.custom_field4 || '-'}</span></div>
                    <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">{extraLabels.header_cf_5}:</span> <span className={`text-right truncate max-w-[120px] ${orderHeader.custom_field5 ? 'text-font-color' : 'text-font-color-100'}`} title={orderHeader.custom_field5 || '-'}>{orderHeader.custom_field5 || '-'}</span></div>
                  </>
                ) : (
                  // Show only fields with values when collapsed
                  getExtraFieldsWithValues().length > 0 ? (
                    getExtraFieldsWithValues().map(field => (
                      <div key={field.key} className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">{field.label}:</span>
                        <span className="text-right truncate max-w-[120px] text-font-color" title={field.value}>{field.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-font-color-100 py-2">No extra fields information</div>
                  )
                )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      {/* Browse Items Modal */}
      <Dialog open={browseOpen} onOpenChange={(open) => {
        setBrowseOpen(open)
        if (!open) {
          setBrowseItemsLoading(false) // Reset loading state when dialog closes
        }
      }}>
        <DialogContent className="flex flex-col overflow-hidden" style={{ width: '900px', height: '720px', maxWidth: '90vw', maxHeight: '90vh', minWidth: '900px', minHeight: '720px' }}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Browse Items</DialogTitle>
            {!accountNumberLocation && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
                <p className="text-sm text-blue-800">
                  <strong>Information:</strong> Please select an Account # - Warehouse to enable order entry and browse items for that specific account.
                </p>
              </div>
            )}
          </DialogHeader>
          
          {/* Filters */}
          <div className="flex items-center justify-between gap-3 mb-3 flex-shrink-0">
            <Input
              placeholder="Search by item # or description"
              value={itemFilter}
              onChange={e=>setItemFilter(e.target.value)}
              className="w-48 h-9 text-sm"
            />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-font-color whitespace-nowrap">
              <CheckBox checked={showZeroQty} onChange={(checked)=>setShowZeroQty(checked)} />
              Show 0 QTY
            </label>
            <Select value={warehouses} onValueChange={setWarehouses}>
                <SelectTrigger className={`h-8 text-sm mt-1 ${warehouses ? 'font-medium' : ''}`} style={{ width: '200px' }}>
                <SelectValue placeholder="Warehouse: All" />
              </SelectTrigger>
                <SelectContent className="bg-card-color border-border-color" style={{ width: '200px' }}>
                <SelectItem value="" className="text-font-color hover:bg-body-color">Warehouse: All</SelectItem>
                {getWarehouseOptions().map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-font-color hover:bg-body-color">
                      <span className="whitespace-nowrap">{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
                className="bg-primary text-white hover:bg-primary/90 whitespace-nowrap"
              onClick={()=>reloadInventory()}
            >
              Refresh
            </Button>
          </div>
          </div>
          
          {/* Table Area - Flexible height */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full bg-card-color">
            <table className="w-full text-sm table-fixed" style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead>
                <tr className="border-b border-border-color">
                  <th className="text-left py-1 px-3 text-font-color-100 w-12">#</th>
                  <th className="text-left py-1 px-3 text-font-color-100 w-64">Item # / Description</th>
                  <th className="text-right py-1 px-3 text-font-color-100 w-20">Qty</th>
                  <th className="text-right py-1 px-3 text-font-color-100 w-24">Unit Price</th>
                  <th className="text-right py-1 px-3 text-font-color-100 whitespace-nowrap w-20">Net Avail</th>
                </tr>
              </thead>
              <tbody>
                {browseItemsLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-font-color-100">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                        <div>Loading items...</div>
                      </div>
                    </td>
                  </tr>
                ) : Object.keys(inventory).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-font-color-100">
                      <div className="text-lg mb-2">No items found</div>
                      <div className="text-sm">Try adjusting your search criteria or filters</div>
                    </td>
                  </tr>
                ) : (
                  Object.keys(inventory).map((key, idx)=>{
                  const it = inventory[key]!
                  return (
                    <tr key={key} className="border-t border-border-color hover:bg-body-color">
                        <td className="py-1 px-3 text-font-color w-12">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="py-1 px-3 w-64">
                          <div className="font-medium text-font-color truncate" title={it.item_number}>{it.item_number}</div>
                          <div className="text-primary text-sm truncate" title={it.description}>{it.description}</div>
                        </td>
                        <td className="py-1 px-3 text-right w-20">
                        <Input
                          value={typeof it.quantity === 'number' ? String(it.quantity) : ''}
                          onChange={e=>updateInventoryField(it.item_number, 'quantity', e.target.value)}
                            className="text-right bg-card-color border-border-color text-font-color w-full h-8 text-xs"
                          type="number"
                          min="0"
                          disabled={formFieldsDisabled}
                        />
                      </td>
                        <td className="py-1 px-3 text-right w-24">
                        <Input
                          value={typeof it.price === 'number' ? String(it.price) : ''}
                          onChange={e=>updateInventoryField(it.item_number, 'price', e.target.value)}
                            className="text-right bg-card-color border-border-color text-font-color w-full h-8 text-xs"
                          type="number"
                          step="0.01"
                          min="0"
                          disabled={formFieldsDisabled}
                        />
                      </td>
                        <td className="py-1 px-3 text-right text-font-color font-mono whitespace-nowrap w-20">{it.qty_net}</td>
                    </tr>
                  )
                  })
                )}
              </tbody>
            </table>
          </ScrollArea>
          </div>
          
          <DialogFooter className="flex-shrink-0 flex flex-col gap-4">
            {/* Pagination Controls */}
            {totalItems > pageSize && (
              <div className="flex items-center justify-between p-4 border-t border-border-color">
                <div className="flex items-center gap-2">
                  <Button
                    size="small"
                    variant="outline"
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                  >
                    <IconChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="small"
                    variant="outline"
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-font-color px-2">
                    Page {currentPage} of {Math.ceil(totalItems / pageSize)}
                  </span>
                  <Button
                    size="small"
                    variant="outline"
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={goToNextPage}
                    disabled={currentPage >= Math.ceil(totalItems / pageSize)}
                  >
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="small"
                    variant="outline"
                    className="border-border-color text-font-color hover:bg-body-color"
                    onClick={goToLastPage}
                    disabled={currentPage >= Math.ceil(totalItems / pageSize)}
                  >
                    <IconChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-font-color-100">
                  <strong>{totalItems}</strong> items on <strong>{Math.ceil(totalItems / pageSize)}</strong> pages
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              className="border-border-color text-font-color hover:bg-body-color"
              onClick={()=>setBrowseOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={addSelectedItemsToOrder}
            >
              Add to order
            </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validate Address Modal */}
      <Dialog open={validateOpen} onOpenChange={setValidateOpen}>
        <DialogContent style={{ maxWidth: 800 }}>
          <DialogHeader>
            <DialogTitle>Address validation</DialogTitle>
            <DialogDescription>
              The address verification program has suggested an update to the address you entered. Please{' '}
              <strong>Accept</strong> the updated address, or <strong>Cancel</strong> to return to the previous page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Address As-Entered Column */}
              <div>
                <h4 className="text-yellow-500 font-bold mb-4">Address As-Entered</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Address 1:</Label>
                    <Input 
                      className="mt-1" 
                      value={shippingAddress.address1 || ''} 
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Address 2:</Label>
                    <Input 
                      className="mt-1" 
                      value={shippingAddress.address2 || ''} 
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">City:</Label>
                    <Input 
                      className="mt-1" 
                      value={shippingAddress.city || ''} 
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">State:</Label>
                    <Input 
                      className="mt-1" 
                      value={shippingAddress.state_province || ''} 
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Postal Code:</Label>
                    <Input 
                      className="mt-1" 
                      value={shippingAddress.postal_code || ''} 
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Updated Address Column */}
              <div>
                <h4 className="text-yellow-500 font-bold mb-4">Updated Address</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Address 1:</Label>
                    <Input 
                      className="mt-1" 
                      value={validateResult?.correct_address?.address1 || ''} 
                      onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), address1: e.target.value } }))} 
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Address 2:</Label>
                    <Input 
                      className="mt-1" 
                      value={validateResult?.correct_address?.address2 || ''} 
                      onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), address2: e.target.value } }))} 
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">City:</Label>
                    <Input 
                      className="mt-1" 
                      value={validateResult?.correct_address?.city || ''} 
                      onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), city: e.target.value } }))} 
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">State:</Label>
                    <Input 
                      className="mt-1" 
                      value={validateResult?.correct_address?.state_province || ''} 
                      onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), state_province: e.target.value } }))} 
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Postal Code:</Label>
                    <Input 
                      className="mt-1" 
                      value={validateResult?.correct_address?.postal_code || ''} 
                      onChange={e=>setValidateResult(v=>({ ...v, correct_address: { ...(v.correct_address||{}), postal_code: e.target.value } }))} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Messages at Bottom */}
            <div className="mt-4 space-y-2">
              {validateResult?.errors && (
                <div className="text-red-600 font-bold text-sm">
                  Errors: {Array.isArray(validateResult.errors) ? validateResult.errors.join(', ') : validateResult.errors}
                </div>
              )}
              {validateResult?.warnings && (
                <div className="text-yellow-600 font-bold text-sm">
                  Warnings: {Array.isArray(validateResult.warnings) ? validateResult.warnings.join(', ') : validateResult.warnings}
                </div>
              )}
              {!validateResult?.errors && !validateResult?.warnings && (
                <div className="text-green-600 font-bold text-sm">
                  Status: VALIDATED_CHANGED
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-border-color text-font-color hover:bg-body-color"
              onClick={()=>setValidateOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              disabled={!!validateResult?.errors}
              onClick={onAcceptCorrectAddress}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Line Modal */}
      <Dialog open={editLineOpen} onOpenChange={setEditLineOpen}>
        <DialogContent style={{ maxWidth: 800 }}>
          <DialogHeader>
            <DialogTitle>Edit Line Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Main Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Description</Label>
                <Input 
                  className="mt-1" 
                  value={editLineData.description || ''} 
                  onChange={e=>setEditLineData(d=>({ ...d, description: e.target.value }))} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Quantity</Label>
                <Input 
                  type="number"
                  className="mt-1" 
                  value={editLineData.quantity || 0} 
                  onChange={e=>setEditLineData(d=>({ ...d, quantity: Number(e.target.value) }))} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Unit Price</Label>
                <Input 
                  type="number"
                  step="0.01"
                  className="mt-1" 
                  value={editLineData.price || 0} 
                  onChange={e=>setEditLineData(d=>({ ...d, price: Number(e.target.value) }))} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Extended Price</Label>
                <Input 
                  className="mt-1" 
                  value={((editLineData.quantity || 0) * (editLineData.price || 0)).toFixed(2)}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Don't Ship Before</Label>
                <EditableDatePicker 
                  value={editLineData.do_not_ship_before || ''} 
                  onChange={value=>setEditLineData(d=>({ ...d, do_not_ship_before: value }))} 
                  placeholder="Select date"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Ship By</Label>
                <EditableDatePicker 
                  value={editLineData.ship_by || ''} 
                  onChange={value=>setEditLineData(d=>({ ...d, ship_by: value }))} 
                  placeholder="Select date"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Custom Fields Row */}
            <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-font-color-100 text-sm">Custom Field 1</Label>
              <Input 
                className="mt-1" 
                  value={editLineData.custom_field1 || ''} 
                onChange={e=>setEditLineData(d=>({ ...d, custom_field1: e.target.value }))} 
              />
            </div>
            <div>
              <Label className="text-font-color-100 text-sm">Custom Field 2</Label>
              <Input 
                className="mt-1" 
                  value={editLineData.custom_field2 || ''} 
                onChange={e=>setEditLineData(d=>({ ...d, custom_field2: e.target.value }))} 
              />
            </div>
            <div>
              <Label className="text-font-color-100 text-sm">Custom Field 5</Label>
              <Input 
                className="mt-1" 
                  value={editLineData.custom_field5 || ''} 
                onChange={e=>setEditLineData(d=>({ ...d, custom_field5: e.target.value }))} 
              />
            </div>
            </div>

            <div>
              <Label className="text-font-color-100 text-sm">Comments</Label>
              <Textarea 
                className="mt-1" 
                rows={4} 
                value={editLineData.comments || ''} 
                onChange={e=>setEditLineData(d=>({ ...d, comments: e.target.value }))} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-border-color text-font-color hover:bg-body-color"
              onClick={()=>setEditLineOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={()=>{ if (editLineIndex==null) return; setOrderDetail(prev => prev.map((r,i)=> i===editLineIndex? { ...r, ...editLineData }: r)); setEditLineOpen(false); markAsChanged() }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Billing Address Modal */}
      <Dialog open={editBillingAddressOpen} onOpenChange={setEditBillingAddressOpen}>
        <DialogContent style={{ maxWidth: 600 }}>
          <DialogHeader>
            <DialogTitle>Edit Billing Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Company</Label>
                <Input
                  className="h-8 text-sm mt-1"
                  value={tempBillingAddress.company || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, company: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Attention</Label>
                <Input
                  className="h-8 text-sm mt-1"
                  value={tempBillingAddress.attention || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, attention: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Address 1</Label>
                <Input
                  className="h-8 text-sm mt-1"
                  value={tempBillingAddress.address1 || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, address1: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Address 2</Label>
                <Input
                  className="h-8 text-sm mt-1"
                  value={tempBillingAddress.address2 || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, address2: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">City</Label>
                <Input
                  className="h-8 text-sm mt-1"
                  value={tempBillingAddress.city || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, city: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">State/Province</Label>
                <Input
                  className="h-8 text-sm mt-1"
                  value={tempBillingAddress.state_province || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, state_province: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Postal Code</Label>
                <Input
                  className="h-8 text-sm mt-1"
                  value={tempBillingAddress.postal_code || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, postal_code: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Country</Label>
                <Input
                  className="h-8 text-sm mt-1"
                  value={tempBillingAddress.country || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, country: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Phone</Label>
                <Input
                  className="h-8 text-sm mt-1"
                  value={tempBillingAddress.phone || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Email</Label>
                <Input
                  className="h-8 text-sm mt-1"
                  value={tempBillingAddress.email || ''}
                  onChange={e => setTempBillingAddress(p => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBillingAddressOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={saveBillingAddress}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Shipping Details Modal */}
      <Dialog open={editShippingDetailsOpen} onOpenChange={setEditShippingDetailsOpen}>
        <DialogContent style={{ maxWidth: 600 }}>
          <DialogHeader>
            <DialogTitle>Edit Shipping Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">International Code</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempShippingDetails.international_code || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, international_code: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Shipping Carrier</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempShippingDetails.shipping_carrier || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, shipping_carrier: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Shipping Service</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempShippingDetails.shipping_service || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, shipping_service: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Freight Account</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempShippingDetails.freight_account || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, freight_account: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Consignee #</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempShippingDetails.consignee_number || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, consignee_number: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Incoterms</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempShippingDetails.terms || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, terms: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">FOB Location</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempShippingDetails.fob || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, fob: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Payment Type</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempShippingDetails.payment_type || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, payment_type: e.target.value }))}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-font-color-100 text-sm">Packing List Type</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempShippingDetails.packing_list_type || ''}
                  onChange={e => setTempShippingDetails(p => ({ ...p, packing_list_type: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditShippingDetailsOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={saveShippingDetails}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Amounts Modal */}
      <Dialog open={editAmountsOpen} onOpenChange={setEditAmountsOpen}>
        <DialogContent style={{ maxWidth: 500 }}>
          <DialogHeader>
            <DialogTitle>Edit Amounts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">S & H</Label>
                <Input
                  className="h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.shipping_handling}
                  onChange={e => setTempAmounts(p => ({ ...p, shipping_handling: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Sales Taxes</Label>
                <Input
                  className="h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.sales_tax}
                  onChange={e => setTempAmounts(p => ({ ...p, sales_tax: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Amount Paid</Label>
                <Input
                  className="h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.amount_paid}
                  onChange={e => setTempAmounts(p => ({ ...p, amount_paid: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Discount/Add. Chgs.</Label>
                <Input
                  className="h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.international_handling}
                  onChange={e => setTempAmounts(p => ({ ...p, international_handling: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Balance Due (US)</Label>
                <Input
                  className="h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.balance_due_us}
                  onChange={e => setTempAmounts(p => ({ ...p, balance_due_us: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Int. Decl. Value</Label>
                <Input
                  className="h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.international_declared_value}
                  onChange={e => setTempAmounts(p => ({ ...p, international_declared_value: +e.target.value || 0 }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Insurance</Label>
                <Input
                  className="h-8 text-sm"
                  type="number"
                  step="0.01"
                  value={tempAmounts.insurance}
                  onChange={e => setTempAmounts(p => ({ ...p, insurance: +e.target.value || 0 }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAmountsOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={saveAmounts}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Extra Fields Modal */}
      <Dialog open={editExtraFieldsOpen} onOpenChange={setEditExtraFieldsOpen}>
        <DialogContent style={{ maxWidth: 500 }}>
          <DialogHeader>
            <DialogTitle>Edit Extra Fields</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_1}</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempExtraFields.custom_field1 || ''}
                  onChange={e => setTempExtraFields(p => ({ ...p, custom_field1: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_2}</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempExtraFields.custom_field2 || ''}
                  onChange={e => setTempExtraFields(p => ({ ...p, custom_field2: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_3}</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempExtraFields.custom_field3 || ''}
                  onChange={e => setTempExtraFields(p => ({ ...p, custom_field3: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_4}</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempExtraFields.custom_field4 || ''}
                  onChange={e => setTempExtraFields(p => ({ ...p, custom_field4: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">{extraLabels.header_cf_5}</Label>
                <Input
                  className="h-8 text-sm"
                  value={tempExtraFields.custom_field5 || ''}
                  onChange={e => setTempExtraFields(p => ({ ...p, custom_field5: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExtraFieldsOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={saveExtraFields}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Order Confirmation Dialog */}
      <Dialog open={showNewOrderConfirm} onOpenChange={setShowNewOrderConfirm}>
        <DialogContent style={{ maxWidth: 400 }}>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-font-color">
              You have made some changes, are you sure to start a new order?
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleNewOrderCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              NO
            </Button>
            <Button 
              onClick={handleNewOrderConfirm}
              className="bg-red-600 text-white hover:bg-red-700 hover:!bg-red-700 transition-colors duration-200"
            >
              YES
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>

        {/* Address Book Dialog */}
        <Dialog open={showAddressBook} onOpenChange={setShowAddressBook}>
          <DialogContent className="flex flex-col overflow-hidden" style={{ width: '1000px', height: '720px', maxWidth: '90vw', maxHeight: '90vh', minWidth: '1000px', minHeight: '720px' }}>
            <DialogHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle>Select from address book</DialogTitle>
                <Button
                  size="small"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    setShowAddressBook(false)
                    setShowAddToAddressBook(true)
                  }}
                >
                  <IconPlus className="w-3 h-3 mr-1" />
                  Add to Address Book
                </Button>
              </div>
            </DialogHeader>
            
            {/* Filters */}
            <div className="flex items-center justify-between gap-3 mb-3 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-sm text-font-color font-medium">
                  TOTAL CONTACTS: {addressBookTotal}
                </span>
              </div>
              <Input
                placeholder="Filter by title..."
                value={addressBookFilter}
                onChange={e => setAddressBookFilter(e.target.value)}
                className="w-48 h-9 text-sm"
              />
            </div>

            {/* Address Table */}
            <div className="flex-1 overflow-hidden border border-border-color rounded-lg">
              <div className="h-full flex flex-col">
                {/* Table Header */}
                <div className="flex-shrink-0 bg-gray-50 border-b border-border-color">
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold text-font-color-100 uppercase">
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">TITLE</div>
                    <div className="col-span-4">SHIPPING ADDRESS</div>
                    <div className="col-span-4">BILLING ADDRESS</div>
                  </div>
                </div>

                {/* Table Body */}
                <ScrollArea className="flex-1">
                  <div className="divide-y divide-border-color">
                    {addressBookLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-font-color-100">Loading addresses...</div>
                      </div>
                    ) : addressBookData.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-font-color-100">No addresses found</div>
                      </div>
                    ) : (
                      addressBookData.map((address, index) => (
                        <div
                          key={address.id || index}
                          className={`grid grid-cols-12 gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                            selectedAddress?.id === address.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                          onClick={() => setSelectedAddress(address)}
                          onDoubleClick={() => handleAddressSelect(address)}
                        >
                          <div className="col-span-1 text-font-color-100">
                            {((addressBookPage - 1) * 100) + index + 1}
                          </div>
                          <div className="col-span-3 text-blue-600 hover:underline">
                            {address.title || ''}
                          </div>
                          <div className="col-span-4 text-font-color">
                            {address.ship_to ? formatAddress(address.ship_to) : ''}
                          </div>
                          <div className="col-span-4 text-font-color">
                            {address.bill_to ? formatAddress(address.bill_to) : ''}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex-shrink-0 flex items-center justify-between mt-3">
              <div className="text-sm text-font-color-100">
                {addressBookTotal} contacts on {Math.ceil(addressBookTotal / 100)} page{Math.ceil(addressBookTotal / 100) !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="small"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setAddressBookPage(1)}
                  disabled={addressBookPage === 1}
                >
                  <IconChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setAddressBookPage(Math.max(1, addressBookPage - 1))}
                  disabled={addressBookPage === 1}
                >
                  <IconChevronLeft className="w-4 h-4" />
                </Button>
                <Input
                  value={addressBookPage}
                  onChange={e => {
                    const page = parseInt(e.target.value) || 1
                    setAddressBookPage(Math.max(1, Math.min(page, Math.ceil(addressBookTotal / 100))))
                  }}
                  className="w-12 h-8 text-center text-sm mx-1"
                />
                <Button
                  size="small"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setAddressBookPage(Math.min(Math.ceil(addressBookTotal / 100), addressBookPage + 1))}
                  disabled={addressBookPage >= Math.ceil(addressBookTotal / 100)}
                >
                  <IconChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setAddressBookPage(Math.ceil(addressBookTotal / 100))}
                  disabled={addressBookPage >= Math.ceil(addressBookTotal / 100)}
                >
                  <IconChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <DialogFooter className="flex-shrink-0">
              <Button variant="outline" onClick={() => setShowAddressBook(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-red-600 text-white hover:bg-red-700 hover:!bg-red-700 transition-colors duration-200"
                onClick={() => selectedAddress && handleAddressSelect(selectedAddress)}
                disabled={!selectedAddress}
              >
                Select
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add to Address Book Dialog */}
        <Dialog open={showAddToAddressBook} onOpenChange={setShowAddToAddressBook}>
          <DialogContent style={{ maxWidth: 400 }}>
            <DialogHeader>
              <DialogTitle>Add to Address Book</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-color mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={addressBookTitle}
                    onChange={(e) => setAddressBookTitle(e.target.value)}
                    placeholder="Type the address title"
                    required
                  />
                </div>
                <div className="text-sm text-font-color-100">
                  This will save the current shipping and billing addresses to your address book.
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddToAddressBook(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-red-600 text-white hover:bg-red-700 hover:!bg-red-700 transition-colors duration-200"
                onClick={handleAddToAddressBook}
                disabled={!addressBookTitle.trim()}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Shipping Instructions Dialog */}
        <Dialog open={shippingInstructionsDialog} onOpenChange={setShippingInstructionsDialog}>
          <DialogContent style={{ width: '800px', height: '500px', maxWidth: '90vw', maxHeight: '90vh' }}>
            <DialogHeader>
              <DialogTitle>Shipping Instructions</DialogTitle>
              <DialogDescription>Edit shipping instructions for this order</DialogDescription>
            </DialogHeader>
            <div className="py-4 flex-1">
              <Textarea
                className="w-full h-full min-h-[300px] text-sm resize-none"
                value={orderHeader.shipping_instructions || ''}
                onChange={e => {
                  setOrderHeader(p => ({ ...p, shipping_instructions: e.target.value }))
                  markAsChanged()
                }}
                placeholder="Enter shipping instructions..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeShippingInstructionsDialog}>
                Cancel
              </Button>
              <Button onClick={closeShippingInstructionsDialog}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Comments Dialog */}
        <Dialog open={commentsDialog} onOpenChange={setCommentsDialog}>
          <DialogContent style={{ width: '800px', height: '500px', maxWidth: '90vw', maxHeight: '90vh' }}>
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
              <DialogDescription>Edit comments for this order</DialogDescription>
            </DialogHeader>
            <div className="py-4 flex-1">
              <Textarea
                className="w-full h-full min-h-[300px] text-sm resize-none"
                value={orderHeader.packing_list_comments || ''}
                onChange={e => {
                  setOrderHeader(p => ({ ...p, packing_list_comments: e.target.value }))
                  markAsChanged()
                }}
                placeholder="Enter comments..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeCommentsDialog}>
                Cancel
              </Button>
              <Button onClick={closeCommentsDialog}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}


