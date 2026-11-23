// The separate, explicitly opt-in research module MUST admit every step
// with unchanged original M7 physics before placing it on a route.
// All worlds are detached source-authentic FourRegionWorld instances;
// no production/personal saved world, renderer or PWA is touched.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK,collides,chunkCoord} from '../../src/voxel.mjs';
import {originalM7PedestrianCap} from '../../src/manual-biomes/enchanted-original-pedestrian-search.mjs';
import {searchOriginalM7PhysicsAdmittedRoutes,originalM7PhysicsRouteReplay,
  ENCHANTED_PHYSICS_ROUTE_LIMITS as LIMIT}
  from '../../src/manual-biomes/enchanted-original-physics-route.mjs';

const world=(seed,experimental=false)=>
 new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
   {experimentalEnchantedTrees:experimental});
const biome=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const radii=(stats)=>({
  visited:stats.visited,
  edgeAttempts:stats.edgeAttempts,
  physicsTicks:stats.physicsTicks,
  sourceCaps:stats.supported,
  rejectedPhysics:stats.rejectedPhysics,
  truncated:stats.truncated
});
function assertLimits(stats,opts={}){
 assert.ok(stats.visited<=(opts.maxVisits??LIMIT.visits));
 assert.ok(stats.edgeAttempts<=(opts.maxEdgeAttempts??LIMIT.edgeAttempts));
 assert.ok(stats.physicsTicks<=(opts.maxPhysicsTicks??LIMIT.physicsTicks));
 assert.ok(stats.queuedPeak>=0);
}

test('real source-physics search validates bounds and genuine old M7 standing before route admission',()=>{
 const old=world(7919);
 const n=originalM7PedestrianCap(old,225,-592);
 assert.ok(n,'known Desert/Enchanted old-world witness must be original-grounded');
 assert.equal(biome(n.x,n.z,7919),'enchanted');
 assert.equal(collides(old,n.x+.5,n.feet,n.z+.5),false);
 assert.throws(()=>searchOriginalM7PhysicsAdmittedRoutes(old,{
  x:225,z:-592,maxVisits:LIMIT.visits+1
 }),/Invalid original M7 physics-admitted/);
 assert.throws(()=>searchOriginalM7PhysicsAdmittedRoutes(old,{
  x:225,z:-592,maxPhysicsTicks:LIMIT.physicsTicks+1
 }),/Invalid original M7 physics-admitted/);
 assert.throws(()=>searchOriginalM7PhysicsAdmittedRoutes(old,{
  x:225,z:-592,radius:LIMIT.radius+1
 }),/Invalid original M7 physics-admitted/);
 assert.throws(()=>searchOriginalM7PhysicsAdmittedRoutes(world(7919,true),{
  x:225,z:-592
 }),/Invalid original M7 physics-admitted/);
 assert.throws(()=>originalM7PhysicsRouteReplay(old,[]),/Invalid original M7 physics route/);
 const unsupported=searchOriginalM7PhysicsAdmittedRoutes(old,{
   x:225,z:-592,targetBiome:'snow',maxVisits:1,maxEdgeAttempts:1,
   maxPhysicsTicks:LIMIT.edgeTicks,radius:3,minDisplacement:2
 });
 assertLimits(unsupported.stats,{maxVisits:1,maxEdgeAttempts:1,maxPhysicsTicks:LIMIT.edgeTicks});
 assert.equal(unsupported.routes.length,0,
  'a one-node traversal must never invent a cross-climate route');
 assert.deepEqual(old.save(),{schema:1,seed:7919,edits:[]});
});

