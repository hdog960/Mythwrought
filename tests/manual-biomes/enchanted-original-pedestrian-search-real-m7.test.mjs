// Bounded ORIGINAL M7 physical source pathfinding acceptance.
// Graph only proposes authentic terrain-grounded paths; the unchanged
// real stepPlayer must walk the entire route without teleporting. Tested
// historically before opt-in forest. Seed -88 and other biome pairs are
// reported as evidence, not assumed to have safe paths.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {stepPlayer,GROUND_PROBE} from '../../src/physics.mjs';
import {BLOCK,collides,BODY_HEIGHT,BODY_RADIUS,chunkCoord} from '../../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {searchOriginalM7PedestrianBorder,originalM7PedestrianCap,
  ENCHANTED_ORIGINAL_PATH_MAX_RADIUS,
  ENCHANTED_ORIGINAL_PATH_MAX_VISITS}
  from '../../src/manual-biomes/enchanted-original-pedestrian-search.mjs';

const sourceBiome=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const seeds=[179,7919,-88];
const zScans=[-592,-560,-528,-516,-504,-480,-448,-416,-384,
  -352,-320,-288,-256,-224,-192,-160,-128,-64,0,64,128,192,256];
function boundaries(seed){
 const result=[];
 for(const z of zScans){
  let old=sourceBiome(-640,z,seed);
  for(let x=-632;x<=640;x+=8){
   const cur=sourceBiome(x,z,seed);
   if(cur!==old&&[cur,old].includes('enchanted')){
    let left=x-8,right=x;
    while(right-left>1){
     const mid=Math.floor((left+right)/2);
     if(sourceBiome(mid,z,seed)===old)left=mid;
     else right=mid;
    }
    result.push({x:right,z,from:old,to:sourceBiome(right,z,seed)});
   }
   old=cur;
  }
 }
 return result;
}
function walkGenuineOriginalPlayer(world,nodes){
 const first=nodes[0];
 const player={x:first.x+.5,z:first.z+.5,feet:first.feet,yaw:0,pitch:0,
   vX:0,vY:0,vZ:0,onGround:true,coyote:0,jumpBuffer:0};
 let ticks=0,climbed=0,descended=0,diagonal=0;
 for(let i=1;i<nodes.length;i++){
  const prev=nodes[i-1],next=nodes[i];
  if(prev.x!==next.x&&prev.z!==next.z)diagonal++;
  if(next.feet>prev.feet)climbed++;
  if(next.feet<prev.feet)descended++;
  const tx=next.x+.5,tz=next.z+.5;
  let reached=false;
  for(let k=0;k<48;k++){
   player.yaw=Math.atan2(tx-player.x,tz-player.z);
   const physical=stepPlayer(world,player,
     {forward:1,strafe:0,jump:false},.025);
   ticks++;
   if(physical.hitWall||physical.ceiling||
      collides(world,player.x,player.feet,player.z))
    return {ok:false,reason:'wall/ceiling/body',legs:i-1,ticks};
   if(Math.hypot(player.x-tx,player.z-tz)<=.24){
    reached=true;break;
   }
  }
  if(!reached)return {ok:false,reason:'real physics cannot reach leg',
    legs:i-1,ticks};
 }
 return {ok:true,legs:nodes.length-1,ticks,
   climbed,descended,diagonal,finalFeet:+player.feet.toFixed(3)};
}
function candidateBarkAcrossRealPlayer(world,nodes){
 // Structural bark is deliberately solid. Exclude those routes from the
 // experimental *leaf clearance* obligation rather than deleting bark.
 for(let j=0;j<nodes.length;j++){
  const prev=nodes[Math.max(0,j-1)],n=nodes[j];
  for(const t of [0,.25,.5,.75,1]){
   const x=prev.x+.5+(n.x-prev.x)*t;
   const z=prev.z+.5+(n.z-prev.z)*t;
   const feet=Math.min(prev.feet,n.feet);
   for(let a=Math.floor(x-BODY_RADIUS);a<=Math.floor(x+BODY_RADIUS);a++)
    for(let c=Math.floor(z-BODY_RADIUS);c<=Math.floor(z+BODY_RADIUS);c++)
     for(let b=Math.floor(feet);b<=Math.floor(Math.max(prev.feet,n.feet)+BODY_HEIGHT);b++)
      if(world.get(a,b,c)===G.aetherBark)return true;
  }
 }
 return false;
}
const newWorld=(seed,experimental=false)=>
 new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
   {experimentalEnchantedTrees:experimental});

