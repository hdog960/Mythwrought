import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../../src/mobs/engine.mjs';
import {createFixtureDamageOwner} from '../../src/mobs/age-of-beasts/fixture-damage-owner.mjs';
test('fixture owner commits actual original engine HP with revision and exact transaction replay',()=>{
 const w={volume:()=> 'clear',grounded:()=>true,residentAt:()=>true,revision:()=>0},e=new MobEngine(w,42,{maxEntities:32,maxActive:8});
 const source=e.spawn('wolf',[0,0,0]),target=e.spawn('cow',[2,0,0]),other=e.spawn('sheep',[4,0,0]),checkpoint=e.checkpoint();
 const owner=createFixtureDamageOwner(w,checkpoint,{worldId:'world',profileId:'profile',recoverableIds:[other]});
 const req={version:1,worldId:'world',profileId:'profile',transactionId:'tx1',actionId:'act1',sourceId:source,targetId:target,definitionId:'av:claw',fixture:true,amount:3,expectedRevision:0};
 const a=owner.commit(req);assert.equal(a.receipt.accepted,true);assert.equal(a.receipt.applied,3);assert.equal(owner.get(target).health,e.get(target).health-3);assert.equal(a.afterRevision,1);assert.equal(a.version,1);assert.equal(a.committed,true);
 assert.equal(owner.commit(req),a);assert.equal(owner.revision(),1);assert.equal(owner.commit({...req,amount:4}),null);
 const stale=owner.commit({...req,transactionId:'stale'});assert.equal(stale.receipt.accepted,false);assert.equal(stale.afterRevision,1);assert.equal(stale.committed,false);
 assert.equal(owner.commit({...req,fixture:false,transactionId:'live'}),null);
 const lethal=owner.commit({...req,transactionId:'tx2',amount:100000,expectedRevision:1});assert.equal(lethal.receipt.terminal,'removed');assert.equal(lethal.receipt.permanentDefeat,false);
 const down=owner.commit({...req,transactionId:'tx3',targetId:other,amount:100000,expectedRevision:2});assert.equal(down.receipt.terminal,'downed');assert.equal(down.receipt.permanentDefeat,false);
 assert.deepEqual(e.checkpoint(),checkpoint);assert.equal(owner.revision(),3);
});

test('fractional committed delta matches exact original HP and bounded AV rounding',()=>{
 const w={volume:()=> 'clear',grounded:()=>true,residentAt:()=>true,revision:()=>0},e=new MobEngine(w,42,{maxEntities:32,maxActive:8});
 const source=e.spawn('wolf',[0,0,0]),target=e.spawn('cow',[2,0,0]),owner=createFixtureDamageOwner(w,e.checkpoint(),{worldId:'world',profileId:'profile'});
 const r={version:1,worldId:'world',profileId:'profile',transactionId:'frac',actionId:'act',sourceId:source,targetId:target,definitionId:'av:claw',fixture:true,amount:.1,expectedRevision:0};
 const a=owner.commit(r);assert.ok(a.committed&&a.receipt.accepted);assert.equal(a.receipt.applied,a.receipt.before-a.receipt.after);
 assert.ok(Math.abs(a.receipt.applied-.1)<=4*Number.EPSILON*Math.max(1,a.receipt.before,.1));assert.equal(owner.commit(r),a);assert.equal(owner.revision(),1);
});
