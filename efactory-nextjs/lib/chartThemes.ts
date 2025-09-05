/**
 * Chart Theme System for eFactory
 * Integrates with Luno's color theme system to provide consistent chart colors
 * that automatically respond to theme changes (light/dark mode and color palette)
 */

import * as echarts from 'echarts';

export type ThemeMode = 'light' | 'dark';
export type LunoTheme = 'indigo' | 'blue' | 'cyan' | 'green' | 'orange' | 'blush' | 'red' | 'dynamic';

export interface ChartThemeConfig {
  mode: ThemeMode;
  lunoTheme: LunoTheme;
  colors: string[];
  backgroundColor: string;
  textColor: string;
  axisColor: string;
  gridColor: string;
  legendColor: string;
}

/**
 * Get CSS custom property value
 */
function getCSSVariable(property: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
}

/**
 * Get current theme information from DOM
 */
export function getCurrentTheme(): { mode: ThemeMode; lunoTheme: LunoTheme } {
  if (typeof window === 'undefined') {
    return { mode: 'light', lunoTheme: 'indigo' };
  }

  const htmlElement = document.documentElement;
  const bodyElement = document.body;
  
  // Check both html and body elements for theme attributes
  const dataTheme = htmlElement.getAttribute('data-theme') || bodyElement.getAttribute('data-theme');
  const dataLunoTheme = (htmlElement.getAttribute('data-luno-theme') || bodyElement.getAttribute('data-luno-theme')) as LunoTheme;

  console.log('getCurrentTheme called:', { 
    htmlTheme: htmlElement.getAttribute('data-theme'),
    bodyTheme: bodyElement.getAttribute('data-theme'),
    htmlLunoTheme: htmlElement.getAttribute('data-luno-theme'),
    bodyLunoTheme: bodyElement.getAttribute('data-luno-theme'),
    finalTheme: dataTheme,
    finalLunoTheme: dataLunoTheme
  });

  return {
    mode: dataTheme === 'dark' ? 'dark' : 'light',
    lunoTheme: dataLunoTheme || 'indigo'
  };
}

/**
 * Generate chart colors based on current Luno theme
 */
function getChartColors(lunoTheme: LunoTheme): string[] {
  // Read CSS variables dynamically based on current theme
  const getThemeColor = (colorVar: string, fallback: string) => {
    const value = getCSSVariable(colorVar) || fallback;
    console.log(`Reading ${colorVar} for theme ${lunoTheme}:`, value);
    return value;
  };

  const colorMap: Record<LunoTheme, string[]> = {
    indigo: [
      getThemeColor('--chart-color1', '#b9b3a8'),
      getThemeColor('--chart-color2', '#4C3575'),
      getThemeColor('--chart-color3', '#98427e'),
      getThemeColor('--chart-color4', '#d55a75'),
      getThemeColor('--chart-color5', '#fb8665'),
      '#8B5CF6', // Additional colors for more data series
      '#06B6D4',
      '#10B981',
      '#F59E0B',
      '#EF4444'
    ],
    blue: [
      getThemeColor('--chart-color1', '#2794eb'),
      getThemeColor('--chart-color2', '#6382D8'),
      getThemeColor('--chart-color3', '#8D61A5'),
      getThemeColor('--chart-color4', '#90476F'),
      getThemeColor('--chart-color5', '#00AC9A'),
      '#3B82F6',
      '#06B6D4',
      '#10B981',
      '#F59E0B',
      '#EF4444'
    ],
    cyan: [
      getThemeColor('--chart-color1', '#219F94'),
      getThemeColor('--chart-color2', '#655D8A'),
      getThemeColor('--chart-color3', '#C1DEAE'),
      getThemeColor('--chart-color4', '#FDCEB9'),
      getThemeColor('--chart-color5', '#D885A3'),
      '#06B6D4',
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444'
    ],
    green: [
      getThemeColor('--chart-color1', '#79B989'),
      getThemeColor('--chart-color2', '#7E8954'),
      getThemeColor('--chart-color3', '#91A7FB'),
      getThemeColor('--chart-color4', '#3FBCB8'),
      getThemeColor('--chart-color5', '#ecbc7c'),
      '#10B981',
      '#06B6D4',
      '#3B82F6',
      '#F59E0B',
      '#EF4444'
    ],
    orange: [
      getThemeColor('--chart-color1', '#FFA600'),
      getThemeColor('--chart-color2', '#FF8982'),
      getThemeColor('--chart-color3', '#FFC0B7'),
      getThemeColor('--chart-color4', '#CF7F00'),
      getThemeColor('--chart-color5', '#00B4B7'),
      '#F59E0B',
      '#EF4444',
      '#10B981',
      '#06B6D4',
      '#3B82F6'
    ],
    blush: [
      getThemeColor('--chart-color1', '#dd5e89'),
      getThemeColor('--chart-color2', '#b45d98'),
      getThemeColor('--chart-color3', '#865e99'),
      getThemeColor('--chart-color4', '#5b5b8b'),
      getThemeColor('--chart-color5', '#f7bb97'),
      '#EC4899',
      '#EF4444',
      '#F59E0B',
      '#10B981',
      '#06B6D4'
    ],
    red: [
      getThemeColor('--chart-color1', '#FF7171'),
      getThemeColor('--chart-color2', '#FFAA71'),
      getThemeColor('--chart-color3', '#6E6D6D'),
      getThemeColor('--chart-color4', '#D9C6A5'),
      getThemeColor('--chart-color5', '#99B898'),
      '#EF4444',
      '#F59E0B',
      '#EC4899',
      '#10B981',
      '#06B6D4'
    ],
    dynamic: [
      getThemeColor('--chart-color1', '#7C3AED'),
      getThemeColor('--chart-color2', '#DC2626'),
      getThemeColor('--chart-color3', '#059669'),
      getThemeColor('--chart-color4', '#D97706'),
      getThemeColor('--chart-color5', '#2563EB'),
      '#DB2777',
      '#0891B2',
      '#65A30D',
      '#EA580C',
      '#7C2D12'
    ]
  };

  return colorMap[lunoTheme] || colorMap.indigo;
}

