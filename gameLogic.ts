import { GameState, Building, Stage } from './types';
import { getContractById } from './contracts';
import { getRouteById } from './routes';
import {
  STAMPS_DIVISOR,
  STAMPS_POWER_EXPONENT,
  STAMPS_REWARD_MULTIPLIER,
  SHARDS_DIVISOR,
  SHARD_MULTIPLIER_BASE,
  STAMP_MULTIPLIER_POWER,
  STAMP_MULTIPLIER_PER_STAMP,
  META_CLICK_POWER_BONUS_PER_LEVEL,
  META_AUTO_POWER_BONUS_PER_LEVEL,
  META_COST_REDUCTION_PER_LEVEL,
  RESEARCH_POINTS_POWER,
  RESEARCH_POINTS_BASE_MULTIPLIER,
  RESEARCH_LAB_MULTIPLIER,
  RESEARCH_NETWORK_MULTIPLIER,
  QUANTUM_COMPUTING_MULTIPLIER,
  RESEARCH_META_BONUS_PER_LEVEL,
  RESEARCH_BETTER_SORTING_BONUS,
  RESEARCH_ADVANCED_SORTING_BONUS,
  RESEARCH_QUANTUM_SORTING_BONUS,
  RESEARCH_LOGISTICS_AI_BONUS,
  RESEARCH_PARALLEL_PROCESSING_BONUS,
  RESEARCH_TIME_DILATION_BONUS,
  RESEARCH_HIVE_CONSCIOUSNESS_BONUS,
  RESEARCH_DIMENSIONAL_FOLDING_BONUS,
  RESEARCH_UNIFIED_FIELD_THEORY_BONUS,
  RESEARCH_UNIVERSAL_LANGUAGE_BONUS,
  RESEARCH_PROBABILITY_MANIPULATION_BONUS,
  RESEARCH_COSMIC_AWARENESS_BONUS,
  RESEARCH_ENTROPY_REVERSAL_BONUS,
  RESEARCH_ERGONOMIC_TRAINING_BONUS,
  RESEARCH_BIONIC_ENHANCEMENTS_BONUS,
  RESEARCH_NEURAL_INTERFACE_BONUS,
  RESEARCH_PSYCHIC_DELIVERY_BONUS,
  RESEARCH_OMNIPRESENCE_BONUS,
  RESEARCH_ASCENSION_BONUS,
  RESEARCH_ROUTE_OPTIMIZATION_MULTIPLIER,
  RESEARCH_EFFICIENCY_PROTOCOLS_MULTIPLIER,
  RESEARCH_SUPPLY_CHAIN_MULTIPLIER,
  RESEARCH_ZERO_POINT_ENERGY_MULTIPLIER,
  RESEARCH_MATTER_SYNTHESIS_MULTIPLIER,
  RESEARCH_CRYOGENIC_COST_REDUCTION,
  RESEARCH_SINGULARITY_COST_REDUCTION,
  STAGE_SOLAR_LETTERS_THRESHOLD,
  STAGE_INTERSTELLAR_LETTERS_THRESHOLD,
  STAGE_GALACTIC_LETTERS_THRESHOLD,
  STAGE_MULTIVERSE_LETTERS_THRESHOLD,
  STAGE_SOLAR_STAMPS_THRESHOLD,
  STAGE_INTERSTELLAR_STAMPS_THRESHOLD,
  STAGE_GALACTIC_STAMPS_THRESHOLD,
  STAGE_MULTIVERSE_STAMPS_THRESHOLD,
  STAGE_INTERSTELLAR_SHARDS_THRESHOLD,
  STAGE_GALACTIC_SHARDS_THRESHOLD,
  STAGE_MULTIVERSE_SHARDS_THRESHOLD,
} from './src/config';

// === PRESTIGE CALCULATIONS ===

/**
 * Calculate how many stamps the player would earn from prestiging
 * Uses a cube root formula for sublinear growth
 */
