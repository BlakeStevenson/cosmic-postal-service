/**
 * Upgrades Configuration
 *
 * This file contains all numeric properties for one-time upgrades including
 * costs and multiplier values. These upgrades provide permanent boosts to
 * click power, global production, or building-specific production.
 *
 * Note: Unlock conditions remain in constants.ts as they involve game logic.
 */

// === LOCAL STAGE UPGRADES ===

// Gel Soles (Click)
export const SNEAKERS_COST = 100;
export const SNEAKERS_MULTIPLIER = 2;

// Gourmet Bird Seed (Pigeon Production)
export const BIRD_FEED_COST = 500;
export const BIRD_FEED_MULTIPLIER = 2;

// Axle Grease (Bike Courier Production)
export const GREASE_COST = 1500;
export const GREASE_MULTIPLIER = 1.5;

// Zip Codes (Global Production)
export const ZIP_CODES_COST = 8000;
export const ZIP_CODES_MULTIPLIER = 1.2;

// === SOLAR STAGE UPGRADES ===

// AI Navigation (Drone Fleet Production)
export const AUTOPILOT_COST = 100_000;
export const AUTOPILOT_MULTIPLIER = 2;

// Carbon Fiber Boxes (Global Production)
export const CARBON_FIBER_COST = 500_000;
export const CARBON_FIBER_MULTIPLIER = 1.5;

// Liquid Oxygen (Rocket Shuttle Production)
export const LIQUID_FUEL_COST = 3_000_000;
export const LIQUID_FUEL_MULTIPLIER = 2;

// === INTERSTELLAR STAGE UPGRADES ===

// Deep Freeze (Cryo-Hauler Production)
export const CRYO_FREEZE_COST = 100_000_000;
export const CRYO_FREEZE_MULTIPLIER = 2.5;

// Subspace Transmitters (Global Production)
export const SUBSPACE_COST = 500_000_000;
export const SUBSPACE_MULTIPLIER = 2;

// Wormhole Mapping (Jump Gate Production)
export const WORMHOLE_MAP_COST = 2_000_000_000;
export const WORMHOLE_MAP_MULTIPLIER = 3;
/** Jump Gates required to unlock Wormhole Mapping */
export const WORMHOLE_MAP_UNLOCK_JUMP_GATES = 5;

// === GALACTIC STAGE UPGRADES ===

// Dark Matter Injection (Click)
export const DARK_MATTER_FUEL_COST = 100_000_000_000;
export const DARK_MATTER_FUEL_MULTIPLIER = 5;
/** Stamps required to unlock Dark Matter Injection */
export const DARK_MATTER_FUEL_UNLOCK_STAMPS = 30;

// Hive Mind Protocols (Global Production)
export const HIVE_MIND_COST = 500_000_000_000;
export const HIVE_MIND_MULTIPLIER = 2;

// Event Horizon Shielding (Black Hole Router Production)
export const EVENT_HORIZON_COST = 3_000_000_000_000;
export const EVENT_HORIZON_MULTIPLIER = 4;

// === MULTIVERSE STAGE UPGRADES ===

// Infinity Glove (Click)
export const INFINITY_GAUNTLET_COST = 50_000_000_000_000;
export const INFINITY_GAUNTLET_MULTIPLIER = 10;
/** Shards required to unlock Infinity Glove */
export const INFINITY_GAUNTLET_UNLOCK_SHARDS = 3;

// Paradox Insurance (Global Production)
export const PARADOX_INSURANCE_COST = 300_000_000_000_000;
export const PARADOX_INSURANCE_MULTIPLIER = 3;

// Postmaster Omnipotence (Global Production)
export const OMNIPOTENCE_COST = 5_000_000_000_000_000;
export const OMNIPOTENCE_MULTIPLIER = 100;
/** Lifetime letters delivered required to unlock Postmaster Omnipotence */
export const OMNIPOTENCE_UNLOCK_LIFETIME_LETTERS = 1_000_000_000_000; // 1 trillion
