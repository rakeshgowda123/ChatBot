import React from 'react';
import { Bold, Italic, Type, Palette, Grid } from 'lucide-react';
import type { ToolbarProps } from '../types/spreadsheet';

const Toolbar: React.FC<ToolbarProps> = ({
  onBoldClick,
  onItalicClick,
  onFontSizeChange,
  onColorChange,
  onBackgroundColorChange,
  selectedCell,
  cellValue
}) => {
  return (
    <div className="flex items-center gap-4 p-2 bg-white border-b">
      <button
        onClick={onBoldClick}
        className="p-2 hover:bg-gray-100 rounded"
        title="Bold"
      >
        <Bold size={20} />
      </button>
      <button
        onClick={onItalicClick}
        className="p-2 hover:bg-gray-100 rounded"
        title="Italic"
      >
        <Italic size={20} />
      </button>
      <div className="flex items-center gap-2">
        <Type size={20} />
        <select
          onChange={(e) => onFontSizeChange(e.target.value)}
          className="border rounded p-1"
        >
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24].map((size) => (
            <option key={size} value={`${size}px`}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Palette size={20} />
        <input
          type="color"
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 p-0 border-0"
          title="Text Color"
        />
      </div>
      <div className="flex items-center gap-2">
        <Grid size={20} />
        <input
          type="color"
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          className="w-8 h-8 p-0 border-0"
          title="Background Color"
        />
      </div>
      <div className="flex-1" />
      <div className="text-sm text-gray-600">
        {selectedCell ? `Selected: ${selectedCell}` : 'No cell selected'}
      </div>
    </div>
  );
};

export default Toolbar;