export function calculateStampsEarned(state: GameState): number {
  const base = state.lettersDelivered / STAMPS_DIVISOR;
  if (base <= 0) return 0;

  // Cube root formula for slow, sublinear growth
  const stampsEarned = Math.floor(Math.pow(base, STAMPS_POWER_EXPONENT) * STAMPS_REWARD_MULTIPLIER);

  // Must earn at least 1 more stamp than current to prestige
  return Math.max(0, stampsEarned - state.stamps);
}

/**
 * Calculate how many shards the player would earn from second prestige
 * Requires significant lifetime progress
 */
export function calculateShardsEarned(state: GameState): number {
  // Need 100 lifetime stamps for first shard
  // Then grows with square root
  const base = state.lifetimeStamps / SHARDS_DIVISOR;
  if (base <= 0) return 0;

  const shardsEarned = Math.floor(Math.sqrt(base));
  return Math.max(0, shardsEarned - state.shards);
}

/**
 * Check if player can perform second prestige (shard reset)
 */
export function canSecondPrestige(state: GameState): boolean {
  return calculateShardsEarned(state) > 0;
}

// === MULTIPLIER CALCULATIONS ===

/**
 * Calculate the global production multiplier from stamps
 * Uses sublinear growth (power of 0.6) to prevent runaway inflation
 */
export function getStampMultiplier(stamps: number): number {
  if (stamps === 0) return 1;
  // Each stamp gives diminishing returns
  return 1 + Math.pow(stamps, STAMP_MULTIPLIER_POWER) * STAMP_MULTIPLIER_PER_STAMP;
}

/**
 * Calculate shard multiplier (very powerful but rare)
 */
export function getShardMultiplier(shards: number): number {
  if (shards === 0) return 1;
  // Shards give exponential but small growth
  return Math.pow(SHARD_MULTIPLIER_BASE, shards);
}

/**
 * Get meta-upgrade bonus for auto production
 */
export function getMetaAutoBonus(state: GameState): number {
  const level = state.metaUpgrades['auto_power'] || 0;
  return 1 + level * (META_AUTO_POWER_BONUS_PER_LEVEL / 100);
}

/**
 * Get meta-upgrade bonus for click power
 */
export function getMetaClickBonus(state: GameState): number {
  const level = state.metaUpgrades['click_power'] || 0;
  return 1 + level * (META_CLICK_POWER_BONUS_PER_LEVEL / 100);
}

/**
 * Get building cost reduction from meta-upgrades
 */
export function getMetaCostReduction(state: GameState): number {
  const level = state.metaUpgrades['cheaper_buildings'] || 0;
  return 1 - level * (META_COST_REDUCTION_PER_LEVEL / 100);
}

/**
 * Get research bonus for auto production
 */
export function getResearchAutoBonus(state: GameState): number {
  let bonus = 1;

  // Tier 1-2: Basic sorting improvements
  if (state.completedResearch.includes('better_sorting')) bonus *= RESEARCH_BETTER_SORTING_BONUS;
  if (state.completedResearch.includes('advanced_sorting')) bonus *= RESEARCH_ADVANCED_SORTING_BONUS;
  if (state.completedResearch.includes('quantum_sorting')) bonus *= RESEARCH_QUANTUM_SORTING_BONUS;

  // Tier 2-3: Extended branches
  if (state.completedResearch.includes('logistics_ai')) bonus *= RESEARCH_LOGISTICS_AI_BONUS;
  if (state.completedResearch.includes('parallel_processing')) bonus *= RESEARCH_PARALLEL_PROCESSING_BONUS;
  if (state.completedResearch.includes('time_dilation')) bonus *= RESEARCH_TIME_DILATION_BONUS;

  // Tier 4: High-level upgrades
  if (state.completedResearch.includes('hive_consciousness')) bonus *= RESEARCH_HIVE_CONSCIOUSNESS_BONUS;
  if (state.completedResearch.includes('dimensional_folding')) bonus *= RESEARCH_DIMENSIONAL_FOLDING_BONUS;

  // Tier 5: Cross-branch and endgame
  if (state.completedResearch.includes('unified_field_theory')) bonus *= RESEARCH_UNIFIED_FIELD_THEORY_BONUS;
  if (state.completedResearch.includes('universal_language')) bonus *= RESEARCH_UNIVERSAL_LANGUAGE_BONUS;
  if (state.completedResearch.includes('probability_manipulation')) bonus *= RESEARCH_PROBABILITY_MANIPULATION_BONUS;
  if (state.completedResearch.includes('cosmic_awareness')) bonus *= RESEARCH_COSMIC_AWARENESS_BONUS;
  if (state.completedResearch.includes('entropy_reversal')) bonus *= RESEARCH_ENTROPY_REVERSAL_BONUS;

  return bonus;
}

