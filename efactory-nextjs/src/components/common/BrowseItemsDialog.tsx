import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, ScrollArea } from '@/components/ui';
import { Input, Label, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, CheckBox } from '@/components/ui';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { fetchInventoryForCart } from '@/services/api';
import { returntrakInventoryCache } from '@/services/returntrakInventoryCache';
import { InventoryItemForCartDto } from '@/types/api/orderpoints';

interface BrowseItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItems: (items: InventoryItemForCartDto[]) => void;
  warehouse: string;
  title?: string;
  warningMessage?: string;
  cacheType?: 'auth' | 'ship';
  existingCartItems?: Array<{ item_number: string; quantity: number; voided?: boolean }>;
}

export default function BrowseItemsDialog({
  open,
  onOpenChange,
  onAddItems,
  warehouse,
  title = "Browse Items",
  warningMessage,
  cacheType = 'auth',
  existingCartItems = []
}: BrowseItemsDialogProps) {
  const [inventory, setInventory] = useState<Record<string, InventoryItemForCartDto & { quantity: number; price: number }>>({});
  const [itemFilter, setItemFilter] = useState('');
  const [showZeroQty, setShowZeroQty] = useState(false);
  const [warehouses, setWarehouses] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [browseItemsLoading, setBrowseItemsLoading] = useState(false);
  const [refreshingInventory, setRefreshingInventory] = useState(false);
  const [pageSize] = useState(50);

  // Helper function to get quantity in cart for auth mode
  const getQuantityInCart = (itemNumber: string): number => {
    return existingCartItems
      .filter(item => item.item_number === itemNumber && !item.voided && item.quantity > 0)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // Load inventory when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentPage(1);
      setItemFilter('');
      setInventory({});
      reloadInventory(1, true);
    }
  }, [open, warehouse]);

  // Load inventory when filters change
  useEffect(() => {
    if (open) {
      reloadInventory(1, false);
    }
  }, [itemFilter, showZeroQty, warehouses]);

  const reloadInventory = useCallback(async (page = currentPage, showLoading = false) => {
    if (showLoading) {
      setBrowseItemsLoading(true);
    } else {
      setRefreshingInventory(true);
    }

    try {
      // Use cache for better performance
      const warehouseValue = warehouses || warehouse;
      const hasCache = returntrakInventoryCache.hasValidCache(warehouseValue, cacheType);
      
      let data: InventoryItemForCartDto[];
      
      if (hasCache && !itemFilter && showZeroQty) {
        // Use cached data if no filters applied
        data = returntrakInventoryCache.searchInCache(warehouseValue, '', cacheType);
        setTotalItems(data.length);
      } else {
        // Fetch fresh data from API
        data = await returntrakInventoryCache.getInventoryData(warehouseValue, cacheType, true);
        
        // Apply filters to cached data
        if (itemFilter) {
          data = data.filter(item => 
            item.item_number.toLowerCase().includes(itemFilter.toLowerCase())
          );
        }
        if (!showZeroQty) {
          data = data.filter(item => (item.qty_net || 0) > 0);
        }
        
        setTotalItems(data.length);
      }

      const hash: Record<string, InventoryItemForCartDto & { quantity: number; price: number }> = {};
      data.forEach((item: InventoryItemForCartDto) => {
        hash[item.item_number] = {
          ...item,
          quantity: 0, // Keep as 0 for internal state
          price: 0,
        };
      });

      setInventory(hash);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setBrowseItemsLoading(false);
      setRefreshingInventory(false);
    }
  }, [currentPage, itemFilter, showZeroQty, warehouses, warehouse, pageSize, cacheType]);

  const updateInventoryField = (itemNumber: string, field: 'quantity' | 'price', value: string) => {
    // For quantity field, only allow digits (no decimals, no negative signs)
    if (field === 'quantity') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/[^0-9]/g, '');
      setInventory(prev => ({
        ...prev,
        [itemNumber]: {
          ...prev[itemNumber],
          [field]: parseInt(digitsOnly) || 0,
        } as InventoryItemForCartDto & { quantity: number; price: number }
      }));
    } else {
      // For price field, allow decimals
      setInventory(prev => ({
        ...prev,
        [itemNumber]: {
          ...prev[itemNumber],
          [field]: parseFloat(value) || 0,
        } as InventoryItemForCartDto & { quantity: number; price: number }
      }));
    }
  };

  const addSelectedItemsToOrder = () => {
    const selectedItems = Object.values(inventory).filter(item => 
      item.quantity > 0 && item.price >= 0
    );
    
    if (selectedItems.length > 0) {
      onAddItems(selectedItems);
      onOpenChange(false);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(Math.ceil(totalItems / pageSize), prev + 1));
  const goToLastPage = () => setCurrentPage(Math.ceil(totalItems / pageSize));

  const getWarehouseOptions = () => {
    // This should be passed as a prop or loaded from context
    return [
      { value: '', label: 'Warehouse: All' },
      { value: 'warehouse1', label: 'Warehouse 1' },
      { value: 'warehouse2', label: 'Warehouse 2' },
    ];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col overflow-hidden" style={{ 
        width: '900px', 
        height: '720px', 
        maxWidth: '90vw', 
        maxHeight: '90vh', 
        minWidth: '900px', 
        minHeight: '720px' 
      }}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
          {warningMessage && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mt-2">
              <p className="text-sm text-orange-800">
                <strong>Warning:</strong> {warningMessage}
              </p>
            </div>
          )}
        </DialogHeader>
        
        {/* Filters */}
        <div className="flex items-center justify-between gap-3 mb-3 flex-shrink-0">
          <Input
            placeholder="Search by item # or description"
            value={itemFilter}
            onChange={e => setItemFilter(e.target.value)}
            className="w-48 h-9 text-sm"
          />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-font-color whitespace-nowrap">
              <CheckBox checked={showZeroQty} onChange={(checked) => setShowZeroQty(checked)} />
              Show 0 QTY
            </label>
            <Select value={warehouses} onValueChange={setWarehouses}>
              <SelectTrigger className={`h-8 text-sm mt-1 ${warehouses ? 'font-medium' : ''}`} style={{ width: '200px' }}>
                <SelectValue placeholder="Warehouse: All" />
              </SelectTrigger>
              <SelectContent className="bg-card-color border-border-color" style={{ width: '200px' }}>
                <SelectItem value="" className="text-font-color hover:bg-body-color">
                  Warehouse: All
                </SelectItem>
                {getWarehouseOptions().map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-font-color hover:bg-body-color">
                    <span className="whitespace-nowrap">{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              className="bg-primary text-white hover:bg-primary/90 whitespace-nowrap"
              onClick={() => reloadInventory(1, true)}
              disabled={refreshingInventory}
            >
              {refreshingInventory ? (
                <div className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  <span>Refreshing...</span>
                </div>
              ) : (
                'Refresh'
              )}
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
                  {cacheType === 'auth' ? (
                    <>
                      <th className="text-right py-1 px-3 text-font-color-100 w-20">In Cart</th>
                      <th className="text-right py-1 px-3 text-font-color-100 w-20">Add Qty</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right py-1 px-3 text-font-color-100 w-20">Qty</th>
                      <th className="text-right py-1 px-3 text-font-color-100 w-24">Unit Price</th>
                      <th className="text-right py-1 px-3 text-font-color-100 whitespace-nowrap w-20">Net Avail</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {browseItemsLoading ? (
                  <tr>
                    <td colSpan={cacheType === 'auth' ? 4 : 5} className="p-8 text-center text-font-color-100">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                        <div>Loading items...</div>
                      </div>
                    </td>
                  </tr>
                ) : Object.keys(inventory).length === 0 ? (
                  <tr>
                    <td colSpan={cacheType === 'auth' ? 4 : 5} className="p-8 text-center text-font-color-100">
                      <div className="text-lg mb-2">No items found</div>
                      <div className="text-sm">Try adjusting your search criteria or filters</div>
                    </td>
                  </tr>
                ) : (
                  Object.keys(inventory).map((key, idx) => {
                    const it = inventory[key]!;
                    const quantityInCart = getQuantityInCart(it.item_number);
                    const isBold = (it.quantity > 0) || (cacheType === 'auth' && quantityInCart > 0);
                    
                    return (
                      <tr key={key} className="border-t border-border-color hover:bg-body-color">
                        <td className="py-1 px-3 text-font-color w-12">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="py-1 px-3 w-64">
                          <div className={`truncate ${isBold ? 'font-bold' : 'font-medium'} text-font-color`} title={it.item_number}>{it.item_number}</div>
                          <div className="text-primary text-sm truncate" title={it.description}>{it.description}</div>
                        </td>
                        {cacheType === 'auth' ? (
                          <>
                            <td className="py-1 px-3 text-right w-20">
                              <div className="text-right text-font-color text-xs h-8 flex items-center justify-end">
                                {quantityInCart > 0 ? String(quantityInCart) : ''}
                              </div>
                            </td>
                            <td className="py-1 px-3 text-right w-20">
                              <Input
                                value={it.quantity > 0 ? String(it.quantity) : ''}
                                onChange={e => updateInventoryField(it.item_number, 'quantity', e.target.value)}
                                className="text-right bg-card-color border-border-color text-font-color w-full h-8 text-xs"
                                type="number"
                                min="0"
                                placeholder=""
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-1 px-3 text-right w-20">
                              <Input
                                value={it.quantity > 0 ? String(it.quantity) : ''}
                                onChange={e => updateInventoryField(it.item_number, 'quantity', e.target.value)}
                                className="text-right bg-card-color border-border-color text-font-color w-full h-8 text-xs"
                                type="number"
                                min="0"
                                placeholder=""
                              />
                            </td>
                            <td className="py-1 px-3 text-right w-24">
                              <Input
                                value={it.price > 0 ? String(it.price) : ''}
                                onChange={e => updateInventoryField(it.item_number, 'price', e.target.value)}
                                className="text-right bg-card-color border-border-color text-font-color w-full h-8 text-xs"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder=""
                              />
                            </td>
                            <td className="py-1 px-3 text-right text-font-color font-mono whitespace-nowrap w-20">{it.qty_net}</td>
                          </>
                        )}
                      </tr>
                    );
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={addSelectedItemsToOrder}
            >
              Add Selected Items
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
