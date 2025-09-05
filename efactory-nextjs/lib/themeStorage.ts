/**
 * Theme Storage Utility
 * Handles saving and loading theme preferences to/from localStorage
 */

export type ThemeMode = 'light' | 'dark';
export type LunoTheme = 'indigo' | 'blue' | 'cyan' | 'green' | 'orange' | 'blush' | 'red' | 'dynamic';

export interface ThemePreferences {
  mode: ThemeMode;
  lunoTheme: LunoTheme;
  rtlMode: boolean;
  fontFamily: string;
  sidebarAutoCollapse: boolean;
  dynamicColors?: Array<{
    variable: string;
    colorValue: { r: number; g: number; b: number; a: number };
  }>;
}

const THEME_STORAGE_KEY = 'efactory-theme-preferences';

/**
 * Get theme preferences from localStorage
 */
export function getThemePreferences(): ThemePreferences {
  if (typeof window === 'undefined') {
    return {
      mode: 'light',
      lunoTheme: 'indigo',
      rtlMode: false,
      fontFamily: 'Mulish, sans-serif'
    };
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        mode: parsed.mode || 'light',
        lunoTheme: parsed.lunoTheme || 'indigo',
        rtlMode: parsed.rtlMode || false,
        fontFamily: parsed.fontFamily || 'Mulish, sans-serif',
        sidebarAutoCollapse: parsed.sidebarAutoCollapse !== undefined ? parsed.sidebarAutoCollapse : true,
        dynamicColors: parsed.dynamicColors || []
      };
    }
  } catch (error) {
    console.warn('Failed to parse theme preferences from localStorage:', error);
  }

  // Return defaults if no stored preferences
  return {
    mode: 'light',
    lunoTheme: 'indigo',
    rtlMode: false,
    fontFamily: 'Mulish, sans-serif',
    sidebarAutoCollapse: true
  };
}

/**
 * Save theme preferences to localStorage
 */
export function saveThemePreferences(preferences: Partial<ThemePreferences>): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getThemePreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save theme preferences to localStorage:', error);
  }
}

/**
 * Apply theme preferences to the DOM
 */
export function applyThemePreferences(preferences: ThemePreferences): void {
  if (typeof window === 'undefined') return;

  // Apply theme mode
  document.documentElement.setAttribute('data-theme', preferences.mode);
  
  // Apply Luno theme
  document.body.setAttribute('data-luno-theme', preferences.lunoTheme);
  
  // Apply RTL mode
  document.documentElement.setAttribute('dir', preferences.rtlMode ? 'rtl' : 'ltr');
  
  // Apply font family
  document.body.style.setProperty('--font-family', preferences.fontFamily);
  
  // Apply dynamic colors if they exist
  if (preferences.dynamicColors) {
    preferences.dynamicColors.forEach(({ variable, colorValue }) => {
      // Validate colorValue structure before applying
      if (colorValue && 
          typeof colorValue === 'object' && 
          typeof colorValue.r === 'number' && 
          typeof colorValue.g === 'number' && 
          typeof colorValue.b === 'number' && 
          typeof colorValue.a === 'number') {
        document.documentElement.style.setProperty(
          variable, 
          `rgba(${colorValue.r}, ${colorValue.g}, ${colorValue.b}, ${colorValue.a})`
        );
      }
    });
  }
}

/**
 * Load and apply theme preferences on app initialization
 */
export function initializeThemeFromStorage(): ThemePreferences {
  const preferences = getThemePreferences();
  applyThemePreferences(preferences);
  return preferences;
}

/**
 * Clear theme preferences from localStorage
 */
export function clearThemePreferences(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear theme preferences from localStorage:', error);
  }
}
