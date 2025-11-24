import { Building, Stage, Upgrade, MetaUpgrade, Research, GameState, Achievement, AchievementCategory, AchievementRarity, ResearchCategory } from './types';
import * as Config from './src/config';

// === BUILDINGS ===
// Now with costFactor for exponential scaling and unlock conditions

export const BUILDINGS: Building[] = [
  // --- STAGE 1: LOCAL PLANET ---
  {
    id: 'pigeon',
    name: 'Messenger Pigeon',
    baseCost: Config.PIGEON_BASE_COST,
    baseProduction: Config.PIGEON_BASE_PRODUCTION,
    costFactor: Config.PIGEON_COST_FACTOR,
    stage: Stage.Local,
    description: 'Reliable, organic, biodegradable unit.',
    icon: '🐦'
  },
  {
    id: 'mailbox',
    name: 'Corner Mailbox',
    baseCost: Config.MAILBOX_BASE_COST,
    baseProduction: Config.MAILBOX_BASE_PRODUCTION,
    costFactor: Config.MAILBOX_COST_FACTOR,
    stage: Stage.Local,
    description: 'Passive collection point. Graffiti included.',
    icon: '📮'
  },
  {
    id: 'paper_boy',
    name: 'Paper Route',
    baseCost: Config.PAPER_BOY_BASE_COST,
    baseProduction: Config.PAPER_BOY_BASE_PRODUCTION,
    costFactor: Config.PAPER_BOY_COST_FACTOR,
    stage: Stage.Local,
    description: 'Throwing aim is 50/50 at best.',
    icon: '🗞️'
  },
  {
    id: 'bike_courier',
    name: 'Bike Courier',
    baseCost: Config.BIKE_COURIER_BASE_COST,
    baseProduction: Config.BIKE_COURIER_BASE_PRODUCTION,
    costFactor: Config.BIKE_COURIER_COST_FACTOR,
    stage: Stage.Local,
    description: 'Fixed gear, fueled by espresso.',
    icon: '🚲'
  },
  {
    id: 'mail_truck',
    name: 'Mail Truck',
    baseCost: Config.MAIL_TRUCK_BASE_COST,
    baseProduction: Config.MAIL_TRUCK_BASE_PRODUCTION,
    costFactor: Config.MAIL_TRUCK_COST_FACTOR,
    stage: Stage.Local,
    description: 'Neither snow nor rain nor gloom of night.',
    icon: '🚚'
  },
  {
    id: 'sorting_center',
    name: 'Auto-Sort Center',
    baseCost: Config.SORTING_CENTER_BASE_COST,
    baseProduction: Config.SORTING_CENTER_BASE_PRODUCTION,
    costFactor: Config.SORTING_CENTER_COST_FACTOR,
    stage: Stage.Local,
    description: 'Now with 20% fewer crushed packages.',
    icon: '🏭',
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.SORTING_CENTER_UNLOCK_LETTERS
  },

  // --- STAGE 2: SOLAR SYSTEM ---
  {
    id: 'drone_fleet',
    name: 'Drone Fleet',
    baseCost: Config.DRONE_FLEET_BASE_COST,
    baseProduction: Config.DRONE_FLEET_BASE_PRODUCTION,
    costFactor: Config.DRONE_FLEET_COST_FACTOR,
    stage: Stage.Solar,
    description: 'Blocking out the sun, one parcel at a time.',
    icon: '🚁'
  },
  {
    id: 'orbital_cannon',
    name: 'Orbital Cannon',
    baseCost: Config.ORBITAL_CANNON_BASE_COST,
    baseProduction: Config.ORBITAL_CANNON_BASE_PRODUCTION,
    costFactor: Config.ORBITAL_CANNON_COST_FACTOR,
    stage: Stage.Solar,
    description: 'Yeet the mail into low earth orbit.',
    icon: '☄️'
  },
  {
    id: 'lunar_base',
    name: 'Lunar Sorting Base',
    baseCost: Config.LUNAR_BASE_BASE_COST,
    baseProduction: Config.LUNAR_BASE_BASE_PRODUCTION,
    costFactor: Config.LUNAR_BASE_COST_FACTOR,
    stage: Stage.Solar,
    description: 'Low gravity means stamps stick better.',
    icon: '🌑'
  },
  {
    id: 'space_elevator',
    name: 'Space Elevator',
    baseCost: Config.SPACE_ELEVATOR_BASE_COST,
    baseProduction: Config.SPACE_ELEVATOR_BASE_PRODUCTION,
    costFactor: Config.SPACE_ELEVATOR_COST_FACTOR,
    stage: Stage.Solar,
    description: 'Going up. Ding.',
    icon: '🏗️',
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.SPACE_ELEVATOR_UNLOCK_LETTERS
  },
  {
    id: 'rocket_shuttle',
    name: 'Rocket Shuttle',
    baseCost: Config.ROCKET_SHUTTLE_BASE_COST,
    baseProduction: Config.ROCKET_SHUTTLE_BASE_PRODUCTION,
    costFactor: Config.ROCKET_SHUTTLE_COST_FACTOR,
    stage: Stage.Solar,
    description: 'Daily service to Mars and Venus.',
    icon: '🚀',
    unlockCondition: (state: GameState) => {
      const shuttleCount = state.buildings['space_elevator'] || 0;
      return shuttleCount >= Config.ROCKET_SHUTTLE_UNLOCK_SPACE_ELEVATORS;
    }
  },

  // --- STAGE 3: INTERSTELLAR ---
  {
    id: 'cryo_hauler',
    name: 'Cryo-Hauler',
    baseCost: Config.CRYO_HAULER_BASE_COST,
    baseProduction: Config.CRYO_HAULER_BASE_PRODUCTION,
    costFactor: Config.CRYO_HAULER_COST_FACTOR,
    stage: Stage.Interstellar,
    description: 'Mail arrives fresh, even after 50 years.',
    icon: '❄️'
  },
  {
    id: 'solar_sail',
    name: 'Solar Sail Barge',
    baseCost: Config.SOLAR_SAIL_BASE_COST,
    baseProduction: Config.SOLAR_SAIL_BASE_PRODUCTION,
    costFactor: Config.SOLAR_SAIL_COST_FACTOR,
    stage: Stage.Interstellar,
    description: 'Riding the solar winds. Very eco-friendly.',
    icon: '⛵'
  },
  {
    id: 'jump_gate',
    name: 'Jump Gate',
    baseCost: Config.JUMP_GATE_BASE_COST,
    baseProduction: Config.JUMP_GATE_BASE_PRODUCTION,
    costFactor: Config.JUMP_GATE_COST_FACTOR,
    stage: Stage.Interstellar,
    description: 'Instant travel between sectors.',
    icon: '⛩️',
    unlockCondition: (state: GameState) => state.completedResearch.includes('jump_drive_theory')
  },
  {
    id: 'antimatter_drive',
    name: 'Antimatter Engine',
    baseCost: Config.ANTIMATTER_DRIVE_BASE_COST,
    baseProduction: Config.ANTIMATTER_DRIVE_BASE_PRODUCTION,
    costFactor: Config.ANTIMATTER_DRIVE_COST_FACTOR,
    stage: Stage.Interstellar,
    description: 'Don\'t drop it.',
    icon: '⚛️',
    unlockCondition: (state: GameState) => state.lettersDelivered >= Config.ANTIMATTER_DRIVE_UNLOCK_LETTERS
  },

  // --- STAGE 4: GALACTIC ---
  {
    id: 'black_hole_router',
    name: 'Black Hole Router',
    baseCost: Config.BLACK_HOLE_ROUTER_BASE_COST,
    baseProduction: Config.BLACK_HOLE_ROUTER_BASE_PRODUCTION,
    costFactor: Config.BLACK_HOLE_ROUTER_COST_FACTOR,
    stage: Stage.Galactic,
    description: 'Gravitational slingshotting at extreme scale.',
    icon: '🕳️'
  },
  {
    id: 'dyson_swarm',
    name: 'Dyson Mail Swarm',
    baseCost: Config.DYSON_SWARM_BASE_COST,
    baseProduction: Config.DYSON_SWARM_BASE_PRODUCTION,
    costFactor: Config.DYSON_SWARM_COST_FACTOR,
    stage: Stage.Galactic,
    description: 'Harnessing a sun to print shipping labels.',
    icon: '🌞',
    unlockCondition: (state: GameState) => state.shards >= Config.DYSON_SWARM_UNLOCK_SHARDS
  },
  {
    id: 'nebula_harvester',
    name: 'Nebula Harvester',
    baseCost: Config.NEBULA_HARVESTER_BASE_COST,
    baseProduction: Config.NEBULA_HARVESTER_BASE_PRODUCTION,
    costFactor: Config.NEBULA_HARVESTER_COST_FACTOR,
    stage: Stage.Galactic,
    description: 'Mining gas clouds for bubble wrap.',
    icon: '🌫️'
  },
  {
    id: 'galactic_hub',
    name: 'Galactic Core Hub',
    baseCost: Config.GALACTIC_HUB_BASE_COST,
    baseProduction: Config.GALACTIC_HUB_BASE_PRODUCTION,
    costFactor: Config.GALACTIC_HUB_COST_FACTOR,
    stage: Stage.Galactic,
    description: 'The center of the galaxy. Traffic is terrible.',
    icon: '🌌',
    unlockCondition: (state: GameState) => {
      const nebulaCount = state.buildings['nebula_harvester'] || 0;
      return nebulaCount >= Config.GALACTIC_HUB_UNLOCK_NEBULA_HARVESTERS;
    }
  },

  // --- STAGE 5: MULTIVERSE ---
  {
    id: 'quantum_entangler',
    name: 'Quantum Entangler',
    baseCost: Config.QUANTUM_ENTANGLER_BASE_COST,
    baseProduction: Config.QUANTUM_ENTANGLER_BASE_PRODUCTION,
    costFactor: Config.QUANTUM_ENTANGLER_COST_FACTOR,
    stage: Stage.Multiverse,
    description: 'Mail is both delivered and not delivered.',
    icon: '🐱'
  },
  {
    id: 'timeline_splicer',
    name: 'Timeline Splicer',
    baseCost: Config.TIMELINE_SPLICER_BASE_COST,
    baseProduction: Config.TIMELINE_SPLICER_BASE_PRODUCTION,
    costFactor: Config.TIMELINE_SPLICER_COST_FACTOR,
    stage: Stage.Multiverse,
    description: 'Delivers to your past self.',
    icon: '🧬',
    unlockCondition: (state: GameState) => state.shards >= Config.TIMELINE_SPLICER_UNLOCK_SHARDS
  },
  {
    id: 'reality_loom',
    name: 'Reality Loom',
    baseCost: Config.REALITY_LOOM_BASE_COST,
    baseProduction: Config.REALITY_LOOM_BASE_PRODUCTION,
    costFactor: Config.REALITY_LOOM_COST_FACTOR,
    stage: Stage.Multiverse,
    description: 'Weaves the fabric of spacetime into envelopes.',
    icon: '🕸️',
    unlockCondition: (state: GameState) => state.completedResearch.includes('reality_manipulation')
  },
  {
    id: 'entropy_reverser',
    name: 'Entropy Reverser',
    baseCost: Config.ENTROPY_REVERSER_BASE_COST,
    baseProduction: Config.ENTROPY_REVERSER_BASE_PRODUCTION,
    costFactor: Config.ENTROPY_REVERSER_COST_FACTOR,
    stage: Stage.Multiverse,
    description: 'Un-losses the lost mail.',
    icon: '⏪',
    unlockCondition: (state: GameState) => state.totalPrestiges >= Config.ENTROPY_REVERSER_UNLOCK_PRESTIGES
  }
];

