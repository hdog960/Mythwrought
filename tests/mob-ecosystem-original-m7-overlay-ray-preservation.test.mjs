// Original M7 mob query regression; controlled voxel/overlay fixtures.
// Native ESM in a full checkout is required for release acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createM7MobCollisionReader} from '../src/mobs/ecosystem-world-geometry.mjs';
import {createWorldQuery} from '../src/mobs/world-query.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../src/environment-ground.mjs';
import {BLOCK} from '../src/voxel.mjs';

const from=[.5,4.5,.5],to=[5.5,4.5,.5];
const body={radius:.3,height:1};
const position=[2.5,4,.5];
function world(){
  return {generationProfile:{generator:M7_ENVIRONMENT_GENERATOR},
    get(x,y,z){return y<4?BLOCK.STONE:BLOCK.AIR;}};
}
function layer({populated=true,hit=true,fits=true}={}){
  return {count:populated?1:0,hit,fits,
    size(){return this.count;},
    target(){return this.hit?{distance:2}:null;},
    playerFits(){return {fits:this.fits};},
    mutate(){throw Error('No mutable owner methods should be exposed');}};
}
const query=w=>createWorldQuery(w,{resident:()=>true});
const adapted=w=>query(createM7MobCollisionReader(w));

test('clear original air sightline remains clear',()=>{
  const w=world();
  assert.equal(query(w).lineOfSight(from,to),true);
  assert.equal(adapted(w).lineOfSight(from,to),true);
});
test('M7 adapter retains Pack3 source ray occlusion and receiver',()=>{
  const w=world();w.pack3Runtime=layer();
  assert.equal(query(w).lineOfSight(from,to),false);
  assert.equal(adapted(w).lineOfSight(from,to),false);
});
test('M7 adapter retains Manual14 source ray occlusion and receiver',()=>{
  const w=world();w.manual14Layer=layer();
  assert.equal(query(w).lineOfSight(from,to),false);
  assert.equal(adapted(w).lineOfSight(from,to),false);
});
test('both empty owner layers remain transparent',()=>{
  const w=world();w.pack3Runtime=layer({populated:false});
  w.manual14Layer=layer({populated:false});
  assert.equal(adapted(w).lineOfSight(from,to),true);
});
test('populated owner layer without a hit remains transparent',()=>{
  const w=world();w.pack3Runtime=layer({hit:false});
  w.manual14Layer=layer({hit:false});
  assert.equal(adapted(w).lineOfSight(from,to),true);
});
test('late Pack3 attachment blocks ray and physical body',()=>{
  const w=world(),q=adapted(w);
  assert.equal(q.lineOfSight(from,to),true);
  assert.equal(q.volume(position,body),'clear');
  w.pack3Runtime=layer({fits:false});
  assert.equal(q.lineOfSight(from,to),false);
  assert.equal(q.volume(position,body),'solid');
});
test('late Manual14 attachment blocks sight and shape collision',()=>{
  const w=world(),q=adapted(w);
  w.manual14Layer=layer();w.manual14Collision=()=>true;
  assert.equal(q.lineOfSight(from,to),false);
  assert.equal(q.volume(position,body),'solid');
});
test('Pack3 replacement and removal are observed, not stale references',()=>{
  const w=world();w.pack3Runtime=layer({hit:false});
  const q=adapted(w);assert.equal(q.lineOfSight(from,to),true);
  w.pack3Runtime=layer({fits:false});
  assert.equal(q.lineOfSight(from,to),false);
  assert.equal(q.volume(position,body),'solid');
  delete w.pack3Runtime;
  assert.equal(q.lineOfSight(from,to),true);
  assert.equal(q.volume(position,body),'clear');
});
test('Manual14 replacement and removal are observed',()=>{
  const w=world();w.manual14Layer=layer();const q=adapted(w);
  assert.equal(q.lineOfSight(from,to),false);
  w.manual14Layer=layer({hit:false});
  assert.equal(q.lineOfSight(from,to),true);
  delete w.manual14Layer;
  assert.equal(q.lineOfSight(from,to),true);
});
test('late Pack5 collision is conservative without ray authority',()=>{
  const w=world(),q=adapted(w);
  w.pack5Collision=()=>true;
  assert.equal(q.volume(position,body),'solid');
  assert.equal(q.lineOfSight(from,to),false);
  delete w.pack5Collision;
  assert.equal(q.volume(position,body),'clear');
  assert.equal(q.lineOfSight(from,to),true);
});
test('populated Pack3 missing ray authority fails closed',()=>{
  const w=world();w.pack3Runtime={size:()=>1,playerFits:()=>({fits:true})};
  assert.equal(adapted(w).lineOfSight(from,to),false);
});
test('populated Manual14 missing ray authority fails closed',()=>{
  const w=world();w.manual14Layer={size:()=>1};
  assert.equal(adapted(w).lineOfSight(from,to),false);
});
test('read-only wrapper never exposes mutable owner methods',()=>{
  const w=world();w.pack3Runtime=layer();w.manual14Layer=layer();
  const r=createM7MobCollisionReader(w);
  assert.equal(Object.isFrozen(r),true);
  assert.equal(Object.isFrozen(r.pack3Runtime),true);
  assert.equal(Object.isFrozen(r.manual14Layer),true);
  assert.equal(r.pack3Runtime.mutate,undefined);
  assert.equal(r.manual14Layer.mutate,undefined);
  assert.equal(r.set,undefined);assert.equal(r.base,undefined);
});
test('original M7 source cube blocks real voxel ray',()=>{
  const w=world(),get=w.get;
  w.get=(x,y,z)=>x===2&&y===4&&z===0?400:get(x,y,z);
  assert.equal(adapted(w).lineOfSight(from,to),false);
});
