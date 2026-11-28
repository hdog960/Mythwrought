import {openFixtureStorage} from '../../src/path-of-mastery/fixture-storage.mjs';
import {createDurableFixtureLedger} from '../../src/path-of-mastery/durable-ledger.mjs';
export async function runStorageChecks(indexedDB,scope='fixture:browser'){
  let checks=0;const assert=(ok,msg)=>{if(!ok)throw Error(msg);checks++;};
  let mode='survival';const tokens=new WeakMap(),context=()=>({scope,mode,writable:true});
  const token=id=>{const t={};tokens.set(t,id);return t;};
  const opts={indexedDB,scope,producer:'mine',verify:e=>tokens.get(e),readContext:context};
  const a=await openFixtureStorage(opts),b=await openFixtureStorage(opts);
  const rules=[{source:'mine',skill:'pm:mining',amount:30,verify:e=>tokens.get(e)}];
  const ledger=storage=>createDurableFixtureLedger({scope,rules,storage,readContext:context});
  try{
    assert(await a.read()===null,'initial empty');
    const dup=await Promise.all([a.record(token('natural:cell1')),b.record(token('natural:cell1'))]);
    assert(dup.filter(x=>x.ok).length===1,'concurrent semantic uniqueness');
    assert(dup.every(x=>x.sequence===1),'same sequence');
    const next=await b.record(token('natural:cell2'));assert(next.ok&&next.sequence===2,'ordered producer');
    const l=ledger(a),r=ledger(b),first=await a.event(1),second=await b.event(2);
    assert(first.semantic==='natural:cell1'&&second.semantic==='natural:cell2','outbox identities');
    assert((await l.award('mine',token(2))).reason==='gap','gap blocked');
    const gain=await Promise.all([l.award('mine',token(1)),r.award('mine',token(1))]);
    assert(gain.filter(x=>x.ok).length===1,'atomic XP CAS');
    assert((await l.read()).progress.xp['pm:mining']===30,'one award');
    a.close();b.close();const c=await openFixtureStorage(opts);
    try{
      const restored=ledger(c);assert((await restored.read()).progress.xp['pm:mining']===30,'reopened ledger');
      assert((await c.record(token('natural:cell1'))).reason==='duplicate','reopened semantic index');
      assert((await c.event(2)).sequence===2,'pending outbox survives reopen');
      assert((await restored.award('mine',token(2))).ok,'replay pending');
      assert((await restored.award('mine',token(2))).reason==='duplicate','replay rejected');
      mode='creative';assert((await c.record(token('natural:cell3'))).ok===false,'creative denied');mode='survival';
      assert((await restored.restoreBackup(true)).ok,'explicit rollback');
      assert((await restored.award('mine',token(2))).reason==='sealed','rollback sealed');
      assert((await c.event(2)).semantic==='natural:cell2','outbox remains');
    }finally{c.close();}
  }finally{a.close();b.close();}
  return checks;
}