// === UPGRADES ===
// One-time purchases that boost production

export const UPGRADES: Upgrade[] = [
  // Local Upgrades
  { id: 'sneakers', name: 'Gel Soles', baseCost: Config.SNEAKERS_COST, multiplier: Config.SNEAKERS_MULTIPLIER, type: 'CLICK', stage: Stage.Local, description: 'Premium cushioned footwear for optimal delivery efficiency.', effect: '2x click power' },
  { id: 'bird_feed', name: 'Gourmet Bird Seed', baseCost: Config.BIRD_FEED_COST, multiplier: Config.BIRD_FEED_MULTIPLIER, type: 'BUILDING_PRODUCTION', targetId: 'pigeon', stage: Stage.Local, description: 'Organic, free-range seeds boost morale.', effect: '2x pigeon production' },
  { id: 'grease', name: 'Axle Grease', baseCost: Config.GREASE_COST, multiplier: Config.GREASE_MULTIPLIER, type: 'BUILDING_PRODUCTION', targetId: 'bike_courier', stage: Stage.Local, description: 'Industrial-grade lubricant for peak performance.', effect: '1.5x bike courier production' },
  { id: 'zip_codes', name: 'Zip Codes', baseCost: Config.ZIP_CODES_COST, multiplier: Config.ZIP_CODES_MULTIPLIER, type: 'GLOBAL_PRODUCTION', stage: Stage.Local, description: 'Revolutionary addressing system improves routing.', effect: '+20% global production' },

  // Solar Upgrades
  { id: 'autopilot', name: 'AI Navigation', baseCost: Config.AUTOPILOT_COST, multiplier: Config.AUTOPILOT_MULTIPLIER, type: 'BUILDING_PRODUCTION', targetId: 'drone_fleet', stage: Stage.Solar, description: 'Neural network reduces collision incidents.', effect: '2x drone fleet production' },
  { id: 'carbon_fiber', name: 'Carbon Fiber Boxes', baseCost: Config.CARBON_FIBER_COST, multiplier: Config.CARBON_FIBER_MULTIPLIER, type: 'GLOBAL_PRODUCTION', stage: Stage.Solar, description: 'Ultralight materials maximize cargo capacity.', effect: '+50% global production' },
  { id: 'liquid_fuel', name: 'Liquid Oxygen', baseCost: Config.LIQUID_FUEL_COST, multiplier: Config.LIQUID_FUEL_MULTIPLIER, type: 'BUILDING_PRODUCTION', targetId: 'rocket_shuttle', stage: Stage.Solar, description: 'High-performance propellant for faster burns.', effect: '2x rocket shuttle production' },

  // Interstellar Upgrades
  { id: 'cryo_freeze', name: 'Deep Freeze', baseCost: Config.CRYO_FREEZE_COST, multiplier: Config.CRYO_FREEZE_MULTIPLIER, type: 'BUILDING_PRODUCTION', targetId: 'cryo_hauler', stage: Stage.Interstellar, description: 'Near-zero kelvin temperatures preserve cargo integrity.', effect: '2.5x cryo-hauler production' },
  { id: 'subspace', name: 'Subspace Transmitters', baseCost: Config.SUBSPACE_COST, multiplier: Config.SUBSPACE_MULTIPLIER, type: 'GLOBAL_PRODUCTION', stage: Stage.Interstellar, description: 'Communicate across dimensions for instant coordination.', effect: '2x global production' },
  {
    id: 'wormhole_map',
    name: 'Wormhole Mapping',
    baseCost: Config.WORMHOLE_MAP_COST,
    multiplier: Config.WORMHOLE_MAP_MULTIPLIER,
    type: 'BUILDING_PRODUCTION',
    targetId: 'jump_gate',
    stage: Stage.Interstellar,
    description: 'Comprehensive charts of stable spacetime shortcuts.',
    effect: '3x jump gate production',
    unlockCondition: (state: GameState) => {
      const jumpGateCount = state.buildings['jump_gate'] || 0;
      return jumpGateCount >= Config.WORMHOLE_MAP_UNLOCK_JUMP_GATES;
    }
  },

  // Galactic Upgrades
  {
    id: 'dark_matter_fuel',
    name: 'Dark Matter Injection',
    baseCost: Config.DARK_MATTER_FUEL_COST,
    multiplier: Config.DARK_MATTER_FUEL_MULTIPLIER,
    type: 'CLICK',
    stage: Stage.Galactic,
    description: 'Harness the universe\'s invisible mass for power.',
    effect: '5x click power',
    unlockCondition: (state: GameState) => state.stamps >= Config.DARK_MATTER_FUEL_UNLOCK_STAMPS
  },
  { id: 'hive_mind', name: 'Hive Mind Protocols', baseCost: Config.HIVE_MIND_COST, multiplier: Config.HIVE_MIND_MULTIPLIER, type: 'GLOBAL_PRODUCTION', stage: Stage.Galactic, description: 'Collective consciousness synchronizes all operations.', effect: '2x global production' },
  { id: 'event_horizon', name: 'Event Horizon Shielding', baseCost: Config.EVENT_HORIZON_COST, multiplier: Config.EVENT_HORIZON_MULTIPLIER, type: 'BUILDING_PRODUCTION', targetId: 'black_hole_router', stage: Stage.Galactic, description: 'Gravitational reinforcement prevents disintegration.', effect: '4x black hole router production' },

  // Multiverse Upgrades
  {
    id: 'infinity_gauntlet',
    name: 'Infinity Glove',
    baseCost: Config.INFINITY_GAUNTLET_COST,
    multiplier: Config.INFINITY_GAUNTLET_MULTIPLIER,
    type: 'CLICK',
    stage: Stage.Multiverse,
    description: 'Reality manipulation at your fingertips.',
    effect: '10x click power',
    unlockCondition: (state: GameState) => state.shards >= Config.INFINITY_GAUNTLET_UNLOCK_SHARDS
  },
  { id: 'paradox_insurance', name: 'Paradox Insurance', baseCost: Config.PARADOX_INSURANCE_COST, multiplier: Config.PARADOX_INSURANCE_MULTIPLIER, type: 'GLOBAL_PRODUCTION', stage: Stage.Multiverse, description: 'Full coverage for temporal anomalies and timeline splits.', effect: '3x global production' },
  {
    id: 'omnipotence',
    name: 'Postmaster Omnipotence',
    baseCost: Config.OMNIPOTENCE_COST,
    multiplier: Config.OMNIPOTENCE_MULTIPLIER,
    type: 'GLOBAL_PRODUCTION',
    stage: Stage.Multiverse,
    description: 'Transcend physical limitations entirely.',
    effect: '100x global production',
    unlockCondition: (state: GameState) => {
      return state.lifetimeLettersDelivered >= Config.OMNIPOTENCE_UNLOCK_LIFETIME_LETTERS;
    }
  }
];

