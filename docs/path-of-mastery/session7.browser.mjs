import {openFixtureStorage} from '../../src/path-of-mastery/fixture-storage.mjs';
import {createMultiFixtureReplay} from '../../src/path-of-mastery/multi-replay.mjs';
export async function runSharedClaims(indexedDB,scope){
  let checks=0;const assert=(ok,msg)=>{if(!ok)throw Error(msg);checks++;};
  const tokens=new WeakMap(),token=s=>{const t={};tokens.set(t,s);return t;};
  const readContext=()=>({scope,mode:'survival',writable:true,inCombat:false,hostileEngagement:false});
  const open=producer=>openFixtureStorage({indexedDB,scope,producer,sharedClaims:true,verify:t=>tokens.get(t),readContext});
  const a=await open('mine'),b=await open('wood');
  try{
    const results=await Promise.all([a.record(token('resource:one')),b.record(token('resource:one'))]);
    assert(results.filter(r=>r.ok).length===1,'one global claim');
    assert(results.filter(r=>r.reason==='claimed-by-other-source').length===1,'cross-source denial');
    const winner=results[0].ok?'mine':'wood',loser=winner==='mine'?b:a;
    assert((await loser.record(token('resource:two'))).sequence===1,'loser cursor unchanged');
    a.close();b.close();const c=await open('mine'),d=await open('wood');
    try{
      const replay=createMultiFixtureReplay({scope,storage:c,readContext,producers:[{source:'mine',skill:'pm:mining',amount:30,event:c.event},{source:'wood',skill:'pm:woodcutting',amount:50,event:d.event}]});
      assert((await replay.replayNext('mine')).ok,'mining replay');assert((await replay.replayNext('wood')).ok,'wood replay');
      assert((await replay.replayNext('mine')).reason==='empty-outbox','no duplicate mining');
      assert((await replay.replayNext('wood')).reason==='empty-outbox','no duplicate wood');
      const v=(await replay.read()).progress;assert(v.xp['pm:mining']===30&&v.xp['pm:woodcutting']===50,'XP exact');
      assert((await (winner==='mine'?d:c).record(token('resource:one'))).reason==='claimed-by-other-source','claim survives reopen');
    }finally{c.close();d.close();}
  }finally{a.close();b.close();}return checks;
}
