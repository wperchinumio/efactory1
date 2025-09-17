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
   const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

   const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
     const target = e.target as HTMLDivElement;
     setScrollPosition({ x: target.scrollLeft, y: target.scrollTop });
     
     // Sync header horizontal scroll with body
     if (headerRef.current) {
       headerRef.current.scrollLeft = target.scrollLeft;
     }
   }, []);

  // Get grid height from style prop or default
  const gridHeight = (style as any)?.['--grid-height'] || '500px';

  return (
    <div className={`w-full ${className}`} style={style}>
      {/* Header with filters */}
      <div className="bg-card-color border border-border-color rounded-t-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TruckIcon className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold text-font-color">Rate Cards</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-end space-x-3 mb-4">
          {/* Carrier Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-font-color-100 mb-1 uppercase tracking-wide">Carrier</label>
            <GridSingleSelectFilter
              config={CARRIER_FILTER_CONFIG}
              value={carrier}
              onChange={setCarrier}
            />
          </div>

          {/* Region Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-font-color-100 mb-1 uppercase tracking-wide">Region</label>
            <GridSingleSelectFilter
              config={REGION_FILTER_CONFIG}
              value={region}
              onChange={setRegion}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchRateCards}
              disabled={loading}
              className="btn btn-primary flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: carrierTheme.primary }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
              ) : (
                <TruckIcon className="h-3 w-3" />
              )}
              <span>Get Rates</span>
            </button>

            <button
              onClick={handleExport}
              disabled={!hasData || loading}
              className="btn btn-outline-secondary p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Current Selection Info */}
        {hasData && (
          <div className="mb-4 p-3 rounded-md border" style={{ backgroundColor: carrierTheme.light, borderColor: carrierTheme.primary + '20' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: carrierTheme.primary }} />
                   <span className="text-sm font-medium text-font-color">
                     {activeCarrier === 'APC' ? 'Passport' : activeCarrier} - {region}
                   </span>
                </div>
                <div className="text-xs text-font-color-100">
                  {zones.length} zones • {gridData.length} weight tiers
                </div>
              </div>
              <div className="text-xs text-font-color-100">
                Effective: {effectiveDate}
              </div>
            </div>
          </div>
        )}

        {/* Service Type Filter Buttons */}
        {services.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-font-color-100 mb-2 uppercase tracking-wide">Service Types</div>
            <div className="flex flex-wrap gap-1.5">
              {services.map((service, index) => (
                <button
                  key={service}
                  onClick={() => handleServiceSelect(index)}
                  className={`btn btn-sm transition-all duration-200 ${
                    selectedServiceIndex === index
                      ? 'btn-primary text-white'
                      : 'btn-outline-secondary text-font-color-100 hover:text-font-color'
                  }`}
                  style={{
                    backgroundColor: selectedServiceIndex === index ? carrierTheme.primary : undefined,
                    borderColor: selectedServiceIndex === index ? carrierTheme.primary : undefined,
                  }}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Data Grid Container */}
      <div className="bg-card-color border-l border-r border-border-color">
        {!hasData ? (
          // Beautiful Placeholder or Error State
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-24 h-24 mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: carrierTheme.light }}>
              <TruckIcon className="h-12 w-12" style={{ color: carrierTheme.primary }} />
            </div>
            {error ? (
              <>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h3>
                <p className="text-font-color-100 text-center max-w-md mb-4">
                  {error}
                </p>
                <button
                  onClick={fetchRateCards}
                  className="btn btn-primary"
                  style={{ backgroundColor: carrierTheme.primary }}
                >
                  Try Again
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-font-color mb-2">No Rate Data Available</h3>
                <p className="text-font-color-100 text-center max-w-md">
                  Select a carrier and region, then click "Get Rates" to view shipping rate information.
                </p>
                <div className="mt-6 flex items-center space-x-2 text-sm text-font-color-100">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: carrierTheme.primary }} />
                  <span>Ready to fetch {carrier} rates for {region}</span>
                </div>
              </>
            )}
          </div>
        ) : (
          // Custom Data Grid
          <div className="w-full relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                  <div className="text-sm text-font-color-100">Loading rate data...</div>
                </div>
              </div>
            )}
            
             {/* Custom Grid with Proper Fixed Column */}
             <div className="relative">
               {/* Fixed Header */}
               <div className="sticky top-0 z-20">
                 {/* Title Row */}
                 <div 
                   className="flex items-center px-4 py-2 text-sm font-medium text-white"
                   style={{ backgroundColor: carrierTheme.primary }}
                 >
                   <div className="w-32 flex-shrink-0">
                     <i>Customer Rate</i>
                   </div>
                   <div className="flex-1 text-center">
                     <i>Zones</i> 
                     <span className="ml-2">
                       [Carrier: <b>{activeCarrier === 'APC' ? 'Passport' : activeCarrier}</b> - Region: <b>{region}</b>]
                     </span>
                   </div>
                 </div>
                 
                 {/* Zone Headers Row */}
                 <div 
                   className="flex"
                   style={{ backgroundColor: carrierTheme.accent }}
                 >
                   <div 
                     className="w-32 flex-shrink-0 px-4 py-3 text-sm font-semibold text-white border-r-2"
                     style={{ borderRightColor: carrierTheme.primary }}
                   >
                     Weight (lbs)
                   </div>
                   <div 
                     ref={headerRef}
                     className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
                     style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                   >
                     <div className="flex min-w-max">
                       {zones.map((zone) => (
                         <div 
                           key={zone}
                           className="flex-1 min-w-[100px] px-2 py-3 text-center text-sm font-semibold text-white border-r border-white"
                           style={{ borderRightColor: 'rgba(255, 255, 255, 0.2)' }}
                         >
                           {zone}
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Grid Body with Fixed Column */}
               <div 
                 ref={gridRef}
                 className="overflow-auto relative"
                 style={{ height: gridHeight }}
                 onScroll={handleScroll}
               >
                 <div className="flex">
                   {/* Fixed Weight Column */}
                   <div 
                     className="w-32 flex-shrink-0 sticky left-0 z-30"
                     style={{ 
                       backgroundColor: 'var(--card-color)',
                       border: 'none !important',
                       outline: 'none !important',
                       boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)'
                     }}
                   >
                     {gridData.map((row, rowIndex) => (
                       <div 
                         key={row.weight}
                         onClick={() => handleRowSelect(rowIndex)}
                         className={`px-4 py-3 text-sm font-semibold cursor-pointer transition-colors duration-200 group ${
                           selectedRowIndex === rowIndex 
                             ? 'bg-primary/20 text-font-color border-l-4 border-primary' 
                             : 'bg-card-color text-font-color group-hover:bg-background-color group-hover:text-font-color'
                         }`}
                         style={{ 
                           height: '48px',
                           display: 'flex',
                           alignItems: 'center',
                           border: 'none !important',
                           outline: 'none !important',
                           borderTop: 'none !important',
                           borderBottom: 'none !important',
                           borderLeft: 'none !important',
                           borderRight: 'none !important',
                           margin: '0',
                           boxSizing: 'border-box'
                         }}
                       >
                         {row.weight}
                       </div>
                     ))}
                   </div>

                   {/* Scrollable Rate Columns */}
                   <div className="flex-1 min-w-max">
                     {gridData.map((row, rowIndex) => (
                       <div 
                         key={row.weight}
                         onClick={() => handleRowSelect(rowIndex)}
                         className={`flex cursor-pointer transition-colors duration-200 group ${
                           selectedRowIndex === rowIndex 
                             ? 'bg-primary/20 text-font-color' 
                             : (rowIndex % 2 === 1 ? 'bg-background-color text-font-color group-hover:bg-background-color/80 group-hover:text-font-color' : 'bg-card-color text-font-color group-hover:bg-background-color group-hover:text-font-color')
                         }`}
                         style={{ 
                           height: '48px',
                           alignItems: 'center'
                         }}
                       >
                         {zones.map((zone) => (
                           <div 
                             key={zone}
                             className={`flex-1 min-w-[100px] px-2 py-3 text-center text-sm font-medium border-r border-border-color ${
                               selectedRowIndex === rowIndex 
                                 ? 'bg-primary/20 text-font-color' 
                                 : (rowIndex % 2 === 1 ? 'bg-background-color text-font-color group-hover:bg-background-color/80 group-hover:text-font-color' : 'bg-card-color text-font-color group-hover:bg-background-color group-hover:text-font-color')
                             }`}
                             style={{ 
                               height: '48px',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center'
                             }}
                           >
                             {row.rates[zone] && row.rates[zone] > 0 ? `$${row.rates[zone].toFixed(2)}` : ''}
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

      {/* Disclosure Section */}
      {hasData && (
        <div className="bg-card-color border border-border-color rounded-b-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Effective Date & Surcharges */}
            <div className="space-y-4">
              {effectiveDate && (
                <div>
                  <div className="text-sm font-medium text-font-color-100 mb-2">Effective Date:</div>
                  <div className="text-sm text-font-color">
                    {effectiveDate}
                    {carrier !== 'USPS' && <sup className="text-xs"> *</sup>}
                  </div>
                </div>
              )}

              {surcharges && (
                <div>
                  <div className="text-sm font-medium text-font-color-100 mb-2">Delivery Surcharges:</div>
                  <div className="space-y-1 text-sm text-font-color">
                    <div className="flex justify-between">
                      <span>Ground Residential:</span>
                      <span>${surcharges.sc_g.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Air Residential:</span>
                      <span>${surcharges.sc_a.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Signature Required:</span>
                      <span>${surcharges.sc_sr.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adult Signature Required:</span>
                      <span>${surcharges.sc_asr.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {carrier !== 'USPS' && (
                <div className="text-xs text-font-color-100 italic">
                  (*) transportation rates include fuel surcharges
                </div>
              )}
            </div>

            {/* Right Column - Notes & Disclaimer */}
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-font-color-100 mb-2">Note:</div>
                <div className="text-xs text-font-color leading-relaxed">
                  Net rate tables are estimates only. Net rate tables exclude all potential surcharges except for fuel where applicable (these surcharges include signature required, residential, delivery area surcharge, and more). Surcharges may change based on the carrier's discretion. Fuel changes on a weekly basis.
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-font-color-100 mb-2">Disclaimer:</div>
                <div className="text-xs text-font-color leading-relaxed">
                  Although the shipping cost data presented has been produced and processed from sources believed to be reliable, no warranty expressed or implied is made regarding accuracy, adequacy, completeness, legality, reliability, or usefulness of any information. DCL is providing this information "as is" and disclaims all warranties of any kind. In no event will DCL be liable to you or any third party for any direct, indirect, or consequential damages resulting from the use or misuse of this data.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
