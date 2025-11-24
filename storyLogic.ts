import { GameState, StoryProgress } from './types';
import { MailTemplate } from './services/mailService';
import {
  getStoryChainById,
  getNextStoryChain,
  canShowStoryMail,
  StoryChainDefinition,
} from './storyChains';
import { getStoryMailTemplates } from './services/mailService';

/**
 * Result of selecting the next mail entry
 */
export interface MailSelectionResult {
  mail: MailTemplate;
  updatedState: GameState;
}

/**
 * Get the next step in a story chain
 * Returns the mail template for the next step, or undefined if no more steps
 */
function getNextStoryStep(
  chain: StoryChainDefinition,
  currentStep: number
): MailTemplate | undefined {
  const nextStepIndex = currentStep + 1;

  if (nextStepIndex >= chain.totalSteps) {
    return undefined; // No more steps
  }

  // Get the mail template for this step
  const templates = getStoryMailTemplates();
  const template = templates.find(
    t => t.chainId === chain.id && t.stepIndex === nextStepIndex
  );

  return template;
}

/**
 * Apply rewards when a story chain is completed
 */
function applyStoryReward(state: GameState, chain: StoryChainDefinition): GameState {
  if (!chain.reward) {
    return state;
  }

  const newState = { ...state };

  // Apply stamp rewards
  if (chain.reward.stamps) {
    newState.stamps += chain.reward.stamps;
    newState.lifetimeStamps += chain.reward.stamps;
  }

  // Apply research point rewards
  if (chain.reward.researchPoints) {
    newState.researchPoints += chain.reward.researchPoints;
  }

  // Unlock achievement if tied to this story
  if (chain.reward.achievementId) {
    if (!newState.unlockedAchievements.includes(chain.reward.achievementId)) {
      newState.unlockedAchievements = [
        ...newState.unlockedAchievements,
        chain.reward.achievementId,
      ];
    }
  }

  // Note: cosmetic titles are not stored separately yet, but could be added to a cosmetics system

  return newState;
}

/**
 * Progress a story chain to the next step
 * Returns updated state with progress incremented and rewards applied if completed
 */
function progressStoryChain(
  state: GameState,
  chainId: string,
  currentStep: number
): GameState {
  const chain = getStoryChainById(chainId);
  if (!chain) {
    return state;
  }

  const newStep = currentStep + 1;
  const isCompleted = newStep >= chain.totalSteps - 1;

  // Initialize storyProgress if needed
  const storyProgress = { ...state.storyProgress };

  // Update progress for this chain
  const existingProgress = storyProgress[chainId] || {
    chainId,
    currentStep: -1,
    completed: false,
    timesCompleted: 0,
  };

  storyProgress[chainId] = {
    ...existingProgress,
    currentStep: newStep,
    completed: isCompleted,
    timesCompleted: isCompleted
      ? existingProgress.timesCompleted + 1
      : existingProgress.timesCompleted,
  };

  let newState: GameState = {
    ...state,
    storyProgress,
    lastStoryEventAt: Date.now(),
  };

  // Apply rewards if completed
  if (isCompleted) {
    newState = applyStoryReward(newState, chain);
  }

  return newState;
}

/**
 * Determine if we should show a story mail vs flavor mail
 * Returns true if story mail should be shown
 */
function shouldShowStory(state: GameState): boolean {
  // Check cooldown
  if (!canShowStoryMail(state, 60)) {
    return false;
  }

  // Check if any story chains are available
  const nextChain = getNextStoryChain(state);
  if (!nextChain) {
    return false;
  }

  // Roll for story chance
  const storyChance = state.storySettings?.storyChanceWeight ?? 0.2; // Default 20%
  return Math.random() < storyChance;
}

/**
 * Select a story mail to show
 * Returns the mail template and updated state, or undefined if no story available
 */
function selectStoryMail(state: GameState): MailSelectionResult | undefined {
  const chain = getNextStoryChain(state);
  if (!chain) {
    return undefined;
  }

  // Get current progress for this chain
  const progress = state.storyProgress?.[chain.id];
  const currentStep = progress?.currentStep ?? -1;

  // Get the next step's mail template
  const mail = getNextStoryStep(chain, currentStep);
  if (!mail) {
    return undefined;
  }

  // Progress the chain
  const updatedState = progressStoryChain(state, chain.id, currentStep);

  return {
    mail,
    updatedState,
  };
}

/**
 * Main function to get the next mail entry
 * Decides between story mail and flavor mail, and returns the mail + updated state
 *
 * This is the primary entry point for MailFeed to use
 */
export function getNextMailWithStory(
  state: GameState,
  flavorMailGenerator: () => MailTemplate
): MailSelectionResult {
  // Decide whether to show story or flavor mail
  if (shouldShowStory(state)) {
    const storyResult = selectStoryMail(state);
    if (storyResult) {
      return storyResult;
    }
  }

  // Fallback to flavor mail
  const flavorMail = flavorMailGenerator();
  return {
    mail: flavorMail,
    updatedState: state,
  };
}

/**
 * Initialize story progress fields for a new or existing save
 * Ensures backwards compatibility
 */
export function initializeStoryProgress(state: GameState): GameState {
  if (!state.storyProgress) {
    state.storyProgress = {};
  }

  if (!state.storySettings) {
    state.storySettings = {
      storyChanceWeight: 0.2, // 20% default
    };
  }

  return state;
}
