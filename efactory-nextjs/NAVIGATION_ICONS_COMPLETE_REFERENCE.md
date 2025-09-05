# Complete Navigation Icons Reference

This document lists ALL icons currently assigned to each navigation menu item. The navigation system uses **Tabler Icons** (same as Luno theme) as React components.

## Top Menu Icons

| Menu | Tabler Icon Component | Icon Description |
|------|----------------------|------------------|
| Overview | `IconHome` | 🏠 Home icon |
| Orders | `IconBook` | 📖 Book icon |
| Items | `IconTag` | 🏷️ Tag/label icon |
| OrderPoints | `IconShoppingCart` | 🛒 Shopping cart icon |
| Transportation | `IconTruck` | 🚛 Truck icon |
| ReturnTrak | `IconArrowsExchange` | ↔️ Exchange/return icon |
| Analytics | `IconChartBar` | 📊 Bar chart icon |
| EDI Central | `IconCloud` | ☁️ Cloud icon |
| Documents | `IconFiles` | 📁 Files icon |
| Services | `IconSettings` | ⚙️ Settings/gear icon |

## Sidebar Menu Icons

### Overview Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| Overview | `IconHome` | 🏠 Home icon |
| Personal notes | `IconPencil` | ✏️ Pencil icon |

### Orders Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| Orders | `IconBook` | 📖 Book icon |
| Order Lines | `IconClipboardList` | 📋 Clipboard list icon |
| Order Items | `IconPackage` | 📦 Package icon |
| Ship Detail | `IconShip` | 🚢 Ship icon |
| Customer Docs. | `IconFileText` | 📄 Document icon |

### Items Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| Items | `IconTag` | 🏷️ Tag icon |
| Inventory | `IconArrowDown` | ⬇️ Arrow down icon |
| Inventory Adjustments | `IconCubes` | 📦 Cubes icon |
| Inventory Transfers | `IconArrowsExchange` | ↔️ Exchange icon |
| Customer Docs. | `IconFileText` | 📄 Document icon |

### OrderPoints Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| OrderPoints | `IconShoppingCart` | 🛒 Shopping cart icon |
| Inventory | `IconCubes` | 📦 Cubes icon |
| Locations | `IconMapPin` | 📍 Map pin icon |
| Export | `IconFileSpreadsheet` | 📊 Spreadsheet icon |
| Schedule | `IconCalendar` | 📅 Calendar icon |
| Calculations | `IconCalculator` | 🧮 Calculator icon |
| Customer Docs. | `IconFileText` | 📄 Document icon |

### Transportation Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| Transportation | `IconTruck` | 🚛 Truck icon |
| Shipments | `IconInfoCircle` | ℹ️ Info circle icon |

### ReturnTrak Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| ReturnTrak | `IconBook` | 📖 Book icon |
| Schedule | `IconCalendar` | 📅 Calendar icon |
| Shipments | `IconTruck` | 🚛 Truck icon |
| Locations | `IconMapPin` | 📍 Map pin icon |
| Items | `IconTag` | 🏷️ Tag icon |
| Customers | `IconBuilding` | 🏢 Building icon |

### Analytics Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| Analytics | `IconCloud` | ☁️ Cloud icon |
| Inventory | `IconBolt` | ⚡ Bolt icon |
| Shipments | `IconClock` | 🕐 Clock icon |
| Schedule | `IconCalendarCheck` | ✅ Calendar check icon |
| Reports | `IconChartBar` | 📊 Chart bar icon |

### EDI Central Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| EDI Central | `IconFiles` | 📁 Files icon |
| Documents | `IconFiles` | 📁 Files icon |
| Overview | `IconHome` | 🏠 Home icon |
| Customer Docs. | `IconFiles` | 📁 Files icon |

### Documents Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| Documents | `IconFactory` | 🏭 Factory icon |

### Services Section
| Menu Item | Tabler Icon Component | Icon Description |
|-----------|----------------------|------------------|
| Services | `IconCloudUpload` | ☁️⬆️ Cloud upload icon |
| Announcements | `IconBriefcase` | 💼 Briefcase icon |
| EDI Central | `IconCloud` | ☁️ Cloud icon |
| User Management | `IconUserPlus` | 👤➕ User plus icon |
| ReturnTrak Settings | `IconGear` | ⚙️ Gear icon |
| Special Settings | `IconGear` | ⚙️ Gear icon |
| Email Notifications | `IconEnvelope` | ✉️ Envelope icon |
| Invoices | `IconShare` | 🔗 Share icon |

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

## Available Tabler Icons

The navigation system uses Tabler Icons from `@tabler/icons-react`. Some commonly used icons include:

### Business & Commerce
- `IconHome`, `IconBuilding`, `IconFactory`, `IconBriefcase`
- `IconShoppingCart`, `IconPackage`, `IconTag`, `IconReceipt`
- `IconTruck`, `IconShip`, `IconMapPin`, `IconGlobe`

### Files & Documents
- `IconFiles`, `IconFileText`, `IconFileSpreadsheet`, `IconBook`
- `IconClipboardList`, `IconList`, `IconEdit`, `IconPencil`

### Analytics & Data
- `IconChartBar`, `IconPieChart`, `IconTrendingUp`, `IconActivity`
- `IconDatabase`, `IconServer`, `IconCalculator`, `IconTarget`

### System & Settings
- `IconSettings`, `IconGear`, `IconCog`, `IconKey`, `IconLock`
- `IconCloud`, `IconCloudUpload`, `IconBolt`, `IconZap`

### Communication
- `IconEnvelope`, `IconMail`, `IconBell`, `IconShare`, `IconLink`
- `IconUsers`, `IconUserPlus`, `IconUserCheck`

### Navigation & Actions
- `IconArrowsExchange`, `IconArrowDown`, `IconArrowUp`
- `IconPlus`, `IconMinus`, `IconX`, `IconCheckCircle`
- `IconSearch`, `IconFilter`, `IconRefresh`, `IconEye`

### Time & Calendar
- `IconCalendar`, `IconCalendarCheck`, `IconClock`, `IconBolt`

Full list available at: https://tabler-icons.io/

## Icon Sizing Standards

- **Sidebar icons**: `w-[22px] h-[22px]` with `stroke-[1.5]`
- **Top menu icons**: `w-[18px] h-[18px]`
- All icons follow Luno theme sizing and stroke standards
