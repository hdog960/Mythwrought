// AB13 isolated original-engine integration, never imported by production.
// No separate scheduler, identity, health, population, or persistent save.
import {refreshForageGoal} from './natural-forage.mjs';
import {MobEngine} from '../engine.mjs';
import {getSpecies} from '../species.mjs';
import {completeBeastCandidateCatalog} from './complete-catalog.mjs';
import {chooseExpansionSpawn} from './spawn-selection.mjs';
import {createPlainsActor,stepPlainsActor,createDesertActor,stepDesertActor,createSnowActor,stepSnowActor,createForestActor,stepForestActor,createAlpineActor,stepAlpineActor,createCaveActor,stepCaveActor} from './plains-execution.mjs';
import {LocalNavigator} from '../navigation.mjs';
import {expansionSupport} from './environment-support.mjs';
const actions={meadow:[createPlainsActor,stepPlainsActor],desert:[createDesertActor,stepDesertActor],snow:[createSnowActor,stepSnowActor],forest:[createForestActor,stepForestActor],alpine:[createAlpineActor,stepAlpineActor],cave:[createCaveActor,stepCaveActor]};
export function createBeastEngineFixture(view,seed=179){
 const q=view?.query,catalog=completeBeastCandidateCatalog();
 if(!q||typeof view.generatedMaterialAt!=='function'||typeof view.revision!=='function')throw TypeError('Explicit fixture source required');
 let pending=null,busy=false,lastTick=-1,batch=null,peerFrame=null;
 const targets=new Map();
 const navigator=new LocalNavigator({...q,grounded:(p,b)=>expansionSupport(q,p,b,'ground')});
 const engine=MobEngine.createExpansionFixture(q,seed,{
  catalog:catalog.index,
  admit:(id,p,home)=>pending?.id===id&&pending.homeChunk===home&&pending.revision===view.revision()&&p.every((n,i)=>n===pending.point[i]),
  step:(mob,previous,command,roster,tick)=>{
   if(tick!==lastTick){
    navigator.beginTick();lastTick=tick;
    peerFrame=Object.freeze({revision:view.revision(),tick,entities:Object.freeze(roster.map(e=>Object.freeze({...e,targetId:batch?.get(e.id)?.targetId??null})))});
    const alive=new Set(roster.filter(e=>['idle','active'].includes(e.state)).map(e=>e.id));
    for(const id of targets.keys())if(!alive.has(id))targets.delete(id);
    for(const e of roster)if(alive.has(e.id)){
     // Stable reference across ticks for windup and combo identity; current
     // position comes only from the engine's bounded tick snapshot.
     let t=targets.get(e.id);if(!t){t={id:e.id};targets.set(e.id,t);}
     Object.assign(t,{position:e.position,height:e.species.body.height,alive:true});
    }
   }
   const c=catalog.get(mob.species.id),[create,step]=actions[c.requirement.biome];
   const actor=previous?{...previous}:create(c,[...mob.origin],q);
   Object.assign(actor,{id:mob.id,state:mob.state,position:[...mob.position],velocity:[...mob.velocity],yaw:mob.yaw,grounded:mob.grounded,motionMode:mob.motionMode});
   // Stable tick snapshot; only awake actual engine entities can be targets.
   const targetFor=id=>id!==mob.id?targets.get(id):undefined;
   const target=targetFor(command?.targetId),threat=targetFor(command?.threatId);
   let hit=null;
   const goal=command?.goal??(batch&&!target&&!threat?refreshForageGoal(actor,view,roster,tick):null);
   const ok=step(actor,q,{target,threat,goal,flowerCell:command?.flowerCell,ownerView:view,navigator,controllerTick:tick,
    readPeers:()=>peerFrame,
    commitDamage:(victim,amount,revision,kind)=>{
     if(hit||!victim||(victim!==target&&victim!==threat))return false;
     hit=Object.freeze({targetId:victim.id,amount,revision,kind});return true;
    }});
   // No owner effects, projectiles or XP callbacks are mounted in this fixture.
   if(!ok)return null;
   return {motion:actor,state:actor,hit};
  }
 });
 // A complete bounded command batch is copied before the engine clock runs.
 // Every pack member observes the same identities/target choices that tick.
 function advancePopulation(seconds,commands=[]){
  if(busy||!Array.isArray(commands)||commands.length>32)return 0;
  const ids=new Set(engine.all().map(e=>e.id)),next=new Map();
  const validPoint=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
  for(const c of commands){
   if(!c||!ids.has(c.id)||next.has(c.id)||
    (c.targetId!=null&&(!ids.has(c.targetId)||c.targetId===c.id))||
    (c.threatId!=null&&(!ids.has(c.threatId)||c.threatId===c.id))||
    (c.goal!=null&&!validPoint(c.goal))||
    (c.flowerCell!=null&&(!validPoint(c.flowerCell)||!c.flowerCell.every(Number.isSafeInteger))))return 0;
   next.set(c.id,Object.freeze({targetId:c.targetId??null,threatId:c.threatId??null,
    goal:c.goal?Object.freeze([...c.goal]):undefined,flowerCell:c.flowerCell?Object.freeze([...c.flowerCell]):undefined}));
  }
  busy=true;batch=next;
  try{const run=()=>engine.advance(seconds,m=>batch.get(m.id));return typeof view.withSourceReadScope==='function'?view.withSourceReadScope(run):run();}
  finally{batch=null;busy=false;}
 }
 function selectAndSpawn({proposals,observer,homeChunk}){
  if(busy)return null;busy=true;
  try{
   pending=chooseExpansionSpawn(view,{proposals,observer,homeChunk,entities:engine.all()});
   if(!pending)return null;
   return engine.spawn(pending.id,pending.point,{homeChunk:pending.homeChunk,dormant:pending.dormant});
  }finally{pending=null;busy=false;}
 }
 return Object.freeze({selectAndSpawn,advancePopulation,
  spawnOriginal:(id,p,opts)=>!busy&&getSpecies(id)?engine.spawn(id,p,opts):null,
  get:id=>engine.get(id),all:()=>engine.all(),counts:()=>engine.counts(),
  advance:(seconds,controller)=>{if(busy)return 0;busy=true;try{return engine.advance(seconds,controller);}finally{busy=false;}},
  transition:(id,state)=>!busy&&engine.transition(id,state),
  checkpoint:()=>engine.checkpoint(),drainEvents:()=>engine.drainEvents(),
  dispose:()=>{if(!busy)engine.dispose();}
 });
}
