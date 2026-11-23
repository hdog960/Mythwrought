// Original M7 research only: prove optional bounded alternate arrival
// headings preserve genuine full stepPlayer state, never fabricate routes,
// and do not alter the accepted single-arrival source path or saved worlds.
// Test real cave-reader provenance separately from cave-ENTRANCE walking.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {originalM7PedestrianCap} from '../../src/manual-biomes/enchanted-original-pedestrian-search.mjs';
import {searchOriginalM7PhysicsAdmittedRoutes,originalM7PhysicsRouteReplay,
  ENCHANTED_PHYSICS_ROUTE_LIMITS as LIMIT}
  from '../../src/manual-biomes/enchanted-original-physics-route.mjs';

const original=seed=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const experimental=seed=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
  {experimentalEnchantedTrees:true});
const biome=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const covered=(stats,opts)=>{
  assert.ok(stats.visited<=opts.maxVisits);
  assert.ok(stats.edgeAttempts<=opts.maxEdgeAttempts);
  assert.ok(stats.physicsTicks<=opts.maxPhysicsTicks);
  assert.ok(stats.peakArrivalsAtCell<=opts.maxArrivalsPerCell);
  assert.ok(stats.distinctCells<=stats.supported+1);
  assert.ok(stats.alternateArrivals<=stats.supported);
};

test('historical original M7 default remains single-arrival and rejects unbounded branching',()=>{
 const seed=7919,w=original(seed),start=[225,-592];
 assert.equal(biome(...start,seed),'enchanted');
 for(const invalid of [0,-1,3,1.5,'2',null,Infinity]){
  assert.throws(()=>searchOriginalM7PhysicsAdmittedRoutes(w,{
    x:start[0],z:start[1],maxArrivalsPerCell:invalid
  }),/Invalid original M7 physics-admitted/);
 }
 const opts={seed,x:start[0],z:start[1],targetBiome:'desert',
   radius:10,maxVisits:128,maxSteps:16,maxRoutes:3,
   maxEdgeAttempts:280,maxPhysicsTicks:8192,minDisplacement:4};
 const defaultPass=searchOriginalM7PhysicsAdmittedRoutes(w,opts);
 const explicitOne=searchOriginalM7PhysicsAdmittedRoutes(w,{
   ...opts,maxArrivalsPerCell:1
 });
 assert.deepEqual(explicitOne,defaultPass,
   'opt-in arrival branching may not modify default original M7 physical routes');
 assert.equal(defaultPass.stats.alternateArrivals,0);
 assert.equal(defaultPass.stats.peakArrivalsAtCell,1);
 assert.equal(defaultPass.routes.length,3);
 for(const route of defaultPass.routes){
  const replay=originalM7PhysicsRouteReplay(w,route.path);
  assert.deepEqual(route.physics,replay);
  assert.equal(biome(route.path.at(-1).x,route.path.at(-1).z,seed),'desert');
 }
 assert.deepEqual(w.save(),{schema:1,seed,edits:[]});
 console.log('# ENCHANTED REAL M7 ORIGINAL SINGLE-ARRIVAL EXACT PARITY '+
   JSON.stringify({seed,accepted:defaultPass.routes.length,
     visited:defaultPass.stats.visited,
     physicalTicks:defaultPass.stats.physicsTicks,
     unchangedDefault:true}));
});

test('genuine M7 alternate incoming momentum retains distinct bounded states and fully replayable crossings',()=>{
 const seed=7919,old=original(seed),candidate=experimental(seed);
 const starts=[[225,-592],[225,-595],[226,-592]];
 let alternateStates=0,verified=0,blocked=0;
 const witnesses=[];
 for(const [x,z] of starts){
  const opts={seed,x,z,targetBiome:'desert',radius:10,
    maxVisits:160,maxSteps:18,maxRoutes:3,
    maxEdgeAttempts:350,maxPhysicsTicks:8192,
    minDisplacement:4,maxArrivalsPerCell:2};
  const result=searchOriginalM7PhysicsAdmittedRoutes(old,opts);
  covered(result.stats,opts);
  alternateStates+=result.stats.alternateArrivals;
  assert.ok(result.stats.peakArrivalsAtCell<=2);
  assert.ok(result.stats.distinctCells<=result.stats.supported+1);
  for(const route of result.routes){
    const a=originalM7PhysicsRouteReplay(old,route.path);
    assert.deepEqual(a,route.physics,
      'alternate state must replay actual original physics without momentum reset');
    assert.equal(a.ok,true);
    assert.equal(biome(route.path.at(-1).x,route.path.at(-1).z,seed),'desert');
    const b=originalM7PhysicsRouteReplay(candidate,route.path);
    if(!b.ok){blocked++;continue;}
    verified++;
    assert.ok(Math.abs(b.finalFeet-a.finalFeet)<=.15);
    if(witnesses.length<8)
      witnesses.push({start:[x,z],
        end:[route.path.at(-1).x,route.path.at(-1).z],
        legs:a.legs,oldTicks:a.ticks,candidateTicks:b.ticks});
  }
 }
 assert.ok(alternateStates>0,
   'test must genuinely exercise different original incoming-heading states');
 assert.ok(verified>=1,
   'alternate-state search must retain at least one accepted original Desert crossing');
 assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED REAL M7 TWO-ARRIVAL ORIGINAL PHYSICS '+
  JSON.stringify({seed,alternateStates,verified,blocked,witnesses,
    sourceOriginalStepPlayer:true,oldSaveUnchanged:true,
    physicalIphoneNotMeasured:true}));
});

