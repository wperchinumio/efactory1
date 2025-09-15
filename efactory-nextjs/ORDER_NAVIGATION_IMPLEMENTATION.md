# Order Navigation System Implementation

This document describes the implementation of the order navigation system that allows users to navigate between orders using previous/next arrows when viewing order details.

## Overview

The navigation system stores a list of orders in memory when a user clicks on an order from an AGGrid (like from orders/open). This allows users to navigate through the order list using previous/next arrows without going back to the grid.

## Architecture

### 1. OrderNavigationContext (`src/contexts/OrderNavigationContext.tsx`)

A lightweight React context that manages the navigation state:

- **State Management**: Stores the current order list, current index, and source context
- **Navigation Methods**: Provides methods to navigate between orders
- **Validation**: Ensures navigation only works when there are multiple orders

**Key Features:**
- Stores order list with order_number and account_number
- Tracks current position in the list
- Provides navigation methods (previous/next)
- Validates navigation boundaries
- Clears navigation when not needed

### 2. GridPage Integration (`src/components/common/GridPage.tsx`)

Enhanced to capture and store order lists:

- **Row Click Handler**: Captures the current grid rows when an order is clicked
- **Navigation Setup**: Converts grid rows to navigation items and stores them
- **Context Integration**: Uses the OrderNavigationContext to manage state

**Flow:**
1. User clicks on an order row in AGGrid
2. System captures all current rows from the grid
3. Converts rows to navigation items (with order_number/account_number)
4. Stores the list in navigation context
5. Navigates to order detail view

### 3. OrderOverview Integration (`src/components/overview/OrderOverview.tsx`)

Already had navigation props, now fully integrated:

- **Navigation Props**: Receives navigation handlers and state from GridPage
- **Professional UI**: Uses existing arrow navigation with current/total display
- **State Sync**: Updates navigation context when navigating between orders

## Usage

### From AGGrid to Order Detail

1. User views any order grid (e.g., `/orders/open`)
2. User clicks on an order row
3. System automatically:
   - Stores the current order list in navigation context
   - Navigates to order detail view
   - Shows navigation arrows if there are multiple orders

### Navigation Between Orders

1. User sees professional arrow navigation at the top of OrderOverview
2. Shows "X of Y" count (e.g., "3 of 15")
3. Previous/Next arrows are enabled/disabled based on position
4. Clicking arrows loads the previous/next order from the stored list

### Direct Order Access

- If user navigates directly via URL or search, no navigation context is set
- Navigation arrows are hidden (no list to navigate through)
- This matches the expected behavior from the legacy system

## Technical Details

### Navigation Item Structure

```typescript
interface OrderNavigationItem {
  order_number: string;
  account_number?: string;
  [key: string]: any; // Additional order data
}
```

### Context Methods

- `setOrderList()`: Store order list and set current position
- `navigateToPrevious()` / `navigateToNext()`: Navigate and update current position
- `canNavigatePrevious()` / `canNavigateNext()`: Check if navigation is possible
- `getCurrentIndex()` / `getTotalCount()`: Get display information
- `clearNavigation()`: Clear navigation state
- `hasNavigation()`: Check if navigation is available

### Integration Points

1. **App Level**: OrderNavigationProvider wraps the entire application
2. **Grid Level**: GridPage captures rows and sets up navigation
3. **Detail Level**: OrderOverview uses navigation state for UI

## Benefits

1. **Performance**: Lightweight context, no Redux overhead
2. **User Experience**: Seamless navigation between orders
3. **Professional UI**: Clean arrow navigation with position indicators
4. **Flexible**: Works with any grid that has order data
5. **Safe**: Validates navigation boundaries and clears when appropriate

## Future Extensions

The system is designed to be extensible:

- **Item Navigation**: Similar pattern can be used for item_id navigation
- **Other Entities**: Can be adapted for any list-based navigation
- **Persistence**: Could be enhanced to persist navigation across page refreshes
- **Keyboard Shortcuts**: Could add keyboard navigation support

## Browser Compatibility

Works with all modern browsers that support:
- React Context API
- ES6+ JavaScript features
- Next.js routing
