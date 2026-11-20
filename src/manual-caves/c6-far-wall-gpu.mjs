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
 maxChunks:4,maxBytes:1048576,maxRing:2,maxCells:64,maxSeamSources:1,
  maxWideWitnessSources:1,
 horizontalRays:17,verticalOffsets:Object.freeze([0,.35,.51,.69,.88,-.35,-.7]),
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
 // Match the exact original WebGL perspective rays, not independent
 // yaw/pitch angles. The old lattice missed genuine upper-section roof
 // rock (Fan visible pixel x408,y78 intersects missing 12,10,-7).
 // Preserve the same source sample, two-ring and four-GPU-slot limits.
 const tanVertical=Math.tan(72*Math.PI/360);
 const candidates=new Map();
 const yaw=player.yaw,pitch=clamp(player.pitch,-0.85,0.85);
 const cp=Math.cos(pitch),sp=Math.sin(pitch),cy=Math.cos(yaw),sy=Math.sin(yaw);
 const forward=[sy*cp,sp,cy*cp],right=[-cy,0,sy],
  up=[-sp*sy,cp,-sp*cy];
 let uncovered=0,firstFarRock=0,samples=0;
 // Reuse the exact production perspective ray for both the original
 // coarse ranking and later source-only midpoint coverage witness.
 const sampleRay=(screenX,screenY,target)=>{
   const factorX=screenX*aspect*tanVertical,factorY=screenY*tanVertical;
   const rawX=forward[0]+right[0]*factorX+up[0]*factorY;
   const rawY=forward[1]+right[1]*factorX+up[1]*factorY;
   const rawZ=forward[2]+right[2]*factorX+up[2]*factorY;
   const inverse=1/Math.hypot(rawX,rawY,rawZ);
   const dx=rawX*inverse,dy=rawY*inverse,dz=rawZ*inverse;
   let prev='',found=false;
   for(let t=1;t<=bounds.maxCells;t++){
    const x=Math.floor(player.x+dx*t),z=Math.floor(player.z+dz*t);
    const y=Math.floor(player.feet+1.55+dy*t);
    const pos=x+','+y+','+z;
    if(pos===prev)continue;prev=pos;
    // Enforce the original strict CPU ceiling across ALL rays, including
    // rays that arrive after the budget is exhausted (no off-by-one counts).
    if(samples>=bounds.maxSourceSamples)break;
    samples++;
    const id=world.get(x,y,z);
    if(id===BLOCK.AIR)continue;
    found=true;
    const sx=chunkCoord(x),sz=chunkCoord(z);
    const actualSection=sectionForY(y);
    const k=actualSection===null?null:key(sx,sz,actualSection);
    if(k&&!near.has(k)){
     firstFarRock++;
     const radius=Math.max(Math.abs(sx-cx),Math.abs(sz-cz));
     if(radius<=bounds.maxRing&&visible.includes(actualSection) &&
        (id===BLOCK.STONE||id===BLOCK.DEEPSTONE)){
      const old=target.get(k)||{key:k,cx:sx,cz:sz,section:actualSection,
       hits:0,roofHits:0,nearest:t,source:[x,y,z]};
      old.hits++;
      // Screenshot-proven Fan sky pixels at y108-118 hit genuine roof
      // x209..215/y-115 in 13,10,-7 at normalized height ~.51.
      // Prior .35/.69-only rays missed that band even with a free GPU slot;
      // rank real upper-section surface voxels above distant lower walls.
      if(screenY>=.48&&actualSection>section)old.roofHits++;
      old.nearest=Math.min(old.nearest,t);
      target.set(k,old);
     }else uncovered++;
    }
    break;
   }
   if(!found)uncovered++;
 };
 for(const screenY of bounds.verticalOffsets)
  for(let i=0;i<bounds.horizontalRays;i++)
   sampleRay(-1+2*i/(bounds.horizontalRays-1),screenY,candidates);
 const ranked=[...candidates.values()].sort((a,b)=>
  b.roofHits-a.roofHits||b.hits-a.hits||
  a.nearest-b.nearest||a.cz-b.cz||a.cx-b.cx);
 // Two neighboring vertical sections in the SAME real source x/z
 // column may share ONE far GPU buffer. This is not a fifth draw slot
 // or fabricated rock. At most one real source section may be joined.
 const selected=ranked.slice(0,bounds.maxChunks).map(c=>({...c}));
 // Genuine Rift screenshot pixel x206,y135 projects to normalized ray
 // x=-.666,y=.3375. Both the original -0.75/-0.625 rays and half-step
 // -0.6875 miss its x176,-83,192 DEEPSTONE source boundary. At y=.35
 // the third-step ray first hits x175,-83,192 near rock and stops; the
 // genuine image ray y=.3375 first intersects the MISSING far section.
 // Sample at that physical screen band as a genuine source witness,
 // only as companion sources; never displace four coarse-priority
 // GPU buffers or increase the SAME maxSourceSamples=3264 CPU budget.
 const midpoints=new Map();
 for(let i=0;i<bounds.horizontalRays-1;i++)
  for(const fraction of [1/3,2/3])
   sampleRay(-1+2*(i+fraction)/(bounds.horizontalRays-1),.3375,midpoints);
 const available=new Map(ranked.slice(bounds.maxChunks).map(c=>[c.key,c]));
 for(const [k,c] of midpoints)
  if(!candidates.has(k)&&!available.has(k))available.set(k,c);
 // Authentic 844x390 Fan screenshots expose a real first-solid wall at
 // x225,-116,155 (14,9,-8), outside all four original buffer choices.
 // The wider original camera aspect reveals these far-left rays. Sample
 // FIVE exact perspective rays inside the existing 3264-source-cell CPU cap;
 // never invent rock, extend the ring or change the sky-pixel acceptance.
 const edgeWitness=new Map();
 if(aspect>=1.45 && selected.length===bounds.maxChunks)
  for(const [screenX,screenY] of [
   [-.98,.52],[-.98,.49],[-.96,.46],[-.94,.43],[-.87,.40]
  ])sampleRay(screenX,screenY,edgeWitness);
 for(const [k,c] of edgeWitness)
  if(!candidates.has(k)&&!available.has(k))available.set(k,c);
 // When two of the four chosen sources are real adjacent vertical sections
 // in one x/z column, pack them together in the SAME original GPU buffer.
 // Reuse the freed fourth slot for the unrendered first-solid edge rock.
 // Keep the existing maximum ONE joined and ONE seam slice; all original
 // near priority, 4 buffers, 1MiB and complete-source requirements remain.
 let compactedKey=null;
 const edge=[...edgeWitness.values()].sort((a,b)=>
  b.hits-a.hits||a.nearest-b.nearest).find(c=>c.section===section&&
   c.hits>=2&&available.has(c.key)&&!selected.some(s=>s.key===c.key));
 const upper=edge&&selected.find(c=>c.section===section+1&&
  selected.some(lower=>lower.cx===c.cx&&lower.cz===c.cz&&lower.section===section));
 const lower=upper&&selected.find(c=>c.cx===upper.cx&&c.cz===upper.cz&&
  c.section===section);
 if(edge&&upper&&lower){
  upper.companion={...lower};
  compactedKey=lower.key;
  selected.splice(selected.indexOf(lower),1);
  selected.push({...edge});
  available.delete(edge.key);
 }
 // RC7's genuine 844x390 original-game screenshot removed 1809/2138 sky
 // pixels, then isolated a remaining 329px upper-right opening. Pixels
 // x562..582/y139..144 first hit DEEPSTONE x182,-116,168..170 in source
 // slice 11,10,-8. Reuse that physical screenshot ray rather than fabricate
 // rock or widen the CPU/ring/GPU budgets. These four rays consume at most
 // the remaining 3264 source-cell CPU allowance.
 const rightEdgeWitness=new Map();
 if(compactedKey&&aspect>=1.45&&bounds.maxSeamSources>0){
  for(const [screenX,screenY] of [
   [.518519,.313433],[.574074,.313433],[.592593,.343284],
   [.462963,.283582]
  ])sampleRay(screenX,screenY,rightEdgeWitness);
  for(const [k,c] of rightEdgeWitness)
   if(!selected.some(s=>s.key===k)&&!available.has(k))
    available.set(k,c);
 }
 // Genuine original-game 844x390 Rift Terraces screenshot: exactly 15
 // remaining bright pixels, x284..291/y139..142, first intersect real
 // DEEPSTONE at x176,-83,192, section 11,12,-5. At the 540x335
 // inner WebGL viewport that is about (-.49,.33) in perspective NDC.
 // The ordinary coarse camera rays can hit different near rock before
 // the far boundary and omit it. These are source-true first-solid
 // witnesses, capped by the ORIGINAL 3264 world.get source samples.
 // Limit this supplemental witness to wide deep -6 views: the accepted
 // narrow Rift and deep Fan source rankings must remain unchanged.
 const riftWideWitness=new Map();
 if(section===-6&&aspect>=1.45&&selected.length===bounds.maxChunks){
  for(const [screenX,screenY] of [
    [-.493,.331],[-.489,.337],[-.487,.331],[-.498,.338]
  ])sampleRay(screenX,screenY,riftWideWitness);
  for(const [k,c] of riftWideWitness)
   if(!candidates.has(k)&&!available.has(k)&&
      !selected.some(x=>x.key===k))available.set(k,c);
 }
 const joinable=[...available.values()].map(companion=>({
  companion,owner:selected.find(c=>!c.companion&&c.cx===companion.cx&&
   c.cz===companion.cz&&Math.abs(c.section-companion.section)===1)
 })).filter(c=>c.owner);
 // An upper-section exposed roof takes priority over a lower wall when
 // both are from genuine first-solid physical rays. The 708-pixel Fan
 // source still retains its original mandatory lower-section companion.
 joinable.sort((a,b)=>
  Number(b.companion.section>section)-Number(a.companion.section>section)||
  b.companion.hits-a.companion.hits||
  a.companion.nearest-b.companion.nearest);
 // Preserve the original coarse/midpoint-certified source when an
 // additional wide Rift pixel witness arrives. Otherwise its higher hit
 // count can displace the previously genuine 11,11,-5 upper rock and
 // merely MOVE the 844-pixel sky hole to another real seam.
 // The new screenshot-certified rock uses the already allowed seam slot.
 const preexistingJoin=joinable.find(j=>
  candidates.has(j.companion.key)||midpoints.has(j.companion.key));
 const selectedJoin=compactedKey?null:
  (riftWideWitness.size?(preexistingJoin??joinable[0]):joinable[0]);
 if(selectedJoin)selectedJoin.owner.companion={...selectedJoin.companion};
 const joinedSources=compactedKey||selectedJoin?1:0;
 const companionKey=compactedKey??selectedJoin?.companion.key;
 // Original Rift screenshot pixel x145..152/y134..135 first intersects
 // x174,-84,187 DEEPSTONE: real lower chunk 10,11,-6. The existing
 // primary seam 11,12,-5 must remain. Independently sample ONE additional
 // neighbor from the same real coarse camera rays, in another GPU owner.
 // Two independent genuine 844px Fan sky gaps require TWO real lower
 // source slices: original middle 12,10,-8 (RC7) and western 11,10,-8
 // (RC8). Keep the original one-seam ranking and dedicate ONE explicitly
 // bounded wide witness to the newly proven western rock in another
 // existing buffer. No new GPU slot, higher byte cap, CPU cap, or voxels.
 const secondary=joinable.find(j=>j.owner!==selectedJoin?.owner&&
  j.companion.key!==companionKey&&
  (candidates.has(j.companion.key)||riftWideWitness.has(j.companion.key)));
 if(secondary&&bounds.maxSeamSources>0)
  secondary.owner.seamCompanion={...secondary.companion};
 const seamKey=secondary&&bounds.maxSeamSources>0?secondary.companion.key:null;
 const seamSources=seamKey?1:0;
 const wideWitness=compactedKey&&bounds.maxWideWitnessSources>0?
  joinable.find(j=>rightEdgeWitness.has(j.companion.key)&&
   j.companion.key!==companionKey&&j.companion.key!==seamKey&&
   j.owner!==secondary?.owner&&j.owner!==selectedJoin?.owner&&
   !j.owner.companion&&!j.owner.seamCompanion):null;
 if(wideWitness)wideWitness.owner.wideWitnessCompanion={...wideWitness.companion};
 const wideWitnessKey=wideWitness?.companion.key;
 const wideWitnessSources=wideWitnessKey?1:0;
 return {section,selected,
  pending:[...available.values()].filter(c=>c.key!==companionKey&&
    c.key!==seamKey&&c.key!==wideWitnessKey),
  joinedSources,seamSources,wideWitnessSources,uncovered,firstFarRock,
  samples,estimatedBytes:0,nearExpected:near.size,
  viewport:[...viewport]};
}