test('seed -88 extended real momentum-state search stays bounded and never claims an unverified Plains crossing',()=>{
 const seed=-88,old=original(seed),candidate=experimental(seed);
 const starts=[[-266,-588],[-264,-592],[252,-600],[250,-596],[-266,-584]];
 const audit=[],complete=[];let alternates=0;
 for(const [x,z] of starts){
  if(!originalM7PedestrianCap(old,x,z))continue;
  assert.equal(biome(x,z,seed),'enchanted');
  const opts={seed,x,z,targetBiome:'plains',
   radius:16,maxVisits:160,maxSteps:24,maxRoutes:2,
   maxEdgeAttempts:380,maxPhysicsTicks:8192,
   minDisplacement:4,maxArrivalsPerCell:2};
  const s=searchOriginalM7PhysicsAdmittedRoutes(old,opts);
  covered(s.stats,opts);
  alternates+=s.stats.alternateArrivals;
  audit.push({start:[x,z],visited:s.stats.visited,
    sourceCells:s.stats.distinctCells,
    alternateStates:s.stats.alternateArrivals,
    edgeAttempts:s.stats.edgeAttempts,physicsTicks:s.stats.physicsTicks,
    originalRoutes:s.routes.length,truncated:s.stats.truncated,
    rejectedGround:s.stats.rejectedGround,
    rejectedHeight:s.stats.rejectedHeight,
    rejectedPhysics:s.stats.rejectedPhysics});
  for(const route of s.routes){
   const a=originalM7PhysicsRouteReplay(old,route.path);
   assert.equal(a.ok,true);
   const end=route.path.at(-1);
   assert.equal(biome(end.x,end.z,seed),'plains');
   const b=originalM7PhysicsRouteReplay(candidate,route.path);
   if(!b.ok)continue;
   assert.ok(Math.abs(a.finalFeet-b.finalFeet)<=.15);
   complete.push({start:[x,z],end:[end.x,end.z],
     legs:a.legs,oldTicks:a.ticks,candidateTicks:b.ticks});
  }
 }
 assert.equal(audit.length,5,
   'authentic five original M7 supported starts must all be inspected');
 assert.ok(alternates>=1,'source must exercise actual alternate momentum arrivals');
 assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED REAL M7 SEED -88 MULTI-MOMENTUM PLANS '+
   JSON.stringify({audit,complete,alternates,
     sourceGroundAndRealPhysics:true,
     noRouteIfEmpty:true,noIphoneClaims:true}));
});

test('original cave source provenance near verified routes and seed -88 is audited without fake mouth admission',()=>{
 const samples=[
  {seed:7919,points:[[225,-592],[227,-594],[229,-596]]},
  {seed:179,points:[[268,-600],[271,-592],[275,-587]]},
  {seed:-88,points:[[-266,-588],[-264,-592],[252,-600]]}
 ];
 const evidence=[];
 for(const {seed,points} of samples){
  const old=original(seed),candidate=experimental(seed);
  const report={seed,sourceSamples:0,actualCaveOverrides:0,
    realCaveAir:0,realCaveSolid:0,
    sourceMismatch:0,supportedSurface:0,
    nearPhysicalMouthCertified:false};
  for(const [cx,cz] of points){
   const ground=originalM7PedestrianCap(old,cx,cz);
   if(!ground)continue;
   report.supportedSurface++;
   for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){
    for(let y=ground.surface-12;y<=ground.surface+2;y++){
     report.sourceSamples++;
     const a=old.environmentCaves.get(cx+dx,y,cz+dz);
     const b=candidate.environmentCaves.get(cx+dx,y,cz+dz);
     assert.equal(a,b,'opted-in trees may not change original cave provenance');
     if(a!==undefined){
      report.actualCaveOverrides++;
      if(a===BLOCK.AIR)report.realCaveAir++;
      else report.realCaveSolid++;
      // For original-source authored caves, the authoritative terrain
      // baseline must return that exact carved/solid cave value.
      assert.equal(old._environmentBaseline(cx+dx,y,cz+dz),a);
      assert.equal(candidate._environmentBaseline(cx+dx,y,cz+dz),a);
     }
    }
   }
  }
  assert.ok(report.sourceSamples>0);
  assert.equal(report.sourceMismatch,0);
  evidence.push(report);
  assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
  assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
 }
 console.log('# ENCHANTED REAL M7 AUTHORITATIVE CAVE-ADJACENCY AUDIT '+
   JSON.stringify({evidence,originalCaveProvenanceCompared:true,
     nearbyCaveDataDoesNotProveCaveMouthWalk:true,
     physicalIphone:false}));
});
