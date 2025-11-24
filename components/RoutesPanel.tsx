import React, { useState, useEffect } from 'react';
import { GameState, RouteAllocation, Stage } from '../types';
import { getRoutesForStage, getRouteById } from '../routes';
import { Map, TrendingUp, Beaker, Sparkles, AlertCircle } from 'lucide-react';

interface RoutesPanelProps {
  gameState: GameState;
  onUpdateRoutes: (stage: Stage, allocations: RouteAllocation[]) => void;
}

export const RoutesPanel: React.FC<RoutesPanelProps> = ({ gameState, onUpdateRoutes }) => {
  const currentStage = gameState.currentStage;
  const stageRoutes = getRoutesForStage(currentStage);
  const currentAllocations = gameState.routes[currentStage]?.allocations || [];

  // Local state for editing allocations
  const [editingAllocations, setEditingAllocations] = useState<RouteAllocation[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize editing state from game state
  useEffect(() => {
    setEditingAllocations([...currentAllocations]);
    setHasChanges(false);
  }, [currentStage]);

  // Calculate total allocation
  const totalAllocation = editingAllocations.reduce((sum, alloc) => sum + alloc.allocation, 0);
  const isValid = totalAllocation <= 100 && totalAllocation >= 0;

  // Handle slider change
  const handleAllocationChange = (routeId: string, newValue: number) => {
    const newAllocations = editingAllocations.map(alloc =>
      alloc.routeId === routeId
        ? { ...alloc, allocation: Math.max(0, Math.min(100, newValue)) }
        : alloc
    );
    setEditingAllocations(newAllocations);
    setHasChanges(true);
  };

  // Apply changes
  const handleApply = () => {
    if (isValid) {
      onUpdateRoutes(currentStage, editingAllocations);
      setHasChanges(false);
    }
  };

  // Reset to current game state
  const handleReset = () => {
    setEditingAllocations([...currentAllocations]);
    setHasChanges(false);
  };

  // Auto-balance allocations
  const handleAutoBalance = () => {
    const equalAlloc = 100 / stageRoutes.length;
    const balanced = stageRoutes.map(route => ({
      routeId: route.id,
      allocation: equalAlloc
    }));
    setEditingAllocations(balanced);
    setHasChanges(true);
  };

  if (stageRoutes.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400">
        <Map className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No routes available for this stage.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 p-6 bg-gradient-to-br from-indigo-950/30 to-slate-950">
        <div className="flex items-center gap-3 mb-2">
          <Map className="w-6 h-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Route Management</h2>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Distribute your delivery capacity across sectors. Different routes provide trade-offs between
          production, research, and event frequency.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="text-slate-500">Current Stage:</span>
          <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
            {currentStage}
          </span>
        </div>
      </div>

      {/* Routes List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {stageRoutes.map(route => {
          const alloc = editingAllocations.find(a => a.routeId === route.id);
          const allocValue = alloc?.allocation || 0;

          return (
            <div
              key={route.id}
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
            >
              {/* Route Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{route.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{route.description}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-indigo-400">
                    {allocValue.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-500">allocation</div>
                </div>
              </div>

              {/* Effects Display */}
              <div className="flex flex-wrap gap-2 mb-3">
                {route.productionMultiplier !== undefined && route.productionMultiplier !== 1 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                    <TrendingUp className="w-3 h-3" />
                    <span>
                      {route.productionMultiplier > 1 ? '+' : ''}
                      {((route.productionMultiplier - 1) * 100).toFixed(0)}% Production
                    </span>
                  </div>
                )}
                {route.researchMultiplier !== undefined && route.researchMultiplier !== 1 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Beaker className="w-3 h-3" />
                    <span>
                      {route.researchMultiplier > 1 ? '+' : ''}
                      {((route.researchMultiplier - 1) * 100).toFixed(0)}% Research
                    </span>
                  </div>
                )}
                {route.eventChanceMultiplier !== undefined && route.eventChanceMultiplier !== 1 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sparkles className="w-3 h-3" />
                    <span>
                      {route.eventChanceMultiplier > 1 ? '+' : ''}
                      {((route.eventChanceMultiplier - 1) * 100).toFixed(0)}% Events
                    </span>
                  </div>
                )}
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={allocValue}
                  onChange={(e) => handleAllocationChange(route.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(99 102 241) ${allocValue}%, rgb(30 41 59) ${allocValue}%, rgb(30 41 59) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with Status and Actions */}
      <div className="border-t border-slate-800 p-4 bg-slate-950/80 backdrop-blur">
        {/* Total Allocation Display */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total Allocation:</span>
            <span className={`text-lg font-bold ${
              totalAllocation > 100 ? 'text-red-400' :
              totalAllocation < 100 ? 'text-amber-400' :
              'text-green-400'
            }`}>
              {totalAllocation.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                totalAllocation > 100 ? 'bg-red-500' :
                totalAllocation < 100 ? 'bg-amber-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, totalAllocation)}%` }}
            />
          </div>
          {!isValid && (
            <div className="flex items-center gap-2 mt-2 text-xs text-red-400">
              <AlertCircle className="w-3 h-3" />
              <span>Total allocation must be between 0% and 100%</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAutoBalance}
            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            Auto-Balance
          </button>
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            disabled={!hasChanges || !isValid}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
