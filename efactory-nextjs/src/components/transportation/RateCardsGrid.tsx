import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ArrowDownTrayIcon, TruckIcon } from '@heroicons/react/24/outline';
import { readRateCards, exportRateCards } from '@/services/api';
import type { RateCardRowDto } from '@/types/api/transportation';
import GridSingleSelectFilter from '@/components/filters/grid/GridSingleSelectFilter';
import type { DropdownFilterConfig } from '@/types/api/filters';

// Carrier color themes
const CARRIER_THEMES = {
  'UPS': {
    primary: '#FF6600',
    light: '#FFF4F0',
    dark: '#E55A00',
    accent: '#FF8533',
  },
  'FEDEX': {
    primary: '#4B0082',
    light: '#F3F0FF',
    dark: '#3D0066',
    accent: '#6B1A99',
  },
  'DHL': {
    primary: '#D40511',
    light: '#FFF0F0',
    dark: '#B0040E',
    accent: '#E61A1F',
  },
  'USPS': {
    primary: '#004B87',
    light: '#F0F4F8',
    dark: '#003A6B',
    accent: '#1A5F99',
  },
  'APC': {
    primary: '#00A651',
    light: '#F0F9F4',
    dark: '#008A42',
    accent: '#1AB866',
  },
  'SELECTSHIP': {
    primary: '#FF6B35',
    light: '#FFF4F0',
    dark: '#E55A2B',
    accent: '#FF7A4A',
  },
  'DEFAULT': {
    primary: '#6B7280',
    light: '#F9FAFB',
    dark: '#4B5563',
    accent: '#9CA3AF',
  },
};

// Filter configurations for Luno components
const CARRIER_FILTER_CONFIG: DropdownFilterConfig = {
  field: 'carrier',
  title: 'Carrier',
  type: 'DROPDOWN_QF',
  singleSelect: true,
  options: [
    { key: 'UPS', value: 'UPS', oper: '=' as const },
    { key: 'FedEx', value: 'FEDEX', oper: '=' as const },
    { key: 'DHL', value: 'DHL', oper: '=' as const },
    { key: 'USPS', value: 'USPS', oper: '=' as const },
    { key: 'Passport', value: 'APC', oper: '=' as const },
    { key: 'SelectShip', value: 'SELECTSHIP', oper: '=' as const },
  ],
  width: '140px'
};

const REGION_FILTER_CONFIG: DropdownFilterConfig = {
  field: 'region',
  title: 'Region',
  type: 'DROPDOWN_QF',
  singleSelect: true,
  options: [
    { key: 'FR', value: 'FR', oper: '=' as const },
    { key: 'LA', value: 'LA', oper: '=' as const },
    { key: 'LN', value: 'LN', oper: '=' as const },
    { key: 'YK', value: 'YK', oper: '=' as const },
  ],
  width: '100px'
};

interface RateCardsGridProps {
  className?: string;
  style?: React.CSSProperties;
}

interface RateGridRow {
  weight: number;
  rates: { [zone: string]: number };
}