export function createCaveFarWallGpu(gl,{bounds=C6_FAR_BOUNDS}={}){
 if(!gl||typeof gl.createBuffer!=='function')throw Error('C6_FAR_NO_WEBGL');
 const buffers=new Map(),wanted=new Map();
 let worldRef=null,nearCenter='',planPos=null,lastPlanFrame=-Infinity;
 let bytes=0,uploads=0,failures=0,uncovered=0,farRock=0,sourceSamples=0,
      joinedSources=0,seamSources=0,wideWitnessSources=0;
 let lastMeshMs=0,budgetExcluded=0;
 function invalidate(){
  for(const c of buffers.values())if(c.buffer)gl.deleteBuffer(c.buffer);
  buffers.clear();wanted.clear();bytes=0;nearCenter='';planPos=null;
  lastPlanFrame=-Infinity;uncovered=farRock=sourceSamples=budgetExcluded=joinedSources=seamSources=wideWitnessSources=0;
 }
 function resetForLostContext(){
  // WebGL objects are invalid already; do not call WebGL during a loss.
  buffers.clear();wanted.clear();bytes=0;nearCenter='';planPos=null;
  lastPlanFrame=-Infinity;uncovered=farRock=sourceSamples=budgetExcluded=joinedSources=seamSources=wideWitnessSources=0;
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
    joinedSources=plan.joinedSources;
    seamSources=plan.seamSources;
    wideWitnessSources=plan.wideWitnessSources??0;
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
     for(const join of [c.companion,c.seamCompanion,c.wideWitnessCompanion].filter(Boolean)){
      // Genuine world.get rock from a real source-ray-certified adjacent
      // section: four existing GPU buffers and 1MiB total remain unchanged.
      const second=meshDepthSection(world,join.cx,join.cz,join.section);
      const merged=new Float32Array(data.length+second.length);
      merged.set(data);merged.set(second,data.length);
      data=merged;
     }
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
   uploads,failures,uncovered,farRock,sourceSamples,joinedSources,seamSources,wideWitnessSources,
   sourceSections:buffers.size+joinedSources+seamSources+wideWitnessSources,budgetExcluded,lastMeshMs,
   vertices:[...buffers.values()].reduce((n,c)=>n+c.count,0),
   maxChunks:bounds.maxChunks,maxBytes:bounds.maxBytes};
 }
 return Object.freeze({step,draw,invalidate,resetForLostContext,stats});
}