test('real original M7 cap and bounded search never invent terrain or exceed search limits',()=>{
 const world=newWorld(179);
 const source=originalM7PedestrianCap(world,268,-600);
 assert.ok(source,'an already-certified original M7 walking witness must still exist');
 assert.equal(source.x,268);
 assert.equal(source.z,-600);
 assert.ok(source.surface>=3);
 assert.equal(world._columnPlan(source.x,source.z).get(source.surface+1)??
   world._environmentBaseline(source.x,source.surface+1,source.z),BLOCK.AIR);
 assert.equal(collides(world,source.x+.5,source.feet,source.z+.5),false);
 assert.equal(collides(world,source.x+.5,source.feet-GROUND_PROBE,source.z+.5),true);
 assert.throws(()=>searchOriginalM7PedestrianBorder(world,{
   x:268,z:-600,radius:ENCHANTED_ORIGINAL_PATH_MAX_RADIUS+1
 }),/Invalid original M7/);
 assert.throws(()=>searchOriginalM7PedestrianBorder(world,{
   x:268,z:-600,maxVisits:ENCHANTED_ORIGINAL_PATH_MAX_VISITS+1
 }),/Invalid original M7/);
 const sample=searchOriginalM7PedestrianBorder(world,{
   x:268,z:-600,targetBiome:'snow',radius:12,maxVisits:240,maxRoutes:4
 });
 assert.ok(sample.stats.visited<=240);
 assert.ok(sample.routes.length<=4);
 assert.ok(sample.stats.supported<=240*8);
 for(const path of sample.routes){
   assert.equal(path[0].x,268);
   assert.equal(path[0].z,-600);
   assert.equal(sourceBiome(path.at(-1).x,path.at(-1).z,179),'snow');
   assert.ok(Math.hypot(path.at(-1).x-268,path.at(-1).z+600)>=5);
   for(let i=1;i<path.length;i++){
    const a=path[i-1],b=path[i];
    assert.ok(Math.max(Math.abs(b.x-a.x),Math.abs(b.z-a.z))===1);
    assert.ok(Math.abs(b.feet-a.feet)<=1);
   }
 }
 assert.deepEqual(world.save(),{schema:1,seed:179,edits:[]});
 console.log('# ENCHANTED ORIGINAL M7 BOUNDED PATH GRAPH '+JSON.stringify({
   realSource:source,stats:sample.stats,proposed:sample.routes.length,
   graphOnlyNotYetPhysicsApproved:true
 }));
});

