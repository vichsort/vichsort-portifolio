import { createFloorLayer } from '@/shared/ascii/layers/floorLayer'
import { createCometsLayer, createStarsLayer, createWanderersLayer } from '@/shared/ascii/layers/satellitesLayer'

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
