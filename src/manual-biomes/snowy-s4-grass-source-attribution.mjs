// S4 DETACHED ORIGINAL M7 grass-island source attribution, NOT terrain repair.
// Replays ONLY the preservation guard from original environment-v7.mjs:
// for y=old-2..19, above old must be AIR; at/below old must be
// GRASS / DIRT / STONE. A passing guard does NOT imply a valid snow plan:
// biome blend / shared shoulders may deliberately leave the plan empty.
import {surveySnowS4LegacyGrassIslands} from './snowy-s4-legacy-grass-islands.mjs';

const MAX_Y=19, AIR=0, GRASS=1, DIRT=2, STONE=3;
const M7='mythwrought-five-surface-regions-v7';
const SOIL=new Set([GRASS,DIRT,STONE]);
const WOOD_LEAVES=new Set([4,5]);
const freeze=Object.freeze;
const key=(x,y,z)=>x+','+y+','+z;
const allowed=n=>Number.isSafeInteger(n)&&n>=0&&n<=65535;

/** Caller supplies the true VoxelWorld.prototype.naturalAndLandmarkBlock
 * reader as legacyNatural; synthetic substitutes are fixture tests only.
 * This never proposes writes or certifies a terrain/biome upgrade.
 */
export function auditSnowS4GrassSourceAttribution(world,rectangle,{
  biomeAt,terrainHeight,legacyNatural
}={}){
  if(world?.generationProfile?.generator!==M7||
    typeof world?._environmentBaseline!=='function'||
    typeof world?._columnPlan!=='function'||
    typeof world?.environmentCaves?.get!=='function'||
    typeof world?.get!=='function'||typeof world?.save!=='function'||
    !(world.edits instanceof Map)||
    typeof biomeAt!=='function'||typeof terrainHeight!=='function'||
    typeof legacyNatural!=='function')
    throw new TypeError('Exact original M7 source readers and legacyNatural required');
  const beforeSave=JSON.stringify(world.save());
  const topology=surveySnowS4LegacyGrassIslands(world,rectangle,{biomeAt,terrainHeight});
  const targets=topology.components.flatMap(c=>c.cells);
  const minX=topology.rectangle[0],minZ=topology.rectangle[1];
  const width=topology.rectangle[2],height=topology.rectangle[3];
  const allColumns=[];
  for(let dz=0;dz<height;dz++)for(let dx=0;dx<width;dx++)
    allColumns.push([minX+dx,minZ+dz]);
  // Source-only witness across the sampled physical original world envelope.
  // Catch a callback that mutates cave overrides without touching schema-1.
  const caveWitness=()=>JSON.stringify(allColumns.map(([x,z])=>
    Array.from({length:MAX_Y+3},(_,i)=>{
      const v=world.environmentCaves.get(x,i-3,z);
      return v===undefined?null:v;
    })));
  const beforeCaves=caveWitness();
  const rows=[],summary={guardVeto:0,noGuardVeto:0,
    unsuppressedWoodOrLeaves:0,otherElevatedOriginal:0,
    invalidOriginalSubsurface:0,maskedLegacyWoodOrLeaves:0,
    caveOverrides:0,savedEditIntersections:0};
  // Exactly original source guard upper limit; no arbitrary scan into caves.
  // Preserve the FIRST veto; an additional obstruction at another Y never
  // overrides original environment-v7's early-return reason.
  const record=[];
  for(const [x,z] of targets){
    const old=terrainHeight(x,z,world.seed);
    if(!Number.isSafeInteger(old)||old<2||old>12||
      world._columnPlan(x,z).size!==0||world.get(x,old,z)!==GRASS)
      throw new Error('S4 retained-grass evidence changed during source attribution');
    let first=null,masked=0,caves=0,edits=0;
    for(let y=old-2;y<=MAX_Y;y++){
      const baseline=world._environmentBaseline(x,y,z);
      const legacy=legacyNatural(x,y,z);
      const cave=world.environmentCaves.get(x,y,z);
      const edited=world.edits.has(key(x,y,z));
      if(!allowed(baseline)||!allowed(legacy)||
        cave!==undefined&&!allowed(cave))
        throw new TypeError('Invalid original M7 baseline / legacy / cave cell ID');
      record.push([x,y,z,baseline,legacy,cave===undefined?null:cave,edited]);
      if(cave!==undefined)caves++;
      if(edited)edits++;
      if(WOOD_LEAVES.has(legacy)&&baseline===AIR)masked++;
      const invalid=y>old?baseline!==AIR:!SOIL.has(baseline);
      if(invalid&&first===null){
        const category=y<=old?'invalid-original-subsurface':
          WOOD_LEAVES.has(baseline)&&WOOD_LEAVES.has(legacy)?
            'unsuppressed-original-wood-or-leaves':'other-elevated-original';
        first=freeze({y,baseline,legacy,
          caveOverride:cave===undefined?null:cave,category});
      }
    }
    const cause=first?.category??'no-original-preservation-guard-veto-observed';
    if(first){
      summary.guardVeto++;
      if(cause==='invalid-original-subsurface')summary.invalidOriginalSubsurface++;
      if(cause==='unsuppressed-original-wood-or-leaves')summary.unsuppressedWoodOrLeaves++;
      if(cause==='other-elevated-original')summary.otherElevatedOriginal++;
    }else summary.noGuardVeto++;
    summary.maskedLegacyWoodOrLeaves+=masked;
    summary.caveOverrides+=caves;
    summary.savedEditIntersections+=edits;
    rows.push(freeze({x,z,old,cause,firstVeto:first,
      maskedLegacyWoodOrLeaves:masked,caveOverrides:caves,
      savedEditIntersections:edits,
      disposition:'source-investigation-only-no-terrain-changes'}));
  }
  // Detect a reread with changed baseline/old-landmark values, as well as
  // explicit cave overrides and saved data. Readbacks are bounded to the
  // same at-most-128 original grass columns, Y=old-2..19.
  for(const [x,y,z,baseline,legacy,cave,edited] of record){
    const next=world.environmentCaves.get(x,y,z);
    if(world._environmentBaseline(x,y,z)!==baseline||
      legacyNatural(x,y,z)!==legacy||
      (next===undefined?null:next)!==cave||
      world.edits.has(key(x,y,z))!==edited)
      throw new Error('S4 original baseline or legacy source changed during attribution');
  }
  if(JSON.stringify(world.save())!==beforeSave||caveWitness()!==beforeCaves)
    throw new Error('S4 original schema-1 or sampled cave source changed during attribution');
  return freeze({kind:'detached-S4-original-M7-grass-source-attribution',
    sampled:topology.sampled,grassCells:topology.greenCells,
    components:topology.components.length,
    rows:freeze(rows),summary:freeze(summary),
    state:'read-only-first-original-source-veto-not-snow-fix-authorization',
    originalSaveUnchanged:true,originalSourcesUnchanged:true,
    originalActualM7AndIPhoneAcceptance:false});
}
