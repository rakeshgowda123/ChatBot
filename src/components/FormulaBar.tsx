import React from 'react';

interface FormulaBarProps {
  value: string;
  selectedCell: string | null;
  onChange: (value: string) => void;
}

const FormulaBar: React.FC<FormulaBarProps> = ({ value, selectedCell, onChange }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b">
      <div className="w-20 text-sm font-medium text-gray-600">
        {selectedCell || ''}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter a value or formula"
      />
    </div>
  );
}

export default FormulaBar;