// Native integration with actual Amber Sap A retention policy, no core solver copy.
// AMBER_RETENTION_ROOT must contain pinned definition.mjs and retention.mjs.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {sampleAmberAdhesionVisual as sample} from '../../../src/liquids/amber-sap/content/adhesion-visual.mjs';
const root=process.env.AMBER_RETENTION_ROOT;
assert.ok(root,'Missing pinned Amber Sap A modules');
for(const [file,sha] of [['definition.mjs','d44b2d5e5c561f5faf78961de0d39ec23e812b31'],['retention.mjs','91aea9c19fa427b45d1be35cd23f9d0d359b12f3']]){
  const bytes=await readFile(resolve(root,file));
  assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),sha);
}
const {createSapRetentionPolicy}=await import(pathToFileURL(resolve(root,'retention.mjs')).href);
const key=p=>p.join(',');
function fixture({units=4,y=20,enabled=true,id='amber-sap'}={}){
  const p=[15,y,0],cell=Object.freeze({x:p[0],y,z:0,id,units,quantities:Object.freeze({})});
  const solids=new Set(),unloaded=new Set(),nonadhesive=new Set(),cells=new Map([[key(p),cell]]);
  const isLoaded=(...q)=>!unloaded.has(key(q)),isOpen=(...q)=>!solids.has(key(q));
  const retention=createSapRetentionPolicy({isLoaded,isOpen,isSolid:(...q)=>solids.has(key(q)),
    isAdhesive:(...q)=>!nonadhesive.has(key(q)),enabled});
  const opts={engine:{getCell:(...q)=>cells.get(key(q))??null},retention,isLoaded,isOpen,x:p[0],y,z:0};
  return {p,cell,solids,unloaded,nonadhesive,cells,opts,read:()=>sample(opts)};
}
test('actual retention produces bounded golden edge locations at exact partial fill',()=>{
  const f=fixture();for(const p of [[16,20,0],[15,20,1],[14,20,0],[15,20,-1]])f.solids.add(key(p));
  const v=f.read();assert.equal(v.fill,.5);assert.equal(v.strength,.25);
  assert.deepEqual(v.origin,f.p);assert.deepEqual(v.edges.map(e=>e.face),['east','south','west','north']);
  assert.ok(v.edges.every(e=>e.points.every(([x,y,z])=>x>0&&x<1&&z>0&&z<1&&y===.5)));
  assert.ok(Object.isFrozen(v.edges[0].points[0]));assert.equal(f.cells.get(key(f.p)),f.cell);
});
test('support removal, unloading, or ineligible material clears its cue immediately',()=>{
  const f=fixture(),east='16,20,0';f.solids.add(east);assert.equal(f.read().edges.length,1);
  f.nonadhesive.add(east);assert.equal(f.read(),null);f.nonadhesive.clear();
  f.unloaded.add(east);assert.equal(f.read(),null);f.unloaded.clear();
  f.solids.delete(east);assert.equal(f.read(),null);
});
test('partial ceiling air gap preserves side cue; full covered surface emits none',()=>{
  for(const units of [1,4,8]){
    const f=fixture({units});f.solids.add('16,20,0');f.solids.add('15,21,0');
    assert.equal(f.read()?.edges.length??0,units===8?0:1);
    f.solids.delete('15,21,0');assert.equal(f.read().fill,units/8);
    if(units===8){f.cells.set('15,21,0',{id:'water'});assert.equal(f.read(),null);}
  }
});
test('disabled, foreign, unloaded and physical ceiling states cannot emit cues',()=>{
  for(const cfg of [{enabled:false},{id:'water'},{units:8,y:256}]){
    const f=fixture(cfg);f.solids.add(key([16,f.p[1],0]));assert.equal(f.read(),null);
  }
  const f=fixture();f.solids.add('16,20,0');f.unloaded.add(key(f.p));assert.equal(f.read(),null);
});
test('malformed signal is rejected instead of drawing misleading contact',()=>{
  const f=fixture();for(const signal of [{faces:['east','east'],reservedUnits:1,movableUnits:3},
    {faces:['top'],reservedUnits:1,movableUnits:3},{faces:['east'],reservedUnits:5,movableUnits:0}])
    assert.throws(()=>sample({...f.opts,retention:{describe:()=>signal}}),TypeError);
});
