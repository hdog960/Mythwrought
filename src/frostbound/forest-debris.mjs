import { createForestCandidate } from '../nonblock-scene48/forest-phase1-candidates.mjs';
import { candidateFamilies } from '../nonblock/candidate-families.mjs';
import { buildFrostboundLog } from './fallen-log.mjs';

export const FROST_ROOT_SCENE = 'frostbound:s3:exposed-root';
export const FROST_BRANCH_SCENE = 'frostbound:s3:fallen-branch';
export const FROST_LOG_SCENE = 'frostbound:s3:snow-covered-log';

function snowDebrisFamily(sourceId, palette, width = 1) {
  return Object.freeze({
    lane: '48',
    palette,
    mesh({ seed, anchor, variant }) {
      const { mesh } = createForestCandidate(sourceId, seed, ...anchor, variant);
      const { positions } = mesh;
      let floor = Infinity;
      for (let i = 1; i < positions.length; i += 3) floor = Math.min(floor, positions[i]);
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] *= width;
        positions[i + 1] -= floor;
        positions[i + 2] *= width;
      }
      return mesh;
    },
  });
}

const families = new Map([
  [FROST_ROOT_SCENE, snowDebrisFamily('scene48:exposed-root', [[.24,.18,.15],[.46,.49,.44]])],
  [FROST_BRANCH_SCENE, snowDebrisFamily('scene48:fallen-branch', [[.24,.25,.24],[.53,.62,.62],[.54,.43,.31]], .86)],
  [FROST_LOG_SCENE, Object.freeze({ lane: '48', build: buildFrostboundLog })],
]);

// Only the isolated Frostbound candidate registers these local variants.
export function registerFrostForestDebris() {
  for (const [sceneId, family] of families) {
    const current = candidateFamilies.get(sceneId);
    if (current === family) continue;
    if (current) throw Error('Frostbound forest debris identity is already reserved');
    candidateFamilies.set(sceneId, family);
  }
}
