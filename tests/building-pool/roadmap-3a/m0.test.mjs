import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BIOMES,SIZES,TYPES,TOTAL_DESIGNS,LEGACY_CANDIDATES,UNAUTHORED,slots,slotId,assertSlot} from '../../../src/building-pool/roadmap-3a/roster.mjs';
import {validateBlueprint,validateAuthoredPool} from '../../../src/building-pool/roadmap-3a/contract.mjs';
const legacy=JSON.parse(readFileSync(new URL('../../../docs/building-pool/roadmap-3a/LEGACY_BLACKSMITHS.json',import.meta.url),'utf8'));
test('exclusive five categories × five biomes × three sizes = 345 exact identities',()=>{
 const all=[...slots()],ids=new Set(all.map(s=>s.id));
 assert.equal(all.length,TOTAL_DESIGNS);assert.equal(ids.size,345);
 assert.equal(TOTAL_DESIGNS,LEGACY_CANDIDATES+UNAUTHORED);
 assert.deepEqual(Object.fromEntries(TYPES.map(t=>[t.key,all.filter(s=>s.type===t.key).length])),
 {blacksmith:75,armorer:75,carpenter:75,stonemason:60,'mining-workshop':60});
 for(const t of TYPES)for(const biome of BIOMES)for(const size of SIZES)
 assert.equal(all.filter(s=>s.type===t.key&&s.biome===biome&&s.size===size).length,t.perCombination);
});
test('15 blacksmith IDs remain byte-for-byte the legacy identity namespace, not duplicated',()=>{
 const all=[...slots()],old=all.filter(s=>s.legacy);
 assert.equal(old.length,15);
 assert.deepEqual(new Set(old.map(s=>s.id)),new Set(legacy.candidates.map(c=>c.originalId)));
 assert.equal(all.filter(s=>s.id.startsWith('r3:')&&!s.legacy).length,0);
 assert.ok(all.filter(s=>!s.legacy).every(s=>s.id.startsWith('r3a:')));
});
test('PR 122 provenance is pinned and all fifteen original coordinate models have been selectively staged',()=>{
 assert.equal(legacy.sourcePR,122);assert.match(legacy.sourcePRHead,/^[0-9a-f]{40}$/);
 assert.match(legacy.sourceM1Blob,/^[0-9a-f]{40}$/);
 assert.match(legacy.sourceManifestBlob,/^[0-9a-f]{40}$/);
 assert.equal(legacy.candidates.length,15);
 assert.equal(legacy.creatorAccepted,0);assert.equal(legacy.integrated,0);
 for(const c of legacy.candidates){
  assert.equal(c.newId,c.originalId);assert.equal(c.geometryCopied,true);
  assert.equal(c.fingerprintVerified,true);assert.ok(c.occupiedCoordinates>1000);
  assert.ok(c.envelope.width>0&&c.envelope.height>0&&c.envelope.depth>0);
 }
});
test('disallow sibling categories, unknown variants, and out-of-range slots',()=>{
 for(const type of ['watchtower','lumberyard','mill','gatehouse','city-wall','barracks','house'])
  assert.throws(()=>assertSlot(type,'temperate','small',1),RangeError);
 for(const v of [0,-1,6,1.5,NaN])assert.throws(()=>slotId('blacksmith','temperate','small',v),RangeError);
 assert.throws(()=>slotId('stonemason','temperate','small',5),RangeError);
 assert.throws(()=>slotId('blacksmith','volcano','small',1),RangeError);
});
const valid=()=>({
 id:'r3a:carpenter:temperate:small:1',type:'carpenter',biome:'temperate',size:'small',variant:1,
 status:'theoretical',activated:false,envelope:{x:0,y:0,z:0,width:6,height:5,depth:6},
 modules:[
 {id:'foundation',role:'foundation',cells:[[0,0,0,'live:stone']]},
 {id:'floor',role:'floor',cells:[[1,0,1,'pack1:007']]},
 {id:'wall',role:'wall',cells:[[0,1,1,'pack1:002']]},
 {id:'roof',role:'roof',cells:[[1,4,1,'pack3:023']]}
 ],
 openings:[{kind:'entrance',x:2,y:1,z:5}],
 spaces:[{id:'shop',kind:'woodworking',bounds:{x:1,y:1,z:1,width:3,height:3,depth:3},accessNode:'shop'}],
 navigation:{entry:'entry',nodes:[{id:'entry',x:2,y:1,z:5,width:2,headroom:2},{id:'shop',x:2,y:1,z:2,width:2,headroom:2}],
 edges:[{from:'entry',to:'shop',kind:'level'}]},dependencies:['pack1:007']
});
test('strict contract distinguishes coordinate-authored physical plans from mere metadata',()=>{
 assert.equal(validateBlueprint(valid()).coordinateCells,4);
 assert.equal(validateAuthoredPool([valid()]).authored,1);
 assert.throws(()=>validateBlueprint({...valid(),modules:[]}),/coordinate-authored/);
 const b=valid();b.modules[1].cells=[[0,0,0,'pack1:007']];
 assert.throws(()=>validateBlueprint(b),/overlap/);
 assert.throws(()=>validateAuthoredPool([valid(),valid()]),/duplicate blueprint/);
});
test('fail closed on unregistered symbolic syntax and unreachable rooms',()=>{
 const a=valid();a.modules[0].cells[0][3]='imaginary:block';assert.throws(()=>validateBlueprint(a),/symbolic family/);
 const b=valid();b.navigation.edges=[];assert.throws(()=>validateBlueprint(b),/unreachable room/);
 const c=valid();c.productionRegistered=true;assert.throws(()=>validateBlueprint(c),/no invented persistent IDs/);
});
