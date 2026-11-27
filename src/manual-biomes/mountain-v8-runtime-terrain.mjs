// Real V8-only natural terrain reader on the creator-authorized isolated candidate.
// Source algorithms selectively retained from 4b86f49510c575cdeec8c8b346b57f985d587cbd.
// Initial terrain slice reuses the actual existing registered physical materials;
// no new material allocation or placeholders. Final V8 material and flora ledger pending.
import {BLOCK,terrainHeight} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from './mountain-v8-materials.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {surveyMountainV8Column} from './mountain-v8-source-adapter.mjs';
import {planMountainV8PhysicalColumn} from './mountain-v8-physical-column.mjs';
export {M8_MOUNTAIN_GENERATOR} from '../environment-ground.mjs';
const existingTerrain=M;
// Never consult player edits when generating natural baseline. Real get/set
// owns their precedence; including edits here would make save restore nondeterministic.
// A protected/cave/landmark veto falls through to the unchanged original P3 plan.
export function planMountainV8RegisteredTerrain(x,z,seed,readBaseline,protectedAt,readFallback){
  const proposal=surveyMountainV8Column({x,z,seed,worldMaxY:WORLD_MAX_Y,
    biomeAt:v6BiomeAt,heightAt:terrainHeight,readBlock:readBaseline,
    protectedAt,ids:BLOCK});
  if(!proposal)return null;
  const plan=planMountainV8PhysicalColumn(proposal,{worldMaxY:WORLD_MAX_Y,
    ids:BLOCK,readOriginalBlock:readBaseline,protectedAt});
  if(!plan)return null;
  const target=new Map(plan.writes.map(({y,material})=>[y,existingTerrain[material]]));
  // Feather between the actual accepted M7 shoulder height and V8's
  // predicted height. Use the weakest of the five biome samples so a
  // neighboring boundary veto cannot abruptly expose a lower V8 column.
  const region=v6BiomeAt(x,z,seed);
  const weight=Math.min(region.weight,...proposal.sourceProvenance.neighborBiomeWeights);
  const t=Math.max(0,Math.min(1,(weight-.82)/.14));
  const alpha=t*t*(3-2*t);
  if(alpha>=1)return target;
  if(typeof readFallback!=='function')return null;
  const prior=readFallback();
  if(!(prior instanceof Map)||!prior.size)return null;
  if(alpha<=0)return prior;
  const oldTop=Math.max(...prior.keys());
  const top=Math.round(oldTop+(proposal.top-oldTop)*alpha);
  if(top<proposal.legacyTop||top>WORLD_MAX_Y-2)return null;
  // Deterministic continuous height; sparse cap transition uses a world
  // coordinate hash, never chunk-local randomness. Retain old cap near
  // the shoulder, use V8 cap toward the interior.
  let h=Math.imul(x,0x7feb352d)^Math.imul(z,0x846ca68b)^seed;
  h=Math.imul(h^(h>>>16),0x45d9f3b);
  const v8Cap=((h^(h>>>16))>>>0)/4294967296<alpha;
  const cap=v8Cap?target.get(proposal.top):prior.get(oldTop);
  const blended=new Map();
  const bottom=Math.min(...prior.keys(),...target.keys());
  for(let y=bottom;y<=top;y++){
    if(y<proposal.legacyTop){if(prior.has(y))blended.set(y,prior.get(y));continue;}
    if(protectedAt(x,y,z)||readBaseline(x,y,z)!==(y===proposal.legacyTop?BLOCK.GRASS:BLOCK.AIR))return null;
    blended.set(y,y===top?cap:
      y>=top-2?([BLOCK.GRASS,M['alpine-grass']].includes(cap)?M.dirt:M.stone):M.stone);
  }
  return blended;
}
