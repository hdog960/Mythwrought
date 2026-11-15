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
 const authored=draft.modules.flatMap(m=>m.cells.map(c=>({
  at:c.slice(0,3),asset:c[3],role:m.role
 })));
 const at=cell=>cell.join(',');
 const map=new Map(authored.map(r=>[at(r.at),r]));
 if(map.size!==authored.length)throw Error('Duplicate authored construction cell');
 const addedHearthBackings=[],addedHollowFlueCourses=[];
 const hearths=authored.filter(r=>r.asset==='pack4:064');
 const chimney=authored.filter(r=>r.asset==='pack4:063');
 const facingByHearth=new Map();
 if(draft.type==='blacksmith'){
  if(hearths.length!==1||chimney.length!==3)
   throw Error(draft.id+': original forge requires one hearth and three chimney courses');
  const hearth=hearths[0];
  const [x,y,z]=hearth.at;
  if(y!==2||chimney.some(c=>c.at[0]!==x||c.at[2]!==z))
   throw Error(draft.id+': fireplace/roof flue alignment invalid');
  const west=map.get([x-1,y,z].join(','));
  const hasWest=west&&['structure','wall','flue-support','support'].includes(west.role);
  if(hasWest){
   facingByHearth.set(at(hearth.at),'east');
  }else{
   // A stone masonry backwall is one REAL occupied structural cell behind
   // the original north-facing fireplace. It is not a fictitious mount.
   const backing={at:[x,y,z+1],asset:'builtin:stone',role:'hearth-backwall'};
   if(map.has(at(backing.at)))throw Error(draft.id+': no space for hearth backing wall');
   map.set(at(backing.at),backing);
   addedHearthBackings.push(backing);
   facingByHearth.set(at(hearth.at),'north');
  }
  // Extend actual Pack4:063 hollow brick courses through the entire vent
  // aperture, keeping the centered flue EMPTY (no full-cube placeholder).
  // Every course has an adjacent lower cell, ultimately the fireplace.
  const topStart=Math.min(...chimney.map(c=>c.at[1]));
  if(topStart<=3)throw Error('Chimney roof height too low to build interior flue');
  for(let yy=3;yy<topStart;yy++){
   const course={at:[x,yy,z],asset:'pack4:063',role:'hollow-interior-flue'};
   if(map.has(at(course.at)))throw Error(draft.id+': blocked original vent shaft');
   map.set(at(course.at),course);
   addedHollowFlueCourses.push(course);
  }
 }
 const placements=[...map.values()].map(row=>{
  const fireplace=row.asset==='pack4:064',
        flue=row.asset==='pack4:063';
  const facing=fireplace?facingByHearth.get(at(row.at)):
   'north';
  return {...row,orientation:facing??'north',
   orientationProvenance:fireplace?'real-wall-backed-fireplace':
     flue?'fourfold-symmetric-hollow-flue':'default-preview-only'};
 });
 return Object.freeze({id:draft.id,
   placements:Object.freeze(placements),
   addedHearthBackings:Object.freeze(addedHearthBackings),
   addedHollowFlueCourses:Object.freeze(addedHollowFlueCourses),
   // One exact geometric contact gap still requires the later structural
   // detailing gate: fireplace top mantle Y=.94, chimney bottom Y=0 next cell.
   chimneySubBoxContactReview:draft.type==='blacksmith'});
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
      hearthBackingsAdded:physicalDraft.addedHearthBackings?.length??0,
      hollowFlueCoursesAdded:physicalDraft.addedHollowFlueCourses?.length??0,
      chimneySubBoxContactReview:physicalDraft.chimneySubBoxContactReview??false,
      pack4Cells:plan.resolvedCount,
      orientationReviewCount:plan.orientationReviewCount??0,
      mountingSupportReviewCount:plan.placements.filter(p=>!p.supportVerified).length,
      livePlaced:false
    }));
  }
  return Object.freeze(out);
}
