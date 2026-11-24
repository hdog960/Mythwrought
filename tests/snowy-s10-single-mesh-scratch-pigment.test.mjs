import test from 'node:test';
import assert from 'node:assert/strict';
import {createSnowS10MeshResidentPigment}
 from '../src/manual-biomes/snowy-s10-single-mesh-scratch-pigment.mjs';
import {previewSnowS6WinterTone}
 from '../src/manual-biomes/snowy-s6-winter-tone-proposal.mjs';
const args=(id=272)=>[-154,7,480,id,{top:7,id},id,3,0,false,false,undefined,undefined];
test('S10 all three winter materials exactly match accepted S6 RGB values',()=>{
 for(const id of [272,276,279]){
  const s=createSnowS10MeshResidentPigment(2026,()=>({name:'snow',weight:.913}));
  assert.deepEqual(s.colorAt(...args(id)),
    previewSnowS6WinterTone(2026,-154,480,id,.913).proposedLinearRgb);
  assert.deepEqual(s.stats(),{requests:1,climateReads:1,accepted:1});
 }
});
test('a single scratch reference is borrowed by all original vertices within a synchronous mesh',()=>{
 const s=createSnowS10MeshResidentPigment(2026,(x,z)=>({name:'snow',weight:x===-154 ? .92 : .7}));
 const a=s.colorAt(...args(272));
 const snapshot=[...a];
 const b=s.colorAt(-153,7,480,272,{top:7,id:272},272,3,0,false,false,
   undefined,undefined);
 assert.equal(a,b,'no per-visible-cap color array allocation allowed');
 assert.notDeepEqual([...b],snapshot,'scratch update must use actual world coordinate');
 assert.deepEqual(s.stats(),{requests:2,climateReads:2,accepted:2});
 assert.equal(s.scratchOwnedOnlyByThisSyncMesh,true);
});
test('original legacy, caves, source top, saved edits and overhead all fail closed',()=>{
 for(const [label,mutate] of [
  ['wood',a=>{a[3]=4;a[4]={top:7,id:4};a[5]=4}],
  ['leaves',a=>{a[3]=7;a[4]={top:7,id:7};a[5]=7}],
  ['stone',a=>{a[3]=3;a[4]={top:7,id:3};a[5]=3}],
  ['hardpan',a=>{a[3]=258;a[4]={top:7,id:258};a[5]=258}],
  ['caveTop',a=>a[10]=0],['caveBelow',a=>a[11]=0],
  ['editedCap',a=>a[8]=true],['editedSupport',a=>a[9]=true],
  ['unknown edit',a=>a[8]=undefined],['wrong sourceTop',a=>a[4]={top:8,id:272}],
  ['wrong cap',a=>a[5]=276],['missing support',a=>a[6]=0],
  ['covered by grove',a=>a[7]=7],['missing source',a=>a[4]=null]
 ]){
  const a=args();mutate(a);
  let climate=0;const s=createSnowS10MeshResidentPigment(2026,()=>{
    climate++;return {name:'snow',weight:.9}});
  assert.equal(s.colorAt(...a),undefined,label);
  assert.equal(climate,0,'protected '+label+' must reject before climate query');
 }
});
test('rejects non-snow and invalid climate source even when original cap passes',()=>{
 for(const result of [null,{name:'plains',weight:1},{name:'desert',weight:.8},
   {name:'mountain',weight:.8},{name:'snow',weight:-1},
   {name:'snow',weight:NaN},{name:'snow',weight:1.2}]){
  const s=createSnowS10MeshResidentPigment(179,()=>result);
  assert.equal(s.colorAt(...args()),undefined,JSON.stringify(result));
 }
});
test('one mesh session never leaks previous valid pigment into rejected next voxel',()=>{
 const s=createSnowS10MeshResidentPigment(2026,()=>({name:'snow',weight:1}));
 const a=s.colorAt(...args()),snapshot=[...a];
 assert.equal(s.colorAt(-153,7,480,258,{top:7,id:258},258,3,0,
   false,false,undefined,undefined),undefined);
 assert.deepEqual([...a],snapshot);
 assert.deepEqual(s.stats(),{requests:2,climateReads:1,accepted:1});
 assert.ok(Object.isFrozen(s));
});
test('separate mesh sessions cannot share mutable RGB between worlds or seeds',()=>{
 const a=createSnowS10MeshResidentPigment(179,()=>({name:'snow',weight:.9}));
 const b=createSnowS10MeshResidentPigment(2026,()=>({name:'snow',weight:.9}));
 const ca=a.colorAt(...args()),cb=b.colorAt(...args());
 assert.notEqual(ca,cb);
 assert.notDeepEqual(ca,cb);
 assert.equal(a.generatorUnregistered,true);
 assert.equal(b.realIphoneAcceptanceUnrun,true);
});
test('invalid original-world seeds and climate callback fail before using RGB',()=>{
 for(const [seed,fn] of [[1.5,()=>({})],[NaN,()=>({})],
   [2147483648,()=>({})],[179,null]]){
  assert.throws(()=>createSnowS10MeshResidentPigment(seed,fn),
    /exact original M7/);
 }
});
