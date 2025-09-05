import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

/**
 * Export analytics data to Excel file
 * Based on legacy eFactory export functionality
 */
export const exportAnalyticsReport = (data, reportTitle, reportType, options = {}) => {
  try {
    const { compareYears = false, selectedDataset = 'orders' } = options
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('No data provided for export');
    }
    
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    
    let reportData = null

  // Transform data based on report type (matching legacy logic)
  if (reportType === 'by-time') {
    if (compareYears) {
      reportData = data.map((line) => ({
        'Time': line.name || line.id,
        'Orders - 2': line.year_2?.orders || 0,
        'Orders - 1': line.year_1?.orders || 0,
        'Orders': line.orders || 0,
        'Lines - 2': line.year_2?.lines || 0,
        'Lines - 1': line.year_1?.lines || 0,
        'Lines': line.lines || 0,
        'Packages - 2': line.year_2?.packages || 0,
        'Packages - 1': line.year_1?.packages || 0,
        'Packages': line.packages || 0,
        'Units - 2': line.year_2?.units || 0,
        'Units - 1': line.year_1?.units || 0,
        'Units': line.units || 0
      }))
    } else {
      reportData = data.map((line) => ({
        'Time': line.name || line.id,
        'Orders': line.orders || 0,
        'Lines': line.lines || 0,
        'Packages': line.packages || 0,
        'Units': line.units || 0
      }))
    }
  } else if (reportType === 'by-ship-service') {
    if (compareYears) {
      reportData = data.map((line) => ({
        'Ship Service': line.name || line.id,
        'Orders - 2': line.year_2?.orders || 0,
        'Orders - 1': line.year_1?.orders || 0,
        'Orders': line.orders || 0,
        'Lines - 2': line.year_2?.lines || 0,
        'Lines - 1': line.year_1?.lines || 0,
        'Lines': line.lines || 0,
        'Packages - 2': line.year_2?.packages || 0,
        'Packages - 1': line.year_1?.packages || 0,
        'Packages': line.packages || 0,
        'Units - 2': line.year_2?.units || 0,
        'Units - 1': line.year_1?.units || 0,
        'Units': line.units || 0
      }))
    } else {
      reportData = data.map((line) => ({
        'Ship Service': line.name || line.id,
        'Orders': line.orders || 0,
        'Lines': line.lines || 0,
        'Packages': line.packages || 0,
        'Units': line.units || 0
      }))
    }
  } else if (reportType === 'by-channel') {
    if (compareYears) {
      reportData = data.map((line) => ({
        'Channel': line.name || line.id,
        'Orders - 2': line.year_2?.orders || 0,
        'Orders - 1': line.year_1?.orders || 0,
        'Orders': line.orders || 0,
        'Lines - 2': line.year_2?.lines || 0,
        'Lines - 1': line.year_1?.lines || 0,
        'Lines': line.lines || 0,
        'Packages - 2': line.year_2?.packages || 0,
        'Packages - 1': line.year_1?.packages || 0,
        'Packages': line.packages || 0,
        'Units - 2': line.year_2?.units || 0,
        'Units - 1': line.year_1?.units || 0,
        'Units': line.units || 0
      }))
    } else {
      reportData = data.map((line) => ({
        'Channel': line.name || line.id,
        'Orders': line.orders || 0,
        'Lines': line.lines || 0,
        'Packages': line.packages || 0,
        'Units': line.units || 0
      }))
    }
  } else if (reportType === 'by-account') {
    if (compareYears) {
      reportData = data.map((line) => ({
        'Account': line.id || line.name,
        'Company Name': line.company_name || line.name,
        'Company Code': line.company_code || line.id,
        'Orders - 2': line.year_2?.orders || 0,
        'Orders - 1': line.year_1?.orders || 0,
        'Orders': line.orders || 0,
        'Lines - 2': line.year_2?.lines || 0,
        'Lines - 1': line.year_1?.lines || 0,
        'Lines': line.lines || 0,
        'Packages - 2': line.year_2?.packages || 0,
        'Packages - 1': line.year_1?.packages || 0,
        'Packages': line.packages || 0,
        'Units - 2': line.year_2?.units || 0,
        'Units - 1': line.year_1?.units || 0,
        'Units': line.units || 0
      }))
    } else {
      reportData = data.map((line) => ({
        'Account': line.id || line.name,
        'Company Name': line.company_name || line.name,
        'Company Code': line.company_code || line.id,
        'Orders': line.orders || 0,
        'Lines': line.lines || 0,
        'Packages': line.packages || 0,
        'Units': line.units || 0
      }))
    }
  } else {
    // Generic fallback
    reportData = data.map((line) => ({
      'Name': line.name || line.id,
      'Orders': line.orders || 0,
      'Lines': line.lines || 0,
      'Packages': line.packages || 0,
      'Units': line.units || 0
    }))
  }

    // Create Excel workbook
    const ws = XLSX.utils.json_to_sheet(reportData)
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data_blob = new Blob([excelBuffer], { type: fileType })
    
    // Download file
    const fileName = `${reportTitle}${fileExtension}`
    saveAs(data_blob, fileName)
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}
