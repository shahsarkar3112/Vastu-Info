
import React from 'react';
import { Suggestion, Direction } from '../types';
import { DIRECTIONS_CONFIG } from '../constants';
import Tooltip from './Tooltip';

interface ColorPickerProps {
  label: string;
  selected: string;
  direction: Direction;
  options: Suggestion[];
  onSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, selected, direction, options, onSelect }) => {
  const config = DIRECTIONS_CONFIG[direction];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          // Dynamic Reasoning: Combine the general color explanation with the specific direction's element/deity logic
          const dynamicReasoning = (
            <div className="space-y-1">
              <p className="font-bold text-indigo-300">{opt.name}</p>
              <p>{opt.explanation}</p>
              <p className="pt-1 mt-1 border-t border-slate-700 text-[9px] text-slate-400 italic">
                Reasoning: For the {config.label} ({config.element}), {opt.name} maintains directional harmony with {config.deity}.
              </p>
            </div>
          );

          return (
            <Tooltip key={opt.color} content={dynamicReasoning} width="w-64">
              <button
                onClick={() => onSelect(opt.color)}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                  selected === opt.color ? 'border-indigo-600 ring-2 ring-indigo-200 z-10' : 'border-slate-200'
                }`}
                style={{ backgroundColor: opt.color }}
                aria-label={`Select ${opt.name} for ${label}`}
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;
