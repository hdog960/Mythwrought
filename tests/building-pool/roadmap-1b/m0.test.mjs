import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {BIOMES,SIZES,QUOTAS,TARGET,blueprintId,validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-1b/legacy-inheritance.json',import.meta.url),'utf8'));
test('seven owned categories have 435 exact 15-combination slots',()=>{
 assert.equal(TARGET,435);assert.equal(BIOMES.length,5);assert.equal(SIZES.length,3);
 assert.deepEqual(Object.keys(QUOTAS).sort(),['bathhouse','stable','farm-barn','greenhouse','fishing-lodge','harbor-office','lighthouse'].sort());
 assert.equal(Object.values(QUOTAS).reduce((a,b)=>a+b,0),29);
});
test('legacy stable IDs and literal source provenance remain exact',()=>{
 const a=getInheritedStables();assert.equal(a.length,15);assert.equal(ledger.entries.length,15);
 const ids=new Set(a.map(b=>b.id));assert.equal(ids.size,15);
 for(const row of ledger.entries){assert.ok(ids.has(row.legacyId));assert.match(row.sourceGeneratorBlob,/^[a-f0-9]{40}$/);assert.match(row.sourceDesignBlob,/^[a-f0-9]{40}$/)}
 assert.ok(a.every(b=>b.category==='stable'&&!['house','tavern'].includes(b.category)));
});
test('genuine 3D authored stables, four actual empty bay portals, independent deterministic geometry',()=>{
 const a=getInheritedStables(),b=getInheritedStables(),fingerprints=new Set();
 for(let i=0;i<a.length;i++){
  const x=a[i];assert.equal(validateBlueprint(x),true);assert.equal(stableBlueprintJSON(x),stableBlueprintJSON(b[i]));
  assert.ok(x.placements.length>200);assert.ok(x.rooms.length>=5);assert.ok(x.walkable.length>0);
  assert.ok(x.placements.some(p=>p.role==='foundation'));assert.ok(x.placements.some(p=>p.role==='roof'));
  assert.equal(x.portals.filter(p=>p.opening==='open-stall-bay').length,4);
  assert.deepEqual(x.animals,[]);assert.equal(x.worldPlacement,false);assert.equal(x.liveIntegration,false);
  fingerprints.add(structuralFingerprint(x));
 }
 assert.equal(fingerprints.size,15);assert.equal(validateAllocation(a).remaining,420);
});
test('identity preservation / strict no-overlap with Builder 1A',()=>{
 const a=getInheritedStables();for(const biome of BIOMES)for(const size of SIZES){
   const id=blueprintId('stable',biome,size,SIZES.indexOf(size)+1);assert.ok(a.some(b=>b.id===id));
 }
 assert.throws(()=>blueprintId('house','temperate','small',1));assert.throws(()=>blueprintId('stable','temperate','small',6));
});
