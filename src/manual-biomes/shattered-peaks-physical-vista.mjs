// SP2 research v2: exact live-cell exposure, including edited holes and
// placed full cubes. Never mount as a production GPU owner.
import {ShatteredPeaksTerraceWorld} from './shattered-peaks-terrace.mjs';
import {mountainV8Material} from './mountain-v8-materials.mjs';
import {runtimeMeshKey,runtimeSectionForY} from '../world-height.mjs';
import {UPPER_SECTION_BYTES} from '../world-height-budget.mjs';
const dirs=[[0,1,0],[-1,0,0],[1,0,0],[0,0,-1],[0,0,1],[0,-1,0]];
const owner=(x,y,z)=>runtimeMeshKey(Math.floor(x/16),Math.floor(z/16),runtimeSectionForY(y));
const D=239; // actual Y19..257 including both halos
export function planPhysicalMountainVista(world,{x,z,radius=24,nearKeys,byteLimit=UPPER_SECTION_BYTES}={}){
 if(!(world instanceof ShatteredPeaksTerraceWorld)||![x,z,radius,byteLimit].every(Number.isSafeInteger)||
 Math.abs(x)>2147482900||Math.abs(z)>2147482900||radius<1||radius>24||
 !(nearKeys instanceof Set)||byteLimit<216||byteLimit>UPPER_SECTION_BYTES)throw Error('Invalid physical vista request');
 const w=2*radius+3,ox=x-radius-1,oz=z-radius-1,volume=new Uint16Array(w*w*D);
 const ix=(a,y,b)=>(b*w+a)*D+y-19;
 const at=(a,y,b)=>volume[ix(a,y,b)];
 const terrain=id=>mountainV8Material(id)?.terrain===true;
 // Sample the authoritative get, not the proposed heightfield. Never infer
 // an occupied interval from terrace metadata, even for unedited columns.
 for(let b=0;b<w;b++)for(let a=0;a<w;a++)for(let y=19;y<=257;y++){
  const id=world.get(ox+a,y,oz+b);
  if(!Number.isInteger(id)||id<0||id>65534)throw Error('Invalid physical cell');
  if(y>=20&&id!==0&&!terrain(id)&&![1,2,3,5,6,8].includes(id))
   return {ok:false,reason:'Unsupported upper non-terrain shape',vertices:null};
  volume[ix(a,y,b)]=id;
 }
 // Sparse exact exposure masks grouped by orientation and world plane.
 // Top/bottom retain per-cell material. Side strips use a representative
 // actual material (visual simplification only, never change geometry).
 const planes=new Map(),counts=Array(6).fill(0),nearCounts=Array(6).fill(0);
 for(let b=1;b<w-1;b++)for(let a=1;a<w-1;a++)for(let y=20;y<=256;y++){
  const id=at(a,y,b);if(!id)continue;
  const wx=ox+a,wz=oz+b,near=nearKeys.has(owner(wx,y,wz));
  for(let f=0;f<6;f++){
   const [dx,dy,dz]=dirs[f];if(at(a+dx,y+dy,b+dz))continue;
   if(near){nearCounts[f]++;continue;}counts[f]++;
   // Non-M8 full cubes can affect occlusion, but until palette parity is
   // authored they may only render in the original detailed owner.
   if(!terrain(id))return {ok:false,reason:'Non-M8 exposed cell requires detailed owner',vertices:null};
   const horizontal=f===0||f===5;
   const plane=horizontal?y+Number(f===0):f<=2?wx+Number(f===2):wz+Number(f===4);
   const u=f===1||f===2?b-1:a-1,v=horizontal?b-1:y-20;
   const key=f+':'+plane;
   let p=planes.get(key);
   if(!p){p={f,plane,cols:w-2,rows:horizontal?w-2:237,mask:new Uint16Array((w-2)*(horizontal?w-2:237))};planes.set(key,p);}
   p.mask[v*p.cols+u]=id;
  }
 }
 const quads=[];
 for(const p of planes.values()){
  const {f,plane,cols,rows,mask}=p,horizontal=f===0||f===5;
  const match=(i,id)=>horizontal?mask[i]===id:mask[i]!==0;
  for(let v=0;v<rows;v++)for(let u=0;u<cols;u++){
   const id=mask[v*cols+u];if(!id)continue;
   let u1=u+1,v1=v+1;
   while(u1<cols&&match(v*cols+u1,id))u1++;
   outer:while(v1<rows){for(let a=u;a<u1;a++)if(!match(v1*cols+a,id))break outer;v1++;}
   const sampled=mask[(v1-1)*cols+u];
   for(let b=v;b<v1;b++)mask.fill(0,b*cols+u,b*cols+u1);
   quads.push({f,plane,u,v,u1,v1,id:sampled});
  }
 }
 const bytes=quads.length*216,stats={counts,nearCounts,quads:quads.length,bytes,sampledCells:volume.length};
 if(bytes>byteLimit)return {ok:false,reason:'Exact physical surface exceeds inherited section cap',stats,vertices:null};
 const vertices=new Float32Array(quads.length*54);let cursor=0;
 for(const q of quads){
  const {f,plane,u,v,u1,v1,id}=q,horizontal=f===0||f===5;
  const a=(f===1||f===2?oz:ox)+1+u,b=(f===1||f===2?oz:ox)+1+u1;
  const c=(horizontal?oz+1:20)+v,d=(horizontal?oz+1:20)+v1;
  const corners=horizontal?[[a,plane,c],[b,plane,c],[b,plane,d],[a,plane,d]]:
   f<=2?[[plane,c,a],[plane,c,b],[plane,d,b],[plane,d,a]]:
   [[a,c,plane],[b,c,plane],[b,d,plane],[a,d,plane]];
  const m=mountainV8Material(id),shade=f===0?1:f===5?.58:f<=2?.84:.72;
  for(const k of [0,1,2,0,2,3]){
   const [vx,vy,vz]=corners[k];vertices.set([vx,vy,vz,...m.color.map(c=>c*shade),f===1||f===2?vz:vx,horizontal?vz:vy,m.materialTag],cursor);cursor+=9;
  }
 }
 return {ok:true,stats,vertices,quads};
}
