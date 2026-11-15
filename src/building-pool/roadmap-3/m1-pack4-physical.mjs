// Roadmap 3 own physically resolved Pack 4 construction view.
// Canonical voxel candidates live only in Pack 4 PR #115; dependency injected.
// No clone/copy of Pack 4 sources, no shared engine or world mutations.
import {createM1Pool} from './m1.mjs';
export const PACK4_CONSTRUCTION_SOURCE=Object.freeze({
  repository:'hdog960/Mythwrought',pr:115,
  exactHead:'65cbddc4721f9d7278d58f8659562982266f7b41',
  assetIds:'159-181',familyCount:22,variantCount:23,
  requiresIsolatedCombinedCheckout:true,productionRegistry:false
});
const sourceBlueprints=()=>createM1Pool();
// Only adopt a fireplace orientation when an ORIGINAL authored structural
// neighbor proves the Pack4 wall bracket has backing. No wall/shaft invented.
// Other facings remain explicit candidate-preview defaults requiring review.
function supportedPhysicalDraft(draft){
 if(!Array.isArray(draft.modules))return draft;
 const slots=draft.modules.flatMap(m=>m.cells.map(c=>
  ({at:c.slice(0,3),asset:c[3],role:m.role})));
 const map=new Map(slots.map(s=>[s.at.join(','),s]));
 return {id:draft.id,placements:slots.map(s=>{
  const [x,y,z]=s.at;
  const west=map.get([x-1,y,z].join(','));
  const anchored=s.asset==='pack4:064'&&west&&
   ['structure','wall','flue-support','support'].includes(west.role);
  return {...s,orientation:anchored?'east':'north',
   orientationProvenance:anchored?'supported-wall-sidecar':'default-preview-only'};
 })};
}

export function getM1Pack4Construction(pack4,{blueprints=null}={}){
  if(typeof pack4?.resolvePack4BuilderBlueprint!=='function')
    throw new TypeError('Pack 4 physical geometry resolver required; symbolic-only fallback forbidden');
  const drafts=blueprints??sourceBlueprints();
  if(!Array.isArray(drafts))throw TypeError('Expected source building blueprint array');
  const out=[];
  for(const draft of drafts){
    const physicalDraft=supportedPhysicalDraft(draft);
    const plan=pack4.resolvePack4BuilderBlueprint(physicalDraft);
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
      blueprintId:draft.id,source:draft,physicalSource:physicalDraft,physicalPlan:plan,
      pack4Cells:plan.resolvedCount,
      orientationReviewCount:plan.orientationReviewCount??0,
      mountingSupportReviewCount:plan.placements.filter(p=>!p.supportVerified).length,
      livePlaced:false
    }));
  }
  return Object.freeze(out);
}