/**
 * Generate theme configuration based on current mode and Luno theme
 */
export function generateChartThemeConfig(mode: ThemeMode, lunoTheme: LunoTheme): ChartThemeConfig {
  const colors = getChartColors(lunoTheme);
  
  const isDark = mode === 'dark';
  
  return {
    mode,
    lunoTheme,
    colors,
    backgroundColor: isDark ? 'rgba(0,0,0,0)' : 'rgba(252,252,252,0)',
    textColor: isDark ? '#ffffff' : '#333333',
    axisColor: isDark ? '#666666' : '#cccccc',
    gridColor: isDark ? '#333333' : '#f0f0f0',
    legendColor: isDark ? '#ffffff' : '#333333'
  };
}

/**
 * Generate ECharts theme object
 */
export function generateEChartsTheme(config: ChartThemeConfig): any {
  const isDark = config.mode === 'dark';
  
  return {
    color: config.colors,
    backgroundColor: config.backgroundColor,
    textStyle: {
      color: config.textColor
    },
    title: {
      textStyle: {
        color: isDark ? '#ffffff' : '#666666'
      },
      subtextStyle: {
        color: isDark ? '#cccccc' : '#999999'
      }
    },
    legend: {
      textStyle: {
        color: config.legendColor
      }
    },
    // Hide data labels in dark mode
    series: {
      label: {
        show: !isDark, // Hide labels in dark mode, show in light mode
        color: config.textColor,
        fontSize: 12,
        fontWeight: 'normal',
        // Remove border for cleaner look
        borderWidth: 0,
        borderColor: 'transparent',
        backgroundColor: 'transparent'
      }
    },
    // Specific configurations for different chart types
    bar: {
      label: {
        show: !isDark,
        color: config.textColor,
        fontSize: 12,
        borderWidth: 0,
        backgroundColor: 'transparent'
      }
    },
    line: {
      label: {
        show: !isDark,
        color: config.textColor,
        fontSize: 12,
        borderWidth: 0,
        backgroundColor: 'transparent'
      }
    },
    pie: {
      label: {
        show: !isDark,
        color: config.textColor,
        fontSize: 12,
        borderWidth: 0,
        backgroundColor: 'transparent'
      }
    },
    scatter: {
      label: {
        show: !isDark,
        color: config.textColor,
        fontSize: 12,
        borderWidth: 0,
        backgroundColor: 'transparent'
      }
    },
    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: config.axisColor
        }
      },
      axisTick: {
        lineStyle: {
          color: config.axisColor
        }
      },
      axisLabel: {
        textStyle: {
          color: isDark ? '#cccccc' : '#999999'
        }
      },
      splitLine: {
        lineStyle: {
          color: [config.gridColor]
        }
      }
    },
    valueAxis: {
      axisLine: {
        lineStyle: {
          color: config.axisColor
        }
      },
      axisTick: {
        lineStyle: {
          color: config.axisColor
        }
      },
      axisLabel: {
        textStyle: {
          color: isDark ? '#cccccc' : '#999999'
        }
      },
      splitLine: {
        lineStyle: {
          color: [config.gridColor]
        }
      }
    }
  };
}

/**
 * Register ECharts theme with current configuration
 */
export function registerEChartsTheme(themeName: string, config: ChartThemeConfig): void {
  const echartsTheme = generateEChartsTheme(config);
  echarts.registerTheme(themeName, echartsTheme);
}

/**
 * Get theme name for ECharts
 */
export function getEChartsThemeName(mode: ThemeMode, lunoTheme: LunoTheme): string {
  return `luno-${lunoTheme}-${mode}`;
}

/**
 * Initialize and register all chart themes
 */
export function initializeChartThemes(): void {
  const themes: LunoTheme[] = ['indigo', 'blue', 'cyan', 'green', 'orange', 'blush', 'red', 'dynamic'];
  const modes: ThemeMode[] = ['light', 'dark'];

  themes.forEach(lunoTheme => {
    modes.forEach(mode => {
      const config = generateChartThemeConfig(mode, lunoTheme);
      const themeName = getEChartsThemeName(mode, lunoTheme);
      registerEChartsTheme(themeName, config);
    });
  });
}

/**
 * Get current ECharts theme name
 */
export function getCurrentEChartsThemeName(): string {
  const { mode, lunoTheme } = getCurrentTheme();
  return getEChartsThemeName(mode, lunoTheme);
}

/**
 * Update chart theme when theme changes
 */
export function updateChartTheme(): string {
  const { mode, lunoTheme } = getCurrentTheme();
  const config = generateChartThemeConfig(mode, lunoTheme);
  const themeName = getEChartsThemeName(mode, lunoTheme);
  
  console.log('updateChartTheme - Generated config:', {
    mode,
    lunoTheme,
    themeName,
    colors: config.colors,
    backgroundColor: config.backgroundColor,
    textColor: config.textColor
  });
  
  // Re-register the theme with updated colors
  registerEChartsTheme(themeName, config);
  
  return themeName;
}
