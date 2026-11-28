import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiquidMeshCache} from '../../../src/liquids/presentation/mesh-cache.mjs';
const point=x=>[x,0,0];
function fixture(options={}){
  const cells=new Map(),specs=new Map();
  const put=(x,id='water',units=8)=>cells.set(x,{x,y:0,z:0,id,units});
  const spec=(id,xs)=>specs.set(id,{origin:point(xs[0]??0),cells:xs.map(point)});
  const engine={getCell:(x,y,z)=>y===0&&z===0?cells.get(x)??null:null};
  const cache=createLiquidMeshCache({engine,isLoaded:()=>true,isOpen:()=>true,
    describeBatch:id=>specs.get(id)??null,...options});
  return {cache,cells,specs,put,spec,engine};
}
test('bounded FIFO deduplicates invalidations and retains pending work',()=>{
  const {cache,put,spec}=fixture({maxVisits:1});
  for(const [id,x] of [['a',0],['b',10],['c',20]]){put(x);spec(id,[x]);}
  assert.equal(cache.invalidate(['a','b','a','c']),true);
  cache.invalidate(['a']);
  assert.deepEqual(cache.step().published.map(x=>x.id),['a']);
  assert.deepEqual(cache.step().published.map(x=>x.id),['b']);
  assert.deepEqual(cache.step().published.map(x=>x.id),['c']);
  assert.equal(cache.stats().pending,0);assert.throws(()=>cache.step(2));
});
test('staging rejection retains previous-good and does not starve another batch',()=>{
  const {cache,put,spec}=fixture({maxStagingBytes:720,maxVisits:2});
  put(0);spec('a',[0]);cache.invalidate(['a']);cache.step();const old=cache.get('a');
  put(2);spec('a',[0,2]);put(10);spec('b',[10]);cache.invalidate(['a','b']);
  const result=cache.step();assert.equal(cache.get('a'),old);
  assert.deepEqual(result.deferred,[{id:'a',reason:'build-rejected'}]);
  assert.deepEqual(result.published.map(x=>x.id),['b']);assert.equal(result.pending,1);
  spec('a',[2]);assert.equal(cache.step().published.length,1);assert.notEqual(cache.get('a'),old);
});
test('resident admission accounts for replacement not double allocation',()=>{
  const {cache,put,spec,cells}=fixture({maxResidentBytes:720});
  put(0);spec('a',[0]);put(10);spec('b',[10]);cache.invalidate(['a','b']);
  const r=cache.step();assert.equal(r.residentBytes,720);assert.equal(cache.get('b'),null);
  assert.deepEqual(r.deferred,[{id:'b',reason:'resident-budget'}]);
  put(0,'water',4);cache.invalidate(['a']);cache.step();assert.equal(cache.get('a').mesh.faceCount,6);
  cells.delete(0);cache.invalidate(['a']);cache.step();assert.equal(cache.get('a'),null);
  cache.step();assert.equal(cache.get('b').bytes,720);assert.equal(cache.stats().residentBytes,720);
});
test('new invalidation during build discards stale candidate and preserves old mesh',()=>{
  let cache,stale=false;const base=fixture();base.put(0);base.spec('a',[0]);
  cache=createLiquidMeshCache({engine:base.engine,isOpen:()=>true,isLoaded:()=>true,
    describeBatch:id=>{if(stale){stale=false;cache.invalidate([id]);}return base.specs.get(id);}});
  cache.invalidate(['a']);cache.step();const old=cache.get('a');
  base.put(0,'water',2);stale=true;cache.invalidate(['a']);
  assert.deepEqual(cache.step().deferred,[{id:'a',reason:'stale'}]);assert.equal(cache.get('a'),old);
  cache.step();assert.ok(cache.get('a').revision>old.revision);
  assert.ok(cache.get('a').mesh.groups[0].positions.some(v=>v===.25));
});
test('capacity rejection is atomic and explicit drop releases queue and bytes',()=>{
  const {cache,put,spec}=fixture({maxBatches:2});put(0);spec('a',[0]);
  cache.invalidate(['a']);cache.step();const before=cache.stats();
  assert.equal(cache.invalidate(['b','c']),false);assert.deepEqual(cache.stats(),before);
  assert.equal(cache.invalidate(['b']),true);assert.equal(cache.drop('a'),true);
  assert.equal(cache.stats().residentBytes,0);assert.equal(cache.invalidate(['c']),true);
  assert.equal(cache.drop('b'),true);assert.equal(cache.stats().pending,1);
  assert.throws(()=>cache.invalidate(['']));assert.throws(()=>cache.invalidate(new Array(1)));assert.equal(cache.drop('missing'),false);
});
test('unavailable and failing host descriptions retain prior good; empty is explicit',()=>{
  const {cache,put,spec,specs}=fixture();put(0);spec('a',[0]);cache.invalidate(['a']);cache.step();
  const old=cache.get('a');specs.delete('a');cache.invalidate(['a']);
  assert.deepEqual(cache.step().deferred,[{id:'a',reason:'unavailable'}]);assert.equal(cache.get('a'),old);
  specs.set('a',{origin:point(0),cells:[[0,257,0]]});
  assert.deepEqual(cache.step().deferred,[{id:'a',reason:'build-rejected'}]);assert.equal(cache.get('a'),old);
  spec('a',[]);assert.equal(cache.step().published[0].empty,true);assert.equal(cache.get('a'),null);
  assert.deepEqual(cache.stats(),{tracked:0,pending:0,residentBytes:0});
});
test('all five materials use exact typed-buffer byte accounting',()=>{
  const {cache,put,spec}=fixture();const ids=['water','lava','acid','amber-sap','liquid-resonance'];
  ids.forEach((id,i)=>put(i*2,id,i+1));spec('mix',[0,2,4,6,8]);cache.invalidate(['mix']);
  cache.step();const c=cache.get('mix');assert.equal(c.mesh.groups.length,5);
  assert.equal(c.bytes,30*120);assert.equal(cache.stats().residentBytes,c.bytes);
  assert.ok(Object.isFrozen(c)&&Object.isFrozen(c.mesh)&&Object.isFrozen(c.mesh.groups));
});
test('unloaded owned cell cannot publish an incomplete replacement',()=>{
  let loaded=true;const {cache,put,spec}=fixture({isLoaded:x=>x!==2||loaded});
  put(0);put(2);spec('a',[0,2]);cache.invalidate(['a']);cache.step();const old=cache.get('a');
  loaded=false;cache.invalidate(['a']);assert.deepEqual(cache.step().deferred,[{id:'a',reason:'unavailable'}]);
  assert.equal(cache.get('a'),old);loaded=true;cache.step();assert.notEqual(cache.get('a'),old);
});
