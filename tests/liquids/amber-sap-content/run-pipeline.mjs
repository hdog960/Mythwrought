// Cross-lane native qualification only. No production or host transaction executor.
// AMBER_PEER_ROOT contains core/engine.mjs, physics/{definition,sources,curing}.mjs
// and visual/{mesh,dirty-bridge}.mjs from the exact commits listed in the checkpoint.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const peer=process.env.AMBER_PEER_ROOT;
assert.ok(peer,'AMBER_PEER_ROOT must name the pinned peer module directory');
const own=new URL('../../../src/liquids/amber-sap/content/',import.meta.url);
const peerURL=pathToFileURL(resolve(peer)+'/');
async function verify(root,path,expected){
  const url=new URL(path,root),bytes=await readFile(url);
  const hash=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  assert.equal(hash,expected,path+' pinned Git blob mismatch');
  return url.href;
}
const pins=[
  [peerURL,'core/engine.mjs','ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b'],
  [peerURL,'physics/definition.mjs','d44b2d5e5c561f5faf78961de0d39ec23e812b31'],
  [peerURL,'physics/sources.mjs','178555044ea5b2ce1e7d0e9ae1140b505e7c5490'],
  [peerURL,'physics/curing.mjs','691079552ccc3718fbfda5e2510c9d18c788eea9'],
  [peerURL,'visual/mesh.mjs','6eec04c065623b7046750e28fdb34cfc4908ec9a'],
  [peerURL,'visual/dirty-bridge.mjs','aadb734e572c1bbc35ca866d7bbeb259bae8764b'],
  [own,'visuals.mjs','64d12eeb5a08fcf707a42f1127a7ba1ef7cebce9'],
  [own,'sites.mjs','ee59609bc9288164a3f6de00f3eeef1ae6e5c949'],
  [own,'transfers.mjs','e0501ad5aa4f418c23611b83ecc62326ff7cb086']
];
const urls=await Promise.all(pins.map(p=>verify(...p)));
const [core,definition,sources,curing,mesh,bridge,visuals,sites,transfers]=await Promise.all(urls.map(u=>import(u)));
const {createLiquidEngine}=core,{AMBER_SAP_DEFINITION}=definition;
const {createSapSources}=sources,{createSapCuring}=curing;
const {createAmberBasin,sampleAmberSapVisual}=visuals;
const {planAmberTap,inspectAmberBasin,planAmberDeposit,AMBER_SAP_RENDER_MATERIAL}=sites;
const {planAmberTransfer,planHardenedAmber}=transfers;
const p=[15,20,1],outlet=[15,21,1],origin=[14,19,0],anchor=[14,21,1];
const id='amber-sap',yes=()=>true,key=p=>p.join(',');
const basin=createAmberBasin({x:14,y:19,z:0}),liner=new Set(basin.solid.map(key));
function fixture({maxCells=128,snapshot=null}={}){
  let loaded=true,tree=true;
  const isLoaded=()=>loaded,isOpen=(...q)=>!liner.has(key(q))&&key(q)!==key(anchor);
  const engine=createLiquidEngine({isLoaded,isOpen,definitions:[AMBER_SAP_DEFINITION],maxCells,snapshot});
  const host={engine,isLoaded,isOpen};
  const tap=()=>planAmberTap({...host,treeId:'tree-1',anchor,face:[1,0],stock:8,rate:8,
    isTreeAnchor:(t,...q)=>tree&&t==='tree-1'&&key(q)===key(anchor),canAttach:yes});
  const isTreeAvailable=(t,...q)=>tree&&t==='tree-1'&&key(q)===key(outlet);
  const inspect=()=>inspectAmberBasin({...host,origin,isLiner:(...q)=>liner.has(key(q))});
  return {host,engine,tap,inspect,isTreeAvailable,setLoaded:v=>{loaded=v;},setTree:v=>{tree=v;}};
}
const totals=e=>e.save().cells.reduce((a,c)=>[a[0]+c.units,a[1]+(c.quantities.trace??0)],[0,0]);
const empty=()=>Object.freeze({id:'test-vessel',revision:0,capacity:8,units:0,liquidId:null,quantities:Object.freeze({})});
const containerAfter=(c,t)=>Object.freeze({...c,revision:c.revision+1,liquidId:t.id,units:t.units,quantities:t.quantities});
const transfer=(f,opts)=>planAmberTransfer({...f.host,canTransfer:yes,...opts});
const resource=c=>c?{id:c.id,units:c.units,quantities:c.quantities}:{id:null,units:0,quantities:{}};
function route(changed,accept=true){
  const calls=[];
  const receipt=bridge.invalidateLiquidChanges({changed,cache:{invalidate:ids=>{calls.push(ids);return accept;}},
    batchesForCell:x=>[x<16?'west':'east']});
  return {receipt,calls};
}
function geometry(f,q){return mesh.buildLiquidMesh({...f.host,cells:[q],origin:q});}

