import { ContractDefinition, GameState, Stage } from './types';
import * as Config from './src/config';

// === CONTRACT DEFINITIONS ===

export const CONTRACT_DEFINITIONS: ContractDefinition[] = [
  // --- LOCAL TIER CONTRACTS ---
  {
    id: 'neighborhood_rush',
    name: 'Neighborhood Rush',
    description: 'The local community needs urgent mail delivery! Deliver 10,000 letters this run.',
    stageRequirement: Stage.Local,
    objectives: [
      {
        type: 'DELIVER_TOTAL',
        targetValue: Config.CONTRACT_NEIGHBORHOOD_RUSH_TARGET
      }
    ],
    reward: {
      credits: Config.CONTRACT_NEIGHBORHOOD_RUSH_REWARD_CREDITS,
      researchPoints: Config.CONTRACT_NEIGHBORHOOD_RUSH_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'click_frenzy',
    name: 'Click Frenzy',
    description: 'Get those fingers warmed up! Click the delivery button 500 times.',
    stageRequirement: Stage.Local,
    objectives: [
      {
        type: 'CLICK_COUNT',
        targetValue: Config.CONTRACT_CLICK_FRENZY_TARGET
      }
    ],
    reward: {
      credits: Config.CONTRACT_CLICK_FRENZY_REWARD_CREDITS,
      researchPoints: Config.CONTRACT_CLICK_FRENZY_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'speed_delivery',
    name: 'Speed Delivery',
    description: 'Time is money! Deliver 5,000 letters in 3 minutes.',
    stageRequirement: Stage.Local,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_SPEED_DELIVERY_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'TIME_LIMIT',
        targetValue: Config.CONTRACT_SPEED_DELIVERY_TARGET,
        extra: {
          timeLimitSeconds: Config.CONTRACT_SPEED_DELIVERY_TIME_LIMIT_SECONDS // 3 minutes
        }
      }
    ],
    reward: {
      credits: Config.CONTRACT_SPEED_DELIVERY_REWARD_CREDITS,
      stamps: Config.CONTRACT_SPEED_DELIVERY_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_SPEED_DELIVERY_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'local_expansion',
    name: 'Local Expansion',
    description: 'Grow your business! Deliver 50,000 letters this run.',
    stageRequirement: Stage.Local,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_LOCAL_EXPANSION_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'DELIVER_TOTAL',
        targetValue: Config.CONTRACT_LOCAL_EXPANSION_TARGET
      }
    ],
    reward: {
      credits: Config.CONTRACT_LOCAL_EXPANSION_REWARD_CREDITS,
      researchPoints: Config.CONTRACT_LOCAL_EXPANSION_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'early_automation',
    name: 'Early Automation',
    description: 'Automate your work! Reach 50 letters per second.',
    stageRequirement: Stage.Local,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_EARLY_AUTOMATION_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 50
      }
    ],
    reward: {
      credits: Config.CONTRACT_EARLY_AUTOMATION_REWARD_CREDITS,
      researchPoints: Config.CONTRACT_EARLY_AUTOMATION_REWARD_RP
    },
    isRepeatable: false
  },

  // --- SOLAR TIER CONTRACTS ---
  {
    id: 'mars_express',
    name: 'Mars Express',
    description: 'The Mars colony needs supplies! Reach 500 letters per second.',
    stageRequirement: Stage.Solar,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 500
      }
    ],
    reward: {
      credits: Config.CONTRACT_MARS_EXPRESS_REWARD_CREDITS,
      researchPoints: Config.CONTRACT_MARS_EXPRESS_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'planetary_logistics',
    name: 'Planetary Logistics',
    description: 'Expand your operations! Deliver 1,000,000 letters this run.',
    stageRequirement: Stage.Solar,
    objectives: [
      {
        type: 'DELIVER_TOTAL',
        targetValue: Config.CONTRACT_PLANETARY_LOGISTICS_TARGET
      }
    ],
    reward: {
      stamps: Config.CONTRACT_PLANETARY_LOGISTICS_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_PLANETARY_LOGISTICS_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'solar_challenge',
    name: 'Solar Challenge',
    description: 'Prove your efficiency! Deliver 500,000 letters in 5 minutes.',
    stageRequirement: Stage.Solar,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_SOLAR_CHALLENGE_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'TIME_LIMIT',
        targetValue: Config.CONTRACT_SOLAR_CHALLENGE_TARGET,
        extra: {
          timeLimitSeconds: Config.CONTRACT_SOLAR_CHALLENGE_TIME_LIMIT_SECONDS // 5 minutes
        }
      }
    ],
    reward: {
      credits: Config.CONTRACT_SOLAR_CHALLENGE_REWARD_CREDITS,
      stamps: Config.CONTRACT_SOLAR_CHALLENGE_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_SOLAR_CHALLENGE_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'outer_planets',
    name: 'Outer Planets',
    description: 'Extend your reach! Deliver 5,000,000 letters this run.',
    stageRequirement: Stage.Solar,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_OUTER_PLANETS_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'DELIVER_TOTAL',
        targetValue: Config.CONTRACT_OUTER_PLANETS_TARGET
      }
    ],
    reward: {
      credits: Config.CONTRACT_OUTER_PLANETS_REWARD_CREDITS,
      stamps: Config.CONTRACT_OUTER_PLANETS_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_OUTER_PLANETS_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'solar_production',
    name: 'Solar Production',
    description: 'Boost your operations! Reach 5,000 letters per second.',
    stageRequirement: Stage.Solar,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_SOLAR_PRODUCTION_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 5000
      }
    ],
    reward: {
      credits: Config.CONTRACT_SOLAR_PRODUCTION_REWARD_CREDITS,
      researchPoints: Config.CONTRACT_SOLAR_PRODUCTION_REWARD_RP
    },
    isRepeatable: false
  },

  // --- INTERSTELLAR TIER CONTRACTS ---
  {
    id: 'ftl_campaign',
    name: 'First FTL Campaign',
    description: 'Master interstellar logistics! Reach 500,000 LPS without buying any Cryo-Haulers.',
    stageRequirement: Stage.Interstellar,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 500000
      },
      {
        type: 'NO_BUILDING',
        targetValue: 0,
        extra: {
          buildingId: 'cryo_hauler'
        }
      }
    ],
    reward: {
      stamps: Config.CONTRACT_FTL_CAMPAIGN_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_FTL_CAMPAIGN_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'interstellar_expansion',
    name: 'Interstellar Expansion',
    description: 'Dominate the sector! Deliver 1 billion letters this run.',
    stageRequirement: Stage.Interstellar,
    objectives: [
      {
        type: 'DELIVER_TOTAL',
        targetValue: Config.CONTRACT_INTERSTELLAR_EXPANSION_TARGET
      }
    ],
    reward: {
      credits: Config.CONTRACT_INTERSTELLAR_EXPANSION_REWARD_CREDITS,
      stamps: Config.CONTRACT_INTERSTELLAR_EXPANSION_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_INTERSTELLAR_EXPANSION_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'interstellar_velocity',
    name: 'Interstellar Velocity',
    description: 'Speed is key! Deliver 100 million letters in 3 minutes.',
    stageRequirement: Stage.Interstellar,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_INTERSTELLAR_VELOCITY_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'TIME_LIMIT',
        targetValue: Config.CONTRACT_INTERSTELLAR_VELOCITY_TARGET,
        extra: {
          timeLimitSeconds: Config.CONTRACT_INTERSTELLAR_VELOCITY_TIME_LIMIT_SECONDS // 3 minutes
        }
      }
    ],
    reward: {
      credits: Config.CONTRACT_INTERSTELLAR_VELOCITY_REWARD_CREDITS,
      stamps: Config.CONTRACT_INTERSTELLAR_VELOCITY_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_INTERSTELLAR_VELOCITY_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'quantum_network_challenge',
    name: 'Quantum Network Challenge',
    description: 'Reach 2 million LPS without any Quantum Networks.',
    stageRequirement: Stage.Interstellar,
    unlockCondition: (state: GameState) => state.currentStage === Stage.Interstellar,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 2000000
      },
      {
        type: 'NO_BUILDING',
        targetValue: 0,
        extra: {
          buildingId: 'quantum_network'
        }
      }
    ],
    reward: {
      stamps: 3,
      researchPoints: 12000
    },
    isRepeatable: false
  },
  {
    id: 'click_master',
    name: 'Click Master',
    description: 'Show your dedication! Click the delivery button 10,000 times.',
    stageRequirement: Stage.Interstellar,
    unlockCondition: (state: GameState) => state.clickCount >= Config.CONTRACT_CLICK_MASTER_UNLOCK_CLICKS,
    objectives: [
      {
        type: 'CLICK_COUNT',
        targetValue: Config.CONTRACT_CLICK_MASTER_TARGET_CLICKS
      }
    ],
    reward: {
      stamps: Config.CONTRACT_CLICK_MASTER_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_CLICK_MASTER_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'sector_control',
    name: 'Sector Control',
    description: 'Build your empire! Deliver 5 billion letters this run.',
    stageRequirement: Stage.Interstellar,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_SECTOR_CONTROL_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'DELIVER_TOTAL',
        targetValue: Config.CONTRACT_SECTOR_CONTROL_TARGET
      }
    ],
    reward: {
      credits: Config.CONTRACT_SECTOR_CONTROL_REWARD_CREDITS,
      stamps: Config.CONTRACT_SECTOR_CONTROL_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_SECTOR_CONTROL_REWARD_RP
    },
    isRepeatable: false
  },

  // --- GALACTIC TIER CONTRACTS ---
  {
    id: 'galactic_dominance',
    name: 'Galactic Dominance',
    description: 'Establish your empire! Reach 100 million LPS.',
    stageRequirement: Stage.Galactic,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 100000000
      }
    ],
    reward: {
      stamps: Config.CONTRACT_GALACTIC_DOMINANCE_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_GALACTIC_DOMINANCE_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'galactic_monopoly',
    name: 'Galactic Monopoly',
    description: 'Deliver 500 billion letters this run to cement your dominance.',
    stageRequirement: Stage.Galactic,
    objectives: [
      {
        type: 'DELIVER_TOTAL',
        targetValue: Config.CONTRACT_GALACTIC_MONOPOLY_TARGET
      }
    ],
    reward: {
      credits: Config.CONTRACT_GALACTIC_MONOPOLY_REWARD_CREDITS,
      stamps: Config.CONTRACT_GALACTIC_MONOPOLY_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_GALACTIC_MONOPOLY_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'prestige_master',
    name: 'Prestige Master',
    description: 'Demonstrate your prowess! Prestige with at least 250 stamps earned.',
    stageRequirement: Stage.Galactic,
    unlockCondition: (state: GameState) => state.totalPrestiges >= Config.CONTRACT_PRESTIGE_MASTER_UNLOCK_PRESTIGES,
    objectives: [
      {
        type: 'PRESTIGE_STAMPS',
        targetValue: Config.CONTRACT_PRESTIGE_MASTER_TARGET_STAMPS
      }
    ],
    reward: {
      stamps: Config.CONTRACT_PRESTIGE_MASTER_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_PRESTIGE_MASTER_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'galactic_rush',
    name: 'Galactic Rush',
    description: 'Extreme speed test! Deliver 50 billion letters in 5 minutes.',
    stageRequirement: Stage.Galactic,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_GALACTIC_RUSH_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'TIME_LIMIT',
        targetValue: Config.CONTRACT_GALACTIC_RUSH_TARGET,
        extra: {
          timeLimitSeconds: Config.CONTRACT_GALACTIC_RUSH_TIME_LIMIT_SECONDS // 5 minutes
        }
      }
    ],
    reward: {
      credits: Config.CONTRACT_GALACTIC_RUSH_REWARD_CREDITS,
      stamps: Config.CONTRACT_GALACTIC_RUSH_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_GALACTIC_RUSH_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'wormhole_efficiency',
    name: 'Wormhole Efficiency',
    description: 'Reach 500 million LPS without any Wormhole Stations.',
    stageRequirement: Stage.Galactic,
    unlockCondition: (state: GameState) => state.currentStage === Stage.Galactic,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 500000000
      },
      {
        type: 'NO_BUILDING',
        targetValue: 0,
        extra: {
          buildingId: 'wormhole_station'
        }
      }
    ],
    reward: {
      stamps: Config.CONTRACT_WORMHOLE_EFFICIENCY_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_WORMHOLE_EFFICIENCY_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'galactic_sprint',
    name: 'Galactic Sprint',
    description: 'Pure speed! Deliver 20 billion letters in just 2 minutes.',
    stageRequirement: Stage.Galactic,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_GALACTIC_SPRINT_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'TIME_LIMIT',
        targetValue: Config.CONTRACT_GALACTIC_SPRINT_TARGET,
        extra: {
          timeLimitSeconds: Config.CONTRACT_GALACTIC_SPRINT_TIME_LIMIT_SECONDS // 2 minutes
        }
      }
    ],
    reward: {
      credits: Config.CONTRACT_GALACTIC_SPRINT_REWARD_CREDITS,
      stamps: Config.CONTRACT_GALACTIC_SPRINT_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_GALACTIC_SPRINT_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'click_galaxy',
    name: 'Click Galaxy',
    description: 'Manual supremacy! Click the button 50,000 times.',
    stageRequirement: Stage.Galactic,
    unlockCondition: (state: GameState) => state.clickCount >= Config.CONTRACT_CLICK_GALAXY_UNLOCK_CLICKS,
    objectives: [
      {
        type: 'CLICK_COUNT',
        targetValue: Config.CONTRACT_CLICK_GALAXY_TARGET_CLICKS
      }
    ],
    reward: {
      stamps: Config.CONTRACT_CLICK_GALAXY_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_CLICK_GALAXY_REWARD_RP
    },
    isRepeatable: false
  },

  // --- MULTIVERSE TIER CONTRACTS ---
  {
    id: 'reality_bending',
    name: 'Reality Bending',
    description: 'Transcend limitations! Reach 5 billion LPS.',
    stageRequirement: Stage.Multiverse,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 5000000000
      }
    ],
    reward: {
      stamps: Config.CONTRACT_REALITY_BENDING_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_REALITY_BENDING_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'multiverse_mastery',
    name: 'Multiverse Mastery',
    description: 'Conquer infinity! Deliver 10 trillion letters this run.',
    stageRequirement: Stage.Multiverse,
    objectives: [
      {
        type: 'DELIVER_TOTAL',
        targetValue: Config.CONTRACT_MULTIVERSE_MASTERY_TARGET
      }
    ],
    reward: {
      stamps: Config.CONTRACT_MULTIVERSE_MASTERY_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_MULTIVERSE_MASTERY_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'timeline_mastery',
    name: 'Timeline Mastery',
    description: 'Master the timelines! Reach 20 billion LPS without any Reality Looms.',
    stageRequirement: Stage.Multiverse,
    unlockCondition: (state: GameState) => state.currentStage === Stage.Multiverse,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 20000000000
      },
      {
        type: 'NO_BUILDING',
        targetValue: 0,
        extra: {
          buildingId: 'reality_loom'
        }
      }
    ],
    reward: {
      stamps: Config.CONTRACT_TIMELINE_MASTERY_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_TIMELINE_MASTERY_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'omnipotent_clicker',
    name: 'Omnipotent Clicker',
    description: 'Achieve true dedication! Click the delivery button 100,000 times.',
    stageRequirement: Stage.Multiverse,
    unlockCondition: (state: GameState) => state.clickCount >= Config.CONTRACT_OMNIPOTENT_CLICKER_UNLOCK_CLICKS,
    objectives: [
      {
        type: 'CLICK_COUNT',
        targetValue: Config.CONTRACT_OMNIPOTENT_CLICKER_TARGET_CLICKS
      }
    ],
    reward: {
      stamps: Config.CONTRACT_OMNIPOTENT_CLICKER_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_OMNIPOTENT_CLICKER_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'dimensional_sprint',
    name: 'Dimensional Sprint',
    description: 'Cross dimensions at light speed! Deliver 500 billion letters in 3 minutes.',
    stageRequirement: Stage.Multiverse,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_DIMENSIONAL_SPRINT_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'TIME_LIMIT',
        targetValue: Config.CONTRACT_DIMENSIONAL_SPRINT_TARGET,
        extra: {
          timeLimitSeconds: Config.CONTRACT_DIMENSIONAL_SPRINT_TIME_LIMIT_SECONDS // 3 minutes
        }
      }
    ],
    reward: {
      credits: Config.CONTRACT_DIMENSIONAL_SPRINT_REWARD_CREDITS,
      stamps: Config.CONTRACT_DIMENSIONAL_SPRINT_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_DIMENSIONAL_SPRINT_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'infinity_engine',
    name: 'Infinity Engine',
    description: 'Harness infinite power! Reach 50 billion LPS.',
    stageRequirement: Stage.Multiverse,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_INFINITY_ENGINE_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 50000000000
      }
    ],
    reward: {
      stamps: Config.CONTRACT_INFINITY_ENGINE_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_INFINITY_ENGINE_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'cosmic_singularity',
    name: 'Cosmic Singularity',
    description: 'Achieve the impossible! Deliver 50 trillion letters this run.',
    stageRequirement: Stage.Multiverse,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_COSMIC_SINGULARITY_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'DELIVER_TOTAL',
        targetValue: Config.CONTRACT_COSMIC_SINGULARITY_TARGET
      }
    ],
    reward: {
      stamps: Config.CONTRACT_COSMIC_SINGULARITY_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_COSMIC_SINGULARITY_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'temporal_acceleration',
    name: 'Temporal Acceleration',
    description: 'Break the speed of time! Deliver 2 trillion letters in 5 minutes.',
    stageRequirement: Stage.Multiverse,
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.CONTRACT_TEMPORAL_ACCELERATION_UNLOCK_LETTERS,
    objectives: [
      {
        type: 'TIME_LIMIT',
        targetValue: Config.CONTRACT_TEMPORAL_ACCELERATION_TARGET,
        extra: {
          timeLimitSeconds: Config.CONTRACT_TEMPORAL_ACCELERATION_TIME_LIMIT_SECONDS // 5 minutes
        }
      }
    ],
    reward: {
      credits: Config.CONTRACT_TEMPORAL_ACCELERATION_REWARD_CREDITS,
      stamps: Config.CONTRACT_TEMPORAL_ACCELERATION_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_TEMPORAL_ACCELERATION_REWARD_RP
    },
    isRepeatable: false
  },
  {
    id: 'ultimate_challenge',
    name: 'The Ultimate Challenge',
    description: 'The final test! Deliver 1 trillion letters in 10 minutes.',
    stageRequirement: Stage.Multiverse,
    unlockCondition: (state: GameState) => state.shards >= Config.CONTRACT_ULTIMATE_CHALLENGE_UNLOCK_SHARDS && state.totalPrestiges >= Config.CONTRACT_ULTIMATE_CHALLENGE_UNLOCK_PRESTIGES,
    objectives: [
      {
        type: 'TIME_LIMIT',
        targetValue: Config.CONTRACT_ULTIMATE_CHALLENGE_TARGET,
        extra: {
          timeLimitSeconds: Config.CONTRACT_ULTIMATE_CHALLENGE_TIME_LIMIT_SECONDS // 10 minutes
        }
      }
    ],
    reward: {
      stamps: Config.CONTRACT_ULTIMATE_CHALLENGE_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_ULTIMATE_CHALLENGE_REWARD_RP
    },
    isRepeatable: true // This one can be repeated for the challenge
  },
  {
    id: 'beyond_infinity',
    name: 'Beyond Infinity',
    description: 'Surpass all limits! Reach 100 billion LPS.',
    stageRequirement: Stage.Multiverse,
    unlockCondition: (state: GameState) => state.shards >= Config.CONTRACT_BEYOND_INFINITY_UNLOCK_SHARDS,
    objectives: [
      {
        type: 'DELIVER_RATE',
        targetValue: 100000000000
      }
    ],
    reward: {
      stamps: Config.CONTRACT_BEYOND_INFINITY_REWARD_STAMPS,
      researchPoints: Config.CONTRACT_BEYOND_INFINITY_REWARD_RP
    },
    isRepeatable: false
  }
];

