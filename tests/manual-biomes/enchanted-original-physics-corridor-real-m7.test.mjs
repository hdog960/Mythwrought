// Source-authentic bounded Enchanted Phase 2 corridor acceptance.
// Direction is read from the ACTUAL warped V6 biome, not a fabricated
// border. FIFO traversal order and unchanged real stepPlayer admission
// are mandatory. This is research-only, not a game movement controller.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {searchOriginalM7PhysicsAdmittedRoutes,originalM7PhysicsRouteReplay,
  ENCHANTED_PHYSICS_ROUTE_LIMITS as LIM}
  from '../../src/manual-biomes/enchanted-original-physics-route.mjs';
import {originalM7PedestrianCap} from '../../src/manual-biomes/enchanted-original-pedestrian-search.mjs';

const oldWorld=seed=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const candidateWorld=seed=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
  {experimentalEnchantedTrees:true});
const biome=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const originalDirection=(seed,x,z,target)=>{
  const choices=[];
  for(const [direction,dx,dz] of [
    ['west',-1,0],['east',1,0],['north',0,-1],['south',0,1]
  ]){
    for(let i=1;i<=LIM.radius;i++)
      if(biome(x+dx*i,z+dz*i,seed)===target){
        choices.push({direction,distance:i,first:[x+dx*i,z+dz*i]});
        break;
      }
  }
  return choices.sort((a,b)=>a.distance-b.distance||
    a.direction.localeCompare(b.direction))[0]??null;
};
const limits=(r,opts)=>{
 assert.ok(r.stats.visited<=opts.maxVisits);
 assert.ok(r.stats.edgeAttempts<=opts.maxEdgeAttempts);
 assert.ok(r.stats.physicsTicks<=opts.maxPhysicsTicks);
 assert.ok(r.stats.peakArrivalsAtCell<=opts.maxArrivalsPerCell);
 assert.ok(r.routes.length<=opts.maxRoutes);
};

test('bounded original M7 corridor rejects invalid windows and preserves exact default single-arrival tree-world pathfinding',()=>{
 const seed=7919,w=oldWorld(seed);
 for(const bad of [{direction:'west',width:0,backtrack:1},
  {direction:'up',width:4,backtrack:0},
  {direction:'east',width:13,backtrack:0},
  {direction:'east',width:4,backtrack:5},
  {direction:'east',width:4,backtrack:1.5},
  {direction:'east',width:4},'east',[]]){
   assert.throws(()=>searchOriginalM7PhysicsAdmittedRoutes(w,{
    x:225,z:-592,corridor:bad
   }),/Invalid original M7 physics-admitted/);
 }
 const opts={seed,x:225,z:-592,targetBiome:'desert',radius:10,
   maxVisits:128,maxSteps:16,maxRoutes:3,
   maxEdgeAttempts:280,maxPhysicsTicks:8192,minDisplacement:4};
 const standard=searchOriginalM7PhysicsAdmittedRoutes(w,opts);
 const explicit=searchOriginalM7PhysicsAdmittedRoutes(w,{...opts,
   corridor:null,maxArrivalsPerCell:1});
 assert.deepEqual(explicit,standard,
  'optional corridor may never alter the proven default original-route behavior');
 assert.equal(standard.routes.length,3);
 assert.deepEqual(w.save(),{schema:1,seed,edits:[]});
});

