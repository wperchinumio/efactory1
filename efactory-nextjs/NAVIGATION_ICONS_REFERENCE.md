# Navigation Icons Reference

This document lists all the icons currently assigned to each navigation menu item. The navigation system now uses **Tabler Icons** (same as Luno theme) as React components. You can modify these icons by changing the `iconComponent` property in `/src/config/navigation.ts`.

## Top Menu Icons

| Menu | Tabler Icon Component | Icon Description |
|------|----------------------|------------------|
| Overview | `IconHome` | Home icon |
| Orders | `IconBook` | Book icon |
| Items | `IconTag` | Tag/label icon |
| OrderPoints | `IconShoppingCart` | Shopping cart icon |
| Transportation | `IconTruck` | Truck icon |
| ReturnTrak | `IconArrowsExchange` | Exchange/return icon |
| Analytics | `IconChartBar` | Bar chart icon |
| EDI Central | `IconCloud` | Cloud icon |
| Documents | `IconFiles` | Files icon |
| Services | `IconSettings` | Settings/gear icon |

## Sidebar Menu Icons

### Overview Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| Overview | `IconHome` | Home icon |
| Personal notes | `IconPencil` | Pencil icon |

### Orders Section
| Menu Item | Icon Class | Icon Description |
|-----------|------------|------------------|
| Orders | `icon-book-open` | Open book icon |
| Order Lines | `icon-list` | List icon |
| Order Items | `icon-tag` | Tag icon |
| Ship Detail | `icon-share` | Share/ship icon |
| Customer Docs | `fa fa-th-large` | Document grid icon |

### Items Section
| Menu Item | Icon Class | Icon Description |
|-----------|------------|------------------|
| Items | `icon-tag` | Tag icon |
| Receipts | `icon-arrow-down` | Down arrow icon |
| Assembly | `fa fa-cubes` | Cubes icon |
| Returns | `fa fa-exchange` | Exchange icon |
| Customer Docs | `fa fa-th-large` | Document grid icon |

### OrderPoints Section
| Menu Item | Icon Class | Icon Description |
|-----------|------------|------------------|
| Order Entry | `fa fa-opencart` | Shopping cart icon |
| Drafts | `fa fa-cubes` | Cubes icon |
| Address Book | `fa fa-location-arrow` | Location arrow icon |
| Mass Upload | `fa fa-file-excel-o` | Excel file icon |
| FTP Batches | `fa fa-calendar` | Calendar icon |
| Shipping Cost Estimator | `fa fa-calculator` | Calculator icon |
| Customer Docs | `fa fa-th-large` | Document grid icon |
| Help and FAQ | `icon-info` | Info icon |

### Transportation Section
| Menu Item | Icon Class | Icon Description |
|-----------|------------|------------------|
| By Time | `fa fa-calendar bold` | Calendar icon (bold) |
| By Service | `fa fa-truck bold` | Truck icon (bold) |
| Analyzer | `fa fa-truck bold` | Truck icon (bold) |
| Shipping Detail | `fa fa-truck` | Truck icon |
| Cost Estimator | `fa fa-calculator` | Calculator icon |

### ReturnTrak Section
| Menu Item | Icon Class | Icon Description |
|-----------|------------|------------------|
| RMA Entry | `fa fa-opencart` | Shopping cart icon |
| Drafts | `fa fa-cubes` | Cubes icon |
| RMAs | `fa fa-exchange` | Exchange icon |
| Shipped Orders | `icon-book-open` | Open book icon |
| Customer Docs | `fa fa-th-large` | Document grid icon |

### Analytics Section
| Menu Item | Icon Class | Icon Description |
|-----------|------------|------------------|
| Domestic | `fa fa-map-marker bold` | Map marker icon (bold) |
| International | `fa fa-globe bold` | Globe icon (bold) |
| By Time | `fa fa-calendar bold` | Calendar icon (bold) |
| By Item | `fa fa-tag bold` | Tag icon (bold) |
| By Customer | `fa fa-building bold` | Building icon (bold) |
| By Ship Service | `fa fa-truck bold` | Truck icon (bold) |
| By Channel | `fa fa-cloud bold` | Cloud icon (bold) |
| Incident Reports | `fa fa-bolt bold` | Bolt icon (bold) |
| Shipment Times | `fa fa-clock-o bold` | Clock icon (bold) |
| RMA Receive Times | `fa fa-clock-o bold` | Clock icon (bold) |
| Delivery Times | `fa fa-calendar-check-o bold` | Calendar check icon (bold) |
| Cycle Count | `fa fa-bar-chart-o bold` | Bar chart icon (bold) |
| Replenishment | `icon-calendar` | Calendar icon |
| Slow Moving | `icon-calendar` | Calendar icon |
| Scheduled Reports | `fa fa-calendar` | Calendar icon |
| Standard Reports | `fa fa-th-large` | Document grid icon |
| Custom Reports | `fa fa-th` | Grid icon |

### EDI Central Section
| Menu Item | Icon Class | Icon Description |
|-----------|------------|------------------|
| Overview | `icon-home` | Home icon |
| EDI Documents | `fa fa-th-large` | Document grid icon |
| Trading Partners | `fa fa-industry` | Industry icon |
| Ext. Shipments | `fa fa-truck` | Truck icon |

### Documents Section
| Menu Item | Icon Class | Icon Description |
|-----------|------------|------------------|
| Document Submission | `fa fa-cloud-upload` | Cloud upload icon |
| Customer Docs | `fa fa-th-large` | Document grid icon |
| Special Docs | `fa fa-briefcase` | Briefcase icon |
| FTP Folders | `fa fa-cloud` | Cloud icon |

### Services Section
| Menu Item | Icon Class | Icon Description |
|-----------|------------|------------------|
| Users | `fa fa-user-plus` | User plus icon |
| OrderPoints Settings | `fa fa-gear` | Gear icon |
| ReturnTrak Settings | `fa fa-gear` | Gear icon |
| Special Settings | `fa fa-gear` | Gear icon |
| Email Notifications | `fa fa-envelope` | Envelope icon |
| Invoices | `icon-share` | Share icon |

## How to Change Icons

To change any icon, edit the `iconComponent` property in `/src/config/navigation.ts`:

```typescript
// Example: Change the Overview icon from home to dashboard
import { IconDashboard } from '@tabler/icons-react';

{
  keyword: 'overview',
  title: 'Overview',
  iconComponent: IconDashboard, // Changed from IconHome
  appIds: [1, 2, 3],
  sidebarConfig: 'overview'
}
```

## Available Icon Libraries

The navigation system now uses **Tabler Icons** exclusively (same as Luno theme):

1. **Tabler Icons**: React components from `@tabler/icons-react`
   - Examples: `IconHome`, `IconTruck`, `IconUser`, `IconSettings`
   - Full list: https://tabler-icons.io/
   - Import: `import { IconName } from '@tabler/icons-react'`

2. **Legacy Support**: The system still supports CSS class icons for backward compatibility
   - Use `iconClassName` property instead of `iconComponent`
   - Examples: `fa fa-home`, `custom-icon-class`

## Icon Sizing

- **Sidebar icons**: `w-[22px] h-[22px]` with `stroke-[1.5]` 
- **Top menu icons**: `w-[18px] h-[18px]`
- All icons follow Luno theme sizing standards