test('actual tree tap, finite source, gravity, basin and presentation agree on partial sap',()=>{
  const f=fixture(),tap=f.tap();assert.deepEqual(tap.outlet,outlet);
  const s=createSapSources({...f.host,isTreeAvailable:f.isTreeAvailable,sources:[tap.source]});
  const injection=s.step();assert.equal(injection.inserted,8);assert.equal(injection.fault,null);
  assert.deepEqual(injection.changed,[outlet]);assert.equal(s.save().sources[0].remaining,0);
  const flow=f.engine.tick(1);assert.equal(flow.moved,1);assert.deepEqual(flow.changed,[outlet,p]);
  assert.deepEqual(totals(f.engine),[8,0]);assert.equal(f.inspect().freeUnits,71);
  const v=sampleAmberSapVisual({...f.host,x:p[0],y:p[1],z:p[2]});
  assert.equal(v.fill,1/8);assert.equal(v.surfaceY,20.125);
  const m=geometry(f,p);assert.equal(m.groups.length,1);assert.equal(m.groups[0].id,AMBER_SAP_RENDER_MATERIAL.id);
  assert.equal(Math.max(...m.groups[0].positions.filter((_,i)=>i%3===1)),v.fill);
  assert.equal(AMBER_SAP_RENDER_MATERIAL.pass,'transparent');assert.equal(AMBER_SAP_RENDER_MATERIAL.depthWrite,false);
  const r=route([...injection.changed,...flow.changed]);assert.equal(r.receipt.accepted,true);
  assert.equal(r.calls.length,1);assert.deepEqual(r.calls[0],['west','east']);
});

test('actual core extraction and insertion agree with finite container proposal quantities',()=>{
  const f=fixture(),q=[16,20,1];assert.ok(f.engine.insert(...p,id,7,{trace:13}));assert.ok(f.engine.insert(...q,id,2,{trace:3}));
  const c=empty(),before=f.engine.save();
  const a=transfer(f,{direction:'collect',position:p,units:3,container:c});assert.deepEqual(f.engine.save(),before);
  assert.equal(a.world.expected,f.engine.getCell(...p));
  // Explicit fixture-only execution on a disposable engine, not a production transaction.
  const taken=f.engine.extract(...p,3);assert.deepEqual(taken.quantities,a.moved);assert.deepEqual(resource(f.engine.getCell(...p)),a.world.after);
  const held=containerAfter(c,a.container.after);
  const b=transfer(f,{direction:'place',position:q,units:3,container:held,creative:true});assert.ok(b);
  assert.ok(f.engine.insert(...q,id,3,b.moved));assert.deepEqual(resource(f.engine.getCell(...q)),b.world.after);
  assert.equal(b.container.after.units,0);assert.deepEqual(totals(f.engine),[9,16]);
  assert.equal(transfer(f,{direction:'collect',position:p,units:1,container:c,creative:true,canTransfer:()=>false}),null);
});