/**
 * Get research bonus for click power
 */
export function getResearchClickBonus(state: GameState): number {
  let bonus = 1;

  // Tier 1-2: Basic click improvements
  if (state.completedResearch.includes('ergonomic_training')) bonus *= RESEARCH_ERGONOMIC_TRAINING_BONUS;
  if (state.completedResearch.includes('bionic_enhancements')) bonus *= RESEARCH_BIONIC_ENHANCEMENTS_BONUS;

  // Tier 2-3: Extended branches
  if (state.completedResearch.includes('neural_interface')) bonus *= RESEARCH_NEURAL_INTERFACE_BONUS;
  if (state.completedResearch.includes('psychic_delivery')) bonus *= RESEARCH_PSYCHIC_DELIVERY_BONUS;

  // Tier 4-5: High-level upgrades
  if (state.completedResearch.includes('omnipresence')) bonus *= RESEARCH_OMNIPRESENCE_BONUS;
  if (state.completedResearch.includes('ascension')) bonus *= RESEARCH_ASCENSION_BONUS;

  return bonus;
}

// === COST CALCULATIONS ===

/**
 * Calculate the current cost of a building given its current count
 * Uses exponential scaling: cost = baseCost * costFactor^count * costReduction
 */
export function getBuildingCost(building: Building, currentCount: number, state: GameState): number {
  const costReduction = getMetaCostReduction(state);
  let cost = building.baseCost * Math.pow(building.costFactor, currentCount);

  // Apply research cost reduction if unlocked
  if (state.completedResearch.includes('route_optimization')) {
    cost *= RESEARCH_ROUTE_OPTIMIZATION_MULTIPLIER;
  }
  if (state.completedResearch.includes('efficiency_protocols')) {
    cost *= RESEARCH_EFFICIENCY_PROTOCOLS_MULTIPLIER;
  }
  if (state.completedResearch.includes('supply_chain')) {
    cost *= RESEARCH_SUPPLY_CHAIN_MULTIPLIER;
  }
  if (state.completedResearch.includes('zero_point_energy')) {
    cost *= RESEARCH_ZERO_POINT_ENERGY_MULTIPLIER;
  }
  if (state.completedResearch.includes('matter_synthesis')) {
    cost *= RESEARCH_MATTER_SYNTHESIS_MULTIPLIER;
  }

  // Building-specific research bonuses
  if (building.id === 'cryo_hauler' && state.completedResearch.includes('cryogenic_preservation')) {
    cost *= RESEARCH_CRYOGENIC_COST_REDUCTION;
  }
  if (building.id === 'black_hole_router' && state.completedResearch.includes('singularity_engineering')) {
    cost *= RESEARCH_SINGULARITY_COST_REDUCTION;
  }

  return Math.floor(cost * costReduction);
}

// === STAGE UNLOCKING ===

/**
 * Check which stages should be unlocked based on progress
 */
