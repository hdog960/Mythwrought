// Mythwrought cave roadmap #240: deterministic historical EAST gallery intake.
// The original #147 remains untouched. New-cave-world preview-only candidate:
// compare exact source reader to the live seeded terrain and refuse replacing
// any conflicting prior named landmark or live cave. No old saves / prod writes.
import {VoxelWorld,BLOCK,worldKey,collides} from '../voxel.mjs';
import {CAVE_CANDIDATE,caveRoute} from '../experimental-cave-route.mjs';
import {eastGalleryCaveWorld,eastGalleryTrace,
  eastGalleryChamberTrace,eastGalleryConnectionTrace} from '../east-gallery-cave.mjs';
const isSeed=seed=>Number.isSafeInteger(seed)&&seed===(seed|0);
const key=(x,y,z)=>worldKey(x,y,z);
export const EAST_GALLERY_SOURCE='original-historical-pr147';
function validateView(world,trace,room){
 const bad=[],byStep=[];
 const addPoint=(point,type)=>{
  const {x,z,feet}=point;const floor=feet-1;
  const supported=world.get(x,floor,z)!==BLOCK.AIR;
  const headroom=world.get(x,feet,z)===BLOCK.AIR&&world.get(x,feet+1,z)===BLOCK.AIR;
  const bodyClear=!collides(world,x+.5,feet,z+.5);
  if(!supported||!headroom||!bodyClear)bad.push({
   type,x,z,feet,supported,headroom,bodyClear
  });
 };
 for(const p of trace.samples)addPoint(p,'SOUTH_TO_EAST');
 for(const p of room.cells)addPoint({...p,feet:room.entry.y},'EAST_CHAMBER');
 for(let i=1;i<trace.samples.length;i++){
  const a=trace.samples[i-1],b=trace.samples[i];
  const cardinal=Math.abs(a.x-b.x)+Math.abs(a.z-b.z)===1;
  const clear=!collides(world,(a.x+b.x)/2+.5,Math.max(a.feet,b.feet),
    (a.z+b.z)/2+.5);
  if(!cardinal||!clear)byStep.push({i,cardinal,clear});
 }
 return {ok:bad.length===0&&byStep.length===0,
  blocked:bad.slice(0,30),transitions:byStep.slice(0,30)};
}
export function planHistoricalEastGallery({seed=179,baseWorld=null,approved=false}={}){
 if(approved!==true)return Object.freeze({ok:false,reason:'EXPLICIT_NEW_WORLD_REQUIRED'});
 if(!isSeed(seed))return Object.freeze({ok:false,reason:'INVALID_SEED'});
 const base=baseWorld??new VoxelWorld(seed);
 if(base.seed!==seed||typeof base.get!=='function'||
    typeof base.legacyBlockAt!=='function'||!(base.edits instanceof Map))
  return Object.freeze({ok:false,reason:'NEED_AUTHENTIC_LEGACY_WORLD'});
 const source=eastGalleryCaveWorld(base,CAVE_CANDIDATE),floorAt=caveRoute(seed,CAVE_CANDIDATE).floorAt;
 const anchor=CAVE_CANDIDATE.length-9,cells=new Map(),conflicts=[];
 // Cover the exact old South→East cardinal transition and the complete
 // historical 7x5 chamber. All five height cells are physical voxel writes.
 // Bounded 11 by 8 plan, never scan arbitrary seed geography.
 for(let t=anchor-2;t<=anchor+8;t++)for(let d=3;d<=10;d++){
  const x=CAVE_CANDIDATE.x+t,z=CAVE_CANDIDATE.z+d,floor=floorAt(anchor);
  for(let y=floor-1;y<=floor+7;y++){
   const k=key(x,y,z);
   if(base.edits.has(k)){
    conflicts.push({key:k,reason:'EXISTING_PLAYER_EDIT'});continue;
   }
   const id=source.get(x,y,z),original=base.get(x,y,z);
   if(original===id)continue;
   const historic=base.legacyBlockAt(x,y,z);
   if(original!==historic){
    conflicts.push({key:k,reason:'EXISTING_LIVE_DISTRICT_OR_LANDMARK',original,id});
    continue;
   }
   // Only the source's exact existing numeric materials, no new IDs.
   if(![BLOCK.AIR,BLOCK.STONE].includes(id)){
    conflicts.push({key:k,reason:'SOURCE_MATERIAL_NOT_SUPPORTED',id});continue;
   }
   cells.set(k,id);
  }
 }
 const view={seed,edits:base.edits,get(x,y,z){
  return base.edits.get(key(x,y,z))??cells.get(key(x,y,z))??base.get(x,y,z);
 }};
 const sourceTrace=eastGalleryConnectionTrace(base,CAVE_CANDIDATE);
 const sourceRoom=eastGalleryChamberTrace(base,CAVE_CANDIDATE);
 const inspection=validateView(view,sourceTrace,sourceRoom);
 const exactTrace=eastGalleryTrace(base,CAVE_CANDIDATE);
 const reasons=[];
 if(!sourceTrace.walkable||!sourceRoom.walkable||!exactTrace.walkable)
  reasons.push('HISTORICAL_ORIGINAL_SOURCE_IS_NOT_WALKABLE');
 if(conflicts.length)reasons.push('EXISTING_LANDMARK_OR_EDIT_CONFLICT');
 if(!inspection.ok)reasons.push('ACTUAL_COMPOSED_EAST_WALK_IS_BLOCKED');
 if(cells.size===0)reasons.push('NO_NEW_EAST_SOURCE_CELLS');
 return Object.freeze({ok:reasons.length===0,seed,
  name:'Historic PR #147 east-facing chamber from the south gallery',
  source:EAST_GALLERY_SOURCE,footprint:Object.freeze({
   xMin:CAVE_CANDIDATE.x+anchor-2,xMax:CAVE_CANDIDATE.x+anchor+8,
   zMin:CAVE_CANDIDATE.z+3,zMax:CAVE_CANDIDATE.z+10
  }),
  cells,sourceRoute:Object.freeze(sourceTrace.samples),roomCells:sourceRoom.cells.length,
  conflicts:Object.freeze(conflicts.slice(0,30)),conflictCount:conflicts.length,
  sourceWalkable:sourceTrace.walkable&&sourceRoom.walkable&&exactTrace.walkable,
  physicalWalkable:inspection.ok,problems:Object.freeze(inspection.blocked),
  reasons:Object.freeze(reasons),runtimeConnected:false,homeScreenRegistered:false});
}
