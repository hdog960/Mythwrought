import test from 'node:test';
import assert from 'node:assert/strict';
import {snowS9PigmentAtVisibleOriginalCap as tint,
  SNOW_S9_RESEARCH_CONTRACT, SNOW_S9_ELIGIBLE_CAPS}
  from '../src/manual-biomes/snowy-s9-mesh-resident-pigment.mjs';
import {previewSnowS6WinterTone as reference}
  from '../src/manual-biomes/snowy-s6-winter-tone-proposal.mjs';
const witness=(overrides={})=>({
 seed:179,x:-144,y:8,z:528,id:276,sourceSurface:{top:8,id:276},
 observed:276,below:3,above:0,editedCap:false,editedSupport:false,
 caveCap:undefined,caveSupport:undefined,
 biomeAt:()=>({name:'snow',weight:.91}),...overrides
});
test('all three real original winter IDs reproduce the S6 palette exactly',()=>{
 for(const id of SNOW_S9_ELIGIBLE_CAPS){
  const w=witness({id,sourceSurface:{top:8,id},observed:id});
  assert.deepEqual(tint(w),reference(w.seed,w.x,w.z,id,.91).proposedLinearRgb);
 }
 assert.equal(SNOW_S9_RESEARCH_CONTRACT.noNewColumnCache,true);
 assert.equal(SNOW_S9_RESEARCH_CONTRACT.unregistered,true);
});
test('legitimate original edit, overhead, cave AIR, tree and unsupported caps fail closed',()=>{
 const o=witness();
 for(const [name,overrides] of [
  ['wrong ID',{id:3,observed:3,sourceSurface:{top:8,id:3}}],
  ['legacy wood',{id:4,observed:4,sourceSurface:{top:8,id:4}}],
  ['legacy leaves',{id:7,observed:7,sourceSurface:{top:8,id:7}}],
  ['wrong cap Y',{sourceSurface:{top:7,id:276}}],
  ['wrong cap ID',{sourceSurface:{top:8,id:272}}],
  ['not physically same',{observed:3}],
  ['cave top',{caveCap:0}],['cave support',{caveSupport:0}],
  ['original edit top',{editedCap:true}],
  ['original edit support',{editedSupport:true}],
  ['overhang leaves',{above:7}],['unsupported snow',{below:0}],
  ['unknown support edit',{editedSupport:undefined}],
  ['unknown source',{sourceSurface:null}]
 ])assert.equal(tint({...o,...overrides}),undefined,name);
});
test('retained grass, desert, mountain, plains, low weight and invalid climate refuse color',()=>{
 for(const region of [null,{name:'desert',weight:1},
   {name:'mountain',weight:1},{name:'plains',weight:1},
   {name:'snow',weight:-.01},{name:'snow',weight:1.01},
   {name:'snow',weight:NaN}]){
  assert.equal(tint(witness({biomeAt:()=>region})),undefined,
    JSON.stringify(region));
 }
});
test('rejects invalid coordinate source contracts before reading climate',()=>{
 for(const w of [null,{},witness({seed:1.5}),witness({x:100001}),
  witness({z:NaN}),witness({y:20}),witness({y:1}),
  witness({biomeAt:null})])
  assert.throws(()=>tint(w),/exact bounded original/);
});
test('at most one expensive climate read per original visible cap witness',()=>{
 let calls=0;
 const w=witness({biomeAt:()=>{calls++;return {name:'snow',weight:.9}}});
 assert.ok(tint(w));
 assert.equal(calls,1);
 calls=0;
 assert.equal(tint({...w,editedCap:true}),undefined);
 assert.equal(calls,0,'saved edit guard precedes climate');
 assert.equal(tint({...w,caveCap:0}),undefined);
 assert.equal(calls,0,'cave guard precedes climate');
 assert.equal(tint({...w,id:258,sourceSurface:{top:8,id:258},observed:258}),undefined);
 assert.equal(calls,0,'hardpan guard precedes climate');
});
test('pigment candidates cannot affect shader UV/material/mesh or player edits',()=>{
 assert.equal(SNOW_S9_RESEARCH_CONTRACT.pigmentRgbOnly,true);
 assert.equal(SNOW_S9_RESEARCH_CONTRACT.oldGeometryUvMaterialOwnedByOriginal,true);
 assert.equal(SNOW_S9_RESEARCH_CONTRACT.noPlayerAuthoredIceTint,true);
 assert.equal(tint(witness({editedCap:true})),undefined);
 const rgb=tint(witness());
 assert.ok(Object.isFrozen(rgb));
 assert.ok(rgb.every(c=>c>=0&&c<=1&&Number.isFinite(c)));
});
