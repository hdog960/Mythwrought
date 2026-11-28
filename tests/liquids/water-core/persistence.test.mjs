import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiquidEngine,LIQUID_IDS} from '../../../src/liquids/core/engine.mjs';
import {createLiquidOwnerHandoff} from '../../../src/liquids/core/owner-handoff.mjs';
import {createLiquidPersistence} from '../../../src/liquids/core/persistence.mjs';
import {createWaterSources} from '../../../src/liquids/water/physics/sources.mjs';
import {physicalRegionAt} from '../../../src/world-height.mjs';
const definitions=LIQUID_IDS.map(id=>({id,gravityLimit:1,lateralLimit:1}));
const open=()=>true;
const config={definitions,isLoaded:open,isOpen:open};
const options={definitions,worldId:'world-1',policyId:'policy-1'};
const sources=[{id:'spring',x:5,y:0,z:0,mode:'finite',rate:3,target:8,initialUnits:9}];
const make=(opts={})=>createLiquidPersistence({...options,...opts});
const engine=()=>createLiquidEngine(config);
const cell=(x,y,z,id='water',units=8,quantities={})=>({x,y,z,id,units,quantities});
const snap=(cells=[],pending=[])=>({version:1,cells,pending});
const base=()=>make().migrateEngineSnapshot(snap());
const shard=(c)=>({owner:physicalRegionAt(c.x,c.y,c.z),snapshot:snap([c],[[c.x,c.y,c.z]])});
const receipt=(id='reaction-1')=>({id,product:'fixture-product',productInputs:[cell(0,0,0,'lava',2,{heat:7}),cell(1,0,0,'water',1)]});

