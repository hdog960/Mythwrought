import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createAcidResourceProcessing as create} from '../../../src/liquids/acid/content/resource-processing.mjs';
const path=resolve(process.env.ACID_PHYSICS_MODULE??'');
const bytes=readFileSync(path);
assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),'3fc22a876f07fe8965858d5187ddee1438b06e2d');
const {readAcidStrength,acidQuantities}=await import(pathToFileURL(path).href);
// Fixture-only economics and symbolic IDs, never registered game recipes.
const ore={id:'fixture-ore',kind:'mineral-processing',input:'fixture-raw',inputUnits:2,
  output:'fixture-refined',outputUnits:1,acidUnits:4,minStrength:500};
const alchemy={...ore,id:'fixture-alchemy',kind:'alchemy',input:'fixture-herb',output:'fixture-reagent'};
const make=(over={})=>create({readAcidStrength,canProcess:()=>true,enabled:true,policyId:'fixture-policy',recipes:[ore,alchemy],...over});
const request=(r=ore,over={})=>({recipeId:r.id,revision:7,canister:{id:'acid',units:4,quantities:{...acidQuantities(4,600),trace:13}},
  input:{id:r.input,units:5},output:{id:r.output,units:2},...over});
test('no recipe is enabled or registered by default',()=>{
  let reads=0;const a=create({readAcidStrength:()=>{reads++;return 600;},canProcess:()=>{reads++;return true;}});
  assert.deepEqual(a.recipes,[]);assert.equal(a.stage(request()),null);
  assert.equal(make({enabled:false,canProcess:()=>{reads++;return true;}}).stage(request()),null);
  assert.equal(reads,0);
});
test('both configured resource categories produce exact finite staging deltas',()=>{
  const a=make();for(const r of [ore,alchemy]){
    const req=request(r),original=structuredClone(req),p=a.stage(req);
    assert.deepEqual(req,original);assert.equal(p.expectedRevision,7);assert.equal(p.policyId,'fixture-policy');
    assert.deepEqual(p.before,{canister:req.canister,input:req.input,output:req.output});
    assert.deepEqual(p.after,{canister:null,input:{id:r.input,units:3},output:{id:r.output,units:3}});
    assert.deepEqual(p.reagentReceipt,{kind:'acid-reagent-consumption',recipeId:r.id,acid:req.canister});
    assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.before.canister.quantities)&&Object.isFrozen(p.after.input));
    req.canister.quantities.trace=999;assert.equal(p.reagentReceipt.acid.quantities.trace,13);
  }
});
test('actual owner strength gates diluted, zero and threshold-edge payloads',()=>{
  const a=make();for(const s of [0,499,500]){
    const p=a.stage(request(ore,{canister:{id:'acid',units:4,quantities:acidQuantities(4,s)}}));
    assert.equal(p!==null,s===500);
  }
});
test('whole-canister policy refuses partial or excess volume',()=>{
  const a=make();for(const units of [1,3,5,8])assert.equal(a.stage(request(ore,{canister:{id:'acid',units,quantities:acidQuantities(units)}})),null);
  assert.equal(a.stage(request(ore,{canister:null})),null);
});
test('invalid payload or material identity fails closed',()=>{
  const a=make();for(const c of [{id:'water',units:4,quantities:{}},{id:'acid',units:4,quantities:{'acid-solute':4001}},
    {id:'acid',units:4,quantities:{trace:-1}},{id:'acid',units:4,quantities:{trace:2**40+1}},
    {id:'acid',units:4,quantities:{trace:1.5}}])assert.throws(()=>a.stage(request(ore,{canister:c})),TypeError);
  assert.throws(()=>a.stage(request(ore,{input:{id:'wrong',units:5}})),TypeError);
  assert.throws(()=>a.stage(request(ore,{revision:-1})),TypeError);
});
test('short stock, full output and explicit permission denial leave state unchanged',()=>{
  let calls=0;const a=make({maxStack:5,canProcess:()=>{calls++;return false;}});
  const cases=[request(ore,{input:{id:ore.input,units:1}}),request(ore,{output:{id:ore.output,units:5}}),request()];
  for(const req of cases){const old=structuredClone(req);assert.equal(a.stage(req),null);assert.deepEqual(req,old);}
  assert.equal(calls,1);
});
test('catalog rejects ambiguous or unapproved definitions and snapshots recipe bytes',()=>{
  for(const recipes of [[ore,ore],[{...ore,output:'acid'}],[{...ore,output:ore.input}],[{...ore,minStrength:0}],
    [{...ore,outputUnits:0}],[{...ore,kind:'unknown'}],[{...ore,extra:true}]])assert.throws(()=>make({recipes}),TypeError);
  assert.throws(()=>make({maxRecipes:1}),TypeError);assert.throws(()=>make({policyId:'disabled'}),TypeError);
  const r={...ore};const a=make({recipes:[r]});r.outputUnits=99;
  assert.equal(a.stage(request()).recipe.outputUnits,1);assert.ok(Object.isFrozen(a.recipes)&&Object.isFrozen(a.recipes[0]));
  assert.equal(a.stage(request(ore,{recipeId:'unknown'})),null);
});
test('reference host CAS rejects replay; accounting retains exact reagent quantities',()=>{
  const a=make();let state=request();const p=a.stage(state),receipts=[];
  function adopt(plan){if(plan.expectedRevision!==state.revision)return false;
    state={...state,...plan.after,revision:state.revision+1};receipts.push(plan.reagentReceipt);return true;}
  assert.equal(adopt(p),true);assert.equal(adopt(p),false);assert.equal(a.stage(state),null);
  assert.equal(receipts.length,1);assert.deepEqual(receipts[0].acid.quantities,{'acid-solute':2400,trace:13});
  assert.equal(receipts[0].acid.units,4);
});
