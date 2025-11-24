import { RouteDefinition, Stage, RouteId } from './types';
import * as Config from './src/config';

/**
 * All route definitions in the game
 * Routes are organized by stage and provide different trade-offs for production, research, and events
 */
export const ROUTES: RouteDefinition[] = [
  // === LOCAL PLANET STAGE ===
  {
    id: 'local_downtown',
    name: 'Downtown Loop',
    description: 'Dense mailboxes, impatient customers. High delivery rate, minimal time for learning.',
    stage: Stage.Local,
    productionMultiplier: Config.ROUTE_LOCAL_DOWNTOWN_PRODUCTION,      // +15% production
    researchMultiplier: Config.ROUTE_LOCAL_DOWNTOWN_RESEARCH,         // -10% research
    eventChanceMultiplier: Config.ROUTE_LOCAL_DOWNTOWN_EVENTS,
  },
  {
    id: 'local_suburbs',
    name: 'Suburban Circuit',
    description: 'Long routes with quiet streets. Time to think and experiment with new methods.',
    stage: Stage.Local,
    productionMultiplier: Config.ROUTE_LOCAL_SUBURBS_PRODUCTION,      // -5% production
    researchMultiplier: Config.ROUTE_LOCAL_SUBURBS_RESEARCH,        // +20% research
    eventChanceMultiplier: Config.ROUTE_LOCAL_SUBURBS_EVENTS,
  },
  {
    id: 'local_industrial',
    name: 'Industrial Zone',
    description: 'Bulk deliveries to warehouses. Efficient, but repetitive and boring.',
    stage: Stage.Local,
    productionMultiplier: Config.ROUTE_LOCAL_INDUSTRIAL_PRODUCTION,      // +10% production
    researchMultiplier: Config.ROUTE_LOCAL_INDUSTRIAL_RESEARCH,        // -15% research
    eventChanceMultiplier: Config.ROUTE_LOCAL_INDUSTRIAL_EVENTS,      // +10% events (more contracts)
  },
  {
    id: 'local_university',
    name: 'University District',
    description: 'Academic institutions requesting special handling. Educational but slow.',
    stage: Stage.Local,
    productionMultiplier: Config.ROUTE_LOCAL_UNIVERSITY_PRODUCTION,      // -10% production
    researchMultiplier: Config.ROUTE_LOCAL_UNIVERSITY_RESEARCH,        // +30% research
    eventChanceMultiplier: Config.ROUTE_LOCAL_UNIVERSITY_EVENTS,
  },

  // === SOLAR SYSTEM STAGE ===
  {
    id: 'solar_mars_colony',
    name: 'Mars Colony Route',
    description: 'Dusty, harsh conditions. Science outposts pay well for reliable service.',
    stage: Stage.Solar,
    productionMultiplier: Config.ROUTE_SOLAR_MARS_PRODUCTION,
    researchMultiplier: Config.ROUTE_SOLAR_MARS_RESEARCH,
    eventChanceMultiplier: Config.ROUTE_SOLAR_MARS_EVENTS,
  },
  {
    id: 'solar_asteroid_belt',
    name: 'Asteroid Belt',
    description: 'Dangerous navigation through debris. Miners tip generously for risk.',
    stage: Stage.Solar,
    productionMultiplier: Config.ROUTE_SOLAR_ASTEROID_PRODUCTION,      // +20% production (high risk, high reward)
    researchMultiplier: Config.ROUTE_SOLAR_ASTEROID_RESEARCH,        // -20% research
    eventChanceMultiplier: Config.ROUTE_SOLAR_ASTEROID_EVENTS,      // +30% events
  },
  {
    id: 'solar_jupiter_moons',
    name: 'Jupiter Moon Network',
    description: 'Multiple moons with research stations. Complex routing, high learning potential.',
    stage: Stage.Solar,
    productionMultiplier: Config.ROUTE_SOLAR_JUPITER_PRODUCTION,
    researchMultiplier: Config.ROUTE_SOLAR_JUPITER_RESEARCH,        // +25% research
    eventChanceMultiplier: Config.ROUTE_SOLAR_JUPITER_EVENTS,
  },
  {
    id: 'solar_inner_planets',
    name: 'Inner Planets Express',
    description: 'Mercury, Venus, Earth, Mars. Fast turnaround, constant deliveries.',
    stage: Stage.Solar,
    productionMultiplier: Config.ROUTE_SOLAR_INNER_PRODUCTION,
    researchMultiplier: Config.ROUTE_SOLAR_INNER_RESEARCH,
    eventChanceMultiplier: Config.ROUTE_SOLAR_INNER_EVENTS,
  },

  // === INTERSTELLAR STAGE ===
  {
    id: 'interstellar_proxima',
    name: 'Proxima Centauri Route',
    description: 'Nearest star system. Established trade routes, steady work.',
    stage: Stage.Interstellar,
    productionMultiplier: Config.ROUTE_INTERSTELLAR_PROXIMA_PRODUCTION,
    researchMultiplier: Config.ROUTE_INTERSTELLAR_PROXIMA_RESEARCH,
    eventChanceMultiplier: Config.ROUTE_INTERSTELLAR_PROXIMA_EVENTS,
  },
  {
    id: 'interstellar_frontier',
    name: 'Frontier Colonies',
    description: 'Newly settled systems. Desperate for supplies, experimental tech everywhere.',
    stage: Stage.Interstellar,
    productionMultiplier: Config.ROUTE_INTERSTELLAR_FRONTIER_PRODUCTION,
    researchMultiplier: Config.ROUTE_INTERSTELLAR_FRONTIER_RESEARCH,        // +35% research
    eventChanceMultiplier: Config.ROUTE_INTERSTELLAR_FRONTIER_EVENTS,
  },
  {
    id: 'interstellar_wormhole',
    name: 'Wormhole Network',
    description: 'Unstable shortcuts through space. Fast deliveries but unpredictable.',
    stage: Stage.Interstellar,
    productionMultiplier: Config.ROUTE_INTERSTELLAR_WORMHOLE_PRODUCTION,      // +25% production
    researchMultiplier: Config.ROUTE_INTERSTELLAR_WORMHOLE_RESEARCH,
    eventChanceMultiplier: Config.ROUTE_INTERSTELLAR_WORMHOLE_EVENTS,      // +40% events
  },
  {
    id: 'interstellar_nebula',
    name: 'Nebula Research Stations',
    description: 'Science vessels studying stellar nurseries. Slow but intellectually stimulating.',
    stage: Stage.Interstellar,
    productionMultiplier: Config.ROUTE_INTERSTELLAR_NEBULA_PRODUCTION,
    researchMultiplier: Config.ROUTE_INTERSTELLAR_NEBULA_RESEARCH,        // +40% research
    eventChanceMultiplier: Config.ROUTE_INTERSTELLAR_NEBULA_EVENTS,
  },

  // === GALACTIC STAGE ===
  {
    id: 'galactic_core',
    name: 'Galactic Core Route',
    description: 'High-density systems near the center. Incredible volume, constant chaos.',
    stage: Stage.Galactic,
    productionMultiplier: Config.ROUTE_GALACTIC_CORE_PRODUCTION,      // +30% production
    researchMultiplier: Config.ROUTE_GALACTIC_CORE_RESEARCH,
    eventChanceMultiplier: Config.ROUTE_GALACTIC_CORE_EVENTS,
  },
  {
    id: 'galactic_spiral_arms',
    name: 'Spiral Arm Circuit',
    description: 'Traversing the galactic disk. Balanced routes with diverse civilizations.',
    stage: Stage.Galactic,
    productionMultiplier: Config.ROUTE_GALACTIC_SPIRAL_PRODUCTION,
    researchMultiplier: Config.ROUTE_GALACTIC_SPIRAL_RESEARCH,
    eventChanceMultiplier: Config.ROUTE_GALACTIC_SPIRAL_EVENTS,
  },
  {
    id: 'galactic_dark_sectors',
    name: 'Dark Sector Expeditions',
    description: 'Mysterious regions with anomalous phenomena. Dangerous but scientifically valuable.',
    stage: Stage.Galactic,
    productionMultiplier: Config.ROUTE_GALACTIC_DARK_PRODUCTION,
    researchMultiplier: Config.ROUTE_GALACTIC_DARK_RESEARCH,        // +50% research
    eventChanceMultiplier: Config.ROUTE_GALACTIC_DARK_EVENTS,
  },
  {
    id: 'galactic_trade_lanes',
    name: 'Major Trade Lanes',
    description: 'Well-established commercial routes. High traffic, high efficiency.',
    stage: Stage.Galactic,
    productionMultiplier: Config.ROUTE_GALACTIC_TRADE_PRODUCTION,
    researchMultiplier: Config.ROUTE_GALACTIC_TRADE_RESEARCH,
    eventChanceMultiplier: Config.ROUTE_GALACTIC_TRADE_EVENTS,
  },

  // === MULTIVERSE STAGE ===
  {
    id: 'multiverse_parallel',
    name: 'Parallel Timelines',
    description: 'Delivering to alternate versions of reality. Confusing but productive.',
    stage: Stage.Multiverse,
    productionMultiplier: Config.ROUTE_MULTIVERSE_PARALLEL_PRODUCTION,
    researchMultiplier: Config.ROUTE_MULTIVERSE_PARALLEL_RESEARCH,
    eventChanceMultiplier: Config.ROUTE_MULTIVERSE_PARALLEL_EVENTS,
  },
  {
    id: 'multiverse_quantum',
    name: 'Quantum Probability Routes',
    description: 'Routes that exist in superposition. Massive research potential, reality optional.',
    stage: Stage.Multiverse,
    productionMultiplier: Config.ROUTE_MULTIVERSE_QUANTUM_PRODUCTION,
    researchMultiplier: Config.ROUTE_MULTIVERSE_QUANTUM_RESEARCH,        // +60% research
    eventChanceMultiplier: Config.ROUTE_MULTIVERSE_QUANTUM_EVENTS,
  },
  {
    id: 'multiverse_collapsed',
    name: 'Collapsed Universe Salvage',
    description: 'Delivering to dying timelines. Desperate customers pay premium rates.',
    stage: Stage.Multiverse,
    productionMultiplier: Config.ROUTE_MULTIVERSE_COLLAPSED_PRODUCTION,      // +40% production
    researchMultiplier: Config.ROUTE_MULTIVERSE_COLLAPSED_RESEARCH,
    eventChanceMultiplier: Config.ROUTE_MULTIVERSE_COLLAPSED_EVENTS,
  },
  {
    id: 'multiverse_void',
    name: 'Between-Space Routes',
    description: 'The spaces between realities. Slow, meditative, philosophically enlightening.',
    stage: Stage.Multiverse,
    productionMultiplier: Config.ROUTE_MULTIVERSE_VOID_PRODUCTION,
    researchMultiplier: Config.ROUTE_MULTIVERSE_VOID_RESEARCH,
    eventChanceMultiplier: Config.ROUTE_MULTIVERSE_VOID_EVENTS,
  },
];

/**
 * Get all routes for a specific stage
 */
export function getRoutesForStage(stage: Stage): RouteDefinition[] {
  return ROUTES.filter(r => r.stage === stage);
}

/**
 * Get a route by its ID
 */
export function getRouteById(id: RouteId): RouteDefinition | undefined {
  return ROUTES.find(r => r.id === id);
}

/**
 * Get all available routes for a stage considering unlock conditions
 */
export function getAvailableRoutesForStage(stage: Stage, state: any): RouteDefinition[] {
  const allRoutes = getRoutesForStage(stage);
  return allRoutes.filter(route => {
    if (!route.unlockCondition) return true;
    return route.unlockCondition(state);
  });
}
