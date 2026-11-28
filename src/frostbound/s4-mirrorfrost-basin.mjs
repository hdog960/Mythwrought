// Detached S4 basin shelves. Only existing flat natural caps can become ice.
import { v6BiomeAt } from '../manual-biomes/v6-balanced-biomes.mjs';
import { frostwoodWeight, isExposedFrostboundCap } from './s4-frostwood.mjs';
import { whiteExpanseWeight } from './s4-white-expanse.mjs';
import { FrostboundGlacierlandsCandidate, glacierlandsWeight } from './s4-glacierlands.mjs';

const CLEAR_ICE = 275;
const FROZEN_CAPS = new Set([272, 276, 279]);
const SIDES = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function mirrorfrostWeight(x, z, seed) {
  const snow = v6BiomeAt(x, z, seed);
  if (snow?.name !== 'snow' || snow.weight < .83) return 0;
  const [tx, tz] = snow.center;
  const dx = x - tx - 138, dz = z - tz + 133;
  const basin = Math.min(1, Math.max(0, (1 - Math.hypot(dx / 111, dz / 96)) * 2.7));
  if (!basin) return 0;
  const neighbor = Math.max(frostwoodWeight(x, z, seed), whiteExpanseWeight(x, z, seed), glacierlandsWeight(x, z, seed));
  return basin * basin * (3 - 2 * basin) * Math.max(0, 1 - 3 * neighbor);
}

export class FrostboundMirrorfrostCandidate extends FrostboundGlacierlandsCandidate {
  get forestSourceVersion() { return 's4-frostbound-mirrorfrost-v1'; }

  _forestSiteChance(x, z, reservation) {
    const original = super._forestSiteChance(x, z, reservation);
    if (reservation === 'ancient') return original;
    return original * (1 - .8 * mirrorfrostWeight(x, z, this.seed));
  }

  naturalAndLandmarkBlock(x, y, z) {
    const block = super.naturalAndLandmarkBlock(x, y, z);
    if (!FROZEN_CAPS.has(block) || y < 3 || y > 17 || mirrorfrostWeight(x, z, this.seed) < .63) return block;
    if (!isExposedFrostboundCap(this, x, y, z, block)) return block;
    const level = SIDES.every(([dx, dz]) => {
      const px = x + dx, pz = z + dz, cap = super.naturalAndLandmarkBlock(px, y, pz);
      return FROZEN_CAPS.has(cap) && isExposedFrostboundCap(this, px, y, pz, cap);
    });
    return level ? CLEAR_ICE : block;
  }
}
