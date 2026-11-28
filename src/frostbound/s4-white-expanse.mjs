// S4 detached open snowfields on the same Frostbound terrain and owner limits.
import { v6BiomeAt } from '../manual-biomes/v6-balanced-biomes.mjs';
import { frostboundWindField } from './s1-terrain.mjs';
import { GROUND_FAMILIES } from './s3-ground.mjs';
import { FrostwoodCandidate, frostwoodWeight } from './s4-frostwood.mjs';

function smoothUnit(value) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

export function whiteExpanseWeight(x, z, seed) {
  const snow = v6BiomeAt(x, z, seed);
  if (snow?.name !== 'snow' || snow.weight < .8) return 0;
  const [tx, tz] = snow.center;
  // The sheltered inner core remains Frostwood. The broader wind-facing
  // shelf tapers across both its snow biome edge and the woodland fringe.
  const dx = x - tx + Math.sin((tz + seed * .01) / 117) * 28;
  const dz = z - tz - 146;
  const shelf = smoothUnit((1 - Math.hypot(dx / 174, dz / 104)) * 2.5);
  const clearing = smoothUnit(1 - 3 * frostwoodWeight(x, z, seed));
  return shelf * clearing * smoothUnit((snow.weight - .8) * 6);
}

export class FrostboundSubregionsCandidate extends FrostwoodCandidate {
  get forestSourceVersion() { return 's4-frostwood-white-expanse-v1'; }

  _forestSiteChance(x, z, reservation) {
    const original = super._forestSiteChance(x, z, reservation);
    if (reservation === 'ancient') return original;
    return original * (1 - .9 * whiteExpanseWeight(x, z, this.seed));
  }

  _groundDetailChoice(x, z, id) {
    const weight = whiteExpanseWeight(x, z, this.seed);
    if (weight < .5) return super._groundDetailChoice(x, z, id);
    // The same supported S3 placements form wind-shaped drift and crust
    // beds. Preserve physical footing and existing pocket ownership.
    return frostboundWindField(x, z, this.seed) >= .50 ? GROUND_FAMILIES.drift : GROUND_FAMILIES.crust;
  }
}
