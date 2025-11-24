import React from 'react';
import { Building, GameState } from '../types';
import { getBuildingCost } from '../gameLogic';
import { Sparkles } from 'lucide-react';

interface BuildingItemProps {
  building: Building;
  count: number;
  canAfford: boolean;
  onBuy: (id: string) => void;
  multiplier: number;
  gameState?: GameState; // Optional for cost calculation
}

export const BuildingItem: React.FC<BuildingItemProps> = ({ building, count, canAfford, onBuy, multiplier, gameState }) => {
  // Use new cost calculation if gameState provided, otherwise fallback to old formula
  const currentCost = gameState
    ? getBuildingCost(building, count, gameState)
    : Math.floor(building.baseCost * Math.pow(building.costFactor, count));
  const currentProduction = (building.baseProduction * multiplier) * (count > 0 ? count : 1);

  return (
    <button
      onClick={() => onBuy(building.id)}
      disabled={!canAfford}
      className={`w-full flex items-center p-3 mb-2 rounded-xl border transition-all duration-200 group text-left relative overflow-hidden
        ${canAfford 
          ? 'bg-slate-800 border-slate-600 hover:border-purple-500 hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
          : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'}
      `}
    >
      {/* Progress bar effect behind */}
      {canAfford && (
         <div className="absolute left-0 bottom-0 h-1 bg-purple-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      )}

      <div className="flex-shrink-0 h-12 w-12 bg-slate-950 rounded-lg flex items-center justify-center text-2xl mr-4 shadow-inner border border-slate-700">
        {building.icon}
      </div>

      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-100">{building.name}</span>
          <span className="text-xs font-mono text-slate-400">Qty: {count}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className={`text-sm font-mono ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
            🪙 {currentCost.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <Sparkles size={10} />
            +{building.baseProduction * multiplier}/s
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
            {building.description}
        </div>
      </div>
    </button>
  );
};