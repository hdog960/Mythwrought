// Review-only AV/MOB adapter. Fixture receipts NEVER become award authority.
import {validateFixtureEffect} from './effect-contracts.mjs';
const id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x);
const route={unarmed:'pm:attack',projectile:'pm:archery',spell:'pm:sorcery'};
export function createOwnerReceiptReview({worldId,profileId,lookup,validateReceipt,verifyTransaction}={}){
 if(!id(worldId)||!id(profileId)||typeof lookup!=='function'||typeof validateReceipt!=='function'||typeof verifyTransaction!=='function')throw Error('Invalid owner review');
 return evidence=>{try{
  const w=lookup(evidence),q=w?.request,d=w?.definition;
  if(!q||!d||q.worldId!==worldId||q.profileId!==profileId||q.fixture!==true||d.scope!=='fixture'||d.id!==q.definitionId||!Object.hasOwn(route,d.type)||w.sourceRole!=='player'||w.targetRole!=='hostile-natural'||!id(w.encounterId))return null;
  const checked=verifyTransaction({request:q,record:w.record,validateReceipt}),o=checked.outcome;
  if(!o.accepted||o.fixture!==true||o.applied<=0||o.progressionCandidate!==false||!Number.isSafeInteger(checked.afterRevision)||checked.afterRevision<=0)return null;
  return Object.freeze({kind:'fixture-review',eligibleForXp:false,skill:route[d.type],identity:JSON.stringify([worldId,profileId,q.targetId,w.encounterId,checked.afterRevision]),applied:o.applied,permanentDefeat:o.permanentDefeat});
 }catch{return null;}};
}
// Narrow proposed mapping to real AV stat names. No generic guesses for unsupported stats.
const mapping=Object.freeze({accuracy:'accuracy','physical-power':'physicalAttack','spell-power':'magicalAttack'});
export function reviewCombatModifiers({projections,base,conditionActive=()=>false}={}){
 if(!Array.isArray(projections)||projections.length>216||!base||typeof conditionActive!=='function')throw Error('Invalid projection');
 const modifiers=[],unmapped=[],seen=new Set();
 for(const p of projections){const e=validateFixtureEffect(p.effect);if(seen.has(e.id)||!Number.isInteger(p.rank)||p.rank<1||p.rank>10)throw Error('Invalid rank projection');seen.add(e.id);
  const stat=Object.hasOwn(mapping,e.payload.stat)?mapping[e.payload.stat]:null;
  if(!['passive','conditional'].includes(e.kind)||!stat){unmapped.push(e.id);continue;}
  if(e.kind==='conditional'&&conditionActive(e.payload.condition)!==true)continue;
  if(typeof base[stat]!=='number'||!Number.isFinite(base[stat])||base[stat]<0||base[stat]>100000)throw Error('Invalid base');
  const delta=base[stat]*e.payload.basisPoints*p.rank/10000;
  if(!Number.isFinite(delta)||Math.abs(delta)>100000||modifiers.length>=32)throw Error('Modifier bounds');
  modifiers.push(Object.freeze({id:'pm:'+e.id,stat,delta}));
 }
 return Object.freeze({kind:'fixture-review',authoritative:false,modifiers:Object.freeze(modifiers),unmapped:Object.freeze(unmapped)});
}