// === HELPER FUNCTIONS ===

/**
 * Get all contracts that are available to the player
 * Filters by stage requirement, unlock conditions, and completion status
 */
export function getAvailableContracts(state: GameState): ContractDefinition[] {
  return CONTRACT_DEFINITIONS.filter(contract => {
    // Check if stage is unlocked
    if (!state.unlockedStages.includes(contract.stageRequirement)) {
      return false;
    }

    // Check unlock condition
    if (contract.unlockCondition && !contract.unlockCondition(state)) {
      return false;
    }

    // Filter out completed non-repeatable contracts
    if (!contract.isRepeatable && state.completedContracts.includes(contract.id)) {
      return false;
    }

    // Don't show if currently active
    if (state.activeContract && state.activeContract.contractId === contract.id) {
      return false;
    }

    return true;
  });
}

/**
 * Get a contract by its ID
 */
export function getContractById(id: string): ContractDefinition | undefined {
  return CONTRACT_DEFINITIONS.find(c => c.id === id);
}

/**
 * Check if a contract is locked (stage or conditions not met)
 */
export function isContractLocked(contract: ContractDefinition, state: GameState): boolean {
  // Check if stage is unlocked
  if (!state.unlockedStages.includes(contract.stageRequirement)) {
    return true;
  }

  // Check unlock condition
  if (contract.unlockCondition && !contract.unlockCondition(state)) {
    return true;
  }

  return false;
}

/**
 * Get all contracts for a specific stage
 */
export function getContractsByStage(stage: Stage): ContractDefinition[] {
  return CONTRACT_DEFINITIONS.filter(c => c.stageRequirement === stage);
}
