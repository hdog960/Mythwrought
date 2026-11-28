// Fixture-only: award authority is private, based on retained outbox records.
import {createDurableFixtureLedger} from './durable-ledger.mjs';
export function createFixtureReplay({scope,source,skill,amount,storage,readContext}={}){
  if(typeof storage?.event!=='function'||typeof source!=='string')throw Error('Invalid outbox');
  const proofs=new WeakMap();
  const ledger=createDurableFixtureLedger({scope,storage,readContext,rules:[{source,skill,amount,verify:e=>proofs.get(e)}]});
  let busy=false;
  return Object.freeze({read:ledger.read,restoreBackup:ledger.restoreBackup,async replayNext(){
    if(busy)return {ok:false,reason:'busy'};busy=true;
    try{
      const v=await ledger.read();if(!['empty','ready'].includes(v.kind))return {ok:false,reason:v.kind};
      const sequence=v.progress.cursors[source]+1;
      if(!Number.isSafeInteger(sequence))return {ok:false,reason:'capacity'};
      const event=await storage.event(sequence);
      if(event===null)return {ok:false,reason:'empty-outbox'};
      if(event?.producer!==source||event.sequence!==sequence||typeof event.semantic!=='string'||
        !/^[a-zA-Z0-9:_./-]{1,96}$/.test(event.semantic))return {ok:false,reason:'corrupt-outbox'};
      const proof={};proofs.set(proof,sequence);
      return await ledger.award(source,proof);
    }catch{return {ok:false,reason:'storage-error'};}finally{busy=false;}
  }});
}
