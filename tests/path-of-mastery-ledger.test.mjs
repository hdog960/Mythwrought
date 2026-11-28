import test from 'node:test';
import assert from 'node:assert/strict';
import { createExperienceLedger, RECEIPT_LIMIT } from '../src/path-of-mastery/ledger.mjs';
import { CANDIDATE_CURVE } from '../src/path-of-mastery/experience.mjs';
const scope='fixture:test';
function fixture(snapshot, amount=30) {
  let context={scope,mode:'survival',writable:true};
  const tokens=new WeakMap();
  const verify=t=>tokens.get(t);
  const fixtureRules=[{source:'mine',skill:'pm:mining',amount,verify},
    {source:'discover',skill:'pm:exploration',amount:100,verify}];
  const ledger=createExperienceLedger({scope,readContext:()=>context,snapshot,fixtureRules});
  return {ledger,context:c=>{context=c;},token:id=>{const t={};tokens.set(t,id);return t;},fixtureRules};
}
test('live scope cannot register fixtures or restore any prototype snapshot',()=>{
  const world={scope:'world:one',readContext:()=>({scope:'world:one',mode:'survival',writable:true})};
  const l=createExperienceLedger(world);
  assert.equal(l.source('mine'),null);
  assert.equal(Object.keys(l.snapshot().xp).length,24);
  assert.equal(l.progress('pm:mining').level,1);
  assert.equal(l.progress('unknown'),null);
  assert.throws(()=>createExperienceLedger({...world,fixtureRules:fixture().fixtureRules}));
  assert.throws(()=>createExperienceLedger({...world,snapshot:fixture().ledger.snapshot()}));
});
test('verified source awards only its skill and authoritative amount; forged input rejected',()=>{
  const f=fixture(), mine=f.ledger.source('mine');
  assert.equal(mine({action:'a',amount:99999,success:true}).reason,'unverified');
  assert.equal(mine(f.token('a')).gain.after.level,2);
  assert.equal(f.ledger.progress('pm:mining').xp,30);
  assert.equal(f.ledger.progress('pm:exploration').xp,0);
  assert.equal(f.ledger.source('discover')(f.token('a')).ok,true);
  assert.equal(f.ledger.progress('pm:exploration').xp,100);
  assert.equal(mine(f.token('a')).reason,'duplicate');
});
test('mode, scope, writable and authority failure deny without mutation',()=>{
  const f=fixture(), mine=f.ledger.source('mine'), before=f.ledger.snapshot();
  for (const c of [{scope,mode:'creative',writable:true},{scope,mode:'survival',writable:false},
    {scope:'fixture:other',mode:'survival',writable:true},null,{scope,mode:'survival',writable:1}]) {
    f.context(c); assert.equal(mine(f.token('a')).reason,'context');
  }
  assert.deepEqual(f.ledger.snapshot(),before);
  const l=createExperienceLedger({scope,readContext:()=>{throw Error('offline');},fixtureRules:f.fixtureRules});
  assert.equal(l.source('mine')(f.token('a')).reason,'authority-error');
});
test('snapshot round trip preserves dedupe and rejects corruption or cross-scope restore',()=>{
  const f=fixture();f.ledger.source('mine')(f.token('a'));
  const s=f.ledger.snapshot(), r=fixture(JSON.parse(JSON.stringify(s)));
  assert.equal(r.ledger.source('mine')(r.token('a')).reason,'duplicate');
  assert.equal(r.ledger.source('mine')(r.token('b')).ok,true);
  assert.equal(r.ledger.progress('pm:mining').xp,60);
  assert.throws(()=>fixture({...s,xp:{...s.xp,'pm:mining':999}}));
  assert.throws(()=>fixture({...s,receipts:[...s.receipts,...s.receipts]}));
  assert.throws(()=>fixture({...s,scope:'fixture:other'}));
  assert.throws(()=>fixture({...s,curve:'changed'}));
  assert.throws(()=>fixture({...s,receipts:[null]}));
  assert.throws(()=>{s.receipts[0].applied=99;},TypeError);
});
test('maxed skill records zero-credit receipt and never exceeds cap',()=>{
  const f=fixture(undefined,CANDIDATE_CURVE.at(-1)), mine=f.ledger.source('mine');
  assert.equal(mine(f.token('a')).gain.after.level,99);
  assert.equal(mine(f.token('b')).gain.applied,0);
  assert.equal(mine(f.token('b')).reason,'duplicate');
  assert.equal(fixture(f.ledger.snapshot()).ledger.progress('pm:mining').level,99);
});
test('receipt capacity is fail closed without eviction',()=>{
  const f=fixture(), mine=f.ledger.source('mine');
  for(let n=0;n<RECEIPT_LIMIT;n++) assert.equal(mine(f.token('id:'+n)).ok,true);
  const s=f.ledger.snapshot();
  assert.equal(mine(f.token('new')).reason,'receipt-capacity');
  assert.equal(mine(f.token('id:0')).reason,'duplicate');
  assert.deepEqual(f.ledger.snapshot(),s);
});
test('reentrant verifier, context change, duplicate rules and invalid rule rejected',()=>{
  let mode='survival', nested, l;
  const rule={source:'mine',skill:'pm:mining',amount:30,verify:()=>{
    nested=l.source('mine')({});mode='creative';return 'a';}};
  const options={scope,readContext:()=>({scope,mode,writable:true}),fixtureRules:[rule]};
  l=createExperienceLedger(options);
  assert.equal(l.source('mine')({}).reason,'context');
  assert.equal(nested.reason,'reentrant');assert.equal(l.progress('pm:mining').xp,0);
  assert.throws(()=>createExperienceLedger({...options,fixtureRules:[rule,rule]}));
  assert.throws(()=>createExperienceLedger({...options,fixtureRules:[{...rule,amount:-1}]}));
});
