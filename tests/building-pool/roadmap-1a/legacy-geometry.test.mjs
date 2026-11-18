import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {BIOMES,SIZES,QUOTAS,validateBlueprint,validatePool,structuralFingerprint,stableBlueprintJSON} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
const oracle=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-1a/legacy-reference.json',import.meta.url),'utf8'));
const fnv=x=>{let h=0xcbf29ce484222325n;for(let i=0;i<x.length;i++){h^=BigInt(x.charCodeAt(i));h=BigInt.asUintN(64,h*0x100000001b3n);}return h.toString(16).padStart(16,'0');};
const buildings=getM1Blueprints(),byId=new Map(buildings.map(b=>[b.id,b]));
test('the independent 1A module compiles exactly 30 coordinate-authored source candidates with zero stable carryover',()=>{
  assert.deepEqual(QUOTAS,{house:20,tavern:5,inn:5});
  assert.equal(buildings.length,30);assert.equal(byId.size,30);
  assert.equal(oracle.originalHead,'88a9e410a0eda7cf961cb6b624241666eb3a48a1');
  assert.equal(oracle.rows.length,30);assert.equal(oracle.totalPlacements,33555);
  assert.equal(buildings.reduce((s,b)=>s+b.placements.length,0),33555);
  assert.equal(validatePool(buildings).authored,30);
  for(const category of ['house','tavern'])for(const biome of BIOMES)for(const [i,size] of SIZES.entries())
    assert.ok(byId.has('r1:'+category+':'+biome+':'+size+':'+String(i+1).padStart(3,'0')));
  assert.ok(buildings.every(b=>b.category!=='stable'&&!b.id.includes(':stable:')));
});
for(const expected of oracle.rows){
  test('exact-original per-building geometry fingerprint and complete data: '+expected.id,()=>{
    const b=byId.get(expected.id);assert.ok(b);assert.equal(validateBlueprint(b),true);
    assert.equal(b.title,expected.title);
    assert.deepEqual(b.footprint,expected.footprint);
    assert.equal(b.placements.length,expected.placementCount);
    assert.equal(b.rooms.length,expected.roomCount);
    assert.equal(b.walkable.length,expected.walkableCount);
    assert.equal(fnv(structuralFingerprint(b)),expected.geometryFingerprint);
    assert.equal(fnv(stableBlueprintJSON(b)),expected.completeFingerprint);
    assert.deepEqual(b.architecturalIdentity.daylightOpening?.cell??null,expected.daylightCell);
    assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
  });
}
test('original full-height walkable access, intentional entrance/roof/openings and dependency lists',()=>{
  for(const b of buildings){
    const occ=new Set(b.placements.map(p=>p.at.join(',')));
    const walk=new Set(b.walkable.map(p=>p.join(',')));
    for(const role of ['foundation','wall','roof','support','window','door','furnishing'])
      assert.ok(b.placements.some(p=>p.role===role),b.id+': '+role);
    for(const [x,y,z] of b.walkable)assert.ok(!occ.has([x,y,z].join(','))&&!occ.has([x,y+1,z].join(',')),b.id+': head/feet clash');
    for(const p of b.portals){assert.equal(p.opening,'hinged-leaf');assert.ok(walk.has(p.at.join(',')));}
    const pending=[...new Set(b.placements.filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset))].sort();
    assert.deepEqual(pending,b.dependencies.map(d=>d.asset).sort());
    assert.ok(b.dependencies.every(d=>d.status==='unresolved'));
  }
});
test('both 1A daylight apertures are truly open; third original skylight belongs to 1B',()=>{
  const apertures=buildings.filter(b=>b.architecturalIdentity.daylightOpening);
  assert.deepEqual(apertures.map(b=>b.id).sort(),['r1:house:enchanted-forest:medium:002','r1:tavern:enchanted-forest:small:001']);
  for(const b of apertures){
    const [x,y,z]=b.architecturalIdentity.daylightOpening.cell;
    const occ=new Set(b.placements.map(p=>p.at.join(',')));
    for(let level=1;level<=y;level++)assert.equal(occ.has([x,level,z].join(',')),false,b.id+' obstruction '+level);
    assert.equal(b.architecturalIdentity.daylightOpening.weatherSealApproved,false);
    assert.equal(b.architecturalIdentity.daylightOpening.daylightApproved,false);
  }
});
test('no exact D4 mirrored or rotated geometry duplicates among the 30 inherited buildings',()=>{
  assert.deepEqual(findMirroredOrRotatedDuplicates(buildings),[]);
});
