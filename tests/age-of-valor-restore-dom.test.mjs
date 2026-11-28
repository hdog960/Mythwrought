import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createResourceLedger} from '../src/age-of-valor/resources.mjs';
import * as status from '../src/age-of-valor/status.mjs';
import {createAbilityExecutor} from '../src/age-of-valor/ability.mjs';
import {makeCombatRestoreEnvelope,restoreCombatParts} from '../src/age-of-valor/restore.mjs';
import {createMobileCombatInput} from '../src/age-of-valor/mobile-controls.mjs';
import {mountCombatHud} from '../src/age-of-valor/hud-dom.mjs';
import {layoutCombatRail,projectHudPresentation} from '../src/age-of-valor/hud-presentation.mjs';
function cases(check,ledger,st,ability,envelope,restore,input,mount,layout,project){
 const identity={worldId:'world:1',profileId:'profile:1',sourceId:'actor:1',fixture:false};
 const opts={maximum:{stamina:1000,mana:1000},initial:{stamina:1000,mana:1000},regeneration:{combat:{stamina:13,mana:17},exploration:{stamina:13,mana:17}},delayMs:{stamina:200,mana:200}};
 const l=ledger(opts);l.consume({sequence:1,expectedRevision:0,cost:{stamina:100,mana:100}});l.advance(250,'combat');
 const cp=l.checkpoint(),snap=l.snapshot(),rest=ledger({...opts,initial:{stamina:snap.stamina,mana:snap.mana},restored:cp});
 l.advance(350,'combat');rest.advance(350,'combat');check(l.snapshot().stamina===rest.snapshot().stamina&&l.snapshot().mana===rest.snapshot().mana,'fractional regen continuity');check(rest.snapshot().highest===1,'resource replay floor');
 const ld=ledger(opts);ld.consume({sequence:1,expectedRevision:0,cost:{stamina:100,mana:0}});ld.advance(50,'combat');const delay=ld.checkpoint();check(delay.remainingDelay.stamina===150,'delay saved');const lr=ledger({...opts,initial:{stamina:900,mana:1000},restored:delay});lr.advance(149,'combat');check(lr.snapshot().stamina===900,'delay restored');
 const registry=st.createStatusRegistry([{id:'fixture:burn',version:1,scope:'content',kind:'burning',durationMs:1000,stacking:'stack',maxStacks:3,resistanceFamily:'fire',tickKind:'damage',tickAmount:3,tickMs:200,resource:null,modifiers:[]}]);
 const so={registry,worldEpoch:1,targetId:identity.sourceId,fixture:false},ss=st.createStatusSession(so);
 ss.apply({worldEpoch:1,targetId:identity.sourceId,sourceId:'mob:1',effectId:'fixture:burn',at:0,verified:true,sequence:1,resistance:0});ss.advance(250);
 const sc=ss.checkpoint(),ss2=st.createStatusSession({...so,worldEpoch:2,restored:sc});const a=ss.advance(150).events,b=ss2.advance(150).events;
 check(a[0].tickIndex===b[0].tickIndex&&a[0].amount===b[0].amount&&b[0].at===150,'status tick continuity');check(ss2.snapshot().highest===1,'status replay floor');
 const def={id:'skill:spell',scope:'content',type:'ability',delivery:'self',requirements:[],cost:{stamina:0,mana:0},timing:{cooldownMs:500}},ctx={...identity,alive:true,playable:true,combatMode:true,creative:false,mounted:false,readOnly:false};
 const ao={registry:{get:()=>def},identity,policies:{[def.id]:{mode:'instant',windupMs:0,minChargeMs:0,maxChargeMs:0,pulseMs:0,pulses:1}},readContext:()=>ctx,readSkills:()=>({...identity,verified:true,unlocked:true,levels:{}}),admit:q=>({...q,accepted:true,actionId:'a:'+q.sequence}),validateAim:()=>null,authorizePulse:()=>true};
 const ab=ability(ao);ab.start({definitionId:def.id,sequence:1});ab.advance(100);const ac=ab.checkpoint();check(ac.cooldowns[0].remainingMs===400,'cooldown relative');const ab2=ability({...ao,restored:ac});check(!ab2.start({definitionId:def.id,sequence:2}).ok,'cooldown preserved');ab2.advance(400);check(ab2.start({definitionId:def.id,sequence:3}).ok,'cooldown expires');
 const record=envelope({identity,revision:2,definitionVersion:'fixture:v1',resource:cp,status:sc,ability:ac,settings:{holdMs:350,leftHanded:false},quiescent:true});
 const rp={record,identity,definitionVersion:'fixture:v1',resourceOptions:{...opts,initial:{stamina:snap.stamina,mana:snap.mana}},makeLedger:ledger,makeStatus:st.createStatusSession,makeAbility:ability,statusOptions:so,abilityOptions:ao};
 check(restore(rp).status==='restored','restore all modules');check(restore({...rp,definitionVersion:'fixture:v2'}).status==='blocked','definition version');check(restore({...rp,record:null}).status==='legacy-absent','legacy untouched');
 // Deliberately minimal DOM test double; no browser claim.
 function element(tag){return {tag,children:[],style:{},dataset:{},attrs:{},events:new Map(),append(...a){this.children.push(...a)},setAttribute(k,v){this.attrs[k]=v},addEventListener(t,f){this.events.set(t,f)},removeEventListener(t){this.events.delete(t)},remove(){this.removed=true},setPointerCapture(id){this.captured=id},hasPointerCapture(id){return this.captured===id},releasePointerCapture(){this.captured=null}}}
 const doc={createElement:element},root=element('root');root.ownerDocument=doc;let at=0;const mobileCtx={worldEpoch:1,alive:true,playable:true,landscape:true,creative:false,mounted:false,readOnly:false,overlay:false,graphicsLost:false,combatMode:false};
 const i=input({worldEpoch:1,readContext:()=>mobileCtx}),events=[];
 const view=project({version:1,mode:'combat',bars:{health:{current:50,max:100,fraction:.5},stamina:{current:500,max:1000,fraction:.5},mana:{current:1000,max:1000,fraction:1}},effects:[],cooldowns:[],target:null});
 const ui=mount({root,input:i,readPresentation:()=>view,emit:e=>events.push(e),readZoneOptions:()=>({}),now:()=>at,layout:layout({width:956,height:440})});
 ui.render();const wrap=root.children[0],mode=wrap.children[0],rail=wrap.children[1],attack=rail.children[0];check(rail.hidden&&attack.attrs['aria-label'].includes('Attack'),'initial DOM accessibility');
 mode.events.get('click')({});mobileCtx.combatMode=true;ui.acknowledgeMode('combat',i.snapshot().generation);ui.render();check(!rail.hidden,'mode mount');
 attack.events.get('pointerdown')({button:0,pointerId:7,preventDefault(){}});at=100;attack.events.get('pointerup')({pointerId:7,preventDefault(){}});check(events.at(-1).kind==='light-request','DOM pointer tap');
 attack.events.get('pointerdown')({button:0,pointerId:8,preventDefault(){}});ui.cancel('hidden');check(i.snapshot().pointers.length===0&&attack.captured===null,'DOM cancel');ui.dispose();check(wrap.removed&&attack.events.size===0,'dispose listeners');
}
test('AV14 DOM contract and AV15 actual module restore',()=>cases((ok,name)=>assert.ok(ok,name),createResourceLedger,status,createAbilityExecutor,makeCombatRestoreEnvelope,restoreCombatParts,createMobileCombatInput,mountCombatHud,layoutCombatRail,projectHudPresentation));
