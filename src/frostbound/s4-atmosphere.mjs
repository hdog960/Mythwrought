// Detached S4 color treatment for the existing sky and terrain fog uniforms.
import { v6BiomeAt } from '../manual-biomes/v6-balanced-biomes.mjs';
import { frostwoodWeight } from './s4-frostwood.mjs';
import { whiteExpanseWeight } from './s4-white-expanse.mjs';
import { glacierlandsWeight } from './s4-glacierlands.mjs';
import { mirrorfrostWeight } from './s4-mirrorfrost-basin.mjs';
import { silverwoodWeight, blackfrostWeight } from './s4-silverwood-barrens.mjs';

const regions = [
  [frostwoodWeight, [-.056, -.028, -.023]],
  [whiteExpanseWeight, [.085, .070, .047]],
  [glacierlandsWeight, [-.067, .019, .076]],
  [mirrorfrostWeight, [-.028, .060, .026]],
  [silverwoodWeight, [.035, .027, .068]],
  [blackfrostWeight, [-.092, -.067, -.026]]
];
const fields = [
  ['horizon', .9], ['zenith', .7], ['fog', 1], ['cloud', .55], ['ridge', .85]
];
const clampUnit = value => Math.min(1, Math.max(0, value));

export function sampleFrostboundAtmosphere(atmosphere, x, z, seed) {
  const snow = v6BiomeAt(x, z, seed);
  // Native terrain masks have different minimum weights. Fade into the
  // existing snow atmosphere above every cutoff to avoid hard fog borders.
  if (snow?.name !== 'snow' || snow.weight <= .83) return atmosphere;
  const edge = clampUnit((snow.weight - .83) / .15);
  const weights = regions.map(([weight]) => weight(x, z, seed));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total === 0) return atmosphere;
  const daylight = .35 + .65 * atmosphere.daylight;
  const strength = edge * edge * (3 - 2 * edge) * daylight / Math.max(1, total);
  const offset = [0, 0, 0];
  for (let i = 0; i < regions.length; i++) {
    const tint = regions[i][1];
    for (let channel = 0; channel < tint.length; channel++) {
      offset[channel] += tint[channel] * weights[i] * strength;
    }
  }
  const result = { ...atmosphere };
  for (const [field, amount] of fields) {
    result[field] = atmosphere[field].map((value, channel) => {
      const change = 1.3 * offset[channel] * amount;
      return value + change * (change < 0 ? value : 1 - value);
    });
  }
  return result;
}
