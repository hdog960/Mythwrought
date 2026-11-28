// Detached S4 surface and forest candidate on the existing Frostbound source.
import { v6BiomeAt } from '../manual-biomes/v6-balanced-biomes.mjs';
import { FrostboundSceneryCandidate } from './s3-scenery.mjs';

const SNOW_CAP = 272;
const RIME_STONE = 279;

function unitHash(x, z, seed, salt) {
  let n = Math.imul(x ^ salt, 0x7feb352d) ^ Math.imul(z ^ seed, 0x846ca68b);
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

export function frostwoodWeight(x, z, seed) {
  const snow = v6BiomeAt(x, z, seed);
  if (snow?.name !== 'snow' || snow.weight < .8) return 0;
  const [tx, tz] = snow.center;
  const dx = x - tx - (unitHash(tx, tz, seed, 1723) - .5) * 64;
  const dz = z - tz - (unitHash(tx, tz, seed, 1907) - .5) * 64;
  const distance = Math.hypot(dx / 166, dz / 132);
  const edge = Math.max(0, Math.min(1, (1 - distance) * 2.5));
  return edge * edge * (3 - 2 * edge);
}

export class FrostwoodCandidate extends FrostboundSceneryCandidate {
  get forestSourceVersion() { return 's4-frostwood-v1'; }

  _forestFamilyRoll(x, z, value) {
    // Bias the core toward conifers while retaining the original site lattice,
    // species height ranges, grounding tests, and ancient tree reservations.
    return value * (1 - .62 * frostwoodWeight(x, z, this.seed));
  }

  naturalAndLandmarkBlock(x, y, z) {
    const block = super.naturalAndLandmarkBlock(x, y, z);
    if (block !== SNOW_CAP || y < 3 || y > 17) return block;
    const weight = frostwoodWeight(x, z, this.seed);
    if (!weight || unitHash(x, z, this.seed, 2693) >= .62 * weight) return block;
    const column = this._columnPlan(x, z);
    // Swap only a verified natural full cap. Keep ice shelves, caves, terrain
    // heights, and other shape/collision parameters from S1–S3.
    if (column.get(y) !== block || y !== Math.max(...column.keys())) return block;
    if ([y - 1, y, y + 1].some(height => this.environmentCaves.get(x, height, z) !== undefined)) return block;
    return RIME_STONE;
  }
}
