import { SpreadsheetData, SpreadsheetFunction } from '../types/spreadsheet';

// Helper function to get numeric values from cell references
const getNumericValue = (cellData: SpreadsheetData, ref: string): number => {
  const value = cellData[ref]?.value;
  return value ? parseFloat(value) : 0;
};

// Helper function to get a range of cells
const getCellRange = (start: string, end: string): string[] => {
  const startCol = start.match(/[A-Z]+/)?.[0] || '';
  const startRow = parseInt(start.match(/\d+/)?.[0] || '0');
  const endCol = end.match(/[A-Z]+/)?.[0] || '';
  const endRow = parseInt(end.match(/\d+/)?.[0] || '0');

  const cells: string[] = [];
  for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
    for (let row = startRow; row <= endRow; row++) {
      cells.push(`${String.fromCharCode(col)}${row}`);
    }
  }
  return cells;
};

export const spreadsheetFunctions: { [key: string]: SpreadsheetFunction } = {
  SUM: (args: any[], data: SpreadsheetData): number => {
    if (args.length !== 2) return 0;
    const range = getCellRange(args[0], args[1]);
    return range.reduce((sum, cell) => sum + getNumericValue(data, cell), 0);
  },

  AVERAGE: (args: any[], data: SpreadsheetData): number => {
    if (args.length !== 2) return 0;
    const range = getCellRange(args[0], args[1]);
    const sum = range.reduce((acc, cell) => acc + getNumericValue(data, cell), 0);
    return sum / range.length;
  },

  MAX: (args: any[], data: SpreadsheetData): number => {
    if (args.length !== 2) return 0;
    const range = getCellRange(args[0], args[1]);
    return Math.max(...range.map(cell => getNumericValue(data, cell)));
  },

  MIN: (args: any[], data: SpreadsheetData): number => {
    if (args.length !== 2) return 0;
    const range = getCellRange(args[0], args[1]);
    return Math.min(...range.map(cell => getNumericValue(data, cell)));
  },

  COUNT: (args: any[], data: SpreadsheetData): number => {
    if (args.length !== 2) return 0;
    const range = getCellRange(args[0], args[1]);
    return range.filter(cell => !isNaN(getNumericValue(data, cell))).length;
  },

  TRIM: (args: any[], data: SpreadsheetData): string => {
    if (args.length !== 1) return '';
    const value = data[args[0]]?.value || '';
    return value.trim();
  },

  UPPER: (args: any[], data: SpreadsheetData): string => {
    if (args.length !== 1) return '';
    const value = data[args[0]]?.value || '';
    return value.toUpperCase();
  },

  LOWER: (args: any[], data: SpreadsheetData): string => {
    if (args.length !== 1) return '';
    const value = data[args[0]]?.value || '';
    return value.toLowerCase();
  },

  REMOVE_DUPLICATES: (args: any[], data: SpreadsheetData): string => {
    if (args.length !== 2) return '#ERROR!';
    const range = getCellRange(args[0], args[1]);
    const values = range.map(cell => data[cell]?.value || '');
    return [...new Set(values)].join(', ');
  },

  FIND_AND_REPLACE: (args: any[], data: SpreadsheetData): string => {
    if (args.length !== 4) return '#ERROR!';
    const [startCell, endCell, find, replace] = args;
    const range = getCellRange(startCell, endCell);
    const value = data[range[0]]?.value || '';
    return value.replace(new RegExp(find, 'g'), replace);
  }
};