export function getUnlockedStages(state: GameState): Stage[] {
  const stages: Stage[] = [Stage.Local]; // Always have Local

  // Solar: 10,000 letters delivered this run OR have 5+ stamps
  if (state.lettersDelivered >= STAGE_SOLAR_LETTERS_THRESHOLD || state.stamps >= STAGE_SOLAR_STAMPS_THRESHOLD) {
    stages.push(Stage.Solar);
  }

  // Interstellar: 1 million letters this run OR 20+ stamps OR 1+ shard
  if (state.lettersDelivered >= STAGE_INTERSTELLAR_LETTERS_THRESHOLD || state.stamps >= STAGE_INTERSTELLAR_STAMPS_THRESHOLD || state.shards >= STAGE_INTERSTELLAR_SHARDS_THRESHOLD) {
    stages.push(Stage.Interstellar);
  }

  // Galactic: 100 million letters OR 50+ stamps OR 3+ shards
  if (state.lettersDelivered >= STAGE_GALACTIC_LETTERS_THRESHOLD || state.stamps >= STAGE_GALACTIC_STAMPS_THRESHOLD || state.shards >= STAGE_GALACTIC_SHARDS_THRESHOLD) {
    stages.push(Stage.Galactic);
  }

  // Multiverse: 10 billion letters OR 100+ stamps OR 10+ shards
  if (state.lettersDelivered >= STAGE_MULTIVERSE_LETTERS_THRESHOLD || state.stamps >= STAGE_MULTIVERSE_STAMPS_THRESHOLD || state.shards >= STAGE_MULTIVERSE_SHARDS_THRESHOLD) {
    stages.push(Stage.Multiverse);
  }

  return stages;
}

/**
 * Get the current stage based on unlocked stages
 */
export function getCurrentStage(unlockedStages: Stage[]): Stage {
  if (unlockedStages.includes(Stage.Multiverse)) return Stage.Multiverse;
  if (unlockedStages.includes(Stage.Galactic)) return Stage.Galactic;
  if (unlockedStages.includes(Stage.Interstellar)) return Stage.Interstellar;
  if (unlockedStages.includes(Stage.Solar)) return Stage.Solar;
  return Stage.Local;
}

// === RESEARCH POINTS ===

/**
 * Calculate research points per second
 * Uses aggressive diminishing returns to prevent exponential growth
 * Formula: (LPS ^ 0.4) * multiplier
 */
export function getResearchPointsPerSecond(lettersPerSecond: number, state: GameState): number {
  // Base: Strong diminishing returns via power scaling (0.4)
  // Early: 100 LPS = ~1.6 RPS
  // Mid: 1M LPS = ~100 RPS
  // Late: 1B LPS = ~3.2K RPS
  // End: 1T LPS = ~100K RPS
  // This prevents research from becoming meaningless while keeping late game balanced
  let rps = Math.pow(Math.max(lettersPerSecond, 1), RESEARCH_POINTS_POWER) * RESEARCH_POINTS_BASE_MULTIPLIER;

  // Research accelerators (multiplicative bonuses)
  if (state.completedResearch.includes('research_lab')) rps *= RESEARCH_LAB_MULTIPLIER;
  if (state.completedResearch.includes('research_network')) rps *= RESEARCH_NETWORK_MULTIPLIER;
  if (state.completedResearch.includes('quantum_computing')) rps *= QUANTUM_COMPUTING_MULTIPLIER;

  // Meta-upgrade for research speed
  const metaResearchBonus = state.metaUpgrades['research_speed'] || 0;
  if (metaResearchBonus > 0) {
    rps *= (1 + metaResearchBonus * RESEARCH_META_BONUS_PER_LEVEL);
  }

  return rps;
}

// === CONTRACT TRACKING ===

/**
 * Update contract progress based on game actions
 * Returns updated state with contract progress and completion/failure checks
 */
