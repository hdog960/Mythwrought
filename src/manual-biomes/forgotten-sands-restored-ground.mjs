// Detached D1 cap selection. The original column reader retains all geometry,
// cave and landmark vetoes, and oasis water ownership.
import { M3_DESERT_IDS as material } from './desert-m3.mjs';
import { v6BiomeAt } from './v6-balanced-biomes.mjs';

const saltSpacing = 64;
const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const dryCaps = new Set([material.pale, material.red, material.salt, material.hardpan, material.sandstone]);

const top = column => Math.max(...column.keys());

function saltCenter(x, z, seed) {
  const cx = Math.floor(x / saltSpacing), cz = Math.floor(z / saltSpacing);
  let hash = Math.imul(cx, 0x7feb352d) ^ Math.imul(cz, 0x846ca68b) ^ Math.imul(seed, 0x9e3779b1);
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  return [cx * saltSpacing + 18 + (hash & 31), cz * saltSpacing + 18 + ((hash >>> 8) & 31)];
}

export function restoreDesertGround(original, {
  x, z, seed, readNeighbor, legacyHeight, oasis = false, biome = v6BiomeAt(x, z, seed)
}) {
  if (biome?.name !== 'desert' || oasis || original.size === 0) return original;
  const y = top(original), cap = original.get(y);
  if (!dryCaps.has(cap)) return original;
  const phase = (seed % 251) * .071;
  const ridge = .5 + .5 * Math.sin(x * .031 + z * .027 + phase + .55 * Math.sin(z * .019));
  const dust = .5 + .5 * Math.sin(x * .038 - z * .053 - phase);
  const [saltX, saltZ] = saltCenter(x, z, seed);
  let next = cap;
  if (biome.weight >= .91 && y <= legacyHeight + 2 &&
      Math.abs(x - saltX) + Math.abs(z - saltZ) <= 1 &&
      neighbors.every(([dx, dz]) => {
        const neighbor = readNeighbor(x + dx, z + dz);
        return top(neighbor) === y && dryCaps.has(neighbor.get(y));
      })) {
    next = material.salt;
  } else if (cap === material.pale || cap === material.salt) {
    if (ridge > .76) next = material.red;
    else if (dust < .26 && y <= legacyHeight + 1) next = material.mud;
    else next = dust < .47 ? material.hardpan : material.sandstone;
  } else if (cap === material.sandstone && ridge > .82 && dust > .76) {
    next = material.banded;
  }
  return next === cap ? original : new Map(original).set(y, next);
}

export function createRestoredDesertResearchWorld(BaseWorld, terrainHeight) {
  return class RestoredDesertResearchWorld extends BaseWorld {
    #restored = new WeakMap();

    _columnPlan(x, z) {
      const original = super._columnPlan(x, z);
      if (this.#restored.has(original)) return this.#restored.get(original);
      const biome = v6BiomeAt(x, z, this.seed);
      const plan = biome?.name === 'desert' && original.size ? restoreDesertGround(original, {
        x, z, seed: this.seed, biome, legacyHeight: terrainHeight(x, z, this.seed),
        oasis: this._oasisNear(x, z, 0, biome)?.columns.has(x + ',' + z),
        readNeighbor: (nx, nz) => super._columnPlan(nx, nz)
      }) : original;
      this.#restored.set(original, plan);
      return plan;
    }

    save() {
      throw Error('Restored Desert research requires a separately approved save profile');
    }
  };
}
