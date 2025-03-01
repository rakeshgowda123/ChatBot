export interface CellData {
  value: string;
  formula?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
  };
}

export interface SpreadsheetData {
  [key: string]: CellData;
}

export type SpreadsheetFunction = (args: any[], data: SpreadsheetData) => number | string;

export interface Functions {
  [key: string]: SpreadsheetFunction;
}
