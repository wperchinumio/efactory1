// Removed debug import

export type MenuCloser = () => void;

let activeCloser: MenuCloser | null = null;
let activeElement: HTMLElement | null = null;
let isGlobalBound = false;

function handleGlobalClick(event: MouseEvent) {
  if (!activeCloser) return;
  
  const target = event.target as Element;
  
  // Don't close if clicking inside the active menu
  if (activeElement && activeElement.contains(target)) {
    return;
  }
  
  // Don't close if clicking inside any dropdown content
  const filterDropdown = target.closest('[data-filter-dropdown]');
  if (filterDropdown) {
    return;
  }
  
  // Don't close if clicking on a filter button (let the filter handle the transition)
  const filterButton = target.closest('[data-filter-button]');
  if (filterButton) {
    return;
  }
  
  // Close the active menu
  closeActiveMenu();
}

export function setActiveMenu(closer: MenuCloser, element?: HTMLElement | null) {
  if (activeCloser && activeCloser !== closer) {
    try { activeCloser(); } catch (_) {}
  }
  activeCloser = closer;
  activeElement = element || null;

  // Bind global outside click handler when first menu opens
  if (!isGlobalBound) {
    document.addEventListener('mousedown', handleGlobalClick);
    isGlobalBound = true;
  }
}

export function clearActiveMenu(closer: MenuCloser) {
  if (activeCloser === closer) {
    activeCloser = null;
    activeElement = null;
  }
}

export function closeActiveMenu() {
  if (activeCloser) {
    try { activeCloser(); } catch (_) {}
    activeCloser = null;
    activeElement = null;
  }
}