// === META-UPGRADES ===
// Permanent upgrades purchased with stamps

export const META_UPGRADES: MetaUpgrade[] = [
  {
    id: 'click_power',
    name: 'Enhanced Ergonomics',
    description: '+5% click power per level',
    level: 0,
    maxLevel: Config.META_CLICK_POWER_MAX_LEVEL,
    baseCost: Config.META_CLICK_POWER_BASE_COST,
    costMultiplier: Config.META_CLICK_POWER_COST_MULTIPLIER,
    effect: (level) => level * Config.META_CLICK_POWER_BONUS_PER_LEVEL
  },
  {
    id: 'auto_power',
    name: 'Automation Protocols',
    description: '+5% automatic production per level',
    level: 0,
    maxLevel: Config.META_AUTO_POWER_MAX_LEVEL,
    baseCost: Config.META_AUTO_POWER_BASE_COST,
    costMultiplier: Config.META_AUTO_POWER_COST_MULTIPLIER,
    effect: (level) => level * Config.META_AUTO_POWER_BONUS_PER_LEVEL
  },
  {
    id: 'cheaper_buildings',
    name: 'Bulk Discounts',
    description: '-2% building costs per level',
    level: 0,
    maxLevel: Config.META_CHEAPER_BUILDINGS_MAX_LEVEL,
    baseCost: Config.META_CHEAPER_BUILDINGS_BASE_COST,
    costMultiplier: Config.META_CHEAPER_BUILDINGS_COST_MULTIPLIER,
    effect: (level) => level * Config.META_COST_REDUCTION_PER_LEVEL
  },
  {
    id: 'offline_time',
    name: 'Passive Operations',
    description: '+30min offline production per level',
    level: 0,
    maxLevel: Config.META_OFFLINE_TIME_MAX_LEVEL,
    baseCost: Config.META_OFFLINE_TIME_BASE_COST,
    costMultiplier: Config.META_OFFLINE_TIME_COST_MULTIPLIER,
    effect: (level) => level * Config.META_OFFLINE_TIME_PER_LEVEL
  },
  {
    id: 'research_speed',
    name: 'Research Efficiency',
    description: '+10% research points per level',
    level: 0,
    maxLevel: Config.META_RESEARCH_SPEED_MAX_LEVEL,
    baseCost: Config.META_RESEARCH_SPEED_BASE_COST,
    costMultiplier: Config.META_RESEARCH_SPEED_COST_MULTIPLIER,
    effect: (level) => level * Config.META_RESEARCH_SPEED_PER_LEVEL
  },
  {
    id: 'network_expansion',
    name: 'Network Expansion',
    description: '+3% to all production per level',
    level: 0,
    maxLevel: Config.META_NETWORK_EXPANSION_MAX_LEVEL,
    baseCost: Config.META_NETWORK_EXPANSION_BASE_COST,
    costMultiplier: Config.META_NETWORK_EXPANSION_COST_MULTIPLIER,
    effect: (level) => level * Config.META_NETWORK_EXPANSION_PER_LEVEL
  }
];

