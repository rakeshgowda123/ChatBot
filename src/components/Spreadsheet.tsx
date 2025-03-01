import React, { useState, useCallback, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { evaluate } from 'mathjs';
import 'handsontable/dist/handsontable.full.css';
import type { CellData, SpreadsheetData } from '../types/spreadsheet';
import { spreadsheetFunctions } from '../utils/spreadsheetFunctions';
import FormulaBar from './FormulaBar';

registerAllModules();

const INITIAL_ROWS = 100;
const INITIAL_COLS = 26; // A to Z

const Spreadsheet: React.FC = () => {
  const [data, setData] = useState<SpreadsheetData>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [formulaBarValue, setFormulaBarValue] = useState('');

  // Create initial data array
  const initialData = Array(INITIAL_ROWS).fill(null).map(() => 
    Array(INITIAL_COLS).fill(null)
  );

  const evaluateFormula = useCallback((formula: string, cellData: SpreadsheetData): string => {
    try {
      if (!formula.startsWith('=')) return formula;

      const expression = formula.substring(1).trim();
      
      // Check for built-in functions
      for (const [funcName, func] of Object.entries(spreadsheetFunctions)) {
        if (expression.startsWith(funcName + '(')) {
          const argsMatch = expression.match(/\((.*)\)/);
          if (argsMatch) {
            const args = argsMatch[1].split(',').map(arg => arg.trim());
            return func(args, cellData).toString();
          }
        }
      }

      // Fallback to mathjs for basic arithmetic
      return evaluate(expression, cellData).toString();
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return '#ERROR!';
    }
  }, []);

  const handleChange = useCallback((changes: [number, number, any, any][] | null) => {
    if (!changes) return;

    const newData = { ...data };
    
    changes.forEach(([row, col, oldValue, newValue]) => {
      const cellKey = `${String.fromCharCode(65 + col)}${row + 1}`;
      
      if (newValue && typeof newValue === 'string' && newValue.startsWith('=')) {
        // Handle formula
        newData[cellKey] = {
          value: evaluateFormula(newValue, data),
          formula: newValue
        };
      } else {
        newData[cellKey] = {
          value: newValue
        };
      }
    });

    setData(newData);
  }, [data, evaluateFormula]);

  const handleFormulaBarChange = useCallback((value: string) => {
    setFormulaBarValue(value);
    if (selectedCell) {
      const [row, col] = [
        parseInt(selectedCell.match(/\d+/)?.[0] || '1') - 1,
        selectedCell.charCodeAt(0) - 65
      ];
      handleChange([[row, col, data[selectedCell]?.value || '', value]]);
    }
  }, [selectedCell, data, handleChange]);

  useEffect(() => {
    if (selectedCell) {
      setFormulaBarValue(data[selectedCell]?.formula || data[selectedCell]?.value || '');
    } else {
      setFormulaBarValue('');
    }
  }, [selectedCell, data]);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-8rem)]">
      <FormulaBar
        value={formulaBarValue}
        selectedCell={selectedCell}
        onChange={handleFormulaBarChange}
      />
      <div className="flex-1">
        <HotTable
          data={initialData}
          rowHeaders={true}
          colHeaders={true}
          width="100%"
          height="100%"
          afterChange={handleChange}
          afterSelection={(row, col) => {
            const cellKey = `${String.fromCharCode(65 + col)}${row + 1}`;
            setSelectedCell(cellKey);
          }}
          licenseKey="non-commercial-and-evaluation"
          stretchH="all"
          contextMenu={true}
          minSpareRows={1}
          minSpareCols={1}
          manualColumnResize={true}
          manualRowResize={true}
        />
      </div>
    </div>
  );
};

export default Spreadsheet;