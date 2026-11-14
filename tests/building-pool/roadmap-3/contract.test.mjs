import test from 'node:test';
import assert from 'node:assert/strict';
import {BIOMES,SIZES,TYPES,TOTAL_DESIGNS,slots,assertSlot,slotId} from '../../../src/building-pool/roadmap-3/roster.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3/assets.mjs';
import {validateBlueprint,validatePool,serializeBlueprint,geometryFingerprint} from '../../../src/building-pool/roadmap-3/contract.mjs';
const cell=(x,y,z,ref='builtin:stone')=>[x,y,z,ref];
function blueprint(variant=1, shift=0){
  return {
    id:slotId('blacksmith','temperate','small',variant),type:'blacksmith',biome:'temperate',size:'small',variant,status:'theoretical',
    envelope:{x:0,y:0,z:0,width:12+shift,height:8,depth:12},
    modules:[
      {id:'base',role:'foundation',cells:[cell(0,0,0)]},
      {id:'floor',role:'floor',cells:[cell(4+shift,0,4,'pack1:007')]},
      {id:'walls',role:'wall',cells:[cell(0,1,5,'pack1:002')]},
      {id:'roof',role:'roof',cells:[cell(0,6,5,'pack3:023')]}
    ],
    clearances:[{x:5,y:1,z:0,width:2,height:3,depth:8}],
    openings:[{id:'south-entrance',facing:'south',x:5,y:1,z:0,width:2,height:3}],
    spaces:[{id:'workshop',kind:'workshop',bounds:{x:4,y:1,z:2,width:4,height:3,depth:5},accessNode:'forge'}],
    navigation:{entry:'entry',nodes:[
      {id:'entry',kind:'entry',x:5,y:1,z:0,width:2,headroom:2},
      {id:'forge',kind:'work',x:5,y:1,z:4,width:2,headroom:2}
    ],edges:[{from:'entry',to:'forge',kind:'level'}]},
    features:[{name:'anvil',position:[8,1,4],assetRef:'pack5:088'},{name:'rotor',position:[9,1,4],assetRef:null,unresolvedDependency:'No planned mill rotor family; geometry only'}]
  };
}
const clone=x=>structuredClone(x);
test('11 category distribution is exactly 705; M2 225, M3 240, M4 240',()=>{
 assert.equal(TYPES.length,11);assert.equal(TOTAL_DESIGNS,705);
 const all=[...slots()];assert.equal(all.length,705);assert.equal(new Set(all.map(x=>x.id)).size,705);
 assert.deepEqual([2,3,4].map(m=>all.filter(x=>x.milestone===m).length),[225,240,240]);
 for(const type of TYPES)for(const biome of BIOMES)for(const size of SIZES){
   assert.equal(all.filter(x=>x.type===type.key&&x.biome===biome&&x.size===size).length,type.perSizeBiome);
 }
});
test('reject unallocated building identities and variants',()=>{
 assert.throws(()=>assertSlot('castle','desert','large',1));
 assert.throws(()=>assertSlot('blacksmith','desert','large',6));
 assert.throws(()=>assertSlot('blacksmith','desert','giant',1));
});
test('blueprint has physical geometry, navigation and named symbolic materials',()=>{
 const res=validateBlueprint(blueprint(),ASSET_CATALOG);
 assert.equal(res.cellCount,4);assert.equal(res.notIntegrated,true);
 assert.equal(validatePool([blueprint()],ASSET_CATALOG).remaining,704);
});
test('stable serialization across object insertion order',()=>{
 const b=blueprint();const rearranged={features:b.features,...b};
 assert.equal(serializeBlueprint(b),serializeBlueprint(rearranged));
});
test('no invented persistent IDs or asset dimensions for candidates',()=>{
 assert.equal(ASSET_CATALOG['pack5:088'].persistentId,null);
 assert.equal(ASSET_CATALOG['biome130:096'].dimensions,null);
 assert.throws(()=>validateBlueprint({...blueprint(),modules:[{id:'base',role:'foundation',cells:[cell(0,0,0,'pack5:999')]},...blueprint().modules.slice(1)]},ASSET_CATALOG),/unknown physical asset/);
});
test('reject duplicate occupied cells, buried passages, malformed heights',()=>{
 const b=blueprint();b.modules[1].cells.push(cell(0,0,0));
 assert.throws(()=>validateBlueprint(b,ASSET_CATALOG),/two physical blocks/);
 const c=blueprint();c.modules[0].cells.push(cell(5,2,1));
 assert.throws(()=>validateBlueprint(c,ASSET_CATALOG),/obstructs/);
 const d=blueprint();d.openings[0].width=1;
 assert.throws(()=>validateBlueprint(d,ASSET_CATALOG),/insufficient/);
});
test('reject unreachable rooms and fake multi-level stair links',()=>{
 const b=blueprint();b.navigation.edges=[];
 assert.throws(()=>validateBlueprint(b,ASSET_CATALOG),/unreachable/);
 const c=blueprint();c.navigation.edges[0].kind='stair';
 assert.throws(()=>validateBlueprint(c,ASSET_CATALOG),/stairs must rise/);
});
test('palette swaps and renames alone cannot count as new architecture',()=>{
 const a=blueprint(1),b=blueprint(2);
 b.modules[1].cells[0][3]='builtin:wood';
 b.spaces[0].kind='storage';b.navigation.nodes[1].kind='storage';b.openings[0].facing='north';
 assert.equal(geometryFingerprint(a),geometryFingerprint(b));
 assert.throws(()=>validatePool([a,b],ASSET_CATALOG),/repeated architectural geometry/);
 const c=blueprint(2,1);
 assert.notEqual(geometryFingerprint(a),geometryFingerprint(c));
 assert.equal(validatePool([a,c],ASSET_CATALOG).authored,2);
});
test('require explicit unresolved fixture dependency instead of pretending machine exists',()=>{
 const b=blueprint();b.features[1].unresolvedDependency='';
 assert.throws(()=>validateBlueprint(b,ASSET_CATALOG),/unresolved fixture/);
});
test('require accessible observation on towers and gateway in gatehouses',()=>{
 for(const [type,pattern] of [['watchtower',/fortifications require/],['gatehouse',/fortifications require/],['city-wall',/fortifications require/]]){
  const b=blueprint();b.type=type;b.id=slotId(type,'temperate','small',1);
  assert.throws(()=>validateBlueprint(b,ASSET_CATALOG),pattern);
 }
});
test('east/west door width uses z extent; duplicate modules are invalid',()=>{
 const b=blueprint();b.openings[0].facing='east';assert.doesNotThrow(()=>validateBlueprint(b,ASSET_CATALOG));
 b.openings[0].z=11;assert.throws(()=>validateBlueprint(b,ASSET_CATALOG),/outside envelope/);
 const c=blueprint();c.modules[1].id=c.modules[0].id;
 assert.throws(()=>validateBlueprint(c,ASSET_CATALOG),/duplicate structural module/);
});