// === RESEARCH ===
// Tech tree progression using research points

export const RESEARCH: Research[] = [
  // Tier 1: Basic improvements
  {
    id: 'better_sorting',
    name: 'Improved Sorting',
    description: 'Optimize sorting algorithms to reduce delivery time.',
    cost: Config.RESEARCH_BETTER_SORTING_COST,
    purchased: false,
    effect: '+5% auto production',
    category: ResearchCategory.Production
  },
  {
    id: 'ergonomic_training',
    name: 'Ergonomic Training',
    description: 'Train carriers in proper lifting techniques and stamina.',
    cost: Config.RESEARCH_ERGONOMIC_TRAINING_COST,
    purchased: false,
    effect: '+10% click power',
    category: ResearchCategory.Click
  },
  {
    id: 'route_optimization',
    name: 'Route Optimization',
    description: 'Use AI pathfinding to minimize travel distance.',
    cost: Config.RESEARCH_ROUTE_OPTIMIZATION_COST,
    purchased: false,
    effect: '-5% building costs',
    category: ResearchCategory.Cost
  },

  // Tier 2: Advanced improvements
  {
    id: 'advanced_sorting',
    name: 'Advanced Sorting',
    description: 'Machine learning models predict optimal package flow.',
    cost: Config.RESEARCH_ADVANCED_SORTING_COST,
    purchased: false,
    prerequisite: 'better_sorting',
    effect: '+10% auto production',
    category: ResearchCategory.Production
  },
  {
    id: 'bionic_enhancements',
    name: 'Bionic Enhancements',
    description: 'Cybernetic augmentations enhance carrier speed and strength.',
    cost: Config.RESEARCH_BIONIC_ENHANCEMENTS_COST,
    purchased: false,
    prerequisite: 'ergonomic_training',
    effect: '+20% click power',
    category: ResearchCategory.Click
  },
  {
    id: 'efficiency_protocols',
    name: 'Efficiency Protocols',
    description: 'Streamlined procurement reduces infrastructure expenses.',
    cost: Config.RESEARCH_EFFICIENCY_PROTOCOLS_COST,
    purchased: false,
    prerequisite: 'route_optimization',
    effect: '-10% building costs',
    category: ResearchCategory.Cost
  },

  // Tier 3: Research boosters
  {
    id: 'research_lab',
    name: 'Research Laboratory',
    description: 'Dedicated facility accelerates R&D efforts.',
    cost: Config.RESEARCH_LAB_COST,
    purchased: false,
    prerequisite: 'advanced_sorting',
    effect: '2x research points',
    category: ResearchCategory.Research
  },
  {
    id: 'research_network',
    name: 'Research Network',
    description: 'Connect labs across solar systems to share findings.',
    cost: Config.RESEARCH_NETWORK_COST,
    purchased: false,
    prerequisite: 'research_lab',
    effect: '2x research points',
    category: ResearchCategory.Research
  },
  {
    id: 'quantum_computing',
    name: 'Quantum Computing',
    description: 'Harness quantum entanglement for instant calculations.',
    cost: Config.RESEARCH_QUANTUM_COMPUTING_COST,
    purchased: false,
    prerequisite: 'research_network',
    effect: '3x research points',
    category: ResearchCategory.Research
  },

  // Tier 4: Advanced mechanics
  {
    id: 'quantum_sorting',
    name: 'Quantum Sorting',
    description: 'Packages exist in superposition until observed at destination.',
    cost: Config.RESEARCH_QUANTUM_SORTING_COST,
    purchased: false,
    prerequisite: 'advanced_sorting',
    effect: '+15% auto production',
    category: ResearchCategory.Production
  },
  {
    id: 'jump_drive_theory',
    name: 'Jump Drive Theory',
    description: 'Understand the physics needed to fold spacetime.',
    cost: Config.RESEARCH_JUMP_DRIVE_THEORY_COST,
    purchased: false,
    prerequisite: 'quantum_sorting',
    effect: 'Unlocks Jump Gate',
    category: ResearchCategory.Specialized
  },
  {
    id: 'reality_manipulation',
    name: 'Reality Manipulation',
    description: 'Weave the fundamental fabric of existence itself.',
    cost: Config.RESEARCH_REALITY_MANIPULATION_COST,
    purchased: false,
    prerequisite: 'jump_drive_theory',
    effect: 'Unlocks Reality Loom',
    category: ResearchCategory.Specialized
  },

  // Tier 2 Extended: More branches
  {
    id: 'logistics_ai',
    name: 'Logistics AI',
    description: 'Self-learning algorithms optimize every delivery route.',
    cost: Config.RESEARCH_LOGISTICS_AI_COST,
    purchased: false,
    prerequisite: 'better_sorting',
    effect: '+8% auto production',
    category: ResearchCategory.Production
  },
  {
    id: 'neural_interface',
    name: 'Neural Interface',
    description: 'Direct brain-to-machine communication speeds up operations.',
    cost: Config.RESEARCH_NEURAL_INTERFACE_COST,
    purchased: false,
    prerequisite: 'bionic_enhancements',
    effect: '+15% click power',
    category: ResearchCategory.Click
  },
  {
    id: 'supply_chain',
    name: 'Supply Chain Optimization',
    description: 'Just-in-time manufacturing reduces overhead costs.',
    cost: Config.RESEARCH_SUPPLY_CHAIN_COST,
    purchased: false,
    prerequisite: 'efficiency_protocols',
    effect: '-8% building costs',
    category: ResearchCategory.Cost
  },

  // Tier 3 Extended: Advanced techniques
  {
    id: 'parallel_processing',
    name: 'Parallel Processing',
    description: 'Handle multiple deliveries simultaneously across timelines.',
    cost: Config.RESEARCH_PARALLEL_PROCESSING_COST,
    purchased: false,
    prerequisite: 'logistics_ai',
    effect: '+12% auto production',
    category: ResearchCategory.Production
  },
  {
    id: 'time_dilation',
    name: 'Time Dilation Field',
    description: 'Slow time locally to accomplish more work.',
    cost: Config.RESEARCH_TIME_DILATION_COST,
    purchased: false,
    prerequisite: 'quantum_sorting',
    effect: '+20% auto production',
    category: ResearchCategory.Production
  },
  {
    id: 'psychic_delivery',
    name: 'Psychic Delivery',
    description: 'Deliver mail through pure thought.',
    cost: Config.RESEARCH_PSYCHIC_DELIVERY_COST,
    purchased: false,
    prerequisite: 'neural_interface',
    effect: '+25% click power',
    category: ResearchCategory.Click
  },
  {
    id: 'zero_point_energy',
    name: 'Zero-Point Energy',
    description: 'Extract power from quantum vacuum fluctuations.',
    cost: Config.RESEARCH_ZERO_POINT_ENERGY_COST,
    purchased: false,
    prerequisite: 'quantum_computing',
    effect: '-15% building costs',
    category: ResearchCategory.Cost
  },

  // Tier 4 Extended: High-level upgrades
  {
    id: 'hive_consciousness',
    name: 'Hive Consciousness',
    description: 'Link all carriers into a unified collective mind.',
    cost: Config.RESEARCH_HIVE_CONSCIOUSNESS_COST,
    purchased: false,
    prerequisite: 'parallel_processing',
    effect: '+25% auto production',
    category: ResearchCategory.Advanced
  },
  {
    id: 'dimensional_folding',
    name: 'Dimensional Folding',
    description: 'Fold space to make distances meaningless.',
    cost: Config.RESEARCH_DIMENSIONAL_FOLDING_COST,
    purchased: false,
    prerequisite: 'time_dilation',
    effect: '2x auto production',
    category: ResearchCategory.Advanced
  },
  {
    id: 'omnipresence',
    name: 'Omnipresence Protocol',
    description: 'Exist in all places simultaneously.',
    cost: Config.RESEARCH_OMNIPRESENCE_COST,
    purchased: false,
    prerequisite: 'psychic_delivery',
    effect: '2x click power',
    category: ResearchCategory.Advanced
  },
  {
    id: 'matter_synthesis',
    name: 'Matter Synthesis',
    description: 'Create buildings from pure energy.',
    cost: Config.RESEARCH_MATTER_SYNTHESIS_COST,
    purchased: false,
    prerequisite: 'zero_point_energy',
    effect: '-20% building costs',
    category: ResearchCategory.Advanced
  },

  // Cross-branch research (requires multiple prerequisites)
  {
    id: 'unified_field_theory',
    name: 'Unified Field Theory',
    description: 'Understand the fundamental forces governing all delivery.',
    cost: Config.RESEARCH_UNIFIED_FIELD_THEORY_COST,
    purchased: false,
    prerequisite: 'dimensional_folding',
    effect: '+30% auto production',
    category: ResearchCategory.Advanced
  },
  {
    id: 'ascension',
    name: 'Postal Ascension',
    description: 'Transcend mortal limitations of mail delivery.',
    cost: Config.RESEARCH_ASCENSION_COST,
    purchased: false,
    prerequisite: 'omnipresence',
    effect: '3x click power',
    category: ResearchCategory.Advanced
  },
  {
    id: 'universal_language',
    name: 'Universal Language',
    description: 'Communicate with all beings across spacetime.',
    cost: Config.RESEARCH_UNIVERSAL_LANGUAGE_COST,
    purchased: false,
    prerequisite: 'hive_consciousness',
    effect: '+20% auto production',
    category: ResearchCategory.Advanced
  },
  {
    id: 'probability_manipulation',
    name: 'Probability Manipulation',
    description: 'Ensure deliveries succeed across all possible timelines.',
    cost: Config.RESEARCH_PROBABILITY_MANIPULATION_COST,
    purchased: false,
    prerequisite: 'reality_manipulation',
    effect: '+40% auto production',
    category: ResearchCategory.Advanced
  },
  {
    id: 'cosmic_awareness',
    name: 'Cosmic Awareness',
    description: 'Perceive the mail needs of the entire multiverse at once.',
    cost: Config.RESEARCH_COSMIC_AWARENESS_COST,
    purchased: false,
    prerequisite: 'unified_field_theory',
    effect: '2x auto production',
    category: ResearchCategory.Advanced
  },
  {
    id: 'entropy_reversal',
    name: 'Entropy Reversal',
    description: 'Reverse the arrow of time itself for perfect efficiency.',
    cost: Config.RESEARCH_ENTROPY_REVERSAL_COST,
    purchased: false,
    prerequisite: 'probability_manipulation',
    effect: '3x auto production',
    category: ResearchCategory.Advanced
  },

  // Side branch: Specialized upgrades
  {
    id: 'cryogenic_preservation',
    name: 'Cryogenic Preservation',
    description: 'Keep cargo fresh for eons.',
    cost: Config.RESEARCH_CRYOGENIC_PRESERVATION_COST,
    purchased: false,
    prerequisite: 'advanced_sorting',
    effect: '+10% production for cryo-based buildings',
    category: ResearchCategory.Specialized
  },
  {
    id: 'antimatter_containment',
    name: 'Antimatter Containment',
    description: 'Safely store and utilize antimatter fuel.',
    cost: Config.RESEARCH_ANTIMATTER_CONTAINMENT_COST,
    purchased: false,
    prerequisite: 'zero_point_energy',
    effect: '+15% production for energy-based buildings',
    category: ResearchCategory.Specialized
  },
  {
    id: 'singularity_engineering',
    name: 'Singularity Engineering',
    description: 'Harness black holes for industrial purposes.',
    cost: Config.RESEARCH_SINGULARITY_ENGINEERING_COST,
    purchased: false,
    prerequisite: 'jump_drive_theory',
    effect: '+20% production for black hole router',
    category: ResearchCategory.Specialized
  }
];

