import React, { useState } from 'react';
import { GameState, AchievementCategory, AchievementRarity } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { Trophy, Lock } from 'lucide-react';

interface AchievementsPanelProps {
  gameState: GameState;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ gameState }) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'All'>('All');
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'All'>('All');

  const getRarityColor = (rarity: AchievementRarity): string => {
    switch (rarity) {
      case AchievementRarity.Common:
        return 'text-slate-400 border-slate-600';
      case AchievementRarity.Uncommon:
        return 'text-green-400 border-green-600';
      case AchievementRarity.Rare:
        return 'text-blue-400 border-blue-600';
      case AchievementRarity.Epic:
        return 'text-purple-400 border-purple-600';
      case AchievementRarity.Legendary:
        return 'text-orange-400 border-orange-600';
    }
  };

  const getRarityGlow = (rarity: AchievementRarity): string => {
    switch (rarity) {
      case AchievementRarity.Common:
        return '';
      case AchievementRarity.Uncommon:
        return 'shadow-[0_0_10px_rgba(34,197,94,0.3)]';
      case AchievementRarity.Rare:
        return 'shadow-[0_0_10px_rgba(59,130,246,0.3)]';
      case AchievementRarity.Epic:
        return 'shadow-[0_0_15px_rgba(168,85,247,0.4)]';
      case AchievementRarity.Legendary:
        return 'shadow-[0_0_20px_rgba(251,146,60,0.5)]';
    }
  };

  const unlockedAchievements = gameState.unlockedAchievements || [];

  const filteredAchievements = ACHIEVEMENTS.filter(achievement => {
    if (selectedCategory !== 'All' && achievement.category !== selectedCategory) return false;
    if (selectedRarity !== 'All' && achievement.rarity !== selectedRarity) return false;
    return true;
  });

  const totalUnlocked = ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id)).length;
  const progressPercent = Math.floor((totalUnlocked / ACHIEVEMENTS.length) * 100);

  const categoryCounts = Object.values(AchievementCategory).map(category => ({
    category,
    unlocked: ACHIEVEMENTS.filter(
      a => a.category === category && unlockedAchievements.includes(a.id)
    ).length,
    total: ACHIEVEMENTS.filter(a => a.category === category).length
  }));

  return (
    <div className="grid grid-cols-[320px_1fr] gap-6 h-full p-6 overflow-hidden">
      {/* Left Column: Stats & Filters */}
      <div className="flex flex-col space-y-4 overflow-y-auto pr-2 scrollbar-thin">
        {/* Progress Bar */}
        <div className="px-4 py-4 bg-slate-800/50 rounded-lg border border-yellow-900/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500 uppercase font-bold">Overall Progress</span>
            <span className="text-sm font-bold text-yellow-400">
              {totalUnlocked}/{ACHIEVEMENTS.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Category Stats */}
        <div className="bg-slate-800/30 rounded-lg border border-slate-700 p-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase mb-3">Category Progress</h3>
          <div className="space-y-2">
            {categoryCounts.map(({ category, unlocked, total }) => (
              <div
                key={category}
                className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded border border-slate-800"
              >
                <span className="text-xs text-slate-400">{category}</span>
                <span className="text-xs text-slate-300 font-bold">
                  {unlocked}/{total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/30 rounded-lg border border-slate-700 p-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase mb-3">Filters</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold block mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-yellow-500"
              >
                <option value="All">All Categories</option>
                {Object.values(AchievementCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 uppercase font-bold block mb-1">
                Rarity
              </label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-yellow-500"
              >
                <option value="All">All Rarities</option>
                {Object.values(AchievementRarity).map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Achievement List */}
      <div className="flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-bold text-slate-300">
            {selectedCategory === 'All' ? 'All Achievements' : selectedCategory}
            {selectedRarity !== 'All' && ` - ${selectedRarity}`}
          </h3>
          <span className="text-sm text-slate-500">
            {filteredAchievements.filter(a => unlockedAchievements.includes(a.id)).length}/{filteredAchievements.length} unlocked
          </span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
        {filteredAchievements.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          const isSecret = achievement.secretUntilUnlocked && !isUnlocked;
          const rarityColor = getRarityColor(achievement.rarity);
          const rarityGlow = getRarityGlow(achievement.rarity);

          return (
            <div
              key={achievement.id}
              className={`p-3 rounded-xl border transition-all ${
                isUnlocked
                  ? `bg-slate-800 ${rarityColor} ${rarityGlow}`
                  : 'bg-slate-900/30 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                    isUnlocked
                      ? 'bg-slate-950 border border-slate-700'
                      : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  {isSecret ? <Lock size={20} className="text-slate-600" /> : achievement.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`font-bold ${
                        isUnlocked ? 'text-slate-100' : 'text-slate-600'
                      }`}
                    >
                      {isSecret ? '???' : achievement.name}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${
                        isUnlocked ? rarityColor : 'text-slate-600 border-slate-700'
                      }`}
                    >
                      {achievement.rarity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    {isSecret ? 'Secret achievement - complete to reveal' : achievement.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/50 text-slate-500 border border-slate-800">
                      {achievement.category}
                    </span>
                    {isUnlocked && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-green-900/30 text-green-400 border border-green-800 flex items-center gap-1">
                        <Trophy size={10} fill="currentColor" />
                        UNLOCKED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

          {filteredAchievements.length === 0 && (
            <p className="text-center text-slate-500 text-sm mt-10">
              No achievements found with these filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
