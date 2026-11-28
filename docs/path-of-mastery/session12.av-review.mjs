// Run against the read-only AV owner source checkout at the recorded commit.
// Inject exact validator/projector functions. No health mutation or XP writes.
import assert from 'node:assert/strict';
import {createOwnerReceiptReview,reviewCombatModifiers} from '../../src/path-of-mastery/owner-translation.mjs';
import {COMPLETE_TREES} from '../../src/path-of-mastery/complete-trees.mjs';
import {compileTypedFixtureTree} from '../../src/path-of-mastery/typed-tree.mjs';
export function runAVReview({validateDamageReceipt,verifyMobDamageTransaction,projectCombatStats}){
 let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
 const q={version:1,worldId:'w',profileId:'p',transactionId:'tx',actionId:'a',sourceId:'player',targetId:'mob',definitionId:'av:hit',fixture:true,amount:.1,expectedRevision:0};
 const receipt={version:1,...Object.fromEntries(['worldId','profileId','transactionId','actionId','sourceId','targetId','definitionId','fixture'].map(k=>[k,q[k]])),accepted:true,before:10,after:9.9,applied:10-9.9,terminal:'none',permanentDefeat:false};
 const record={version:1,committed:true,requestAmount:q.amount,beforeRevision:0,afterRevision:1,receipt};
 let witness={request:q,definition:{id:q.definitionId,scope:'fixture',type:'unarmed'},record,sourceRole:'player',targetRole:'hostile-natural',encounterId:'e'};const token={};
 const review=createOwnerReceiptReview({worldId:'w',profileId:'p',lookup:t=>t===token?witness:null,validateReceipt:validateDamageReceipt,verifyTransaction:verifyMobDamageTransaction});
 const first=review(token);check(first?.skill==='pm:attack'&&first.eligibleForXp===false,'fractional accepted outcome review only');check(review(token).identity===first.identity,'retry identity stable');
 for(const patch of [{committed:false},{afterRevision:2},{receipt:{...receipt,applied:2}},{receipt:{...receipt,fixture:false}}]){witness={...witness,record:{...record,...patch}};check(review(token)===null,'invalid owner record rejected');}
 const base={maxHealth:100,maxStamina:100,maxMana:100,physicalAttack:10,magicalAttack:20,accuracy:1,criticalChance:.1,criticalDamage:2,mitigation:.1,healthRegen:1,staminaRegen:1,manaRegen:1,actionEfficiency:1,...Object.fromEntries(['slashing','piercing','crushing','fire','frost','lightning','poison','arcane','resonance'].map(f=>['resistance.'+f,0]))};
 const t=COMPLETE_TREES.find(t=>t.definition.skill==='pm:attack'),compiled=compileTypedFixtureTree(t.definition,t.typedEffects);let ranks={};for(const key of ['foundation','foundation','path-a','path-a'])ranks=compiled.tree.purchase(ranks,key,99,32).ranks;
 const reviewLayer=reviewCombatModifiers({projections:compiled.project(ranks,99,32),base});const health={max:100,current:63},resources={stamina:50,mana:30};
 const projected=projectCombatStats({base,health,resources,layers:{skill:reviewLayer.modifiers}});check(projected.stats.accuracy===1.03&&projected.health.current===63&&projected.resources.stamina===50,'actual AV accepts read-only skill layer');
 const reset=projectCombatStats({base,health,resources,layers:{skill:reviewCombatModifiers({projections:compiled.project({},99,32),base}).modifiers}});check(reset.stats.accuracy===1&&reset.health.current===63,'respec removes candidate modifier');
 return checks;
}
