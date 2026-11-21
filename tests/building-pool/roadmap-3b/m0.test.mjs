import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BIOMES,SIZES,TYPES,TOTAL_DESIGNS,IMPORTED_LEGACY_DESIGNS,CREATOR_ACCEPTED,INTEGRATED_DESIGNS,slots,assertSlot} from '../../../src/building-pool/roadmap-3b/roster.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validateBlueprint,validatePool,geometryFingerprint,serializeBlueprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';
import {createLegacyWatchtowerBlueprint,createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
const provenance=JSON.parse(readFileSync(new URL('../../../docs/building-pool/roadmap-3b/M0_WATCHTOWER_IMPORT.json',import.meta.url),'utf8'));
const pool=createLegacyWatchtowerPool();
test('3B exclusively allocates 360 non-overlapping category × biome × size × variation slots',()=>{
 assert.equal(TOTAL_DESIGNS,360);assert.equal([...slots()].length,360);
 assert.deepEqual(Object.fromEntries(TYPES.map(t=>[t.key,t.perSizeBiome*15])),{
  lumberyard:60,mill:60,watchtower:75,barracks:60,gatehouse:60,'city-wall':45
 });
 const ids=[...slots()].map(x=>x.id);assert.equal(new Set(ids).size,360);
 for(const biome of BIOMES)for(const size of SIZES)
  assert.equal([...slots()].filter(s=>s.biome===biome&&s.size===size).length,24);
 assert.throws(()=>assertSlot('blacksmith','temperate','small',1),/not allocated/);
 assert.equal(IMPORTED_LEGACY_DESIGNS,15);assert.equal(CREATOR_ACCEPTED,0);assert.equal(INTEGRATED_DESIGNS,0);
});
test('only original PR 122 watchtower IDs are imported; no blacksmith or sibling designs',()=>{
 assert.equal(pool.length,15);
 assert.deepEqual(validatePool(pool,ASSET_CATALOG),{authored:15,remaining:345});
 assert.equal(provenance.importedCount,15);
 assert.equal(new Set(pool.map(b=>b.id)).size,15);
 for(const b of pool){assert.equal(b.type,'watchtower');assert.equal(b.variant,1);
  assert.match(b.id,/^r3:watchtower:/);assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
  assert.ok(b.modules.every(m=>m.cells.length&&m.cells.every(c=>c.length===4)));
 }
 for(const biome of BIOMES)for(const size of SIZES)
  assert.equal(pool.filter(b=>b.biome===biome&&b.size===size).length,1);
});
test('legacy source-exact watchtower occupied coordinates, envelopes and snow stair metadata match audited original PR 122 manifest',()=>{
 let count=0;
 for(const b of pool){
  const row=provenance.designs.find(d=>d.id===b.id);assert.ok(row,b.id);
  const stats=validateBlueprint(b,ASSET_CATALOG);
  assert.equal(stats.cellCount,row.occupiedCoordinates,b.id);
  assert.deepEqual(b.envelope,row.envelope,b.id);
  assert.equal(b.architecture.roofStyle,row.roofStyle,b.id);
  assert.equal(b.architecture.stairSteps,row.stairSteps,b.id);
  assert.ok(b.modules.some(m=>m.role==='stair-support'),b.id);
  assert.ok(b.modules.some(m=>m.role==='battlement'),b.id);
  assert.ok(b.spaces.some(s=>s.kind==='observation'),b.id);
  assert.equal(row.originalId,b.id);
  count+=stats.cellCount;
 }
 assert.equal(count,provenance.importedWatchtowerCoordinates);
 assert.equal(provenance.legacyCombinedM1CoordinateSlots,71293);
});
test('watchtower geometry is deterministic, architecturally distinct and serializable',()=>{
 const repeated=createLegacyWatchtowerPool();
 assert.equal(new Set(pool.map(geometryFingerprint)).size,15);
 for(let i=0;i<15;i++)assert.equal(serializeBlueprint(pool[i]),serializeBlueprint(repeated[i]));
});
test('every imported family reference remains catalogued without inventing physical variant fit or live-world placement',()=>{
 for(const b of pool)for(const m of b.modules)for(const [x,y,z,ref] of m.cells){
  assert.ok([x,y,z].every(Number.isSafeInteger));
  const a=ASSET_CATALOG[ref];assert.ok(a,b.id+' '+ref);
  if(a.kind!=='existing'){assert.equal(a.dimensions,null);assert.equal(a.persistentId,null);}
 }
});
