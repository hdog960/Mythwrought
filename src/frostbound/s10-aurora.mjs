// Frostbound color variation of the released luminous-arc event.
import { S5_EVENT_TYPES } from '../sky-events.mjs';
import { v6BiomeAt } from '../manual-biomes/v6-balanced-biomes.mjs';
import { glacierlandsWeight } from './s4-glacierlands.mjs';
import { mirrorfrostWeight } from './s4-mirrorfrost-basin.mjs';
import { silverwoodWeight } from './s4-silverwood-barrens.mjs';

const clamp = value => Math.min(1, Math.max(0, value));
const palette = [.34, .94, .81];

export function sampleFrostboundAurora(event, x, feet, z, seed) {
  if (event.kind !== S5_EVENT_TYPES.aurora || event.strength <= 0 || feet < 1) return event;
  const snow = v6BiomeAt(x, z, seed);
  if (snow?.name !== 'snow' || snow.weight < .83) return event;
  const edge = clamp((snow.weight - .83) / .15);
  const exposure = Math.max(glacierlandsWeight(x, z, seed), mirrorfrostWeight(x, z, seed), silverwoodWeight(x, z, seed));
  const strength = edge * edge * (3 - 2 * edge) * exposure;
  if (!strength) return event;
  return { ...event, strength: Math.min(.90, event.strength * (1 + .2 * strength)),
    color: event.color.map((channel, i) => channel + (palette[i] - channel) * strength) };
}
