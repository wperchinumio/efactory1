# Navigation System Documentation

## Overview

The navigation system is a comprehensive menu solution that provides both top-level and sidebar navigation based on user permissions (app IDs). It's designed to be responsive, accessible, and fully integrated with the authentication system.

## Key Features

- **App ID-based filtering**: Only shows menus the user has access to
- **Responsive design**: Adapts to different screen sizes with overflow handling
- **Mobile-first**: Full mobile navigation with hamburger menu
- **Active menu highlighting**: Shows current page in navigation
- **Badge support**: Displays counts/notifications on menu items
- **Dropdown menus**: Expandable sidebar menus with proper state management
- **Section organization**: Groups related menu items with section titles

## Architecture

### Components

1. **MainLayout** (`src/components/layout/MainLayout.tsx`)
   - Main wrapper component that provides the layout structure
   - Integrates all navigation components
   - Handles responsive behavior

2. **TopMenu** (`src/components/layout/TopMenu.tsx`)
   - Horizontal top navigation bar
   - Responsive overflow handling (shows "..." when space is limited)
   - Active menu highlighting

3. **SidebarMenu** (`src/components/layout/SidebarMenu.tsx`)
   - Vertical sidebar navigation
   - Changes based on selected top menu
   - Supports dropdown menus and badges

4. **MobileNavigation** (`src/components/layout/MobileNavigation.tsx`)
   - Mobile hamburger menu
   - Full-screen overlay navigation
   - Touch-friendly interface

5. **NavigationContext** (`src/contexts/NavigationContext.tsx`)
   - React context for managing navigation state
   - Provides user apps and active menu state

### Configuration

1. **Navigation Config** (`src/config/navigation.ts`)
   - Complete menu structure with app IDs
   - Top menu and sidebar configurations
   - Helper functions for filtering menus

2. **Types** (`src/types/api/auth.ts`)
   - TypeScript interfaces for authentication response
   - Menu item and configuration types

3. **Utils** (`src/utils/navigation.ts`)
   - Route-to-app-ID mapping
   - Permission checking functions
   - Default route determination

## Usage

### Basic Implementation

```tsx
import MainLayout from '../components/layout/MainLayout';

// In your page component
const MyPage = () => {
  const userApps = [1, 2, 3, 5, 6, 7]; // From authentication API
  
  return (
    <MainLayout userApps={userApps}>
      <div>Your page content</div>
    </MainLayout>
  );
};
```

### Using Navigation Context

```tsx
import { useNavigation } from '../contexts/NavigationContext';

const MyComponent = () => {
  const { userApps, activeTopMenu, setActiveTopMenu } = useNavigation();
  
  // Use navigation state in your component
  return <div>Current menu: {activeTopMenu}</div>;
};
```

## Menu Configuration

### Top Menu Structure

Each top menu item has:
- `keyword`: Unique identifier
- `title`: Display name
- `iconClassName`: Font Awesome icon class
- `appIds`: Array of app IDs required for access
- `sidebarConfig`: Reference to sidebar configuration

### Sidebar Menu Structure

Each sidebar menu item can have:
- `keyword`: Unique identifier
- `title`: Display name
- `iconClassName`: Font Awesome icon class
- `route`: Direct route (for single items)
- `dropdownMenus`: Array of sub-menu items
- `sectionTitleBefore`: Section header text
- `isDropdownOpenDefault`: Whether dropdown starts expanded
- `badge`: Badge endpoint (for dynamic counts)
- `badgeClassName`: Badge styling class
- `appIds`: Array of app IDs for direct access

## Responsive Behavior

### Desktop (lg and up)
- Top menu shows all available items
- Sidebar shows on the left
- Overflow handling moves items to "More" dropdown

### Mobile (below lg)
- Hamburger menu button in header
- Full-screen overlay navigation
- Top menu selection + sidebar in one view

## App ID System

The navigation system uses app IDs from the authentication response to determine which menus to show:

```typescript
// From authentication API response
{
  data: {
    apps: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, ...]
  }
}
```

Each menu item is associated with specific app IDs, and only items where the user has at least one required app ID are displayed.

## Badge System

Menu items can display badges with counts:

```typescript
{
  keyword: 'orders',
  title: 'Orders',
  badge: '/orders/open', // API endpoint for count
  badgeClassName: 'badge badge-info'
}
```

The badge system is designed to fetch counts from API endpoints, though the current implementation shows placeholder data.

## Customization

### Adding New Menu Items

1. Add the menu item to the appropriate sidebar configuration in `src/config/navigation.ts`
2. Assign the correct app ID(s)
3. Add the route to the route mapping in `src/utils/navigation.ts`

### Styling

The components use Tailwind CSS classes and can be customized by:
- Modifying the className props
- Updating the base styles in the component files
- Using CSS custom properties for theming

## Testing

Use the demo page at `/demo-navigation` to test the navigation system with different user permission sets.

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works from 320px to 1920px+

## Performance Considerations

- Menu filtering is done client-side for fast rendering
- Context updates are optimized to prevent unnecessary re-renders
- Mobile menu state is properly cleaned up to prevent memory leaks
- Responsive calculations are debounced to prevent excessive re-calculations
