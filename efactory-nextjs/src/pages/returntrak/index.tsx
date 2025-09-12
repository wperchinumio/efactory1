import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthState } from '@/lib/auth/guards';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Input, Label, Tabs, TabsList, TabsTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
import { IconFileText, IconTruck, IconPackage, IconCurrency, IconSettings, IconEdit, IconChevronDown } from '@tabler/icons-react';
import {
  readReturnTrakSettings,
  generateRmaNumber,
  saveRma,
} from '@/services/api';
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
  const [browseOpen, setBrowseOpen] = useState(false);
  const [warehousesValue, setWarehousesValue] = useState('');

  // Panel states for expand/collapse functionality
  const [amountsExpanded, setAmountsExpanded] = useState(false);
  const [othersExpanded, setOthersExpanded] = useState(false);

  // Modal states
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showAmountsModal, setShowAmountsModal] = useState(false);
  const [showOthersModal, setShowOthersModal] = useState(false);

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

  const accountOptions = useMemo(() => Object.entries(accountsMap).map(([value, label]) => ({ value, label })), [accountsMap]);

  const isToShipEnabled = useMemo(() => {
    if (!rmaType || !rmaSettings) return false;
    // Legacy mapping uses table-config where [1][1] indicates To Ship capability
    const map = rmaSettings.rma_types?.find(rt => rt.code === rmaType);
    // We don't have the table config here; enable To Ship when shipping warehouse is chosen
    return !!accountShippingWarehouse;
  }, [rmaType, rmaSettings, accountShippingWarehouse]);

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
      description,
      quantity: 1,
      serialnumber: '',
      voided: false,
    };
    setToReceive(prev => [...prev, item]);
  }

  function addShipItem(item_number: string, description?: string) {
    const maxLine = toShip.reduce((m, i) => Math.max(m, i.line_number), 0);
    const newLine = maxLine + 1;
    const item: RmaShipItemDto = {
      detail_id: 0,
      line_number: newLine,
      item_number,
      description,
      quantity: 1,
      unit_price: '0.00',
      voided: false,
    };
    setToShip(prev => [...prev, item]);
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
    setBrowseOpen(true);
  }

  async function onPlaceRma(to_draft: boolean) {
    if (!rmaSettings) return;
    try {
      to_draft ? setSavingDraft(true) : setPlacing(true);
      const header: RmaHeaderSaveDto = {
        is_draft: to_draft,
        rma_number: rmaNumber || undefined,
        rma_type_code: rmaType || undefined,
        disposition_code: disposition || undefined,
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

  return (
    <div className="min-h-screen bg-body-color">
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
                size="sm" 
                onClick={() => onPlaceRma(true)} 
                disabled={savingDraft || placing}
                className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-blue-500 disabled:hover:text-blue-600 px-4 py-2"
              >
                {savingDraft ? "Saving..." : "Save Draft"}
              </Button>
              <Button 
                size="sm" 
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
                    <div className="ml-auto text-sm font-medium">
                      NEW RMA
                    </div>
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
                              {accountOptions.find(opt => opt.value === accountReceivingWarehouse)?.label || ""}
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-card-color border-border-color">
                            <SelectItem value="" className="text-font-color hover:bg-body-color">
                            </SelectItem>
                            {accountOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="text-font-color hover:bg-body-color">
                                <span className="whitespace-nowrap">{opt.label}</span>
                              </SelectItem>
                            ))}
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
                              {accountOptions.find(opt => opt.value === accountShippingWarehouse)?.label || ""}
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-card-color border-border-color">
                            <SelectItem value="" className="text-font-color hover:bg-body-color">
                            </SelectItem>
                            {accountOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="text-font-color hover:bg-body-color">
                                <span className="whitespace-nowrap">{opt.label}</span>
                              </SelectItem>
                            ))}
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
                              {options.place_of_purchase || ""}
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-card-color border-border-color">
                            <SelectItem value="" className="text-font-color hover:bg-body-color">
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
                                    {options[`option${cf.index}`] || ""}
                                  </span>
                                </SelectTrigger>
                                <SelectContent className="bg-card-color border-border-color">
                                  <SelectItem value="" className="text-font-color hover:bg-body-color">
                                  </SelectItem>
                                  {(cf.list || []).map(item => {
                                    const [val, label] = item.includes('||') ? item.split('||') : [item, item];
                                    return (
                                      <SelectItem key={val} value={val} className="text-font-color hover:bg-body-color">
                                        <span className="whitespace-nowrap">{label}</span>
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
                          State
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.state_province||''} 
                          onChange={e=>setShippingAddress({...shippingAddress,state_province:e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
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
                      <div>
                        <Label className="text-font-color-100 text-sm font-medium flex items-center">
                          Country
                        </Label>
                        <Input 
                          className="h-8 text-sm mt-1" 
                          value={shippingAddress.country||''} 
                          onChange={e=>setShippingAddress({...shippingAddress,country:e.target.value})} 
                        />
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
                <CardTitle className="text-sm font-semibold text-font-color flex items-center gap-1.5">
                  <IconPackage className="w-3.5 h-3.5" />
                  ITEMS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add item…"
                      value={findItemValue}
                      onChange={e=>setFindItemValue(e.target.value)}
                      onKeyDown={e=>{ if (e.key==='Enter') onAddItem() }}
                      className="h-9 text-sm w-48 sm:w-64 md:w-72 lg:w-80 xl:w-96"
                    />
                    <div className="hidden sm:block" />
                    <Tabs value={activeCartTab} onValueChange={v=>setActiveCartTab(v as any)}>
                      <TabsList className="h-9">
                        <TabsTrigger value="auth" className="text-sm px-3">Auth</TabsTrigger>
                        <TabsTrigger value="ship" disabled={!isToShipEnabled} className="text-sm px-3">To Ship</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <div className="flex-1" />
                    <Button variant="outline" size="sm" onClick={()=>setBrowseOpen(true)} className="text-sm px-3 py-2">
                      Browse Items…
                    </Button>
                  </div>

                  {/* Simple table like OrderPoints items */}
                  <div className="border border-border-color rounded-md overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-2 font-medium text-font-color-100">#</th>
                          <th className="text-left p-2 font-medium text-font-color-100">Item # / Description</th>
                          <th className="text-right p-2 font-medium text-font-color-100">Auth Qty</th>
                          <th className="text-right p-2 font-medium text-font-color-100">Ship Qty</th>
                          <th className="text-right p-2 font-medium text-font-color-100">Unit Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {toReceive.map((row, idx) => (
                          <tr key={`auth-${row.item_number}-${row.line_number}`} className="border-t border-border-color hover:bg-body-color/30">
                            <td className="p-2 text-font-color-100">{idx+1}</td>
                            <td className="p-2">
                              <div className="font-medium text-font-color">{row.item_number}</div>
                              <div className="text-[11px] text-font-color-100">{row.description}</div>
                            </td>
                            <td className="p-2 text-right">
                              <Input
                                className="w-20 text-right h-7 text-xs"
                                value={String(row.quantity)}
                                onChange={e=>{
                                  const val = Math.max(0, parseInt(e.target.value || '0', 10));
                                  setToReceive(prev => prev.map(r => r.line_number===row.line_number?{...r, quantity: val}:r));
                                  // If To Ship enabled, sync total quantity per item
                                  const totalForItem = val + prevSumForItem(row.item_number, row.line_number);
                                  if (isToShipEnabled) {
                                    setToShip(prev => {
                                      const idxShip = prev.findIndex(s => s.item_number === row.item_number);
                                      if (idxShip >= 0) {
                                        const clone = [...prev];
                                        clone[idxShip] = { ...clone[idxShip], quantity: totalForItem };
                                        return clone;
                                      }
                                      return prev;
                                    });
                                  }
                                }}
                              />
                            </td>
                            <td className="p-2 text-right text-font-color-100">—</td>
                            <td className="p-2 text-right text-font-color-100">—</td>
                          </tr>
                        ))}
                        {isToShipEnabled && toShip.map((row, idx) => (
                          <tr key={`ship-${row.item_number}-${row.line_number}`} className="border-t border-border-color hover:bg-body-color/30">
                            <td className="p-2 text-font-color-100">{idx+1}</td>
                            <td className="p-2">
                              <div className="font-medium text-font-color">{row.item_number}</div>
                              <div className="text-[11px] text-font-color-100">{row.description}</div>
                            </td>
                            <td className="p-2 text-right text-font-color-100">—</td>
                            <td className="p-2 text-right">
                              <Input
                                className="w-20 text-right h-7 text-xs"
                                value={String(row.quantity)}
                                onChange={e=>{
                                  const val = Math.max(0, parseInt(e.target.value || '0', 10));
                                  setToShip(prev => prev.map(r => r.line_number===row.line_number?{...r, quantity: val}:r));
                                }}
                              />
                            </td>
                            <td className="p-2 text-right">
                              <Input
                                className="w-24 text-right h-7 text-xs"
                                value={String(row.unit_price || '0.00')}
                                onChange={e=>{
                                  const v = e.target.value;
                                  setToShip(prev => prev.map(r => r.line_number===row.line_number?{...r, unit_price: v}:r));
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                    title="Edit"
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
                      title={othersExpanded ? 'Collapse' : 'Expand'}
                    >
                      <IconChevronDown className={`h-3 w-3 transition-transform ${othersExpanded ? 'rotate-180' : ''}`} />
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      className="text-sm px-2 py-1 h-6 text-gray-600 border-gray-300"
                      onClick={openOthersModal}
                      title="Edit"
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

      {/* Browse Items modal (shared behavior with OrderPoints simplified) */}
      <Dialog open={browseOpen} onOpenChange={setBrowseOpen}>
        <DialogContent className="flex flex-col overflow-hidden" style={{ width: '900px', height: '720px', maxWidth: '90vw', maxHeight: '90vh', minWidth: '900px', minHeight: '720px' }}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Browse Items</DialogTitle>
          </DialogHeader>
          <div className="p-2 text-sm">Use OrderPoints browse dialog patterns here; coming soon.</div>
        </DialogContent>
      </Dialog>

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
    </div>
  );

  function prevSumForItem(item_number: string, excludeLine: number) {
    return toReceive.filter(i => i.item_number === item_number && i.line_number !== excludeLine).reduce((s, i) => s + (i.quantity || 0), 0);
  }
}