export default function RateCardsGrid({ className = '', style }: RateCardsGridProps) {
  const [carrier, setCarrier] = useState('UPS');
  const [region, setRegion] = useState('FR');
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [services, setServices] = useState<string[]>([]);
  const [rateData, setRateData] = useState<RateCardRowDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gridData, setGridData] = useState<RateGridRow[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [surcharges, setSurcharges] = useState<{
    sc_g: number;
    sc_a: number;
    sc_sr: number;
    sc_asr: number;
  } | null>(null);
  const [effectiveDate, setEffectiveDate] = useState<string>('');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  
  // Active carrier for theming (only changes when data is fetched)
  const [activeCarrier, setActiveCarrier] = useState('UPS');

  // Get carrier theme (based on active carrier, not filter carrier)
  const carrierTheme = CARRIER_THEMES[activeCarrier as keyof typeof CARRIER_THEMES] || CARRIER_THEMES.DEFAULT;

  // Fetch rate cards data
  const fetchRateCards = useCallback(async () => {
    if (!carrier || !region) return;

    setLoading(true);
    setError(null);
    try {
      const filter = {
        and: [
          { field: 'carrier', oper: '=', value: carrier },
          { field: 'region', oper: '=', value: region },
        ],
      };

       const data = await readRateCards(filter);
       setRateData(data);
       setHasData(data.length > 0);

       if (data.length > 0) {
         // Update active carrier for theming (only when data is successfully fetched)
         setActiveCarrier(carrier);
         
         // Extract unique services
         const uniqueServices = [...new Set(data.map(row => row.service))];
         setServices(uniqueServices);
         setSelectedServiceIndex(0); // Select first service by default

         // Set surcharges from first row
         const firstRow = data[0];
         if (firstRow) {
           setSurcharges({
             sc_g: firstRow.sc_g || 0,
             sc_a: firstRow.sc_a || 0,
             sc_sr: firstRow.sc_sr || 0,
             sc_asr: firstRow.sc_asr || 0,
           });
         }

         // Set effective date based on carrier
         const effectiveDates: { [key: string]: string } = {
           'USPS': '1/19/2025',
           'DHL GLOBAL MAIL': '1/19/2025',
           'APC': '1/5/2025',
           'SELECTSHIP': '07/01/2025',
           'FEDEX': '1/6/2025',
         };
         setEffectiveDate(effectiveDates[carrier] || '12/23/2024');
       } else {
         setError('No rate data found for the selected carrier and region combination.');
       }
    } catch (error) {
      console.error('Error fetching rate cards:', error);
      setError('Failed to fetch rate data. Please try again.');
      setHasData(false);
    } finally {
      setLoading(false);
    }
  }, [carrier, region]);

  // Process data for grid display
  useEffect(() => {
    if (!hasData || services.length === 0) {
      setGridData([]);
      setZones([]);
      return;
    }

    // Get selected service
    const selectedService = services[selectedServiceIndex];
    if (!selectedService) {
      setGridData([]);
      setZones([]);
      return;
    }

    // Filter data by selected service
    const filteredData = rateData.filter(row => row.service === selectedService);
    
    if (filteredData.length === 0) {
      setGridData([]);
      setZones([]);
      return;
    }

    // Get unique zones and weights (following legacy logic)
    const uniqueZones = [...new Set(filteredData.map(row => {
      if (row.zone !== undefined) return String(row.zone);
      return null;
    }))]
      .filter(zone => zone !== null && zone !== 'null' && zone !== 'undefined')
      .sort((a, b) => {
        const numA = Number(a);
        const numB = Number(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a!.localeCompare(b!);
      });

    const uniqueWeights = [...new Set(filteredData.map(row => {
      if (row.weight_limit !== undefined) return row.weight_limit;
      return null;
    }))]
      .filter(weight => weight !== null && weight > 0)
      .sort((a, b) => a! - b!);

    setZones(uniqueZones as string[]);

    // Create grid data (following legacy logic)
    const gridRows: RateGridRow[] = [];
    
    uniqueWeights.forEach(weight => {
      const rates: { [zone: string]: number } = {};
      uniqueZones.forEach(zone => {
        if (zone) {
          const cell = filteredData.find(row => 
            row.weight_limit === weight && String(row.zone) === zone
          );
          rates[zone] = cell?.book_rate || 0;
        }
      });
      gridRows.push({ weight: weight!, rates });
    });

    setGridData(gridRows);
  }, [rateData, selectedServiceIndex, services, hasData]);

  // Handle service selection
  const handleServiceSelect = (serviceIndex: number) => {
    setSelectedServiceIndex(serviceIndex);
  };

  // Handle row selection
  const handleRowSelect = (rowIndex: number) => {
    setSelectedRowIndex(selectedRowIndex === rowIndex ? null : rowIndex);
  };

  // Handle export
  const handleExport = async () => {
    if (!carrier || !region) return;

    try {
      const filter = {
        and: [
          { field: 'carrier', oper: '=', value: carrier },
          { field: 'region', oper: '=', value: region },
        ],
      };

      await exportRateCards(filter, 'excel_rate_cards');
    } catch (error) {
      console.error('Error exporting rate cards:', error);
    }
  };

  // Custom grid scroll handlers
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [gridHeight, setGridHeight] = useState(400);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollPosition({ x: target.scrollLeft, y: target.scrollTop });
    
    // Sync header horizontal scroll with body
    if (headerRef.current) {
      headerRef.current.scrollLeft = target.scrollLeft;
    }
  }, []);

  // Enhanced height calculation based on actual grid position
  const calculateGridHeight = useCallback(() => {
    // Only apply height restrictions if browser height > 400px
    if (window.innerHeight <= 400) {
      setGridHeight(0); // No height restriction if browser too small
      return;
    }

    if (gridContainerRef.current) {
      // Get the actual position of the grid container
      const gridRect = gridContainerRef.current.getBoundingClientRect();
      const gridTop = gridRect.top;
      
      // Calculate available height from grid position to bottom of viewport
      const availableHeight = window.innerHeight - gridTop - 20; // 20px buffer for scrollbar visibility
      
      // Ensure minimum height of 200px for usability
      const finalHeight = Math.max(200, availableHeight);
      
      setGridHeight(finalHeight);
    }
  }, []);

  // Dynamic height calculation with proper positioning
  useEffect(() => {
    // Calculate height after component mounts and data loads
    const timeoutId = setTimeout(calculateGridHeight, 100);
    
    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      setTimeout(calculateGridHeight, 50);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [calculateGridHeight, hasData, zones.length, services.length]);

  // Use ResizeObserver to detect content changes that affect grid position
  useEffect(() => {
    if (!topSectionRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // Recalculate height when top section content changes (e.g., text wrapping)
      setTimeout(calculateGridHeight, 50);
    });

    resizeObserver.observe(topSectionRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateGridHeight]);

  return (
    <div className={`w-full ${className}`} style={style}>
      {/* Ultra-Compact Header */}
      <div ref={topSectionRef} className="bg-card-color border border-border-color rounded-t-lg shadow-sm">
        {/* Single Row Header with Everything */}
        <div className="px-3 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Left: Title + Carrier Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-1.5">
                <div className="p-1 rounded" style={{ backgroundColor: carrierTheme.light }}>
                  <TruckIcon className="h-4 w-4" style={{ color: carrierTheme.primary }} />
                </div>
                <h1 className="text-lg font-bold text-font-color">Rate Cards</h1>
              </div>

              {/* Carrier Info - Compact */}
              {hasData && (
                <div className="flex items-center gap-2 px-2 py-1 rounded border bg-body-color" style={{ borderColor: carrierTheme.primary + '40' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: carrierTheme.primary }} />
                  <span className="text-xs font-semibold text-font-color">
                    {activeCarrier === 'APC' ? 'Passport' : activeCarrier} - {region}
                  </span>
                  <span className="text-xs text-font-color-100">
                    {zones.length}z • {gridData.length}w
                  </span>
                </div>
              )}
            </div>

            {/* Right: Filters + Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <label className="text-xs text-font-color-100">Carrier:</label>
                  <GridSingleSelectFilter
                    config={CARRIER_FILTER_CONFIG}
                    value={carrier}
                    onChange={setCarrier}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-xs text-font-color-100">Region:</label>
                  <GridSingleSelectFilter
                    config={REGION_FILTER_CONFIG}
                    value={region}
                    onChange={setRegion}
                  />
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="w-px h-4 bg-border-color"></div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={fetchRateCards}
                  disabled={loading}
                  className="btn btn-primary flex items-center space-x-1 px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: carrierTheme.primary,
                    borderColor: carrierTheme.primary,
                    fontSize: '12px',
                    padding: '4px 8px'
                  }}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                  ) : (
                    <TruckIcon className="h-3 w-3" />
                  )}
                  <span>Get Rates</span>
                </button>
                
                {hasData && (
                  <button
                    onClick={handleExport}
                    disabled={loading}
                    className="btn btn-outline-secondary flex items-center space-x-1 px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Export to Excel"
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  >
                    <ArrowDownTrayIcon className="h-3 w-3" />
                    <span>Export</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Information Panel */}
        {hasData && (
          <div className="px-3 py-2 border-t border-border-color">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {/* Delivery Surcharges - Compact */}
              <div className="bg-body-color p-2 rounded border border-border-color">
                <div className="text-xs font-semibold text-font-color-100 mb-1">Delivery Surcharges</div>
                {surcharges && (
                  <div className="text-xs space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-font-color">Ground Res:</span>
                      <span className="font-semibold text-font-color">${surcharges.sc_g.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-font-color">Air Res:</span>
                      <span className="font-semibold text-font-color">${surcharges.sc_a.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-font-color">Signature:</span>
                      <span className="font-semibold text-font-color">${surcharges.sc_sr.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-font-color">Adult Sig:</span>
                      <span className="font-semibold text-font-color">${surcharges.sc_asr.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                {carrier !== 'USPS' && (
                  <div className="text-xs text-font-color-100 italic mt-1">
                    <sup className="text-red-500">*</sup> Rates include fuel surcharges
                  </div>
                )}
              </div>

              {/* Important Note - Compact */}
              <div className="bg-body-color p-2 rounded border border-border-color">
                <div className="text-xs font-semibold text-font-color-100 mb-1">Important Note</div>
                <div className="text-xs text-font-color-100 leading-tight">
                  Net rate tables are estimates only. Excludes most surcharges except fuel where applicable (signature, residential, delivery area, etc.). Surcharges may change per carrier discretion. Fuel changes weekly.
                </div>
              </div>

              {/* Legal Disclaimer - Compact */}
              <div className="bg-body-color p-2 rounded border border-border-color">
                <div className="text-xs font-semibold text-font-color-100 mb-1">Legal Disclaimer</div>
                <div className="text-xs text-font-color-100 leading-tight">
                  Data provided "as is" without warranty. No guarantee of accuracy, completeness, or reliability. DCL disclaims all warranties and liability for direct, indirect, or consequential damages from data use or misuse.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compact Service Type Filter Buttons */}
        {services.length > 0 && (
          <div className="px-3 py-1 border-t border-border-color">
            <div className="flex items-center gap-2">
              <span className="text-xs text-font-color-100">Service:</span>
              <div className="flex flex-wrap gap-1">
                {services.map((service, index) => (
                  <button
                    key={service}
                    onClick={() => handleServiceSelect(index)}
                    className={`btn transition-all duration-200 font-medium text-xs ${
                      selectedServiceIndex === index
                        ? 'text-white shadow-sm'
                        : 'btn-outline-secondary text-font-color-100 hover:text-font-color hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: selectedServiceIndex === index ? carrierTheme.primary : undefined,
                      borderColor: selectedServiceIndex === index ? carrierTheme.primary : undefined,
                      boxShadow: selectedServiceIndex === index ? `0 1px 4px ${carrierTheme.primary}30` : undefined,
                      padding: '2px 6px',
                      fontSize: '11px',
                      lineHeight: '14px'
                    }}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Data Grid Container */}
      <div className="bg-card-color border-l border-r border-b border-border-color rounded-b-lg">
        {!hasData ? (
          // Enhanced Empty State with Professional Design
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-32 h-32 mb-8 rounded-2xl flex items-center justify-center shadow-lg" 
                 style={{ 
                   backgroundColor: carrierTheme.light,
                   border: `2px solid ${carrierTheme.primary}20`
                 }}>
              <TruckIcon className="h-16 w-16" style={{ color: carrierTheme.primary }} />
            </div>
            {error ? (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-red-600 mb-3">Unable to Load Rate Data</h3>
                  <p className="text-font-color-100 text-lg max-w-lg leading-relaxed">
                    {error}
                  </p>
                </div>
                <button
                  onClick={fetchRateCards}
                  className="btn btn-primary px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{ 
                    backgroundColor: carrierTheme.primary,
                    borderColor: carrierTheme.primary,
                    boxShadow: `0 4px 12px ${carrierTheme.primary}30`
                  }}
                >
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Try Again
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-font-color mb-2">Ready to Load Rate Data</h3>
                  <p className="text-font-color-100 text-sm max-w-lg leading-relaxed">
                    Select a carrier and region above, then click "Get Rates" to view comprehensive shipping rate information.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-font-color-100 bg-card-color px-4 py-2 rounded-lg shadow-sm border border-border-color">
                  <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: carrierTheme.primary }} />
                  <span>Ready to fetch <strong className="text-font-color">{carrier}</strong> rates for <strong className="text-font-color">{region}</strong></span>
                </div>
              </>
            )}
          </div>
        ) : (
          // Custom Data Grid
          <div className="w-full relative">
            {loading && (
              <div className="absolute inset-0 bg-card-color bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="flex flex-col items-center space-y-4 p-8 bg-card-color rounded-xl shadow-lg border border-border-color">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-t-transparent" 
                       style={{ borderColor: `${carrierTheme.primary}30`, borderTopColor: carrierTheme.primary }} />
                  <div className="text-base font-medium text-font-color">Loading rate data...</div>
                  <div className="text-sm text-font-color-100">Fetching {carrier} rates for {region}</div>
                </div>
              </div>
            )}
            
             {/* Custom Grid with Proper Fixed Column */}
             <div className="relative">
               {/* Enhanced Professional Header */}
               <div className="shadow-lg">
                 {/* Title Row with Gradient - Compact */}
                 <div 
                   className="flex items-center px-4 py-2 text-white shadow-sm"
                   style={{ 
                     background: `linear-gradient(135deg, ${carrierTheme.primary} 0%, ${carrierTheme.dark} 100%)`,
                     borderBottom: `1px solid ${carrierTheme.primary}40`
                   }}
                 >
                   <div className="w-32 flex-shrink-0">
                     <div className="text-sm font-bold tracking-wide">Customer Rate</div>
                   </div>
                   <div className="flex-1 text-center">
                     <div className="text-base font-bold tracking-wide">Zones</div>
                     <div className="text-xs opacity-90 mt-0.5">
                       {activeCarrier === 'APC' ? 'Passport' : activeCarrier} • {region} • {services[selectedServiceIndex] || 'All Services'}
                     </div>
                   </div>
                 </div>
                 
                 {/* Zone Headers Row - Compact */}
                 <div 
                   className="flex shadow-sm"
                   style={{ 
                     backgroundColor: carrierTheme.accent,
                     borderBottom: `2px solid ${carrierTheme.primary}`
                   }}
                 >
                   <div 
                     className="w-32 flex-shrink-0 px-4 py-2 text-white border-r-2 bg-gradient-to-r from-transparent to-black/10"
                     style={{ borderRightColor: carrierTheme.primary }}
                   >
                     <div className="text-xs font-bold uppercase tracking-wider">Weight</div>
                     <div className="text-xs opacity-80">(lbs)</div>
                   </div>
                   <div 
                     ref={headerRef}
                     className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
                     style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                   >
                     <div className="flex min-w-max">
                       {zones.map((zone, index) => (
                         <div 
                           key={zone}
                           className="flex-1 min-w-[90px] px-2 py-2 text-center text-white border-r"
                           style={{ 
                             borderRightColor: 'rgba(255, 255, 255, 0.15)',
                             background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                           }}
                         >
                           <div className="text-xs font-bold uppercase tracking-wider">Zone {zone}</div>
                           <div className="text-xs opacity-80">Rate</div>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Enhanced Grid Body with Professional Styling */}
               <div 
                 ref={gridContainerRef}
                 className="overflow-auto relative bg-card-color"
                 style={gridHeight > 0 ? { 
                   height: `${gridHeight}px`,
                   maxHeight: `${gridHeight}px`
                 } : { 
                   overflowY: 'visible',
                   maxHeight: 'none'
                 }}
                 onScroll={handleScroll}
               >
                 <div className="flex pb-6">
                   {/* Enhanced Fixed Weight Column */}
                   <div 
                     className="w-32 flex-shrink-0 sticky left-0 z-20"
                     style={{ 
                       backgroundColor: 'var(--card-color)',
                       boxShadow: '3px 0 8px rgba(0, 0, 0, 0.08)',
                       borderRight: `2px solid ${carrierTheme.primary}20`
                     }}
                   >
                     {gridData.map((row, rowIndex) => (
                       <div 
                         key={row.weight}
                         onClick={() => handleRowSelect(rowIndex)}
                         className={`px-4 py-2 font-bold cursor-pointer transition-all duration-200 border-b border-border-color ${
                           selectedRowIndex === rowIndex 
                             ? 'text-white shadow-md' 
                             : 'text-font-color hover:bg-background-color hover:text-font-color'
                         }`}
                         style={{ 
                           height: '36px',
                           display: 'flex',
                           alignItems: 'center',
                           backgroundColor: selectedRowIndex === rowIndex ? carrierTheme.primary : 'var(--card-color)',
                           borderLeft: selectedRowIndex === rowIndex ? `3px solid ${carrierTheme.dark}` : '3px solid transparent',
                         }}
                       >
                           <span className="text-sm">{row.weight}</span>
                       </div>
                     ))}
                   </div>

                   {/* Enhanced Scrollable Rate Columns */}
                   <div className="flex-1 min-w-max">
                     {gridData.map((row, rowIndex) => (
                       <div 
                         key={row.weight}
                         onClick={() => handleRowSelect(rowIndex)}
                         className={`flex cursor-pointer transition-all duration-200 border-b border-border-color ${
                           selectedRowIndex === rowIndex 
                             ? 'shadow-sm' 
                             : 'hover:bg-background-color'
                         }`}
                         style={{ 
                           height: '36px',
                           alignItems: 'center',
                           backgroundColor: selectedRowIndex === rowIndex 
                             ? `${carrierTheme.primary}10` 
                             : (rowIndex % 2 === 1 ? 'var(--background-color)' : 'var(--card-color)')
                         }}
                       >
                         {zones.map((zone, zoneIndex) => (
                           <div 
                             key={zone}
                             className={`flex-1 min-w-[90px] px-2 py-2 text-center border-r border-border-color ${
                               selectedRowIndex === rowIndex ? 'font-semibold' : 'font-medium'
                             }`}
                             style={{ 
                               height: '36px',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               background: zoneIndex % 2 === 0 ? 'rgba(0, 0, 0, 0.01)' : 'transparent'
                             }}
                           >
                             {row.rates[zone] && row.rates[zone] > 0 ? (
                               <div className="flex flex-col items-center">
                                 <span className={`text-sm ${selectedRowIndex === rowIndex ? 'text-font-color' : 'text-font-color'}`}>
                                   {row.rates[zone].toFixed(2)}
                                 </span>
                                 {selectedRowIndex === rowIndex && (
                                   <span className="text-xs text-font-color-100">Zone {zone}</span>
                                 )}
                               </div>
                             ) : (
                               <span className="text-font-color-100 text-xs">—</span>
                             )}
                           </div>
                         ))}
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>

    </div>
  );
}
