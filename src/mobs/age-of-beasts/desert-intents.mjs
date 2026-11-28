import {matchesRequiredTime} from './roster-contract.mjs';
export function nextDesertIntent(c,o){
 const r=c?.record,s=c?.requirement;
 const out=(action,visual=action)=>Object.freeze({action,visual});
 if(!r||s?.biome!=='desert'||o?.ready!==true)return out('idle');
 const danger=o.threatDistance<5,close=o.targetVisible===true&&o.targetDistance<=r.combat.reach;
 const attack=kind=>o.cooldownRemaining>0?out('recover'):o.windupElapsed<r.combat.windup?out('prepare-attack'):out(kind,'attack');
 if(r.classification==='hostile'&&!matchesRequiredTime(s,o.dayPhase,o.darkness))return out('idle');
 switch(r.id){
 case 'camel':return danger?out('flee'):o.herdSeparated===true?out('herd'):out('graze');
 case 'jerboa':return danger?out('evade'):out('forage');
 case 'golden-scarab':return danger?out('flee'):out('forage');
 case 'oasis-ibis':return danger?out('fly'):o.grounded?out('forage'):o.landingSite===true?out('land'):out('fly');
 case 'dunewalker':return danger?(o.threatDistance<=r.combat.reach?attack('defend'):out('herd')):out('herd');
 case 'mummy':return close?attack('melee'):o.targetVisible?out('pursue'):out('idle');
 case 'giant-scorpion':return close?attack(o.targetDistance<r.combat.reach*.6?'pincer':'tail-strike'):o.targetVisible?out('pursue'):out('idle');
 case 'dune-serpent':return close?attack('ambush'):o.targetVisible?out('pursue'):out('conceal');
 case 'mirage-djinn':return o.targetVisible?out('pursue'):out('fly'); // magic deferred to combat owner
 case 'sand-colossus':return close?attack('heavy-melee'):o.targetVisible?out('pursue'):out('idle');
 default:return out('idle');
 }
}
