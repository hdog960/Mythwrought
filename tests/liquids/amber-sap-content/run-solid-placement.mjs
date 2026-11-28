import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {stageAmberContentPlacement} from '../../../src/liquids/amber-sap/content/solid-placement.mjs';

// Exact peer modules must be supplied outside this branch, in a flat directory.
const root=process.env.AMBER_SOLID_PEER_ROOT;
assert.ok(root,'Set AMBER_SOLID_PEER_ROOT to the pinned peer modules');
async function load(name,sha){
  const path=resolve(root,name),bytes=readFileSync(path);
  const hash=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  assert.equal(hash,sha,name+' Git blob mismatch');
  return import(pathToFileURL(path).href);
}
const {createLiquidEngine}=await load('engine.mjs','ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b');
const {createSapCuring}=await load('curing.mjs','691079552ccc3718fbfda5e2510c9d18c788eea9');
const {createSapSolidification}=await load('solidification.mjs','57a3112004b00dc159c81b46656226a18e02e2b0');
// Fixture definitions: no flow tick, no duplicate physics policy.
const definitions=[{id:'amber-sap',gravityLimit:1,lateralLimit:1},{id:'water',gravityLimit:8,lateralLimit:4}];
function fixture({position=[15,20,0],enabled=true}={}){
  let permitted=true,loaded=true,open=true;
  const isLoaded=()=>loaded,isOpen=()=>open;
  const engine=createLiquidEngine({definitions,isLoaded,isOpen});
  assert.equal(engine.insert(...position,'amber-sap',8),true);
  assert.equal(engine.insert(99,0,0,'water',3,{trace:5}),true);
  const curing=createSapCuring({engine,isLoaded,isOpen,canCure:()=>true,enabled:true,dwellVisits:1});
  curing.track(...position);
  const proposal=curing.step().proposals[0];
  const solidification=createSapSolidification({createLiquidEngine,definitions,isLoaded,isOpen,
    canPlaceAmber:()=>permitted,enabled});
  const args={engine,curing,proposal,solidification,solid:{version:1,cells:[]},revision:7,
    isLoaded,isOpen,canPlaceAmber:()=>permitted,canUseMaterial:()=>true};
  return {args,position,setPermission:v=>permitted=v,setLoaded:v=>loaded=v,setOpen:v=>open=v,
    before:()=>JSON.stringify([engine.save(),curing.save(),args.solid])};
}
test('authorized material receives exact owner stage with no second resource reward',()=>{
  const f=fixture(),before=f.before();let received;
  const out=stageAmberContentPlacement({...f.args,canUseMaterial:(id,p)=>{received=[id,p];return true;}});
  assert.deepEqual(received,['amber',f.position]);
  assert.deepEqual(Object.keys(out),['kind','material','expectedRevision','position','staged']);
  assert.equal(out.kind,'amber-solid-placement');assert.equal(out.expectedRevision,7);
  assert.equal(out.staged.nextRevision,8);
  assert.deepEqual(out.staged.changed,[f.position]);
  assert.deepEqual(out.staged.resident.cells,[f.args.engine.getCell(99,0,0)]);
  assert.deepEqual(out.staged.solid.cells,[f.args.proposal.expected]);
  assert.deepEqual(out.staged.curing.pending,[]);
  assert.equal(f.before(),before);
});
test('material denial never calls owner staging, even when physics is ready',()=>{
  const f=fixture(),before=f.before();let calls=0;
  for(const value of [false,undefined,1])assert.equal(stageAmberContentPlacement({...f.args,
    canUseMaterial:()=>value,solidification:{stage(){calls++;throw Error('must not stage');}}}),null);
  assert.equal(calls,0);assert.equal(f.before(),before);
});
test('protected or unloaded placement and disabled owner remain fail closed',()=>{
  const f=fixture();f.setPermission(false);let before=f.before();
  assert.equal(stageAmberContentPlacement(f.args),null);assert.equal(f.before(),before);
  f.setPermission(true);f.setLoaded(false);before=f.before();
  assert.equal(stageAmberContentPlacement(f.args),null);assert.equal(f.before(),before);
  const d=fixture({enabled:false});before=d.before();
  assert.equal(stageAmberContentPlacement(d.args),null);assert.equal(d.before(),before);
});
test('incompatible material, dirty coordinate or revision from owner is rejected',()=>{
  const f=fixture(),before=f.before(),good=f.args.solidification.stage(f.args);
  for(const bad of [{...good,placement:{...good.placement,product:'other'}},
    {...good,changed:[[16,20,0]]},{...good,nextRevision:9}]){
    assert.throws(()=>stageAmberContentPlacement({...f.args,solidification:{stage:()=>bad}}),TypeError);
  }
  assert.equal(f.before(),before);
});
test('physical edge, stale token and reconstructed successor preserve ledger ownership',()=>{
  const f=fixture({position:[-1,256,0]}),out=stageAmberContentPlacement(f.args);
  assert.deepEqual(out.position,[-1,256,0]);
  const successor=createLiquidEngine({definitions,isLoaded:()=>true,isOpen:()=>true,snapshot:out.staged.resident});
  const curing=createSapCuring({engine:successor,isLoaded:()=>true,isOpen:()=>true,canCure:()=>true,
    enabled:true,dwellVisits:1,snapshot:out.staged.curing});
  assert.equal(successor.getCell(...f.position),null);
  assert.equal(stageAmberContentPlacement({...f.args,engine:successor,curing,solid:out.staged.solid,revision:8}),null);
  assert.equal(out.staged.solid.cells[0].units,8);
  f.args.curing.invalidate(...f.position);
  assert.equal(stageAmberContentPlacement(f.args),null);
});
