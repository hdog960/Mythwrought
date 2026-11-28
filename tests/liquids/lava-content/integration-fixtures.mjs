// Lava B cross-owner CPU integration. Actual pinned peer modules, no production mount.
export function runLavaIntegration(m,test){
  const {formations,material,steam,core,water,lava,transactions,mesh,draw,waterMaterial}=m;
  const eq=(a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error('Expected '+JSON.stringify(b)+' got '+JSON.stringify(a));};
  const ok=(v,msg='assertion failed')=>{if(!v)throw Error(msg);};
  const throws=f=>{let caught=false;try{f();}catch{caught=true;}ok(caught,'expected rejection');};
  const xyz=c=>[c.x,c.y,c.z],key=p=>p.join(',');
  function world(kind,options={}){
    const geometry=formations.describeLavaFormation({kind,x:15,y:20,z:-1,...options});
    const solid=new Set(geometry.solids.map(c=>key(xyz(c))));
    const unloaded=new Set();
    const isLoaded=(...p)=>!unloaded.has(key(p)),isOpen=(...p)=>!solid.has(key(p));
    const engine=core.createLiquidEngine({isLoaded,isOpen,definitions:[water.WATER_DEFINITION,lava.LAVA_DEFINITION],reactionRules:[transactions.WATER_LAVA_SETTLEMENT_RULE]});
    for(const c of geometry.seeds)ok(engine.insert(...xyz(c),'lava',c.units,lava.lavaQuantities(c.units,c.heatPerUnit)));
    const origin=[geometry.seeds[0].x,geometry.seeds[0].y,geometry.seeds[0].z];
    const points=geometry.seeds.map(xyz);
    const build=(cells=points,opts={})=>mesh.buildLiquidMesh({engine,isLoaded,isOpen,cells,origin,...opts});
    return {geometry,engine,isLoaded,isOpen,unloaded,origin,points,build};
  }
  function checkTop(meshResult,n,height){
    eq(meshResult.faceCount,n);
    const g=meshResult.groups[0];eq(g.id,'lava');
    eq(g.positions.byteLength+g.normals.byteLength+g.indices.byteLength,n*120);
    for(let i=0;i<g.positions.length;i+=3){eq(g.positions[i+1],height);eq(Array.from(g.normals.slice(i,i+3)),[0,1,0]);}
  }
  function totals(e){return e.save().cells.reduce((a,c)=>[a[0]+c.units,a[1]+(c.quantities['lava-heat']??0)], [0,0]);}
  test('all three formations compose with actual core and contained top-only shared mesh',()=>{
    for(const [kind,n] of [['vent',1],['pool',13],['channel',11]]){
      const w=world(kind);const before=w.engine.save();checkTop(w.build(),n,.5);
      eq(totals(w.engine),[n*4,n*320]);eq(w.engine.save(),before);
      const p=draw.planLiquidDraws({batches:[{id:kind,revision:1,mesh:w.build()}],materials:{lava:material.LAVA_MATERIAL},camera:[15,24,-1],forward:[0,-1,0]});
      eq(p.faces,n);eq(p.transparent,[]);eq(p.opaque.reduce((sum,r)=>sum+r.indexCount,0),6*n);
    }
  });
  test('finite vent refill updates mesh height and retains reserve conservation',()=>{
    const w=world('vent',{initialUnits:4,ventStock:3,ventRate:2});
    let v=lava.createLavaVent(w.geometry.vent);
    for(let i=0;i<3;i++){v=lava.visitLavaVent(w.engine,v).state;}
    eq([v.remaining,v.emitted], [0,3]);eq(totals(w.engine),[7,560]);checkTop(w.build(),1,7/8);
    eq(w.geometry.totalVolume,7);
  });
  test('shared draw planner places actual lava and water in distinct depth passes',()=>{
    const w=world('vent');const p=[15,21,-1];ok(w.engine.insert(...p,'water',4));
    const result=w.build([...w.points,p]);const plan=draw.planLiquidDraws({batches:[{id:'mixed',revision:2,mesh:result}],materials:{lava:material.LAVA_MATERIAL,water:waterMaterial.WATER_MATERIAL},camera:[15,25,-1],forward:[0,-1,0]});
    ok(plan.opaque.length>0&&plan.transparent.length>0);
    ok(plan.opaque.every(r=>r.liquid==='lava'&&r.revision===2));
    ok(plan.transparent.every(r=>r.liquid==='water'&&r.revision===2));
    eq([...plan.opaque,...plan.transparent].reduce((sum,r)=>sum+r.indexCount,0),6*result.faceCount);
  });
  test('actual partial quench drives fresh mesh, exact heat signal and committed steam once',()=>{
    const w=world('vent',{initialUnits:7,heatPerUnit:73});
    const p=[15,21,-1];ok(w.engine.insert(...p,'water',3));
    const plan=w.engine.planReaction(...p,...w.points[0]);ok(plan);
    const receipt=w.engine.commitReaction(plan);ok(receipt);
    const q=transactions.describeQuenchReceipt(receipt);ok(q);
    eq([q.steamUnits,q.solidUnits,q.releasedHeat],[3,3,219]);eq(totals(w.engine),[4,292]);
    checkTop(w.build(),1,.5);
    const signal=material.lavaVisualSignal(w.engine.getCell(...w.points[0]),lava.readLavaHeat);
    eq(signal,{id:'lava',fill:.5,heat:.73});
    const halo=mesh.expandLiquidDirty(receipt.changed);ok(halo.some(p=>key(p)===key(w.points[0])));
    const particles=steam.createLavaSteam({isVisible:()=>true});
    const event={kind:'lava-quench',committed:true,sequence:1,x:q.at[0],y:q.at[1],z:q.at[2],steamUnits:q.steamUnits};
    eq(particles.ingest([event]).emitted,6);eq(particles.ingest([event]).duplicates,1);
    const s=particles.sample(w.origin);eq(s.count,6);eq(s.data.byteLength,120);
    eq(particles.advance(24),0);eq(totals(w.engine),[4,292]);
    eq(w.engine.commitReaction(plan),null);
  });
  test('full quench clears owned mesh and leaves only exact abstract product receipt',()=>{
    const w=world('vent',{initialUnits:8});const p=[15,21,-1];ok(w.engine.insert(...p,'water',8));
    const receipt=w.engine.commitReaction(w.engine.planReaction(...p,...w.points[0]));
    const q=transactions.describeQuenchReceipt(receipt);ok(q);
    eq([q.solidUnits,q.steamUnits,q.fullVoxelCandidate,q.releasedHeat],[8,8,true,640]);
    eq(w.build().faceCount,0);eq(w.build().groups,[]);eq(totals(w.engine),[0,0]);
    const draws=draw.planLiquidDraws({batches:[{id:'vent',revision:3,mesh:w.build()}],materials:{lava:material.LAVA_MATERIAL},camera:[15,23,-1],forward:[0,-1,0]});
    eq(draws.faces,0);eq(draws.opaque,[]);eq(draws.transparent,[]);
  });
  test('unload hides retained liquid without changing physical volume, reload restores exact mesh',()=>{
    const w=world('channel');const before=w.engine.save(),p=w.points[0];
    w.unloaded.add(key(p));eq(w.build().faceCount,w.points.length-1);
    eq(w.engine.save(),before);eq(w.engine.samplePoint(p[0]+.5,p[1]+.25,p[2]+.5),null);
    w.unloaded.clear();checkTop(w.build(),w.points.length,.5);eq(w.engine.save(),before);
  });
  test('face and draw budgets reject instead of publishing partial formation or mutating state',()=>{
    const w=world('pool');const before=w.engine.save();throws(()=>w.build(w.points,{maxFaces:12}));
    throws(()=>draw.planLiquidDraws({batches:[{id:'pool',revision:1,mesh:w.build()}],materials:{lava:material.LAVA_MATERIAL},camera:[15,23,-1],forward:[0,-1,0],maxFaces:12}));
    eq(w.engine.save(),before);checkTop(w.build(),13,.5);
  });
  test('actual heat drives bounded tile output without mutating engine or introducing liquid IDs',()=>{
    const hot=world('vent',{heatPerUnit:100}),cold=world('vent',{heatPerUnit:0});
    const tile=w=>material.buildLavaTile({heat:material.lavaVisualSignal(w.engine.getCell(...w.points[0]),lava.readLavaHeat).heat,size:32});
    const before=hot.engine.save(),h=tile(hot),c=tile(cold);
    eq(h.rgba.byteLength+h.emission.byteLength,5120);ok(h.emission.some(n=>n>0));ok(c.emission.every(n=>n===0));
    eq(hot.engine.save(),before);
  });
}
