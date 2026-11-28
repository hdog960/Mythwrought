import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.env.AMBER_TRANSFER_PEER_ROOT;
assert.ok(root,'Set AMBER_TRANSFER_PEER_ROOT to the exact pinned peer modules');
function verify(url,expected){const b=readFileSync(url);assert.equal(createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex'),expected);}
const pins={'engine.mjs':'48269883882fd04020bf3856ac1350a607f842a7',
  'definition.mjs':'d44b2d5e5c561f5faf78961de0d39ec23e812b31',
  'water-definition.mjs':'78bb5be0317698b0a7e2c27ad69f13d58d2bb054'};
for(const [file,sha] of Object.entries(pins))verify(pathToFileURL(resolve(root,file)),sha);
verify(new URL('../../../src/liquids/amber-sap/content/transfers.mjs',import.meta.url),'e0501ad5aa4f418c23611b83ecc62326ff7cb086');
const load=file=>import(pathToFileURL(resolve(root,file)).href);
const {createLiquidEngine}=await load('engine.mjs');
const {AMBER_SAP_DEFINITION}=await load('definition.mjs');
const {WATER_DEFINITION}=await load('water-definition.mjs');
const {prepareAmberTransferHandoff:prepare}=await import('../../../src/liquids/amber-sap/content/transfer-handoff.mjs');
const position=[20,0,0], isLoaded=()=>true;
const isOpen=(x,y,z)=>y===0&&z===0&&[0,1,20,21].includes(x);
const make=snapshot=>createLiquidEngine({isLoaded,isOpen,definitions:[AMBER_SAP_DEFINITION,WATER_DEFINITION],maxCells:2,snapshot});
const vessel=(units=0,quantities={},revision=0)=>Object.freeze({id:'vessel',revision,capacity:8,liquidId:units?'amber-sap':null,units,quantities:Object.freeze(quantities)});
function setup(){const e=make(null);assert.ok(e.insert(0,0,0,'water',8,{trace:11}));assert.ok(e.insert(...position,'amber-sap',5,{trace:7}));
  // Both separated pools have a passable neighbor but no spare resident slot.
  e.tick();assert.equal(e.tick().pending,0);assert.deepEqual(e.save().capacityBlocked,[[0,0,0],[20,0,0]]);return e;}
function request(e,c,units,direction='collect',p=position,extra={}){return prepare({engine:e,container:c,units,direction,position:p,isLoaded,isOpen,canTransfer:()=>true,...extra});}
function nextVessel(plan){const a=plan.container.after;return vessel(a.units,a.quantities,plan.container.revision+1);}
const confirm=(h,e,c,extra={})=>h.confirm({committed:true,engine:e,container:c,isLoaded,isOpen,...extra});

test('full collection in private fixture releases a slot and requests work for distant dormant water',()=>{
  const live=setup(),before=live.save(),h=request(live,vessel(),5);assert.deepEqual(live.save(),before);
  const staged=make(JSON.parse(JSON.stringify(before)));const taken=staged.extract(...position,5);
  assert.deepEqual(taken.quantities,h.plan.moved);const c=nextVessel(h.plan);
  assert.deepEqual(staged.save().capacityBlocked,[[0,0,0]]);
  assert.deepEqual(confirm(h,staged,c),{changed:[position],requestStep:true,capacityReleased:true});
  const r=staged.tick(1);assert.equal(r.moved,4);assert.deepEqual(r.changed,[[0,0,0],[1,0,0]]);
  assert.equal(staged.getCell(0,0,0).quantities.trace+staged.getCell(1,0,0).quantities.trace,11);
  assert.equal(c.units,5);assert.equal(c.quantities.trace,7);assert.deepEqual(live.save(),before);
});
test('partial collection retains capacity and never manufactures a free slot',()=>{
  const e=setup(),h=request(e,vessel(),2);e.extract(...position,2);const c=nextVessel(h.plan);
  assert.deepEqual(confirm(h,e,c),{changed:[position],requestStep:true,capacityReleased:false});
  assert.equal(e.tick().moved,0);assert.equal(e.getCell(1,0,0),null);
  assert.equal(e.getCell(...position).quantities.trace+c.quantities.trace,7);
});
test('placement at cap is not a successful handoff and cannot debit a vessel',()=>{
  const e=setup(),c=vessel(2,{trace:3}),h=request(e,c,2,'place',[21,0,0]);assert.ok(h);
  const before=e.save();assert.equal(e.insert(21,0,0,'amber-sap',2,h.plan.moved),false);
  assert.equal(confirm(h,e,c,{committed:false}),null);assert.equal(confirm(h,e,nextVessel(h.plan)),null);
  assert.deepEqual(e.save(),before);assert.equal(c.units,2);
});
test('successful partial placement reports the explicit dirty origin without a capacity release',()=>{
  const e=setup(),c=vessel(3,{trace:8}),h=request(e,c,2,'place');assert.ok(e.insert(...position,'amber-sap',2,h.plan.moved));
  const next=nextVessel(h.plan);assert.deepEqual(confirm(h,e,next),{changed:[position],requestStep:true,capacityReleased:false});
  assert.equal(e.getCell(...position).quantities.trace+next.quantities.trace,15);
});
test('adoption confirmation rejects stale inventory, mismatched quantities and unavailable terrain',()=>{
  const e=setup(),c=vessel(),h=request(e,c,5);e.extract(...position,5);const next=nextVessel(h.plan);
  assert.equal(confirm(h,e,c),null);assert.equal(confirm(h,e,vessel(5,{trace:6},1)),null);
  assert.equal(confirm(h,e,{...next,id:'other'}),null);assert.equal(confirm(h,e,next,{isLoaded:()=>false}),null);
  assert.equal(confirm(h,e,next,{isOpen:()=>false}),null);assert.equal(confirm(h,e,next,{committed:false}),null);
  const signal=confirm(h,e,next);assert.ok(Object.isFrozen(signal)&&Object.isFrozen(signal.changed)&&Object.isFrozen(signal.changed[0]));
  assert.equal(confirm(h,e,next),signal); // stable read-only signal, not replay authorization
  assert.ok(e.insert(...position,'water',1));assert.equal(confirm(h,e,next),null);
});
test('denied Creative and exhausted container revision do not produce a handoff',()=>{
  const e=setup(),before=e.save();assert.equal(request(e,vessel(),1,'collect',position,{creative:true,canTransfer:()=>false}),null);
  assert.equal(request(e,vessel(0,{},Number.MAX_SAFE_INTEGER),1),null);assert.deepEqual(e.save(),before);
});
