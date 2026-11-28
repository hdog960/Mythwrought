import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createLavaResourceAdapter} from '../../../src/liquids/lava/content/resources.mjs';
const peer=resolve(process.env.LAVA_TRANSACTIONS_MODULE??'missing-peer');
for(const [p,sha] of [[peer,'1f5dcc886bbf2adcf2bc6d2d69a88c77115d569f'],[resolve(dirname(peer),'definition.mjs'),'93f6559d51ec1c1b6b2ac9aa4776129903fc3e96']]){
  const bytes=readFileSync(p);assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),sha);
}
const {describeQuenchReceipt}=await import(pathToFileURL(peer).href);
const freeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
const receipt=(id='r1',units=3,y=0)=>({id,product:'lava-quench',productInputs:[
  {x:0,y,z:0,id:'water',units,quantities:{}},{x:1,y,z:0,id:'lava',units,quantities:{'lava-heat':units*71}}]});
const shared=(products=[receipt()],revision=7)=>freeze({version:1,worldId:'world-a',policyId:'policy-a',revision,products});
function setup(opts={}){const a=createLavaResourceAdapter({describeQuenchReceipt,canClaim:()=>true,allowClaims:true,...opts});return {a,c:a.emptyClaims('world-a','policy-a')};}
const stage=(a,s,c,kind='cooled-rock',receiptId='r1')=>a.stage({shared:s,claims:c,kind,receiptId});
test('disabled by default',()=>{const a=createLavaResourceAdapter({describeQuenchReceipt,canClaim:()=>true});assert.equal(stage(a,shared(),a.emptyClaims('world-a','policy-a')),null);});
test('all eight volumes route exact mass to either symbolic resource; receipt remains intact',()=>{
  for(let n=1;n<=8;n++)for(const kind of ['cooled-rock','foundry-feedstock']){const {a,c}=setup(),s=shared([receipt('r1',n,-210)]),before=JSON.stringify(s),p=stage(a,s,c,kind);
    assert.deepEqual(p.output,{kind,units:n,receiptId:'r1',at:[1,-210,0]});assert.equal(p.nextRevision,8);assert.equal(a.validate(p,{shared:s,claims:c}),true);assert.equal(JSON.stringify(s),before);assert.deepEqual(c.claimed,[]);assert.deepEqual(p.claims.claimed,['r1']);}
});
test('claim cannot be replayed or routed again after adoption and restore',()=>{
  const {a,c}=setup(),s=shared(),p=stage(a,s,c);assert.equal(a.validate(p,{shared:s,claims:c}),true);assert.equal(a.validate(p,{shared:s,claims:c}),false);
  const successor=shared([receipt()],8),restored=freeze(JSON.parse(JSON.stringify(p.claims)));assert.equal(a.validateClaims(successor,restored),true);assert.equal(stage(a,successor,restored,'foundry-feedstock'),null);
});
test('stale competing plans, forged plans and different canonical instances reject',()=>{
  const {a,c}=setup(),s=shared(),p=stage(a,s,c),q=stage(a,s,c);assert.equal(a.validate({...p},{shared:s,claims:c}),false);assert.equal(a.validate(p,{shared:s,claims:c}),true);
  assert.equal(a.validate(q,{shared:shared([receipt()],8),claims:p.claims}),false);
  const r=stage(a,s,c);assert.equal(a.validate(r,{shared:shared(),claims:c}),false);
});
test('host permission required at both stages',()=>{
  let allowed=false;const {a,c}=setup({canClaim:()=>allowed}),s=shared();assert.equal(stage(a,s,c),null);allowed=true;const p=stage(a,s,c);allowed=false;assert.equal(a.validate(p,{shared:s,claims:c}),false);allowed=true;assert.equal(a.validate(p,{shared:s,claims:c}),false);
});
test('foreign and malformed owner products cannot be claimed',()=>{
  const {a,c}=setup();const bad=receipt();bad.productInputs[1].units=2;assert.equal(stage(a,shared([bad]),c),null);
  const foreign=receipt();foreign.product='cooled-lava';assert.equal(stage(a,shared([foreign]),c),null);
  assert.equal(stage(a,shared([]),c),null);
});
test('bounded history and claims reject rather than evict',()=>{
  const {a,c}=setup({maxReceipts:2,maxClaims:1}),s=shared([receipt(),receipt('r2')]);const p=stage(a,s,c);assert.equal(a.validate(p,{shared:s,claims:c}),true);
  assert.equal(stage(a,shared([receipt(),receipt('r2')],8),p.claims,'cooled-rock','r2'),null);assert.throws(()=>stage(a,shared([receipt(),receipt('r2'),receipt('r3')]),c));
});
test('duplicate, orphan and cross-world claims or receipts fail closed',()=>{
  const {a,c}=setup(),s=shared();assert.throws(()=>stage(a,shared([receipt(),receipt()]),c));
  for(const bad of [{...c,claimed:['r1','r1']},{...c,claimed:['missing']},{...c,worldId:'other'},{...c,policyId:'other'}])assert.throws(()=>stage(a,s,freeze(bad)));
  assert.throws(()=>stage(a,{...s},c));assert.throws(()=>stage(a,s,{...c}));
});
test('unrelated receipts preserved, revision overflow rejected, outputs immutable',()=>{
  const {a,c}=setup(),foreign=receipt('r2');foreign.product='other-product';const s=shared([foreign,receipt()]);const p=stage(a,s,c);assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.output)&&Object.isFrozen(p.claims.claimed));assert.equal(s.products.length,2);assert.equal(stage(a,shared([receipt()],Number.MAX_SAFE_INTEGER),c),null);
});
