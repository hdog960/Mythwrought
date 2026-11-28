import {openFixtureStorage} from '../../src/path-of-mastery/fixture-storage.mjs';
import {createFixtureReplay} from '../../src/path-of-mastery/replay-bridge.mjs';
import {createDurableSpecialization} from '../../src/path-of-mastery/durable-specialization.mjs';
export async function runSession5(indexedDB,scope){
  let checks=0,inCombat=false;const assert=(ok,msg)=>{if(!ok)throw Error(msg);checks++;};
  const tokens=new WeakMap(),token=id=>{const t={};tokens.set(t,id);return t;};
  const readContext=()=>({scope,mode:'survival',writable:true,inCombat});
  const opts={indexedDB,scope,producer:'mine',verify:t=>tokens.get(t),readContext};
  const a=await openFixtureStorage(opts),b=await openFixtureStorage(opts);
  const replay=storage=>createFixtureReplay({scope,source:'mine',skill:'pm:mining',amount:30,storage,readContext});
  const spec=storage=>createDurableSpecialization({scope,readContext,readLevel:()=>99,storage:storage.specializationPort('pm:mining'),definition:{skill:'pm:mining',nodes:[{id:'a',level:1,costs:[1,2],requires:[],excludes:[],effect:'power'}]},effects:[{id:'power',kind:'passive',contract:'fixture:power'}]});
  try{
    const recorded=await Promise.all([a.record(token('natural:one')),b.record(token('natural:one'))]);assert(recorded.filter(x=>x.ok).length===1,'semantic uniqueness');
    const awards=await Promise.all([replay(a).replayNext(),replay(b).replayNext()]);assert(awards.filter(x=>x.ok).length===1,'XP race');
    await a.record(token('natural:two'));const s=spec(a);assert((await s.purchase('a',0)).ok,'rank persisted');assert((await s.savePreset('P',1)).ok,'preset persisted');
    a.close();b.close();const c=await openFixtureStorage(opts);
    try{const r=replay(c),p=spec(c);assert((await r.replayNext()).ok,'pending outbox replay');assert((await r.read()).progress.xp['pm:mining']===60,'XP exact');assert((await r.replayNext()).reason==='empty-outbox','no repeat');assert((await p.read()).view.spent===1,'rank reopened');assert((await p.respec(2)).view.remaining===32,'full refund');assert((await p.applyPreset('P',3)).view.spent===1,'preset reopened');inCombat=true;assert((await p.respec(4)).reason==='context','combat denied');assert((await r.read()).progress.xp['pm:mining']===60,'XP independent');}finally{c.close();}
  }finally{a.close();b.close();}return checks;
}
