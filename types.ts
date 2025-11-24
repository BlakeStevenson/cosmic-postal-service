export enum Stage {
  Local = 'Local Planet',
  Solar = 'Solar System',
  Interstellar = 'Interstellar',
  Galactic = 'Galactic',
  Multiverse = 'Multiverse'
}

export interface Building {
  id: string;
  name: string;
  baseCost: number;
  baseProduction: number; // Credits per second
  costFactor: number; // Exponential cost scaling (e.g., 1.15)
  stage: Stage;
  description: string;
  icon: string;
  unlockCondition?: (state: GameState) => boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  multiplier: number;
  type: 'CLICK' | 'GLOBAL_PRODUCTION' | 'BUILDING_PRODUCTION';
  targetId?: string; // If type is BUILDING_PRODUCTION
  stage: Stage;
  description: string;
  effect: string; // Mechanical effect (e.g., "2x pigeon production")
  unlockCondition?: (state: GameState) => boolean;
}

// Meta-upgrades are permanent upgrades purchased with stamps
export interface MetaUpgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number; // Cost scaling per level
  effect: (level: number) => number; // Returns the effect value for UI display
}

export enum ResearchCategory {
  Production = 'Production',
  Click = 'Click',
  Cost = 'Cost',
  Research = 'Research',
  Advanced = 'Advanced',
  Specialized = 'Specialized'
}

// Research provides time-based progression
export interface Research {
  id: string;
  name: string;
  description: string; // Thematic/flavor description
  cost: number; // Research points required
  purchased: boolean;
  prerequisite?: string; // ID of research that must be purchased first
  effect: string; // Mechanical effect (e.g., "+5% auto production")
  category: ResearchCategory;
}

export interface StoryProgress {
  chainId: string;
  currentStep: number;        // last step index shown (-1 if not started, or 0-based)
  completed: boolean;
  timesCompleted: number;     // for repeatable chains
}

export interface GameState {
  // Version for save compatibility
  version: number;

  // Basic resources
  credits: number;
  totalCreditsEarned: number;
  lettersDelivered: number; // Letters delivered this run (for prestige)
  lifetimeLettersDelivered: number; // Total letters delivered across all runs

  // Prestige currencies
  stamps: number; // First prestige currency
  lifetimeStamps: number; // Total stamps earned ever
  shards: number; // Second prestige currency

  // Progression
  clickCount: number;
  startTime: number;
  currentStage: Stage;
  unlockedStages: Stage[]; // Stages the player has unlocked

  // Buildings and upgrades
  buildings: Record<string, number>; // Map building ID to quantity
  upgrades: string[]; // List of unlocked upgrade IDs

  // Meta-progression (persistent across prestiges)
  metaUpgrades: Record<string, number>; // Map meta-upgrade ID to level

  // Research system
  researchPoints: number;
  completedResearch: string[]; // IDs of purchased research

  // Stats
  totalPrestiges: number;
  lastPrestigeTime: number;

  // Achievements
  unlockedAchievements: string[]; // IDs of unlocked achievements

  // Contracts
  contractsUnlocked: boolean;               // first time unlock flag
  availableContracts: string[];             // contract ids the player can see
  activeContract: ActiveContractState | null;
  completedContracts: string[];             // ids
  failedContracts: string[];                // optionally tracked
  totalContractsCompleted: number;

  // Story chains
  storyProgress: Record<string, StoryProgress>; // keyed by chainId
  lastStoryEventAt?: number;                    // timestamp of last story mail (ms)
  storySettings?: {
    storyChanceWeight: number; // base chance vs flavor mail (0.15 = 15%)
  };

  // Routes system
  routes: RoutesState;          // per-stage route allocations
  routesUnlocked: boolean;      // flag for when this system is first unlocked
}

export interface MailMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  timestamp: number;
}

export enum AchievementCategory {
  Progression = 'Progression',
  Production = 'Production',
  Buildings = 'Buildings',
  Clicks = 'Clicks',
  Prestige = 'Prestige',
  Speed = 'Speed',
  Collection = 'Collection',
  Special = 'Special'
}

export enum AchievementRarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary'
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  checkUnlock: (state: GameState) => boolean;
  secretUntilUnlocked?: boolean; // Hides details until earned
}

// === CONTRACTS SYSTEM ===

export type ContractStatus = 'LOCKED' | 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' | 'FAILED';

export type ContractObjectiveType =
  | 'DELIVER_TOTAL'      // deliver X letters this run
  | 'DELIVER_RATE'       // reach X LPS
  | 'PRESTIGE_STAMPS'    // prestige with at least X stamps
  | 'TIME_LIMIT'         // deliver X letters within Y seconds
  | 'NO_BUILDING'        // reach some goal without buying a specific building
  | 'CLICK_COUNT';       // click the main button X times in this run

export interface ContractObjective {
  type: ContractObjectiveType;
  targetValue: number;        // e.g. letters, LPS, stamps, clicks
  extra?: {
    buildingId?: string;      // for NO_BUILDING constraint
    timeLimitSeconds?: number;
  };
}

export interface ContractReward {
  credits?: number;
  stamps?: number;
  researchPoints?: number;
}

export interface ContractDefinition {
  id: string;
  name: string;
  description: string;       // flair text, visible to player
  stageRequirement: Stage;   // minimum stage to appear
  unlockCondition?: (state: GameState) => boolean; // similar to upgrades/achievements
  objectives: ContractObjective[];
  reward: ContractReward;
  isRepeatable: boolean;
}

export interface ActiveContractState {
  contractId: string;
  status: ContractStatus;
  progress: {
    deliveredThisRun?: number;
    maxLpsThisRun?: number;
    clicksThisRun?: number;
    startedAt?: number;      // timestamp (ms) for time-limited contracts
  };
}

// === ROUTES SYSTEM ===

export type RouteId = string;

export interface RouteDefinition {
  id: RouteId;
  name: string;
  description: string;
  stage: Stage; // Local, Solar, Interstellar, etc.

  // Base effects as multipliers or additive factors
  productionMultiplier?: number;   // e.g., 1.10 for +10% CPS contribution from this route allocation
  researchMultiplier?: number;     // e.g., 1.25 for +25% RP from this route
  eventChanceMultiplier?: number;  // e.g., 1.5 for more events/contracts/mail
  creditsBonusPerSecond?: number;  // optional flat bonus per % allocated

  // Optional constraints
  unlockCondition?: (state: GameState) => boolean; // same pattern as buildings/achievements
}

export interface RouteAllocation {
  routeId: RouteId;
  allocation: number; // percentage 0–100
}

export interface StageRouteState {
  stage: Stage;
  allocations: RouteAllocation[]; // all routes for that stage
}

export interface RoutesState {
  // keyed by Stage name
  [stageKey: string]: StageRouteState;
}