export function updateContractProgress(
  state: GameState,
  deltaLetters: number,
  currentLps: number,
  deltaClicks: number = 0
): GameState {
  // No active contract - nothing to update
  if (!state.activeContract) {
    return state;
  }

  const contract = getContractById(state.activeContract.contractId);
  if (!contract) {
    return state;
  }

  // Update progress values
  const newProgress = {
    ...state.activeContract.progress,
    deliveredThisRun: (state.activeContract.progress.deliveredThisRun || 0) + deltaLetters,
    maxLpsThisRun: Math.max(state.activeContract.progress.maxLpsThisRun || 0, currentLps),
    clicksThisRun: (state.activeContract.progress.clicksThisRun || 0) + deltaClicks
  };

  // Check completion/failure
  const { completed, failed } = checkContractStatus(contract, newProgress, state);

  // If completed, award rewards
  if (completed) {
    return {
      ...state,
      activeContract: null,
      completedContracts: [...state.completedContracts, contract.id],
      totalContractsCompleted: state.totalContractsCompleted + 1,
      // Award rewards
      credits: state.credits + (contract.reward.credits || 0),
      stamps: state.stamps + (contract.reward.stamps || 0),
      researchPoints: state.researchPoints + (contract.reward.researchPoints || 0)
    };
  }

  // If failed, mark as failed
  if (failed) {
    return {
      ...state,
      activeContract: null,
      failedContracts: [...state.failedContracts, contract.id]
    };
  }

  // Update active contract progress
  return {
    ...state,
    activeContract: {
      ...state.activeContract,
      progress: newProgress
    }
  };
}

/**
 * Check if a contract is completed or failed based on its objectives
 */
function checkContractStatus(
  contract: any, // ContractDefinition
  progress: any, // ActiveContractState['progress']
  state: GameState
): { completed: boolean; failed: boolean } {
  let allObjectivesMet = true;
  let anyObjectiveFailed = false;

  for (const objective of contract.objectives) {
    switch (objective.type) {
      case 'DELIVER_TOTAL':
        if ((progress.deliveredThisRun || 0) < objective.targetValue) {
          allObjectivesMet = false;
        }
        break;

      case 'DELIVER_RATE':
        if ((progress.maxLpsThisRun || 0) < objective.targetValue) {
          allObjectivesMet = false;
        }
        break;

      case 'CLICK_COUNT':
        if ((progress.clicksThisRun || 0) < objective.targetValue) {
          allObjectivesMet = false;
        }
        break;

      case 'TIME_LIMIT':
        const elapsedSeconds = ((Date.now() - (progress.startedAt || Date.now())) / 1000);
        const timeLimitSeconds = objective.extra?.timeLimitSeconds || Infinity;

        // Check if time limit exceeded
        if (elapsedSeconds > timeLimitSeconds) {
          anyObjectiveFailed = true;
        }

        // Check if delivery target met within time
        if ((progress.deliveredThisRun || 0) < objective.targetValue) {
          allObjectivesMet = false;
        }
        break;

      case 'NO_BUILDING':
        const buildingId = objective.extra?.buildingId;
        if (buildingId) {
          const buildingCount = state.buildings[buildingId] || 0;
          if (buildingCount > 0) {
            anyObjectiveFailed = true;
          }
        }
        break;

      case 'PRESTIGE_STAMPS':
        // This objective is checked at prestige time
        // For now, just mark as not met
        allObjectivesMet = false;
        break;

      default:
        break;
    }
  }

  return {
    completed: allObjectivesMet && !anyObjectiveFailed,
    failed: anyObjectiveFailed
  };
}

/**
 * Activate a contract - sets it as the active contract and initializes progress
 */
export function activateContract(state: GameState, contractId: string): GameState {
  // Can't activate if already have an active contract
  if (state.activeContract) {
    return state;
  }

  return {
    ...state,
    activeContract: {
      contractId,
      status: 'ACTIVE',
      progress: {
        deliveredThisRun: 0,
        maxLpsThisRun: 0,
        clicksThisRun: 0,
        startedAt: Date.now()
      }
    }
  };
}

/**
 * Abandon the current active contract
 */
export function abandonContract(state: GameState): GameState {
  if (!state.activeContract) {
    return state;
  }

  return {
    ...state,
    activeContract: null,
    failedContracts: [...state.failedContracts, state.activeContract.contractId]
  };
}

/**
 * Get progress percentage for a specific objective
 */
