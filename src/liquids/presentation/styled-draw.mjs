// Isolated Water B style binding and frame admission; no GL writes.
import {planLiquidDraws} from './draw-plan.mjs';
const integer=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const axisNormal=n=>n.every(v=>[-1,0,1].includes(v))&&n.reduce((s,v)=>s+Math.abs(v),0)===1;
const bindings=new WeakMap();
// Recover the producing voxel in local coordinates, including fractional tops,
// clipped sides and positive faces. Never form fractional world coordinates.
function faceOwner(group,q,origin){
  const at=q*12,normal=Array.from(group.normals.subarray(at,at+3));
  if(!axisNormal(normal))throw TypeError('Invalid face normal');
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<12;i++){
    const a=i%3,p=group.positions[at+i];
    if(group.normals[at+i]!==normal[a]||!Number.isFinite(p)||Math.abs(p)>4097||!Number.isInteger(p*8))throw TypeError('Invalid face vertex');
    lo[a]=Math.min(lo[a],p);hi[a]=Math.max(hi[a],p);
  }
  const axis=normal.findIndex(n=>n!==0),local=lo.map((v,a)=>a===1?Math.floor(hi[a]-(axis===1&&normal[1]===-1?0:1/8)):v);
  if(axis!==1&&normal[axis]===1)local[axis]--;
  for(let a=0;a<3;a++){
    if(a===axis){if(lo[a]!==hi[a])throw TypeError('Nonplanar face');}
    else if(a!==1&&hi[a]-lo[a]!==1)throw TypeError('Invalid horizontal span');
    else if(a===1&&(hi[a]<=lo[a]||lo[a]<local[a]||hi[a]>local[a]+1))throw TypeError('Invalid side span');
  }
  if(!local.every(Number.isSafeInteger)||axis===1&&normal[1]===-1&&lo[1]!==local[1]||axis!==1&&!Number.isInteger(lo[axis]))throw TypeError('Invalid face owner');
  const cell=local.map((n,a)=>n+origin[a]);
  if(!cell.every(Number.isSafeInteger)||!integer(cell[1],-210,256))throw RangeError('Outside physical cell envelope');
  return Object.freeze({cell:Object.freeze(cell),normal:Object.freeze(normal),liquid:group.id});
}
// Style is null (ordinary material) or a small numeric uniform tuple. Bindings
// are opaque, process-local, tied to the exact mesh object and positive revision.
export function prepareLiquidFaceStyles({batch,styleForFace,maxFaces=2560}={}){
  const {id,revision,mesh}=batch??{};
  if(typeof id!=='string'||!id.length||id.length>128||!integer(revision,1,Number.MAX_SAFE_INTEGER)||!integer(maxFaces,1,32768)||typeof styleForFace!=='function'||mesh?.version!==1||!Array.isArray(mesh.origin)||mesh.origin.length!==3||!mesh.origin.every(Number.isSafeInteger)||!Array.isArray(mesh.groups)||mesh.groups.length>5||!integer(mesh.faceCount,0,maxFaces))throw TypeError('Invalid face style inputs');
  const byGroup=new Map(),intern=new Map();let count=0;
  for(const g of mesh.groups){
    if(!g||byGroup.has(g.id)||!(g.positions instanceof Float32Array)||!(g.normals instanceof Float32Array)||!(g.indices instanceof Uint32Array)||g.positions.length%12||g.normals.length!==g.positions.length||g.indices.length!==g.positions.length/2)throw TypeError('Invalid face style group');
    const n=g.indices.length/6;count+=n;if(count>mesh.faceCount)throw RangeError('Face style budget');
    const styles=[];
    for(let q=0;q<n;q++){
      const v=styleForFace(faceOwner(g,q,mesh.origin));
      if(v===null){styles.push(null);continue;}
      if(!Array.isArray(v)||v.length<1||v.length>16||!v.every(Number.isFinite))throw TypeError('Invalid uniform tuple');
      const key=v.join(',');if(!intern.has(key))intern.set(key,Object.freeze([...v]));styles.push(intern.get(key));
    }
    byGroup.set(g.id,styles);
  }
  if(count!==mesh.faceCount)throw RangeError('Inconsistent face count');
  const token=Object.freeze({id,revision,faces:count});bindings.set(token,{mesh,byGroup});return token;
}
// Build a complete ordered plan or return no plan. Never drop, reorder or
// degrade faces to fit a budget. Host holds a stable CPU/GPU read lease.
export function admitStyledLiquidDraws({batches,styleBindings,gpu,materials,camera,forward,maxBatches=128,maxFaces=8192,maxDrawCalls=512}={}){
  if(!integer(maxBatches,1,512)||!integer(maxFaces,1,32768)||!integer(maxDrawCalls,1,32768)||!Array.isArray(batches)||batches.length>maxBatches||!Array.isArray(styleBindings)||styleBindings.length!==batches.length||typeof gpu?.get!=='function')throw TypeError('Invalid draw admission inputs');
  const reject=status=>Object.freeze({status,plan:null});
  const ordered=planLiquidDraws({batches,materials,camera,forward,maxBatches,maxFaces});
  const map=new Map();
  for(let i=0;i<batches.length;i++){
    const b=batches[i],token=styleBindings[i],data=bindings.get(token);
    if(!data||token.id!==b.id||token.revision!==b.revision||data.mesh!==b.mesh)return reject('stale-style');
    if(!b.mesh.faceCount)continue;
    const g=gpu.get(b.id);
    if(!g||g.id!==b.id||g.revision!==b.revision||!Array.isArray(g.origin)||g.origin.length!==3||g.origin.some((n,a)=>n!==b.mesh.origin[a])||!Array.isArray(g.groups)||g.groups.length!==b.mesh.groups.length||b.mesh.groups.some(m=>g.groups.filter(v=>v.id===m.id&&v.indexCount===m.indices.length).length!==1))return reject('stale-gpu');
    map.set(b.id,data.byGroup);
  }
  let calls=0;
  function split(ranges){
    const out=[];
    for(const r of ranges){
      const styles=map.get(r.batchId).get(r.liquid),end=r.firstIndex+r.indexCount;
      for(let i=r.firstIndex;i<end;i+=6){
        const style=styles[i/6],last=out.at(-1);
        if(last&&last.batchId===r.batchId&&last.revision===r.revision&&last.liquid===r.liquid&&last.firstIndex+last.indexCount===i&&last.style===style)last.indexCount+=6;
        else{if(++calls>maxDrawCalls)return null;out.push({...r,firstIndex:i,indexCount:6,style});}
      }
    }
    return Object.freeze(out.map(Object.freeze));
  }
  const opaque=split(ordered.opaque);if(!opaque)return reject('draw-budget');
  const transparent=split(ordered.transparent);if(!transparent)return reject('draw-budget');
  return Object.freeze({status:'admitted',plan:Object.freeze({faces:ordered.faces,drawCalls:calls,opaque,transparent})});
}
