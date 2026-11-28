import {matchesRequiredTime} from './roster-contract.mjs';
// Only physical actions presently executable; special damage/status and light
// effects stay with their owners, never synthesized here.
export function nextSnowIntent(c,o){
 const r=c?.record,s=c?.requirement,out=(action,visual=action)=>Object.freeze({action,visual});
 if(!r||s?.biome!=='snow'||o?.ready!==true||!matchesRequiredTime(s,o.dayPhase,o.darkness))return out('idle');
 const danger=o.threatDistance<5,close=o.targetVisible===true&&o.targetDistance<=r.combat.reach;
 const attack=k=>o.cooldownRemaining>0?out('recover'):o.windupElapsed<r.combat.windup?out('prepare-attack'):out(k,'attack');
 switch(r.id){
 case 'woolly-mammoth':return danger&&o.threatDistance<=r.combat.reach?attack('defend'):o.herdSeparated||danger?out('herd'):out('graze');
 case 'ptarmigan':return danger?out('fly'):o.grounded?out('forage'):o.landingSite===true?out('land'):out('fly');
 case 'ermine':return danger?out('evade'):out('forage');
 case 'aurora-wisp':return out('fly');
 case 'snowdrifter':return danger?out('evade'):out('herd');
 case 'yeti':return close?attack('heavy-melee'):o.targetVisible?out('charge'):out('idle');
 case 'ice-golem':return close?attack('heavy-melee'):o.targetVisible?out('pursue'):out('idle');
 case 'rime-widow':return close?attack('melee'):o.targetVisible?out('pursue'):out('conceal');
 case 'blizzard-drake':return close?attack('melee'):o.targetVisible?out('pursue'):out('fly');
 case 'pale-reaper':return close?attack('melee'):o.targetVisible?out('pursue'):out('fly');
 default:return out('idle');
 }
}
