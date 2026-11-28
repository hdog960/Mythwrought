import {FAMILIES} from './registry.mjs';
export function resolveDamage({definition,offense,defense,roll,guard='none',blockable,parryable},families=FAMILIES){
 const within=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
 if(!definition||!Array.isArray(definition.damage)||definition.damage.length>families.length||!['physical','magical','none'].includes(definition.power)||typeof definition.critical!=='boolean'||!offense||!defense||!within(offense.physicalAttack,0,100000)||!within(offense.magicalAttack,0,100000)||!within(offense.criticalChance,0,1)||!within(offense.criticalDamage,1,10)||!within(roll,0,1)||roll===1||!within(defense.mitigation,0,.95)||!['none','block','parry'].includes(guard)||typeof blockable!=='boolean'||typeof parryable!=='boolean'||!within(defense.blockReduction,0,1)||!defense.resistance||families.some(f=>!within(defense.resistance[f],-1,.95)))throw Error('invalid resolution input');
 const critical=definition.critical&&roll<offense.criticalChance;
 const multiplier=critical?offense.criticalDamage:1;
 const power=definition.power==='physical'?offense.physicalAttack:definition.power==='magical'?offense.magicalAttack:0;
 const defended=guard==='parry'&&parryable?'parried':guard==='block'&&blockable?'blocked':'none';
 const guardMultiplier=defended==='parried'?0:defended==='blocked'?1-defense.blockReduction:1;
 const seen=new Set(),components=[];
 for(const d of definition.damage){
  if(!d||!families.includes(d.family)||seen.has(d.family)||!within(d.amount,0,100000)||!within(d.scaling,0,10))throw Error('invalid damage component');
  seen.add(d.family);
  const base=d.amount+d.scaling*power,afterCritical=base*multiplier,afterGuard=afterCritical*guardMultiplier;
  const afterResistance=afterGuard*(1-defense.resistance[d.family]);
  const final=afterResistance*(1-defense.mitigation);
  components.push(Object.freeze({family:d.family,base,afterCritical,afterGuard,afterResistance,final}));
 }
 components.sort((a,b)=>families.indexOf(a.family)-families.indexOf(b.family));
 const uncapped=components.reduce((sum,x)=>sum+x.final,0);
 const amount=Math.min(100000,Math.max(0,uncapped));
 return Object.freeze({version:1,definitionId:definition.id,critical,defended,components:Object.freeze(components),uncapped,amount,capped:amount!==uncapped});
}
export function validateDamageReceipt(request,receipt){
 const id=x=>typeof x==='string'&&x.length>=1&&x.length<=128&&/^[A-Za-z0-9:._-]+$/.test(x);
 const valid=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=100000;
 if(!request||request.version!==1||!['worldId','profileId','transactionId','actionId','sourceId','targetId','definitionId'].every(k=>id(request[k]))||request.sourceId===request.targetId||!valid(request.amount)||typeof request.fixture!=='boolean')throw Error('invalid damage request');
 if(!receipt||receipt.version!==1||!['worldId','profileId','transactionId','actionId','sourceId','targetId','definitionId','fixture'].every(k=>receipt[k]===request[k])||typeof receipt.accepted!=='boolean'||!valid(receipt.before)||!valid(receipt.after)||!valid(receipt.applied)||!['none','downed','removed'].includes(receipt.terminal)||typeof receipt.permanentDefeat!=='boolean')throw Error('invalid authority receipt');
 if(receipt.after>receipt.before||receipt.applied!==receipt.before-receipt.after||receipt.applied>request.amount+Number.EPSILON*4*Math.max(1,receipt.before,request.amount)||(!receipt.accepted&&(receipt.applied!==0||receipt.terminal!=='none'||receipt.permanentDefeat))||(receipt.accepted&&(receipt.applied<=0||receipt.before<=0))||(receipt.terminal!=='none'&&receipt.after!==0)||(receipt.accepted&&receipt.after===0&&receipt.terminal==='none')||(receipt.permanentDefeat&&receipt.terminal!=='removed'))throw Error('inconsistent authority outcome');
 // Validation only; caller must obtain actual authoritative receipt and durable uniqueness.
 return Object.freeze({version:1,worldId:request.worldId,profileId:request.profileId,transactionId:request.transactionId,actionId:request.actionId,sourceId:request.sourceId,targetId:request.targetId,definitionId:request.definitionId,fixture:request.fixture,accepted:receipt.accepted,applied:receipt.applied,terminal:receipt.terminal,permanentDefeat:receipt.permanentDefeat,progressionCandidate:receipt.accepted&&!request.fixture});
}
