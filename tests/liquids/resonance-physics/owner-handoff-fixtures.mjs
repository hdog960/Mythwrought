// The host lease and atomic adoption below are controlled test fixtures only.
export function registerOwnerHandoffTests({test,assert,createLiquidEngine,createLiquidOwnerHandoff,
  physicalRegionAt,createResonanceSources,createResonanceOwnerAuthorization,
  RESONANCE_DEFINITION,RESONANCE_ID:id,ENERGY_KEY:key}){
  const clone=x=>JSON.parse(JSON.stringify(x));
  const zero={visited:1,units:0,energy:0,changed:[]};
  function setup(anchorPoint,outletPoint){
    const sourceOwner=physicalRegionAt(...anchorPoint),outletOwner=physicalRegionAt(...outletPoint);
    assert.ok(sourceOwner.key!==outletOwner.key);
    const unavailable=new Set(),blocked=new Set();
    const isOwnerLoaded=o=>!unavailable.has(o.key);
    const isLoaded=(...p)=>isOwnerLoaded(physicalRegionAt(...p));
    const isOpen=(...p)=>!blocked.has(p.join(','));
    const cfg={definitions:[RESONANCE_DEFINITION],isLoaded,isOpen};
    const engine=snapshot=>createLiquidEngine({...cfg,snapshot});
    const handoff=createLiquidOwnerHandoff({...cfg,isOwnerLoaded});
    const store={version:1,id,storeId:'reservoir',anchor:'anchor',capacity:8,units:7,energy:19,revision:0};
    const sources=[{point:outletPoint,rate:2,target:8,store}];
    const authorize=createResonanceOwnerAuthorization({physicalRegionAt,isOwnerLoaded,isLoaded,
      resolveAnchor:(anchor,storeId)=>({anchor,storeId,point:anchorPoint}),canDischarge:()=>true});
    const scheduler=(e,snapshot=null)=>createResonanceSources({engine:e,sources,authorize,snapshot});
    return {sourceOwner,outletOwner,unavailable,blocked,engine,handoff,scheduler,authorize};
  }
  function totals(state,scheduler){
    return [...state.resident.cells,...state.parked.flatMap(p=>p.snapshot.cells),...scheduler.save().stores]
      .reduce(([u,e],c)=>[u+c.units,e+(c.energy??c.quantities?.[key]??0)],[0,0]);
  }
  function roundTrip(anchorPoint,outletPoint){
    const h=setup(anchorPoint,outletPoint),old=h.engine(null),s=h.scheduler(old);
    assert.equal(s.step().units,2);
    let state={version:1,resident:old.save(),parked:[]};
    const before=clone(state),token=s.park(),stock=s.save();
    h.unavailable.add(h.sourceOwner.key);
    const detached=h.handoff.stage({state,owner:h.sourceOwner,mode:'detach'});
    assert.ok(detached);assert.equal(detached.movedCells,0);assert.deepEqual(state,before);
    state=detached.state;
    const next=h.engine(state.resident);
    assert.equal(s.resume(token,{engine:next,authorize:h.authorize}),true);
    assert.deepEqual(s.step(),zero);assert.deepEqual(s.save(),stock);
    assert.deepEqual(totals(state,s),[7,19]);assert.deepEqual(old.save(),before.resident);
    const p=s.park();state={...state,resident:next.save()};
    h.unavailable.delete(h.sourceOwner.key);
    const attached=h.handoff.stage({state,owner:h.sourceOwner,mode:'attach'});
    assert.ok(attached);assert.equal(attached.state.parked.length,0);
    assert.equal(h.handoff.stage({state:attached.state,owner:h.sourceOwner,mode:'attach'}),null);
    const restored=h.engine(attached.state.resident);
    assert.equal(s.resume(p,{engine:restored,authorize:h.authorize}),true);
    assert.equal(s.step().units,2);
    assert.deepEqual(totals({...attached.state,resident:restored.save()},s),[7,19]);
    assert.deepEqual(next.save(),state.resident);
  }
  test('actual physical owner: parked source cannot discharge to resident outlet at legacy/upper and chunk seam',()=>{
    roundTrip([15,19,0],[16,20,0]);
  });
  test('actual physical owner: negative chunk and upper section seam preserves finite inventory',()=>{
    roundTrip([-1,35,-1],[0,36,-1]);
  });
  test('actual owner shard: blocked attach rejects, paired snapshot restart and later attach preserve all mass and energy',()=>{
    const h=setup([0,19,0],[0,20,0]),old=h.engine(null),s=h.scheduler(old);
    s.step();const token=s.park(),stock=s.save();
    h.unavailable.add(h.outletOwner.key);
    const state={version:1,resident:old.save(),parked:[]};
    const detached=h.handoff.stage({state,owner:h.outletOwner,mode:'detach'});
    assert.equal(detached.movedUnits,2);assert.equal(detached.state.resident.cells.length,0);
    assert.deepEqual(totals(detached.state,s),[7,19]);
    const saved=clone({state:detached.state,source:stock});
    // The old scheduler remains parked permanently; the restored one is the sole writer.
    const resident=h.engine(saved.state.resident),recovered=h.scheduler(resident,saved.source);
    assert.throws(()=>s.step(),/parked/);
    assert.deepEqual(recovered.step(),zero);assert.deepEqual(recovered.save(),stock);
    const lease=recovered.park();h.unavailable.delete(h.outletOwner.key);h.blocked.add('0,20,0');
    assert.equal(h.handoff.stage({state:saved.state,owner:h.outletOwner,mode:'attach'}),null);
    assert.deepEqual(saved.state,detached.state);h.blocked.clear();
    const attach=h.handoff.stage({state:saved.state,owner:h.outletOwner,mode:'attach'});
    assert.ok(attach);assert.equal(attach.movedUnits,2);
    const next=h.engine(attach.state.resident);
    assert.equal(recovered.resume(lease,{engine:next,authorize:h.authorize}),true);
    assert.equal(recovered.step().units,2);
    assert.deepEqual(totals({...attach.state,resident:next.save()},recovered),[7,19]);
    assert.equal(resident.save().cells.length,0);assert.deepEqual(s.save(),token.snapshot);
  });
}
