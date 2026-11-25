import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareP0MixedGroup} from '../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../src/manual-biomes/forgotten-sands-second-site.mjs';
import {buildP0GroundedVista} from '../src/manual-biomes/forgotten-sands-grounded-vista.mjs';
function faces(s){
 const map=new Map();
 for(const q of s.rectangles)for(let row=q.row;row<q.end;row++)for(let a=q.a;a<q.b;a++){
  const {d,p,kind,id}=q;let x,y,z;
  if(d<2){x=p-(d===0?1:0);y=row;z=a;}else if(d===2){x=a;y=p-1;z=row;}else{x=a;y=row;z=p-(d===3?1:0);}
  const k=[d,x,y,z].join(','),owner=[Math.floor(x/16),Math.floor(z/16),y<=19?0:1+Math.floor((y-20)/16)].join(',');
  assert.ok(!map.has(k));map.set(k,{kind,id,x,y,z,owner});
 }
 return map;
}
const inBounds=(f,b)=>f.x>=b.minX&&f.x<=b.maxX&&f.z>=b.minZ&&f.z<=b.maxZ;
test('moving near-window handoff changes only real owner or terrain-envelope boundaries and restores exact far bytes on return',()=>{
 for(const index of [1,3]){
  const {world,spec,group}=prepareP0MixedGroup(index),mid=spec.modules[1],steps=[];
  let prev=null,initial=null;
  for(const distance of [48,40,32,25,16,25,48]){
   const eye=[mid.x-distance,17,mid.z],near=p0BenchmarkWindow(Math.floor(eye[0]/16),Math.floor(eye[2]/16),15),
    keys=new Set(near.map(k=>k.key)),s=buildP0GroundedVista(world,group.view,spec.modules,near,{eye}),f=faces(s);
   const cur={keys,s,f};if(!initial)initial=cur;
   if(prev){
    let retained=0,toNear=0,fromNear=0,exitEnvelope=0,enterEnvelope=0;
    for(const [k,a] of prev.f){
     const b=f.get(k);
     if(b){assert.equal(a.kind,b.kind);assert.equal(a.id,b.id);retained++;continue;}
     if(keys.has(a.owner)){toNear++;continue;}
     assert.equal(a.kind,1);assert.equal(inBounds(a,s.bounds),false);exitEnvelope++;
    }
    for(const [k,b] of f)if(!prev.f.has(k)){
     if(prev.keys.has(b.owner)){fromNear++;continue;}
     assert.equal(b.kind,1);assert.equal(inBounds(b,prev.s.bounds),false);enterEnvelope++;
    }
    steps.push({distance,retained,toNear,fromNear,exitEnvelope,enterEnvelope});
   }
   prev=cur;
  }
  assert.deepEqual(prev.s.vertices,initial.s.vertices);assert.equal(prev.f.size,initial.f.size);
  assert.ok(steps.some(s=>s.toNear>0));assert.ok(steps.some(s=>s.fromNear>0));
  assert.deepEqual(world.save().edits,[]);
  console.log('P0 HANDOFF',JSON.stringify({index,seed:spec.seed,steps,returnBytes:prev.s.vertices.byteLength}));
 }
});
