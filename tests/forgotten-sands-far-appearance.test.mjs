import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareP0MixedGroup,p0BenchmarkMesh} from '../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {createP0FastVista} from '../src/manual-biomes/forgotten-sands-fast-vista.mjs';
import {p0FarRecordWitness,recolorP0FarCache} from '../src/manual-biomes/forgotten-sands-far-appearance.mjs';
import {planP0CurrentFarAdmission} from '../src/manual-biomes/forgotten-sands-current-far-admission.mjs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.env.P0_CURRENT_SOURCE;if(!root)throw Error('Current checkout required');
const load=p=>import(pathToFileURL(resolve(root,p)).href);
const H=await load('src/world-height.mjs'),S=await load('src/world-height-stream.mjs');
const error=(a,b)=>a.reduce((n,c,i)=>n+Math.abs(c-b[i]),0)/3;
function nativeRgb(v,{d,x,y,z}){
 const axis=d<2?0:d===2?1:2,base=[x,y,z],plane=base[axis]+(d===0||d===2||d===3?1:0),sum=[0,0,0];let count=0;
 for(let i=0;i<v.length;i+=27){
  let ok=true;for(let k=0;k<3;k++)for(let a=0;a<3;a++){
   const q=v[i+k*9+a];if(a===axis?q!==plane:q<base[a]||q>base[a]+1)ok=false;
  }
  if(!ok)continue;
  for(let k=0;k<3;k++)for(let a=0;a<3;a++)sum[a]+=v[i+k*9+3+a];count+=3;
 }
 return count===6?sum.map(n=>n/count):null;
}
test('source-derived representative RGB preserves all geometry and improves native face witness error',()=>{
 for(const index of [1,3]){
  const {world,spec,group}=prepareP0MixedGroup(index),mid=spec.modules[1],eye=[mid.x-48,17,mid.z];
  const cache=createP0FastVista(world,group.view,spec.modules,{eye,snapshotCurrent:group.snapshotCurrent});
  const old=cache.copyVertices(),next=recolorP0FarCache(cache,world,group.view),v=next.vertices,meshes=new Map();
  let before=0,after=0,count=0,ground=0,monument=0;
  assert.equal(v.length,old.length);assert.equal(next.unsupported,0);
  for(let i=0;i<v.length;i+=9)for(const a of [0,1,2,6,7,8])assert.equal(v[i+a],old[i+a]);
  // Uniform deterministic stride across records, with an actual native mesh
  // witness for each selected face. Skip ambiguous or absent triangle pairs.
  for(let i=0;i<v.length;i+=9*31){
   const q=p0FarRecordWitness(v,i),cx=Math.floor(q.x/16),cz=Math.floor(q.z/16),s=q.y<=19?0:1+Math.floor((q.y-20)/16),key=[cx,cz,s].join(',');
   if(!meshes.has(key))meshes.set(key,p0BenchmarkMesh(group.view,cx,cz,s));
   const rgb=nativeRgb(meshes.get(key),q);if(!rgb)continue;
   before+=error([...old.subarray(i+3,i+6)],rgb);after+=error([...v.subarray(i+3,i+6)],rgb);count++;if(q.kind===0)monument++;else ground++;
  }
  assert.ok(count>50&&ground>0&&monument>0);assert.ok(after<before);
  console.log('P0 SOURCE RGB',JSON.stringify({index,seed:spec.seed,count,ground,monument,changed:next.changed,before:before/count,after:after/count,meshWitnesses:meshes.size}));
 }
});
test('actual released planner refuses additional far owner at full residency, never removes selected owners',()=>{
 for(const index of [1,3]){
  const {world,spec,group}=prepareP0MixedGroup(index),occupied=new Set();
  for(const m of spec.modules)for(let x=m.x-(m.size-1)/2;x<=m.x+(m.size-1)/2;x++)
   for(let z=m.z-(m.size-1)/2;z<=m.z+(m.size-1)/2;z++)for(let y=20;y<=46;y++)if(group.view.get(x,y,z)!==0)occupied.add(H.physicalRegionAt(x,y,z).key);
  const upperOccupied=k=>occupied.has(k),worldView={base:{upperNaturalOccupied:upperOccupied}},mid=spec.modules[1],results=[];
  for(const distance of [48,40,32,25,16]){
   const x=mid.x-distance,z=mid.z,cx=Math.floor(x/16),cz=Math.floor(z/16),legacy=[];
   for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++)legacy.push({cx:a,cz:b,section:0});
   const selected=S.planHeightStream(worldView,{x,z,feet:15},legacy),before=JSON.stringify(selected);
   const r=planP0CurrentFarAdmission({selected,resident:[],farBytes:160000,sourceCurrent:group.snapshotCurrent,canonicalKey:H.runtimeMeshKey,upperOccupied});
   assert.equal(r.allowed,false);assert.equal(r.reason,'no-spare-shared-owner');assert.equal(JSON.stringify(selected),before);
   results.push({distance,owners:selected.length,reason:r.reason});
  }
  // Advisory spare case only, not actual planner output or live permission.
  const selected=[{cx:0,cz:0,section:0}],args={selected,resident:[{...selected[0],bytes:360}],farBytes:160000,sourceCurrent:()=>true,canonicalKey:H.runtimeMeshKey,upperOccupied:()=>false};
  assert.equal(planP0CurrentFarAdmission(args).allowed,true);assert.equal(planP0CurrentFarAdmission({...args,resident:[]}).allowed,false);
  assert.equal(planP0CurrentFarAdmission({...args,sourceCurrent:()=>false}).allowed,false);
  console.log('P0 CURRENT ADMISSION',JSON.stringify({index,results,placementAuthority:false}));
 }
});
