// Single-world live creature host. The preview's accepted simulation modules
// are used against actual loaded voxel chunks, not the preview's fake scene.
// All new persistence is a per-seed, checksummed sidecar; Schema-1 is untouched.
import {createMobHostView} from './host-view.mjs';
import {createM7MobCollisionReader} from './ecosystem-world-geometry.mjs';
import {isEnvironmentGenerator} from '../manual-biomes/profile-world.mjs';
import {MobEngine,DEFAULT_ACTIVE_MOBS} from './engine.mjs';
import {BehaviorController} from './behavior.mjs';
import {MobCombat} from './combat.mjs';
import {LIVE_PROJECTILE_LIMIT} from './live-projectile-budget.mjs';
import {CompanionManager} from './companion.mjs';
import {AnimalInteractions} from './animal-interactions.mjs';
import {PopulationManager} from './ecology.mjs';
import {serializeRoster,restoreRoster} from './roster-persistence.mjs';
import {speciesRegistry} from './species.mjs';
import {sectionForY} from '../depth.mjs';

export const LIVE_MOB_COUNT=40;
export const LIVE_MOB_ACTIVE_LIMIT=DEFAULT_ACTIVE_MOBS;
const PREFIX='mythwrought-mobs-v1-seed-';
const OWNER='player';
const TERRAIN_BIOMES=Object.freeze({
  plains:'meadow',mountain:'alpine',mountains:'alpine',
  desert:'desert',snow:'snow',enchanted:'forest',
  forest:'forest',meadow:'meadow',cave:'cave'
});
const modelIds=new Set(speciesRegistry.map(x=>x.id));
if(modelIds.size!==LIVE_MOB_COUNT || speciesRegistry.some(s=>s.implementation!=='preview'))
  throw Error('All 40 creature definitions must be gameplay implemented');

export function mobSaveKey(seed,worldKind='normal'){
  if(!Number.isSafeInteger(seed)||seed!==(seed|0))
    throw TypeError('Mob save requires an int32 world seed');
  if(worldKind!=='normal'&&worldKind!=='cave')
    throw TypeError('Unknown mob world profile');
  // Preserve every already-staged normal seed key byte-identically.
  // The explicitly opt-in Cave World is a DIFFERENT save slot even when
  // its numeric seed collides with an ordinary legacy/profiler seed.
  return worldKind==='cave'?'mythwrought-mobs-v1-caves-seed-'+seed:PREFIX+seed;
}
export function classifyLiveBiome(name,feet,cave){
  // Never turn a missing or unrecognized source biome into a safe meadow.
  // The canonical host view treats a null biome as hazardous/unknown and
  // original spawnEligible rejects it. Keep the five accepted V6 mappings.
  if(cave===true&&Number.isFinite(feet)&&feet<-3.5)return 'cave';
  if(typeof name!=='string'||!Object.hasOwn(TERRAIN_BIOMES,name))return null;
  return TERRAIN_BIOMES[name];
}

