// AB4 isolated per-species behavior intent logic. Pure decisions: actual
// engine movement, navigation, attack damage and world mutations remain owners.
import {matchesRequiredTime} from './roster-contract.mjs';
const intents=new Set(['idle','graze','herd','defend','forage','burrow','flee','fly','land','peck','pollinate','return-hive','evade','pursue','claw','disguise','ambush','heavy-melee','pack-flank','lunge','conceal','emerge','restrain','prepare-attack','recover']);
function out(action,visual=action){if(!intents.has(action))throw TypeError('Unknown intent');return Object.freeze({action,visual});}
// Distances and elapsed seconds come from authoritative observations; no
// invented targets, teleportation, damage or unchecked burrow writes.
export function nextPlainsIntent(candidate,obs){
 const r=candidate?.record,s=candidate?.requirement;
 if(!r||!s||r.id!==s.id||!obs||obs.ready!==true||!['dawn','day','dusk','night'].includes(obs.dayPhase)||
 !Number.isFinite(obs.targetDistance)||obs.targetDistance<0||!Number.isFinite(obs.threatDistance)||obs.threatDistance<0||
 !Number.isFinite(obs.cooldownRemaining)||obs.cooldownRemaining<0||
 !Number.isFinite(obs.windupElapsed)||obs.windupElapsed<0)return out('idle');
 const danger=obs.threatDistance<5,close=obs.targetVisible===true&&obs.targetDistance<=r.combat.reach;
 const attack=(kind)=>obs.cooldownRemaining>0?out('recover'):obs.windupElapsed<r.combat.windup?out('prepare-attack'):out(kind,'attack');
 if(r.classification==='hostile'&&!matchesRequiredTime(s,obs.dayPhase,obs.darkness===true))return out('idle');
 switch(r.id){
  case 'bison':return danger?(obs.threatDistance<=r.combat.reach?attack('defend'):out('herd')):obs.herdSeparated===true?out('herd'):out('graze');
  case 'badger':return danger?(obs.burrowSite===true?out('burrow'):out('flee')):out('forage');
  case 'meadowlark':return danger?out('fly'):obs.grounded===true?out('peck'):obs.landingSite===true?out('land'):out('fly');
  case 'honeybee':return danger?out('evade'):obs.hiveNearby===true&&obs.carryingPollen===true?out('return-hive'):obs.flowerNearby===true?out('pollinate'):out('fly');
  case 'golden-antelope':return danger?out('evade'):obs.herdSeparated===true?out('herd'):out('graze');
  case 'werewolf':return close?attack('claw'):obs.targetVisible===true?out('pursue'):out('idle');
  case 'scarefiend':return obs.targetVisible!==true||obs.targetDistance>5?out('disguise'):close?attack('ambush'):out('pursue');
  case 'headless-knight':return close?attack('heavy-melee'):obs.targetVisible===true?out('pursue'):out('idle');
  case 'dire-hound':return close?attack('lunge'):obs.targetVisible===true?(obs.packNearby===true?out('pack-flank'):out('pursue')):out('idle');
  case 'gravehand':return obs.darkness!==true?out('idle'):obs.emerged!==true?(obs.targetVisible===true&&obs.targetDistance<3&&obs.emergenceSite===true?out('emerge'):out('conceal')):close?attack('restrain'):out('pursue');
  default:return out('idle');
 }
}
