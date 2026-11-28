// Detached S4 ice shelves. Physical water, protected terrain, and the two
// existing snow subregion cores remain under their original source owners.
import { v6BiomeAt } from '../manual-biomes/v6-balanced-biomes.mjs';
import { frostboundWindField } from './s1-terrain.mjs';
import { GROUND_FAMILIES } from './s3-ground.mjs';
import { frostwoodWeight, isExposedFrostboundCap } from './s4-frostwood.mjs';
import { FrostboundSubregionsCandidate, whiteExpanseWeight } from './s4-white-expanse.mjs';

const BLUE_ICE = 276;

export function glacierlandsWeight(x, z, seed) {
  const snow = v6BiomeAt(x, z, seed);
  if (snow?.name !== 'snow' || snow.weight < .82) return 0;
  const [tx, tz] = snow.center;
  const dx = x - tx + 147, dz = z - tz + 63;
  const shelf = Math.min(1, Math.max(0, (1 - Math.hypot(dx / 104, dz / 157)) * 2.6));
  const neighbors = Math.max(frostwoodWeight(x, z, seed), whiteExpanseWeight(x, z, seed));
  return shelf * shelf * (3 - 2 * shelf) * Math.max(0, 1 - 3 * neighbors);
}

export class FrostboundGlacierlandsCandidate extends FrostboundSubregionsCandidate {
  get forestSourceVersion() { return 's4-frostbound-glacierlands-v1'; }

  _forestSiteChance(x, z, reservation) {
    const original = super._forestSiteChance(x, z, reservation);
    if (reservation === 'ancient') return original;
    return original * (1 - .72 * glacierlandsWeight(x, z, this.seed));
  }

  _groundDetailChoice(x, z, id) {
    if (glacierlandsWeight(x, z, this.seed) < .58) return super._groundDetailChoice(x, z, id);
    return frostboundWindField(x, z, this.seed) >= .45 ? GROUND_FAMILIES.iceSpikes : GROUND_FAMILIES.crust;
  }

  naturalAndLandmarkBlock(x, y, z) {
    const block = super.naturalAndLandmarkBlock(x, y, z);
    if ((block !== 272 && block !== 279) || y < 3 || y > 17) return block;
    const weight = glacierlandsWeight(x, z, this.seed);
    if (weight < .38 || frostboundWindField(x, z, this.seed) >= .24 + .58 * weight) return block;
    return isExposedFrostboundCap(this, x, y, z, block) ? BLUE_ICE : block;
  }
}
