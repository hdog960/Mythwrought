import { biome130Block } from '../biome130-registry.mjs';
import { candidateMesh } from '../auto-block-catalog/biome130/snow-organics.mjs';

const palette = biome130Block('biome130:030').palette;
const barkProfile = [[0,-.10],[0,.10],[.09,.21],[.28,.22],[.41,.12],[.41,-.12],[.28,-.22],[.09,-.21]];

export function buildFrostboundLog({ variant }) {
  const half = 1.09 + variant * .06;
  const acrossZ = variant % 2 === 1;
  const positions = [], materials = [];
  function triangle(a, b, c, material) {
    for (const [x, y, z] of [a, b, c]) positions.push(...(acrossZ ? [-z, y, x] : [x, y, z]));
    materials.push(material);
  }
  const left = barkProfile.map(([y, z]) => [-half, y, z]);
  const right = barkProfile.map(([y, z]) => [half, y, z * .91]);
  for (let i = 0; i < left.length; i++) {
    const j = (i + 1) % left.length;
    const bark = i === 2 || i === 6 ? 1 : 0;
    triangle(left[i], right[i], right[j], bark);
    triangle(left[i], right[j], left[j], bark);
  }
  for (const ring of [left, right.toReversed()]) {
    const center = [ring[0][0], .20, 0];
    const grain = ring.map(([x, y, z]) => [x, .20 + (y - .20) * .73, z * .73]);
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length;
      triangle(ring[i], ring[j], grain[j], 0);
      triangle(ring[i], grain[j], grain[i], 0);
      triangle(center, grain[i], grain[j], 1);
    }
  }

  // Leave both cut ends exposed and raise the settled snow towards the center.
  const mantle = [-half + .17, .39, -.123, half - .14, .48, .118];
  const ridge = [-half + .38, .48, -.086, half - .29, .53, .075];
  for (const [box, material] of [[mantle, 2], [ridge, 3]]) {
    const { vertices, indices } = candidateMesh({ boxes: [box] });
    const point = i => vertices.slice(i * 3, i * 3 + 3);
    for (let i = 0; i < indices.length; i += 3) {
      triangle(point(indices[i]), point(indices[i + 1]), point(indices[i + 2]), material);
    }
  }
  const boxes = [[-half, 0, -.105, half, .41, .105], [-half, .09, -.19, half, .33, .19], mantle, ridge];
  const colliders = acrossZ ? boxes.map(([x0, y0, z0, x1, y1, z1]) => [-z1, y0, x0, -z0, y1, x1]) : boxes;
  return { palette, colliders, mesh: { positions: Float32Array.from(positions),
    materials: Uint8Array.from(materials), triangleCount: materials.length } };
}
