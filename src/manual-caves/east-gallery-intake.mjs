// Mythwrought C3 PR #147 exact authored East gallery + its South connection.
// Never overwrite an older cave / district. If a raised East floor would
// block already-live South Gallery headroom, replicate the SAME original
// source-authored physical shape at an explicitly safe alternate site in
// NEW opt-in cave world only. No main changes, saves, or arbitrary world edits.
import {VoxelWorld,BLOCK,worldKey,collides,terrainHeight,WORLD_MIN_Y,WORLD_MAX_Y} from '../voxel.mjs';
import {CAVE_CANDIDATE,caveRoute} from '../experimental-cave-route.mjs';
import {eastGalleryCaveWorld,eastGalleryTrace,eastGalleryChamberTrace,
  eastGalleryConnectionTrace} from '../east-gallery-cave.mjs';
export const EAST_GALLERY_SOURCE='original-historical-pr147';
export const EAST_SITE_OFFSETS=Object.freeze([[0,0],[320,0],[-448,128],[0,-448],[448,-384]]);
const validSeed=x=>Number.isSafeInteger(x)&&x===(x|0);
const key=(x,y,z)=>worldKey(x,y,z);
function site(offset){
 return Object.freeze({x:CAVE_CANDIDATE.x+offset[0],
   z:CAVE_CANDIDATE.z+offset[1],
   length:CAVE_CANDIDATE.length,width:CAVE_CANDIDATE.width});
}
function actualTraversal(world,trace,room){
 const faults=[],transitions=[];
 for(const p of [...trace.samples,...room.cells.map(p=>({...p,feet:room.entry.y}))]){
  const floor=p.feet-1;
  const supported=world.get(p.x,floor,p.z)!==BLOCK.AIR;
  const headroom=world.get(p.x,p.feet,p.z)===BLOCK.AIR&&
    world.get(p.x,p.feet+1,p.z)===BLOCK.AIR;
  const body=!collides(world,p.x+.5,p.feet,p.z+.5);
  if(!supported||!headroom||!body)
    faults.push({x:p.x,z:p.z,feet:p.feet,supported,headroom,body});
 }
 for(let i=1;i<trace.samples.length;i++){
  const p=trace.samples[i-1],q=trace.samples[i];
  if(Math.abs(p.x-q.x)+Math.abs(p.z-q.z)!==1||
     !collides(world,(p.x+q.x)/2+.5,Math.max(p.feet,q.feet),(p.z+q.z)/2+.5)===false)
    transitions.push(i);
 }
 return {ok:faults.length===0&&transitions.length===0,
   faults:faults.slice(0,20),transitions};
}
function attempt(base,origin){
 const seed=base.seed,reader=eastGalleryCaveWorld(base,origin),
   floorAt=caveRoute(seed,origin).floorAt;
 const cells=new Map(),conflicts=[];
 // Include the historical north approach, full south aisle and original
 // 7x5 East room, not just a disconnected hollow cube. A bounded source
 // footprint; no unrelated surface district can be silently rewritten.
 for(let t=0;t<=origin.length+8;t++){
  const x=origin.x+t,floor=floorAt(Math.min(origin.length,t));
  for(let d=-4;d<=12;d++){
   const z=origin.z+d;
   const top=Math.min(WORLD_MAX_Y,Math.max(floor+7,terrainHeight(x,z,seed)+2));
   for(let y=Math.max(WORLD_MIN_Y,floor-2);y<=top;y++){
    const k=key(x,y,z);
    // Inspect the original save's occupied cell BEFORE the old source
    // reader applies edit precedence. Otherwise source.get() == base.get()
    // hides the edit and incorrectly approves building through its voxel.
    if(base.edits.has(k)){
     conflicts.push({key:k,reason:'PLAYER_EDIT'});continue;
    }
    const original=base.get(x,y,z),id=reader.get(x,y,z);
    if(original===id)continue;
    // The previously failing original seed had AIR of a real South tunnel
    // directly where PR #147 wanted a higher STONE floor. This is an
    // authored headroom collision, not permission to overwrite old terrain.
    if(original!==base.legacyBlockAt(x,y,z)){
     conflicts.push({key:k,reason:'PREEXISTING_LIVE_CAVE_OR_LANDMARK',
       original,id});continue;
    }
    if(id!==BLOCK.AIR&&id!==BLOCK.STONE){
     conflicts.push({key:k,reason:'UNSUPPORTED_SOURCE_MATERIAL',id});continue;
    }
    cells.set(k,id);
   }
  }
 }
 const view={seed,edits:base.edits,get(x,y,z){
  const k=key(x,y,z);
  return base.edits.get(k)??cells.get(k)??base.get(x,y,z);
 }};
 const trace=eastGalleryConnectionTrace(base,origin);
 const room=eastGalleryChamberTrace(base,origin);
 const core=eastGalleryTrace(base,origin);
 const walk=actualTraversal(view,trace,room);
 const errors=[];
 if(!core.walkable||!trace.walkable||!room.walkable)
  errors.push('SOURCE_IS_NOT_PHYSICALLY_WALKABLE');
 if(conflicts.length)errors.push('EXISTING_SOURCE_LANDMARK_OR_PLAYER_EDIT_CONFLICT');
 if(!walk.ok)errors.push('COMPOSED_EAST_PATH_PHYSICALLY_BLOCKED');
 if(cells.size<100)errors.push('ORIGINAL_SOURCE_GEOMETRY_NOT_REPRESENTED');
 return Object.freeze({ok:errors.length===0,origin,cells,errors,
  conflicts:Object.freeze(conflicts.slice(0,16)),conflictCount:conflicts.length,
  actualPath:walk,route:trace.samples,roomCount:room.cells.length,
  sourceWalkable:core.walkable&&trace.walkable&&room.walkable});
}
export function planHistoricalEastGallery({seed=179,baseWorld=null,approved=false}={}){
 if(approved!==true)return Object.freeze({ok:false,reason:'EXPLICIT_NEW_WORLD_REQUIRED'});
 if(!validSeed(seed))return Object.freeze({ok:false,reason:'INVALID_SEED'});
 const base=baseWorld??new VoxelWorld(seed);
 if(base.seed!==seed||typeof base.get!=='function'||
    typeof base.legacyBlockAt!=='function'||!(base.edits instanceof Map))
  return Object.freeze({ok:false,reason:'AUTHENTIC_WORLD_REQUIRED'});
 const rejected=[];
 for(let i=0;i<EAST_SITE_OFFSETS.length;i++){
  const origin=site(EAST_SITE_OFFSETS[i]),plan=attempt(base,origin);
  if(!plan.ok){
   rejected.push({origin,errors:plan.errors,conflictCount:plan.conflictCount,
     examples:plan.conflicts.slice(0,3),badWalk:plan.actualPath.faults.slice(0,3)});
   continue;
  }
  return Object.freeze({ok:true,seed,source:EAST_GALLERY_SOURCE,
   origin,relocated:i>0,attempts:i+1,
   earlierBlockedSites:Object.freeze(rejected),cells:plan.cells,
   sourceRoute:Object.freeze(plan.route),roomCells:plan.roomCount,
   physicalWalkable:plan.actualPath.ok,sourceWalkable:plan.sourceWalkable,
   homeScreenRegistered:false,runtimeConnected:false});
 }
 return Object.freeze({ok:false,reason:'NO_SAFE_HISTORICAL_EAST_AND_SOUTH_SITE',
  seed,source:EAST_GALLERY_SOURCE,rejected:Object.freeze(rejected),
  homeScreenRegistered:false,runtimeConnected:false});
}
