// Fixture port contract: storage owner must compare ledger and specialization in ONE transaction.
export function createGuardedAllocationPort({scope,ledger,readLedgerBytes,port,readContext}={}){
 if(typeof scope!=='string'||!/^fixture:[a-zA-Z0-9:_./-]{1,80}$/.test(scope)||typeof ledger?.read!=='function'||typeof readLedgerBytes!=='function'||typeof port?.read!=='function'||typeof port?.compareExchangeWithLedger!=='function'||typeof readContext!=='function')throw Error('Invalid guarded port');
 let ticket=null;
 const allowed=()=>{const c=readContext();return c?.scope===scope&&c.mode==='survival'&&c.writable===true&&c.inCombat===false&&c.hostileEngagement===false;};
 return Object.freeze({async capture(){ticket=null;try{const before=await readLedgerBytes(),view=await ledger.read(),after=await readLedgerBytes();if(before!==after||!['empty','ready'].includes(view.kind)||!allowed())return null;ticket={bytes:after,revision:view.progress.revision};return view;}catch{return null;}},
   read:()=>port.read(),async compareExchange(expected,next){const t=ticket;ticket=null;if(!t||!allowed())return false;try{return await port.compareExchangeWithLedger(expected,next,t.bytes)===true;}catch{return false;}},invalidate(){ticket=null;}});
}

// Adapter for the existing protected session. Bind each CAS to the ledger bytes
// observed during that session's most recent validated ledger read.
import {createFixtureSkillSession} from './fixture-skill-session.mjs';
export function createAtomicFixtureSkillSession({scope,ledger,readLedgerBytes,storageFor,readContext,definitions}={}){
 if(typeof readLedgerBytes!=='function'||typeof storageFor!=='function')throw Error('Atomic host required');
 let observed=null,valid=false;
 const read=async()=>{valid=false;const a=await readLedgerBytes(),v=await ledger.read(),b=await readLedgerBytes();if(a!==b)return {kind:'unavailable',progress:null};observed=b;valid=['empty','ready'].includes(v.kind);return v;};
 const wrapped=id=>{const p=storageFor(id);if(typeof p?.compareExchangeWithLedger!=='function')throw Error('Atomic port required');return {read:()=>p.read(),async compareExchange(e,n){const c=readContext();if(!valid||c?.scope!==scope||c.mode!=='survival'||c.writable!==true||c.inCombat!==false||c.hostileEngagement!==false)return false;const expected=observed;valid=false;return p.compareExchangeWithLedger(e,n,expected);}};};
 return createFixtureSkillSession({scope,ledger:{read},readContext,storageFor:wrapped,definitions});
}
