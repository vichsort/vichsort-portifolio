import { createFloorLayer } from './layers/floorLayer'
import { createCometsLayer, createStarsLayer, createWanderersLayer } from './layers/satellitesLayer'

/**
 * Tokens CSS lidos pelo canvas do hero (definidos por tema em tokens.css).
 */
export const HERO_TOKENS = {
  colors: {
    pink: '--neon-pink',
    cyan: '--neon-cyan',
    yellow: '--neon-yellow',
    orange: '--neon-orange',
    magenta: '--neon-magenta',
    text: '--text-primary'
  },
  numbers: {
    glow: '--hero-glow'
  }
}

/**
 * Camadas do fundo do hero, do fundo para a frente.
 * O piso vem primeiro para reservar sua área antes dos satélites ocuparem células.
 */
export function createHeroLayers() {
  return [
    createFloorLayer(),
    createStarsLayer(),
    createWanderersLayer(),
    createCometsLayer()
  ]
}
