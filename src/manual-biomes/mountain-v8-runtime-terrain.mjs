// Real V8-only natural terrain reader on the creator-authorized isolated candidate.
// Source algorithms selectively retained from 4b86f49510c575cdeec8c8b346b57f985d587cbd.
// Initial terrain slice reuses the actual existing registered physical materials;
// no new material allocation or placeholders. Final V8 material and flora ledger pending.
import {BLOCK,terrainHeight} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {surveyMountainV8Column} from './mountain-v8-source-adapter.mjs';
import {planMountainV8PhysicalColumn} from './mountain-v8-physical-column.mjs';
export const M8_MOUNTAIN_GENERATOR='mythwrought-five-surface-regions-mountain-v8';
const existingTerrain=Object.freeze({stone:BLOCK.STONE,dirt:BLOCK.DIRT,
  snow:272,'alpine-grass':BLOCK.GRASS,slate:G.slate,gneiss:G.gneiss,scree:G.scree});
// Never consult player edits when generating natural baseline. Real get/set
// owns their precedence; including edits here would make save restore nondeterministic.
// A protected/cave/landmark veto falls through to the unchanged original P3 plan.
export function planMountainV8RegisteredTerrain(x,z,seed,readBaseline,protectedAt){
  const proposal=surveyMountainV8Column({x,z,seed,worldMaxY:WORLD_MAX_Y,
    biomeAt:v6BiomeAt,heightAt:terrainHeight,readBlock:readBaseline,
    protectedAt,ids:BLOCK});
  if(!proposal)return null;
  const plan=planMountainV8PhysicalColumn(proposal,{worldMaxY:WORLD_MAX_Y,
    ids:BLOCK,readOriginalBlock:readBaseline,protectedAt});
  if(!plan)return null;
  return new Map(plan.writes.map(({y,material})=>[y,existingTerrain[material]]));
}
