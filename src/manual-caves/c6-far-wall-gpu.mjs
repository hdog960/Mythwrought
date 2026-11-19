// Cave C6 opt-in far-wall renderer. No save keys, source voxel edits, or
// global chunk changes. Uses actual authored world.get and production rock
// mesher. Only active in explicit opt-in Cave World below the surface.
// Near chunks retain absolute scheduling priority and their 27/18 budgets.
import {BLOCK,chunkCoord} from '../voxel.mjs';
import {sectionForY,sectionWindow,sectionChunkRadius,depthMeshKey}
 from '../depth.mjs';
import {meshDepthSection} from '../depth-mesh.mjs';
import {uploadChunkBuffer} from '../gpu-recovery.mjs';

export const C6_FAR_BOUNDS=Object.freeze({
 maxChunks:4,maxBytes:1048576,maxRing:2,maxCells:64,
 horizontalRays:17,verticalOffsets:Object.freeze([-1,0,1]),
 minFramesBetweenPlans:24,maxSourceSamples:3264
});
const key=(x,z,s)=>depthMeshKey(x,z,s);
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const angleDelta=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));

export function planCaveFarWallSources(world,player,viewport,
 {bounds=C6_FAR_BOUNDS,nearKeys=null}={}){
 if(!world||typeof world.get!=='function'||!player||
  ![player.x,player.z,player.feet,player.yaw,player.pitch].every(Number.isFinite))
  throw Error('C6_FAR_BAD_CAMERA');
 const section=sectionForY(player.feet);
 if(section===null||section>=0)return {section:null,selected:[],pending:[],
  uncovered:0,firstFarRock:0,samples:0,estimatedBytes:0};
 const cx=chunkCoord(player.x),cz=chunkCoord(player.z);
 const visible=sectionWindow(player.feet,false);
 const near=nearKeys||new Set(visible.flatMap(s=>{
  const radius=sectionChunkRadius(s,visible[0]),keys=[];
  for(let dx=-radius;dx<=radius;dx++)
   for(let dz=-radius;dz<=radius;dz++)keys.push(key(cx+dx,cz+dz,s));
  return keys;
 }));
 const aspect=viewport[0]/viewport[1];
 if(!Number.isFinite(aspect)||aspect<=0)throw Error('C6_FAR_BAD_ASPECT');
 const half=Math.atan(aspect*Math.tan(72*Math.PI/360));
 const candidates=new Map();
 const yaw=player.yaw,pitch=clamp(player.pitch,-0.85,0.85);
 let uncovered=0,firstFarRock=0,samples=0;
 for(const height of bounds.verticalOffsets)
  for(let i=0;i<bounds.horizontalRays;i++){
   const theta=yaw-half+i*2*half/(bounds.horizontalRays-1);
   const dx=Math.sin(theta),dz=Math.cos(theta);
   let prev='',found=false;
   for(let t=1;t<=bounds.maxCells;t++){
    const x=Math.floor(player.x+dx*t),z=Math.floor(player.z+dz*t);
    const y=Math.floor(player.feet+1.55+height+t*Math.tan(pitch));
    const pos=x+','+y+','+z;
    if(pos===prev)continue;prev=pos;
    if(++samples>bounds.maxSourceSamples)break;
    const id=world.get(x,y,z);
    if(id===BLOCK.AIR)continue;
    found=true;
    const sx=chunkCoord(x),sz=chunkCoord(z);
    const actualSection=sectionForY(y);
    const k=actualSection===null?null:key(sx,sz,actualSection);
    if(k&&!near.has(k)){
     firstFarRock++;
     const radius=Math.max(Math.abs(sx-cx),Math.abs(sz-cz));
     if(radius<=bounds.maxRing&&actualSection===section &&
        (id===BLOCK.STONE||id===BLOCK.DEEPSTONE)){
      const old=candidates.get(k)||{key:k,cx:sx,cz:sz,section,
       hits:0,nearest:t,source:[x,y,z]};
      old.hits++;old.nearest=Math.min(old.nearest,t);
      candidates.set(k,old);
     }else uncovered++;
    }
    break;
   }
   if(!found)uncovered++;
  }
 const ranked=[...candidates.values()].sort((a,b)=>
  b.hits-a.hits||a.nearest-b.nearest||a.cz-b.cz||a.cx-b.cx);
 return {section,selected:ranked.slice(0,bounds.maxChunks),
  pending:ranked.slice(bounds.maxChunks),uncovered,firstFarRock,
  samples,estimatedBytes:0,nearExpected:near.size,
  viewport:[...viewport]};
}

