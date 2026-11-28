// Remaining S4 surface candidates. The earlier subregion cores and ancient
// tree reservations keep priority over the two outer woodland shelves.
import { v6BiomeAt } from '../manual-biomes/v6-balanced-biomes.mjs';
import { GROUND_FAMILIES } from './s3-ground.mjs';
import { frostwoodWeight, isExposedFrostboundCap } from './s4-frostwood.mjs';
import { whiteExpanseWeight } from './s4-white-expanse.mjs';
import { glacierlandsWeight } from './s4-glacierlands.mjs';
import { FrostboundMirrorfrostCandidate, mirrorfrostWeight } from './s4-mirrorfrost-basin.mjs';

const SILVERWOOD = { dx: 171, dz: 48, width: 111, depth: 112 };
const BARRENS = { dx: -174, dz: 118, width: 105, depth: 96 };

function outerShelfWeight(x, z, seed, { dx, dz, width, depth }) {
  const snow = v6BiomeAt(x, z, seed);
  if (snow?.name !== 'snow' || snow.weight < .82) return 0;
  const [tx, tz] = snow.center;
  const distance = Math.hypot((x - tx - dx) / width, (z - tz - dz) / depth);
  const edge = Math.min(1, Math.max(0, (1 - distance) * 2.7));
  if (!edge) return 0;
  const priority = Math.max(frostwoodWeight(x, z, seed), whiteExpanseWeight(x, z, seed),
    glacierlandsWeight(x, z, seed), mirrorfrostWeight(x, z, seed));
  return edge * edge * (3 - 2 * edge) * Math.max(0, 1 - 3 * priority);
}

export const silverwoodWeight = (x, z, seed) => outerShelfWeight(x, z, seed, SILVERWOOD);
export const blackfrostWeight = (x, z, seed) => outerShelfWeight(x, z, seed, BARRENS);

export class FrostboundSixRegionsCandidate extends FrostboundMirrorfrostCandidate {
  get forestSourceVersion() { return 's4-frostbound-six-regions-v1'; }

  _forestFamilyRoll(x, z, value) {
    const original = super._forestFamilyRoll(x, z, value);
    const silver = silverwoodWeight(x, z, this.seed), barrens = blackfrostWeight(x, z, this.seed);
    // Sample existing birch and deadwood choices through the original height
    // filters. The site lattice and Frostfather reservations stay in charge.
    return original * (1 - .94 * (silver + barrens)) + .94 * (.45 * silver + .96 * barrens);
  }

  _forestSiteChance(x, z, reservation) {
    const original = super._forestSiteChance(x, z, reservation);
    if (reservation === 'ancient') return original;
    return original * (1 - .66 * blackfrostWeight(x, z, this.seed));
  }

  _groundDetailChoice(x, z, id) {
    if (blackfrostWeight(x, z, this.seed) >= .62) return GROUND_FAMILIES.crust;
    return super._groundDetailChoice(x, z, id);
  }

  naturalAndLandmarkBlock(x, y, z) {
    const block = super.naturalAndLandmarkBlock(x, y, z);
    if (y < 3 || y > 17) return block;
    if (block === 279 && silverwoodWeight(x, z, this.seed) >= .65 && isExposedFrostboundCap(this, x, y, z, block)) return 272;
    if (block === 272 && blackfrostWeight(x, z, this.seed) >= .65 && isExposedFrostboundCap(this, x, y, z, block)) return 279;
    return block;
  }
}
