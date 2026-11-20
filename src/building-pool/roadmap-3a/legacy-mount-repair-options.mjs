// Proposal ONLY. Builds zero physical edits to inherited PR #122 geometry.
// A chimney-support solid cell would obstruct its intentionally reserved flue.
import {auditLegacyBlacksmithSupports} from './legacy-physical-support-audit.mjs';
import {createLegacyBlacksmithPool} from './legacy-blacksmiths.mjs';
const coord=v=>v.join(',');
const inside=(p,b)=>p[0]>=b.x&&p[0]<b.x+b.width&&p[1]>=b.y&&
 p[1]<b.y+b.height&&p[2]>=b.z&&p[2]<b.z+b.depth;
export function planLegacyMountRepairOptions(){
 const audit=auditLegacyBlacksmithSupports();
 const original=new Map(createLegacyBlacksmithPool().map(b=>[b.id,b]));
 const options=[];
 for(const b of audit.buildings){
  const blueprint=original.get(b.id);
  const occupied=new Set(blueprint.modules.flatMap(m=>m.cells.map(c=>coord(c.slice(0,3)))));
  const perBuilding=[];
  for(const unresolved of b.unresolved){
   const p=unresolved.requiredSupport,free=!occupied.has(coord(p));
   const clear=blueprint.clearances.every(c=>!inside(p,c));
   if(unresolved.ref==='pack4:064'){
    // Exact required rear-face attachment. This only proves a FREE candidate cell,
    // not Pack 1 heat resistance, final face attachment, approved chimney connection.
    perBuilding.push({forFamily:unresolved.ref,at:unresolved.position,
     requiredAt:p,assetProposal:'pack1:002',kind:'proposed-rear-masonry-mount',
     sourceCellFree:free,clearPassage:clear,provisionalFeasible:free&&clear,
     approved:false,applied:false,
     approvalsNeeded:['Pack1 stone heat/fire barrier','Pack4 face-attachment shape',
       'production collider clearance','creator roof/fireplace aesthetic review']});
   }else{
    const flue=blueprint.architecture.flueVoid;
    const wouldSealFlue=flue[0]===p[0]&&flue[1]===p[2];
    perBuilding.push({forFamily:unresolved.ref,at:unresolved.position,
     requiredAt:p,assetProposal:null,kind:'chimney-hollow-flue-structural-conflict',
     sourceCellFree:free,clearPassage:clear,solidUnderChimneyBlocksFlue:wouldSealFlue,
     provisionalFeasible:false,approved:false,applied:false,
     approvalsNeeded:['redesign hollow chimney transition without sealing flue',
       'resolve actual Pack4 chimney/support shape and roof flashing',
       'creator/central integrator architecture signoff']});
   }
  }
  options.push({blueprintId:b.id,originalPR:122,sourceFingerprintUnchanged:true,
   modelMutated:false,proposals:perBuilding});
 }
 return Object.freeze({schema:'mythwrought.3a.blacksmith-heat-support-options.v1',
  basePR:122,models:options.length,totalSupportBlockers:audit.missingSupports,
  masonryFaceCandidates:options.flatMap(b=>b.proposals).filter(x=>x.provisionalFeasible).length,
  hollowFlueConflicts:options.flatMap(b=>b.proposals).filter(x=>x.solidUnderChimneyBlocksFlue).length,
  appliedModifications:0,releaseApproved:false,buildable:false,
  options});
}
