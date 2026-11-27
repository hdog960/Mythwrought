// SP2 compact exact upper surface geometry, source-only research.
// No production renderer registration or additional authorized GPU owner.
// Vertical exposed strips replace unit quads; ownership is clipped at the
// original shared section boundary. Near owners are never duplicated.
import {ShatteredPeaksTerraceWorld} from './shattered-peaks-terrace.mjs';
import {mountainV8Material} from './mountain-v8-materials.mjs';
import {runtimeMeshKey,runtimeSectionForY,runtimeSectionBounds} from '../world-height.mjs';
import {UPPER_SECTION_BYTES,UPPER_STAGE_BYTES,UPPER_RESIDENT_BYTES} from '../world-height-budget.mjs';
export const SP_VISTA_RADIUS=24;
const valid=Number.isSafeInteger;
const directions=[[-1,0],[1,0],[0,-1],[0,1]];
const owner=(x,y,z)=>runtimeMeshKey(Math.floor(x/16),Math.floor(z/16),runtimeSectionForY(y));
export function planShatteredUpperVista(world,{x,z,radius=SP_VISTA_RADIUS,nearKeys,byteLimit=UPPER_SECTION_BYTES}={}){
 if(!(world instanceof ShatteredPeaksTerraceWorld)||![x,z,radius,byteLimit].every(valid)||radius<1||radius>SP_VISTA_RADIUS||
    !(nearKeys instanceof Set)||byteLimit<216||byteLimit>UPPER_SECTION_BYTES)throw Error('Invalid bounded vista request');
 // A natural-source heightfield cannot encode mined holes or placements.
 // Reject the entire research representation for edited worlds rather than
 // resurrecting a block, silently skipping a hole or offering a stale view.
 if(world.edits.size!==0)throw Error('Edited source requires exact edit-aware vista');
 const width=2*radius+3,ox=x-radius-1,oz=z-radius-1;
 const heights=new Uint16Array(width*width);
 for(let dz=0;dz<width;dz++)for(let dx=0;dx<width;dx++){
  const p=world.terraceColumn(ox+dx,oz+dz);
  heights[dz*width+dx]=p?.topY>=20?p.topY:19;
 }
 const at=(a,b)=>heights[b*width+a],strips=[];
 let tops=0,nearTops=0,sideArea=0,nearSideArea=0;
 function add(face,wx,wz,lo,hi){
  // Face geometry is exact; side pigment is intentionally simplified to
  // one sampled real material per vertical strip. Not full material parity.
  const id=world.naturalAndLandmarkBlock(wx,hi,wz);
  if(!mountainV8Material(id)?.terrain)throw Error('Vista references nonterrain source');
  strips.push({face,x:wx,z:wz,lo,hi,id});
 }
 for(let b=1;b<width-1;b++)for(let a=1;a<width-1;a++){
  const top=at(a,b),wx=ox+a,wz=oz+b;if(top<20)continue;
  if(nearKeys.has(owner(wx,top,wz)))nearTops++;else{add(0,wx,wz,top,top);tops++;}
  for(let i=0;i<directions.length;i++){
   const [dx,dz]=directions[i],low=Math.max(20,at(a+dx,b+dz)+1);
   for(let y=low;y<=top;){
    const section=runtimeSectionForY(y),hi=Math.min(top,runtimeSectionBounds(section).maxY);
    if(nearKeys.has(owner(wx,y,wz)))nearSideArea+=hi-y+1;
    else{add(i+1,wx,wz,y,hi);sideArea+=hi-y+1;}
    y=hi+1;
   }
  }
 }
 // Coalesce coplanar strips with equal bounds, material and orientation.
 // This only combines consecutive cells along the tangent axis, never
 // spans a missing face, and cannot cross a resident exclusion.
 const key=s=>s.face+':'+(s.face===0?s.z:s.face<=2?s.x:s.z)+':'+s.lo+':'+s.hi+':'+s.id;
 const groups=new Map();
 for(const s of strips){const k=key(s);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(s);}
 const quads=[];
 for(const rows of groups.values()){
  const tangent=s=>s.face>0&&s.face<=2?s.z:s.x;
  rows.sort((a,b)=>tangent(a)-tangent(b));
  let run=null;
  for(const s of rows){
   const n=tangent(s);
   if(run&&n===run.end+1){run.end=n;continue;}
   run={...s,start:n,end:n};quads.push(run);
  }
 }
 const bytes=quads.length*216;
 const stats=Object.freeze({tops,nearTops,sideArea,nearSideArea,strips:strips.length,quads:quads.length,bytes,sourceColumns:width*width});
 if(bytes>byteLimit)return Object.freeze({ok:false,reason:'vista geometry exceeds inherited section budget',stats,vertices:null});
 const vertices=new Float32Array(quads.length*54);let p=0;
 for(const s of quads){
  const {face,x,z,lo,hi,start,end,id}=s;
  const low=lo,high=hi+1,end1=end+1;
  let q;
  if(face===0)q=[[start,high,z],[end1,high,z],[end1,high,z+1],[start,high,z+1]];
  else if(face===1||face===2){const xx=x+Number(face===2);q=[[xx,low,start],[xx,low,end1],[xx,high,end1],[xx,high,start]];}
  else{const zz=z+Number(face===4);q=[[start,low,zz],[end1,low,zz],[end1,high,zz],[start,high,zz]];}
  const m=mountainV8Material(id),shade=face===0?1:face<=2?.84:.72;
  for(const k of [0,1,2,0,2,3]){
   const [vx,vy,vz]=q[k];
   vertices.set([vx,vy,vz,...m.color.map(c=>c*shade),face<=2&&face>0?vz:vx,face===0?vz:vy,m.materialTag],p);p+=9;
  }
 }
 return Object.freeze({ok:true,stats,vertices,quads:Object.freeze(quads.map(Object.freeze))});
}
// Research budget accounting: reserve a slot rather than increase the
// released eight/25 caps. A combined vista is not a registered world owner;
// actual renderer admission still requires shared-owner coordination.
export function checkVistaBudget(vista,{detailedUpperOwners,totalDetailedOwners,detailedUpperBytes,retainedStageBytes=0}={}){
 if(!vista?.ok||![detailedUpperOwners,totalDetailedOwners,detailedUpperBytes,retainedStageBytes].every(n=>valid(n)&&n>=0))return false;
 if(detailedUpperOwners>totalDetailedOwners)return false;
 const bytes=vista.vertices.byteLength,extra=Number(bytes>0);
 return detailedUpperOwners+extra<=8&&totalDetailedOwners+extra<=25&&bytes<=UPPER_SECTION_BYTES&&
  detailedUpperBytes+bytes<=UPPER_RESIDENT_BYTES&&retainedStageBytes+bytes<=UPPER_STAGE_BYTES;
}
