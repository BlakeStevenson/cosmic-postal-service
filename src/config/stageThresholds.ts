/**
 * Stage Unlock Thresholds Configuration
 *
 * This file contains all the numeric thresholds required to unlock different stages
 * of the game progression. Stages can be unlocked through multiple paths (letters delivered,
 * stamps earned, or shards acquired).
 */

// === STAGE UNLOCK THRESHOLDS (LETTERS DELIVERED) ===

/** Letters required to unlock Solar System stage */
export const STAGE_SOLAR_LETTERS_THRESHOLD = 10_000;

/** Letters required to unlock Interstellar stage */
export const STAGE_INTERSTELLAR_LETTERS_THRESHOLD = 1_000_000;

/** Letters required to unlock Galactic stage */
export const STAGE_GALACTIC_LETTERS_THRESHOLD = 100_000_000;

/** Letters required to unlock Multiverse stage */
export const STAGE_MULTIVERSE_LETTERS_THRESHOLD = 10_000_000_000;

// === STAGE UNLOCK THRESHOLDS (STAMPS) ===

/** Stamps required to unlock Solar System stage (alternative path) */
export const STAGE_SOLAR_STAMPS_THRESHOLD = 5;

/** Stamps required to unlock Interstellar stage (alternative path) */
export const STAGE_INTERSTELLAR_STAMPS_THRESHOLD = 20;

/** Stamps required to unlock Galactic stage (alternative path) */
export const STAGE_GALACTIC_STAMPS_THRESHOLD = 50;

/** Stamps required to unlock Multiverse stage (alternative path) */
export const STAGE_MULTIVERSE_STAMPS_THRESHOLD = 100;

// === STAGE UNLOCK THRESHOLDS (SHARDS) ===

/** Shards required to unlock Interstellar stage (alternative path) */
export const STAGE_INTERSTELLAR_SHARDS_THRESHOLD = 1;

/** Shards required to unlock Galactic stage (alternative path) */
export const STAGE_GALACTIC_SHARDS_THRESHOLD = 3;

/** Shards required to unlock Multiverse stage (alternative path) */
export const STAGE_MULTIVERSE_SHARDS_THRESHOLD = 10;
