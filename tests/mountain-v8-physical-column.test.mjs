import test from 'node:test';
import assert from 'node:assert/strict';
import {planMountainV8PhysicalColumn as plan,MOUNTAIN_V8_COLUMN_WRITE_LIMIT as LIMIT} from '../src/manual-biomes/mountain-v8-physical-column.mjs';
const ids={AIR:0,GRASS:1,DIRT:2,STONE:3};
const sample=(legacyTop=6,top=11,cap='alpine-grass')=>({x:-512,z:16,legacyTop,top,cap,safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'});
const source=(x,y,z)=>y>6?ids.AIR:y===6?ids.GRASS:ids.DIRT;
const cfg={worldMaxY:19,ids,readOriginalBlock:source};
test('authored uplift gives meadow two dirt layers over deep mineable stone',()=>{
 const out=plan(sample(),cfg);assert.ok(out);assert.equal(out.estimatedCells,6);
 assert.deepEqual(out.writes.map(c=>c.y),[6,7,8,9,10,11]);
 assert.deepEqual(out.writes.map(c=>c.material),['stone','stone','stone','dirt','dirt','alpine-grass']);
 assert.equal(out.requiresApprovedV8BlockMapping,true);assert.equal(out.safeToIntegrate,false);
});
test('unchanged cap requires only one natural material write',()=>{
 const out=plan(sample(6,6,'slate'),cfg);assert.equal(out.estimatedCells,1);
 assert.equal(out.writes[0].material,'slate');
});
test('source-owned cave, landmark and protected sky fail closed atomically',()=>{
 assert.equal(plan(sample(),{...cfg,readOriginalBlock:(x,y,z)=>y===8?4:source(x,y,z)}),null);
 assert.equal(plan(sample(),{...cfg,readOriginalBlock:(x,y,z)=>y===6?0:source(x,y,z)}),null);
 assert.equal(plan(sample(),{...cfg,readOriginalBlock:(x,y,z)=>y===5?0:source(x,y,z)}),null);
 assert.equal(plan(sample(),{...cfg,protectedAt:(x,y,z)=>y===9}),null);
 assert.equal(plan(sample(),{...cfg,protectedAt:(x,y,z)=>y===5}),null);
});
test('world ceiling, unknown IDs and unauthorized generator fail closed',()=>{
 assert.equal(LIMIT,18);
 assert.equal(plan(sample(6,18),cfg),null);
 assert.equal(plan(sample(6,5),cfg),null);
 assert.equal(plan({...sample(),cap:'invented'},cfg),null);
 assert.equal(plan({...sample(),safeToIntegrate:true},cfg),null);
 assert.equal(plan({...sample(),generatorIdentityRequired:'v7'},cfg),null);
 assert.equal(plan(sample(),{...cfg,ids:{...ids,STONE:1}}),null);
});
test('two contrasting seeded-like shape proposals preserve IDs and never write world',()=>{
 const ordinary={edits:new Map()};
 for(const cap of ['snow','alpine-grass','slate','scree','gneiss']){
  const out=plan(sample(6,10,cap),cfg);
  assert.equal(out.writes.at(-1).material,cap);
  assert.ok(out.estimatedCells<=LIMIT);
 }
 assert.equal(ordinary.edits.size,0);
});

test('alpine shallow uplift keeps valid dirt support without thin floating rock',()=>{
 const p=plan(sample(6,7),cfg);
 assert.deepEqual(p.writes.map(c=>c.material),['dirt','alpine-grass']);
 const q=plan(sample(6,8),cfg);
 assert.deepEqual(q.writes.map(c=>c.material),['dirt','dirt','alpine-grass']);
 const rock=plan(sample(6,10,'slate'),cfg);
 assert.ok(rock.writes.slice(0,-1).every(c=>c.material==='stone'));
});
test('deep original cave and protected foundation veto even when surface looks safe',()=>{
 const cave=(x,y,z)=>y===3?ids.AIR:source(x,y,z);
 assert.equal(plan(sample(),{...cfg,readOriginalBlock:cave}),null);
 assert.equal(plan(sample(),{...cfg,protectedAt:(x,y,z)=>y===4}),null);
});
