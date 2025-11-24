/**
 * Core Game Balance Configuration
 *
 * This file contains all the fundamental numeric constants that drive the game's progression,
 * prestige systems, multipliers, and core mechanics. Adjust these values to tune game balance.
 */

// === PRESTIGE SYSTEM ===

/** Divisor for calculating stamps from letters delivered (higher = harder to earn stamps) */
export const STAMPS_DIVISOR = 1_000_000_000; // 1 billion letters for first stamp

/** Power exponent for stamp formula (lower = more stamps, higher = fewer stamps) */
export const STAMPS_POWER_EXPONENT = 1 / 3; // Cube root

/** Multiplier applied to stamp calculation to scale rewards */
export const STAMPS_REWARD_MULTIPLIER = 10;

/** Divisor for calculating shards from lifetime stamps (higher = harder to earn shards) */
export const SHARDS_DIVISOR = 100; // 100 lifetime stamps for first shard

/** Base multiplier per shard (exponential growth) */
export const SHARD_MULTIPLIER_BASE = 1.5; // 1.5x per shard

/** Power exponent for stamp multiplier (affects diminishing returns) */
export const STAMP_MULTIPLIER_POWER = 0.6;

/** Multiplier per stamp for passive bonuses (used with power scaling) */
export const STAMP_MULTIPLIER_PER_STAMP = 0.1; // ~10% at 1 stamp, ~25% at 10 stamps

// === META-UPGRADES ===

/** Click power bonus per level for Enhanced Ergonomics meta-upgrade (as percentage) */
export const META_CLICK_POWER_BONUS_PER_LEVEL = 5; // 5% per level

/** Auto production bonus per level for Automation Protocols meta-upgrade (as percentage) */
export const META_AUTO_POWER_BONUS_PER_LEVEL = 5; // 5% per level

/** Building cost reduction per level for Bulk Discounts meta-upgrade (as percentage) */
export const META_COST_REDUCTION_PER_LEVEL = 2; // 2% per level

/** Offline time bonus per level for Passive Operations meta-upgrade (in minutes) */
export const META_OFFLINE_TIME_PER_LEVEL = 30; // 30 minutes per level

/** Research speed bonus per level for Research Efficiency meta-upgrade (as percentage) */
export const META_RESEARCH_SPEED_PER_LEVEL = 10; // 10% per level

/** Global production bonus per level for Network Expansion meta-upgrade (as percentage) */
export const META_NETWORK_EXPANSION_PER_LEVEL = 3; // 3% per level

// === CLICK MECHANICS ===

/** Base click value before multipliers */
export const CLICK_BASE_VALUE = 1;

/** Bonus click power per building owned */
export const CLICK_POWER_PER_BUILDING = 0.1;

// === RESEARCH SYSTEM ===

/** Power exponent for research points calculation from LPS (affects diminishing returns) */
export const RESEARCH_POINTS_POWER = 0.4;

/** Base multiplier for research points generation */
export const RESEARCH_POINTS_BASE_MULTIPLIER = 0.5;

/** Multiplier from research_lab research */
export const RESEARCH_LAB_MULTIPLIER = 2;

/** Multiplier from research_network research */
export const RESEARCH_NETWORK_MULTIPLIER = 2;

/** Multiplier from quantum_computing research */
export const QUANTUM_COMPUTING_MULTIPLIER = 3;

/** Meta-upgrade bonus multiplier per level (different from META_RESEARCH_SPEED_PER_LEVEL) */
export const RESEARCH_META_BONUS_PER_LEVEL = 0.5; // 50% per level

// === RESEARCH BONUSES (PRODUCTION) ===

/** Better sorting production bonus */
export const RESEARCH_BETTER_SORTING_BONUS = 1.05; // 5%

/** Advanced sorting production bonus */
export const RESEARCH_ADVANCED_SORTING_BONUS = 1.1; // 10%

/** Quantum sorting production bonus */
export const RESEARCH_QUANTUM_SORTING_BONUS = 1.15; // 15%

/** Logistics AI production bonus */
export const RESEARCH_LOGISTICS_AI_BONUS = 1.08; // 8%

/** Parallel processing production bonus */
export const RESEARCH_PARALLEL_PROCESSING_BONUS = 1.12; // 12%

/** Time dilation production bonus */
export const RESEARCH_TIME_DILATION_BONUS = 1.2; // 20%

