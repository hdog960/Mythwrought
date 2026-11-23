// Research-only native original-M7 source: environmental overlays are
// DELTAS, not the canonical physical terrain. Authentic legacy GRASS may
// remain fully walkable under an empty environmental column.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {originalM7PedestrianCap} from '../../src/manual-biomes/enchanted-original-pedestrian-search.mjs';
import {originalM7PhysicalGroundCap} from '../../src/manual-biomes/enchanted-original-standing-diagnostic.mjs';
import {searchOriginalM7PhysicsAdmittedRoutes,originalM7PhysicsRouteReplay}
  from '../../src/manual-biomes/enchanted-original-physics-route.mjs';

const seed=-88;
const old=()=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const candidate=()=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 {experimentalEnchantedTrees:true});
const name=(x,z)=>v6BiomeAt(x,z,seed)?.name??'plains';
function firstPlains(startX,z,dir){
 const step=dir==='west'?-1:1;
 for(let d=1;d<=16;d++)
   if(name(startX+step*d,z)==='plains')return startX+step*d;
 return null;
}

test('genuine original-world physical source admits all 52 prior false negatives without changing overlay or old admission',()=>{
 const world=old(),prototype=candidate(),anchors=[
  {x:-266,z:-588,dir:'west'},
  {x:252,z:-600,dir:'east'}
 ];
 const counts={checked:0,emptyOriginalOverlays:0,
   physicallySupported:0,prototypePhysicallySupported:0,
   oldResearchCapRejections:0};
 for(const anchor of anchors){
  for(const dz of [0,-4,4,-8,8,-12,12]){
   const z=anchor.z+dz;
   const edge=firstPlains(anchor.x,z,anchor.dir);
   if(edge===null)continue;
   const step=anchor.dir==='west'?-1:1;
   for(const back of [1,2,3,4]){
    const x=edge-step*back;
    if(name(x,z)!=='enchanted')continue;
    counts.checked++;
    assert.equal(world._columnPlan(x,z).size,0);
    assert.equal(originalM7PedestrianCap(world,x,z),null);
    counts.oldResearchCapRejections++;
    const a=originalM7PhysicalGroundCap(world,x,z);
    const b=originalM7PhysicalGroundCap(prototype,x,z);
    assert.ok(a,'real historical grass+body+ground probe must stand');
    assert.ok(b,'actual optional candidate must preserve physical ground');
    assert.deepEqual(b,a);
    counts.emptyOriginalOverlays++;
    counts.physicallySupported++;
    counts.prototypePhysicallySupported++;
   }
  }
 }
 assert.equal(counts.checked,52);
 assert.deepEqual(world.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
 assert.throws(()=>originalM7PhysicalGroundCap({},-270,-588),/Invalid original M7/);
 console.log('# ENCHANTED M7 52 ORIGINAL LEGACY-GROUND FALSE NEGATIVES '+JSON.stringify(counts));
});

test('original M7 real physics cross-biome walking uses authenticated legacy source while preserving default BFS output',()=>{
 const history=old(),experimental=candidate();
 const anchors=[
  {x:-266,z:-588,dir:'west'},
  {x:252,z:-600,dir:'east'}
 ];
 const audit=[],proven=[];let startCount=0;
 for(const site of anchors){
  const sign=site.dir==='west'?-1:1;
  let testedAtThisSite=0;
  for(const dz of [0,-4,4,-8,8]){
   if(testedAtThisSite>=5)break;
   const z=site.z+dz;
   const bound=firstPlains(site.x,z,site.dir);
   if(bound===null)continue;
   for(const back of [2,3,4]){
    if(testedAtThisSite>=5)break;
    const x=bound-sign*back;
    const source=originalM7PhysicalGroundCap(history,x,z);
    if(!source||name(x,z)!=='enchanted')continue;
    startCount++;testedAtThisSite++;
    const options={seed,x,z,targetBiome:'plains',
      groundMode:'physical',
      corridor:{direction:site.dir,width:3,backtrack:1},
      radius:9,maxVisits:112,maxSteps:18,maxRoutes:2,
      maxEdgeAttempts:250,maxPhysicsTicks:5200,
      minDisplacement:2,maxArrivalsPerCell:1};
    const search=searchOriginalM7PhysicsAdmittedRoutes(history,options);
    assert.equal(search.stats.groundMode,'physical');
    assert.ok(search.stats.visited<=112);
    assert.ok(search.stats.edgeAttempts<=250);
    assert.ok(search.stats.physicsTicks<=5200);
    let survived=0;
    for(const route of search.routes){
      const end=route.path.at(-1);
      assert.equal(name(end.x,end.z),'plains');
      const oldReplay=originalM7PhysicsRouteReplay(history,route.path,
        {groundMode:'physical'});
      assert.deepEqual(oldReplay,route.physics,
        'read-only historical physics replay must match admitted states');
      assert.equal(oldReplay.ok,true);
      const newReplay=originalM7PhysicsRouteReplay(experimental,route.path,
        {groundMode:'physical'});
      if(!newReplay.ok)continue;
      assert.equal(oldReplay.ticks,newReplay.ticks,
        'candidate trees must not change proven original physical crossing ticks');
      assert.ok(Math.abs(oldReplay.finalFeet-newReplay.finalFeet)<.15);
      survived++;
      proven.push({from:[x,z],to:[end.x,end.z],legs:oldReplay.legs,
        originalTicks:oldReplay.ticks,candidateTicks:newReplay.ticks,
        provenance:'original M7 legacy ground and genuine stepPlayer'});
    }
    audit.push({x,z,dir:site.dir,boundary:bound,
      originalRoutes:search.routes.length,survived,
      visited:search.stats.visited,
      edgeAttempts:search.stats.edgeAttempts,
      physicsTicks:search.stats.physicsTicks,
      rejectedOriginalPhysics:search.stats.rejectedPhysics});
    if(proven.length>=6)break;
   }
   if(proven.length>=6)break;
  }
  if(proven.length>=6)break;
 }
 assert.ok(startCount>=1);
 assert.ok(audit.every(r=>r.visited<=112));
 assert.deepEqual(history.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>experimental.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED ORIGINAL M7 TRUE PHYSICAL PLAINS FOREST CROSSING '+JSON.stringify({
  audit,proven,physicalStartCount:startCount,
  claimOnlyIfProven:proven.length>0,
  noTeleport:true,sourceNeverModified:true,
  installedIphoneNotTested:true
 }));
});

