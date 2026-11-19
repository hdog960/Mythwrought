// Cave #240: READ-ONLY original-voxel far-visibility feasibility probe.
// This is NOT a GPU renderer or permission to change src/main.mjs/depth.mjs.
// Use actual Cave World world.get + production meshDepthSection only; never
// invent rock, close corridors, change original East Gallery or save a world.
import {BLOCK,chunkCoord} from '../src/voxel.mjs';
import {sectionForY,sectionWindow,sectionChunkRadius}
 from '../src/depth.mjs';
import {meshDepthSection} from '../src/depth-mesh.mjs';

export const FAR_CAVE_PROPOSAL=Object.freeze({
 horizontalSamples:17,verticalSamples:Object.freeze([-1,0,1]),
 maxRayCells:64,maxExtraChunks:4,maxExtraGpuBytes:1024*1024,
 maxCandidateRadius:2,minimumNearSections:2,
 proposalOnly:true,productionRegistered:false
});

const key=(x,z,section)=>x+','+z+','+section;
export function traceCaveFarVisibility(world,{at,to,viewport=[844,390],config=FAR_CAVE_PROPOSAL}){
 if(!world||typeof world.get!=='function'||!at||!to||
    ![at.x,at.y,at.z,to.x,to.y,to.z].every(Number.isInteger))
  throw Error('C6_FAR_VIS_INVALID_SOURCE');
 if(!Array.isArray(viewport)||viewport.length!==2||
    !viewport.every(Number.isFinite)||viewport.some(n=>n<=0))
  throw Error('C6_FAR_VIS_INVALID_VIEWPORT');
 const active=sectionForY(at.y+.01);
 if(active===null||active>=0)throw Error('C6_FAR_VIS_NOT_UNDERGROUND');
 const nearSections=sectionWindow(at.y+.01,false);
 if(nearSections.length<config.minimumNearSections)
  throw Error('C6_FAR_VIS_INCOMPLETE_SECTIONS');
 const cx=chunkCoord(at.x),cz=chunkCoord(at.z);
 const nearKeys=new Set(nearSections.flatMap(section=>{
  const radius=sectionChunkRadius(section,active),keys=[];
  for(let dx=-radius;dx<=radius;dx++)
   for(let dz=-radius;dz<=radius;dz++)
    keys.push(key(cx+dx,cz+dz,section));
  return keys;
 }));
 const facingX=to.x-at.x,facingZ=to.z-at.z;
 if(Math.hypot(facingX,facingZ)<1)throw Error('C6_FAR_VIS_NO_CAMERA_FACING');
 const yaw=Math.atan2(facingX,facingZ);
 // The original main.mjs shader uses uTan=tan(72°/2), and uAspect=w/h.
 const halfHFov=Math.atan(viewport[0]/viewport[1]*Math.tan(72*Math.PI/360));
 const hits=[],candidates=new Map(),uncertain=[];
 for(let elevation=0;elevation<config.verticalSamples.length;elevation++){
  const y=at.y+1+config.verticalSamples[elevation];
  for(let i=0;i<config.horizontalSamples;i++){
   const theta=yaw-halfHFov+2*halfHFov*i/(config.horizontalSamples-1);
   let result=null,previous='';
   for(let step=1;step<=config.maxRayCells;step++){
    const x=Math.floor(at.x+.5+Math.sin(theta)*step);
    const z=Math.floor(at.z+.5+Math.cos(theta)*step);
    const cellKey=x+','+z;
    if(cellKey===previous)continue;previous=cellKey;
    const id=world.get(x,y,z);
    if(id===BLOCK.AIR)continue;
    const cxx=chunkCoord(x),czz=chunkCoord(z);
    const outside=!nearKeys.has(key(cxx,czz,sectionForY(y)));
    const radius=Math.max(Math.abs(cxx-cx),Math.abs(czz-cz));
    result={angleIndex:i,elevationIndex:elevation,y,step,x,z,
      block:id,chunkX:cxx,chunkZ:czz,outsideNear:outside,radius};
    if(outside){
     if(radius<=config.maxCandidateRadius&&sectionForY(y)===active &&
        (id===BLOCK.STONE||id===BLOCK.DEEPSTONE)){
      const k=key(cxx,czz,active);
      const row=candidates.get(k)||{key:k,cx:cxx,cz:czz,section:active,
       hits:0,nearestStep:Infinity,sourceX:x,sourceY:y,sourceZ:z};
      row.hits++;row.nearestStep=Math.min(row.nearestStep,step);
      candidates.set(k,row);
     }else uncertain.push({...result,reason:
       radius>config.maxCandidateRadius?'BEYOND_BOUNDED_RADIUS':
       sectionForY(y)!==active?'CROSSES_VERTICAL_SECTION':
       'NOT_REAL_ROCK'});
    }
    break;
   }
   if(result===null){
    result={angleIndex:i,elevationIndex:elevation,y,step:null,
     block:null,outsideNear:true,reason:'NO_ROCK_WITHIN_BOUNDED_RAY'};
    uncertain.push(result);
   }
   hits.push(result);
  }
 }
 const sorted=[...candidates.values()].sort((a,b)=>
  b.hits-a.hits||a.nearestStep-b.nearestStep||
  a.cz-b.cz||a.cx-b.cx);
 const selection=[],skipped=[];
 let totalBytes=0,totalVertices=0;
 for(const item of sorted){
  // Compute genuine production world section meshes on the diagnostic side.
  // This is CPU-only and cannot allocate or show any GPU buffer.
  const bytes=meshDepthSection(world,item.cx,item.cz,item.section).byteLength;
  const verts=bytes/36;
  const enriched={...item,actualMeshBytes:bytes,actualVertices:verts};
  if(bytes===0){skipped.push({...enriched,reason:'NO_VISIBLE_SOURCE_FACES'});continue;}
  if(selection.length>=config.maxExtraChunks||
     bytes>config.maxExtraGpuBytes-totalBytes){
   skipped.push({...enriched,reason:'BOUNDED_GPU_PROPOSAL_CAP'});continue;
  }
  totalBytes+=bytes;totalVertices+=verts;selection.push(enriched);
 }
 const targetKeys=new Set(selection.map(x=>x.key));
 const uncovered=hits.filter(hit=>hit.outsideNear&&hit.block!==null&&
   !targetKeys.has(key(hit.chunkX,hit.chunkZ,active)));
 const result={
  source:{at:{...at},to:{...to},viewport:[...viewport]},
  activeSection:active,nearSections,nearResident:nearKeys.size,
  horizontalHFovDegrees:2*halfHFov*180/Math.PI,
  rayBudget:config.horizontalSamples*config.verticalSamples.length*
   config.maxRayCells,realSourceRayCount:hits.length,
  alreadyOccluded:hits.filter(x=>!x.outsideNear).length,
  farFirstRock:hits.filter(x=>x.outsideNear&&x.block!==null).length,
  unboundedRayCount:hits.filter(x=>x.block===null).length,
  candidatesFound:sorted.length,selected:selection,skipped,
  selectedExtraGpuBytes:totalBytes,selectedExtraVertices:totalVertices,
  totalResidentProposal:nearKeys.size+selection.length,
  uncoveredFarRays:uncovered.length,uncertainCount:uncertain.length,
  limits:{...config,verticalSamples:[...config.verticalSamples]},
  // A pass means only that this read-only candidate selection is bounded.
  // It NEVER means the actual renderer works or the scene looks enclosed.
  bounded:selection.length<=config.maxExtraChunks&&
    totalBytes<=config.maxExtraGpuBytes,
  rendersAnything:false,visualAcceptance:false
 };
 return Object.freeze(result);
}
