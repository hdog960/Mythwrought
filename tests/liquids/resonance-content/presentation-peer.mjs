import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {RESONANCE_MATERIAL,createResonancePresentation} from '../../../src/liquids/liquid-resonance/content/presentation.mjs';
async function peer(variable,sha){const p=resolve(process.env[variable]??'');const b=readFileSync(p);assert.equal(createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha);return import(pathToFileURL(p).href);}
const {planLiquidDraws}=await peer('LIQUID_DRAW_MODULE','b5487f525bdc1f494cbdbffa1f0d7d9f66d7b51d');
const physics=await peer('RESONANCE_PHYSICS_MODULE','9bc356d7335ec65a64786876e8b8094643a26fcb');
const group={id:'liquid-resonance',positions:new Float32Array([0,.5,0,0,.5,1,1,.5,1,1,.5,0]),normals:new Float32Array([0,1,0,0,1,0,0,1,0,0,1,0]),indices:new Uint32Array([0,1,2,0,2,3])};
const batch=(id,x,revision=1)=>Object.freeze({id,revision,mesh:{version:1,origin:[x,0,0],faceCount:1,groups:[group]}});
function fixture(over={}){
  let epoch=1,loaded=true,ready=true;
  const a=batch('a',15),b=batch('b',16),map=new Map([['a',a],['b',b]]),selection=[{batch:a,cells:[[15,0,0]]},{batch:b,cells:[[16,0,0]]}];
  const opts={physics,readCell:(x,y,z)=>({x,y,z,id:'liquid-resonance',units:4,quantities:physics.resonanceQuantities(4,x===15?4096:0)}),isLoaded:()=>loaded,isOpen:()=>true,getBatch:id=>map.get(id),isBatchReady:()=>ready,ownsCell:(id,x)=>id===(x===15?'a':'b'),readEpoch:()=>epoch,...over};
  return {a,b,map,selection,opts,api:createResonancePresentation(opts),bump:()=>epoch++,unload:()=>{loaded=false;epoch++;},invalidate:()=>{ready=false;epoch++;}};
}
const build=(f,extra={})=>f.api.build({selection:f.selection,origin:[15,0,0],...extra});
test('actual shared draw planner accepts distinct transparent material and revisions',()=>{
  const f=fixture(),r=planLiquidDraws({batches:[f.a,f.b],materials:{'liquid-resonance':RESONANCE_MATERIAL},camera:[0,0,0],forward:[1,0,0]});
  assert.deepEqual(r.transparent.map(x=>[x.batchId,x.revision]),[['b',1],['a',1]]);assert.equal(r.opaque.length,0);
  assert.equal(RESONANCE_MATERIAL.depthWrite,false);assert.equal(RESONANCE_MATERIAL.emissive,.12);
});
test('one frame budget across owners, actual A energy and zero-energy material',()=>{
  const f=fixture({maxCells:2,maxSegments:16,maxParticles:4}),r=build(f);
  assert.equal(r.allocatedBytes,528);assert.equal(r.effects.segmentCount,16);assert.equal(r.effects.particleCount,2);
  assert.deepEqual(r.bindings,[{id:'a',revision:1},{id:'b',revision:1}]);
  assert.equal(r.effects.segments[6],1);assert.ok(Math.abs(r.effects.segments[8*7+6]-.12)<1e-6);
  assert.ok(f.api.isCurrent(r));assert.ok(Object.isFrozen(r.bindings));
});
test('previous-good mesh is insufficient after dirty admission or epoch change',()=>{
  const f=fixture(),r=build(f);f.invalidate();assert.equal(f.api.isCurrent(r),false);assert.equal(build(f),null);
  const g=fixture(),s=build(g);g.bump();assert.equal(g.api.isCurrent(s),false);
});
test('replacement, retired cache, forged and foreign frame rejected',()=>{
  const f=fixture(),r=build(f),g=fixture();assert.equal(g.api.isCurrent(r),false);assert.equal(f.api.isCurrent({...r}),false);
  f.map.set('a',batch('a',15,2));assert.equal(f.api.isCurrent(r),false);assert.equal(build(f),null);
  const h=fixture(),s=build(h);h.map.delete('b');assert.equal(h.api.isCurrent(s),false);
});
test('owner mismatch, duplicate ownership, malformed height and aggregate candidate cap',()=>{
  const f=fixture({maxCandidates:2});assert.equal(build(f,{selection:[{batch:f.a,cells:[[16,0,0]]}]}),null);
  assert.throws(()=>build(f,{selection:[{batch:f.a,cells:[[15,0,0],[15,0,0]]}]}),TypeError);
  assert.throws(()=>build(f,{selection:[{batch:f.a,cells:[[15,257,0]]}]}),TypeError);
  assert.throws(()=>build(f,{selection:[{batch:f.a,cells:[[15,0,0],[15,1,0]]},{batch:f.b,cells:[[16,0,0]]}]}),RangeError);
});
test('unloaded cells are not read and a mid-build epoch change discards the result',()=>{
  let reads=0;const f=fixture({readCell:()=>{reads++;return null;}});f.unload();assert.equal(build(f).effects.cells,0);assert.equal(reads,0);
  let g;g=fixture({readCell:()=>{g.bump();return null;}});assert.equal(build(g),null);
});
test('shared cap counts backing buffers even when output is empty; phase is deterministic',()=>{
  const f=fixture(),a=build(f,{phase:.25}),b=build(f,{phase:.25});assert.deepEqual(a.effects.segments,b.effects.segments);assert.equal(a.allocatedBytes,25344);
  const g=fixture({maxCells:0,maxSegments:0,maxParticles:0});assert.equal(build(g).allocatedBytes,0);
});
