import {matchesRequiredTime} from './roster-contract.mjs';
// Physical decisions only, spell/status effects require combat-owner integration.
export function nextForestIntent(c,o){
 const r=c?.record,s=c?.requirement,out=(action,visual=action)=>Object.freeze({action,visual});
 if(!r||s?.biome!=='forest'||o?.ready!==true||!matchesRequiredTime(s,o.dayPhase,o.darkness))return out('idle');
 const danger=o.threatDistance<5,close=o.targetVisible===true&&o.targetDistance<=r.combat.reach;
 const attack=k=>o.cooldownRemaining>0?out('recover'):o.windupElapsed<r.combat.windup?out('prepare-attack'):out(k,'attack');
 switch(r.id){
 case 'unicorn':return danger?out('evade'):out('forage');
 case 'faerie':case 'prismwing':return danger?out('fly'):o.flowerNearby?out('flower-visit'):out('fly');
 case 'sproutling':return danger?out('conceal'):out('forage');
 case 'glimmerstag':return danger?out('evade'):o.herdSeparated?out('herd'):out('graze');
 case 'corrupted-treant':return close?attack('branch-strike'):o.targetVisible?out('pursue'):out('idle');
 case 'nightshade-witch':return close?attack('melee'):o.targetVisible?out('pursue'):out('idle');
 case 'sporebeast':return close?attack('melee'):o.targetVisible?out('pursue'):out('idle');
 case 'chimera':return close?attack('heavy-melee'):o.targetVisible?out('charge'):out('idle');
 case 'dreamweaver':return close?attack('melee'):o.targetVisible?out('pursue'):out('fly');
 default:return out('idle');
 }
}