export function getObjectiveProgress(
  objective: any, // ContractObjective
  progress: any, // ActiveContractState['progress']
  state: GameState
): number {
  switch (objective.type) {
    case 'DELIVER_TOTAL':
    case 'TIME_LIMIT':
      return Math.min(100, ((progress.deliveredThisRun || 0) / objective.targetValue) * 100);

    case 'DELIVER_RATE':
      return Math.min(100, ((progress.maxLpsThisRun || 0) / objective.targetValue) * 100);

    case 'CLICK_COUNT':
      return Math.min(100, ((progress.clicksThisRun || 0) / objective.targetValue) * 100);

    case 'NO_BUILDING':
      const buildingId = objective.extra?.buildingId;
      if (buildingId) {
        const buildingCount = state.buildings[buildingId] || 0;
        return buildingCount === 0 ? 100 : 0;
      }
      return 0;

    case 'PRESTIGE_STAMPS':
      return 0; // Can't track until prestige

    default:
      return 0;
  }
}

// === ROUTES SYSTEM ===

/**
 * Check if the routes system should be unlocked
 * Unlocks at Solar stage
 */
export function shouldUnlockRoutes(state: GameState): boolean {
  // Unlock when player reaches Solar stage
  return state.unlockedStages.includes(Stage.Solar);
}

/**
 * Get the production multiplier from route allocations
 * Uses a weighted average based on allocation percentages
 */
export function getRouteProductionMultiplier(state: GameState): number {
  // If routes not unlocked, return neutral multiplier
  if (!state.routesUnlocked) return 1;

  const stageState = state.routes[state.currentStage];
  if (!stageState || !stageState.allocations || stageState.allocations.length === 0) {
    return 1;
  }

  // Calculate weighted average of production multipliers
  let totalWeightedMul = 0;
  let totalAlloc = 0;

  for (const alloc of stageState.allocations) {
    const def = getRouteById(alloc.routeId);
    if (!def) continue;

    const allocFrac = alloc.allocation / 100;
    const prodMul = def.productionMultiplier ?? 1;

    totalWeightedMul += allocFrac * prodMul;
    totalAlloc += allocFrac;
  }

  // If no allocations or weird state, return neutral
  if (totalAlloc <= 0) return 1;

  // Return weighted average
  // If total allocation is less than 100%, scale accordingly
  return totalWeightedMul;
}

/**
 * Get the research multiplier from route allocations
 * Uses a weighted average based on allocation percentages
 */
export function getRouteResearchMultiplier(state: GameState): number {
  // If routes not unlocked, return neutral multiplier
  if (!state.routesUnlocked) return 1;

  const stageState = state.routes[state.currentStage];
  if (!stageState || !stageState.allocations || stageState.allocations.length === 0) {
    return 1;
  }

  let totalWeightedMul = 0;
  let totalAlloc = 0;

  for (const alloc of stageState.allocations) {
    const def = getRouteById(alloc.routeId);
    if (!def) continue;

    const allocFrac = alloc.allocation / 100;
    const researchMul = def.researchMultiplier ?? 1;

    totalWeightedMul += allocFrac * researchMul;
    totalAlloc += allocFrac;
  }

  if (totalAlloc <= 0) return 1;

  return totalWeightedMul;
}

/**
 * Get the event chance multiplier from route allocations
 * Uses a weighted average based on allocation percentages
 */
export function getRouteEventChanceMultiplier(state: GameState): number {
  // If routes not unlocked, return neutral multiplier
  if (!state.routesUnlocked) return 1;

  const stageState = state.routes[state.currentStage];
  if (!stageState || !stageState.allocations || stageState.allocations.length === 0) {
    return 1;
  }

  let totalWeightedMul = 0;
  let totalAlloc = 0;

  for (const alloc of stageState.allocations) {
    const def = getRouteById(alloc.routeId);
    if (!def) continue;

    const allocFrac = alloc.allocation / 100;
    const eventMul = def.eventChanceMultiplier ?? 1;

    totalWeightedMul += allocFrac * eventMul;
    totalAlloc += allocFrac;
  }

  if (totalAlloc <= 0) return 1;

  return totalWeightedMul;
}
