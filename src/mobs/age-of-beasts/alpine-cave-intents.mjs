// AB8/AB9 isolated physical intent decisions; advanced combat effects remain owner-held.
export function nextAlpineIntent(c,o){
 const r=c?.record,out=(action,visual=action)=>Object.freeze({action,visual});
 if(c?.requirement?.biome!=='alpine'||!r||o?.ready!==true)return out('idle');
 const danger=o.threatDistance<5,close=o.targetVisible===true&&o.targetDistance<=r.combat.reach;
 const attack=k=>o.cooldownRemaining>0?out('recover'):o.windupElapsed<r.combat.windup?out('prepare-attack'):out(k,'attack');
 switch(r.id){
 case 'yak':return danger?out('flee'):o.herdSeparated?out('herd'):out('graze');
 case 'golden-eagle':return danger?out('fly'):o.landingSite===true&&!o.grounded?out('land'):out('fly');
 case 'pika':return danger?out('evade'):out('forage');
 case 'skyray':return out('fly');
 case 'griffin':return danger&&o.threatDistance<=r.combat.reach?attack('defend'):danger?out('evade'):out('fly');
 case 'cyclops':return close?attack('heavy-melee'):o.targetVisible?out('pursue'):out('idle');
 case 'wyvern':return close?attack('melee'):o.targetVisible?out('pursue'):out('fly');
 case 'avalanche-beast':return close?attack('heavy-melee'):o.targetVisible?out('charge'):out('idle');
 case 'storm-elemental':return o.targetVisible?out('pursue'):out('fly');
 case 'cliff-reaver':return o.climbContact&&o.climbGoal?out('climb'):close?attack('melee'):o.targetVisible?out('pursue'):out('idle');
 default:return out('idle');
 }
}
export function nextCaveIntent(c,o){
 const r=c?.record,out=(action,visual=action)=>Object.freeze({action,visual});
 if(c?.requirement?.biome!=='cave'||!r||o?.ready!==true)return out('idle');
 const danger=o.threatDistance<5,close=o.targetVisible===true&&o.targetDistance<=r.combat.reach;
 const attack=k=>o.cooldownRemaining>0?out('recover'):o.windupElapsed<r.combat.windup?out('prepare-attack'):out(k,'attack');
 switch(r.id){
 case 'cave-bat':return o.ceilingContact&&!danger&&!o.departRoost?out('roost'):out('fly');
 case 'blind-cavefish':return out('swim');
 case 'crystal-snail':case 'lantern-beetle':return danger?out('flee'):out('forage');
 case 'geodeback':return danger&&o.threatDistance<=r.combat.reach?attack('defend'):danger?out('flee'):out('forage');
 case 'burrowing-horror':return close?attack('ambush'):o.targetVisible?out('pursue'):out('conceal');
 case 'abyssal-sentinel':case 'abyssal-hydra':return close?attack('heavy-melee'):o.targetVisible?out('pursue'):out('idle');
 case 'echo-stalker':return close?attack('melee'):o.targetVisible?out('pursue'):o.heard?out('investigate'):out('idle');
 case 'ceiling-lurker':
  if(o.dropState==='descending')return o.grounded?(o.dropTargetMatches&&close?out('drop-attack','attack'):out('drop-recover')):out('drop-fall');
  if(o.dropState==='recovering'&&!o.ceilingContact)return o.reattachWall?out('reattach-climb'):out('idle');
  if(o.dropState==='recovering'&&o.ceilingContact)return out('ceiling-crawl');
  if(o.ceilingContact&&o.targetBelow&&o.cooldownRemaining<=0)return o.windupElapsed<r.combat.windup?out('prepare-attack'):out('drop-fall');
  return out('ceiling-crawl');
 default:return out('idle');
 }
}