test('bounded terrain graph makes no false walking claims on real Enchanted climate borders across three seeds',()=>{
 const audit=[],approved=[],checkedPairs=new Set();
 for(const seed of seeds){
  const old=newWorld(seed),prototype=newWorld(seed,true);
  const bounds=boundaries(seed);
  assert.ok(bounds.length>=1);
  // Deliberately prioritize unexplored pairs before previously accepted
  // Snow corridors; same original-world pathfinder, never fake terrain.
  const ordered=[...bounds].sort((a,b)=>
    Number(a.from==='snow'||a.to==='snow')-
    Number(b.from==='snow'||b.to==='snow'));
  const stats={seed,foundBorders:bounds.length,startsConsidered:0,
    supportedStarts:0,graphVisits:0,graphProposals:0,
    historicPhysicsPass:0,candidatePhysicsPass:0,
    intentionalBarkExclusions:0,oldPhysicsRejects:0,
    sourcePairs:new Set(),completedPairs:new Set()};
  let acceptedForSeed=0;
  outer:
  for(const b of ordered){
    for(const side of [-1,1]){
     const originBiome=side===-1?b.from:b.to;
     const targetBiome=side===-1?b.to:b.from;
     for(const dz of [0,-3,3,-6,6]){
      if(stats.startsConsidered>=36)break outer;
      const startX=b.x+side*5,startZ=b.z+dz;
      if(sourceBiome(startX,startZ,seed)!==originBiome)continue;
      stats.startsConsidered++;
      const cap=originalM7PedestrianCap(old,startX,startZ);
      if(!cap)continue;
      stats.supportedStarts++;
      stats.sourcePairs.add([originBiome,targetBiome].sort().join('/'));
      const search=searchOriginalM7PedestrianBorder(old,{
        seed,x:startX,z:startZ,targetBiome,radius:11,
        maxVisits:192,maxSteps:24,maxRoutes:4,minDisplacement:5
      });
      stats.graphVisits+=search.stats.visited;
      stats.graphProposals+=search.routes.length;
      for(const route of search.routes){
       if(candidateBarkAcrossRealPlayer(prototype,route)){
         stats.intentionalBarkExclusions++;continue;
       }
       const historical=walkGenuineOriginalPlayer(old,route);
       if(!historical.ok){stats.oldPhysicsRejects++;continue;}
       stats.historicPhysicsPass++;
       const candidate=walkGenuineOriginalPlayer(prototype,route);
       assert.equal(candidate.ok,true,
        'new candidate leaves interrupted a source-authentic old-world walk '+
        JSON.stringify({seed,from:originBiome,to:targetBiome,
          source:[startX,startZ],route,old:historical,candidate}));
       assert.equal(candidate.legs,historical.legs);
       assert.ok(Math.abs(candidate.finalFeet-historical.finalFeet)<=.15);
       stats.candidatePhysicsPass++;
       const pair=[originBiome,targetBiome].sort().join('/');
       stats.completedPairs.add(pair);
       checkedPairs.add(pair);
       approved.push({seed,pair,start:[startX,startZ],
         end:[route.at(-1).x,route.at(-1).z],legs:historical.legs,
         oldTicks:historical.ticks,candidateTicks:candidate.ticks,
         diagonals:historical.diagonal,climbed:historical.climbed,
         descended:historical.descended,
         crossedChunk:chunkCoord(route[0].x)!==chunkCoord(route.at(-1).x)||
          chunkCoord(route[0].z)!==chunkCoord(route.at(-1).z)});
       acceptedForSeed++;break;
      }
      if(acceptedForSeed>=2)break outer;
     }
    }
  }
  audit.push({...stats,sourcePairs:[...stats.sourcePairs],
    completedPairs:[...stats.completedPairs]});
  assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
  assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
 }
 assert.ok(audit.every(v=>v.foundBorders>=1));
 assert.ok(audit.every(v=>v.graphVisits<=36*192));
 assert.ok(audit.some(v=>v.supportedStarts>0),
  'source-grounded search must inspect genuine original standing cells');
 // Do not invent a seed -88 or non-Snow pass if historic physics could
 // not traverse it. The exact audit is an explicit coverage result.
 console.log('# ENCHANTED ORIGINAL M7 BOUNDED GRAPH PHYSICS SURVEY '+JSON.stringify({
   audit,approved,approvedPairs:[...checkedPairs],
   seedMinus88Approved:approved.filter(v=>v.seed===-88).length,
   historicalPhysicsRequired:true,unapprovedPairsNotCertified:true,
   sourceTerrainNeverAltered:true,physicalIphoneNotTested:true
 }));
});