test('real east-side seed -88 Plains seam uses unchanged original stepPlayer and never rewrites old M7 ground',()=>{
 const history=old(),experimental=candidate(),site={x:252,z:-600,dir:'east'};
 const checked=[],crossings=[];
 for(const dz of [0,-4,4,-8,8]){
  const z=site.z+dz,edge=firstPlains(site.x,z,site.dir);
  if(edge===null)continue;
  for(const back of [2,3,4]){
   const x=edge-back;
   if(name(x,z)!=='enchanted')continue;
   const source=originalM7PhysicalGroundCap(history,x,z);
   const target=originalM7PhysicalGroundCap(history,edge,z);
   if(!source||!target)continue;
   const options={seed,x,z,targetBiome:'plains',
     groundMode:'physical',corridor:{direction:'east',width:3,backtrack:1},
     radius:9,maxVisits:112,maxSteps:18,maxRoutes:2,
     maxEdgeAttempts:250,maxPhysicsTicks:5200,
     minDisplacement:2,maxArrivalsPerCell:1};
   const search=searchOriginalM7PhysicsAdmittedRoutes(history,options);
   checked.push({start:[x,z],edge:[edge,z],
     sourceFeet:source.feet,plainsFeet:target.feet,
     routes:search.routes.length,visited:search.stats.visited});
   for(const route of search.routes){
    const end=route.path.at(-1);
    assert.equal(name(end.x,end.z),'plains');
    const oldRun=originalM7PhysicsRouteReplay(history,route.path,
      {groundMode:'physical'});
    assert.equal(oldRun.ok,true);
    assert.deepEqual(oldRun,route.physics);
    const candidateRun=originalM7PhysicsRouteReplay(experimental,route.path,
      {groundMode:'physical'});
    if(!candidateRun.ok)continue;
    assert.equal(candidateRun.ticks,oldRun.ticks);
    crossings.push({start:[x,z],end:[end.x,end.z],
      legs:oldRun.legs,originalTicks:oldRun.ticks,
      experimentalTicks:candidateRun.ticks});
   }
   if(crossings.length>=3)break;
  }
  if(crossings.length>=3)break;
 }
 assert.ok(checked.length>=1,'real positive-X M7 standing starts must be considered');
 assert.ok(crossings.length>=1,
   'physical historical/experimental positive-X Enchanted Plains cross must be genuine');
 assert.deepEqual(history.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>experimental.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED REAL M7 EAST-SIDE ENCHANTED PLAINS PHYSICAL CROSS '+JSON.stringify({
   checked,crossings,sourceOriginalStepPlayer:true,
   physicalIphoneNotTested:true
 }));
});

