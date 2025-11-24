/**
 * Configuration Index
 *
 * Centralized export point for all game configuration constants.
 * Import from this file for convenient access to any config value.
 *
 * Example:
 *   import { GAME_LOOP_INTERVAL_MS, PIGEON_BASE_COST } from '@/config';
 */

// Core game balance and mechanics
export * from './gameBalance';

// Stage unlock thresholds
export * from './stageThresholds';

// Buildings configuration
export * from './buildingsConfig';

// Upgrades configuration
export * from './upgradesConfig';

// Meta-upgrades configuration
export * from './metaUpgradesConfig';

// Research configuration
export * from './researchConfig';

// Achievements configuration
export * from './achievementsConfig';

// Routes configuration
export * from './routesConfig';

// Contracts configuration
export * from './contractsConfig';

// Story chains configuration
export * from './storyConfig';