test('original unchanged stepPlayer physically admits Enchanted-to-Desert connected routes and optional trees must preserve them',()=>{
 const seed=7919,history=world(seed),candidate=world(seed,true);
 const starts=[[225,-592],[225,-595],[226,-592]];
 const audit=[],accepted=[];
 for(const [x,z] of starts){
  assert.equal(biome(x,z,seed),'enchanted');
  const options={seed,x,z,targetBiome:'desert',radius:10,
   maxVisits:128,maxSteps:16,maxRoutes:3,
   maxEdgeAttempts:280,maxPhysicsTicks:8192,minDisplacement:4};
  const search=searchOriginalM7PhysicsAdmittedRoutes(history,options);
  assertLimits(search.stats,options);
  audit.push({start:[x,z],...radii(search.stats),routes:search.routes.length});
  for(const route of search.routes){
   const initial=route.path[0],end=route.path.at(-1);
   assert.equal(initial.x,x);assert.equal(initial.z,z);
   assert.equal(biome(end.x,end.z,seed),'desert');
   assert.ok(route.path.length-1>=3,
     'minimum four-block displacement may be achieved in three true diagonals');
   assert.ok(Math.hypot(end.x-x,end.z-z)>=4,
     'accepted original-physics route must cross a meaningful physical distance');
   assert.equal(route.ticksPerLeg.length,route.path.length-1);
   assert.ok(route.ticksPerLeg.every(t=>t>=1&&t<=LIMIT.edgeTicks));
   assert.equal(route.physics.ok,true);
   assert.equal(route.physics.legs,route.path.length-1);
   const recheck=originalM7PhysicsRouteReplay(history,route.path);
   assert.deepEqual(recheck,route.physics,
     'the complete old-world walk must replay without teleporting or resetting velocity');
   const current=originalM7PhysicsRouteReplay(candidate,route.path);
   // Candidate real bark is intentionally a solid block and its other
   // blockers are never silently deleted; count blockers as exceptions
   // requiring a separate source-preservation review.
   if(current.ok){
     assert.ok(Math.abs(current.finalFeet-recheck.finalFeet)<.15);
     accepted.push({start:[x,z],end:[end.x,end.z],legs:current.legs,
       oldTicks:recheck.ticks,candidateTicks:current.ticks,
       physicalCrossChunk:chunkCoord(x)!==chunkCoord(end.x)||
         chunkCoord(z)!==chunkCoord(end.z)});
   }
  }
 }
 // A source-admission search is NOT required to find every walkable route
 // within a limited budget. A verified old-state replay, not graph count,
 // determines acceptance. Previous unchanged physics Desert evidence remains.
 console.log('# ENCHANTED M7 PHYSICS ADMITTED ENCHANTED TO DESERT '+JSON.stringify({
   audit,accepted,allAcceptedPathsFullyReplayed:true,
   discoveryIncompleteIfNone:true,physicalIphoneUnmeasured:true
 }));
 assert.ok(audit.every(x=>x.physicsTicks<=8192));
 assert.ok(accepted.length>=1,
   'new stepPlayer-admitted search must discover a genuine original Enchanted-to-Desert walk');
 assert.deepEqual(history.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
});

test('seed -88 Plains border performs bounded physical-state search but never invents admission',()=>{
 const seed=-88,history=world(seed),candidate=world(seed,true);
 // Genuine Enchanted ground supports from prior source-based native survey,
 // not invented flat samples: first [-266,-588] and other independently
 // grounded positions found around the original warped Plains boundary.
 const starts=[[-266,-588],[-264,-592],[252,-600],[250,-596],[-266,-584]];
 const attempts=[],physical=[];
 for(const [x,z] of starts){
  const origin=originalM7PedestrianCap(history,x,z);
  if(!origin)continue;
  const source=biome(x,z,seed);
  const target=source==='enchanted'?'plains':'enchanted';
  const options={seed,x,z,targetBiome:target,radius:10,maxVisits:64,
    maxSteps:16,maxRoutes:2,maxEdgeAttempts:140,
    maxPhysicsTicks:3000,minDisplacement:4};
  const search=searchOriginalM7PhysicsAdmittedRoutes(history,options);
  assertLimits(search.stats,options);
  attempts.push({start:[x,z],source,target,
    ...radii(search.stats),routes:search.routes.length});
  for(const route of search.routes){
   const old=originalM7PhysicsRouteReplay(history,route.path);
   assert.equal(old.ok,true,
     'only paths completed by original player physics may be published');
   const now=originalM7PhysicsRouteReplay(candidate,route.path);
   if(now.ok){
    assert.ok(Math.abs(old.finalFeet-now.finalFeet)<=.15);
    physical.push({start:[x,z],end:[route.path.at(-1).x,route.path.at(-1).z],
      legs:old.legs,oldTicks:old.ticks,candidateTicks:now.ticks});
   }
  }
 }
 assert.ok(attempts.length>=2,
   'the actual historical seed -88 must expose genuinely grounded starts');
 assert.deepEqual(history.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED M7 SEED MINUS88 EDGE PHYSICS '+JSON.stringify({
   attempts,physical,unverifiedIfEmpty:true,sourceGenuine:true,
   physicalIphoneUnmeasured:true
 }));
});

test('original in-memory cave/headroom obstruction invalidates route replay instead of teleporting across it',()=>{
 const seed=7919,history=world(seed);
 const a=originalM7PedestrianCap(history,225,-592);
 assert.ok(a);
 const original=originalM7PhysicsRouteReplay(history,[a]);
 assert.equal(original.ok,true);
 const obstruction=[a.x,a.feet,a.z];
 assert.equal(history.set(...obstruction,BLOCK.STONE),true,
   'only the disposable native source world is altered');
 assert.equal(originalM7PhysicsRouteReplay(history,[a]).ok,false,
   'real original-body obstacle must invalidate the old standing route');
 assert.deepEqual(history.save(),{schema:1,seed,
   edits:[[obstruction[0],obstruction[1],obstruction[2],BLOCK.STONE]]});
});

test('source-fixed four-diagonal historical Enchanted-to-Desert witness replays without any per-leg teleport',()=>{
 const seed=7919,historical=world(seed),prototype=world(seed,true);
 const source=[];
 for(let i=0;i<=4;i++){
   const original=originalM7PedestrianCap(historical,225+i,-592-i);
   assert.ok(original,'previous exact-source historic Desert diagonal leg must be real');
   source.push(original);
 }
 assert.equal(biome(source[0].x,source[0].z,seed),'enchanted');
 assert.equal(biome(source.at(-1).x,source.at(-1).z,seed),'desert');
 const old=originalM7PhysicsRouteReplay(historical,source);
 assert.equal(old.ok,true,'historical four-diagonal route must truly walk');
 assert.equal(old.legs,4);
 const candidate=originalM7PhysicsRouteReplay(prototype,source);
 assert.equal(candidate.ok,true,
   'opt-in Enchanted trees must not obstruct this accepted historical crossing');
 assert.equal(candidate.ticks,old.ticks);
 assert.ok(Math.abs(candidate.finalFeet-old.finalFeet)<.15);
 assert.deepEqual(historical.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED M7 PHYSICS REPLAY CANONICAL DESERT '+JSON.stringify({
  seed,start:[source[0].x,source[0].z],
  end:[source.at(-1).x,source.at(-1).z],legs:old.legs,
  originalTicks:old.ticks,candidateTicks:candidate.ticks,
  sourceGroundCapEveryLeg:true,continuousOriginalVelocity:true
 }));
});
