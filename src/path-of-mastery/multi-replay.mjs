// Fixture-only, shared XP CAS with separately trusted producer outboxes.
import {createDurableFixtureLedger} from './durable-ledger.mjs';
export function createMultiFixtureReplay({scope,storage,readContext,producers}={}){
  if(!Array.isArray(producers)||producers.length<1||producers.length>32)throw Error('Invalid producers');
  const bySource=new Map(), proofs=new WeakMap();
  for(const p of producers){
    if(!p||typeof p.event!=='function'||bySource.has(p.source))throw Error('Invalid producer');
    bySource.set(p.source,p.event);
  }
  const ledger=createDurableFixtureLedger({scope,storage,readContext,rules:producers.map(({source,skill,amount})=>({source,skill,amount,verify:e=>proofs.get(e)?.source===source?proofs.get(e).sequence:null}))});
  let busy=false;
  return Object.freeze({read:ledger.read,restoreBackup:ledger.restoreBackup,async replayNext(source){
    if(busy)return {ok:false,reason:'busy'};
    if(!bySource.has(source))return {ok:false,reason:'unknown-source'};
    busy=true;
    try{
      const v=await ledger.read();if(!['empty','ready'].includes(v.kind))return {ok:false,reason:v.kind};
      const sequence=v.progress.cursors[source]+1;if(!Number.isSafeInteger(sequence))return {ok:false,reason:'capacity'};
      const event=await bySource.get(source)(sequence);
      if(event===null)return {ok:false,reason:'empty-outbox'};
      if(event?.producer!==source||event.sequence!==sequence||typeof event.semantic!=='string'||! /^[a-zA-Z0-9:_./-]{1,96}$/.test(event.semantic))return {ok:false,reason:'corrupt-outbox'};
      const proof={};proofs.set(proof,{source,sequence});return await ledger.award(source,proof);
    }catch{return {ok:false,reason:'storage-error'};}finally{busy=false;}
  }});
}
