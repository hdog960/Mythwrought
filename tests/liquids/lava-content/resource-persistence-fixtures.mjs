// Exact owner-module composition; no fake codec, engine or quench settlement.
export function resourcePersistenceFixtures({createLiquidEngine,createLiquidPersistence,
  WATER_DEFINITION,LAVA_DEFINITION,lavaQuantities,WATER_LAVA_SETTLEMENT_RULE,
  createLavaVents,createLavaThermalScheduler,createLavaQuenchPersistence,describeQuenchReceipt,
  createLavaResourceAdapter,createLavaResourcePersistence,test,assert}){
  const copy=x=>JSON.parse(JSON.stringify(x));
  const pairs=[[[0,0,0],[1,0,0]],[[4,0,0],[5,0,0]]];
  function fixture({allowClaims=true,canClaim=()=>true,maxClaims=4096,codecOptions={},dormant=false}={}){
    const definitions=[WATER_DEFINITION,LAVA_DEFINITION],reactionRules=[WATER_LAVA_SETTLEMENT_RULE];
    const isLoaded=()=>true;
    const isOpen=dormant?(x,y,z)=>z===0&&((y===0&&[0,1,4,5,20,30].includes(x))||(y===1&&[20,30].includes(x))):()=>true;
    const maxCells=dormant?6:8192;
    const createEngine=snapshot=>createLiquidEngine({definitions,reactionRules,isLoaded,isOpen,snapshot,maxCells});
    const e=createEngine(null);
    e.insert(0,0,0,'water',3);e.insert(1,0,0,'lava',5,lavaQuantities(5,73));
    e.insert(4,0,0,'water',4);e.insert(5,0,0,'lava',4,lavaQuantities(4,50));
    if(dormant){
      assert.equal(e.insert(20,1,0,'lava',8,lavaQuantities(8,73)),true);
      assert.equal(e.insert(30,1,0,'lava',8,lavaQuantities(8,50)),true);
      assert.equal(e.tick(6).pending,0);
      assert.deepEqual(e.save().capacityBlocked,[[20,1,0],[30,1,0]]);
    }
    const codec=createLiquidPersistence({worldId:'world',policyId:'lava-v1',definitions,reactionRules,maxCells,...codecOptions});
    const shared=codec.migrateEngineSnapshot(e.save());
    const lava={version:1,worldId:'world',policyId:'lava-v1',revision:0,
      vents:createLavaVents({engine:e}).save(),
      thermal:createLavaThermalScheduler({engine:e,isLoaded,isOpen,canCool:()=>false}).save()};
    const quench=createLavaQuenchPersistence({codec,createEngine,isLoaded,isOpen,canQuench:()=>true,allowQuench:true});
    const resources=createLavaResourceAdapter({describeQuenchReceipt,canClaim,allowClaims});
    const adapter=createLavaResourcePersistence({codec,quench,resources,maxClaims});
    return {codec,adapter,createEngine,state:adapter.initialize({shared,lava})};
  }
  function quench(f,state=f.state,index=0,id='q1'){
    return f.adapter.stageQuench({state,expectedRevision:state.shared.revision,pairs:[pairs[index]],receiptIds:[id]});
  }
  function claim(f,state,kind='cooled-rock',receiptId='q1',expectedRevision=state.shared.revision){
    return f.adapter.stageClaim({state,kind,receiptId,expectedRevision});
  }
  test('real quench, claim and three-ledger restart preserve exact product history',()=>{
    const f=fixture(),initial=copy(f.state),q=quench(f),before=copy(q.state);
    assert.equal(q.status,'staged');assert.equal(q.state.shared.revision,1);
    const c=claim(f,q.state);assert.equal(c.output.units,3);assert.equal(c.output.kind,'cooled-rock');
    assert.equal(c.state.shared.revision,2);assert.equal(c.state.lava.revision,2);assert.equal(c.state.resource.revision,2);
    assert.deepEqual(c.state.shared.products,q.state.shared.products);
    assert.deepEqual(c.state.shared.resident,q.state.shared.resident);
    assert.deepEqual(c.state.lava.thermal,q.state.lava.thermal);
    assert.deepEqual(c.state.lava.vents,q.state.lava.vents);
    assert.deepEqual(q.state,before);assert.deepEqual(f.state,initial);
    const g=fixture(),restored=g.adapter.restore({shared:g.codec.decode(c.encoded),lava:copy(c.state.lava),resource:copy(c.state.resource)});
    assert.deepEqual(restored,c.state);assert.equal(claim(g,restored,'foundry-feedstock'),null);
  });
  test('subsequent real quench carries claim history and permits distinct receipt',()=>{
    const f=fixture(),a=claim(f,quench(f).state),b=quench(f,a.state,1,'q2');
    assert.equal(b.state.resource.revision,3);assert.deepEqual(b.state.resource.ledger.claimed,['q1']);
    const c=claim(f,b.state,'foundry-feedstock','q2');assert.equal(c.output.units,4);
    assert.deepEqual(c.state.resource.ledger.claimed,['q1','q2']);assert.equal(c.state.shared.revision,4);
    assert.equal(claim(f,c.state,'cooled-rock','q2'),null);
  });
  test('stale revision, missing ledger, stale extension and orphan claim fail closed',()=>{
    const f=fixture(),q=quench(f),c=claim(f,q.state);
    assert.equal(claim(f,c.state,'cooled-rock','q1',1),null);
    assert.equal(f.adapter.stageQuench({state:c.state,expectedRevision:1,pairs:[pairs[1]],receiptIds:['q2']}),null);
    assert.throws(()=>f.adapter.restore({...c.state,resource:q.state.resource}),/revision/);
    assert.throws(()=>f.adapter.restore({...c.state,resource:undefined}),/revision/);
    assert.throws(()=>f.adapter.restore({...c.state,lava:q.state.lava}),/revision/);
    assert.throws(()=>f.adapter.restore({...c.state,resource:{...c.state.resource,ledger:{...c.state.resource.ledger,claimed:['orphan']}}}),/receipt/);
    assert.throws(()=>f.adapter.initialize(q.state),/new world/);
  });
  test('disabled, denied and revoked authorization never yield a claim successor',()=>{
    const f=fixture({allowClaims:false});assert.equal(claim(f,quench(f).state),null);
    const g=fixture({canClaim:()=>false});assert.equal(claim(g,quench(g).state),null);
    let n=0;const h=fixture({canClaim:()=>++n===1}),q=quench(h),before=copy(q.state);
    assert.equal(claim(h,q.state),null);assert.equal(n,2);assert.deepEqual(q.state,before);
  });
  test('claim cap preserves earlier claim and quench receipt; no entitlement eviction',()=>{
    const f=fixture({maxClaims:1}),a=claim(f,quench(f).state),b=quench(f,a.state,1,'q2'),before=copy(b.state);
    assert.equal(claim(f,b.state,'foundry-feedstock','q2'),null);assert.deepEqual(b.state,before);
  });
  test('codec size failure during claim leaves all input ledgers unchanged',()=>{
    const f=fixture(),q=quench(f),before=copy(q.state);
    // Encode length grows by one character when revision crosses 9 -> 10.
    const shared=f.codec.validate({...q.state.shared,revision:9});
    const state={shared,lava:{...q.state.lava,revision:9},resource:{...q.state.resource,revision:9}};
    const g=fixture({codecOptions:{maxChars:f.codec.encode(shared).length}});
    assert.throws(()=>claim(g,state),/size budget/);assert.deepEqual(q.state,before);
  });
  test('resource claim and restart retain unrelated dormant FIFO and exact heat after capacity release',()=>{
    const f=fixture({dormant:true}),initial=copy(f.state),q=quench(f);
    const expected=[[20,1,0],[30,1,0]];
    assert.deepEqual(q.state.shared.resident.capacityBlocked,expected);
    const c=claim(f,q.state);
    assert.deepEqual(c.state.shared.resident.capacityBlocked,expected);
    const g=fixture({dormant:true});
    const restored=g.adapter.restore({shared:g.codec.decode(c.encoded),lava:copy(c.state.lava),resource:copy(c.state.resource)});
    assert.deepEqual(restored,c.state);
    assert.equal(claim(g,restored,'foundry-feedstock'),null);
    const e=g.createEngine(restored.shared.resident);
    assert.equal(e.tick(1).moved,2);
    assert.equal(e.getCell(20,0,0).units,2);
    assert.equal(e.getCell(20,0,0).quantities['lava-heat'],146);
    assert.equal(e.getCell(20,1,0).quantities['lava-heat'],438);
    assert.equal(e.getCell(30,1,0).units,8);
    assert.deepEqual(f.state,initial);
  });
}