test('authentic Enchanted to Desert source corridor retains original four-diagonal physical route admission',()=>{
 const seed=7919,old=oldWorld(seed),candidate=candidateWorld(seed);
 const x=225,z=-592;
 const dir=originalDirection(seed,x,z,'desert');
 assert.ok(dir,'actual V6 must independently locate the true Desert side');
 assert.equal(dir.direction,'east');
 const opts={seed,x,z,targetBiome:'desert',radius:12,
   corridor:{direction:dir.direction,width:5,backtrack:2},
   maxArrivalsPerCell:1,
   maxVisits:160,maxSteps:24,maxRoutes:3,
   maxEdgeAttempts:350,maxPhysicsTicks:8192,minDisplacement:4};
 const search=searchOriginalM7PhysicsAdmittedRoutes(old,opts);
 limits(search,opts);
 const accepted=[];
 for(const route of search.routes){
  const historical=originalM7PhysicsRouteReplay(old,route.path);
  assert.equal(historical.ok,true);
  assert.deepEqual(historical,route.physics);
  const after=originalM7PhysicsRouteReplay(candidate,route.path);
  if(!after.ok)continue;
  assert.equal(after.ticks,historical.ticks);
  const end=route.path.at(-1);
  assert.equal(biome(end.x,end.z,seed),'desert');
  for(const p of route.path)
    assert.ok(Math.abs(p.z-z)<=opts.corridor.width);
  accepted.push({end:[end.x,end.z],legs:after.legs,ticks:after.ticks});
 }
 assert.ok(accepted.length>=1,
   'genuine original Desert route must remain admitted inside source-correct corridor');
 assert.ok(search.stats.rejectedCorridor>0);
 assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED M7 PHYSICS WEST-EAST CORRIDOR DESERT '+JSON.stringify({
  seed,dir,accepted,stats:search.stats,
  sourceOriginalPhysics:true,originalWorldNotModified:true
 }));
});

test('real V6 seed -88 source-correct Plains corridors constrain wasted original physics without claiming nonexistent paths',()=>{
 const seed=-88,old=oldWorld(seed),candidate=candidateWorld(seed);
 const starts=[[-266,-588],[-264,-592],[252,-600],[250,-596],[-266,-584]];
 let considered=0,totalVisited=0,totalPruned=0,acceptedPhysics=0;
 const results=[];
 for(const [x,z] of starts){
  const cap=originalM7PedestrianCap(old,x,z);
  assert.ok(cap,'each historical seed -88 start must genuinely support original player');
  assert.equal(biome(x,z,seed),'enchanted');
  const dir=originalDirection(seed,x,z,'plains');
  assert.ok(dir&&dir.distance>=1&&dir.distance<=LIM.radius,
   'warped V6 real Plains target must exist inside declared physical radius');
  const opts={seed,x,z,targetBiome:'plains',radius:16,
    corridor:{direction:dir.direction,width:4,backtrack:1},
    maxArrivalsPerCell:1,maxVisits:192,maxSteps:24,maxRoutes:2,
    maxEdgeAttempts:450,maxPhysicsTicks:8192,minDisplacement:4};
  const r=searchOriginalM7PhysicsAdmittedRoutes(old,opts);
  limits(r,opts);considered++;
  totalVisited+=r.stats.visited;totalPruned+=r.stats.rejectedCorridor;
  const routes=[];
  for(const route of r.routes){
   const historic=originalM7PhysicsRouteReplay(old,route.path);
   assert.ok(historic.ok);
   const last=route.path.at(-1);
   assert.equal(biome(last.x,last.z,seed),'plains');
   const after=originalM7PhysicsRouteReplay(candidate,route.path);
   if(!after.ok)continue;
   assert.equal(after.ticks,historic.ticks);
   acceptedPhysics++;
   routes.push({end:[last.x,last.z],legs:after.legs,ticks:after.ticks});
  }
  results.push({start:[x,z],dir,originalSourceFeet:cap.feet,
    visited:r.stats.visited,edgeAttempts:r.stats.edgeAttempts,
    physicsTicks:r.stats.physicsTicks,
    prunedUnrelatedGround:r.stats.rejectedCorridor,
    reachedTarget:r.stats.visitedTargetBiome,
    originalPhysicsRoutes:r.routes.length,
    physicallyPreservedRoutes:routes,
    truncated:r.stats.truncated});
 }
 assert.equal(considered,5);
 assert.ok(totalPruned>0,
  'actual corridor must measurably avoid exploring unrelated original ground');
 assert.ok(totalVisited<=5*192);
 assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED REAL M7 SEED -88 ORIGINAL-CLIMATE CORRIDOR '+JSON.stringify({
  results,totalVisited,totalPruned,acceptedPhysics,
  noCandidateClaimWhenMissing:true,physicalIphoneNotTested:true
 }));
});
