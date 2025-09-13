import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { getAuthState } from '@/lib/auth/guards';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
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
import { consumeRmaDraft } from '@/services/returnTrakEntryCache';

export default function ReturnTrakEntryPage() {
  const auth = getAuthState();
  if (!auth.isAuthenticated) {
    if (typeof window !== 'undefined') window.location.href = '/auth/sign-in';
    return null;
  }
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const pendingRouteRef = useRef<string | null>(null);
  // Prefill from ReturnTrak Drafts if present
  useEffect(() => {
    const draft = consumeRmaDraft();
    if (draft) {
      try {
        const header = draft.rma_header || {} as any;
        setRmaNumber(String(header.rma_number || ''));
        setRmaType(String(header.rma_type_code || ''));
        setDisposition(String(header.disposition_code || ''));
        if (header.account_number || header.location) {
          setAccountReceivingWarehouse(`${header.account_number || ''}.${header.location || ''}`.replace(/^\./,'').replace(/\.$/,''));
        }
        if (header.shipping_account_number || header.shipping_warehouse) {
          setAccountShippingWarehouse(`${header.shipping_account_number || ''}.${header.shipping_warehouse || ''}`.replace(/^\./,'').replace(/\.$/,''));
        }
        setShippingAddress({ ...(header.shipping_address || {}) });
        setShipping(prev => ({
          ...prev,
          shipping_carrier: String(header.shipping_carrier || ''),
          shipping_service: String(header.shipping_service || ''),
          packing_list_type: String(header.packing_list_type || ''),
          freight_account: String(header.freight_account || ''),
          consignee_number: String(header.consignee_number || ''),
          int_code: String(header.international_code || ''),
          terms: String(header.terms || ''),
          fob: String(header.fob || ''),
          payment_type: String(header.payment_type || ''),
        }));
        setOthers(prev => ({
          ...prev,
          customer_number: String(header.customer_number || ''),
          shipping_instructions: String(header.shipping_instructions || ''),
          comments: String(header.comments || ''),
          original_order_number: String(header.original_order_number || ''),
          original_account_number: String(header.original_account_number || ''),
          return_weight_lb: (header.return_weight_lb as any) || ''
        }));
        // Map cf1..cf7 to dynamic options (e.g., Place of Purchase, Reason for Return)
        setOptions(prev => ({
          ...prev,
          option1: String(header.cf1 || ''),
          option2: String(header.cf2 || ''),
          option3: String(header.cf3 || ''),
          option4: String(header.cf4 || ''),
          option5: String(header.cf5 || ''),
          option6: String(header.cf6 || ''),
          option7: String(header.cf7 || ''),
        }));
        setAmounts(prev => ({
          ...prev,
          order_subtotal: Number(header.order_subtotal || 0),
          shipping_handling: Number(header.shipping_handling || 0),
          sales_tax: Number(header.sales_tax || 0),
          international_handling: Number(header.international_handling || 0),
          total_due: Number(header.total_due || 0),
          amount_paid: Number(header.amount_paid || 0),
          net_due_currency: Number(header.net_due_currency || 0),
          balance_due_us: Number(header.balance_due_us || 0),
          international_declared_value: Number(header.international_declared_value || 0),
          insurance: Number(header.insurance || 0)
        }));
        setToReceive(Array.isArray(draft.to_receive) ? draft.to_receive : []);
        setToShip(Array.isArray(draft.to_ship) ? draft.to_ship : []);
        setHasUnsavedChanges(false);
      } catch {
        // ignore
      }
    }
  }, []);

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

  // Amounts
  const [amounts, setAmounts] = useState({
    order_subtotal: 0,
    shipping_handling: 0,
    sales_tax: 0,
    international_handling: 0,
    total_due: 0,
    amount_paid: 0,
    net_due_currency: 0,
    balance_due_us: 0,
    international_declared_value: 0,
    insurance: 0
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

  // Modal form states (for temporary editing)
  const [modalOthers, setModalOthers] = useState({
    original_order_number: '',
    original_account_number: '',
    customer_number: '',
    shipping_instructions: '',
    comments: '',
    return_weight_lb: ''
  });

  const [modalAmounts, setModalAmounts] = useState({
    order_subtotal: 0,
    shipping_handling: 0,
    sales_tax: 0,
    international_handling: 0,
    total_due: 0,
    amount_paid: 0,
    net_due_currency: 0,
    balance_due_us: 0,
    international_declared_value: 0,
    insurance: 0
  });
  
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
    'T02': [[1,0,1,1], [0,0]],
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

  // Check if Auth (Receive) should be enabled based on RMA type
  const isToReceiveEnabled = useMemo(() => {
    if (!rmaType) return false;
    const config = rmaTypeConfig[rmaType];
    return config ? config[1][0] === 1 : false;
  }, [rmaType]);

  // Helper function to determine if a field is required
  const isFieldRequired = (fieldName: string) => {
    switch (fieldName) {
      case 'accountReceivingWarehouse':
        return !accountReceivingWarehouse;
      case 'rmaType':
        return !rmaType;
      case 'accountShippingWarehouse':
        return !accountShippingWarehouse && isToShipEnabled;
      case 'disposition':
        return !disposition && isToReceiveEnabled;
      case 'rmaNumber':
        return !rmaNumber && isManualNumbering;
      case 'company':
        // Company is required when BOTH company AND attention are empty (like OrderPoints)
        return (!shippingAddress.company || shippingAddress.company.trim() === '') && 
               (!shippingAddress.attention || shippingAddress.attention.trim() === '');
      case 'attention':
        // Attention is required when BOTH company AND attention are empty (like OrderPoints)
        return (!shippingAddress.company || shippingAddress.company.trim() === '') && 
               (!shippingAddress.attention || shippingAddress.attention.trim() === '');
      case 'address1':
        // Address 1 is required when empty AND RMA type supports shipping
        return (!shippingAddress.address1 || shippingAddress.address1.trim() === '') && isToShipEnabled;
      case 'city':
        // City is required when empty AND RMA type supports shipping
        return (!shippingAddress.city || shippingAddress.city.trim() === '') && isToShipEnabled;
      case 'postal_code':
        // Postal Code is required when empty AND country is US/CA AND RMA type supports shipping
        return (!shippingAddress.postal_code || shippingAddress.postal_code.trim() === '') && 
               (shippingAddress.country === 'US' || shippingAddress.country === 'CA') && 
               isToShipEnabled;
      case 'state_province':
        // State is required when empty AND country is US/CA/AU AND RMA type supports shipping
        return (!shippingAddress.state_province || shippingAddress.state_province.trim() === '') && 
               (shippingAddress.country === 'US' || shippingAddress.country === 'CA' || shippingAddress.country === 'AU') && 
               isToShipEnabled;
      case 'country':
        // Country is required when empty AND RMA type supports shipping
        return (!shippingAddress.country || shippingAddress.country.trim() === '') && isToShipEnabled;
      case 'email':
        // Email is required when empty AND email is required for any RMA type
        return (!shippingAddress.email || shippingAddress.email.trim() === '') && isEmailRequired;
      // Address 2 and Phone are NOT required in legacy code
      default:
        return false;
    }
  };

  // Check if email is required based on RMA settings
  const isEmailRequired = useMemo(() => {
    if (!rmaSettings?.email_settings_rt) return false;
    const emailSettings = rmaSettings.email_settings_rt;
    return emailSettings.issue || emailSettings.receive || emailSettings.ship || emailSettings.cancel;
  }, [rmaSettings]);

  // Modal handlers (OrderPoints pattern)
  const handleOthersModalOpen = () => {
    // Copy current others data to modal state
    setModalOthers({ ...others });
    setShowOthersModal(true);
  };

  const handleOthersModalSave = () => {
    // Save modal data to main state
    setOthers(modalOthers);
    setShowOthersModal(false);
  };

  const handleOthersModalCancel = () => {
    // Just close modal without saving
    setShowOthersModal(false);
  };

  const handleOthersModalChange = (field: string, value: string) => {
    // Update modal state only (not main state)
    setModalOthers(prev => ({ ...prev, [field]: value }));
  };

  // Amounts modal handlers (OrderPoints pattern)
  const handleAmountsModalOpen = () => {
    // Copy current amounts data to modal state
    setModalAmounts({ ...amounts });
    setShowAmountsModal(true);
  };

  const handleAmountsModalSave = () => {
    // Save modal data to main state
    setAmounts(modalAmounts);
    setShowAmountsModal(false);
  };

  const handleAmountsModalCancel = () => {
    // Just close modal without saving
    setShowAmountsModal(false);
  };

  const handleAmountsModalChange = (field: string, value: string) => {
    // Update modal state only (not main state)
    const numValue = isNaN(Number(value)) ? 0 : Number(value);
    setModalAmounts(prev => ({ ...prev, [field]: numValue }));
  };

  // Derived: accounts list from authToken (warehouses - same as OrderPoints)
  const accountsMap = useMemo(() => {
    try {
      if (typeof window === 'undefined') return {} as Record<string, string>;
      const raw = window.localStorage.getItem('authToken');
      if (!raw) return {} as Record<string, string>;
      const token = JSON.parse(raw);
      const warehousesData = token?.user_data?.warehouses;
      
      if (!warehousesData || typeof warehousesData !== 'object') return {};
      
      const options: Record<string, string> = {};
      
      // Process warehouses exactly like OrderPoints
      Object.keys(warehousesData).forEach((aWarehouse) => {
        const branches = warehousesData[aWarehouse];
        if (Array.isArray(branches)) {
          branches.forEach((branchObj: any) => {
            if (branchObj && typeof branchObj === 'object') {
              Object.keys(branchObj).forEach((anInvType) => {
                const optionValue = `${aWarehouse}-${anInvType}`;
                const optionLabel = `${aWarehouse} - ${anInvType}`;
                options[optionValue] = optionLabel;
              });
            }
          });
        }
      });
      
      return options;
    } catch {
      return {} as Record<string, string>;
    }
  }, []);

  const accountOptions = useMemo(() => {
    const entries = Object.entries(accountsMap).map(([value, label]) => ({ value, label: String(label) }));
    // Remove duplicates based on value
    const uniqueEntries = entries.filter((entry, index, self) => 
      index === self.findIndex(e => e.value === entry.value)
    );
    return uniqueEntries;
  }, [accountsMap]);

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

  // Rules a) & b) Auto-select Ship WH when RMA Type requires shipment and Ship WH is empty
  // This handles both cases: RMA Type selected first, or RMA WH selected first
  useEffect(() => {
    if (isToShipEnabled && accountReceivingWarehouse && !accountShippingWarehouse) {
      setAccountShippingWarehouse(accountReceivingWarehouse);
    }
  }, [isToShipEnabled, accountReceivingWarehouse, accountShippingWarehouse]);


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

  // Prepopulate shipping fields when RMA settings are loaded (only if not coming from draft)
  const [didApplyDefaultShipping, setDidApplyDefaultShipping] = useState(false);
  useEffect(() => {
    if (!rmaSettings?.general?.shipping) return;
    if (didApplyDefaultShipping) return;
    // If draft already set shipping values, skip applying defaults
    const hasDraftShipping = [
      shipping.shipping_carrier,
      shipping.shipping_service,
      shipping.packing_list_type,
      shipping.freight_account,
      shipping.consignee_number,
      shipping.terms,
      shipping.fob,
      shipping.int_code,
    ].some(v => (v ?? '') !== '');
    if (hasDraftShipping) return;

    const { domestic } = rmaSettings.general.shipping;
    setShipping(prev => ({
      ...prev,
      shipping_carrier: domestic.carrier || prev.shipping_carrier,
      shipping_service: domestic.service || prev.shipping_service,
      packing_list_type: domestic.packing_list_type?.toString() || prev.packing_list_type,
      freight_account: domestic.freight_account || prev.freight_account,
      consignee_number: domestic.consignee_number || prev.consignee_number,
      terms: domestic.terms || prev.terms,
      fob: domestic.fob || prev.fob,
      int_code: domestic.int_code?.toString() || prev.int_code,
    }));
    setDidApplyDefaultShipping(true);
  }, [rmaSettings, didApplyDefaultShipping, shipping]);

  async function onGenerateRmaNumber() {
    if (!rmaSettings) return;
    const manual = !!rmaSettings.general?.auto_number?.manual === false ? false : rmaSettings.general?.auto_number?.manual;
    if (manual === false) {
      const num = await generateRmaNumber();
      setRmaNumber(num || '');
      setHasUnsavedChanges(true);
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
        // Check for duplicate SKU + Serial Number combination (excluding current line)
        const duplicateExists = toReceive.some((item, index) => 
          index !== editLineIndex &&
          !item.voided &&
          item.item_number === updatedItem.item_number &&
          item.serialnumber === editLineData.serialnumber &&
          editLineData.serialnumber.trim() !== ''
        );
        
        if (duplicateExists) {
          toast({
            title: "Duplicate Serial Number",
            description: "A line for this SKU already exists with this Serial Number. Please use a different serial number.",
            variant: "destructive",
          });
          return; // Don't save if duplicate exists
        }
        
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
      markAsClean();
    } finally {
      to_draft ? setSavingDraft(false) : setPlacing(false);
    }
  }

  const isManualNumbering = !!rmaSettings?.general?.auto_number?.manual;


  // Helper functions for panels
  function getAmountsFieldsWithValues() {
    const orderAmount = 0; // RMA doesn't have order items, so always 0
    const totalAmount = amounts.shipping_handling + amounts.sales_tax + amounts.international_handling;
    const netDue = totalAmount - amounts.amount_paid;
    
    const fields = [
      { key: 'order_amount', label: 'Order Amount', value: orderAmount.toFixed(2), alwaysShow: true },
      { key: 'shipping_handling', label: 'S & H', value: amounts.shipping_handling.toFixed(2) },
      { key: 'sales_tax', label: 'Sales Taxes', value: amounts.sales_tax.toFixed(2) },
      { key: 'discount', label: 'Discount/Add. Chgs.', value: amounts.international_handling.toFixed(2) },
      { key: 'total_amount', label: 'Total Amount', value: totalAmount.toFixed(2), alwaysShow: true, isBold: true },
      { key: 'amount_paid', label: 'Amount Paid', value: amounts.amount_paid.toFixed(2) },
      { key: 'net_due', label: 'Net Due', value: netDue.toFixed(2), alwaysShow: true, isBold: true },
      { key: 'balance_due', label: 'Balance Due (US)', value: amounts.balance_due_us.toFixed(2) },
      { key: 'int_declared', label: 'Int. Decl. Value', value: amounts.international_declared_value.toFixed(2) },
      { key: 'insurance', label: 'Insurance', value: amounts.insurance.toFixed(2) }
    ];
    return fields.filter(field => field.alwaysShow || parseFloat(field.value) !== 0);
  }

  function getOthersFieldsWithValues() {
    const fields = [
      { key: 'original_order', label: 'Original Order #', value: others.original_order_number },
      { key: 'customer_number', label: 'Customer Number', value: others.customer_number },
      { key: 'return_weight_lb', label: 'Est. Weight for RS Label (lb)', value: others.return_weight_lb },
      { key: 'shipping_instructions', label: 'Shipping Instructions', value: others.shipping_instructions },
      { key: 'comments', label: 'Comments', value: others.comments }
    ];
    return fields.filter(field => {
      const v: any = field.value;
      if (v === undefined || v === null) return false;
      if (typeof v === 'string') return v.trim() !== '';
      if (typeof v === 'number') return v !== 0;
      return Boolean(v);
    });
  }

  // Modal handlers
  function openShippingModal() {
    setShowShippingModal(true);
    setHasUnsavedChanges(true);
  }

  function openAmountsModal() {
    handleAmountsModalOpen();
    setHasUnsavedChanges(true);
  }

  function openOthersModal() {
    handleOthersModalOpen();
    setHasUnsavedChanges(true);
  }
  
  // Browse Items handlers
  function openBrowseItemsModal() {
    setShowBrowseItemsModal(true);
  }
  
  function handleAddItemsToCart(items: any[]) {
    // Add items using smart logic: SKU + Serial Number is unique key
    items.forEach(item => {
      if (activeCartTab === 'auth') {
        // Smart quantity addition logic for Auth items
        const existingItemIndex = toReceive.findIndex(existing => 
          existing.item_number === item.item_number && 
          existing.serialnumber === '' && 
          !existing.voided
        );
        
        if (existingItemIndex !== -1) {
          // Update existing line (no serial number) - add quantities
          setToReceive(prev => prev.map((existing, index) => 
            index === existingItemIndex 
              ? { ...existing, quantity: existing.quantity + (item.quantity || 0) }
              : existing
          ));
        } else {
          // Add new line
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
        }
        
        // If RMA type requires both receive and ship, also add to ship
        if (isToShipEnabled) {
          const existingShipItemIndex = toShip.findIndex(existing => 
            existing.item_number === item.item_number && 
            !existing.voided
          );
          
          if (existingShipItemIndex !== -1) {
            // Update existing ship line - add quantities
            setToShip(prev => prev.map((existing, index) => 
              index === existingShipItemIndex 
                ? { ...existing, quantity: existing.quantity + (item.quantity || 0) }
                : existing
            ));
          } else {
            // Add new ship line
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
        }
      } else {
        // Smart quantity addition logic for Ship items
        const existingItemIndex = toShip.findIndex(existing => 
          existing.item_number === item.item_number && 
          !existing.voided
        );
        
        if (existingItemIndex !== -1) {
          // Update existing line - add quantities
          setToShip(prev => prev.map((existing, index) => 
            index === existingItemIndex 
              ? { ...existing, quantity: existing.quantity + (item.quantity || 0) }
              : existing
          ));
        } else {
          // Add new line
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
      }
    });
    setHasUnsavedChanges(true);
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

  // Check if we have both warehouse and RMA type selected
  function hasValidWarehouseAndRmaType() {
    const warehouse = getCurrentWarehouse();
    const hasWarehouse = warehouse && warehouse.trim() !== '';
    const hasRmaType = rmaType && rmaType.trim() !== '';
    
    // Rule c) If shipment is required, Ship WH must also be selected
    if (isToShipEnabled && hasRmaType) {
      const hasShipWarehouse = accountShippingWarehouse && accountShippingWarehouse.trim() !== '';
      return hasWarehouse && hasRmaType && hasShipWarehouse;
    }
    
    return hasWarehouse && hasRmaType;
  }

  // Always enable Browse Items button (as requested by user)
  function shouldEnableBrowseItems() {
    return true; // Always enabled as per user request
  }
  
  // Auto-add functionality for "Add item" input
  async function handleAddItemAuto() {
    if (!findItemValue.trim() || !hasValidWarehouseAndRmaType()) return;
    
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

  // Warn on browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Leave this page?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Intercept Next.js route changes
  useEffect(() => {
    const handler = (url: string) => {
      if (hasUnsavedChanges) {
        pendingRouteRef.current = url;
        setShowLeaveConfirm(true);
        // cancel navigation
        throw 'Route change aborted due to unsaved changes';
      }
    };
    router.events.on('routeChangeStart', handler as any);
    return () => router.events.off('routeChangeStart', handler as any);
  }, [hasUnsavedChanges, router]);

  function markAsClean() {
    setHasUnsavedChanges(false);
  }

  return (
    <div className="bg-body-color">
      {/* Header */}
      <div className="bg-card-color border-b border-border-color">
        <div className="w-full max-w-7xl mx-auto px-6 py-4" style={{ maxWidth: '1600px' }}>
          <div className="flex items-center justify-between">
        <div>
              <h1 className="text-xl font-semibold text-font-color">ReturnTrak - RMA Entry</h1>
              <p className="text-sm text-font-color-100 mt-1">
                Create and manage RMAs
                {hasUnsavedChanges && <span className="text-orange-500 ml-2">• Unsaved changes detected</span>}
              </p>
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
                          {isFieldRequired('accountReceivingWarehouse') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
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
                          {isFieldRequired('rmaType') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
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
                          {isFieldRequired('accountShippingWarehouse') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
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
                          {isFieldRequired('disposition') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
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

                    {/* Row 3: RMA # */}
                    <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          RMA #
                          {isFieldRequired('rmaNumber') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        {!isManualNumbering ? (
                          // Auto-generation mode: special styling with generate button
                          <div className="flex mt-1">
                            <div className="flex-1 relative">
                              <Input
                                value={rmaNumber || ''}
                                onChange={e => { setRmaNumber(e.target.value); setHasUnsavedChanges(true); }}
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
                            onChange={e => { setRmaNumber(e.target.value); setHasUnsavedChanges(true); }} 
                          />
                    )}
                  </div>
                    </div>

                    {/* Custom fields (all) */}
                    {(rmaSettings?.custom_fields || []).length > 0 && (
                      <div className="space-y-2">
                        {(rmaSettings?.custom_fields || []).map(cf => (
                    <div key={cf.index}>
                            <Label className="text-font-color-100 text-sm flex items-center">
                              {cf.title}:
                              {cf.required && !options[`option${cf.index}`] && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                      {cf.type === 'text' ? (
                              <Input 
                                className="h-8 text-sm mt-1" 
                                value={options[`option${cf.index}`] || ''} 
                                onChange={e=>{ setOptions(prev=>({ ...prev, [`option${cf.index}`]: e.target.value })); setHasUnsavedChanges(true); }} 
                              />
                      ) : (
                        <Select value={options[`option${cf.index}`] || ''} onValueChange={v=>{ setOptions(prev=>({ ...prev, [`option${cf.index}`]: v })); setHasUnsavedChanges(true); }}>
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
                          {isFieldRequired('company') && (
                            <span className="text-orange-500 ml-1">*</span>
                          )}
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.company||''} 
                          onChange={e=>{setShippingAddress({...shippingAddress,company:e.target.value}); setHasUnsavedChanges(true);}} 
                        />
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm flex items-center">
                          Attention
                          {isFieldRequired('attention') && (
                            <span className="text-orange-500 ml-1">*</span>
                          )}
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.attention||''} 
                          onChange={e=>{setShippingAddress({...shippingAddress,attention:e.target.value}); setHasUnsavedChanges(true);}} 
                        />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          Address 1
                          {isFieldRequired('address1') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        <Input 
                          className="h-9 text-sm mt-1" 
                          value={shippingAddress.address1||''} 
                          onChange={e=>{setShippingAddress({...shippingAddress,address1:e.target.value}); setHasUnsavedChanges(true);}} 
                        />
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          Address 2
                        </Label>
                        <Input 
                          className="h-9 text-sm mt-1" 
                          value={shippingAddress.address2||''} 
                          onChange={e=>{setShippingAddress({...shippingAddress,address2:e.target.value}); setHasUnsavedChanges(true);}} 
                        />
                </div>
              </div>
                    <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          City
                          {isFieldRequired('city') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.city||''} 
                          onChange={e=>{setShippingAddress({...shippingAddress,city:e.target.value}); setHasUnsavedChanges(true);}} 
                        />
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          Postal Code
                          {isFieldRequired('postal_code') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.postal_code||''} 
                          onChange={e=>{setShippingAddress({...shippingAddress,postal_code:e.target.value}); setHasUnsavedChanges(true);}} 
                        />
                </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          Country
                          {isFieldRequired('country') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        <div className="mt-1">
                          <div className="relative">
                            <CountryFilterCombobox
                              value={shippingAddress.country || ''}
                              onValueChange={(v: string) => {
                                setShippingAddress({...shippingAddress, country: v, state_province: ''});
                                setHasUnsavedChanges(true);
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
                          {isFieldRequired('state_province') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        <div className="mt-1">
                          <div className="relative">
                            <StateFilterCombobox
                              value={shippingAddress.state_province||''}
                              onValueChange={(v: string) => {
                                setShippingAddress({...shippingAddress, state_province: v});
                                setHasUnsavedChanges(true);
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
                          onChange={e=>{setShippingAddress({...shippingAddress,phone:e.target.value}); setHasUnsavedChanges(true);}} 
                        />
                </div>
                <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          Email
                          {isFieldRequired('email') && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.email||''} 
                          onChange={e=>{setShippingAddress({...shippingAddress,email:e.target.value}); setHasUnsavedChanges(true);}} 
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
                        disabled={!hasValidWarehouseAndRmaType()}
                />
              </div>
                {/* Custom Toggle Switch for Auth/To Ship */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1 h-8">
                  <button
                    onClick={() => setActiveCartTab('auth')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                      activeCartTab === 'auth'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Auth
                  </button>
                  <button
                    onClick={() => setActiveCartTab('ship')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                      activeCartTab === 'ship'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    To Ship
                  </button>
                </div>
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
                          {row.serialnumber || ''}
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
                        <span className={`font-mono text-right truncate max-w-[120px] ${amounts.shipping_handling > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={amounts.shipping_handling.toFixed(2)}>{amounts.shipping_handling.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Sales Taxes:</span>
                        <span className={`font-mono text-right truncate max-w-[120px] ${amounts.sales_tax > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={amounts.sales_tax.toFixed(2)}>{amounts.sales_tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Discount/Add. Chgs.:</span>
                        <span className={`font-mono text-right truncate max-w-[120px] ${amounts.international_handling > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={amounts.international_handling.toFixed(2)}>{amounts.international_handling.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-t border-border-color pt-1 font-bold">
                        <span className="text-font-color whitespace-nowrap">Total Amount:</span>
                        <span className="font-mono text-font-color text-right truncate max-w-[120px]" title={(amounts.shipping_handling + amounts.sales_tax + amounts.international_handling).toFixed(2)}>{(amounts.shipping_handling + amounts.sales_tax + amounts.international_handling).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Amount Paid:</span>
                        <span className={`font-mono text-right truncate max-w-[120px] ${amounts.amount_paid > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={amounts.amount_paid.toFixed(2)}>{amounts.amount_paid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-t border-border-color pt-1 font-bold">
                        <span className="text-font-color whitespace-nowrap">Net Due:</span>
                        <span className="font-mono text-font-color text-right truncate max-w-[120px]" title={((amounts.shipping_handling + amounts.sales_tax + amounts.international_handling) - amounts.amount_paid).toFixed(2)}>{((amounts.shipping_handling + amounts.sales_tax + amounts.international_handling) - amounts.amount_paid).toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-border-color my-2" />
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Balance Due (US):</span>
                        <span className={`font-mono text-right truncate max-w-[120px] ${amounts.balance_due_us > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={amounts.balance_due_us.toFixed(2)}>{amounts.balance_due_us.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Int. Decl. Value:</span>
                        <span className={`font-mono text-right truncate max-w-[120px] ${amounts.international_declared_value > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={amounts.international_declared_value.toFixed(2)}>{amounts.international_declared_value.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-medium text-font-color-100 whitespace-nowrap">Insurance:</span>
                        <span className={`font-mono text-right truncate max-w-[120px] ${amounts.insurance > 0 ? 'text-font-color' : 'text-font-color-100'}`} title={amounts.insurance.toFixed(2)}>{amounts.insurance.toFixed(2)}</span>
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
                      <div className="flex justify-between items-center py-0.5"><span className="font-medium text-font-color-100 whitespace-nowrap">Est. Weight for RS Label (lb):</span> <span className={`text-right truncate max-w-[120px] ${others.return_weight_lb ? 'text-font-color' : 'text-font-color-100'}`} title={others.return_weight_lb || '-'}>{others.return_weight_lb || '-'}</span></div>
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
                  onChange={e=>{setShipping({...shipping, int_code: e.target.value}); setHasUnsavedChanges(true);}} 
                />
                </div>
                <div>
                <Label className="text-font-color-100 text-sm">Carrier</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.shipping_carrier} 
                  onChange={e=>{setShipping({...shipping, shipping_carrier: e.target.value}); setHasUnsavedChanges(true);}} 
                />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label className="text-font-color-100 text-sm">Service</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.shipping_service} 
                  onChange={e=>{setShipping({...shipping, shipping_service: e.target.value}); setHasUnsavedChanges(true);}} 
                />
                </div>
                <div>
                <Label className="text-font-color-100 text-sm">Packing List Type</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={String(shipping.packing_list_type || '')} 
                  onChange={e=>{setShipping({...shipping, packing_list_type: e.target.value}); setHasUnsavedChanges(true);}} 
                />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label className="text-font-color-100 text-sm">Freight Account</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.freight_account} 
                  onChange={e=>{setShipping({...shipping, freight_account: e.target.value}); setHasUnsavedChanges(true);}} 
                />
                </div>
                  <div>
                <Label className="text-font-color-100 text-sm">Consignee #</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.consignee_number} 
                  onChange={e=>{setShipping({...shipping, consignee_number: e.target.value}); setHasUnsavedChanges(true);}} 
                />
                  </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                  <div>
                <Label className="text-font-color-100 text-sm">Terms</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.terms} 
                  onChange={e=>{setShipping({...shipping, terms: e.target.value}); setHasUnsavedChanges(true);}} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">FOB</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={shipping.fob} 
                  onChange={e=>{setShipping({...shipping, fob: e.target.value}); setHasUnsavedChanges(true);}} 
                />
                  </div>
                </div>
                <div>
              <Label className="text-font-color-100 text-sm">Payment Type</Label>
              <Input 
                className="h-8 text-sm mt-1" 
                value={shipping.payment_type} 
                onChange={e=>{setShipping({...shipping, payment_type: e.target.value}); setHasUnsavedChanges(true);}} 
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
        <DialogContent style={{ maxWidth: 500 }}>
          <DialogHeader>
            <DialogTitle>Edit Amounts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              {/* Read-only calculated fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-font-color-100 text-sm font-semibold">Order Amount:</Label>
                  <Input
                    className="h-8 text-sm bg-gray-50"
                    type="text"
                    value="0.00"
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">S & H:</Label>
                  <Input
                    className="h-8 text-sm"
                    type="number"
                    step="0.01"
                    value={modalAmounts.shipping_handling}
                    onChange={e => { handleAmountsModalChange('shipping_handling', e.target.value); setHasUnsavedChanges(true); }}
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Sales Taxes:</Label>
                  <Input
                    className="h-8 text-sm"
                    type="number"
                    step="0.01"
                    value={modalAmounts.sales_tax}
                    onChange={e => { handleAmountsModalChange('sales_tax', e.target.value); setHasUnsavedChanges(true); }}
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Discount/Add. Chgs.:</Label>
                  <Input
                    className="h-8 text-sm"
                    type="number"
                    step="0.01"
                    value={modalAmounts.international_handling}
                    onChange={e => { handleAmountsModalChange('international_handling', e.target.value); setHasUnsavedChanges(true); }}
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm font-semibold">Total Amount:</Label>
                  <Input
                    className="h-8 text-sm bg-gray-50"
                    type="text"
                    value={(modalAmounts.shipping_handling + modalAmounts.sales_tax + modalAmounts.international_handling).toFixed(2)}
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Amount Paid:</Label>
                  <Input
                    className="h-8 text-sm"
                    type="number"
                    step="0.01"
                    value={modalAmounts.amount_paid}
                    onChange={e => { handleAmountsModalChange('amount_paid', e.target.value); setHasUnsavedChanges(true); }}
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm font-semibold">Net Due:</Label>
                  <Input
                    className="h-8 text-sm bg-gray-50"
                    type="text"
                    value={((modalAmounts.shipping_handling + modalAmounts.sales_tax + modalAmounts.international_handling) - modalAmounts.amount_paid).toFixed(2)}
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Balance Due (US):</Label>
                  <Input
                    className="h-8 text-sm"
                    type="number"
                    step="0.01"
                    value={modalAmounts.balance_due_us}
                    onChange={e => { handleAmountsModalChange('balance_due_us', e.target.value); setHasUnsavedChanges(true); }}
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Int. Decl. Value:</Label>
                  <Input
                    className="h-8 text-sm"
                    type="number"
                    step="0.01"
                    value={modalAmounts.international_declared_value}
                    onChange={e => { handleAmountsModalChange('international_declared_value', e.target.value); setHasUnsavedChanges(true); }}
                  />
                </div>
                <div>
                  <Label className="text-font-color-100 text-sm">Insurance:</Label>
                  <Input
                    className="h-8 text-sm"
                    type="number"
                    step="0.01"
                    value={modalAmounts.insurance}
                    onChange={e => { handleAmountsModalChange('insurance', e.target.value); setHasUnsavedChanges(true); }}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleAmountsModalCancel}>
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={handleAmountsModalSave}
            >
              Save
            </Button>
          </DialogFooter>
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
                  value={modalOthers.original_order_number} 
                  onChange={e=>{handleOthersModalChange('original_order_number', e.target.value); setHasUnsavedChanges(true);}} 
                />
              </div>
              <div>
                <Label className="text-font-color-100 text-sm">Customer Number</Label>
                <Input 
                  className="h-8 text-sm mt-1" 
                  value={modalOthers.customer_number} 
                  onChange={e=>{handleOthersModalChange('customer_number', e.target.value); setHasUnsavedChanges(true);}} 
                />
              </div>
              </div>
              <div>
              <Label className="text-font-color-100 text-sm">Est. Weight for RS Label (lb)</Label>
              <Input 
                className="h-8 text-sm mt-1" 
                type="number"
                step="0.01"
                value={modalOthers.return_weight_lb} 
                onChange={e=>{handleOthersModalChange('return_weight_lb', e.target.value); setHasUnsavedChanges(true);}} 
              />
              </div>
              <div>
              <Label className="text-font-color-100 text-sm">Shipping Instructions</Label>
              <Textarea 
                className="text-sm mt-1 min-h-[80px]" 
                value={modalOthers.shipping_instructions} 
                onChange={e=>{handleOthersModalChange('shipping_instructions', e.target.value); setHasUnsavedChanges(true);}} 
                placeholder="Enter shipping instructions..."
              />
              </div>
            <div>
              <Label className="text-font-color-100 text-sm">Comments</Label>
              <Textarea 
                className="text-sm mt-1 min-h-[80px]" 
                value={modalOthers.comments} 
                onChange={e=>{handleOthersModalChange('comments', e.target.value); setHasUnsavedChanges(true);}} 
                placeholder="Enter additional comments..."
              />
        </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleOthersModalCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleOthersModalSave}
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
          warningMessage={!hasValidWarehouseAndRmaType() ? 
            (isToShipEnabled && (!accountShippingWarehouse || accountShippingWarehouse.trim() === '') ? 
              "Please select a warehouse, RMA type, and Ship WH to browse items" : 
              "Please select a warehouse and RMA type to browse items") : ""}
          cacheType={activeCartTab as 'auth' | 'ship'}
          existingCartItems={activeCartTab === 'auth' ? toReceive : toShip}
          disabled={!hasValidWarehouseAndRmaType()}
          warehouseOptions={accountOptions}
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
                onChange={e => { setEditLineData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 })); setHasUnsavedChanges(true); }}
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
                  onChange={e => { setEditLineData(prev => ({ ...prev, serialnumber: e.target.value })); setHasUnsavedChanges(true); }}
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
                  onChange={e => { setEditLineData(prev => ({ ...prev, unit_price: e.target.value })); setHasUnsavedChanges(true); }}
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

      {/* Leave page confirmation */}
      <Dialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
        <DialogContent style={{ maxWidth: 520 }}>
          <DialogHeader>
            <DialogTitle>Unsaved changes</DialogTitle>
            <p className="text-sm mt-2 text-font-color-100">
              You have unsaved changes. Are you sure you want to leave this page?
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowLeaveConfirm(false); pendingRouteRef.current = null; }}>Stay</Button>
            <Button onClick={() => { const next = pendingRouteRef.current; setShowLeaveConfirm(false); setHasUnsavedChanges(false); if (next) router.push(next); }}>Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


