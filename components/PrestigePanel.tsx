import React from 'react';
import { GameState } from '../types';
import { calculateStampsEarned, calculateShardsEarned, canSecondPrestige } from '../gameLogic';
import { History, Sparkles, AlertTriangle } from 'lucide-react';

interface PrestigePanelProps {
  gameState: GameState;
  onPrestige: () => void;
  onSecondPrestige: () => void;
}

export const PrestigePanel: React.FC<PrestigePanelProps> = ({
  gameState,
  onPrestige,
  onSecondPrestige
}) => {
  const stampsToEarn = calculateStampsEarned(gameState);
  const shardsToEarn = calculateShardsEarned(gameState);
  const canDoSecondPrestige = canSecondPrestige(gameState);

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-pink-400 flex items-center gap-2 mb-2">
          <History className="w-6 h-6" />
          Prestige
        </h2>
        <p className="text-sm text-slate-400">
          Reset your progress to gain permanent bonuses.
        </p>
      </div>

      {/* Stamp Prestige */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-pink-700/50">
        <h3 className="text-xl font-bold text-pink-300 mb-2 flex items-center gap-2">
          <Sparkles size={20} fill="currentColor" />
          Cosmic Reset (Stamps)
        </h3>

        <div className="space-y-2 mb-4">
          <div className="text-sm text-slate-300">
            <span className="text-slate-500">Letters delivered:</span>{' '}
            <span className="font-mono text-yellow-400">
              {gameState.lettersDelivered.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-slate-300">
            <span className="text-slate-500">Current stamps:</span>{' '}
            <span className="font-mono text-pink-400">{gameState.stamps}</span>
          </div>
          <div className="text-sm text-slate-300">
            <span className="text-slate-500">Stamps on prestige:</span>{' '}
            <span className="font-mono text-emerald-400 font-bold">
              +{stampsToEarn}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3 mb-4 text-xs text-slate-400">
          <p className="mb-2">
            <strong className="text-slate-300">Resets:</strong> Letters delivered, credits,
            buildings, and upgrades
          </p>
          <p className="mb-2">
            <strong className="text-slate-300">Keeps:</strong> Stamps, shards, meta-upgrades, and
            research
          </p>
          <p>
            <strong className="text-emerald-400">Gain:</strong> Stamps boost all production
            (diminishing returns)
          </p>
        </div>

        <button
          onClick={onPrestige}
          disabled={stampsToEarn === 0}
          className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
            stampsToEarn > 0
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          {stampsToEarn > 0
            ? `Reset & Gain ${stampsToEarn} Stamp${stampsToEarn !== 1 ? 's' : ''}`
            : 'Not enough progress to prestige'}
        </button>

        {stampsToEarn === 0 && (
          <p className="text-xs text-slate-500 text-center mt-2">
            Deliver more letters to earn stamps (need 1B+ letters)
          </p>
        )}
      </div>

      {/* Shard Prestige */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          canDoSecondPrestige
            ? 'bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-700/50'
            : 'bg-slate-900/30 border-slate-800/50 opacity-50'
        }`}
      >
        <h3 className="text-xl font-bold text-orange-300 mb-2 flex items-center gap-2">
          <AlertTriangle size={20} />
          Reality Fracture (Shards)
        </h3>

        <div className="space-y-2 mb-4">
          <div className="text-sm text-slate-300">
            <span className="text-slate-500">Lifetime stamps:</span>{' '}
            <span className="font-mono text-pink-400">{gameState.lifetimeStamps}</span>
          </div>
          <div className="text-sm text-slate-300">
            <span className="text-slate-500">Current shards:</span>{' '}
            <span className="font-mono text-orange-400">{gameState.shards}</span>
          </div>
          <div className="text-sm text-slate-300">
            <span className="text-slate-500">Shards on prestige:</span>{' '}
            <span className="font-mono text-emerald-400 font-bold">
              +{shardsToEarn}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3 mb-4 text-xs text-slate-400">
          <p className="mb-2 text-orange-400 font-bold">
            <AlertTriangle size={12} className="inline mr-1" />
            WARNING: Hard reset!
          </p>
          <p className="mb-2">
            <strong className="text-slate-300">Resets EVERYTHING:</strong> All letters, credits,
            buildings, upgrades, stamps, and meta-upgrades
          </p>
          <p className="mb-2">
            <strong className="text-slate-300">Keeps:</strong> Shards and research
          </p>
          <p>
            <strong className="text-emerald-400">Gain:</strong> Shards give powerful multipliers
            (1.5x per shard)
          </p>
        </div>

        <button
          onClick={onSecondPrestige}
          disabled={!canDoSecondPrestige}
          className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
            canDoSecondPrestige
              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          {canDoSecondPrestige
            ? `HARD RESET & Gain ${shardsToEarn} Shard${shardsToEarn !== 1 ? 's' : ''}`
            : 'Not enough lifetime stamps'}
        </button>

        {!canDoSecondPrestige && (
          <p className="text-xs text-slate-500 text-center mt-2">
            Need 100+ lifetime stamps for first shard
          </p>
        )}
      </div>
    </div>
  );
};
