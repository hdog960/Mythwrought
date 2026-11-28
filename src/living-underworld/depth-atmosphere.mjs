// U12 color and bounded ambient targets for the existing cave fade.
import { UNDERWORLD_LEVELS } from './worldwide-network.mjs';

const surface = Object.freeze({ fog: Object.freeze([.053, .068, .088]), light: Object.freeze([.76, .81, .91]) });
const levels = [
  { feet: -10, ...surface },
  { feet: UNDERWORLD_LEVELS[0].y, fog: [.057, .082, .078], light: [.72, .80, .84] },
  { feet: UNDERWORLD_LEVELS[1].y, fog: [.076, .059, .056], light: [.70, .70, .72] },
  { feet: UNDERWORLD_LEVELS[2].y, fog: [.047, .056, .086], light: [.63, .68, .80] },
  { feet: UNDERWORLD_LEVELS[3].y, fog: [.037, .046, .071], light: [.56, .62, .76] }
];

export function sampleUnderworldAtmosphere(feet) {
  if (!Number.isFinite(feet)) throw new TypeError('Invalid cave atmosphere depth');
  if (feet >= levels[0].feet) return surface;
  const index = levels.findIndex(level => feet >= level.feet);
  const lower = index < 0 ? levels.at(-1) : levels[index];
  const upper = index < 0 ? lower : levels[index - 1];
  const t = lower === upper ? 1 : (upper.feet - feet) / (upper.feet - lower.feet);
  const strength = t * t * (3 - 2 * t);
  const blend = channel => upper[channel].map((value, i) => value + (lower[channel][i] - value) * strength);
  return { fog: blend('fog'), light: blend('light') };
}
