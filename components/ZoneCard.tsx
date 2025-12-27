
import React from 'react';
import { Direction, ZoneState, RoomType, Element } from '../types';
import { DIRECTIONS_CONFIG, VASTU_RULES, ROOM_OPTIONS } from '../constants';
import Tooltip from './Tooltip';

interface ZoneCardProps {
  state: ZoneState;
  isActive: boolean;
  onClick: () => void;
  onChangeRoom: (type: RoomType) => void;
}

const ElementIcon: React.FC<{ element: Element }> = ({ element }) => {
  switch (element) {
    case 'Air':
      return (
        <svg className="w-full h-full text-sky-400/20 animate-[spin_10s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 3a9 9 0 0 0 0 18M3 12a9 9 0 0 1 18 0" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'Water':
      return (
        <svg className="w-full h-full text-blue-400/20 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case 'Fire':
      return (
        <svg className="w-full h-full text-orange-400/20 animate-bounce" style={{ animationDuration: '3s' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c0 0-4 4.5-4 8.5C8 13.5 10 16 12 16s4-2.5 4-5.5C16 6.5 12 2 12 2z" />
        </svg>
      );
    case 'Earth':
      return (
        <svg className="w-full h-full text-amber-600/10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l10 18H2L12 2z" />
        </svg>
      );
    case 'Space':
      return (
        <div className="w-full h-full relative">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 bg-indigo-300 rounded-full animate-ping" 
              style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }} 
            />
          ))}
        </div>
      );
    default:
      return null;
  }
};

const ZoneCard: React.FC<ZoneCardProps> = ({ state, isActive, onClick, onChangeRoom }) => {
  const config = DIRECTIONS_CONFIG[state.direction];
  const rule = VASTU_RULES[state.direction]?.[state.roomType];

  const getStatusColor = () => {
    if (state.roomType === 'empty') return 'bg-white';
    if (!rule) return 'bg-slate-50';
    if (rule.status === 'ideal') return 'bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-50';
    if (rule.status === 'avoid') return 'bg-rose-50 border-rose-200 shadow-sm shadow-rose-50';
    return 'bg-amber-50 border-amber-200 shadow-sm shadow-amber-50';
  };

  const getElementOverlayClass = (element: Element) => {
    switch (element) {
      case 'Air': return 'bg-sky-50/30';
      case 'Water': return 'bg-blue-50/30';
      case 'Fire': return 'bg-orange-50/30';
      case 'Earth': return 'bg-amber-50/30';
      case 'Space': return 'bg-indigo-50/30';
      default: return '';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`relative h-48 border-2 rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-500 overflow-hidden ${
        isActive ? 'ring-2 ring-indigo-500 border-indigo-400 shadow-2xl scale-[1.05] z-30' : 'hover:border-indigo-200 hover:shadow-lg'
      } ${getStatusColor()} ${getElementOverlayClass(config.element)}`}
    >
      {/* Element Visualization Layer */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
        <div className="w-24 h-24">
          <ElementIcon element={config.element} />
        </div>
      </div>

      {/* Wall Colors Visual Mockup - Scientific Grading Overlay */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-700">
        <div className="absolute top-0 left-0 w-full h-2 blur-[1px]" style={{ backgroundColor: state.wallColors[0] }} /> {/* North */}
        <div className="absolute top-0 right-0 h-full w-2 blur-[1px]" style={{ backgroundColor: state.wallColors[1] }} /> {/* East */}
        <div className="absolute bottom-0 left-0 w-full h-2 blur-[1px]" style={{ backgroundColor: state.wallColors[2] }} /> {/* South */}
        <div className="absolute top-0 left-0 h-full w-2 blur-[1px]" style={{ backgroundColor: state.wallColors[3] }} /> {/* West */}
      </div>

      {/* Energy Flow Particle Effect (Subtle) */}
      <div className={`absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-indigo-400/30 animate-ping ${isActive ? 'opacity-100' : 'opacity-0'}`} />

      <div className="text-center w-full z-10">
        <Tooltip content={config.description} width="w-40">
          <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase border-b border-dotted border-slate-300 bg-white/40 px-1 rounded-sm">{config.label}</span>
        </Tooltip>
        
        <div className="mt-1">
          <Tooltip content={`Deity: ${config.deity}. Element: ${config.element}`} position="bottom">
            <h4 className="font-bold text-slate-800 text-sm cursor-help bg-white/40 px-2 py-0.5 rounded-full inline-block">
              {config.deity} <span className="text-[10px] text-slate-500 font-medium">({config.element})</span>
            </h4>
          </Tooltip>
        </div>
        
        <select 
          className="mt-4 block w-full text-xs bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all font-medium text-slate-700 shadow-sm"
          value={state.roomType}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChangeRoom(e.target.value as RoomType)}
        >
          {ROOM_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {rule && (
        <Tooltip content={rule.reasoning} width="w-56" position="top">
          <div className={`absolute bottom-3 right-3 w-5 h-5 rounded-full flex items-center justify-center cursor-help transition-transform hover:scale-125 ${
            rule.status === 'ideal' ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 
            rule.status === 'avoid' ? 'bg-rose-500 shadow-lg shadow-rose-200' : 
            'bg-amber-500 shadow-lg shadow-amber-200'
          }`}>
            <span className="text-[10px] font-black text-white">{rule.status === 'ideal' ? '✓' : rule.status === 'avoid' ? '!' : '?'}</span>
          </div>
        </Tooltip>
      )}
      
      {/* Structural Anchor visualization */}
      {state.direction === 'C' && (
        <div className="absolute inset-0 border-2 border-indigo-200/40 rounded-2xl m-2 pointer-events-none" />
      )}
    </div>
  );
};

export default ZoneCard;