test('new physical source is opt-in and old Enchanted Desert stepPlayer search is bit-exact',()=>{
 const historic=new FourRegionWorld(7919,
  fourRegionProfile(7919,M7_ENVIRONMENT_GENERATOR));
 const opts={seed:7919,x:225,z:-592,targetBiome:'desert',radius:10,
   maxVisits:128,maxSteps:16,maxRoutes:3,
   maxEdgeAttempts:280,maxPhysicsTicks:8192,minDisplacement:4};
 const defaultResult=searchOriginalM7PhysicsAdmittedRoutes(historic,opts);
 const explicitOverlay=searchOriginalM7PhysicsAdmittedRoutes(historic,
   {...opts,groundMode:'overlay'});
 assert.deepEqual(defaultResult,explicitOverlay,
   'new opt-in original physical cap must preserve original overlay route results exactly');
 assert.equal(defaultResult.routes.length,3);
 assert.deepEqual(historic.save(),{schema:1,seed:7919,edits:[]});
 console.log('# ENCHANTED REAL M7 OLD DESERT DEFAULT UNCHANGED '+
   JSON.stringify({accepted:defaultResult.routes.length,
     visited:defaultResult.stats.visited,physicsTicks:defaultResult.stats.physicsTicks,
     exactOverlayDefaultParity:true}));
});

test('read-only original physical ground accessor respects original M7 mined support and placed obstruction edits',()=>{
 const at=[-273,-588],worldGround=old(),worldRoof=old();
 const a=originalM7PhysicalGroundCap(worldGround,...at);
 const b=originalM7PhysicalGroundCap(worldRoof,...at);
 assert.ok(a&&b);
 assert.equal(a.feet,b.feet);
 // Separate disposable original M7 instances: no real save or production
 // world is changed by this native test.
 assert.equal(worldGround.set(at[0],a.surface,at[1],0),true,
   'original M7 setter must author a real AIR edit to legacy grass');
 assert.equal(worldGround.get(at[0],a.surface,at[1]),0);
 assert.equal(originalM7PhysicalGroundCap(worldGround,...at),null,
   'an AIR edit to genuine original support must veto fallback standing');
 assert.equal(worldRoof.set(at[0],b.feet,at[1],3),true,
   'original M7 setter must author a real solid headroom edit');
 assert.equal(originalM7PhysicalGroundCap(worldRoof,...at),null,
   'a real original-world headroom obstruction must veto fallback standing');
 assert.ok(worldGround.edits.size>=1);
 assert.ok(worldRoof.edits.size>=1);
 const unmodified=old();
 assert.ok(originalM7PhysicalGroundCap(unmodified,...at));
 assert.deepEqual(unmodified.save(),{schema:1,seed,edits:[]});
 console.log('# ENCHANTED REAL M7 GROUND CAP PLAYER EDIT VETO '+JSON.stringify({
  source:at,baselineFeet:a.feet,groundAirEditRejected:true,
  overheadSolidEditRejected:true,originalUnmodified:true,
  syntheticCaveNotClaimed:true
 }));
});
