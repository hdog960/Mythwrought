// Roadmap 2 own physically resolved Pack 4 construction view.
// Canonical voxel candidates live only in Pack 4 PR #115; dependency injected.
// No clone/copy of Pack 4 sources, no shared engine or world mutations.
import {M1_REPRESENTATIVES} from './m1-representatives.mjs';
export const PACK4_CONSTRUCTION_SOURCE=Object.freeze({
  repository:'hdog960/Mythwrought',pr:115,
  exactHead:'65cbddc4721f9d7278d58f8659562982266f7b41',
  assetIds:'159-181',familyCount:22,variantCount:23,
  requiresIsolatedCombinedCheckout:true,productionRegistry:false
});
const sourceBlueprints=()=>M1_REPRESENTATIVES;
// Only the builder-side physical construction view may substitute a candidate
// mounting alternative. The 30 canonical symbolic blueprints stay byte-identical.
// Original blueprints sometimes suspend FLOOR lanterns above open air; a real
// wall-supported Pack4 sconce (ID166) is the nearest usable physical alternative.
const key=(x,y,z)=>[x,y,z].join(',');
const backingDirs=[
 {offset:[-1,0,0],facing:'east'},
 {offset:[1,0,0],facing:'west'},
 {offset:[0,0,-1],facing:'south'},
 {offset:[0,0,1],facing:'north'}
];
function stagePhysicalLanternMounts(draft){
 if(!Array.isArray(draft.voxels))return {draft,alternatives:[]};
 const cells=new Map(draft.voxels.map(v=>[key(v.x,v.y,v.z),{...v}]));
 const alternatives=[];
 const lanterns=draft.voxels.filter(v=>
  (v.material==='pack4:035'||v.material==='pack4:037')&&
  !cells.has(key(v.x,v.y-1,v.z)));
 for(const v of lanterns){
  const origKey=key(v.x,v.y,v.z);
  const at=[[v.x,v.y,v.z]];
  // First try local mounting; only then a short wallward relocation. All
  // alternatives require an actual authored structural backing cell.
  // Source blueprint stays unchanged, and every move is flagged for art review.
  for(let step=1;step<=3;step++)at.push(
    [v.x-step,v.y,v.z],[v.x+step,v.y,v.z],
    [v.x,v.y,v.z-step],[v.x,v.y,v.z+step]
  );
  let proposed=null;
  for(const [x,y,z] of at){
   if(x<0||z<0||x>=draft.extents.x||z>=draft.extents.z)continue;
   if(key(x,y,z)!==origKey&&cells.has(key(x,y,z)))continue;
   for(const {offset,facing} of backingDirs){
    const [dx,dy,dz]=offset;
    const back=key(x+dx,y+dy,z+dz),support=cells.get(back);
    if(back===origKey||!support||
       !['wall','roof','foundation','support'].includes(support.kind)||
       support.material.startsWith('pack4:'))continue;
    proposed={x,y,z,face:facing,backing:[x+dx,y+dy,z+dz],
      supportRef:support.material};
    break;
   }
   if(proposed)break;
  }
  if(!proposed)continue; // report as unsupported; never invent bracket support
  cells.delete(origKey);
  cells.set(key(proposed.x,proposed.y,proposed.z),{
   ...v,x:proposed.x,y:proposed.y,z:proposed.z,
   material:'pack4:036',intendedFacing:proposed.face,
   physicalAlternative:'anchored-wall-sconce-for-floor-lantern',
   originalLampRef:v.material,originalLampCell:[v.x,v.y,v.z]
  });
  alternatives.push({from:[v.x,v.y,v.z],to:[proposed.x,proposed.y,proposed.z],
   source:v.material,replacement:'pack4:036',facing:proposed.face,
   backing:proposed.backing,supportRef:proposed.supportRef,
   requiresCreatorArtReview:true});
 }
 const placements=[...cells.values()].map(v=>{
  const x=v.x,z=v.z;
  let facing=v.intendedFacing??'north',provenance=v.intendedFacing?
   'supported-wall-alternative':'default-preview-only';
  if(!v.intendedFacing&&v.kind==='window'){
   facing=x===0?'west':x===draft.extents.x-1?'east':
     z===draft.extents.z-1?'south':'north';
   provenance='facade-derived';
  }
  // These are explicit BUILDER layout decisions, not a renderer default.
  // Crates open toward the stockroom aisle; temple pews face the far altar;
  // external waymark signs face the street at z=0.
  if(!v.intendedFacing&&v.material==='pack4:057'){
   facing=x<Math.floor(draft.extents.x/2)?'east':'west';
   provenance='stockroom-aisle-facing';
  }else if(!v.intendedFacing&&v.material==='pack4:058'){
   facing='south';
   provenance='sanctuary-facing-pew';
  }else if(!v.intendedFacing&&v.material==='pack4:060'){
   facing='north';
   provenance='street-facing-waymark';
  }
  return {at:[x,v.y,z],asset:v.material,role:v.kind,
   orientation:facing,orientationProvenance:provenance,
   physicalAlternative:v.physicalAlternative??null};
 });
 return {draft:{id:draft.id,placements},alternatives};
}

export function getM1Pack4Construction(pack4,{blueprints=null}={}){
  if(typeof pack4?.resolvePack4BuilderBlueprint!=='function')
    throw new TypeError('Pack 4 physical geometry resolver required; symbolic-only fallback forbidden');
  const drafts=blueprints??sourceBlueprints();
  if(!Array.isArray(drafts))throw TypeError('Expected source building blueprint array');
  const out=[];
  for(const draft of drafts){
    const staged=stagePhysicalLanternMounts(draft);
    const plan=pack4.resolvePack4BuilderBlueprint(staged.draft);
    if(!plan||!Array.isArray(plan.placements)||plan.resolvedCount!==plan.placements.length)
      throw Error('Pack 4 resolver returned invalid physical plan '+draft?.id);
    for(const p of plan.placements){
      if(!p.physical?.hasRealPhysicalGeometry||
         !Array.isArray(p.physical.visible)||!p.physical.visible.length||
         !Array.isArray(p.physical.collision)||!p.physical.collision.length||
         !Array.isArray(p.physical.selection)||!p.physical.selection.length||
         !(p.physical.previewMesh?.opaque instanceof Float32Array)||
         !(p.physical.previewMesh?.translucent instanceof Float32Array)||
         p.productionPlacement!==false)
        throw Error('Physical Pack 4 candidate unavailable at '+draft?.id);
    }
    out.push(Object.freeze({
      blueprintId:draft.id,source:draft,physicalSource:staged.draft,
      physicalLanternAlternatives:Object.freeze(staged.alternatives),
      physicalPlan:plan,
      pack4Cells:plan.resolvedCount,
      orientationReviewCount:plan.orientationReviewCount??0,
      mountingSupportReviewCount:plan.placements.filter(p=>!p.supportVerified).length,
      livePlaced:false
    }));
  }
  return Object.freeze(out);
}
