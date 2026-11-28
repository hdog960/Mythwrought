// Isolated COMBAT/MOB v1 interface prototype. Actual original MobEngine HP.
// Private fixture engine only; NOT a durable or live authority.
import {MobEngine} from '../engine.mjs';
const keys=['worldId','profileId','transactionId','actionId','sourceId','targetId','definitionId','fixture'];
const id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x);
export function createFixtureDamageOwner(world,checkpoint,{worldId,profileId,recoverableIds=[]}={}){
 if(!id(worldId)||!id(profileId)||!Array.isArray(recoverableIds)||recoverableIds.length>32||!recoverableIds.every(id)||checkpoint?.maxEntities>32||checkpoint?.maxActive>8)throw TypeError('Invalid fixture owner');
 const engine=MobEngine.fromCheckpoint(world,checkpoint),recoverable=new Set(recoverableIds),history=new Map();
 let revision=0;
 const canonical=r=>JSON.stringify([r.version,...keys.map(k=>r[k]),r.amount,r.expectedRevision]);
 function commit(r){
  if(!r||r.version!==1||r.fixture!==true||r.worldId!==worldId||r.profileId!==profileId||!keys.slice(0,-1).every(k=>id(r[k]))||r.sourceId===r.targetId||!Number.isSafeInteger(r.expectedRevision)||r.expectedRevision<0||!Number.isFinite(r.amount)||r.amount<0||r.amount>100000)return null;
  const requestKey=canonical(r),prior=history.get(r.transactionId);
  if(prior)return prior.key===requestKey?prior.result:null;
  if(history.size>=256||revision===Number.MAX_SAFE_INTEGER)return null;
  const target=engine.get(r.targetId),source=engine.get(r.sourceId);
  if(!target)return null;
  const before=target.health,beforeRevision=revision,expectedDelta=before-Math.max(0,before-r.amount);
  const accepted=r.expectedRevision===revision&&source&&['active','idle'].includes(source.state)&&['active','idle'].includes(target.state)&&expectedDelta>0&&expectedDelta<=r.amount&&engine.damage(r.targetId,r.amount,{recoverable:recoverable.has(r.targetId)})===true;
  const afterEntity=engine.get(r.targetId),after=accepted?(afterEntity?.health??0):before;
  const terminal=accepted?(!afterEntity?'removed':afterEntity.state==='downed'?'downed':'none'):'none';
  if(accepted)revision++;
  const receipt=Object.freeze({version:1,...Object.fromEntries(keys.map(k=>[k,r[k]])),accepted:!!accepted,before,after,applied:before-after,terminal,permanentDefeat:false});
  // Stale rejection is diagnostic only, never an AV committed record.
  const result=Object.freeze({version:1,committed:r.expectedRevision===beforeRevision,requestAmount:r.amount,beforeRevision,afterRevision:revision,receipt});
  history.set(r.transactionId,{key:requestKey,result});return result;
 }
 return Object.freeze({commit,revision:()=>revision,get:id=>engine.get(id),checkpoint:()=>engine.checkpoint()});
}
