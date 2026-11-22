/**
 * Read-only-world, temporary ORIGINAL Pack5 opt-in live-adapter precedence
 * witness. Uses the original raycast paths and fixture placement solely in a
 * new in-memory TEST object; never calls VoxelWorld.set(), a saved game, or UI.
 */
import {createPack5LiveAdapter} from '../../pack5-integration/live-adapter.mjs';
import {BLOCK,raycast as originalVoxelRaycast} from '../../voxel.mjs';
const requireTrue=(v,reason)=>{if(!v)throw Error('Roadmap A original live-adapter ray risk: '+reason);};
const vec=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
const original=Object.freeze([
 {id:'unobstructed-front',blocker:null,rayOrigin:[0.5,0.5,2],direction:[0,0,-1]},
 {id:'brick-closer-than-rear-legacy',blocker:[0,0,-1],rayOrigin:[0.5,0.5,2],direction:[0,0,-1]},
 {id:'legacy-obscures-rear-approach',blocker:[0,0,-1],rayOrigin:[0.5,0.5,-2],direction:[0,0,1]},
 {id:'legacy-front-face-occlusion-tie',blocker:[0,0,1],rayOrigin:[0.5,0.5,2],direction:[0,0,-1]}
]);
const pos=a=>a.join(',');

/**
 * Caller cannot provide a real game world/active game instance. The frozen
 * mock has ONLY get(seed179) and never grants set(), localStorage or a renderer.
 */
function readonlySourceWorld(blocker){
 const solid=blocker?new Set([pos(blocker)]):new Set();
 let reads=0;
 const world=Object.freeze({
  seed:179,
  biomeCellCount:0,
  pack2Cells:new Map(),
  get(x,y,z){
   requireTrue([x,y,z].every(Number.isSafeInteger),'original player-target ray escaped integer cells');
   reads++;
   return solid.has(pos([x,y,z]))?BLOCK.STONE:BLOCK.AIR;
  }
 });
 return {world,getReads:()=>reads};
}
export function auditOriginalPack5LiveAdapterRayPrecedence(){
 const rows=[];
 for(const req of original){
  const {world,getReads}=readonlySourceWorld(req.blocker);
  requireTrue(Object.isFrozen(world)&&world.set===undefined&&world.save===undefined,
   'only immutable original read-only test world may be supplied');
  const adapter=createPack5LiveAdapter(world,{storage:null});
  const placement=adapter.layer.place('pack5:080',[0,0,0],0,'hearth-running-bond');
  requireTrue(placement?.ok===true&&adapter.layer.count()===1,
   'original isolated test-only Pack5 layer failed in empty source voxel');
  const measured=adapter.inspect(req.rayOrigin,req.direction);
  const compare=originalVoxelRaycast(world,req.rayOrigin,req.direction,6);
  requireTrue((measured.legacy===null&&compare===null)||
    (measured.legacy?.distance===compare?.distance&&
     pos(measured.legacy.hit)===pos(compare.hit)),
   'adapter legacy ray deviated from unmodified voxel.raycast');
  requireTrue(getReads()>0&&vec(req.rayOrigin)&&vec(req.direction),
   'original immutable source voxel read path not exercised');
  rows.push({
   case:req.id,originalReadonlyTestWorldHasLegacyStone:req.blocker!==null,
   originalLegacyHitCell:measured.legacy?.hit??null,
   originalLegacyDistance:measured.legacy?.distance??null,
   originalPack5VisibleSelectionHitCell:measured.shape?.cell??null,
   originalPack5VisibleSelectionDistance:measured.shape?.distance??null,
   pack5TargetHiddenByLegacy:req.blocker!==null&&measured.shape===null,
   targetedPack5WithoutOriginalWorldPlacement:measured.shape!==null,
   originalLegacyAdjacent:measured.adjacent??null,
   totalSourceWorldReadCalls:getReads(),
   worldMutated:false,saveWritten:false,
   originalLiveAdapterButNotRunningGame:true});
 }
 requireTrue(rows.length===4,'missing original readonly terrain ray cases');
 const by=Object.fromEntries(rows.map(row=>[row.case,row]));
 requireTrue(by['unobstructed-front'].originalPack5VisibleSelectionDistance!==null&&
  by['unobstructed-front'].originalLegacyDistance===null,
  'original no-terrain ray should target opt-in Pack5 source');
 requireTrue(by['brick-closer-than-rear-legacy'].originalPack5VisibleSelectionDistance!==null&&
  by['brick-closer-than-rear-legacy'].originalLegacyDistance!==null&&
  by['brick-closer-than-rear-legacy'].originalPack5VisibleSelectionDistance<
   by['brick-closer-than-rear-legacy'].originalLegacyDistance,
  'original foreground source brick must win over rear legacy terrain');
 requireTrue(by['legacy-obscures-rear-approach'].originalPack5VisibleSelectionDistance===null&&
  by['legacy-obscures-rear-approach'].originalLegacyDistance!==null,
  'original backing terrain should occlude a behind-terrain Pack5 target');
 requireTrue(by['legacy-front-face-occlusion-tie'].originalPack5VisibleSelectionDistance===null&&
  by['legacy-front-face-occlusion-tie'].originalLegacyDistance!==null,
  'original front legacy cell occlusion must precede shaped selection');
 return {schema:'mythwrought.roadmap-a.pack5-original-live-adapter-readonly-occlusion.v1',
  originalSourceCodePaths:['pack5-integration/live-adapter.mjs',
   'pack5-integration/construction-layer.mjs','voxel.mjs'],
  testOnlyReadOnlySyntheticWorldCases:rows.length,probes:rows,
  sourceLegacyAndPack5PhysicalShapeRayPathsExecuted:true,
  canonicalSourceLegacyRayCompared:true,
  originalGameMainInputLoopExecuted:false,
  ephemeralIsolatedBuilderLayerOnly:true,actualVoxelWorldMutated:false,
  sourceBuildingOrSettlementPlaced:false,actualSaveOrSchema1Written:false,
  originalA5MaterialYawAssigned:false,realPhoneOrWebGL2Measured:false,
  creatorApprovalNotImplied:true,structuralSupportNotCertified:true,
  sourceOnly:true,readyForProduction:false};
}
