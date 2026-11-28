// SP3 research source. Subregions stay inside the existing V6 mountain biome.
import { v6BiomeAt, V6_BIOME_TILE_SIZE } from './v6-balanced-biomes.mjs';
import { MOUNTAIN_V8_MATERIAL as material } from './mountain-v8-materials.mjs';
import { ShatteredPeaksColossalWorld } from './shattered-peaks-colossal.mjs';

const regionNames = Object.freeze({
  C: 'crown-peaks', E: 'emerald-highlands', B: 'broken-ridges',
  I: 'ironpine-highlands', R: 'crystal-escarpments', S: 'skywater-basins'
});
// Every symbol occupies one percent of the nominal, unwarped mountain tile.
// Each region is contiguous. The same seed and tile always use the same warp.
const layout = [
  'CCCCCBBBBB', 'CCCCCBBBBB', 'CCCCCBBBBB', 'CCCCCBBBBB',
  'EEEEERRRRR', 'EEEEERRRSS', 'EEEEESSSSS', 'EEEEEIIIII',
  'EEEEEIIIII', 'IIIIIIIIII'
];
const index = coordinate => Math.min(9, Math.max(0, Math.floor(coordinate * 10)));

export function planMountainSubregionAt(x, z, seed) {
  const biome = v6BiomeAt(x, z, seed);
  if (biome?.name !== 'mountain') return null;
  const [cx, cz] = biome.center, half = V6_BIOME_TILE_SIZE / 2;
  const u = (x - cx + half) / V6_BIOME_TILE_SIZE;
  const v = (z - cz + half) / V6_BIOME_TILE_SIZE;
  const phase = Math.sin(seed + cx * .021 + cz * .035) * Math.PI;
  const warpedX = u + .058 * Math.sin(u * Math.PI) * Math.sin(v * 2 * Math.PI + phase);
  const warpedZ = v + .058 * Math.sin(v * Math.PI) * Math.cos(u * 2 * Math.PI + phase);
  return regionNames[layout[index(warpedZ)][index(warpedX)]];
}

export class ShatteredPeaksSubregionWorld extends ShatteredPeaksColossalWorld {
  get terraceSourceVersion() { return 'sp3-subregion-caps-v1'; }

  _surfaceMaterial(column, x, z) {
    const y = column.topY;
    const original = super._surfaceMaterial(column);
    if (y < 20 || y >= 140) return original;
    switch (planMountainSubregionAt(x, z, this.seed)) {
      case 'crown-peaks': return y >= 70 ? material.stone : original;
      case 'emerald-highlands': return y < 96 ? material['alpine-grass'] : original;
      case 'broken-ridges': return material.slate;
      case 'ironpine-highlands': return y < 80 ? material.dirt : original;
      case 'crystal-escarpments': return material.gneiss;
      case 'skywater-basins': return y < 69 ? material['alpine-grass'] : material.stone;
      default: return original;
    }
  }
}
