// Local acceptance only: immutable planned gallery AIR, not a saved or
// admitted construction. Use original M7 source and original owned layers.
import {createPeakGalleryProjection} from './peak-gallery-acceptance-renderer.mjs';
import {meshReadOnlySharedBatch} from './shared-native-mesh-snapshot.mjs';
import {BLOCK,collides,chunkCoord} from '../voxel.mjs';
import {sectionForY} from '../depth.mjs';
import {compactUpperHubResearchAirAt} from './compact-upper-hub-research.mjs';
import {sectionBounds} from '../depth.mjs';
import {engineWantedSections,actualGallerySectionCosts} from './gallery-streaming-working-set.mjs';
import {VoxelWorld,baseBlock} from '../voxel.mjs';
import {isCandidateGeologyMaterial} from './protected-entrance-envelope.mjs';
const xyz=k=>k.split(',').map(Number);
const key=(x,y,z)=>x+','+y+','+z;
export function createLocalGalleryGameWitness(){
 const p=createPeakGalleryProjection(),{original,projection,cuts}=p;
 let sourceScope=null;
 // Existing environmental scenery plans against the natural reader; make
 // projected AIR visible to it, not just to the terrain get/collision path.
 const generated=original.naturalAndLandmarkBlock.bind(original);
 Object.defineProperty(projection,'naturalAndLandmarkBlock',{value(x,y,z){
  if(sourceScope){if(++sourceScope.direct>40000)throw Error('GALLERY_DIRECT_READ_LIMIT');}
  return cuts.has(key(x,y,z))?BLOCK.AIR:generated(x,y,z);
 }});
 const eligible=[...cuts].map(xyz).filter(([x,y,z])=>
  chunkCoord(x)===-40&&chunkCoord(z)===-135&&sectionForY(y)===-3&&
  projection.get(x,y-1,z)!==BLOCK.AIR&&
  !collides(projection,x+.5,y+.01,z+.5));
 if(!eligible.length)throw Error('NO_SAFE_PEAK_GALLERY_CAMERA');
 const camera=eligible[Math.floor(eligible.length/2)];
 const nearby=[...cuts].map(xyz).filter(([x,y,z])=>
  sectionForY(y)===-3&&Math.hypot(x-camera[0],z-camera[2])<=20&&
  Math.hypot(x-camera[0],z-camera[2])>=4&&
  projection.get(x,y-1,z)!==BLOCK.AIR);
 return {...p,camera,nearby,
  build(world,keys,compose){
   if(sourceScope)throw Error('NESTED_MESH_TRANSACTION');
   sourceScope={direct:0};
   try{
    const batch=meshReadOnlySharedBatch(world,keys);
    if(!batch.ok)throw Error(batch.reason);
    const rows=batch.meshes.map(m=>compose(m));
    const direct=sourceScope.direct;
    if(batch.calls+direct>40000)throw Error('GALLERY_COMBINED_SOURCE_READ_LIMIT');
    return {rows,reads:batch.calls,direct,hits:batch.hits,sourceCalls:batch.calls+direct};
   }finally{sourceScope=null;}
  },
  verifySave(){return JSON.stringify(original.save())===p.initial;}
 };
}
// One finite real-owner diagnostic of the unmodified future network mask.
// Not permission to cut: every requested solid cell is checked, including
// retained gallery support. A rejected cell invalidates full combined
// admission; we never silently use the safe subset as an approved overlay.
export function auditPeakFutureNetworkOverlap(p){
 const {original,cuts,floors}=p,legacy=new VoxelWorld(original.seed);
 const owners=engineWantedSections(-40,-135,-3),future=new Set(cuts);
 let requests=0,newCuts=0,retainedFloorConflicts=0,authoredSolid=0,landmark=0,oreOrUnsafe=0,edits=0,checked=0;
 const examples=[];
 for(const k of owners){
  const [cx,cz,s=0]=xyz(k),b=sectionBounds(s);
  for(let y=b.minY;y<=b.maxY;y++)for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++){
   checked++;
   if(!compactUpperHubResearchAirAt(original.seed,x,y,z))continue;
   const id=original.get(x,y,z),c=key(x,y,z);
   if(id===BLOCK.AIR)continue;
   requests++;
   if(cuts.has(c))continue;
   newCuts++;
   let reason=null;
   if(floors.has(c)){retainedFloorConflicts++;reason='RETAINED_GALLERY_FLOOR';}
   else if(original.edits.has(c)){edits++;reason='PLAYER_EDIT';}
   else if(original.environmentCaves.get(x,y,z)!==undefined){authoredSolid++;reason='AUTHORED_SOURCE';}
   else if(legacy.naturalAndLandmarkBlock(x,y,z)!==baseBlock(x,y,z,original.seed)){landmark++;reason='LANDMARK';}
   else if(!isCandidateGeologyMaterial(id)){oreOrUnsafe++;reason='ORE_OR_UNSAFE';}
   if(reason&&examples.length<8)examples.push({x,y,z,reason,id});
   future.add(c);
  }
 }
 const rejected=retainedFloorConflicts+authoredSolid+landmark+oreOrUnsafe+edits;
 return {owners:owners.length,checked,requests,newCuts,retainedFloorConflicts,authoredSolid,landmark,oreOrUnsafe,edits,rejected,examples,
  fullFutureMaskSourceSafe:rejected===0,constructionAdmission:false,worldWrites:0};
}
