// Local E8 fog treatment. The existing sky clock, celestial paths, and
// ambient light remain the authority for every day and night phase.
import { wildsRegionAt } from './enchanted-wilds-family-source.mjs';
import { v6BiomeAt } from './v6-balanced-biomes.mjs';

const offsets = [
  [-.087, .031, -.033], // Ancientwood
  [-.045, .026, .058],  // Moonveil Groves
  [-.075, .045, .016],  // Sporewilds
  [-.018, .035, .075],  // Starlight Glades
  [-.055, .006, .039]   // Whispering Ruinwood
];
const lattice = 16;
const smooth = t => t * t * (3 - 2 * t);
const clamp = t => Math.min(1, Math.max(0, t));

export function sampleWildsTerrainFog(atmosphere, x, z, seed) {
  const biome = v6BiomeAt(x, z, seed);
  if (biome?.name !== 'enchanted' || biome.weight <= .76) return atmosphere;
  const left = Math.floor(x / lattice) * lattice, near = Math.floor(z / lattice) * lattice;
  const tx = smooth((x - left) / lattice), tz = smooth((z - near) / lattice);
  const samples = [[left, near, (1 - tx) * (1 - tz)], [left + lattice, near, tx * (1 - tz)],
    [left, near + lattice, (1 - tx) * tz], [left + lattice, near + lattice, tx * tz]];
  const additions = [0, 0, 0];
  for (const [a, b, strength] of samples) {
    if (!strength) continue;
    const region = wildsRegionAt(a, b, seed);
    if (region === null) continue;
    for (let channel = 0; channel < 3; channel++) additions[channel] += strength * offsets[region][channel];
  }
  const local = smooth(clamp((biome.weight - .76) / .22)) * (.48 + .52 * atmosphere.daylight);
  const fog = atmosphere.fog.map((value, channel) => clamp(value + additions[channel] * local));
  return { ...atmosphere, fog };
}