// === ACHIEVEMENTS ===
// Collectible milestones that track player progress

export const ACHIEVEMENTS: Achievement[] = [
  // === PROGRESSION ACHIEVEMENTS ===
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Deliver your first letter',
    category: AchievementCategory.Progression,
    rarity: AchievementRarity.Common,
    icon: '✉️',
    checkUnlock: (state) => state.lettersDelivered >= Config.ACHIEVEMENT_FIRST_STEPS_LETTERS
  },
  {
    id: 'postal_rookie',
    name: 'Postal Rookie',
    description: 'Deliver 1,000 letters',
    category: AchievementCategory.Progression,
    rarity: AchievementRarity.Common,
    icon: '📬',
    checkUnlock: (state) => state.lettersDelivered >= Config.ACHIEVEMENT_POSTAL_ROOKIE_LETTERS
  },
  {
    id: 'interplanetary_courier',
    name: 'Interplanetary Courier',
    description: 'Reach the Solar System stage',
    category: AchievementCategory.Progression,
    rarity: AchievementRarity.Uncommon,
    icon: '🌞',
    checkUnlock: (state) => state.unlockedStages.includes(Stage.Solar)
  },
  {
    id: 'star_hopper',
    name: 'Star Hopper',
    description: 'Reach the Interstellar stage',
    category: AchievementCategory.Progression,
    rarity: AchievementRarity.Rare,
    icon: '⭐',
    checkUnlock: (state) => state.unlockedStages.includes(Stage.Interstellar)
  },
  {
    id: 'galactic_postmaster',
    name: 'Galactic Postmaster',
    description: 'Reach the Galactic stage',
    category: AchievementCategory.Progression,
    rarity: AchievementRarity.Epic,
    icon: '🌌',
    checkUnlock: (state) => state.unlockedStages.includes(Stage.Galactic)
  },
  {
    id: 'multiversal_legend',
    name: 'Multiversal Legend',
    description: 'Reach the Multiverse stage',
    category: AchievementCategory.Progression,
    rarity: AchievementRarity.Legendary,
    icon: '🌠',
    checkUnlock: (state) => state.unlockedStages.includes(Stage.Multiverse)
  },

  // === PRODUCTION ACHIEVEMENTS ===
  {
    id: 'automated_delivery',
    name: 'Automated Delivery',
    description: 'Reach 10 letters per second',
    category: AchievementCategory.Production,
    rarity: AchievementRarity.Common,
    icon: '⚡',
    checkUnlock: (state) => {
      // This will be checked by passing calculated LPS
      return state.lettersDelivered >= Config.ACHIEVEMENT_AUTOMATED_DELIVERY_LETTERS; // Placeholder - will be updated with LPS
    }
  },
  {
    id: 'mail_tsunami',
    name: 'Mail Tsunami',
    description: 'Reach 1,000 letters per second',
    category: AchievementCategory.Production,
    rarity: AchievementRarity.Uncommon,
    icon: '🌊',
    checkUnlock: (state) => state.lettersDelivered >= Config.ACHIEVEMENT_MAIL_TSUNAMI_LETTERS
  },
  {
    id: 'cosmic_flood',
    name: 'Cosmic Flood',
    description: 'Reach 100,000 letters per second',
    category: AchievementCategory.Production,
    rarity: AchievementRarity.Rare,
    icon: '💫',
    checkUnlock: (state) => state.lettersDelivered >= Config.ACHIEVEMENT_COSMIC_FLOOD_LETTERS
  },
  {
    id: 'reality_breaker',
    name: 'Reality Breaker',
    description: 'Reach 1 million letters per second',
    category: AchievementCategory.Production,
    rarity: AchievementRarity.Epic,
    icon: '💥',
    checkUnlock: (state) => state.lettersDelivered >= Config.ACHIEVEMENT_REALITY_BREAKER_LETTERS
  },

  // === BUILDING ACHIEVEMENTS ===
  {
    id: 'bird_watcher',
    name: 'Bird Watcher',
    description: 'Own 10 Messenger Pigeons',
    category: AchievementCategory.Buildings,
    rarity: AchievementRarity.Common,
    icon: '🐦',
    checkUnlock: (state) => (state.buildings['pigeon'] || 0) >= Config.ACHIEVEMENT_BIRD_WATCHER_PIGEONS
  },
  {
    id: 'fleet_commander',
    name: 'Fleet Commander',
    description: 'Own 25 Drone Fleets',
    category: AchievementCategory.Buildings,
    rarity: AchievementRarity.Uncommon,
    icon: '🚁',
    checkUnlock: (state) => (state.buildings['drone_fleet'] || 0) >= Config.ACHIEVEMENT_FLEET_COMMANDER_DRONES
  },
  {
    id: 'space_baron',
    name: 'Space Baron',
    description: 'Own 50 Rocket Shuttles',
    category: AchievementCategory.Buildings,
    rarity: AchievementRarity.Rare,
    icon: '🚀',
    checkUnlock: (state) => (state.buildings['rocket_shuttle'] || 0) >= Config.ACHIEVEMENT_SPACE_BARON_SHUTTLES
  },
  {
    id: 'quantum_tycoon',
    name: 'Quantum Tycoon',
    description: 'Own 100 Quantum Entanglers',
    category: AchievementCategory.Buildings,
    rarity: AchievementRarity.Epic,
    icon: '🐱',
    checkUnlock: (state) => (state.buildings['quantum_entangler'] || 0) >= Config.ACHIEVEMENT_QUANTUM_TYCOON_ENTANGLERS
  },
  {
    id: 'infrastructure_mogul',
    name: 'Infrastructure Mogul',
    description: 'Own at least 10 of every building type',
    category: AchievementCategory.Buildings,
    rarity: AchievementRarity.Legendary,
    icon: '🏗️',
    checkUnlock: (state) => {
      const buildingIds = BUILDINGS.map(b => b.id);
      return buildingIds.every(id => (state.buildings[id] || 0) >= Config.ACHIEVEMENT_INFRASTRUCTURE_MOGUL_MIN_EACH);
    }
  },

  // === CLICK ACHIEVEMENTS ===
  {
    id: 'click_rookie',
    name: 'Click Rookie',
    description: 'Click the delivery button 100 times',
    category: AchievementCategory.Clicks,
    rarity: AchievementRarity.Common,
    icon: '👆',
    checkUnlock: (state) => state.clickCount >= Config.ACHIEVEMENT_CLICK_ROOKIE_CLICKS
  },
  {
    id: 'click_enthusiast',
    name: 'Click Enthusiast',
    description: 'Click the delivery button 1,000 times',
    category: AchievementCategory.Clicks,
    rarity: AchievementRarity.Uncommon,
    icon: '👈',
    checkUnlock: (state) => state.clickCount >= Config.ACHIEVEMENT_CLICK_ENTHUSIAST_CLICKS
  },
  {
    id: 'click_maniac',
    name: 'Click Maniac',
    description: 'Click the delivery button 10,000 times',
    category: AchievementCategory.Clicks,
    rarity: AchievementRarity.Rare,
    icon: '🖱️',
    checkUnlock: (state) => state.clickCount >= Config.ACHIEVEMENT_CLICK_MANIAC_CLICKS
  },
  {
    id: 'carpal_tunnel',
    name: 'Carpal Tunnel Syndrome',
    description: 'Click the delivery button 100,000 times',
    category: AchievementCategory.Clicks,
    rarity: AchievementRarity.Epic,
    icon: '🤕',
    checkUnlock: (state) => state.clickCount >= Config.ACHIEVEMENT_CARPAL_TUNNEL_CLICKS,
    secretUntilUnlocked: true
  },

  // === PRESTIGE ACHIEVEMENTS ===
  {
    id: 'first_prestige',
    name: 'Fresh Start',
    description: 'Perform your first prestige',
    category: AchievementCategory.Prestige,
    rarity: AchievementRarity.Uncommon,
    icon: '⭐',
    checkUnlock: (state) => state.totalPrestiges >= Config.ACHIEVEMENT_FRESH_START_PRESTIGES
  },
  {
    id: 'veteran_postmaster',
    name: 'Veteran Postmaster',
    description: 'Prestige 10 times',
    category: AchievementCategory.Prestige,
    rarity: AchievementRarity.Rare,
    icon: '🎖️',
    checkUnlock: (state) => state.totalPrestiges >= Config.ACHIEVEMENT_VETERAN_POSTMASTER_PRESTIGES
  },
  {
    id: 'eternal_courier',
    name: 'Eternal Courier',
    description: 'Prestige 50 times',
    category: AchievementCategory.Prestige,
    rarity: AchievementRarity.Epic,
    icon: '👑',
    checkUnlock: (state) => state.totalPrestiges >= Config.ACHIEVEMENT_ETERNAL_COURIER_PRESTIGES
  },
  {
    id: 'stamp_collector',
    name: 'Stamp Collector',
    description: 'Accumulate 100 stamps',
    category: AchievementCategory.Prestige,
    rarity: AchievementRarity.Rare,
    icon: '💌',
    checkUnlock: (state) => state.lifetimeStamps >= Config.ACHIEVEMENT_STAMP_COLLECTOR_STAMPS
  },
  {
    id: 'shard_seeker',
    name: 'Shard Seeker',
    description: 'Earn your first shard',
    category: AchievementCategory.Prestige,
    rarity: AchievementRarity.Epic,
    icon: '💎',
    checkUnlock: (state) => state.shards >= Config.ACHIEVEMENT_SHARD_SEEKER_SHARDS
  },
  {
    id: 'shard_hoarder',
    name: 'Shard Hoarder',
    description: 'Accumulate 10 shards',
    category: AchievementCategory.Prestige,
    rarity: AchievementRarity.Legendary,
    icon: '💠',
    checkUnlock: (state) => state.shards >= Config.ACHIEVEMENT_SHARD_HOARDER_SHARDS
  },

  // === SPEED ACHIEVEMENTS ===
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Reach Solar System in under 5 minutes',
    category: AchievementCategory.Speed,
    rarity: AchievementRarity.Rare,
    icon: '⚡',
    checkUnlock: (state) => {
      if (!state.unlockedStages.includes(Stage.Solar)) return false;
      const timePlayed = (Date.now() - state.startTime) / 1000 / 60;
      return timePlayed < Config.ACHIEVEMENT_SPEED_DEMON_MINUTES;
    },
    secretUntilUnlocked: true
  },

  // === COLLECTION ACHIEVEMENTS ===
  {
    id: 'upgrade_hunter',
    name: 'Upgrade Hunter',
    description: 'Unlock 10 upgrades',
    category: AchievementCategory.Collection,
    rarity: AchievementRarity.Uncommon,
    icon: '🔧',
    checkUnlock: (state) => state.upgrades.length >= Config.ACHIEVEMENT_UPGRADE_HUNTER_UPGRADES
  },
  {
    id: 'power_user',
    name: 'Power User',
    description: 'Unlock all upgrades',
    category: AchievementCategory.Collection,
    rarity: AchievementRarity.Epic,
    icon: '⚙️',
    checkUnlock: (state) => state.upgrades.length >= UPGRADES.length
  },
  {
    id: 'researcher',
    name: 'Researcher',
    description: 'Complete 5 research projects',
    category: AchievementCategory.Collection,
    rarity: AchievementRarity.Uncommon,
    icon: '🔬',
    checkUnlock: (state) => state.completedResearch.length >= Config.ACHIEVEMENT_RESEARCHER_RESEARCH
  },
  {
    id: 'scientist',
    name: 'Mad Scientist',
    description: 'Complete all research projects',
    category: AchievementCategory.Collection,
    rarity: AchievementRarity.Legendary,
    icon: '🧪',
    checkUnlock: (state) => state.completedResearch.length >= RESEARCH.length
  },

  // === SPECIAL ACHIEVEMENTS ===
  {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Have 1,000,000 letters at once',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Rare,
    icon: '💰',
    checkUnlock: (state) => state.credits >= Config.ACHIEVEMENT_MILLIONAIRE_CREDITS
  },
  {
    id: 'billionaire',
    name: 'Billionaire',
    description: 'Have 1,000,000,000 letters at once',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Epic,
    icon: '💸',
    checkUnlock: (state) => state.credits >= Config.ACHIEVEMENT_BILLIONAIRE_CREDITS
  },
  {
    id: 'trillionaire',
    name: 'Trillionaire',
    description: 'Have 1,000,000,000,000 letters at once',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Legendary,
    icon: '🤑',
    checkUnlock: (state) => state.credits >= Config.ACHIEVEMENT_TRILLIONAIRE_CREDITS,
    secretUntilUnlocked: true
  },
  {
    id: 'lifetime_legend',
    name: 'Lifetime Legend',
    description: 'Deliver 1 trillion letters across all runs',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Legendary,
    icon: '🏆',
    checkUnlock: (state) => state.lifetimeLettersDelivered >= Config.ACHIEVEMENT_LIFETIME_LEGEND_LETTERS
  },
  {
    id: 'meta_master',
    name: 'Meta Master',
    description: 'Max out any meta-upgrade',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Epic,
    icon: '🎯',
    checkUnlock: (state) => {
      return Object.entries(state.metaUpgrades).some(([id, level]) => {
        const upgrade = META_UPGRADES.find(u => u.id === id);
        return upgrade && level >= upgrade.maxLevel;
      });
    }
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Max out all meta-upgrades',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Legendary,
    icon: '💯',
    checkUnlock: (state) => {
      return META_UPGRADES.every(upgrade => {
        const level = state.metaUpgrades[upgrade.id] || 0;
        return level >= upgrade.maxLevel;
      });
    },
    secretUntilUnlocked: true
  },
  {
    id: 'patient_player',
    name: 'Patient Player',
    description: 'Play for more than 1 hour in a single run',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Uncommon,
    icon: '⏰',
    checkUnlock: (state) => {
      const timePlayed = (Date.now() - state.startTime) / 1000 / 60 / 60;
      return timePlayed >= Config.ACHIEVEMENT_PATIENT_PLAYER_HOURS;
    }
  },
  {
    id: 'the_grind',
    name: 'The Grind',
    description: 'Play for more than 10 hours in a single run',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Epic,
    icon: '⏳',
    checkUnlock: (state) => {
      const timePlayed = (Date.now() - state.startTime) / 1000 / 60 / 60;
      return timePlayed >= Config.ACHIEVEMENT_THE_GRIND_HOURS;
    },
    secretUntilUnlocked: true
  },

  // === STORY ACHIEVEMENTS ===
  {
    id: 'story_pluto_therapist',
    name: 'Therapist of Pluto',
    description: 'Complete the "Pluto\'s Identity Crisis" story chain',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Rare,
    icon: '🪐',
    checkUnlock: (state) => {
      const progress = state.storyProgress?.['pluto_identity_crisis'];
      return progress?.completed ?? false;
    }
  },
  {
    id: 'story_conspiracy_uncovered',
    name: 'Conspiracy Uncovered',
    description: 'Complete the "Galactic Postal Conspiracy" story chain',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Epic,
    icon: '🕵️',
    checkUnlock: (state) => {
      const progress = state.storyProgress?.['galactic_conspiracy'];
      return progress?.completed ?? false;
    },
    secretUntilUnlocked: true
  },
  {
    id: 'story_multiverse_mastery',
    name: 'Council of Me',
    description: 'Complete the "Letters from Alternate Yous" story chain',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Legendary,
    icon: '👥',
    checkUnlock: (state) => {
      const progress = state.storyProgress?.['multiverse_you_letter'];
      return progress?.completed ?? false;
    },
    secretUntilUnlocked: true
  },
  {
    id: 'story_collector',
    name: 'Story Collector',
    description: 'Complete 3 different story chains',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Rare,
    icon: '📚',
    checkUnlock: (state) => {
      if (!state.storyProgress) return false;
      const completedCount = Object.values(state.storyProgress).filter(
        (progress) => progress.completed
      ).length;
      return completedCount >= Config.ACHIEVEMENT_STORY_COLLECTOR_CHAINS;
    }
  },
  {
    id: 'story_master',
    name: 'Story Master',
    description: 'Complete all story chains',
    category: AchievementCategory.Special,
    rarity: AchievementRarity.Legendary,
    icon: '📖',
    checkUnlock: (state) => {
      if (!state.storyProgress) return false;
      // There are 6 story chains total
      const completedCount = Object.values(state.storyProgress).filter(
        (progress) => progress.completed
      ).length;
      return completedCount >= Config.ACHIEVEMENT_STORY_MASTER_CHAINS;
    },
    secretUntilUnlocked: true
  }
];
