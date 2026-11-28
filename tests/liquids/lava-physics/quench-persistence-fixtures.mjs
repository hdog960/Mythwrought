// Focused composition fixtures. Run against exact pinned peer modules, not mocks.
export function runQuenchPersistenceFixtures({createLiquidEngine,createLiquidPersistence,
  createWaterSources,physicalRegionAt,WATER_DEFINITION,LAVA_DEFINITION,lavaQuantities,
  WATER_LAVA_SETTLEMENT_RULE,createLavaVents,createLavaThermalScheduler,
  createLavaQuenchPersistence,test,assert}){
  const copy=x=>JSON.parse(JSON.stringify(x));
  const pairA=[[0,0,0],[1,0,0]],pairB=[[4,0,0],[5,0,0]];
  const ventOptions={vents:[{id:'vent',x:7,y:0,z:0,remaining:7,rate:2}]};
  const waterSourceOptions={sources:[{id:'spring',x:12,y:0,z:0,mode:'finite',rate:2,target:8,initialUnits:7}]};
  function fixture({allowQuench=true,canQuench=()=>true,codecOptions={},thermalOptions={}}={}){
    const isLoaded=x=>x<16,isOpen=()=>true;
    const definitions=[WATER_DEFINITION,LAVA_DEFINITION,{id:'acid',gravityLimit:1,lateralLimit:1}];
    const reactionRules=[WATER_LAVA_SETTLEMENT_RULE];
    const createEngine=snapshot=>createLiquidEngine({definitions,reactionRules,isLoaded,isOpen,snapshot});
    const e=createEngine(null);
    e.insert(0,0,0,'water',3);e.insert(1,0,0,'lava',5,lavaQuantities(5));
    e.insert(4,0,0,'water',4);e.insert(5,0,0,'lava',4,lavaQuantities(4,50));
    e.insert(8,0,0,'acid',2,{solute:9});
    const vents=createLavaVents({engine:e,...ventOptions});vents.step();
    const ws=createWaterSources({engine:e,...waterSourceOptions});ws.step();
    const thermal=createLavaThermalScheduler({engine:e,isLoaded,isOpen,canCool:()=>false,...thermalOptions});
    thermal.track(7,0,0);
    const cell=(x,y,id,units,quantities={})=>({x,y,z:0,id,units,quantities});
    const parkedCell=cell(32,256,'lava',2,lavaQuantities(2,60));
    const shared={version:1,worldId:'world',policyId:'lava-v1',revision:9,resident:e.save(),
      parked:[{owner:physicalRegionAt(32,256,0),snapshot:{version:1,cells:[parkedCell],pending:[[32,256,0]]}}],
      frozen:[cell(9,0,'water',8)],waterSources:ws.save(),
      products:[{id:'foreign',product:'other',productInputs:[cell(10,0,'acid',1,{solute:5})]}]};
    const lava={version:1,worldId:'world',policyId:'lava-v1',revision:9,vents:vents.save(),thermal:thermal.save()};
    const codec=createLiquidPersistence({worldId:'world',policyId:'lava-v1',definitions,reactionRules,waterSourceOptions,...codecOptions});
    const adapter=createLavaQuenchPersistence({codec,ventOptions,thermalOptions,createEngine,isLoaded,isOpen,canQuench,allowQuench});
    return {shared,lava,codec,adapter};
  }
  const units=(s,id)=>s.cells.filter(c=>c.id===id).reduce((n,c)=>n+c.units,0);
  const heat=s=>s.cells.reduce((n,c)=>n+(c.quantities['lava-heat']??0),0);
  test('real codec and core: canonical staged quench preserves all unrelated ledgers',()=>{
    const f=fixture(),before=copy({shared:f.shared,lava:f.lava});
    const r=f.adapter.stage({...f,pairs:[pairA,pairB],receiptIds:['q1','q2','spare']});
    assert.equal(r.status,'staged');assert.equal(r.expectedRevision,9);
    assert.deepEqual(r.usedReceiptIds,['q1','q2']);assert.deepEqual(r.unusedReceiptIds,['spare']);
    const {shared,lava}=r.state;
    assert.equal(shared.revision,10);assert.equal(lava.revision,10);
    for(const k of ['parked','frozen','waterSources'])assert.deepEqual(shared[k],before.shared[k]);
    assert.deepEqual(lava.vents,before.lava.vents);assert.deepEqual(shared.products[0],before.shared.products[0]);
    assert.deepEqual(lava.thermal.pending,[[7,0,0],[1,0,0]]);
    const inputs=shared.products.slice(1).flatMap(p=>p.productInputs);
    for(const id of ['water','lava'])assert.equal(units(shared.resident,id)+units({cells:inputs},id),units(before.shared.resident,id));
    assert.equal(heat(shared.resident)+heat({cells:inputs}),heat(before.shared.resident));
    assert.deepEqual(shared.resident.cells.find(c=>c.id==='acid'),before.shared.resident.cells.find(c=>c.id==='acid'));
    assert.deepEqual(f.codec.decode(r.encoded),shared);
    assert.deepEqual({shared:f.shared,lava:f.lava},before);
  });
  test('actual encode/decode, restart and second revision do not duplicate receipts',()=>{
    const f=fixture(),a=f.adapter.stage({...f,pairs:[pairA],receiptIds:['q1']});
    const shared=f.codec.decode(a.encoded),lava=copy(a.state.lava);
    const g=fixture();const b=g.adapter.stage({shared,lava,pairs:[pairA,pairB],receiptIds:['q2']});
    assert.equal(b.expectedRevision,10);assert.equal(b.state.shared.revision,11);
    assert.deepEqual(b.state.shared.products.map(p=>p.id),['foreign','q1','q2']);
    assert.equal(b.report.unavailable,1);
    const c=g.adapter.stage({...b.state,pairs:[pairA,pairB],receiptIds:['q3']});
    assert.equal(c.status,'unchanged');assert.equal(c.state,null);assert.deepEqual(c.unusedReceiptIds,['q3']);
    assert.throws(()=>g.adapter.stage({...b.state,pairs:[pairB],receiptIds:['q2']}),/already persisted/);
  });
  test('caller reservation shortage cannot commit a partial batch',()=>{
    const f=fixture(),before=copy({shared:f.shared,lava:f.lava});
    assert.equal(f.adapter.stage({...f,pairs:[pairA,pairB],receiptIds:['q1']}),null);
    assert.deepEqual({shared:f.shared,lava:f.lava},before);
    assert.equal(f.adapter.stage({...f,pairs:[pairA,pairB],receiptIds:['q1','q2']}).status,'staged');
  });
  test('shared product and encoded text caps refuse entire private result',()=>{
    const f=fixture({codecOptions:{maxProducts:2}}),before=copy({shared:f.shared,lava:f.lava});
    assert.throws(()=>f.adapter.stage({...f,pairs:[pairA,pairB],receiptIds:['q1','q2']}),/budget/);
    assert.deepEqual({shared:f.shared,lava:f.lava},before);
    const g=fixture({codecOptions:{maxChars:100}});const original=copy(g.shared);
    assert.throws(()=>g.adapter.stage({...g,pairs:[pairA],receiptIds:['q1']}),/size budget/);
    assert.deepEqual(g.shared,original);
  });
  test('duplicate, forbidden, disabled and unavailable pairs never spend unused IDs',()=>{
    const f=fixture({canQuench:p=>p.proposal.a.x===0});
    const r=f.adapter.stage({...f,pairs:[pairA,[...pairA].reverse(),pairB],receiptIds:['q1','q2']});
    assert.equal(r.report.duplicates,1);assert.equal(r.report.denied,1);
    assert.deepEqual(r.usedReceiptIds,['q1']);assert.deepEqual(r.unusedReceiptIds,['q2']);
    const g=fixture({allowQuench:false});const s=g.adapter.stage({...g,pairs:[pairA],receiptIds:['q1']});
    assert.equal(s.status,'unchanged');assert.deepEqual(s.report.remainingPairs,[pairA]);
    assert.deepEqual(s.usedReceiptIds,[]);
  });
  test('actual owner and thermal capacity rejection leave caller untouched',()=>{
    const f=fixture({thermalOptions:{maxTracked:1}}),before=copy({shared:f.shared,lava:f.lava});
    assert.equal(f.adapter.stage({...f,pairs:[pairA],receiptIds:['q1']}),null);
    assert.deepEqual({shared:f.shared,lava:f.lava},before);
    const g=fixture();
    // Keep the pending queue internally valid so the intended owner check is reached.
    g.shared.parked[0].snapshot.cells[0].x=0;
    g.shared.parked[0].snapshot.pending[0][0]=0;
    assert.throws(()=>g.adapter.stage({...g,pairs:[pairA],receiptIds:['q1']}),/owner/);
  });
  test('invalid reservation, revision and external stale batch cannot replace resident state',()=>{
    const f=fixture();assert.throws(()=>f.adapter.stage({...f,pairs:[pairA],receiptIds:['q1','q1']}),/reservation/);
    assert.throws(()=>f.adapter.stage({...f,lava:{...f.lava,revision:8},pairs:[pairA],receiptIds:['q1']}),/revision/);
    const r=f.adapter.stage({...f,pairs:[pairA],receiptIds:['q1'],batch:{state:{resident:{cells:[]}}}});
    assert.equal(units(r.state.shared.resident,'acid'),2);
  });
  test('quench and codec retain unrelated dormant FIFO and resume after capacity release',()=>{
    const f=fixture();
    // Use a valid shared v1 dormant FIFO representing a previously cap-blocked
    // unrelated acid cell. Quench elsewhere must not silently discard it.
    const p=[8,0,0];
    f.shared.resident.pending=f.shared.resident.pending.filter(q=>q.join(',')!==p.join(','));
    f.shared.resident.capacityBlocked=[p];
    const before=copy({shared:f.shared,lava:f.lava});
    const r=f.adapter.stage({...f,pairs:[pairB],receiptIds:['q1']});
    assert.equal(r.status,'staged');
    assert.deepEqual(r.state.shared.resident.capacityBlocked,[p]);
    assert.deepEqual(f.codec.decode(r.encoded).resident.capacityBlocked,[p]);
    assert.deepEqual({shared:f.shared,lava:f.lava},before);
    const e=createLiquidEngine({definitions:[WATER_DEFINITION,LAVA_DEFINITION,{id:'acid',gravityLimit:1,lateralLimit:1}],isLoaded:x=>x<16,isOpen:()=>true,snapshot:r.state.shared.resident});
    const t=e.tick(1);
    assert.equal(t.visited,1);
    assert.equal(e.getCell(8,-1,0).id,'acid');
    assert.equal(e.getCell(8,-1,0).units,1);
    assert.equal(units(e.save(),'acid'),2);
    assert.equal(e.save().cells.filter(c=>c.id==='acid').reduce((n,c)=>n+(c.quantities.solute??0),0),9);
  });
}
