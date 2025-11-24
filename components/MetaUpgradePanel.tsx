import React from 'react';
import { GameState } from '../types';
import { META_UPGRADES } from '../constants';
import { Star } from 'lucide-react';

interface MetaUpgradePanelProps {
  gameState: GameState;
  onPurchase: (upgradeId: string) => void;
}

export const MetaUpgradePanel: React.FC<MetaUpgradePanelProps> = ({ gameState, onPurchase }) => {
  const getUpgradeCost = (upgradeId: string): number => {
    const upgrade = META_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return 0;

    const currentLevel = gameState.metaUpgrades[upgradeId] || 0;
    if (currentLevel >= upgrade.maxLevel) return 0;

    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
  };

  const canAfford = (upgradeId: string): boolean => {
    const cost = getUpgradeCost(upgradeId);
    return cost > 0 && gameState.stamps >= cost;
  };

  const isMaxLevel = (upgradeId: string): boolean => {
    const upgrade = META_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return true;

    const currentLevel = gameState.metaUpgrades[upgradeId] || 0;
    return currentLevel >= upgrade.maxLevel;
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2 mb-2">
          <Star className="w-6 h-6" fill="currentColor" />
          Meta-Upgrades
        </h2>
        <p className="text-sm text-slate-400">
          Permanent upgrades purchased with stamps. Persist across prestiges.
        </p>
        <div className="mt-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-purple-900/30">
          <span className="text-xs text-slate-500 uppercase font-bold">Available Stamps</span>
          <p className="text-xl font-mono text-pink-500 flex items-center gap-1">
            <Star size={16} fill="currentColor" />
            {gameState.stamps}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
        {META_UPGRADES.map(upgrade => {
          const currentLevel = gameState.metaUpgrades[upgrade.id] || 0;
          const cost = getUpgradeCost(upgrade.id);
          const maxed = isMaxLevel(upgrade.id);
          const affordable = canAfford(upgrade.id);

          return (
            <div
              key={upgrade.id}
              className={`p-4 rounded-xl border transition-all ${
                maxed
                  ? 'bg-slate-900/50 border-slate-800 opacity-60'
                  : affordable
                  ? 'bg-slate-800 border-purple-600 hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-slate-900/50 border-slate-800 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-purple-200">{upgrade.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{upgrade.description}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xs text-slate-500">Level</div>
                  <div className="text-lg font-bold text-cyan-400">
                    {currentLevel}/{upgrade.maxLevel}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <div className="text-sm">
                  <span className="text-slate-500">Effect: </span>
                  <span className="text-emerald-400 font-bold">
                    {currentLevel > 0 ? `+${upgrade.effect(currentLevel)}%` : '0%'}
                  </span>
                </div>

                {!maxed && (
                  <button
                    onClick={() => onPurchase(upgrade.id)}
                    disabled={!affordable}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                      affordable
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Star size={14} fill={affordable ? 'currentColor' : 'none'} />
                      {cost}
                    </span>
                  </button>
                )}

                {maxed && (
                  <div className="px-4 py-2 rounded-lg bg-green-900/30 text-green-400 text-sm font-bold">
                    MAXED
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