export function createLiveMobSession({
  world,seed,storage,resident,biomeAt,skyAt,caveAt,playerAt,
  worldKind='normal',spawnOnFirstVisit=false,allowWrites=()=>true,onPlayerDamage=()=>{},
  sourceRevision
}={}){
  if(!world||typeof world.get!=='function'||!storage||!Number.isSafeInteger(seed)||
    typeof resident!=='function'||typeof biomeAt!=='function'||
    typeof skyAt!=='function'||typeof caveAt!=='function'||
    typeof playerAt!=='function')
    throw TypeError('Invalid live mob host');
  const key=mobSaveKey(seed,worldKind);
  let damaged=false,readOnly=false,damageCooldown=0,health=100,lastStored='',elapsed=0;
  // Original M7 ground IDs 400–410 are physical full cubes, but the generic
  // source mob shape reader treats them as unknown. The current owner approves
  // historical M7, Enchanted P2, Snow P1 and Mountain V8 exact profiles.
  // Legacy/other profiles keep their original world reader byte-semantically.
  const generator=world.base?.generationProfile?.generator??
    world.generationProfile?.generator;
  const collisionWorld=isEnvironmentGenerator(generator)?
    createM7MobCollisionReader(world):world;
  // A real original VoxelWorld/Pack2LiveWorld does NOT expose editRevision.
  // Keep the legacy fallback for existing hosts, but a trusted embedding
  // may supply a monotonic revision witness without monkey-patching world.set.
  // The fallback alone is NOT proof of source edit consistency.
  if(sourceRevision!==undefined&&typeof sourceRevision!=='function')
    throw new TypeError('Invalid live mob source revision authority');
  const query=createMobHostView(collisionWorld,{
    resident,revision:sourceRevision??(()=>world.editRevision||0),
    biomeAt(point){
      const biome=classifyLiveBiome(biomeAt(point),point[1],caveAt(point)?.underground);
      return {id:biome,hazard:false,climbable:biome==='cave'||biome==='alpine'};
    },
    caveAt(point){return {ready:residentAt(point),climbable:caveAt(point)?.underground===true};},
    skyAt,
    // The live Pack 5 layer exports a shape-exact raycast. Without this
    // authority, createWorldQuery intentionally rejects EVERY mob sightline
    // once furnishings are loaded. Supply real occluder hits, never assume
    // decorative objects are transparent or bypass unknown overlays.
    overlayRayHit(from,direction,distance){
      if(typeof world.pack5Collision!=='function')return false;
      const raycast=world.pack5Layer?.raycast;
      if(typeof raycast!=='function')return true; // fail closed
      try{
        const hit=raycast.call(world.pack5Layer,from,direction,distance);
        return hit!==null&&hit!==undefined &&
          (!Number.isFinite(hit.distance)||hit.distance<distance-1e-5);
      }catch(_){return true;}
    }
  });
  function residentAt(point){
    // Never query a distant, unmeshed chunk during active gameplay.
    return queryResident(point);
  }
  function queryResident(point){
    if(!Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))return false;
    const x=Math.floor(point[0]/16),z=Math.floor(point[2]/16);
    // Surface section 0 owns EVERY original Y from -3 through +19;
    // deep sections are offset from -3, not multiples of 16 at origin.
    const section=sectionForY(Math.floor(point[1]));
    return section!==null&&resident(x,z,section);
  }
  // Active-world residency is checked by createWorldQuery for every collision
  // and eye ray. No mob can spawn on an unloaded or unknown physical surface.
  let engine,behavior,combat,companions,animals;
  const raw=storage.getItem(key);
  if(raw!==null){
    try{
      ({engine,behavior,combat,companions,animals}=restoreRoster(raw,query,null,{maxProjectiles:LIVE_PROJECTILE_LIMIT}));
      lastStored=raw;
    }catch(error){
      readOnly=true;
      damaged=true; // Preserve corrupt primary and backup; never silently replace.
    }
  }
  if(!engine){
    engine=new MobEngine(query,seed,{maxEntities:32,maxActive:LIVE_MOB_ACTIVE_LIMIT});
    behavior=new BehaviorController(engine,query);
    combat=new MobCombat(engine,query,behavior,null,{maxProjectiles:LIVE_PROJECTILE_LIMIT});
    companions=new CompanionManager(engine,query,combat);
    animals=new AnimalInteractions(engine,query);
  }
  const ecology=new PopulationManager(engine,query,{seed,species:[...modelIds],spawnOnFirstVisit,
    // Tame ownership persists in the existing per-seed checksummed sidecar.
    // Protect it from six-second ecology GC without elevating a horse to a
    // bonded-only MobEngine.important checkpoint bit.
    isProtected:mob=>animals.isTamed(mob.id,{id:OWNER})
  });
  const player={
    id:OWNER,height:1.72,threatening:true,
    get position(){return playerAt();},
    get alive(){return health>0;},
    damage(amount){
      if(readOnly||health<=0||damageCooldown>0||
         !Number.isFinite(amount)||amount<=0)return false;
      health=Math.max(0,health-amount);
      damageCooldown=.7;
      onPlayerDamage({health,amount,down:health===0});
      return true;
    }
  };
  function advance(seconds,regions=[]){
    if(readOnly||!Number.isFinite(seconds)||seconds<=0)return;
    const dt=Math.min(seconds,.1);
    elapsed+=dt;
    damageCooldown=Math.max(0,damageCooldown-dt);
    companions.advance(dt);animals.advance(dt);
    ecology.advance(dt,player.position,regions);
    const peers=engine.all();
    const threat=peers.find(m=>m.species.classification==='hostile'&&
      m.state==='active'&&Math.hypot(...m.position.map((x,i)=>x-player.position[i]))<8);
    combat.advance(dt,player,{
      override:mob=>animals.directive(mob)??
        companions.directive(mob,player,threat?.id??null)??
        // An owned animal must not run from its own player as though the
        // threatening flag represented a stranger. Stay approachable within
        // mounting distance; otherwise use the original voxel navigator to
        // follow toward the owner. Wild animals retain their normal instincts.
        (animals.isTamed(mob.id,player)?
          (Math.hypot(...mob.position.map((v,i)=>v-player.position[i]))<=1.5?
            {state:'tamed-calm',heading:[0,0]}:
            {state:'tamed-follow',destination:player.position}):null)
    });
    engine.drainEvents();
  }
  function drawEntities(){
    const creatures=engine.all().filter(m=>m.state!=='dormant').map(m=>({
      ...m, visual:behavior.state(m.id)
    }));
    // Real hostile ranged attacks must not strike an invisible projectile.
    // Use the four original authored preview projectile meshes with real
    // position/velocity from MobCombat, not synthetic screen-space sprites.
    const projectiles=combat.projectiles.map(shot=>({
      ...shot,species:{id:shot.visual},state:'active',juvenile:false,
      yaw:Math.atan2(shot.velocity[0],shot.velocity[2]),visual:'projectile'
    }));
    return [...creatures,...projectiles];
  }
  function attack(eye,forward){
    if(readOnly||!player.alive)return null;
    let best=null,bestDistance=2.6;
    for(const mob of engine.all()){
      if(!['active','idle'].includes(mob.state))continue;
      const center=[mob.position[0],mob.position[1]+mob.species.body.height*.58,mob.position[2]];
      const ray=center.map((x,i)=>x-eye[i]);
      const distance=Math.hypot(...ray);
      if(distance>bestDistance||distance<.05)continue;
      const dot=ray.reduce((sum,x,i)=>sum+x*forward[i],0)/distance;
      if(dot<.965||!query.lineOfSight(eye,center))continue;
      best=mob;bestDistance=distance;
    }
    if(!best)return null;
    const amount=best.species.classification==='hostile'?8:4;
    if(!engine.damage(best.id,amount))return null;
    return {name:best.species.displayName,health:engine.get(best.id)?.health??0,
      downed:engine.get(best.id)?.state==='downed'};
  }
  function interact(){
    if(readOnly||!player.alive)return 'Creature interaction unavailable in protected mode';
    const near=engine.all().filter(m=>m.state!=='dormant').map(m=>({
      mob:m,d:Math.hypot(...m.position.map((x,i)=>x-player.position[i]))
    })).filter(x=>x.d<=1.8).sort((a,b)=>a.d-b.d);
    if(!near.length)return 'No creature within reach';
    const {mob}=near[0];
    if(mob.state==='downed'&&companions.rescue(mob.id,player))
      return mob.species.displayName+' rescued';
    if(companions.befriend(mob.id,player))
      return mob.species.displayName+' joined as a recoverable companion';
    if(animals.tame(mob.id,player))
      return mob.species.displayName+' tamed';
    return 'No eligible interaction with '+mob.species.displayName;
  }
  function toggleMount(){
    if(readOnly||!player.alive)return 'Creature riding unavailable in protected mode';
    if(animals.riderPosition(player)){
      animals.dismount(player);
      return 'Dismounted; regular walking controls restored';
    }
    const eligible=engine.all().filter(m=>m.species.riding.eligible&&
      animals.isTamed(m.id,player)&&
      ['idle','active'].includes(m.state)&&
      Math.hypot(...m.position.map((v,i)=>v-player.position[i]))<=2)
      .sort((a,b)=>Math.hypot(...a.position.map((v,i)=>v-player.position[i]))-
        Math.hypot(...b.position.map((v,i)=>v-player.position[i])));
    for(const mob of eligible){
      if(animals.mount(mob.id,player))
        return 'Mounted '+mob.species.displayName+' · move with your normal controls';
    }
    return 'No nearby tamed rideable creature with safe headroom';
  }
  function dismount(){return animals.dismount(player);}
  function riderPosition(){return animals.riderPosition(player);}
  function steerMount(strafe,forward,yaw,run=false){
    if(readOnly||!riderPosition()||![strafe,forward,yaw].every(Number.isFinite))
      return false;
    // Match original iPhone/keyboard two-thumb frame, not preview axes.
    const dx=Math.sin(yaw)*forward+Math.cos(yaw)*strafe;
    const dz=Math.cos(yaw)*forward-Math.sin(yaw)*strafe;
    return animals.steer(player,[dx,dz],run===true);
  }
  function breedNearby(){
    if(readOnly||!player.alive)return 'Breeding unavailable in protected mode';
    const eligible=engine.all().filter(m=>
      ['idle','active'].includes(m.state)&&
      m.species.breeding.eligible&&!m.juvenile&&
      Math.hypot(...m.position.map((v,i)=>v-player.position[i]))<=3);
    for(let i=0;i<eligible.length;i++)for(let j=i+1;j<eligible.length;j++){
      const first=eligible[i],second=eligible[j];
      if(first.species.id!==second.species.id||
        Math.hypot(...first.position.map((v,k)=>v-second.position[k]))>2.4)continue;
      const child=animals.breed(first.id,second.id);
      if(child)return 'New '+first.species.displayName+' offspring born';
    }
    return 'Breeding needs two nearby healthy matching adults and clear habitat';
  }
  function companionOrder(mode){
    if(readOnly||!player.alive)return 'Companion commands unavailable in protected mode';
    if(!['follow','stay','return'].includes(mode))return 'Unknown companion order';
    const slots=companions.slots().filter(slot=>slot.owner===player.id)
      .map(slot=>({slot,mob:engine.get(slot.id)}))
      .filter(x=>x.mob&&['idle','active'].includes(x.mob.state)&&
        Math.hypot(...x.mob.position.map((v,i)=>v-player.position[i]))<=8)
      .sort((a,b)=>Math.hypot(...a.mob.position.map((v,i)=>v-player.position[i]))-
        Math.hypot(...b.mob.position.map((v,i)=>v-player.position[i])));
    if(!slots.length)return 'No awake bonded companion within command range';
    const {slot,mob}=slots[0];
    return companions.command(slot.id,player,mode)?
      mob.species.displayName+' ordered to '+mode:'Companion order rejected safely';
  }
  function save(){
    if(readOnly||!allowWrites())return false;
    let value;
    try{
      value=serializeRoster({engine,companions,animals});
      if(value===lastStored)return true;
      const previous=storage.getItem(key);
      // Keep a verified previous-good copy even if a quota/storage error stops
      // the new commit. Never delete either copy during an upgrade.
      if(previous!==null && previous!==value)storage.setItem(key+'.backup',previous);
      storage.setItem(key,value);
      if(storage.getItem(key)!==value)throw Error('Mob sidecar write not verified');
      lastStored=value;return true;
    }catch(error){readOnly=true;damaged=true;return false;}
  }
  function revive(){health=100;damageCooldown=2;return health;}
  function status(){return {
    enabled:true,species:LIVE_MOB_COUNT,counts:engine.counts(),
    health,readonly:readOnly,damaged,companions:companions.slots().length,
    mounted:Boolean(riderPosition()),gpuSafe:true,elapsed
  };}
  function dispose(){engine.dispose();}
  return {advance,drawEntities,attack,interact,save,dispose,status,revive,
    toggleMount,dismount,riderPosition,steerMount,breedNearby,companionOrder,
    get query(){return query;}, get engine(){return engine;}};
}
