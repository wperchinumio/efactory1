# Rate Cards Component

A beautiful, professional rate cards grid component built with AG Grid for the eFactory Next.js application.

## 🎯 Features

### ✨ Core Functionality
- **AG Grid Integration**: Professional data grid with fixed first column (Weight) and header row (Zones)
- **Carrier-Based Theming**: Dynamic color schemes for UPS, FedEx, DHL, USPS, APC, and SelectShip
- **Dynamic Service Filters**: Interactive buttons to filter by service type
- **Static Data Filters**: Carrier and region dropdown filters with predefined options
- **Export Functionality**: Built-in Excel export with download button
- **Responsive Design**: Adapts to screen size with intelligent height adjustment
- **Theme Awareness**: Supports both light and dark modes seamlessly

### 🎨 UI/UX Excellence
- **Beautiful Placeholder**: Engaging empty state with carrier-themed icons
- **Loading States**: Smooth loading indicators during data fetching
- **Error Handling**: User-friendly error messages with retry functionality
- **Professional Styling**: Clean, modern design with smooth animations
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### 🔧 Technical Features
- **No Sorting/Resizing**: Disabled AG Grid features as per requirements
- **Fixed Columns**: First column (Weight) and header row (Zones) remain visible during scroll
- **Real-time Updates**: Dynamic service type buttons based on available data
- **Memory Efficient**: Optimized rendering for large datasets
- **TypeScript**: Fully typed with comprehensive interfaces

## 📁 File Structure

```
efactory-nextjs/
├── src/
│   ├── components/
│   │   └── transportation/
│   │       └── RateCardsGrid.tsx          # Main component
│   ├── pages/
│   │   ├── services/
│   │   │   └── administration-tasks/
│   │   │       └── invoices/
│   │   │           └── rate-cards.tsx     # Production page
│   │   └── demo/
│   │       └── rate-cards.tsx             # Demo page
│   └── types/
│       └── api/
│           └── transportation.ts          # API interfaces
```

## 🚀 Usage

### Basic Implementation

```tsx
import RateCardsGrid from '@/components/transportation/RateCardsGrid';

function MyPage() {
  return (
    <div className="container mx-auto p-4">
      <RateCardsGrid />
    </div>
  );
}
```

### With Custom Styling

```tsx
<RateCardsGrid 
  className="shadow-lg rounded-lg"
  style={{ '--grid-height': '600px' }}
/>
```

## 🎨 Carrier Themes

The component includes predefined color themes for major carriers:

- **UPS**: Orange (#FF6600)
- **FedEx**: Purple (#4B0082)
- **DHL**: Red (#D40511)
- **USPS**: Blue (#004B87)
- **APC/Passport**: Green (#00A651)
- **SelectShip**: Orange (#FF6B35)

## 📊 Data Structure

### Input Data (RateCardRowDto)
```typescript
interface RateCardRowDto {
  carrier: string;           // e.g., 'UPS', 'FEDEX'
  service: string;           // e.g., 'GROUND', '2DAY'
  region?: string;           // e.g., 'US', 'CA'
  zone?: string | number;    // e.g., '2', '3', '4'
  weight_limit?: number;     // e.g., 1, 2, 3 (lbs)
  book_rate: number;         // e.g., 13.64 (dollar amount)
  sc_g?: number;            // Ground Residential surcharge
  sc_a?: number;            // Air Residential surcharge
  sc_sr?: number;           // Signature Required surcharge
  sc_asr?: number;          // Adult Signature Required surcharge
}
```

### Grid Display
The component transforms the raw data into a grid format:
- **Rows**: Weight tiers (1lb, 2lb, 3lb, etc.)
- **Columns**: Shipping zones (2, 3, 4, 5, etc.)
- **Cells**: Rate amounts formatted as currency

## 🔧 Configuration

### Static Filter Options

#### Carriers
```typescript
const CARRIER_OPTIONS = [
  { value: 'UPS', label: 'UPS' },
  { value: 'FEDEX', label: 'FedEx' },
  { value: 'DHL', label: 'DHL' },
  { value: 'USPS', label: 'USPS' },
  { value: 'APC', label: 'Passport' },
  { value: 'SELECTSHIP', label: 'SelectShip' },
];
```

#### Regions
```typescript
const REGION_OPTIONS = [
  { value: 'US', label: 'US' },
  { value: 'CA', label: 'CA' },
  { value: 'MX', label: 'MX' },
  { value: 'FR', label: 'FR' },
  { value: 'DE', label: 'DE' },
  { value: 'UK', label: 'UK' },
  { value: 'AU', label: 'AU' },
];
```

## 🎯 API Integration

The component uses the existing transportation API:

```typescript
// Fetch rate cards
const data = await readRateCards(filter);

// Export rate cards
await exportRateCards(filter, 'excel_rate_cards');
```

## 📱 Responsive Behavior

- **Desktop**: Full grid with all features
- **Tablet**: Optimized column widths
- **Mobile**: Horizontal scroll with fixed first column
- **Height Adaptation**: Automatically adjusts grid height based on viewport

## 🌙 Theme Support

The component automatically adapts to the current theme:
- **Light Mode**: Clean, bright appearance
- **Dark Mode**: Dark backgrounds with appropriate contrast
- **Carrier Colors**: Maintained across both themes

## 🔍 Service Type Filtering

Dynamic service type buttons are generated based on available data:
- **Multi-select**: Users can select multiple services
- **Visual Feedback**: Selected services are highlighted with carrier colors
- **Real-time Updates**: Grid updates immediately when services are toggled

## 📋 Disclosure Section

The component includes a comprehensive disclosure section with:
- **Effective Date**: Carrier-specific rate effective dates
- **Delivery Surcharges**: Ground/Air residential, signature requirements
- **Notes**: Important information about rate accuracy
- **Disclaimer**: Legal disclaimers about data reliability

## 🎨 Customization

### Adding New Carriers
1. Add carrier to `CARRIER_OPTIONS`
2. Add theme to `CARRIER_THEMES`
3. Update effective date logic if needed

### Modifying Grid Behavior
- Adjust `gridOptions` for different AG Grid settings
- Modify `columnDefs` for custom column configurations
- Update `gridHeight` calculation for different responsive behavior

## 🧪 Testing

The component includes a demo page at `/demo/rate-cards` that showcases:
- All carrier themes
- Different filter combinations
- Responsive behavior
- Error states
- Loading states

## 🚀 Performance

- **Optimized Rendering**: Only re-renders when necessary
- **Memory Efficient**: Proper cleanup of event listeners
- **Lazy Loading**: Data fetched only when "Get Rates" is clicked
- **Caching**: AG Grid handles data caching internally

## 📝 Future Enhancements

Potential improvements for future versions:
- **Real-time Updates**: WebSocket integration for live rate updates
- **Advanced Filtering**: Date range filters, weight range filters
- **Bulk Operations**: Select multiple carriers for comparison
- **Print Support**: Print-friendly grid layouts
- **Mobile App**: React Native version for mobile devices

## 🤝 Contributing

When contributing to this component:
1. Maintain the existing design patterns
2. Add proper TypeScript types
3. Include error handling
4. Test across different screen sizes
5. Ensure theme compatibility
6. Update documentation

---

**Built with ❤️ for eFactory Next.js**