test('round trip exact sparse state, five liquid identities, frozen and receipt ledgers',()=>{
  const e=engine();for(let i=0;i<5;i++)assert.equal(e.insert(i,256,0,LIQUID_IDS[i],i+1,{trace:i+1}),true);
  const p=make({waterSourceOptions:{sources}}),s=createWaterSources({engine:e,sources});s.step();
  const state={...base(),revision:13,resident:e.save(),parked:[shard(cell(-1,-210,0,'acid',2,{solute:19}))],
    frozen:[cell(-1,256,0,'water',8,{trace:11})],waterSources:s.save(),products:[receipt()]};
  const before=JSON.stringify(state),text=p.encode(state),result=p.decode(text);
  assert.equal(JSON.stringify(state),before);assert.equal(p.encode(result),text);
  assert.deepEqual(result.resident.pending,e.save().pending);assert.deepEqual(result.waterSources.remaining,[6]);
  assert.deepEqual(result.parked[0].snapshot.cells[0].quantities,{solute:19});
  assert.equal(result.frozen[0].quantities.trace,11);assert.equal(result.products[0].productInputs[0].quantities.heat,7);
  assert.ok(Object.isFrozen(result.products[0].productInputs[0].quantities));
});
test('migration preserves v1 engine and refuses game-save or future formats',()=>{
  const p=make(),e=engine();e.insert(0,0,0,'water',8);const legacy=e.save();
  assert.deepEqual(p.migrateEngineSnapshot(legacy).resident,legacy);
  assert.throws(()=>p.migrateEngineSnapshot({...legacy,version:2}));
  assert.throws(()=>p.migrateEngineSnapshot({version:1,edits:[]}));
  assert.throws(()=>make({waterSourceOptions:{sources}}).migrateEngineSnapshot(legacy));
});
test('world, policy, version and missing or unknown envelope fields fail closed',()=>{
  const p=make(),s=base();for(const bad of [{...s,worldId:'other'},{...s,policyId:'other'},{...s,version:2},{...s,revision:-1},{...s,extra:1}])assert.throws(()=>p.validate(bad));
  const {products,...missing}=s;assert.throws(()=>p.validate(missing));
});
test('rejects resident/parked owner overlap even for empty parked shards',()=>{
  const c=cell(0,20,0);const parked={owner:physicalRegionAt(0,20,0),snapshot:snap()};
  assert.throws(()=>make().validate({...base(),resident:snap([c]),parked:[parked]}));
});
test('rejects foreign parked cells, duplicate owners, and invalid pending work',()=>{
  const a=shard(cell(-1,-210,0));const p=make();
  assert.throws(()=>p.validate({...base(),parked:[a,a]}));
  assert.throws(()=>p.validate({...base(),parked:[{...a,snapshot:snap([cell(16,-210,0)])}]}));
  assert.throws(()=>p.validate({...base(),resident:snap([],[[0,0,0]])}));
});
test('rejects frozen duplicates, partial/nonwater cells and cross-ledger overlaps',()=>{
  const p=make(),c=cell(0,0,0);for(const frozen of [[c,c],[{...c,units:7}],[{...c,id:'lava'}]])assert.throws(()=>p.validate({...base(),frozen}));
  assert.throws(()=>p.validate({...base(),resident:snap([c]),frozen:[c]}));
  assert.throws(()=>p.validate({...base(),parked:[shard(c)],frozen:[c]}));
  assert.equal(p.validate({...base(),parked:[shard(c)],frozen:[cell(1,0,0)]}).frozen.length,1);
});
test('source ledger required and rejects malformed stock or changed config',()=>{
  const p=make({waterSourceOptions:{sources}}),e=engine(),s=createWaterSources({engine:e,sources});s.step();
  const state={...base(),resident:e.save(),waterSources:s.save()};
  assert.deepEqual(p.validate(state).waterSources.remaining,[6]);
  for(const waterSources of [null,{...s.save(),remaining:[10]},{...s.save(),signature:'invalid'}])assert.throws(()=>p.validate({...state,waterSources}));
  assert.throws(()=>make().validate(state));
  assert.throws(()=>make({definitions:[],waterSourceOptions:{sources}}));
});
test('receipt identities are exclusive but consumed historical coordinates may recur',()=>{
  const p=make(),r=receipt();assert.throws(()=>p.validate({...base(),products:[r,r]}));
  assert.equal(p.validate({...base(),products:[r,receipt('reaction-2')]}).products.length,2);
  assert.throws(()=>p.validate({...base(),products:[{...r,productInputs:[]}]}));
  assert.throws(()=>p.validate({...base(),products:[{...r,productInputs:[r.productInputs[0],cell(3,0,0)]}]}));
});
test('individual and aggregate storage budgets and serialized size reject without truncation',()=>{
  const s={...base(),resident:snap([cell(0,0,0)]),products:[receipt()]};
  assert.throws(()=>make({maxRecords:2}).validate(s));assert.throws(()=>make({maxProducts:0}).validate(s));
  assert.throws(()=>make({maxChars:10}).encode(s));assert.throws(()=>make({maxChars:10}).decode(' '.repeat(11)));
  assert.equal(make({maxRecords:3}).validate(s).products.length,1);
});
test('actual handoff and actual reaction receipt survive persistence with exact volume',()=>{
  let loaded=true;const o=physicalRegionAt(-1,256,0),isLoaded=x=>x>=0||loaded;
  const rules=[{a:'lava',b:'water',propose:()=>({consumeA:2,consumeB:1,product:'fixture-product'}),settle:()=>({routeA:'product',routeB:'product'})}];
  const cfg={...config,isLoaded,reactionRules:rules};const e=createLiquidEngine(cfg);
  e.insert(-1,256,0,'acid',4,{solute:5});e.insert(0,0,0,'lava',4,{heat:17});e.insert(1,0,0,'water',4);
  const r=e.commitReaction(e.planReaction(0,0,0,1,0,0));loaded=false;
  const handoff=createLiquidOwnerHandoff({...cfg,isOwnerLoaded:()=>loaded});
  const detached=handoff.stage({state:{version:1,resident:e.save(),parked:[]},owner:o,mode:'detach'});
  const p=make({reactionRules:rules}),state={...base(),...detached.state,products:[{id:'rx-1',product:r.product,productInputs:r.productInputs}]};
  const restored=p.decode(p.encode(state));loaded=true;
  const attached=handoff.stage({state:{version:1,resident:restored.resident,parked:restored.parked},owner:o,mode:'attach'});
  assert.equal(attached.state.resident.cells.reduce((n,c)=>n+c.units,0)+restored.products[0].productInputs.reduce((n,c)=>n+c.units,0),12);
  assert.equal(attached.state.resident.cells.find(c=>c.id==='lava').quantities.heat+restored.products[0].productInputs[0].quantities.heat,17);
});
