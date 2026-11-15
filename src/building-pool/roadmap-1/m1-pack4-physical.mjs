// Roadmap 1 own physically resolved Pack 4 construction view.
// Canonical voxel candidates live only in Pack 4 PR #115; dependency injected.
// No clone/copy of Pack 4 sources, no shared engine or world mutations.
import {getM1Blueprints} from './m1-buildings.mjs';
export const PACK4_CONSTRUCTION_SOURCE=Object.freeze({
  repository:'hdog960/Mythwrought',pr:115,
  exactHead:'65cbddc4721f9d7278d58f8659562982266f7b41',
  assetIds:'159-181',familyCount:22,variantCount:23,
  requiresIsolatedCombinedCheckout:true,productionRegistry:false
});
const sourceBlueprints=()=>getM1Blueprints();
export function getM1Pack4Construction(pack4,{blueprints=null}={}){
  if(typeof pack4?.resolvePack4BuilderBlueprint!=='function')
    throw new TypeError('Pack 4 physical geometry resolver required; symbolic-only fallback forbidden');
  const drafts=blueprints??sourceBlueprints();
  if(!Array.isArray(drafts))throw TypeError('Expected source building blueprint array');
  const out=[];
  for(const draft of drafts){
    // The original M1 fireplace is at x=2 against the authored west wall
    // at x=1. Its generic "none" facing incorrectly mounted it behind +Z,
    // where no support exists. Face east, with the plate on the west wall.
    // This is an isolated physical sidecar; original blueprint stays unchanged.
    const physicalDraft={...draft,placements:draft.placements.map(p=>
      p.asset==='pack4:064'&&p.role==='furnishing'&&p.orientation==='none'
        ?{...p,orientation:'east',orientationProvenance:'supported-wall-sidecar'}:p)};
    const fixedSupportCells=draft.placements.filter(p=>
      p.asset.startsWith('live:')&&['foundation','floor','wall','partition','support'].includes(p.role)
    ).map(p=>p.at);
    const plan=pack4.resolvePack4BuilderBlueprint(physicalDraft,{fixedSupportCells});
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
      blueprintId:draft.id,source:draft,physicalPlan:plan,
      pack4Cells:plan.resolvedCount,
      orientationReviewCount:plan.orientationReviewCount??0,
      mountingSupportReviewCount:plan.placements.filter(p=>!p.supportVerified).length,
      livePlaced:false
    }));
  }
  return Object.freeze(out);
}
