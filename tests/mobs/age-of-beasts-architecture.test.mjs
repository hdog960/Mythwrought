import test from 'node:test';
import assert from 'node:assert/strict';
import {speciesRegistry} from '../../src/mobs/species.mjs';
import {APPROVED} from '../../src/mobs/age-of-beasts/roster-contract.mjs';
import {EXPANSION_BODY_LIMITS,planBodyVolume,inspectBodyVolume,bodiesOverlap} from '../../src/mobs/age-of-beasts/body-contract.mjs';
import {legacyIndex,approvedForBiome,normalizeExpansionCapabilities,createCompleteCandidateIndex,regionalWildCounts} from '../../src/mobs/age-of-beasts/catalog-index.mjs';
const big=Object.freeze({radius:2.5,height:6,collision:'aabb'});
const tiny=Object.freeze({radius:.2,height:.4,collision:'aabb'});
const cube=Object.freeze({boxes:[[0,0,0,1,1,1]]}),air=Object.freeze({boxes:[]});
function authority(overrides={}){return {revision:()=>1,resident:()=>true,shapeAt:()=>air,overlayBlocked:()=>false,...overrides};}
test('physical body boundaries and eight owner crossing with bounded work',()=>{
 assert.equal(planBodyVolume([0,-210,0],big).cells.length,216);
 assert.equal(planBodyVolume([0,-210.001,0],big),null);
 assert.equal(planBodyVolume([0,251.001,0],big),null);
 assert.ok(planBodyVolume([0,251,0],big));
 const p=planBodyVolume([16.1,18.3,16.1],big);
 assert.equal(p.cells.length,252);assert.equal(p.owners.length,8);
 assert.ok(p.owners.some(o=>o.kind==='upper')&&p.owners.some(o=>o.kind==='surface'));
 assert.equal(planBodyVolume([0,0,0],{...big,radius:2.51}),null);
 assert.equal(EXPANSION_BODY_LIMITS.maxCells,252);
});
test('authoritative body query rejects unknown, stale, partial and overlay collisions',()=>{
 let reads=0,rev=1;const p=[16.1,18.3,16.1];
 assert.equal(inspectBodyVolume(p,big,authority({shapeAt:()=>{reads++;return air;}})),'clear');assert.equal(reads,252);
 assert.equal(inspectBodyVolume(p,big,authority({resident:o=>o.kind!=='upper'})),'unknown');
 assert.equal(inspectBodyVolume(p,big,authority({shapeAt:(x,y,z)=>x===14&&y===18&&z===14?cube:air})),'solid');
 assert.equal(inspectBodyVolume(p,big,authority({shapeAt:()=>({boxes:[[0,0,0,2,1,1]]})})),'unknown');
 assert.equal(inspectBodyVolume(p,big,authority({overlayBlocked:()=>true})),'solid');
 assert.equal(inspectBodyVolume(p,big,authority({revision:()=>rev,shapeAt:()=>{rev++;return air;}})),'unknown');
 assert.equal(inspectBodyVolume(p,big,authority({overlayBlocked:()=>undefined})),'unknown');
 assert.equal(inspectBodyVolume(p,big,authority({shapeAt:()=>null})),'unknown');
 assert.equal(inspectBodyVolume(p,big,authority({revision:()=>NaN})),'unknown');
});
test('large-body overlap uses full AABB, not center distance',()=>{
 assert.equal(bodiesOverlap([0,0,0],big,[2.6,0,0],tiny),true);
 assert.equal(bodiesOverlap([0,0,0],big,[2.7,0,0],tiny),false);
 assert.equal(bodiesOverlap([0,0,0],big,[0,6,0],tiny),false);
 assert.equal(bodiesOverlap([0,0,0],big,[0,5.9,0],tiny),true);
});
const caps=(id,extra={})=>normalizeExpansionCapabilities(id,{body:tiny,depth:[-210,250],movement:['walk'],spawnSupport:['ground'],...extra});
test('catalog keeps original references and separates proposed requirements',()=>{
 assert.equal(legacyIndex.size,40);for(const s of speciesRegistry)assert.equal(legacyIndex.get(s.id),s);
 assert.equal(legacyIndex.get('griffin'),undefined);assert.equal(approvedForBiome('alpine').length,10);
 assert.throws(()=>createCompleteCandidateIndex([],[]));
 assert.throws(()=>caps('griffin'));
 assert.throws(()=>caps('bison',{mount:'ground'}));
 assert.throws(()=>caps('blind-cavefish'));
 assert.throws(()=>caps('ceiling-lurker'));
 assert.throws(()=>caps('bison',{depth:[-211,30]}));
 assert.throws(()=>caps('bison',{depth:[0,256.9]}));
 assert.equal(caps('griffin',{movement:['walk','fly'],spawnSupport:['air','ground'],mount:'aerial'}).mount,'aerial');
 assert.deepEqual(caps('blind-cavefish',{movement:['swim'],spawnSupport:['water']}).spawnSupport,['water']);
 assert.equal(caps('ceiling-lurker',{movement:['climb'],spawnSupport:['ceiling'],special:['ceiling-attachment']}).id,'ceiling-lurker');
});
test('100 structural records can be indexed, no partial admission or population inflation',()=>{
 const capabilities=APPROVED.map(s=>caps(s.id,s.id==='griffin'?{movement:['walk','fly'],spawnSupport:['air'],mount:'aerial'}:
 ['camel','unicorn'].includes(s.id)?{mount:'ground'}:s.id==='blind-cavefish'?{movement:['swim'],spawnSupport:['water']}:
 s.id==='ceiling-lurker'?{movement:['climb'],spawnSupport:['ceiling'],special:['ceiling-attachment']}:
 s.id==='cave-bat'?{movement:['fly'],spawnSupport:['ceiling'],special:['roost']} :{}));
 // Structural test fixtures, not implemented creatures or model evidence.
 const records=APPROVED.map((s,i)=>Object.freeze({id:s.id,displayName:s.displayName,classification:s.classification,implementation:'preview',
 render:Object.freeze({model:s.id}),body:capabilities[i].body,habitat:Object.freeze({biomes:Object.freeze([s.biome]),depth:capabilities[i].depth}),
 movement:Object.freeze({capabilities:capabilities[i].movement}),riding:Object.freeze({eligible:capabilities[i].mount!=='none'})}));
 const index=createCompleteCandidateIndex(records,capabilities);
 assert.equal(index.size,100);assert.equal(index.get('cow'),speciesRegistry[0]);assert.equal(index.get('griffin'),records.find(r=>r.id==='griffin'));
 assert.throws(()=>createCompleteCandidateIndex(records,capabilities.slice(1)));
 assert.throws(()=>createCompleteCandidateIndex(records.slice(1),capabilities));
 const entities=[{id:'a',species:index.get('bison'),homeChunk:'0,0,0'},{id:'b',species:index.get('bison'),homeChunk:'0,0,0',important:true},
 {id:'c',species:index.get('cow'),homeChunk:'0,0,0'},{id:'d',species:index.get('cow'),homeChunk:'1,0,0'}];
 assert.deepEqual([...regionalWildCounts(index,entities,'0,0,0',m=>m.id==='c')],[['bison',1]]);
 assert.throws(()=>regionalWildCounts(index,[...entities,entities[0]],'0,0,0'));
 assert.throws(()=>regionalWildCounts(legacyIndex,entities,'0,0,0'));
 assert.throws(()=>regionalWildCounts(index,Array.from({length:33},(_,i)=>({...entities[0],id:String(i)})),'0,0,0'));
});
