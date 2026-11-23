// Dedicated NEW native original-repository M7 research only. Existing short
// border walks, source edits, old Desert defaults and GPU gates are reused,
// not rerun. No caves, user saves, production files or experimental migration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {originalM7PhysicalGroundCap}
  from '../../src/manual-biomes/enchanted-original-standing-diagnostic.mjs';
import {searchOriginalM7PhysicsAdmittedRoutes}
  from '../../src/manual-biomes/enchanted-original-physics-route.mjs';
import {auditOriginalM7PhysicallyWalkedSource}
  from '../../src/manual-biomes/enchanted-original-route-evidence.mjs';

const seed=-88;
const original=()=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const experimental=()=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
  {experimentalEnchantedTrees:true});
const biome=(x,z)=>v6BiomeAt(x,z,seed)?.name??'plains';
const anchors=[
  {x:-266,z:-588,direction:'west',side:'negative-X'},
  {x:252,z:-600,direction:'east',side:'positive-X'}
];
const configuredSearch=(world,site,width,arrivals)=>searchOriginalM7PhysicsAdmittedRoutes(world,{
  seed,x:site.x,z:site.z,targetBiome:'plains',groundMode:'physical',
  corridor:{direction:site.direction,width,backtrack:0},
  radius:16,maxVisits:192,maxSteps:24,maxRoutes:2,
  maxEdgeAttempts:512,maxPhysicsTicks:8192,
  minDisplacement:8,maxArrivalsPerCell:arrivals
});

test('long original M7 continuous stepPlayer walking crosses REAL signed 16-block seams and legacy/overlay source',()=>{
 const world=original(),prototype=experimental();
 const findings=[];
 for(const site of anchors){
  assert.equal(biome(site.x,site.z),'enchanted');
  assert.ok(originalM7PhysicalGroundCap(world,site.x,site.z),
    'original historical physical start must be real');
  const attempts=[];
  let accepted=null;
  // Bounded widening only if genuine original physics has no route yet.
  // Each run retains strict original per-query edge/visit/tick limits.
  for(const [width,arrivals] of [[2,1],[3,1],[2,2]]){
    const result=configuredSearch(world,site,width,arrivals);
    attempts.push({width,arrivals,visited:result.stats.visited,
      physicsTicks:result.stats.physicsTicks,
      edgeAttempts:result.stats.edgeAttempts,
      routes:result.routes.length,truncated:result.stats.truncated,
      rejectedGround:result.stats.rejectedGround,
      rejectedPhysics:result.stats.rejectedPhysics});
    if(result.routes.length){accepted=result;break;}
  }
  assert.ok(accepted,
    site.side+' requires an actual longer original source physics crossing; diagnostics: '+JSON.stringify(attempts));
  const good=[];
  for(const route of accepted.routes){
    const proof=auditOriginalM7PhysicallyWalkedSource(world,route.path);
    assert.equal(proof.ok,true);
    assert.deepEqual(proof.physics,route.physics);
    assert.equal(proof.cells[0].biome,'enchanted');
    assert.equal(proof.cells.at(-1).biome,'plains');
    assert.ok(proof.metrics.legs>=6,'this must improve on previous 2-4-leg walks');
    assert.ok(proof.metrics.netDisplacement>=8);
    assert.ok(proof.metrics.chunkSeams>=1,
      'must actually walk across a signed 16-block chunk seam');
    assert.ok(proof.metrics.legacyCells>=1,
      'real original legacy material must occur on the path');
    const counterpart=auditOriginalM7PhysicallyWalkedSource(prototype,route.path);
    if(!counterpart.ok)continue;
    assert.equal(counterpart.physics.ticks,proof.physics.ticks);
    assert.equal(counterpart.physics.legs,proof.physics.legs);
    good.push({start:proof.metrics.start,end:proof.metrics.end,
      legs:proof.metrics.legs,ticks:proof.physics.ticks,
      original:proof.metrics,candidate:counterpart.metrics,
      originalMaterialPath:proof.cells.map(c=>[c.x,c.z,c.surface,c.source,c.biome])});
  }
  assert.ok(good.length>=1,
    site.side+' must replay unchanged original and experimental physics');
  findings.push({side:site.side,attempts,walks:good});
 }
 assert.equal(findings.length,2);
 // Record, but do not invent, mixed overlays or height-changing passages.
 const all=findings.flatMap(f=>f.walks);
 assert.ok(all.every(w=>w.original.chunkSeams>=1));
 assert.deepEqual(world.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED LONG ORIGINAL M7 PHYSICS BORDER SOURCE '+
   JSON.stringify({findings,longNativeWalks:all.length,
     mixedOverlayNativeWalks:all.filter(w=>w.original.sourceTransitions>0).length,
     heightChangingNativeWalks:all.filter(w=>w.original.heightChanges>0).length,
     authoredCaveMouthWalksVerified:0,
     installedIphonePwaMeasured:false,productionChanged:false}));
});

test('original M7 source-provenance walker fails closed after a real disposable mined-support edit',()=>{
 const path=[[-273,-588],[-274,-588],[-275,-588]].map(([x,z])=>
  originalM7PhysicalGroundCap(original(),x,z));
 assert.ok(path.every(Boolean),'the three actual historical source cells must stand');
 const unedited=original();
 const result=auditOriginalM7PhysicallyWalkedSource(unedited,path);
 assert.equal(result.ok,true,'previous verified short original route remains walkable');
 assert.equal(result.metrics.legs,2);
 assert.deepEqual(unedited.save(),{schema:1,seed,edits:[]});
 const mined=original();
 const middle=path[1];
 assert.equal(mined.set(middle.x,middle.surface,middle.z,0),true);
 const rejected=auditOriginalM7PhysicallyWalkedSource(mined,path);
 assert.equal(rejected.ok,false,'route may not bridge a mined original source cell');
 assert.equal(rejected.physics.reason,'original-ground-changed');
 console.log('# ENCHANTED ORIGINAL M7 ROUTE SOURCE EDIT VETO '+
  JSON.stringify({originalLegs:result.physics.legs,
    originalTicks:result.physics.ticks,
    minedOriginalSupportRejected:true,
    realWorldSetUsed:true,gameplayUntouched:true}));
});