test('finite tap-to-container-to-full-basin cure maps only a live physics proposal',()=>{
  const f=fixture(),s=createSapSources({...f.host,isTreeAvailable:f.isTreeAvailable,sources:[f.tap().source]});
  assert.equal(s.step().inserted,8);
  const c=empty(),a=transfer(f,{direction:'collect',position:outlet,units:8,container:c});
  assert.equal(f.engine.extract(...outlet,8).units,a.units);
  const held=containerAfter(c,a.container.after),b=transfer(f,{direction:'place',position:p,units:8,container:held});
  assert.ok(f.engine.insert(...p,id,b.units,b.moved));assert.equal(b.container.after.units,0);
  const k=createSapCuring({...f.host,canCure:yes,enabled:true,dwellVisits:2});assert.ok(k.track(...p));
  assert.equal(k.step().proposals.length,0);const proposal=k.step().proposals[0];
  const opts={...f.host,curing:k,proposal,canPlaceAmber:yes},before=f.engine.save();
  const plan=planHardenedAmber(opts);assert.equal(plan.physicsProposal,proposal);assert.equal(plan.material,'amber');assert.equal(plan.solidUnits,8);
  assert.deepEqual(f.engine.save(),before);assert.equal(planHardenedAmber({...opts,canPlaceAmber:()=>false}),null);
  assert.equal(planHardenedAmber({...opts,proposal:{...proposal}}),null);
  const removed=f.engine.extract(...p,8);assert.ok(f.engine.insert(...p,id,8,removed.quantities));
  assert.equal(planHardenedAmber(opts),null);assert.deepEqual(totals(f.engine),[8,0]);
});

test('paired source/curing restore keeps stock and rejects a pre-restore amber proposal',()=>{
  const a=fixture(),cfg=[a.tap().source],s=createSapSources({...a.host,isTreeAvailable:a.isTreeAvailable,sources:cfg});
  s.step();const k=createSapCuring({...a.host,canCure:yes,enabled:true,dwellVisits:1});k.track(...outlet);
  const old=k.step().proposals[0],saved=JSON.parse(JSON.stringify({engine:a.engine.save(),source:s.save(),curing:k.save()}));
  const b=fixture({snapshot:saved.engine});
  const t=createSapSources({...b.host,isTreeAvailable:b.isTreeAvailable,sources:cfg,snapshot:saved.source});
  const r=createSapCuring({...b.host,canCure:yes,enabled:true,dwellVisits:1,snapshot:saved.curing});
  assert.equal(t.step().inserted,0);assert.equal(t.save().sources[0].remaining,0);
  const opts={...b.host,curing:r,canPlaceAmber:yes};assert.equal(planHardenedAmber({...opts,proposal:old}),null);
  assert.ok(planHardenedAmber({...opts,proposal:r.step().proposals[0]}));assert.deepEqual(totals(b.engine),[8,0]);
});

test('deposit planning stays read-only even when a disposable core cannot admit all inserts',()=>{
  const f=fixture({maxCells:1}),before=f.engine.save();
  const plan=planAmberDeposit({...f.host,origin,isLiner:(...q)=>liner.has(key(q)),canDeposit:yes,stockId:'stock-1',stockRevision:0,availableUnits:16,units:16});
  assert.equal(plan.stock.debit,16);assert.equal(plan.inserts.length,2);assert.deepEqual(f.engine.save(),before);
  const staged=fixture({maxCells:1,snapshot:before});
  assert.ok(staged.engine.insert(...plan.inserts[0].position,id,8));assert.equal(staged.engine.insert(...plan.inserts[1].position,id,8),false);
  // Discard staging; no actual live stock/terrain commit exists.
  assert.deepEqual(f.engine.save(),before);assert.equal(f.inspect().freeUnits,72);
});

test('unloaded sap hides mesh and cue, rejected dirty handoff is retained for retry',()=>{
  const f=fixture(),s=createSapSources({...f.host,isTreeAvailable:f.isTreeAvailable,sources:[f.tap().source]});
  const receipt=s.step();f.setLoaded(false);
  assert.equal(sampleAmberSapVisual({...f.host,x:outlet[0],y:outlet[1],z:outlet[2]}),null);
  assert.equal(geometry(f,outlet).faceCount,0);assert.equal(f.inspect(),null);assert.equal(s.step().inserted,0);
  const failed=route(receipt.changed,false);assert.equal(failed.receipt.accepted,false);assert.equal(failed.receipt.reason,'cache-budget');
  f.setLoaded(true);const retried=route(receipt.changed);assert.equal(retried.receipt.accepted,true);
  assert.deepEqual(retried.calls,failed.calls);assert.ok(geometry(f,outlet).faceCount>0);assert.deepEqual(totals(f.engine),[8,0]);
});
