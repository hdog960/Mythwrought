import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareP0MixedGroup,p0BenchmarkMesh} from '../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../src/manual-biomes/forgotten-sands-second-site.mjs';
import {buildP0GroundedVista} from '../src/manual-biomes/forgotten-sands-grounded-vista.mjs';
import {createP0CachedVista} from '../src/manual-biomes/forgotten-sands-cached-vista.mjs';
function faces(v,ranges){
 const set=new Set();
 for(const range of ranges)for(let i=range.start*9;i<(range.start+range.count)*9;i+=9){
   const [code,p,row,,, ,a,b,end]=v.subarray(i,i+9),d=code%5,kind=Math.floor(code/5);
   for(let r=row;r<end;r++)for(let u=a;u<b;u++){
    const [x,y,z]=d<2?[p-(d===0?1:0),r,u]:d===2?[u,p-1,r]:[u,r,p-(d===3?1:0)];
    const k=[Math.floor(x/16),Math.floor(z/16),y<=19?0:1+Math.floor((y-20)/16)].join(',');
    if(range.key!==null)assert.equal(k,range.key);
    const f=[kind,d,x,y,z].join(',');assert.ok(!set.has(f));set.add(f);
   }
 }
 return set;
}
test('fixed original face cache, exact wide coverage, every partial ownership transition, no repeated source reads',()=>{
 for(const index of [0,1,2,3]){
  const {world,spec,group}=prepareP0MixedGroup(index),mid=spec.modules[1],eye=[mid.x-48,17,mid.z];
  let reads=0,valid=true;
  const wrap=w=>({get(x,y,z){reads++;return w.get(x,y,z);}});
  const cache=createP0CachedVista(wrap(world),wrap(group.view),spec.modules,{eye,snapshotCurrent:()=>valid&&group.snapshotCurrent()});
  const v=cache.copyVertices(),all=faces(v,cache.ranges),coldReads=reads;
  const initial=p0BenchmarkWindow(Math.floor(eye[0]/16),Math.floor(eye[2]/16),15);
  const original=buildP0GroundedVista(world,group.view,spec.modules,initial,{eye});
  assert.deepEqual(faces(v,cache.select(initial.map(k=>k.key)).ranges),faces(original.vertices,[{start:0,count:original.vertices.length/9,key:null}]));
  let resident=new Set(),transitions=0,peak=0,maxWarmMs=0;
  function verify(){
   const t=performance.now(),s=cache.select([...resident]);maxWarmMs=Math.max(maxWarmMs,performance.now()-t);
   const f=faces(v,s.ranges);assert.equal(f.size,s.faces);
   for(const k of f){assert.ok(all.has(k));const [, ,x,y,z]=k.split(',').map(Number);assert.ok(!resident.has([Math.floor(x/16),Math.floor(z/16),y<=19?0:1+Math.floor((y-20)/16)].join(',')));}
   assert.equal(s.faces+s.omitted,all.size);transitions++;peak=Math.max(peak,resident.size+1);
  }
  let maxCombined=0;
  for(const distance of [48,40,32,25,16,25,48]){
   const near=p0BenchmarkWindow(Math.floor((mid.x-distance)/16),Math.floor(mid.z/16),15),wanted=new Set(near.map(k=>k.key));
   for(const k of resident)if(!wanted.has(k)){resident.delete(k);verify();}
   for(const k of wanted)if(!resident.has(k)){resident.add(k);verify();}
   const bytes=near.reduce((n,k)=>n+p0BenchmarkMesh(group.view,k.cx,k.cz,k.s).byteLength,0)+v.byteLength;
   assert.ok(bytes<=2610144);maxCombined=Math.max(maxCombined,bytes);
  }
  assert.equal(reads,coldReads);assert.equal(peak,19);assert.deepEqual(v,cache.copyVertices());
  valid=false;assert.throws(()=>cache.select([]),/Stale/);assert.throws(()=>cache.copyVertices(),/Stale/);
  console.log('P0 CACHE',JSON.stringify({index,seed:spec.seed,...cache.stats,coldReads,warmReads:reads-coldReads,transitions,peak,maxCombined,maxWarmMs}));
 }
});