/** Hive consciousness production bonus */
export const RESEARCH_HIVE_CONSCIOUSNESS_BONUS = 1.25; // 25%

/** Dimensional folding production bonus */
export const RESEARCH_DIMENSIONAL_FOLDING_BONUS = 2; // 2x

/** Unified field theory production bonus */
export const RESEARCH_UNIFIED_FIELD_THEORY_BONUS = 1.3; // 30%

/** Universal language production bonus */
export const RESEARCH_UNIVERSAL_LANGUAGE_BONUS = 1.2; // 20%

/** Probability manipulation production bonus */
export const RESEARCH_PROBABILITY_MANIPULATION_BONUS = 1.4; // 40%

/** Cosmic awareness production bonus */
export const RESEARCH_COSMIC_AWARENESS_BONUS = 2; // 2x

/** Entropy reversal production bonus */
export const RESEARCH_ENTROPY_REVERSAL_BONUS = 3; // 3x

// === RESEARCH BONUSES (CLICK POWER) ===

/** Ergonomic training click bonus */
export const RESEARCH_ERGONOMIC_TRAINING_BONUS = 1.1; // 10%

/** Bionic enhancements click bonus */
export const RESEARCH_BIONIC_ENHANCEMENTS_BONUS = 1.2; // 20%

/** Neural interface click bonus */
export const RESEARCH_NEURAL_INTERFACE_BONUS = 1.15; // 15%

/** Psychic delivery click bonus */
export const RESEARCH_PSYCHIC_DELIVERY_BONUS = 1.25; // 25%

/** Omnipresence protocol click bonus */
export const RESEARCH_OMNIPRESENCE_BONUS = 2; // 2x

/** Postal ascension click bonus */
export const RESEARCH_ASCENSION_BONUS = 3; // 3x

// === RESEARCH BONUSES (COST REDUCTION) ===

/** Route optimization cost reduction multiplier */
export const RESEARCH_ROUTE_OPTIMIZATION_MULTIPLIER = 0.95; // 5% cheaper

/** Efficiency protocols cost reduction multiplier */
export const RESEARCH_EFFICIENCY_PROTOCOLS_MULTIPLIER = 0.9; // 10% cheaper

/** Supply chain cost reduction multiplier */
export const RESEARCH_SUPPLY_CHAIN_MULTIPLIER = 0.92; // 8% cheaper

/** Zero-point energy cost reduction multiplier */
export const RESEARCH_ZERO_POINT_ENERGY_MULTIPLIER = 0.85; // 15% cheaper

/** Matter synthesis cost reduction multiplier */
export const RESEARCH_MATTER_SYNTHESIS_MULTIPLIER = 0.8; // 20% cheaper

// === BUILDING-SPECIFIC RESEARCH BONUSES ===

/** Cryogenic preservation cost reduction for cryo-hauler */
export const RESEARCH_CRYOGENIC_COST_REDUCTION = 0.9; // 10% cheaper

/** Singularity engineering cost reduction for black hole router */
export const RESEARCH_SINGULARITY_COST_REDUCTION = 0.8; // 20% cheaper

// === GAME LOOP TIMING ===

/** Main game loop interval in milliseconds */
export const GAME_LOOP_INTERVAL_MS = 100;

/** Achievement notification display duration in milliseconds */
export const ACHIEVEMENT_NOTIFICATION_DURATION_MS = 5000;

/** Contract notification display duration in milliseconds */
export const CONTRACT_NOTIFICATION_DURATION_MS = 5000;

// === MAIL FEED SYSTEM ===

/** Interval for mail feed auto-refresh in milliseconds */
export const MAIL_FEED_REFRESH_INTERVAL_MS = 8000;

/** Probability threshold for mail refresh (higher = less frequent) */
export const MAIL_FEED_REFRESH_PROBABILITY = 0.7; // 30% chance per interval

/** Maximum number of messages to keep in mail feed */
export const MAIL_FEED_MAX_MESSAGES = 10;

/** Story mail cooldown in seconds (prevents overwhelming player with story events) */
export const STORY_MAIL_COOLDOWN_SECONDS = 60;

/** Story mail chance weight (probability of story mail vs flavor mail) */
export const STORY_MAIL_CHANCE_WEIGHT = 0.2; // 20% chance

// === UI/UX CONSTANTS ===

/** Click effect animation duration in milliseconds */
export const CLICK_EFFECT_DURATION_MS = 500;
