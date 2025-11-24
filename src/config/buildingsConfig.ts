/**
 * Buildings Configuration
 *
 * This file contains all numeric properties for buildings including base costs,
 * production rates, and cost scaling factors. Adjust these values to tune
 * individual building balance and progression speed.
 *
 * Note: Unlock conditions are still defined with the building data in constants.ts
 * as they involve game logic, not just numbers.
 */

// === STAGE 1: LOCAL PLANET ===

// Messenger Pigeon
export const PIGEON_BASE_COST = 10;
export const PIGEON_BASE_PRODUCTION = 0.1;
export const PIGEON_COST_FACTOR = 1.15;

// Corner Mailbox
export const MAILBOX_BASE_COST = 25;
export const MAILBOX_BASE_PRODUCTION = 0.3;
export const MAILBOX_COST_FACTOR = 1.15;

// Paper Route
export const PAPER_BOY_BASE_COST = 60;
export const PAPER_BOY_BASE_PRODUCTION = 0.8;
export const PAPER_BOY_COST_FACTOR = 1.16;

// Bike Courier
export const BIKE_COURIER_BASE_COST = 150;
export const BIKE_COURIER_BASE_PRODUCTION = 2;
export const BIKE_COURIER_COST_FACTOR = 1.16;

// Mail Truck
export const MAIL_TRUCK_BASE_COST = 600;
export const MAIL_TRUCK_BASE_PRODUCTION = 8;
export const MAIL_TRUCK_COST_FACTOR = 1.17;

// Auto-Sort Center
export const SORTING_CENTER_BASE_COST = 2000;
export const SORTING_CENTER_BASE_PRODUCTION = 20;
export const SORTING_CENTER_COST_FACTOR = 1.18;
/** Letters delivered required to unlock Auto-Sort Center */
export const SORTING_CENTER_UNLOCK_LETTERS = 500;

// === STAGE 2: SOLAR SYSTEM ===

// Drone Fleet
export const DRONE_FLEET_BASE_COST = 10_000;
export const DRONE_FLEET_BASE_PRODUCTION = 50;
export const DRONE_FLEET_COST_FACTOR = 1.20;

// Orbital Cannon
export const ORBITAL_CANNON_BASE_COST = 50_000;
export const ORBITAL_CANNON_BASE_PRODUCTION = 150;
export const ORBITAL_CANNON_COST_FACTOR = 1.21;

// Lunar Sorting Base
export const LUNAR_BASE_BASE_COST = 200_000;
export const LUNAR_BASE_BASE_PRODUCTION = 500;
export const LUNAR_BASE_COST_FACTOR = 1.22;

// Space Elevator
export const SPACE_ELEVATOR_BASE_COST = 1_000_000;
export const SPACE_ELEVATOR_BASE_PRODUCTION = 2000;
export const SPACE_ELEVATOR_COST_FACTOR = 1.23;
/** Letters delivered required to unlock Space Elevator */
export const SPACE_ELEVATOR_UNLOCK_LETTERS = 50_000;

// Rocket Shuttle
export const ROCKET_SHUTTLE_BASE_COST = 5_000_000;
export const ROCKET_SHUTTLE_BASE_PRODUCTION = 8000;
export const ROCKET_SHUTTLE_COST_FACTOR = 1.24;
/** Space Elevators required to unlock Rocket Shuttle */
export const ROCKET_SHUTTLE_UNLOCK_SPACE_ELEVATORS = 10;

// === STAGE 3: INTERSTELLAR ===

// Cryo-Hauler
export const CRYO_HAULER_BASE_COST = 25_000_000;
export const CRYO_HAULER_BASE_PRODUCTION = 30_000;
export const CRYO_HAULER_COST_FACTOR = 1.25;

// Solar Sail Barge
export const SOLAR_SAIL_BASE_COST = 150_000_000;
export const SOLAR_SAIL_BASE_PRODUCTION = 100_000;
export const SOLAR_SAIL_COST_FACTOR = 1.26;

// Jump Gate
export const JUMP_GATE_BASE_COST = 800_000_000;
export const JUMP_GATE_BASE_PRODUCTION = 400_000;
export const JUMP_GATE_COST_FACTOR = 1.27;
// Unlock condition: requires 'jump_drive_theory' research

// Antimatter Engine
export const ANTIMATTER_DRIVE_BASE_COST = 5_000_000_000;
export const ANTIMATTER_DRIVE_BASE_PRODUCTION = 1_500_000;
export const ANTIMATTER_DRIVE_COST_FACTOR = 1.28;
/** Letters delivered required to unlock Antimatter Engine */
export const ANTIMATTER_DRIVE_UNLOCK_LETTERS = 5_000_000;

// === STAGE 4: GALACTIC ===

// Black Hole Router
export const BLACK_HOLE_ROUTER_BASE_COST = 30_000_000_000;
export const BLACK_HOLE_ROUTER_BASE_PRODUCTION = 5_000_000;
export const BLACK_HOLE_ROUTER_COST_FACTOR = 1.29;

// Dyson Mail Swarm
export const DYSON_SWARM_BASE_COST = 200_000_000_000;
export const DYSON_SWARM_BASE_PRODUCTION = 20_000_000;
export const DYSON_SWARM_COST_FACTOR = 1.30;
/** Shards required to unlock Dyson Mail Swarm */
export const DYSON_SWARM_UNLOCK_SHARDS = 2;

// Nebula Harvester
export const NEBULA_HARVESTER_BASE_COST = 1_500_000_000_000;
export const NEBULA_HARVESTER_BASE_PRODUCTION = 80_000_000;
export const NEBULA_HARVESTER_COST_FACTOR = 1.31;

// Galactic Core Hub
export const GALACTIC_HUB_BASE_COST = 10_000_000_000_000;
export const GALACTIC_HUB_BASE_PRODUCTION = 300_000_000;
export const GALACTIC_HUB_COST_FACTOR = 1.32;
/** Nebula Harvesters required to unlock Galactic Core Hub */
export const GALACTIC_HUB_UNLOCK_NEBULA_HARVESTERS = 25;

// === STAGE 5: MULTIVERSE ===

// Quantum Entangler
export const QUANTUM_ENTANGLER_BASE_COST = 100_000_000_000_000;
export const QUANTUM_ENTANGLER_BASE_PRODUCTION = 1_000_000_000;
export const QUANTUM_ENTANGLER_COST_FACTOR = 1.33;

// Timeline Splicer
export const TIMELINE_SPLICER_BASE_COST = 1_000_000_000_000_000;
export const TIMELINE_SPLICER_BASE_PRODUCTION = 5_000_000_000;
export const TIMELINE_SPLICER_COST_FACTOR = 1.34;
/** Shards required to unlock Timeline Splicer */
export const TIMELINE_SPLICER_UNLOCK_SHARDS = 5;

// Reality Loom
export const REALITY_LOOM_BASE_COST = 15_000_000_000_000_000;
export const REALITY_LOOM_BASE_PRODUCTION = 25_000_000_000;
export const REALITY_LOOM_COST_FACTOR = 1.35;
// Unlock condition: requires 'reality_manipulation' research

// Entropy Reverser
export const ENTROPY_REVERSER_BASE_COST = 200_000_000_000_000_000;
export const ENTROPY_REVERSER_BASE_PRODUCTION = 100_000_000_000;
export const ENTROPY_REVERSER_COST_FACTOR = 1.36;
/** Total prestiges required to unlock Entropy Reverser */
export const ENTROPY_REVERSER_UNLOCK_PRESTIGES = 10;