export function createCaveFarWallGpu(gl,{bounds=C6_FAR_BOUNDS}={}){
 if(!gl||typeof gl.createBuffer!=='function')throw Error('C6_FAR_NO_WEBGL');
 const buffers=new Map(),wanted=new Map();
 let worldRef=null,nearCenter='',planPos=null,lastPlanFrame=-Infinity;
 let bytes=0,uploads=0,failures=0,uncovered=0,farRock=0,sourceSamples=0;
 let lastMeshMs=0,budgetExcluded=0;
 function invalidate(){
  for(const c of buffers.values())if(c.buffer)gl.deleteBuffer(c.buffer);
  buffers.clear();wanted.clear();bytes=0;nearCenter='';planPos=null;
  lastPlanFrame=-Infinity;uncovered=farRock=sourceSamples=budgetExcluded=0;
 }
 function resetForLostContext(){
  // WebGL objects are invalid already; do not call WebGL during a loss.
  buffers.clear();wanted.clear();bytes=0;nearCenter='';planPos=null;
  lastPlanFrame=-Infinity;uncovered=farRock=sourceSamples=budgetExcluded=0;
 }
 function step({world,player,nearChunks,nearPending,frame,viewport,enabled}){
  if(!enabled||!world||!player||!viewport||player.feet>=-3){
   if(buffers.size||wanted.size||worldRef)invalidate();
   worldRef=world;return stats();
  }
  if(worldRef!==world){invalidate();worldRef=world;}
  const sections=sectionWindow(player.feet,false),active=sections[0];
  if(active===null||active>=0){invalidate();return stats();}
  const cx=chunkCoord(player.x),cz=chunkCoord(player.z);
  const center=cx+','+cz+'|'+sections.join(',');
  if(center!==nearCenter){invalidate();nearCenter=center;}
  const required=sections.reduce((n,s)=>n+(2*sectionChunkRadius(s,active)+1)**2,0);
  if(nearPending.size!==0||nearChunks.size!==required)return stats();
  if(frame-lastPlanFrame>=bounds.minFramesBetweenPlans){
   const nowPos={x:player.x,z:player.z,y:player.feet,yaw:player.yaw,
    pitch:player.pitch,aspect:viewport[0]/viewport[1]};
   const changed=!planPos||
    Math.hypot(nowPos.x-planPos.x,nowPos.z-planPos.z)>2||
    Math.abs(nowPos.y-planPos.y)>1||
    Math.abs(angleDelta(nowPos.yaw,planPos.yaw))>.16||
    Math.abs(nowPos.pitch-planPos.pitch)>.16||
    Math.abs(nowPos.aspect-planPos.aspect)>.03;
   if(changed){
    const plan=planCaveFarWallSources(world,player,viewport,{bounds});
    const newWanted=new Map(plan.selected.map(c=>[c.key,c]));
    // No stale visible far surfaces from a previous sightline.
    for(const [k,c] of buffers)if(!newWanted.has(k)){
     gl.deleteBuffer(c.buffer);buffers.delete(k);bytes-=c.bytes;
    }
    wanted.clear();for(const [k,c] of newWanted)wanted.set(k,c);
    uncovered=plan.uncovered+plan.pending.length;
    farRock=plan.firstFarRock;sourceSamples=plan.samples;
    planPos=nowPos;lastPlanFrame=frame;
   }
  }
  // One actual GPU upload per eligible frame, never ahead of near geometry.
  if(bytes<bounds.maxBytes&&buffers.size<bounds.maxChunks){
   for(const [k,c] of wanted){
    if(buffers.has(k))continue;
    const started=performance.now();
    let data=null;
    try{
     data=meshDepthSection(world,c.cx,c.cz,c.section);
     const size=data.byteLength;
     if(size===0){wanted.delete(k);break;}
     if(size>bounds.maxBytes-bytes){budgetExcluded++;wanted.delete(k);break;}
     const buffer=uploadChunkBuffer(gl,data);
     buffers.set(k,{...c,buffer,bytes:size,count:data.length/9});
     bytes+=size;uploads++;lastMeshMs=performance.now()-started;
    }catch(error){
     failures++;wanted.delete(k);
    }
    break;
   }
  }
  return stats();
 }
 function draw({atPos,atColor,atUv,atMat}){
  let drawn=0;
  for(const c of buffers.values()){
   gl.bindBuffer(gl.ARRAY_BUFFER,c.buffer);
   gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);
   gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);
   gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);
   gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);
   gl.drawArrays(gl.TRIANGLES,0,c.count);
   drawn+=c.count;
  }
  return drawn;
 }
 function stats(){
  return {chunks:buffers.size,bytes,pending:[...wanted.keys()].filter(k=>!buffers.has(k)).length,
   uploads,failures,uncovered,farRock,sourceSamples,budgetExcluded,lastMeshMs,
   vertices:[...buffers.values()].reduce((n,c)=>n+c.count,0),
   maxChunks:bounds.maxChunks,maxBytes:bounds.maxBytes};
 }
 return Object.freeze({step,draw,invalidate,resetForLostContext,stats});
}
