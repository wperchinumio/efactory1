import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthState } from '@/lib/auth/guards';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Input, Label, Tabs, TabsList, TabsTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
import BrowseItemsDialog from '@/components/common/BrowseItemsDialog';
import CountryFilterCombobox from '@/components/filters/CountryFilterCombobox';
import StateFilterCombobox from '@/components/filters/StateFilterCombobox';
import { toast } from '@/components/ui/use-toast';
import { IconFileText, IconTruck, IconPackage, IconCurrency, IconSettings, IconEdit, IconChevronDown, IconTriangleFilled } from '@tabler/icons-react';
import { CheckBox } from '@/components/ui';
import {
  readReturnTrakSettings,
  generateRmaNumber,
  saveRma,
  fetchInventoryForCart,
  validateAddress,
} from '@/services/api';
import { returntrakInventoryCache } from '@/services/returntrakInventoryCache';
import type {
  AddressDto,
  RmaAuthItemDto,
  RmaHeaderSaveDto,
  RmaSettingsDto,
  RmaShipItemDto,
} from '@/types/api/returntrak';
import { addressBookCache } from '@/services/addressBookCache';
import { inventoryCache } from '@/services/inventoryCache';

export default function ReturnTrakEntryPage() {
  const auth = getAuthState();
  if (!auth.isAuthenticated) {
    if (typeof window !== 'undefined') window.location.href = '/auth/sign-in';
    return null;
  }
  const router = useRouter();

  const [rmaSettings, setRmaSettings] = useState<RmaSettingsDto | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // Header state
  const [rmaNumber, setRmaNumber] = useState('');
  const [rmaType, setRmaType] = useState('');
  const [disposition, setDisposition] = useState('');
  const [accountReceivingWarehouse, setAccountReceivingWarehouse] = useState('');
  const [accountShippingWarehouse, setAccountShippingWarehouse] = useState('');
  const [options, setOptions] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  // Addresses & shipping
  const [shippingAddress, setShippingAddress] = useState<AddressDto>({ country: 'US' });
  const [shipping, setShipping] = useState({
    shipping_carrier: '',
    shipping_service: '',
    packing_list_type: '',
    freight_account: '',
    consignee_number: '',
    terms: '',
    fob: '',
    payment_type: '',
    int_code: '',
  });

  // Others
  const [others, setOthers] = useState({
    original_order_number: '',
    original_account_number: '',
    customer_number: '',
    shipping_instructions: '',
    comments: '',
    return_weight_lb: '' as any,
  });

  // Items
  const [activeCartTab, setActiveCartTab] = useState<'auth' | 'ship'>('auth');
  const [toReceive, setToReceive] = useState<RmaAuthItemDto[]>([]);
  const [toShip, setToShip] = useState<RmaShipItemDto[]>([]);
  const [findItemValue, setFindItemValue] = useState('');
  const [warehousesValue, setWarehousesValue] = useState('');

  // Panel states for expand/collapse functionality
  const [amountsExpanded, setAmountsExpanded] = useState(false);
  const [othersExpanded, setOthersExpanded] = useState(false);

  // Modal states
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showAmountsModal, setShowAmountsModal] = useState(false);
  const [showOthersModal, setShowOthersModal] = useState(false);
  const [showBrowseItemsModal, setShowBrowseItemsModal] = useState(false);
  const [validateOpen, setValidateOpen] = useState(false);
  const [validateResult, setValidateResult] = useState<any>(null);
  
  // Cart selection and edit state
  const [selectedAuthRows, setSelectedAuthRows] = useState<number[]>([]);
  const [selectedShipRows, setSelectedShipRows] = useState<number[]>([]);
  const [editLineOpen, setEditLineOpen] = useState(false);
  const [editLineIndex, setEditLineIndex] = useState<number>(-1);
  const [editLineType, setEditLineType] = useState<'auth' | 'ship'>('auth');
  const [editLineData, setEditLineData] = useState({
    quantity: 0,
    unit_price: '0.00',
    serialnumber: '',
    description: ''
  });

  // RMA Type Configuration (matching legacy)
  const rmaTypeConfig: Record<string, [[number, number, number, number], [number, number]]> = {
    'T01': [[1,1,1,1], [1,1]],
    'T02': [[1,0,1,1], [0,1]],
    'T03': [[1,1,1,1], [1,1]],
    'T11': [[1,1,0,1], [1,0]],
    'T12': [[1,0,0,1], [0,0]],
    'T13': [[1,1,0,1], [1,0]],
    'T21': [[1,1,0,1], [1,0]],
    'T22': [[1,0,0,1], [0,0]],
    'T23': [[1,1,0,1], [1,0]],
    'T24': [[1,1,0,1], [1,0]],
    'T25': [[1,0,0,1], [0,0]],
    'T26': [[1,1,0,1], [1,0]],
    'T31': [[1,1,1,1], [1,1]],
    'T32': [[1,0,1,1], [0,1]],
    'T33': [[1,1,1,1], [1,1]],
    'T81': [[1,1,0,1], [1,0]],
    'T82': [[1,0,0,1], [0,0]],
    'T99': [[1,0,0,1], [0,0]]
  };

  // Check if Ship WH should be enabled based on RMA type
  const isToShipEnabled = useMemo(() => {
    if (!rmaType) return false;
    const config = rmaTypeConfig[rmaType];
    return config ? config[1][1] === 1 : false;
  }, [rmaType]);

  // Derived: accounts list from authToken (calc_account_regions)
  const accountsMap = useMemo(() => {
    try {
      if (typeof window === 'undefined') return {} as Record<string, string>;
      const raw = window.localStorage.getItem('authToken');
      if (!raw) return {} as Record<string, string>;
      const token = JSON.parse(raw);
      return token?.user_data?.calc_account_regions || {};
    } catch {
      return {} as Record<string, string>;
    }
  }, []);

  const accountOptions = useMemo(() => Object.entries(accountsMap).map(([value, label]) => ({ value, label: String(label) })), [accountsMap]);

  // Auto-select first account if only one option available (like legacy)
  useEffect(() => {
    if (accountOptions.length === 1 && !accountReceivingWarehouse) {
      setAccountReceivingWarehouse(accountOptions[0]?.value || '');
    }
    if (accountOptions.length === 1 && !accountShippingWarehouse && isToShipEnabled) {
      setAccountShippingWarehouse(accountOptions[0]?.value || '');
    }
  }, [accountOptions, accountReceivingWarehouse, accountShippingWarehouse, isToShipEnabled]);

  // Clear Ship WH when RMA type doesn't support shipping (like legacy)
  useEffect(() => {
    if (!isToShipEnabled) {
      setAccountShippingWarehouse('');
    }
  }, [isToShipEnabled]);


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const settings = await readReturnTrakSettings();
        if (!mounted) return;
        setRmaSettings(settings);
        setLoadingSettings(false);
      } catch {
        setLoadingSettings(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  async function onGenerateRmaNumber() {
    if (!rmaSettings) return;
    const manual = !!rmaSettings.general?.auto_number?.manual === false ? false : rmaSettings.general?.auto_number?.manual;
    if (manual === false) {
      const num = await generateRmaNumber();
      setRmaNumber(num || '');
    }
  }

  function addAuthItem(item_number: string, description?: string) {
    const maxLine = toReceive.reduce((m, i) => Math.max(m, i.line_number), 0);
    const newLine = maxLine + 1;
    const item: RmaAuthItemDto = {
      detail_id: 0,
      line_number: newLine,
      item_number,
      description: description ?? '',
      quantity: 0, // Start with 0 as per legacy
      serialnumber: '',
      voided: false,
    };
    setToReceive(prev => [...prev, item]);
    
    // If RMA type requires both receive and ship (like T1), also add to ship
    // This matches the legacy logic: when adding to auth, also add to ship if isToShipButtonBlue
    if (isToShipEnabled) {
      addShipItem(item_number, description);
    }
  }

  function addShipItem(item_number: string, description?: string) {
    const maxLine = toShip.reduce((m, i) => Math.max(m, i.line_number), 0);
    const newLine = maxLine + 1;
    const item: RmaShipItemDto = {
      detail_id: 0,
      line_number: newLine,
      item_number,
      description: description ?? '',
      quantity: 0, // Start with 0 as per legacy
      unit_price: '0.00',
      voided: false,
    };
    setToShip(prev => [...prev, item]);
  }

  // Remove selected rows
  function removeSelectedRows() {
    if (activeCartTab === 'auth') {
      setToReceive(prev => prev.filter((_, index) => !selectedAuthRows.includes(index)));
      setSelectedAuthRows([]);
    } else {
      setToShip(prev => prev.filter((_, index) => !selectedShipRows.includes(index)));
      setSelectedShipRows([]);
    }
  }

  // Handle row selection
  function handleRowSelection(index: number, checked: boolean) {
    if (activeCartTab === 'auth') {
      if (checked) {
        setSelectedAuthRows(prev => [...prev, index]);
      } else {
        setSelectedAuthRows(prev => prev.filter(i => i !== index));
      }
    } else {
      if (checked) {
        setSelectedShipRows(prev => [...prev, index]);
      } else {
        setSelectedShipRows(prev => prev.filter(i => i !== index));
      }
    }
  }

  // Handle edit line
  function handleEditLine(type: 'auth' | 'ship', index: number) {
    setEditLineType(type);
    setEditLineIndex(index);
    
    if (type === 'auth') {
      const item = toReceive[index];
      if (item) {
        setEditLineData({
          quantity: item.quantity,
          unit_price: '0.00',
          serialnumber: item.serialnumber || '',
          description: item.description || ''
        });
      }
    } else {
      const item = toShip[index];
      if (item) {
        setEditLineData({
          quantity: item.quantity,
          unit_price: String(item.unit_price || '0.00'),
          serialnumber: '',
          description: item.description || ''
        });
      }
    }
    
    setEditLineOpen(true);
  }

  // Save edited line
  function saveEditedLine() {
    if (editLineType === 'auth') {
      const updatedItem = toReceive[editLineIndex];
      if (updatedItem) {
        setToReceive(prev => prev.map((item, index) => 
          index === editLineIndex 
            ? { ...item, quantity: editLineData.quantity, serialnumber: editLineData.serialnumber }
            : item
        ));
        
        // If RMA type supports shipping, sync quantity to ship item (legacy logic)
        if (isToShipEnabled) {
          setToShip(prev => {
            const shipItemIndex = prev.findIndex(s => s.item_number === updatedItem.item_number);
            if (shipItemIndex >= 0) {
              // Calculate total quantity from all auth items with same item_number
              const totalAuthQuantity = toReceive
                .filter((item, idx) => item.item_number === updatedItem.item_number && idx !== editLineIndex)
                .reduce((sum, item) => sum + item.quantity, 0) + editLineData.quantity;
              
              return prev.map((item, index) => 
                index === shipItemIndex 
                  ? { ...item, quantity: totalAuthQuantity }
                  : item
              );
            }
            return prev;
          });
        }
      }
    } else {
      setToShip(prev => prev.map((item, index) => 
        index === editLineIndex 
          ? { ...item, quantity: editLineData.quantity, unit_price: editLineData.unit_price }
          : item
      ));
    }
    
    setEditLineOpen(false);
    setEditLineIndex(-1);
  }

  async function onAddItem() {
    const trimmed = (findItemValue || '').trim();
    if (!trimmed) return;
    // Search inventory cache similar to OrderPoints
    let matchedWarehouse = '';
    if (accountShippingWarehouse) {
      const locationDerived = accountShippingWarehouse.replace(/\d+\./, '');
      const token = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('authToken') || '{}') : null;
      const warehouses = token?.user_data?.warehouses || {};
      const keys = Object.keys(warehouses || {});
      const match = keys.find((k: string) => k.toLowerCase() === String(locationDerived).toLowerCase());
      if (match) {
        // Build "region-type" option (first found)
        const options: string[] = [];
        (warehouses[match] || []).forEach((invType: any) => {
          Object.keys(invType).forEach((t: string) => options.push(`${match}-${t}`));
        });
        matchedWarehouse = options[0] || '';
      }
    }
    const inv = await inventoryCache.getInventoryData(matchedWarehouse);
    const hit = inv.find(i => i.item_number.toLowerCase() === trimmed.toLowerCase());
    if (hit) {
      if (activeCartTab === 'auth') {
        addAuthItem(hit.item_number, hit.description);
      } else if (isToShipEnabled) {
        addShipItem(hit.item_number, hit.description);
      }
      setFindItemValue('');
      return;
    }
    openBrowseItemsModal();
  }

  // Address validation function (matching OrderPoints)
  async function onValidateAddress() {
    const res = await validateAddress({ action: 'validate_address', data: {
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
      setValidateOpen(false)
      setValidateResult(null)
    }
  }

  function canValidateAddress() {
    return !!(shippingAddress.address1?.trim() && shippingAddress.city?.trim() && shippingAddress.state_province?.trim() && shippingAddress.postal_code?.trim())
  }

  async function onPlaceRma(to_draft: boolean) {
    if (!rmaSettings) return;
    try {
      to_draft ? setSavingDraft(true) : setPlacing(true);
      const header: RmaHeaderSaveDto = {
        is_draft: to_draft,
        rma_number: rmaNumber || '',
        rma_type_code: rmaType || '',
        disposition_code: disposition || '',
        // Map account selections like legacy: "12345.WH1" => parts
        ...(accountReceivingWarehouse
          ? {
              account_number: accountReceivingWarehouse.replace(/\.[A-Za-z]+$/, ''),
              location: accountReceivingWarehouse.replace(/^\d+\./, ''),
            }
          : {}),
        ...(accountShippingWarehouse
          ? {
              shipping_account_number: accountShippingWarehouse.replace(/\.[A-Za-z]+$/, ''),
              shipping_warehouse: accountShippingWarehouse.replace(/^\d+\./, ''),
            }
          : {}),
        shipping_address: shippingAddress,
        // Shipping
        shipping_carrier: shipping.shipping_carrier,
        shipping_service: shipping.shipping_service,
        packing_list_type: shipping.packing_list_type,
        freight_account: shipping.freight_account,
        consignee_number: shipping.consignee_number,
        international_code: shipping.int_code,
        terms: shipping.terms,
        fob: shipping.fob,
        payment_type: shipping.payment_type,
        // Amounts (start at 0, legacy will compute)
        order_subtotal: '0.00',
        shipping_handling: '0.00',
        sales_tax: '0.00',
        international_handling: '0.00',
        total_due: '0.00',
        amount_paid: '0.00',
        net_due_currency: '0.00',
        balance_due_us: '0.00',
        international_declared_value: '0.00',
        insurance: '0.00',
        // Others
        customer_number: others.customer_number,
        shipping_instructions: others.shipping_instructions,
        comments: others.comments,
        // Custom options 1..7
        cf1: options['option1'] || '',
        cf2: options['option2'] || '',
        cf3: options['option3'] || '',
        cf4: options['option4'] || '',
        cf5: options['option5'] || '',
        cf6: options['option6'] || '',
        cf7: options['option7'] || '',
      };

      const res = await saveRma(header, toReceive, toShip);
      // On success, reset minimal state or stay for draft edit
      if (!to_draft) {
        setToReceive([]);
        setToShip([]);
        setRmaNumber('');
      }
    } finally {
      to_draft ? setSavingDraft(false) : setPlacing(false);
    }
  }

  const isManualNumbering = !!rmaSettings?.general?.auto_number?.manual;


  // Helper functions for panels
  function getAmountsFieldsWithValues() {
    const fields = [
      { key: 'order_amount', label: 'Order Amount', value: '0.00' },
      { key: 'shipping_handling', label: 'S & H', value: '0.00' },
      { key: 'sales_tax', label: 'Sales Taxes', value: '0.00' },
      { key: 'discount', label: 'Discount/Add. Chgs.', value: '0.00' },
      { key: 'total_amount', label: 'Total Amount', value: '0.00' },
      { key: 'amount_paid', label: 'Amount Paid', value: '0.00' },
      { key: 'net_due', label: 'Net Due', value: '0.00' },
      { key: 'balance_due', label: 'Balance Due (US)', value: '0.00' },
      { key: 'int_declared', label: 'Int. Decl. Value', value: '0.00' },
      { key: 'insurance', label: 'Insurance', value: '0.00' }
    ];
    return fields.filter(field => field.value !== '0.00' && field.value !== '');
  }

  function getOthersFieldsWithValues() {
    const fields = [
      { key: 'original_order', label: 'Original Order #', value: others.original_order_number },
      { key: 'customer_number', label: 'Customer Number', value: others.customer_number },
      { key: 'shipping_instructions', label: 'Shipping Instructions', value: others.shipping_instructions },
      { key: 'comments', label: 'Comments', value: others.comments }
    ];
    return fields.filter(field => field.value && field.value.trim() !== '');
  }

  // Modal handlers
  function openShippingModal() {
    setShowShippingModal(true);
  }

  function openAmountsModal() {
    setShowAmountsModal(true);
  }

  function openOthersModal() {
    setShowOthersModal(true);
  }
  
  // Browse Items handlers
  function openBrowseItemsModal() {
    setShowBrowseItemsModal(true);
  }
  
  function handleAddItemsToCart(items: any[]) {
    // Add items using the proper functions that handle dual-line logic
    items.forEach(item => {
      if (activeCartTab === 'auth') {
        // Create auth item with quantity and price from Browse Items
        const maxLine = toReceive.reduce((m, i) => Math.max(m, i.line_number), 0);
        const newLine = maxLine + 1;
        const newItem: RmaAuthItemDto = {
          detail_id: 0, // 0 for new line
          line_number: newLine,
          item_number: item.item_number,
          description: item.description || '',
          quantity: item.quantity || 0,
          serialnumber: '',
          voided: false,
        };
        setToReceive(prev => [...prev, newItem]);
        
        // If RMA type requires both receive and ship, also add to ship
        if (isToShipEnabled) {
          const maxShipLine = toShip.reduce((m, i) => Math.max(m, i.line_number), 0);
          const newShipLine = maxShipLine + 1;
          const newShipItem: RmaShipItemDto = {
            detail_id: 0, // 0 for new line
            line_number: newShipLine,
            item_number: item.item_number,
            description: item.description || '',
            quantity: item.quantity || 0,
            unit_price: String(item.price || 0),
            voided: false,
          };
          setToShip(prev => [...prev, newShipItem]);
        }
      } else {
        // Create ship item with quantity and price from Browse Items
        const maxLine = toShip.reduce((m, i) => Math.max(m, i.line_number), 0);
        const newLine = maxLine + 1;
        const newItem: RmaShipItemDto = {
          detail_id: 0, // 0 for new line
          line_number: newLine,
          item_number: item.item_number,
          description: item.description || '',
          quantity: item.quantity || 0,
          unit_price: String(item.price || 0),
          voided: false,
        };
        setToShip(prev => [...prev, newItem]);
      }
    });
  }
  
  // Get the appropriate warehouse based on active tab
  function getCurrentWarehouse() {
    if (activeCartTab === 'auth') {
      return accountReceivingWarehouse || '';
    } else {
      return accountShippingWarehouse || '';
    }
  }
  
  // Check if we have a valid warehouse for the current tab
  function hasValidWarehouse() {
    const warehouse = getCurrentWarehouse();
    return warehouse && warehouse.trim() !== '';
  }

  // Always enable Browse Items (as requested by user)
  function shouldEnableBrowseItems() {
    return true; // Always enabled as per user request
  }
  
  // Auto-add functionality for "Add item" input
  async function handleAddItemAuto() {
    if (!findItemValue.trim() || !getCurrentWarehouse()) return;
    
    const trimmed = findItemValue.trim();
    const matchedWarehouse = getCurrentWarehouse();
    const cacheType = activeCartTab as 'auth' | 'ship';
    
    try {
      // Check if we have valid cache first
      if (returntrakInventoryCache.hasValidCache(matchedWarehouse, cacheType)) {
        const matches = returntrakInventoryCache.searchInCache(matchedWarehouse, trimmed, cacheType);
        
        if (matches.length === 1) {
          const item = matches[0];
          if (!item) return;
          
          // Check if item already exists in current cart
          const existingItems = activeCartTab === 'auth' ? toReceive : toShip;
          const alreadyExists = existingItems.some(existing => 
            existing.item_number === item.item_number && !existing.voided
          );
          
          if (!alreadyExists) {
            if (activeCartTab === 'auth') {
              addAuthItem(item.item_number, item.description);
            } else {
              addShipItem(item.item_number, item.description);
            }
            
            setFindItemValue('');
          }
        } else if (matches.length > 1) {
          // Multiple matches, open browse dialog
          openBrowseItemsModal();
        } else {
          // No matches, open browse dialog
          openBrowseItemsModal();
        }
        return;
      }
      
      // No valid cache, fetch fresh data
      const data = await returntrakInventoryCache.getInventoryData(matchedWarehouse, cacheType, false);
      
      // Filter items that start with the search term (SKU only)
      const matchingItems = data.filter((item: any) => 
        item.item_number.toLowerCase().startsWith(trimmed.toLowerCase())
      );
      
      if (matchingItems.length === 1) {
        const item = matchingItems[0];
        if (!item) return;
        
        // Check if item already exists in current cart
        const existingItems = activeCartTab === 'auth' ? toReceive : toShip;
        const alreadyExists = existingItems.some(existing => 
          existing.item_number === item.item_number && !existing.voided
        );
        
        if (!alreadyExists) {
          if (activeCartTab === 'auth') {
            addAuthItem(item.item_number, item.description);
          } else {
            addShipItem(item.item_number, item.description);
          }
          
          setFindItemValue('');
        }
      } else if (matchingItems.length > 1) {
        // Multiple matches, open browse dialog
        openBrowseItemsModal();
      } else {
        // No matches, open browse dialog
        openBrowseItemsModal();
      }
    } catch (error) {
      console.error('Failed to search items:', error);
      // On error, open browse dialog
      openBrowseItemsModal();
    }
  }

  return (
    <div className="bg-body-color">
      {/* Header */}
      <div className="bg-card-color border-b border-border-color">
        <div className="w-full max-w-7xl mx-auto px-6 py-4" style={{ maxWidth: '1600px' }}>
          <div className="flex items-center justify-between">
        <div>
              <h1 className="text-xl font-semibold text-font-color">ReturnTrak - RMA Entry</h1>
              <p className="text-sm text-font-color-100 mt-1">Create and manage RMAs</p>
        </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="small" 
                onClick={() => onPlaceRma(true)} 
                disabled={savingDraft || placing}
                className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-blue-500 disabled:hover:text-blue-600 px-4 py-2"
              >
                {savingDraft ? "Saving..." : "Save Draft"}
          </Button>
              <Button 
                size="small" 
                onClick={() => onPlaceRma(false)} 
                disabled={placing || !rmaType || !accountReceivingWarehouse}
                className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? "Placing RMA..." : "Place RMA"}
          </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto p-6 space-y-6" style={{ maxWidth: '1600px' }}>

        {/* Main Layout: Left side (9) + Right Sidebar (3) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-9 space-y-4">
            {/* RMA Header and RMA Address on same row */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              {/* RMA Header - 40% width (5 columns) */}
              <Card className="shadow-sm border-border-color xl:col-span-5">
                <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
                  <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                    <IconFileText className="w-3.5 h-3.5" />
                    RMA
                  </CardTitle>
            </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-3">
                    {/* Row 1: Account # - RMA WH | RMA Type */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          Account # - RMA WH
                        </Label>
                  <Select value={accountReceivingWarehouse} onValueChange={setAccountReceivingWarehouse}>
                          <SelectTrigger className="h-9 text-sm mt-1">
                            <span className={`truncate ${accountReceivingWarehouse ? 'font-medium' : ''}`}>
                              {accountOptions.find(opt => opt.value === accountReceivingWarehouse)?.label ?? "Select..."}
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-card-color border-border-color">
                            <SelectItem value="" className="text-font-color hover:bg-body-color">
                              <span className="text-gray-400">Select...</span>
                            </SelectItem>
                            {accountOptions.length > 0 ? accountOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="text-font-color hover:bg-body-color">
                                <span className="whitespace-nowrap">{String(opt.label)}</span>
                              </SelectItem>
                            )) : null}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          RMA Type
                        </Label>
                  <Select value={rmaType} onValueChange={(v) => {
                    setRmaType(v);
                    setDisposition('');
                  }}>
                          <SelectTrigger className="h-9 text-sm mt-1">
                            <span className={`truncate ${rmaType ? 'font-medium' : ''}`}>
                              {rmaSettings?.rma_types?.find(t => t.code === rmaType) ? 
                                `${rmaSettings.rma_types.find(t => t.code === rmaType)?.code} - ${rmaSettings.rma_types.find(t => t.code === rmaType)?.title}` : 
                                ""
                              }
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-card-color border-border-color">
                            <SelectItem value="" className="text-font-color hover:bg-body-color">
                              <span className="text-gray-400">Select...</span>
                            </SelectItem>
                      {(rmaSettings?.rma_types || []).map(t => (
                              <SelectItem key={t.code} value={t.code} className="text-font-color hover:bg-body-color">
                                <span className="whitespace-nowrap">{`${t.code} - ${t.title}`}</span>
                              </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

                    {/* Row 2: Account # - Ship WH | Disposition */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          Account # - Ship WH
                        </Label>
                  <Select value={accountShippingWarehouse} onValueChange={setAccountShippingWarehouse}>
                          <SelectTrigger className="h-9 text-sm mt-1" disabled={!isToShipEnabled}>
                            <span className={`truncate ${accountShippingWarehouse ? 'font-medium' : ''}`}>
                              {accountOptions.find(opt => opt.value === accountShippingWarehouse)?.label ?? "Select..."}
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-card-color border-border-color">
                            <SelectItem value="" className="text-font-color hover:bg-body-color">
                              <span className="text-gray-400">Select...</span>
                            </SelectItem>
                            {accountOptions.length > 0 ? accountOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="text-font-color hover:bg-body-color">
                                <span className="whitespace-nowrap">{String(opt.label)}</span>
                              </SelectItem>
                            )) : null}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          Disposition
                        </Label>
                  <Select value={disposition} onValueChange={setDisposition}>
                          <SelectTrigger className="h-9 text-sm mt-1" disabled={!rmaType}>
                            <span className={`truncate ${disposition ? 'font-medium' : ''}`}>
                              {rmaSettings?.dispositions?.find(d => d.code === disposition) ? 
                                `${rmaSettings.dispositions.find(d => d.code === disposition)?.code} - ${rmaSettings.dispositions.find(d => d.code === disposition)?.title}` : 
                                ""
                              }
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-card-color border-border-color">
                            <SelectItem value="" className="text-font-color hover:bg-body-color">
                              <span className="text-gray-400">Select...</span>
                            </SelectItem>
                      {(rmaSettings?.dispositions || []).map(d => (
                              <SelectItem key={d.code} value={d.code} className="text-font-color hover:bg-body-color">
                                <span className="whitespace-nowrap">{`${d.code} - ${d.title}`}</span>
                              </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

                    {/* Row 3: RMA # | Place of Purchase */}
                    <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          RMA #
                        </Label>
                        {!isManualNumbering ? (
                          // Auto-generation mode: special styling with generate button
                          <div className="flex mt-1">
                            <div className="flex-1 relative">
                              <Input
                                value={rmaNumber || ''}
                                onChange={e => setRmaNumber(e.target.value)}
                                readOnly={!rmaNumber}
                                className={`font-mono h-9 text-sm rounded-r-none border-r-0 ${
                                  !rmaNumber 
                                    ? 'bg-primary-10' 
                                    : 'bg-card-color'
                                } ${rmaNumber ? 'font-medium' : ''}`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={onGenerateRmaNumber}
                              disabled={!!rmaNumber}
                              className={`px-3 py-2 rounded-r-lg rounded-l-none border border-l-0 border-border-color h-9 text-sm font-medium transition-colors ${
                                rmaNumber 
                                  ? 'bg-body-color text-font-color-100 cursor-not-allowed opacity-50' 
                                  : 'bg-primary text-white hover:bg-primary-20 cursor-pointer'
                              }`}
                              title={rmaNumber ? "RMA number already assigned" : "Assign Next RMA #"}
                            >
                              &gt;&gt;
                            </button>
                          </div>
                        ) : (
                          // Manual mode: standard input field
                          <Input 
                            className={`h-9 text-sm mt-1 ${rmaNumber ? 'font-medium' : ''}`} 
                            value={rmaNumber || ''} 
                            onChange={e => setRmaNumber(e.target.value)} 
                          />
                    )}
                  </div>
                      <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          Place of Purchase
                        </Label>
                        <Select value={options.place_of_purchase || ''} onValueChange={v => setOptions(prev => ({ ...prev, place_of_purchase: v }))}>
                          <SelectTrigger className="h-9 text-sm mt-1">
                            <span className={`truncate ${options.place_of_purchase ? 'font-medium' : ''}`}>
                              {options.place_of_purchase ?? "Select..."}
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-card-color border-border-color">
                            <SelectItem value="" className="text-font-color hover:bg-body-color">
                              <span className="text-gray-400">Select...</span>
                            </SelectItem>
                            <SelectItem value="Online" className="text-font-color hover:bg-body-color">
                              <span className="whitespace-nowrap">Online</span>
                            </SelectItem>
                            <SelectItem value="Store" className="text-font-color hover:bg-body-color">
                              <span className="whitespace-nowrap">Store</span>
                            </SelectItem>
                            <SelectItem value="Phone" className="text-font-color hover:bg-body-color">
                              <span className="whitespace-nowrap">Phone</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                </div>
                    </div>

                    {/* Custom fields (all) */}
                    {(rmaSettings?.custom_fields || []).length > 0 && (
                      <div className="space-y-2">
                        {(rmaSettings?.custom_fields || []).map(cf => (
                    <div key={cf.index}>
                            <Label className="text-font-color-100 text-sm flex items-center">
                              {cf.title}:
                              {cf.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                      {cf.type === 'text' ? (
                              <Input 
                                className="h-8 text-sm mt-1" 
                                value={options[`option${cf.index}`] || ''} 
                                onChange={e=>setOptions(prev=>({ ...prev, [`option${cf.index}`]: e.target.value }))} 
                              />
                      ) : (
                        <Select value={options[`option${cf.index}`] || ''} onValueChange={v=>setOptions(prev=>({ ...prev, [`option${cf.index}`]: v }))}>
                                <SelectTrigger className="h-8 text-sm mt-1">
                                  <span className={`truncate ${options[`option${cf.index}`] ? 'font-medium' : ''}`}>
                                    {options[`option${cf.index}`] ?? "Select..."}
                                  </span>
                                </SelectTrigger>
                                <SelectContent className="bg-card-color border-border-color">
                                  <SelectItem value="" className="text-font-color hover:bg-body-color">
                                    <span className="text-gray-400">Select...</span>
                                  </SelectItem>
                            {(cf.list || []).map(item => {
                              const [val, label] = item.includes('||') ? item.split('||') : [item, item];
                              const safeVal = val || '';
                              const safeLabel = label || '';
                                    return (
                                      <SelectItem key={safeVal} value={safeVal} className="text-font-color hover:bg-body-color">
                                        <span className="whitespace-nowrap">{safeLabel}</span>
                                      </SelectItem>
                                    )
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
                    )}
              </div>
            </CardContent>
          </Card>

              {/* RMA Address - 60% width (7 columns) */}
              <Card className="shadow-sm border-border-color xl:col-span-7">
                <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                      <IconTruck className="w-3.5 h-3.5" />
                      RMA ADDRESS
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="small" 
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-green-500 disabled:hover:text-green-600 text-sm px-3 py-1"
                        onClick={onValidateAddress}
                        disabled={!canValidateAddress()}
                      >
                        Validate Address
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
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.company||''} 
                          onChange={e=>setShippingAddress({...shippingAddress,company:e.target.value})} 
                        />
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          Attention
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.attention||''} 
                          onChange={e=>setShippingAddress({...shippingAddress,attention:e.target.value})} 
                        />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          Address 1
                        </Label>
                        <Input 
                          className="h-9 text-sm mt-1" 
                          value={shippingAddress.address1||''} 
                          onChange={e=>setShippingAddress({...shippingAddress,address1:e.target.value})} 
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
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.city||''} 
                          onChange={e=>setShippingAddress({...shippingAddress,city:e.target.value})} 
                        />
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          Postal Code
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.postal_code||''} 
                          onChange={e=>setShippingAddress({...shippingAddress,postal_code:e.target.value})} 
                        />
                </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          Country
                        </Label>
                        <div className="mt-1">
                          <div className="relative">
                            <CountryFilterCombobox
                              value={shippingAddress.country || ''}
                              onValueChange={(v: string) => {
                                setShippingAddress({...shippingAddress, country: v, state_province: ''});
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
                        </Label>
                        <div className="mt-1">
                          <div className="relative">
                            <StateFilterCombobox
                              value={shippingAddress.state_province||''}
                              onValueChange={(v: string) => {
                                setShippingAddress({...shippingAddress, state_province: v});
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
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.phone||''} 
                          onChange={e=>setShippingAddress({...shippingAddress,phone:e.target.value})} 
                        />
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          Email
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.email||''} 
                          onChange={e=>setShippingAddress({...shippingAddress,email:e.target.value})} 
                        />
                      </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>

          {/* Items cart */}
            <Card className="shadow-sm border-border-color">
              <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                    <IconPackage className="w-3.5 h-3.5" />
                    ITEMS
                  </CardTitle>
              <div className="flex items-center gap-2">
                    <div className="relative w-48 sm:w-64 md:w-72 lg:w-80 xl:w-96">
                <Input
                  placeholder="Add item…"
                        className="h-8 text-xs disabled:opacity-50 disabled:cursor-not-allowed w-full"
                  value={findItemValue}
                  onChange={e=>setFindItemValue(e.target.value)}
                        onKeyDown={e=>{ if (e.key==='Enter') handleAddItemAuto() }}
                        disabled={!hasValidWarehouse()}
                />
                    </div>
                <Tabs value={activeCartTab} onValueChange={v=>setActiveCartTab(v as any)}>
                      <TabsList className="h-8">
                        <TabsTrigger value="auth" className="text-xs px-3">Auth</TabsTrigger>
                        <TabsTrigger value="ship" disabled={!isToShipEnabled} className="text-xs px-3">To Ship</TabsTrigger>
                  </TabsList>
                </Tabs>
           <Button
             size="small"
             variant="outline"
             className="border-gray-300 text-gray-700 hover:bg-gray-50 whitespace-nowrap text-sm disabled:opacity-50 disabled:cursor-not-allowed"
             onClick={openBrowseItemsModal}
             disabled={!shouldEnableBrowseItems()}
           >
             Browse Items…
           </Button>
                    <Button 
                      size="small" 
                      variant="outline" 
                      className="whitespace-nowrap border-red-500 text-red-600 hover:!bg-red-50 hover:!border-red-600 hover:!text-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:!bg-transparent disabled:hover:!border-red-500 disabled:hover:!text-red-600 transition-colors duration-200"
                      onClick={removeSelectedRows}
                      disabled={(activeCartTab === 'auth' ? selectedAuthRows.length : selectedShipRows.length) === 0}
                    >
                      Remove selected {(activeCartTab === 'auth' ? selectedAuthRows.length : selectedShipRows.length) > 0 && `(${activeCartTab === 'auth' ? selectedAuthRows.length : selectedShipRows.length})`}
                    </Button>
              </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  {toReceive.length === 0 && toShip.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No items in cart
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                          <th className="text-left p-2 font-medium text-font-color-100 w-12">
                            <CheckBox
                              checked={(selectedAuthRows.length > 0 || selectedShipRows.length > 0) && 
                                       selectedAuthRows.length === toReceive.length && 
                                       selectedShipRows.length === toShip.length}
                              onChange={(checked: boolean) => {
                                if (checked) {
                                  // Select all rows in both Auth and To Ship sections
                                  setSelectedAuthRows(toReceive.map((_, i) => i));
                                  setSelectedShipRows(toShip.map((_, i) => i));
                                } else {
                                  // Deselect all rows in both sections
                                  setSelectedAuthRows([]);
                                  setSelectedShipRows([]);
                                }
                              }}
                              size="normal"
                              mode="emulated"
                            />
                          </th>
                          <th className="text-left p-2 font-medium text-font-color-100">#</th>
                          <th className="text-left p-2 font-medium text-font-color-100">Item # / Description</th>
                          <th className="text-right p-2 font-medium text-font-color-100">Auth.<br/>Qty</th>
                          <th className="text-center p-2 font-medium text-font-color-100">Auth.<br/>Serial #</th>
                          <th className="text-right p-2 font-medium text-font-color-100">Ship Qty</th>
                          <th className="text-right p-2 font-medium text-font-color-100">Unit Price</th>
                          <th className="text-center p-2 font-medium text-font-color-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toReceive.map((row, idx) => (
                          <tr key={`auth-${row.item_number}-${row.line_number}`} className="border-t border-border-color hover:bg-body-color/30">
                        <td className="p-2">
                              <CheckBox
                                checked={selectedAuthRows.includes(idx)}
                                onChange={(checked: boolean) => handleRowSelection(idx, checked)}
                                size="normal"
                                mode="emulated"
                              />
                            </td>
                            <td className="p-2 text-font-color-100">
                              <div className="flex items-center gap-2">
                                <span>{idx+1}</span>
                                <IconTriangleFilled className="text-red-500 w-3 h-3" style={{ transform: 'rotate(180deg)' }} />
                              </div>
                            </td>
                        <td className="p-2">
                              <div className="font-medium text-font-color">{row.item_number}</div>
                          <div className="text-[11px] text-font-color-100">{row.description}</div>
                        </td>
                        <td className="p-2 text-right text-font-color">
                          {row.quantity}
                        </td>
                        <td className="p-2 text-center text-font-color">
                          {row.serialnumber || 'Empty'}
                        </td>
                            <td className="p-2 text-right text-font-color-100">—</td>
                            <td className="p-2 text-right text-font-color-100">—</td>
                            <td className="p-2 text-center">
                              <Button
                                size="small"
                                variant="outline"
                                className="text-sm px-2 py-1"
                                onClick={() => handleEditLine('auth', idx)}
                              >
                                Edit
                              </Button>
                            </td>
                      </tr>
                    ))}
                    {isToShipEnabled && toShip.length > 0 && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <div className="border-t-2 border-gray-600"></div>
                          <div className="border-t border-gray-300"></div>
                        </td>
                      </tr>
                    )}
                    {isToShipEnabled && toShip.map((row, idx) => (
                          <tr key={`ship-${row.item_number}-${row.line_number}`} className="border-t border-border-color hover:bg-body-color/30">
                        <td className="p-2">
                              <CheckBox
                                checked={selectedShipRows.includes(idx)}
                                onChange={(checked: boolean) => handleRowSelection(idx, checked)}
                                size="normal"
                                mode="emulated"
                              />
                            </td>
                            <td className="p-2 text-font-color-100">
                              <div className="flex items-center gap-2">
                                <span>{idx + 1}</span>
                                <IconTriangleFilled className="text-blue w-3 h-3" />
                              </div>
                            </td>
                        <td className="p-2">
                              <div className="font-medium text-font-color">{row.item_number}</div>
                          <div className="text-[11px] text-font-color-100">{row.description}</div>
                        </td>
                            <td className="p-2 text-right text-font-color-100">—</td>
                            <td className="p-2 text-center text-font-color-100">—</td>
                        <td className="p-2 text-right text-font-color">
                          {row.quantity}
                        </td>
                        <td className="p-2 text-right text-font-color">
                          {parseFloat(String(row.unit_price || '0')).toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                              <Button
                                size="small"
                                variant="outline"
                                className="text-sm px-2 py-1"
                                onClick={() => handleEditLine('ship', idx)}
                              >
                                Edit
                              </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Right Sidebar - 3 columns */}
          <div className="xl:col-span-3 space-y-4">
          {/* Shipping */}
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
                    onClick={openShippingModal}
                  >
                    <IconEdit className="h-3 w-3" />
                  </Button>
                </div>
            </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Int. Code:</span> <span className="text-font-color text-right truncate max-w-[120px]" title={String(shipping.int_code || '0')}>{shipping.int_code || '0'}</span></div>
                  <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Shipping Carrier:</span> <span className={`text-right truncate max-w-[120px] ${shipping.shipping_carrier ? 'text-font-color' : 'text-font-color-100'}`} title={shipping.shipping_carrier || '-'}>{shipping.shipping_carrier || '-'}</span></div>
                  <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Shipping Service:</span> <span className={`text-right truncate max-w-[120px] ${shipping.shipping_service ? 'text-font-color' : 'text-font-color-100'}`} title={shipping.shipping_service || '-'}>{shipping.shipping_service || '-'}</span></div>
                  <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Freight Account:</span> <span className={`text-right truncate max-w-[120px] ${shipping.freight_account ? 'text-font-color' : 'text-font-color-100'}`} title={shipping.freight_account || '-'}>{shipping.freight_account || '-'}</span></div>
                  <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Consignee #:</span> <span className={`text-right truncate max-w-[120px] ${shipping.consignee_number ? 'text-font-color' : 'text-font-color-100'}`} title={shipping.consignee_number || '-'}>{shipping.consignee_number || '-'}</span></div>
                  <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Incoterms:</span> <span className={`text-right truncate max-w-[120px] ${shipping.terms ? 'text-font-color' : 'text-font-color-100'}`} title={shipping.terms || '-'}>{shipping.terms || '-'}</span></div>
                  <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">FOB Location:</span> <span className={`text-right truncate max-w-[120px] ${shipping.fob ? 'text-font-color' : 'text-font-color-100'}`} title={shipping.fob || '-'}>{shipping.fob || '-'}</span></div>
                  <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Payment Type:</span> <span className={`text-right truncate max-w-[120px] ${shipping.payment_type ? 'text-font-color' : 'text-font-color-100'}`} title={shipping.payment_type || '-'}>{shipping.payment_type || '-'}</span></div>
                  <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Packing List:</span> <span className="text-font-color text-right truncate max-w-[120px]" title={String(shipping.packing_list_type || '100')}>{shipping.packing_list_type || '100'}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Amounts */}
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
                    >
                      <IconChevronDown className={`h-3 w-3 transition-transform ${amountsExpanded ? 'rotate-180' : ''}`} />
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                      onClick={openAmountsModal}
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
                        <span className="font-mono text-font-color text-right truncate max-w-[120px]" title="0.00">0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">S & H:</span>
                        <span className="font-mono text-right truncate max-w-[120px] text-font-color-100" title="0.00">0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Sales Taxes:</span>
                        <span className="font-mono text-right truncate max-w-[120px] text-font-color-100" title="0.00">0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Discount/Add. Chgs.:</span>
                        <span className="font-mono text-right truncate max-w-[120px] text-font-color-100" title="0.00">0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-t border-border-color pt-1 font-bold">
                        <span className="text-font-color whitespace-nowrap">Total Amount:</span>
                        <span className="font-mono text-font-color text-right truncate max-w-[120px]" title="0.00">0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Amount Paid:</span>
                        <span className="font-mono text-right truncate max-w-[120px] text-font-color-100" title="0.00">0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-t border-border-color pt-1 font-bold">
                        <span className="text-font-color whitespace-nowrap">Net Due:</span>
                        <span className="font-mono text-font-color text-right truncate max-w-[120px]" title="0.00">0.00</span>
                      </div>
                      <div className="h-px bg-border-color my-2" />
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Balance Due (US):</span>
                        <span className="font-mono text-right truncate max-w-[120px] text-font-color-100" title="0.00">0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Int. Decl. Value:</span>
                        <span className="font-mono text-right truncate max-w-[120px] text-font-color-100" title="0.00">0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Insurance:</span>
                        <span className="font-mono text-right truncate max-w-[120px] text-font-color-100" title="0.00">0.00</span>
                      </div>
                    </>
                  ) : (
                    // Show only fields with values when collapsed
                    getAmountsFieldsWithValues().length > 0 ? (
                      getAmountsFieldsWithValues().map(field => (
                        <div key={field.key} className="flex justify-between items-center py-0.5">
                          <span className="font-medium text-font-color-100 whitespace-nowrap">{field.label}:</span>
                          <span className="text-right truncate max-w-[120px] text-font-color" title={field.value}>{field.value}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-font-color-100 py-2">No amounts information</div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Others */}
            <Card className="shadow-sm border-border-color">
              <CardHeader className="bg-primary-10 border-b border-border-color py-2 px-3 min-h-[40px]">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                    <IconSettings className="w-3.5 h-3.5" />
                    OTHERS
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      variant="outline"
                      className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                      onClick={() => setOthersExpanded(!othersExpanded)}
                    >
                      <IconChevronDown className={`h-3 w-3 transition-transform ${othersExpanded ? 'rotate-180' : ''}`} />
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                      onClick={openOthersModal}
                    >
                      <IconEdit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-1 text-xs">
                  {othersExpanded ? (
                    // Show all fields when expanded
                    <>
                      <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Original Order #:</span> <span className={`text-right truncate max-w-[120px] ${others.original_order_number ? 'text-font-color' : 'text-font-color-100'}`} title={others.original_order_number || '-'}>{others.original_order_number || '-'}</span></div>
                      <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Customer Number:</span> <span className={`text-right truncate max-w-[120px] ${others.customer_number ? 'text-font-color' : 'text-font-color-100'}`} title={others.customer_number || '-'}>{others.customer_number || '-'}</span></div>
                      <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Shipping Instructions:</span> <span className={`text-right truncate max-w-[120px] ${others.shipping_instructions ? 'text-font-color' : 'text-font-color-100'}`} title={others.shipping_instructions || '-'}>{others.shipping_instructions || '-'}</span></div>
                      <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Comments:</span> <span className={`text-right truncate max-w-[120px] ${others.comments ? 'text-font-color' : 'text-font-color-100'}`} title={others.comments || '-'}>{others.comments || '-'}</span></div>
                    </>
                  ) : (
                    // Show only fields with values when collapsed
                    getOthersFieldsWithValues().length > 0 ? (
                      getOthersFieldsWithValues().map(field => (
                        <div key={field.key} className="flex justify-between items-center py-0.5">
                          <span className="font-medium text-font-color-100 whitespace-nowrap">{field.label}:</span>
                          <span className="text-right truncate max-w-[120px] text-font-color" title={field.value}>{field.value}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-font-color-100 py-2">No others information</div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


      {/* Shipping Modal */}
      <Dialog open={showShippingModal} onOpenChange={setShowShippingModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Shipping Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label className="text-font-color-100 text-sm">Int. Code</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={String(shipping.int_code || '')} 
                  onChange={e=>setShipping({...shipping, int_code: e.target.value})} 
                />
                </div>
                <div>
                <Label className="text-font-color-100 text-sm">Carrier</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.shipping_carrier} 
                  onChange={e=>setShipping({...shipping, shipping_carrier: e.target.value})} 
                />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label className="text-font-color-100 text-sm">Service</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.shipping_service} 
                  onChange={e=>setShipping({...shipping, shipping_service: e.target.value})} 
                />
                </div>
                <div>
                <Label className="text-font-color-100 text-sm">Packing List Type</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={String(shipping.packing_list_type || '')} 
                  onChange={e=>setShipping({...shipping, packing_list_type: e.target.value})} 
                />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label className="text-font-color-100 text-sm">Freight Account</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.freight_account} 
                  onChange={e=>setShipping({...shipping, freight_account: e.target.value})} 
                />
                </div>
                  <div>
                <Label className="text-font-color-100 text-sm">Consignee #</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.consignee_number} 
                  onChange={e=>setShipping({...shipping, consignee_number: e.target.value})} 
                />
                  </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                  <div>
                <Label className="text-font-color-100 text-sm">Terms</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.terms} 
                  onChange={e=>setShipping({...shipping, terms: e.target.value})} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">FOB</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.fob} 
                  onChange={e=>setShipping({...shipping, fob: e.target.value})} 
                />
                  </div>
                </div>
                <div>
              <Label className="text-font-color-100 text-sm">Payment Type</Label>
              <Input 
                className="h-8 text-sm mt-1" 
                value={shipping.payment_type} 
                onChange={e=>setShipping({...shipping, payment_type: e.target.value})} 
              />
                </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowShippingModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowShippingModal(false)}
              >
                Save
              </Button>
              </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Amounts Modal */}
      <Dialog open={showAmountsModal} onOpenChange={setShowAmountsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Amounts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Order Amount</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value="0.00" 
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">S & H</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value="0.00" 
                  onChange={e => {/* Handle S&H change */}} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Sales Taxes</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value="0.00" 
                  onChange={e => {/* Handle sales tax change */}} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Discount/Add. Chgs.</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value="0.00" 
                  onChange={e => {/* Handle discount change */}} 
                />
              </div>
            </div>
            <div className="border-t border-border-color pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-font-color-100 text-sm font-semibold">Total Amount</Label>
                  <Input 
                    className="h-8 text-sm mt-1 font-mono" 
                    value="0.00" 
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Amount Paid</Label>
                  <Input 
                    className="h-8 text-sm mt-1" 
                    value="0.00" 
                    onChange={e => {/* Handle amount paid change */}} 
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-border-color pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-font-color-100 text-sm font-semibold">Net Due</Label>
                  <Input 
                    className="h-8 text-sm mt-1 font-mono" 
                    value="0.00" 
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Balance Due (US)</Label>
                  <Input 
                    className="h-8 text-sm mt-1" 
                    value="0.00" 
                    onChange={e => {/* Handle balance due change */}} 
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Int. Decl. Value</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value="0.00" 
                  onChange={e => {/* Handle int declared value change */}} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Insurance</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value="0.00" 
                  onChange={e => {/* Handle insurance change */}} 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAmountsModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowAmountsModal(false)}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Others Modal */}
      <Dialog open={showOthersModal} onOpenChange={setShowOthersModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Others</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-font-color-100 text-sm">Original Order #</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={others.original_order_number} 
                  onChange={e=>setOthers({...others, original_order_number: e.target.value})} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Customer Number</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={others.customer_number} 
                  onChange={e=>setOthers({...others, customer_number: e.target.value})} 
                />
              </div>
              </div>
              <div>
              <Label className="text-font-color-100 text-sm">Est. Weight for RS Label (lb)</Label>
              <Input 
                className="h-8 text-sm mt-1" 
                type="number"
                step="0.01"
                value={others.return_weight_lb} 
                onChange={e=>setOthers({...others, return_weight_lb: e.target.value})} 
              />
              </div>
              <div>
              <Label className="text-font-color-100 text-sm">Shipping Instructions</Label>
              <Textarea 
                className="text-sm mt-1 min-h-[80px]" 
                value={others.shipping_instructions} 
                onChange={e=>setOthers({...others, shipping_instructions: e.target.value})} 
                placeholder="Enter shipping instructions..."
              />
              </div>
            <div>
              <Label className="text-font-color-100 text-sm">Comments</Label>
              <Textarea 
                className="text-sm mt-1 min-h-[80px]" 
                value={others.comments} 
                onChange={e=>setOthers({...others, comments: e.target.value})} 
                placeholder="Enter additional comments..."
              />
        </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowOthersModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowOthersModal(false)}
              >
                Save
              </Button>
      </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Browse Items Dialog */}
        <BrowseItemsDialog
          open={showBrowseItemsModal}
          onOpenChange={setShowBrowseItemsModal}
          onAddItems={handleAddItemsToCart}
          warehouse={getCurrentWarehouse()}
          title="Browse Items"
          warningMessage={!hasValidWarehouse() ? "Please select a warehouse to browse items" : ""}
          cacheType={activeCartTab as 'auth' | 'ship'}
          existingCartItems={activeCartTab === 'auth' ? toReceive : toShip}
        />

      {/* Edit Line Modal */}
      <Dialog open={editLineOpen} onOpenChange={setEditLineOpen}>
        <DialogContent style={{ maxWidth: 500 }}>
          <DialogHeader>
            <DialogTitle>Edit {editLineType === 'auth' ? 'Auth' : 'Ship'} Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-font-color-100 text-sm">Quantity</Label>
              <Input
                value={editLineData.quantity}
                onChange={e => setEditLineData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                className="h-9 text-sm mt-1"
                type="number"
                min="0"
              />
            </div>
            
            {editLineType === 'auth' && (
              <div>
                <Label className="text-font-color-100 text-sm">Serial Number</Label>
                <Input
                  value={editLineData.serialnumber}
                  onChange={e => setEditLineData(prev => ({ ...prev, serialnumber: e.target.value }))}
                  className="h-9 text-sm mt-1"
                  placeholder="Enter serial number"
                />
              </div>
            )}
            
            {editLineType === 'ship' && (
              <div>
                <Label className="text-font-color-100 text-sm">Unit Price</Label>
                <Input
                  value={editLineData.unit_price}
                  onChange={e => setEditLineData(prev => ({ ...prev, unit_price: e.target.value }))}
                  className="h-9 text-sm mt-1"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLineOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedLine}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validate Address Modal */}
      <Dialog open={validateOpen} onOpenChange={setValidateOpen}>
        <DialogContent style={{ maxWidth: 800 }}>
          <DialogHeader>
            <DialogTitle>Address Validation Results</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {validateResult?.warnings && validateResult.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Warnings:</h4>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  {validateResult.warnings.map((warning: string, index: number) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            {validateResult?.errors && validateResult.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  {validateResult.errors.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {validateResult?.correct_address && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Suggested Correction:</h4>
                <div className="text-green-700 space-y-1">
                  <div><strong>Address 1:</strong> {validateResult.correct_address.address1}</div>
                  {validateResult.correct_address.address2 && (
                    <div><strong>Address 2:</strong> {validateResult.correct_address.address2}</div>
                  )}
                  <div><strong>City:</strong> {validateResult.correct_address.city}</div>
                  <div><strong>State:</strong> {validateResult.correct_address.state_province}</div>
                  <div><strong>Postal Code:</strong> {validateResult.correct_address.postal_code}</div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setValidateOpen(false)}>
              Cancel
            </Button>
            {validateResult?.correct_address && (
              <Button onClick={onAcceptCorrectAddress}>
                Accept Correction
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


