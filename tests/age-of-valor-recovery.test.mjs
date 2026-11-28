import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMobileCombatInput} from '../src/age-of-valor/mobile-controls.mjs';
import {createCombatLifecycle,encodeCombatSave,decodeCombatSave} from '../src/age-of-valor/recovery.mjs';
import {layoutCombatRail,projectHudPresentation} from '../src/age-of-valor/hud-presentation.mjs';
function cases(check,input,lifecycle,encode,decode,layout,presentation){
 let ctx={worldEpoch:1,alive:true,playable:true,landscape:true,creative:false,mounted:false,readOnly:false,overlay:false,graphicsLost:false,combatMode:false};
 const x=input({worldEpoch:1,readContext:()=>ctx}),d=(type,at,extra={})=>x.dispatch({type,at,...extra});
 check(d('mode',0,{mode:'combat'}).snapshot.pending==='combat','pending mode');check(!d('pointerdown',1,{id:1,zone:'attack',existingOwner:false}).handled,'no preack input');
 check(!d('mode-ack',2,{mode:'combat',generation:x.snapshot().generation}).handled,'owner denial');ctx.combatMode=true;check(d('mode-ack',3,{mode:'combat',generation:x.snapshot().generation}).handled,'ack');
 d('pointerdown',4,{id:1,zone:'attack',existingOwner:false});const a=x.snapshot().pointers[0].captureToken;check(d('pointerup',5,{id:1,captureToken:a}).intents[0].kind==='light-request','tap');
 d('pointerdown',6,{id:1,zone:'attack',existingOwner:false});const b=x.snapshot().pointers[0].captureToken;check(a!==b&&!d('pointerup',7,{id:1,captureToken:a}).handled,'stale reused id');check(d('pointerup',400,{id:1,captureToken:b}).intents[0].kind==='heavy-request','heavy');
 ctx.combatMode=false;check(d('pointerdown',401,{id:1,zone:'block',existingOwner:false}).intents[0].kind==='cancel-combat-input','host lost');
 const identity={worldId:'world:1',profileId:'profile:1',sourceId:'actor:1',worldEpoch:1,fixture:false};
 let health={...identity,revision:1,alive:true},retired=0,created=0,respawns=0;
 const l=lifecycle({identity,readOwner:()=>health,retireSession:()=>retired++,requestRespawn:q=>{respawns++;health={...health,revision:3,alive:true};return{...q,...health,accepted:true,safePlacement:true}},createSession:()=>{created++;return true}});
 check(l.observe().phase==='alive','alive');health={...health,revision:2,alive:false};check(l.observe().phase==='dead'&&retired===1,'death');l.observe();check(retired===1,'no repeated retirement');check(l.respawn().phase==='alive'&&created===1&&respawns===1,'confirmed respawn');l.respawn();check(respawns===1,'no duplicate respawn');
 const record=encode({identity,revision:2,resources:{stamina:123,mana:456,maxStamina:1000,maxMana:1000},clock:100,cooldowns:{'skill:fire':250,'skill:old':99},settings:{holdMs:350,leftHanded:false}});
 check(record.cooldowns.length===1&&record.cooldowns[0].remainingMs===150,'relative cooldown');check(decode(JSON.parse(JSON.stringify(record)),identity).status==='restored-data','roundtrip');check(decode(null,identity).status==='legacy-absent','legacy absent');check(decode({...record,version:2},identity).status==='blocked','future version');check(decode(record,{...identity,profileId:'other'}).status==='blocked','wrong profile');check(!Object.hasOwn(record,'health'),'no duplicate HP');
 const rail=layout({width:956,height:440});check(rail.controls.length===6&&rail.controls.every(x=>x.width>=44),'touch targets');check(layout({width:956,height:440,leftHanded:true}).side==='left','mirror option');
 const hud=presentation({version:1,mode:'combat',bars:{health:{current:50,max:100,fraction:.5},stamina:{current:500,max:1000,fraction:.5},mana:{current:1000,max:1000,fraction:1}},effects:[],cooldowns:[]});check(hud.bars[1].value===.5&&hud.bars[0].accessibleText==='Health 50 of 100','HUD display units');
}
test('AV14 capture and mode ownership, AV15 recovery/save contracts',()=>cases((ok,name)=>assert.ok(ok,name),createMobileCombatInput,createCombatLifecycle,encodeCombatSave,decodeCombatSave,layoutCombatRail,projectHudPresentation));
