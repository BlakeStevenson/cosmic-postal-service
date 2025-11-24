import React, { useState } from 'react';
import { GameState, ResearchCategory } from '../types';
import { RESEARCH } from '../constants';
import { Beaker, Lock, CheckCircle } from 'lucide-react';

interface ResearchPanelProps {
  gameState: GameState;
  onPurchase: (researchId: string) => void;
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({ gameState, onPurchase }) => {
  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory | 'All'>('All');
  const isUnlocked = (researchId: string): boolean => {
    const research = RESEARCH.find(r => r.id === researchId);
    if (!research) return false;

    // Already purchased
    if (gameState.completedResearch.includes(researchId)) return true;

    // Check prerequisite
    if (research.prerequisite) {
      return gameState.completedResearch.includes(research.prerequisite);
    }

    // No prerequisite, so it's unlocked
    return true;
  };

  const isPurchased = (researchId: string): boolean => {
    return gameState.completedResearch.includes(researchId);
  };

  const canAfford = (researchId: string): boolean => {
    const research = RESEARCH.find(r => r.id === researchId);
    if (!research) return false;
    return gameState.researchPoints >= research.cost;
  };

  const filteredResearch = RESEARCH.filter(research => {
    if (selectedCategory === 'All') return true;
    return research.category === selectedCategory;
  });

  const categoryCounts = Object.values(ResearchCategory).map(category => ({
    category,
    completed: RESEARCH.filter(
      r => r.category === category && gameState.completedResearch.includes(r.id)
    ).length,
    total: RESEARCH.filter(r => r.category === category).length
  }));

  const totalCompleted = gameState.completedResearch.length;
  const totalResearch = RESEARCH.length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Category Tabs */}
      <div className="flex border-b border-slate-700 overflow-x-auto bg-slate-900/50">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${
            selectedCategory === 'All'
              ? 'text-cyan-400 border-b-2 border-cyan-500 bg-slate-800'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          All ({totalCompleted}/{totalResearch})
        </button>
        {Object.values(ResearchCategory).map(category => {
          const count = categoryCounts.find(c => c.category === category);
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? 'text-cyan-400 border-b-2 border-cyan-500 bg-slate-800'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {category} ({count?.completed || 0}/{count?.total || 0})
            </button>
          );
        })}
      </div>

      {/* Research List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {filteredResearch.map(research => {
          const unlocked = isUnlocked(research.id);
          const purchased = isPurchased(research.id);
          const affordable = canAfford(research.id);

          return (
            <div
              key={research.id}
              className={`p-4 rounded-xl border transition-all ${
                purchased
                  ? 'bg-green-900/20 border-green-700/50'
                  : unlocked && affordable
                  ? 'bg-slate-800 border-cyan-600 hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : unlocked
                  ? 'bg-slate-900/50 border-slate-800 opacity-75'
                  : 'bg-slate-900/30 border-slate-800/50 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-cyan-200 flex items-center gap-2">
                    {research.name}
                    {purchased && <CheckCircle size={16} className="text-green-400" />}
                    {!unlocked && <Lock size={16} className="text-slate-600" />}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{research.description}</p>
                  <p className="text-xs text-emerald-400 mt-1 font-semibold">
                    {research.effect}
                  </p>
                  {research.prerequisite && !isPurchased(research.prerequisite) && (
                    <p className="text-xs text-orange-400 mt-2">
                      Requires: {RESEARCH.find(r => r.id === research.prerequisite)?.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <div className="text-sm">
                  <span className={`font-mono ${affordable ? 'text-cyan-400' : 'text-red-400'}`}>
                    <Beaker size={14} className="inline mr-1" />
                    {research.cost.toLocaleString()}
                  </span>
                </div>

                {!purchased && unlocked && (
                  <button
                    onClick={() => onPurchase(research.id)}
                    disabled={!affordable}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                      affordable
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Research
                  </button>
                )}

                {purchased && (
                  <div className="px-4 py-2 rounded-lg bg-green-900/30 text-green-400 text-sm font-bold">
                    COMPLETED
                  </div>
                )}

                {!unlocked && (
                  <div className="px-4 py-2 rounded-lg bg-slate-800/50 text-slate-600 text-sm font-bold flex items-center gap-1">
                    <Lock size={14} />
                    LOCKED
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredResearch.length === 0 && (
          <p className="text-center text-slate-500 text-sm mt-10">
            No research available in this category.
          </p>
        )}
      </div>
    </div>
  );
};
