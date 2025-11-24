import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Stage } from './types';
import { BUILDINGS, UPGRADES, META_UPGRADES, RESEARCH, ACHIEVEMENTS } from './constants';
import * as Config from './src/config';
import { BuildingItem } from './components/BuildingItem';
import { MailFeed } from './components/MailFeed';
import { MetaUpgradePanel } from './components/MetaUpgradePanel';
import { ResearchPanel } from './components/ResearchPanel';
import { PrestigePanel } from './components/PrestigePanel';
import { AchievementsPanel } from './components/AchievementsPanel';
import { ContractsPanel } from './components/ContractsPanel';
import { RoutesPanel } from './components/RoutesPanel';
import {
  calculateStampsEarned,
  calculateShardsEarned,
  getBuildingCost,
  getShardMultiplier,
  getMetaAutoBonus,
  getMetaClickBonus,
  getResearchAutoBonus,
  getResearchClickBonus,
  getUnlockedStages,
  getCurrentStage,
  getResearchPointsPerSecond,
  updateContractProgress,
  activateContract,
  abandonContract,
  getObjectiveProgress,
  shouldUnlockRoutes,
  getRouteProductionMultiplier,
  getRouteResearchMultiplier
} from './gameLogic';
import { initializeStoryProgress } from './storyLogic';
import { getContractById, getAvailableContracts } from './contracts';
import { getRoutesForStage } from './routes';
import { RoutesState, Stage as StageEnum } from './types';
import { Rocket, Zap, Star, Package, TrendingUp, Gem, Trophy, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'cosmic-postal-game-state-v2';
const SAVE_VERSION = 2;

// Helper function to create default routes state
const createDefaultRoutesState = (): RoutesState => {
  const stages = [Stage.Local, Stage.Solar, Stage.Interstellar, Stage.Galactic, Stage.Multiverse];
  const state: RoutesState = {};

  for (const stage of stages) {
    const routes = getRoutesForStage(stage);
    if (routes.length === 0) continue;

    // Distribute allocations evenly by default
    const defaultAlloc = 100 / routes.length;
    state[stage] = {
      stage,
      allocations: routes.map(route => ({
        routeId: route.id,
        allocation: defaultAlloc
      }))
    };
  }

  return state;
};

// Default state with all new fields
const getDefaultGameState = (): GameState => ({
  version: SAVE_VERSION,
  credits: 0,
  totalCreditsEarned: 0,
  lettersDelivered: 0,
  lifetimeLettersDelivered: 0,
  stamps: 0,
  lifetimeStamps: 0,
  shards: 0,
  clickCount: 0,
  startTime: Date.now(),
  currentStage: Stage.Local,
  unlockedStages: [Stage.Local],
  buildings: {},
  upgrades: [],
  metaUpgrades: {},
  researchPoints: 0,
  completedResearch: [],
  totalPrestiges: 0,
  lastPrestigeTime: Date.now(),
  unlockedAchievements: [],
  // Contracts
  contractsUnlocked: false,
  availableContracts: [],
  activeContract: null,
  completedContracts: [],
  failedContracts: [],
  totalContractsCompleted: 0,
  // Story chains
  storyProgress: {},
  lastStoryEventAt: undefined,
  storySettings: {
    storyChanceWeight: Config.STORY_MAIL_CHANCE_WEIGHT,
  },
  // Routes system
  routes: createDefaultRoutesState(),
  routesUnlocked: false,
});

const App: React.FC = () => {
  // --- State with localStorage hydration ---
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window === 'undefined') return getDefaultGameState();

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultGameState();

      const parsed = JSON.parse(raw) as Partial<GameState>;
      if (!parsed || typeof parsed !== 'object') return getDefaultGameState();

      // Migration: merge with defaults to handle new fields
      let migrated: GameState = {
        ...getDefaultGameState(),
        ...parsed,
        version: SAVE_VERSION
      };

      // Update unlocked stages based on current state
      migrated.unlockedStages = getUnlockedStages(migrated);
      migrated.currentStage = getCurrentStage(migrated.unlockedStages);

      // Initialize story progress for backwards compatibility
      migrated = initializeStoryProgress(migrated);

      // Initialize routes for backwards compatibility
      if (!migrated.routes) {
        migrated.routes = createDefaultRoutesState();
      }
      if (migrated.routesUnlocked === undefined) {
        migrated.routesUnlocked = false;
      }

      return migrated;
    } catch {
      return getDefaultGameState();
    }
  });

  const [lps, setLps] = useState(0); // letters per second
  const [rps, setRps] = useState(0); // research points per second
  const [lastTick, setLastTick] = useState(Date.now());
  const [activeTab, setActiveTab] = useState<
    'buildings' | 'upgrades' | 'meta' | 'prestige' | 'contracts' | 'routes'
  >('buildings');
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [researchModalOpen, setResearchModalOpen] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; val: number } | null>(
    null
  );
  const [achievementNotification, setAchievementNotification] = useState<{
    id: string;
    name: string;
    icon: string;
    rarity: string;
  } | null>(null);
  const [contractNotification, setContractNotification] = useState<{
    type: 'completed' | 'failed';
    name: string;
    reward?: string;
  } | null>(null);

  // Debugging
  if (typeof window !== 'undefined') {
    (window as any).gameState = gameState;
    (window as any).setGameState = setGameState;
    (window as any).addLetters = (amt: number) =>
      setGameState(prev => ({
        ...prev,
        credits: prev.credits + amt,
        lettersDelivered: prev.lettersDelivered + amt
      }));
  }

  // --- Persist to localStorage ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }, [gameState]);

  // --- Calculate Multipliers ---
  const getGlobalMultiplier = useCallback(() => {
    let multiplier = 1;

    // Apply upgrade multipliers
    gameState.upgrades.forEach(upId => {
      const up = UPGRADES.find(u => u.id === upId);
      if (up && up.type === 'GLOBAL_PRODUCTION') {
        multiplier *= up.multiplier;
      }
    });

    // Apply prestige bonuses (shards only - stamps must be spent on meta-upgrades)
    multiplier *= getShardMultiplier(gameState.shards);

    // Apply meta-upgrades
    multiplier *= getMetaAutoBonus(gameState);

    // Apply Network Expansion meta-upgrade
    const networkExpansion = gameState.metaUpgrades['network_expansion'] || 0;
    if (networkExpansion > 0) {
      multiplier *= (1 + networkExpansion * 0.03); // +3% per level
    }

    // Apply research
    multiplier *= getResearchAutoBonus(gameState);

    return multiplier;
  }, [gameState.upgrades, gameState.shards, gameState.metaUpgrades, gameState.completedResearch]);

  const getClickValue = useCallback(() => {
    let val = 1;

    // Apply click upgrade multipliers
    gameState.upgrades.forEach(upId => {
      const up = UPGRADES.find(u => u.id === upId);
      if (up && up.type === 'CLICK') {
        val *= up.multiplier;
      }
    });

    // Buildings add to click power
    const totalBuildings = Object.values(gameState.buildings).reduce((a, b) => a + b, 0);
    val += totalBuildings * 0.1;

    // Apply bonuses (shards only - stamps must be spent on meta-upgrades)
    val *= getShardMultiplier(gameState.shards);
    val *= getMetaClickBonus(gameState);
    val *= getResearchClickBonus(gameState);

    return val;
  }, [
    gameState.upgrades,
    gameState.buildings,
    gameState.shards,
    gameState.metaUpgrades,
    gameState.completedResearch
  ]);

  // --- Calculate LPS (Letters Per Second) ---
  useEffect(() => {
    let newLps = 0;
    const globalMult = getGlobalMultiplier();

    Object.entries(gameState.buildings).forEach(([id, count]) => {
      const building = BUILDINGS.find(b => b.id === id);
      if (building && count > 0) {
        let buildingMult = 1;

        // Apply building-specific upgrades
        gameState.upgrades.forEach(upId => {
          const up = UPGRADES.find(u => u.id === upId);
          if (up && up.type === 'BUILDING_PRODUCTION' && up.targetId === id) {
            buildingMult *= up.multiplier;
          }
        });

        newLps += building.baseProduction * count * buildingMult;
      }
    });

    // Apply route multiplier
    const routeMult = getRouteProductionMultiplier(gameState);

    setLps(newLps * globalMult * routeMult);
  }, [gameState.buildings, gameState.upgrades, gameState.routes, gameState.routesUnlocked, getGlobalMultiplier]);

  // --- Calculate RPS (Research Points Per Second) ---
  useEffect(() => {
    const baseRps = getResearchPointsPerSecond(lps, gameState);

    // Apply route multiplier for research
    const routeResearchMult = getRouteResearchMultiplier(gameState);

    // Apply meta-upgrade bonus
    const metaBonus = 1 + (gameState.metaUpgrades['research_speed'] || 0) * 0.1;

    setRps(baseRps * metaBonus * routeResearchMult);
  }, [lps, gameState.completedResearch, gameState.metaUpgrades, gameState.routes, gameState.routesUnlocked]);

  // --- Game Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaS = (now - lastTick) / 1000;

      if (deltaS > 0) {
        setGameState(prev => {
          const lettersEarned = lps * deltaS;
          const researchEarned = rps * deltaS;

          let newState = {
            ...prev,
            credits: prev.credits + lettersEarned,
            totalCreditsEarned: prev.totalCreditsEarned + lettersEarned,
            lettersDelivered: prev.lettersDelivered + lettersEarned,
            lifetimeLettersDelivered: prev.lifetimeLettersDelivered + lettersEarned,
            researchPoints: prev.researchPoints + researchEarned
          };

          // Update contract progress
          if (newState.activeContract) {
            const updatedState = updateContractProgress(newState, lettersEarned, lps, 0);

            // Check if contract was completed or failed
            if (!updatedState.activeContract && prev.activeContract) {
              const contract = getContractById(prev.activeContract.contractId);
              if (contract) {
                if (updatedState.completedContracts.includes(contract.id)) {
                  // Contract completed
                  const rewardParts = [];
                  if (contract.reward.credits) rewardParts.push(`${contract.reward.credits.toLocaleString()} letters`);
                  if (contract.reward.stamps) rewardParts.push(`${contract.reward.stamps} stamps`);
                  if (contract.reward.researchPoints) rewardParts.push(`${contract.reward.researchPoints} RP`);

                  setContractNotification({
                    type: 'completed',
                    name: contract.name,
                    reward: rewardParts.join(', ')
                  });
                  setTimeout(() => setContractNotification(null), Config.CONTRACT_NOTIFICATION_DURATION_MS);
                } else if (updatedState.failedContracts.includes(contract.id) && !prev.failedContracts.includes(contract.id)) {
                  // Contract failed
                  setContractNotification({
                    type: 'failed',
                    name: contract.name
                  });
                  setTimeout(() => setContractNotification(null), Config.CONTRACT_NOTIFICATION_DURATION_MS);
                }
              }
            }

            return updatedState;
          }

          return newState;
        });
      }

      setLastTick(now);
    }, Config.GAME_LOOP_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [lps, rps, lastTick]);

  // --- Stage Unlocking ---
  useEffect(() => {
    const newUnlockedStages = getUnlockedStages(gameState);
    const newCurrentStage = getCurrentStage(newUnlockedStages);

    if (
      JSON.stringify(newUnlockedStages) !== JSON.stringify(gameState.unlockedStages) ||
      newCurrentStage !== gameState.currentStage
    ) {
      setGameState(prev => ({
        ...prev,
        unlockedStages: newUnlockedStages,
        currentStage: newCurrentStage
      }));
    }
  }, [gameState.lettersDelivered, gameState.stamps, gameState.shards]);

  // --- Routes System Unlocking ---
  useEffect(() => {
    if (!gameState.routesUnlocked && shouldUnlockRoutes(gameState)) {
      setGameState(prev => ({
        ...prev,
        routesUnlocked: true
      }));

      // Optional: Add a notification that routes are unlocked
      // You could trigger a mail message here if desired
    }
  }, [gameState.unlockedStages, gameState.routesUnlocked]);

  // --- Achievement Checking ---
  useEffect(() => {
    const unlockedAchievements = gameState.unlockedAchievements || [];

    ACHIEVEMENTS.forEach(achievement => {
      // Skip if already unlocked
      if (unlockedAchievements.includes(achievement.id)) return;

      // Check if achievement should be unlocked
      try {
        if (achievement.checkUnlock(gameState)) {
          // Unlock the achievement
          setGameState(prev => ({
            ...prev,
            unlockedAchievements: [...prev.unlockedAchievements, achievement.id]
          }));

          // Show notification
          setAchievementNotification({
            id: achievement.id,
            name: achievement.name,
            icon: achievement.icon,
            rarity: achievement.rarity
          });

          // Clear notification after configured duration
          setTimeout(() => {
            setAchievementNotification(null);
          }, Config.ACHIEVEMENT_NOTIFICATION_DURATION_MS);
        }
      } catch (e) {
        console.error('Error checking achievement', achievement.id, e);
      }
    });
  }, [
    gameState.credits,
    gameState.lettersDelivered,
    gameState.lifetimeLettersDelivered,
    gameState.clickCount,
    gameState.stamps,
    gameState.lifetimeStamps,
    gameState.shards,
    gameState.totalPrestiges,
    gameState.buildings,
    gameState.upgrades,
    gameState.completedResearch,
    gameState.metaUpgrades,
    gameState.unlockedStages,
    gameState.startTime
  ]);

  // --- Handlers ---
  const handleClick = (e: React.MouseEvent) => {
    const val = getClickValue();
    setGameState(prev => {
      let newState = {
        ...prev,
        credits: prev.credits + val,
        totalCreditsEarned: prev.totalCreditsEarned + val,
        lettersDelivered: prev.lettersDelivered + val,
        lifetimeLettersDelivered: prev.lifetimeLettersDelivered + val,
        clickCount: prev.clickCount + 1
      };

      // Update contract progress for clicks
      if (newState.activeContract) {
        newState = updateContractProgress(newState, val, lps, 1);

        // Check if contract was completed or failed by this click
        if (!newState.activeContract && prev.activeContract) {
          const contract = getContractById(prev.activeContract.contractId);
          if (contract) {
            if (newState.completedContracts.includes(contract.id)) {
              // Contract completed
              const rewardParts = [];
              if (contract.reward.credits) rewardParts.push(`${contract.reward.credits.toLocaleString()} letters`);
              if (contract.reward.stamps) rewardParts.push(`${contract.reward.stamps} stamps`);
              if (contract.reward.researchPoints) rewardParts.push(`${contract.reward.researchPoints} RP`);

              setContractNotification({
                type: 'completed',
                name: contract.name,
                reward: rewardParts.join(', ')
              });
              setTimeout(() => setContractNotification(null), Config.CONTRACT_NOTIFICATION_DURATION_MS);
            } else if (newState.failedContracts.includes(contract.id) && !prev.failedContracts.includes(contract.id)) {
              // Contract failed
              setContractNotification({
                type: 'failed',
                name: contract.name
              });
              setTimeout(() => setContractNotification(null), Config.CONTRACT_NOTIFICATION_DURATION_MS);
            }
          }
        }
      }

      return newState;
    });

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setClickEffect({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      val
    });
    setTimeout(() => setClickEffect(null), Config.CLICK_EFFECT_DURATION_MS);
  };

  const buyBuilding = (id: string) => {
    const building = BUILDINGS.find(b => b.id === id);
    if (!building) return;

    const currentCount = gameState.buildings[id] || 0;
    const cost = getBuildingCost(building, currentCount, gameState);

    if (gameState.credits >= cost) {
      setGameState(prev => ({
        ...prev,
        credits: prev.credits - cost,
        buildings: {
          ...prev.buildings,
          [id]: currentCount + 1
        }
      }));
    }
  };

  const buyUpgrade = (id: string) => {
    const upgrade = UPGRADES.find(u => u.id === id);
    if (!upgrade) return;

    if (gameState.credits >= upgrade.baseCost && !gameState.upgrades.includes(id)) {
      setGameState(prev => ({
        ...prev,
        credits: prev.credits - upgrade.baseCost,
        upgrades: [...prev.upgrades, id]
      }));
    }
  };

  const buyMetaUpgrade = (upgradeId: string) => {
    const upgrade = META_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const currentLevel = gameState.metaUpgrades[upgradeId] || 0;
    if (currentLevel >= upgrade.maxLevel) return;

    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));

    if (gameState.stamps >= cost) {
      setGameState(prev => ({
        ...prev,
        stamps: prev.stamps - cost,
        metaUpgrades: {
          ...prev.metaUpgrades,
          [upgradeId]: currentLevel + 1
        }
      }));
    }
  };

  const buyResearch = (researchId: string) => {
    const research = RESEARCH.find(r => r.id === researchId);
    if (!research) return;

    if (gameState.completedResearch.includes(researchId)) return;

    // Check prerequisite
    if (research.prerequisite && !gameState.completedResearch.includes(research.prerequisite)) {
      return;
    }

    if (gameState.researchPoints >= research.cost) {
      setGameState(prev => ({
        ...prev,
        researchPoints: prev.researchPoints - research.cost,
        completedResearch: [...prev.completedResearch, researchId]
      }));
    }
  };

  const handlePrestige = () => {
    const stampsEarned = calculateStampsEarned(gameState);
    if (stampsEarned === 0) return;

    if (
      window.confirm(
        `Reset this run? You'll gain ${stampsEarned} stamp${
          stampsEarned !== 1 ? 's' : ''
        }.\n\nYou will keep: stamps, shards, meta-upgrades, and research.\nYou will lose: letters, credits, buildings, and upgrades.`
      )
    ) {
      setGameState(prev => ({
        ...getDefaultGameState(),
        version: SAVE_VERSION,
        stamps: prev.stamps + stampsEarned,
        lifetimeStamps: prev.lifetimeStamps + stampsEarned,
        shards: prev.shards,
        lifetimeLettersDelivered: prev.lifetimeLettersDelivered,
        metaUpgrades: prev.metaUpgrades,
        completedResearch: prev.completedResearch,
        researchPoints: prev.researchPoints,
        totalPrestiges: prev.totalPrestiges + 1,
        lastPrestigeTime: Date.now(),
        // Preserve contract completion history
        completedContracts: prev.completedContracts,
        totalContractsCompleted: prev.totalContractsCompleted,
        unlockedStages: getUnlockedStages({
          ...prev,
          stamps: prev.stamps + stampsEarned
        })
      }));

      setLps(0);
      setLastTick(Date.now());
    }
  };

  const handleSecondPrestige = () => {
    const shardsEarned = calculateShardsEarned(gameState);
    if (shardsEarned === 0) return;

    if (
      window.confirm(
        `⚠️ HARD RESET ⚠️\n\nThis will reset EVERYTHING including stamps and meta-upgrades!\n\nYou'll gain ${shardsEarned} shard${
          shardsEarned !== 1 ? 's' : ''
        } (1.5x multiplier each).\n\nOnly shards and research will persist.\n\nAre you absolutely sure?`
      )
    ) {
      setGameState(prev => ({
        ...getDefaultGameState(),
        version: SAVE_VERSION,
        shards: prev.shards + shardsEarned,
        completedResearch: prev.completedResearch,
        researchPoints: prev.researchPoints,
        lifetimeStamps: prev.lifetimeStamps,
        lifetimeLettersDelivered: prev.lifetimeLettersDelivered,
        // Preserve contract completion history
        completedContracts: prev.completedContracts,
        totalContractsCompleted: prev.totalContractsCompleted
      }));

      setLps(0);
      setRps(0);
      setLastTick(Date.now());
    }
  };

  const handleActivateContract = (contractId: string) => {
    setGameState(prev => activateContract(prev, contractId));
  };

  const handleAbandonContract = () => {
    if (window.confirm('Abandon this contract? It will be marked as failed.')) {
      setGameState(prev => abandonContract(prev));
    }
  };

  // --- Available Buildings & Upgrades with Unlock Conditions ---
  const availableBuildings = BUILDINGS.filter(b => {
    // Check if stage is unlocked
    if (!gameState.unlockedStages.includes(b.stage)) return false;

    // Check unlock condition
    if (b.unlockCondition && !b.unlockCondition(gameState)) return false;

    return true;
  });

  const availableUpgrades = UPGRADES.filter(u => {
    // Already purchased
    if (gameState.upgrades.includes(u.id)) return false;

    // Check if stage is unlocked
    if (!gameState.unlockedStages.includes(u.stage)) return false;

    // Check unlock condition
    if (u.unlockCondition && !u.unlockCondition(gameState)) return false;

    return true;
  });

  // --- Render ---
  return (
    <div className="h-screen w-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0014] to-black text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Header / Stats */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide uppercase">
              Cosmic Postal Svc.
            </h1>
            <p className="text-xs text-purple-400 font-mono tracking-widest">
              {gameState.currentStage.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-center">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Letters</p>
            <p className="text-lg font-mono text-yellow-400">
              📧 {Math.floor(gameState.credits).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Per Second</p>
            <p className="text-lg font-mono text-emerald-400 flex items-center gap-1 justify-center">
              <Zap size={14} fill="currentColor" />
              {lps.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Stamps</p>
            <p className="text-lg font-mono text-pink-500 flex items-center gap-1 justify-center">
              <Star size={14} fill="currentColor" />
              {gameState.stamps}
            </p>
          </div>
          {gameState.shards > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Shards</p>
              <p className="text-lg font-mono text-orange-400 flex items-center gap-1 justify-center">
                <Gem size={14} />
                {gameState.shards}
              </p>
            </div>
          )}
          <button
            onClick={() => setResearchModalOpen(true)}
            className="group transition-all hover:scale-105"
          >
            <p className="text-xs text-slate-500 uppercase font-bold">Research</p>
            <p className="text-lg font-mono text-cyan-400 flex items-center gap-1 justify-center group-hover:text-cyan-300 transition-colors">
              🧪 {Math.floor(gameState.researchPoints).toLocaleString()}
            </p>
          </button>
          <button
            onClick={() => setAchievementsModalOpen(true)}
            className="group transition-all hover:scale-105"
          >
            <p className="text-xs text-slate-500 uppercase font-bold">Achievements</p>
            <p className="text-lg font-mono text-yellow-400 flex items-center gap-1 justify-center group-hover:text-yellow-300 transition-colors">
              <Trophy size={14} fill="currentColor" />
              {gameState.unlockedAchievements.length}/{ACHIEVEMENTS.length}
            </p>
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Interaction */}
        <section className="flex-1 flex flex-col relative p-8 items-center justify-center border-r border-slate-800/50">
          <div className="absolute top-20 left-20 w-32 h-32 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative group">
            <button
              onClick={handleClick}
              className="w-64 h-64 rounded-full bg-gradient-to-br from-indigo-600 to-purple-800 shadow-[0_0_50px_rgba(79,70,229,0.3)]
                     border-8 border-slate-900/80 active:scale-95 transition-transform duration-100 z-20 relative flex flex-col items-center justify-center
                     hover:shadow-[0_0_80px_rgba(168,85,247,0.5)] hover:border-purple-500/30"
            >
              <Package className="w-24 h-24 text-white drop-shadow-lg group-hover:animate-float" />
              <span className="mt-2 text-sm font-bold text-indigo-200">DELIVER</span>
            </button>

            {clickEffect && (
              <div
                className="absolute pointer-events-none text-2xl font-bold text-white animate-[ping_0.5s_ease-out_forwards]"
                style={{ left: clickEffect.x, top: clickEffect.y - 50 }}
              >
                +{Math.floor(clickEffect.val)}
              </div>
            )}
          </div>

          <div className="absolute top-8 left-8 text-slate-400 text-xs font-mono space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp size={12} />
              <span>
                Multiplier: {getGlobalMultiplier().toFixed(2)}x
              </span>
            </div>
            <div>Click Power: {getClickValue().toFixed(1)}</div>
            <div>Research/s: {rps.toFixed(1)}</div>
          </div>
        </section>

        {/* Center Column: Mail Feed */}
        <section className="w-80 lg:w-96 flex flex-col border-r border-slate-800/50 bg-slate-950/30 backdrop-blur-sm p-4">
          <MailFeed
            stage={gameState.currentStage}
            gameState={gameState}
            onStateUpdate={setGameState}
          />
        </section>

        {/* Right Column: Multi-Tab Panel */}
        <section className="w-80 lg:w-[28rem] flex flex-col bg-slate-950 border-l border-slate-800 z-10 shadow-2xl">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 overflow-x-auto">
            {[
              { id: 'buildings', label: 'Buildings', badge: null },
              { id: 'upgrades', label: 'Upgrades', badge: availableUpgrades.length || null },
              { id: 'contracts', label: 'Contracts', badge: gameState.activeContract ? '!' : null },
              ...(gameState.routesUnlocked ? [{ id: 'routes', label: 'Routes', badge: null }] : []),
              { id: 'meta', label: 'Meta', badge: null },
              { id: 'prestige', label: 'Prestige', badge: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-2 text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-b-2 border-purple-500 bg-slate-900'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full ${
                    tab.badge === '!'
                      ? 'bg-cyan-600 text-white animate-pulse'
                      : 'bg-purple-600 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'buildings' && (
              <div className="flex flex-col h-full p-4 overflow-hidden">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-emerald-300 flex items-center gap-2 mb-2">
                    <Package className="w-6 h-6" />
                    Buildings
                  </h2>
                  <p className="text-sm text-slate-400">
                    Purchase buildings to automate mail delivery and boost production.
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                  {availableBuildings.map(b => (
                    <BuildingItem
                      key={b.id}
                      building={b}
                      count={gameState.buildings[b.id] || 0}
                      canAfford={
                        gameState.credits >=
                        getBuildingCost(b, gameState.buildings[b.id] || 0, gameState)
                      }
                      onBuy={buyBuilding}
                      multiplier={1}
                      gameState={gameState}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'upgrades' && (
              <div className="flex flex-col h-full p-4 overflow-hidden">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-amber-300 flex items-center gap-2 mb-2">
                    <TrendingUp className="w-6 h-6" />
                    Upgrades
                  </h2>
                  <p className="text-sm text-slate-400">
                    One-time purchases that permanently boost your production and click power.
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                  {availableUpgrades.length === 0 && (
                    <p className="text-center text-slate-500 text-sm mt-10">
                      All current upgrades unlocked.
                    </p>
                  )}
                  {availableUpgrades.map(u => (
                    <button
                      key={u.id}
                      onClick={() => buyUpgrade(u.id)}
                      disabled={gameState.credits < u.baseCost}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        gameState.credits >= u.baseCost
                          ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-purple-500'
                          : 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-purple-200">{u.name}</span>
                        <span className="text-xs font-mono text-yellow-400">
                          📧 {u.baseCost.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-1">{u.description}</p>
                      <p className="text-xs text-emerald-400 font-semibold">
                        {u.effect}
                      </p>
                    </button>
                  ))}

                  {/* Purchased Upgrades */}
                  {gameState.upgrades.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-700">
                      <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4" />
                        Purchased Upgrades ({gameState.upgrades.length})
                      </h4>
                      <div className="space-y-1">
                        {gameState.upgrades.slice(-10).reverse().map(upgradeId => {
                          const upgrade = UPGRADES.find(u => u.id === upgradeId);
                          if (!upgrade) return null;
                          return (
                            <div key={upgradeId} className="text-xs text-slate-500 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                              <span className="flex-1">{upgrade.name}</span>
                              <span className="text-slate-600">→ {upgrade.effect}</span>
                            </div>
                          );
                        })}
                        {gameState.upgrades.length > 10 && (
                          <div className="text-xs text-slate-600 italic">
                            ...and {gameState.upgrades.length - 10} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'contracts' && (
              <ContractsPanel
                gameState={gameState}
                onActivateContract={handleActivateContract}
                onAbandonContract={handleAbandonContract}
                currentLps={lps}
              />
            )}

            {activeTab === 'meta' && (
              <MetaUpgradePanel gameState={gameState} onPurchase={buyMetaUpgrade} />
            )}

            {activeTab === 'prestige' && (
              <PrestigePanel
                gameState={gameState}
                onPrestige={handlePrestige}
                onSecondPrestige={handleSecondPrestige}
              />
            )}

            {activeTab === 'routes' && (
              <RoutesPanel
                gameState={gameState}
                onUpdateRoutes={(stage, allocations) => {
                  setGameState(prev => ({
                    ...prev,
                    routes: {
                      ...prev.routes,
                      [stage]: {
                        stage,
                        allocations
                      }
                    }
                  }));
                }}
              />
            )}
          </div>
        </section>
      </main>

      {/* Research Modal */}
      {researchModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setResearchModalOpen(false)}
        >
          <div
            className="bg-slate-950 border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.3)] w-full max-w-5xl h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🧪</div>
                <div>
                  <h2 className="text-3xl font-bold text-cyan-400">Research</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {gameState.completedResearch.length}/{RESEARCH.length} completed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-cyan-900/30">
                  <span className="text-xs text-slate-500 uppercase font-bold block">Research Points</span>
                  <p className="text-lg font-mono text-cyan-400">
                    {Math.floor(gameState.researchPoints).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setResearchModalOpen(false)}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden">
              <ResearchPanel gameState={gameState} onPurchase={buyResearch} />
            </div>
          </div>
        </div>
      )}

      {/* Achievements Modal */}
      {achievementsModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setAchievementsModalOpen(false)}
        >
          <div
            className="bg-slate-950 border-2 border-yellow-500/50 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.3)] w-full max-w-4xl h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" fill="currentColor" />
                <h2 className="text-3xl font-bold text-yellow-400">Achievements</h2>
              </div>
              <button
                onClick={() => setAchievementsModalOpen(false)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden">
              <AchievementsPanel gameState={gameState} />
            </div>
          </div>
        </div>
      )}

      {/* Achievement Notification */}
      {achievementNotification && (
        <div className="fixed bottom-8 right-8 z-50 animate-[slideInRight_0.5s_ease-out]">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-yellow-500 rounded-xl p-4 shadow-[0_0_30px_rgba(234,179,8,0.5)] min-w-[300px]">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{achievementNotification.icon}</div>
              <div className="flex-1">
                <div className="text-xs text-yellow-500 uppercase font-bold tracking-wider mb-1">
                  Achievement Unlocked!
                </div>
                <div className="text-lg font-bold text-slate-100 mb-1">
                  {achievementNotification.name}
                </div>
                <div className="text-xs text-slate-400">
                  {achievementNotification.rarity}
                </div>
              </div>
              <Trophy className="w-6 h-6 text-yellow-500" fill="currentColor" />
            </div>
          </div>
        </div>
      )}

      {/* Contract Notification */}
      {contractNotification && (
        <div className="fixed bottom-8 right-8 z-50 animate-[slideInRight_0.5s_ease-out]">
          <div className={`bg-gradient-to-r from-slate-900 to-slate-800 border-2 rounded-xl p-4 min-w-[300px] ${
            contractNotification.type === 'completed'
              ? 'border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.5)]'
              : 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="text-4xl">
                {contractNotification.type === 'completed' ? '✓' : '✗'}
              </div>
              <div className="flex-1">
                <div className={`text-xs uppercase font-bold tracking-wider mb-1 ${
                  contractNotification.type === 'completed' ? 'text-cyan-400' : 'text-red-400'
                }`}>
                  Contract {contractNotification.type === 'completed' ? 'Completed!' : 'Failed'}
                </div>
                <div className="text-lg font-bold text-slate-100 mb-1">
                  {contractNotification.name}
                </div>
                {contractNotification.reward && (
                  <div className="text-xs text-yellow-400">
                    Reward: {contractNotification.reward}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
