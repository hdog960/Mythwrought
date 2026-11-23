// DETACHED S4 original-M7 transition hold diagnostic. No terrain generator,
// renderer, block registration, player edit or biome mutation is installed.
// The math below transcribes ONLY the low-blend / shared-shoulder early-return
// conditions of original environment-v7.mjs (blob d7b93c0a687afe7bbb8cf169c0b318fd1dc593af).
// Caller MUST provide genuine v6BiomeAt / terrainHeight / legacyNatural for
// authentic M7 use. Fixture callbacks are NOT original-game acceptance.
import {auditSnowS4GrassSourceAttribution} from './snowy-s4-grass-source-attribution.mjs';

const M7='mythwrought-five-surface-regions-v7';
const OFFSETS=Object.freeze([[14,0],[-14,0],[0,14],[0,-14]].map(Object.freeze));
const freeze=Object.freeze;
const smooth=t=>t*t*(3-2*t);
const clamp=n=>Math.max(0,Math.min(1,n));
const validRegion=r=>r&&typeof r.name==='string'&&r.name.length>0&&
  Number.isFinite(r.weight)&&r.weight>=0&&r.weight<=1;
const match=(a,b)=>a.name===b.name&&a.weight===b.weight;

// This reflects original environment-v7 sharedShoulder priority and offset
// order, not a suggestion to apply these materials to retained grass.
function shoulderAt(region,x,z,seed,biomeAt,ledger){
  if(region.weight>.50)return null;
  for(const [dx,dz] of OFFSETS){
    const next=biomeAt(x+dx,z+dz,seed);
    if(!validRegion(next))throw new TypeError('S4 invalid original shoulder neighbor');
    ledger.push([x+dx,z+dz,next.name,next.weight]);
    if(next.name===region.name)continue;
    const pair=[region.name,next.name];
    const id=pair.includes('mountain')?401:
      pair.includes('snow')&&pair.includes('enchanted')?405:258;
    return freeze({id,neighbor:next.name,offset:freeze([dx,dz])});
  }
  return null;
}

export function inspectSnowS4OriginalTransitionHolds(world,rectangle,{biomeAt,
  terrainHeight,legacyNatural}={}){
  if(world?.generationProfile?.generator!==M7||typeof world?.save!=='function'||
    typeof world?._columnPlan!=='function'||typeof world?.get!=='function'||
    typeof world?.environmentCaves?.get!=='function'||
    !(world.edits instanceof Map)||typeof biomeAt!=='function'||
    typeof terrainHeight!=='function'||typeof legacyNatural!=='function')
    throw new TypeError('S4 original M7 read-only source contracts required');
  const before=JSON.stringify(world.save());
  const original=auditSnowS4GrassSourceAttribution(world,rectangle,
    {biomeAt,terrainHeight,legacyNatural});
  const ledger=[],cells=[],tally={protectedOriginalSource:0,
    legitimateLowBlendNoShoulder:0,unexplainedEmptyPlan:0};
  // Read a bounded source witness; callbacks are not allowed to mutate even
  // transient original cave overrides that schema-1 saves do not contain.
  const witness=()=>JSON.stringify(original.rows.map(r=>{
    const p=world._columnPlan(r.x,r.z);
    if(!(p instanceof Map)||p.size!==0)
      throw new Error('S4 original source plan changed');
    return [r.x,r.z,world.get(r.x,r.old,r.z),
      Array.from({length:23},(_,i)=>{
        const v=world.environmentCaves.get(r.x,i-3,r.z);
        return v===undefined?null:v;
      })];
  }));
  const initial=witness();
  for(const row of original.rows){
    const region=biomeAt(row.x,row.z,world.seed);
    if(!validRegion(region)||region.name!=='snow')
      throw new TypeError('S4 legacy-grass column is not authentic snow climate');
    ledger.push([row.x,row.z,region.name,region.weight]);
    const blend=smooth(clamp((region.weight-.35)/.65));
    const shoulder=shoulderAt(region,row.x,row.z,world.seed,biomeAt,ledger);
    const protectedOldSource=row.firstVeto!==null;
    const legitimateNoBlend=!protectedOldSource&&blend<.065&&shoulder===null;
    const diagnosis=protectedOldSource?'original-physical-source-veto':
      legitimateNoBlend?'original-low-blend-without-shoulder':
      'unexplained-empty-M7-source-column';
    if(protectedOldSource)tally.protectedOriginalSource++;
    else if(legitimateNoBlend)tally.legitimateLowBlendNoShoulder++;
    else tally.unexplainedEmptyPlan++;
    cells.push(freeze({x:row.x,z:row.z,old:row.old,diagnosis,
      guardCategory:row.cause,weight:region.weight,blend,shoulder,
      authorizingTerrainWrites:false}));
  }
  for(const [x,z,name,weight] of ledger){
    const current=biomeAt(x,z,world.seed);
    if(!validRegion(current)||!match(current,{name,weight}))
      throw new Error('S4 biome source changed during original transition review');
  }
  if(witness()!==initial||JSON.stringify(world.save())!==before)
    throw new Error('S4 original world source changed during transition review');
  return freeze({kind:'detached-S4-original-M7-transition-hold-review',
    sampled:original.sampled,grassCells:original.grassCells,
    cells:freeze(cells),counts:freeze(tally),
    originalSource:freeze({preservationVeto:original.summary.guardVeto,
      noPreservationVeto:original.summary.noGuardVeto}),
    state:'research-only-no-original-world-or-shader-mutations',
    writerEnabled:false,originalWorldAndIPhoneAccepted:false});
}
