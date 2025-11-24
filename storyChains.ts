import { Stage, GameState } from './types';
import * as Config from './src/config';

/**
 * Story Chain Definition
 * Represents a multi-step storyline that unlocks based on game progression
 */
export interface StoryChainDefinition {
  id: string;                                   // "pluto_identity_crisis"
  title: string;                                // "Pluto's Identity Crisis"
  stageRequirement?: Stage;                     // minimum stage where this chain can appear
  unlockCondition?: (state: GameState) => boolean; // optional additional condition
  totalSteps: number;                           // number of steps in this chain
  reward?: {
    stamps?: number;
    researchPoints?: number;
    cosmeticTitle?: string;                     // optional cosmetic reward
    achievementId?: string;                     // optional tie-in to an achievement
  };
  isRepeatable?: boolean;                       // default false
}

/**
 * All story chains in the game
 * Organized by stage for clarity
 */
export const STORY_CHAINS: StoryChainDefinition[] = [
  // === LOCAL STAGE ===
  {
    id: 'neighborhood_gossip',
    title: "Neighborhood Gossip",
    stageRequirement: Stage.Local,
    totalSteps: Config.STORY_NEIGHBORHOOD_GOSSIP_TOTAL_STEPS,
    reward: {
      researchPoints: Config.STORY_NEIGHBORHOOD_GOSSIP_REWARD_RP,
    },
    isRepeatable: false,
  },

  // === SOLAR STAGE ===
  {
    id: 'pluto_identity_crisis',
    title: "Pluto's Identity Crisis",
    stageRequirement: Stage.Solar,
    totalSteps: Config.STORY_PLUTO_IDENTITY_CRISIS_TOTAL_STEPS,
    reward: {
      stamps: Config.STORY_PLUTO_IDENTITY_CRISIS_REWARD_STAMPS,
      cosmeticTitle: "Therapist of Pluto",
      achievementId: 'story_pluto_therapist',
    },
    isRepeatable: false,
  },
  {
    id: 'mars_colony_drama',
    title: "Mars Colony Drama",
    stageRequirement: Stage.Solar,
    unlockCondition: (state) => state.lettersDelivered >= Config.STORY_MARS_COLONY_DRAMA_UNLOCK_LETTERS,
    totalSteps: Config.STORY_MARS_COLONY_DRAMA_TOTAL_STEPS,
    reward: {
      researchPoints: Config.STORY_MARS_COLONY_DRAMA_REWARD_RP,
    },
    isRepeatable: false,
  },

  // === INTERSTELLAR STAGE ===
  {
    id: 'wormhole_incident',
    title: "The Wormhole Incident",
    stageRequirement: Stage.Interstellar,
    totalSteps: Config.STORY_WORMHOLE_INCIDENT_TOTAL_STEPS,
    reward: {
      stamps: Config.STORY_WORMHOLE_INCIDENT_REWARD_STAMPS,
      researchPoints: Config.STORY_WORMHOLE_INCIDENT_REWARD_RP,
    },
    isRepeatable: false,
  },

  // === GALACTIC STAGE ===
  {
    id: 'galactic_conspiracy',
    title: "Galactic Postal Conspiracy",
    stageRequirement: Stage.Galactic,
    unlockCondition: (state) => state.stamps >= Config.STORY_GALACTIC_CONSPIRACY_UNLOCK_STAMPS,
    totalSteps: Config.STORY_GALACTIC_CONSPIRACY_TOTAL_STEPS,
    reward: {
      stamps: Config.STORY_GALACTIC_CONSPIRACY_REWARD_STAMPS,
      researchPoints: Config.STORY_GALACTIC_CONSPIRACY_REWARD_RP,
      achievementId: 'story_conspiracy_uncovered',
    },
    isRepeatable: false,
  },

  // === MULTIVERSE STAGE ===
  {
    id: 'multiverse_you_letter',
    title: "Letters from Alternate Yous",
    stageRequirement: Stage.Multiverse,
    unlockCondition: (state) => state.totalPrestiges >= Config.STORY_MULTIVERSE_YOU_LETTER_UNLOCK_PRESTIGES,
    totalSteps: Config.STORY_MULTIVERSE_YOU_LETTER_TOTAL_STEPS,
    reward: {
      stamps: Config.STORY_MULTIVERSE_YOU_LETTER_REWARD_STAMPS,
      researchPoints: Config.STORY_MULTIVERSE_YOU_LETTER_REWARD_RP,
      cosmeticTitle: "Multiversal Correspondent",
      achievementId: 'story_multiverse_mastery',
    },
    isRepeatable: false,
  },
];

/**
 * Get a story chain definition by ID
 */
export function getStoryChainById(id: string): StoryChainDefinition | undefined {
  return STORY_CHAINS.find(chain => chain.id === id);
}

/**
 * Check if a story chain is unlocked based on game state
 */
export function isStoryChainUnlocked(chain: StoryChainDefinition, state: GameState): boolean {
  // Check stage requirement
  if (chain.stageRequirement) {
    if (!state.unlockedStages.includes(chain.stageRequirement)) {
      return false;
    }
  }

  // Check additional unlock condition
  if (chain.unlockCondition) {
    return chain.unlockCondition(state);
  }

  return true;
}

/**
 * Get all story chains that are unlocked and not yet completed
 */
export function getAvailableStoryChains(state: GameState): StoryChainDefinition[] {
  return STORY_CHAINS.filter(chain => {
    // Check if unlocked
    if (!isStoryChainUnlocked(chain, state)) {
      return false;
    }

    // Check if already completed (and not repeatable)
    const progress = state.storyProgress?.[chain.id];
    if (progress?.completed && !chain.isRepeatable) {
      return false;
    }

    // Check if there are remaining steps
    const currentStep = progress?.currentStep ?? -1;
    if (currentStep >= chain.totalSteps - 1) {
      return false;
    }

    return true;
  });
}

/**
 * Get the next story chain to show (weighted random selection)
 * Returns undefined if no chains are available
 */
export function getNextStoryChain(state: GameState): StoryChainDefinition | undefined {
  const available = getAvailableStoryChains(state);

  if (available.length === 0) {
    return undefined;
  }

  // Simple random selection (could be weighted later)
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Check if enough time has passed since last story event
 * to avoid overwhelming the player with story mail
 */
export function canShowStoryMail(state: GameState, cooldownSeconds: number = 60): boolean {
  if (!state.lastStoryEventAt) {
    return true;
  }

  const now = Date.now();
  const elapsed = (now - state.lastStoryEventAt) / 1000;
  return elapsed >= cooldownSeconds;
}
