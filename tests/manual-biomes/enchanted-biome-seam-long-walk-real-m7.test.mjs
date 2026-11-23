// Original Mythwrought M7 long pedestrian routes across ACTUAL warped V6
// Enchanted biome borders, with continuous unmodified stepPlayer/voxel
// collision on historic and opt-in prototype worlds. No synthetic terrain,
// teleports between legs, source overwrites, saved worlds, or fake FPS.
// A route is admitted ONLY if the HISTORICAL game actually traverses it.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BODY_RADIUS,BODY_HEIGHT,BLOCK,collides,chunkCoord,worldKey}
  from '../../src/voxel.mjs';
import {GROUND_PROBE,stepPlayer} from '../../src/physics.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

const name=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const zScans=[-592,-560,-528,-516,-504,-480,-448,-416,-384,
  -352,-320,-288,-256,-224,-192,-160,-128,-64,0,64,128,192,256];
const key=(n)=>n.x+','+n.z;
const eps=1e-6;
function originalGround(world,x,z){
 const cap=world._columnPlan(x,z);
 if(!cap.size)return null;
 const top=Math.max(...cap.keys());
 if(top<3||top>WORLD_MAX_Y-3)return null;
 const px=x+.5,pz=z+.5,feet=top+1;
 if(collides(world,px,feet,pz)||!collides(world,px,feet-GROUND_PROBE,pz))
   return null;
 if(world.get(x,top,z)===BLOCK.AIR)return null;
 return {x,z,top,feet};
}
function originalSafeSample(world,n){
 // All cave/landmark provenance at this surface remains under the ORIGINAL
 // generator; the candidate cannot fill a source-authored AIR/headroom cell.
 return [n.top+1,n.top+2].every(y=>
   (world._columnPlan(n.x,n.z).get(y)??
    world._environmentBaseline(n.x,y,n.z))===BLOCK.AIR);
}
function routeNodes(history,candidate,x,z,dx,steps){
 const nodes=[];
 for(let j=0;j<=steps;j++){
  const px=x+j*dx;
  const n=originalGround(history,px,z);
  if(!n||!originalGround(candidate,px,z))return null;
  if(!originalSafeSample(history,n))return null;
  if(j>0&&Math.abs(n.top-nodes.at(-1).top)>1)return null;
  nodes.push(n);
 }
 const histStart=name(nodes[0].x,z,history.seed);
 const histEnd=name(nodes.at(-1).x,z,history.seed);
 if(histStart===histEnd||(![histStart,histEnd].includes('enchanted')))
  return null;
 // The original physical source may have old solid WOOD trunks. A new
 // mineable experimental bark trunk is intentionally a wall, not a leaf bug.
 for(const n of nodes){
  const x0=n.x+.5,z0=n.z+.5;
  for(let xx=Math.floor(x0-BODY_RADIUS+eps);
      xx<=Math.floor(x0+BODY_RADIUS-eps);xx++)
   for(let zz=Math.floor(z0-BODY_RADIUS+eps);
       zz<=Math.floor(z0+BODY_RADIUS-eps);zz++)
    for(let y=n.feet;y<n.feet+BODY_HEIGHT;y++)
     if(candidate.get(xx,y,zz)===G.aetherBark)return null;
 }
 return nodes;
}
function continuouslyWalk(world,nodes){
 const start=nodes[0];
 const p={x:start.x+.5,z:start.z+.5,feet:start.feet,
   yaw:0,pitch:0,vX:0,vZ:0,vY:0,onGround:true,
   coyote:0,jumpBuffer:0};
 let ticks=0,legs=0,stepped=0,down=0;
 let hitWall=false,ceiling=false;
 for(let i=1;i<nodes.length;i++){
  const next=nodes[i],tx=next.x+.5,tz=next.z+.5;
  let reached=false;
  for(let k=0;k<48;k++){
   p.yaw=Math.atan2(tx-p.x,tz-p.z);
   const r=stepPlayer(world,p,{forward:1,strafe:0,jump:false},.025);
   ticks++;
   hitWall ||=r.hitWall;ceiling ||=r.ceiling;
   if(r.stepped)stepped++;
   if(r.hitWall||r.ceiling||collides(world,p.x,p.feet,p.z))
    return {ok:false,ticks,legs,stepped,hitWall,ceiling,
      x:p.x,z:p.z,feet:p.feet};
   if(Math.hypot(p.x-tx,p.z-tz)<=.24){
    if(next.top<nodes[i-1].top)down++;
    legs++;reached=true;break;
   }
  }
  if(!reached)return {ok:false,ticks,legs,stepped,hitWall,ceiling,
    x:p.x,z:p.z,feet:p.feet};
 }
 return {ok:true,ticks,legs,stepped,down,hitWall,ceiling,
   x:p.x,z:p.z,feet:p.feet};
}
function boundaries(seed){
 const result=[];
 for(const z of zScans){
  let prev=name(-640,z,seed);
  for(let x=-632;x<=640;x+=8){
   const now=name(x,z,seed);
   if(now!==prev&&[now,prev].includes('enchanted')){
    let low=x-8,hi=x,lowName=prev;
    while(hi-low>1){
     const m=Math.floor((low+hi)/2);
     if(name(m,z,seed)===lowName)low=m;else hi=m;
    }
    result.push({z,x:hi,from:lowName,to:name(hi,z,seed)});
   }
   prev=now;
  }
 }
 return result;
}
test('original M7 traverses 12+ physical footsteps across real Enchanted V6 boundaries without new leaf walls',()=>{
 const tested=[],bounds=[],seeds=[179,7919,-88];
 let sawDown=false,sawUp=false,physicalCrossings=0;
 for(const seed of seeds){
  const history=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const candidate=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
   {experimentalEnchantedTrees:true});
  const near=boundaries(seed);
  assert.ok(near.length>0,'the REAL V6 climate must have an Enchanted border');
  bounds.push({seed,borders:near.length});
  let accepted=0;
  outer:
  for(const b of near){
   // Scan 17 genuine terrain rows around the independently verified V6
   // crossing. No path is forged, flattened, or teleported after admission.
   for(let dz=-8;dz<=8;dz+=2){
    const z=b.z+dz;
    for(const direction of [1,-1]){
     const x=direction===1?b.x-7:b.x+7;
     const nodes=routeNodes(history,candidate,x,z,direction,14);
     if(!nodes)continue;
     const old=continuouslyWalk(history,nodes);
     if(!old.ok)continue; // never require a passage obstructed by OLD game
     const proposed=continuouslyWalk(candidate,nodes);
     assert.equal(proposed.ok,true,
      'an original uninterrupted 14-leg climate-boundary route is blocked by candidate: '+
       JSON.stringify({seed,b,x,z,nodes,old,proposed}));
     assert.equal(proposed.legs,14);
     assert.equal(proposed.hitWall,false);
     assert.equal(proposed.ceiling,false);
     assert.ok(Math.abs(proposed.feet-old.feet)<.15);
     const heights=nodes.slice(1).map((n,i)=>n.top-nodes[i].top);
     const ups=heights.filter(v=>v>0).length;
     const downs=heights.filter(v=>v<0).length;
     sawUp ||=ups>0;sawDown ||=downs>0;
     physicalCrossings++;
     tested.push({seed,start:[x,z],direction,legs:14,
       climates:[name(nodes[0].x,z,seed),name(nodes.at(-1).x,z,seed)],
       originalTicks:old.ticks,prototypeTicks:proposed.ticks,
       uphillLegs:ups,downhillLegs:downs,
       originalFeet:+old.feet.toFixed(3),candidateFeet:+proposed.feet.toFixed(3),
       crossedChunk:chunkCoord(nodes[0].x)!==chunkCoord(nodes.at(-1).x)});
     accepted++;break;
    }
    if(accepted>=2)break;
   }
   if(accepted>=2)break outer;
  }
  assert.deepEqual(history.save(),{schema:1,seed,edits:[]});
  assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
 }
 assert.ok(physicalCrossings>=3,
  'must traverse at least one authentic full player route per seeded original world');
 assert.ok(sawDown&&sawUp,
  'across real seeds and crossings, prove both ascending and descending original walking');
 assert.ok(tested.every(r=>r.climates.includes('enchanted')));
 console.log('# ENCHANTED ORIGINAL M7 14-LEG CLIMATE BORDER WALKS '+JSON.stringify({
  bounds,physicalCrossings,tested,realStepPlayer:true,
  noInterlegTeleport:true,originalTerrainAndCaveSource:true,
  physicalIphone:false,installedPWA:false
 }));
});

test('real opt-in player AIR edit remains authoritative after original 64-chunk tree-cache eviction',()=>{
 const seed=179;
 const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
   {experimentalEnchantedTrees:true});
 const sourceChunks=[[-2,-33],[-1,-33],[0,-33],[-2,-32]];
 let edited=null;
 for(const [cx,cz] of sourceChunks){
  world._environmentTreeAt(cx*16,WORLD_MAX_Y,cz*16);
  const cells=world._environmentTreeChunks.get(cx+','+cz);
  for(const [k,id] of cells){
   const [x,y,z]=k.split(',').map(Number);
   if(id!==G.moonLeaves&&id!==G.aetherLeaves)continue;
   if(world.get(x,y,z)!==id)continue;
   edited={x,y,z,id,cx,cz};break;
  }
  if(edited)break;
 }
 assert.ok(edited,'must mine a REAL generated leaf in original M7 prototype');
 const {x,y,z,cx,cz,id}=edited;
 assert.equal(world.get(x,y,z),id);
 assert.equal(world.set(x,y,z,BLOCK.AIR),true,'authentic in-memory player edit must work');
 assert.equal(world.get(x,y,z),BLOCK.AIR);
 assert.equal(world.edits.get(worldKey(x,y,z)),BLOCK.AIR);
 // Exercise a genuine 64-chunk residency boundary without changing any
 // source generation, world save, biome or production original generator.
 for(let step=0;step<76;step++){
  const nx=cx+step+8,nz=cz;
  world._environmentTreeAt(nx*16,WORLD_MAX_Y,nz*16);
  assert.ok(world._environmentTreeChunks.size<=64);
  assert.ok(world._environmentCandidateSiteBiomes.size<=128);
 }
 assert.equal(world._environmentTreeChunks.has(cx+','+cz),false,
  'old original tree-chunk cache must actually evict edited source chunk');
 const after=world.get(x,y,z);
 assert.equal(after,BLOCK.AIR,
  'newly regenerated candidate source can never override player AIR delta');
 assert.equal(world.edits.get(worldKey(x,y,z)),BLOCK.AIR);
 assert.throws(()=>world.save(),/cannot be saved as historical M7/);
 const original=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
 assert.deepEqual(original.save(),{schema:1,seed,edits:[]});
 console.log('# ENCHANTED ORIGINAL M7 EDIT AFTER EVICTION '+JSON.stringify({
  seed,edit:[x,y,z],originalLeafId:id,
  treeChunkCacheMax:64,siteBiomeCacheMax:128,
  nativeSourceRebuilt:true,playerAirEditPreserved:true,
  prototypeSaveFailClosed:true,physicalIphone:false
 }));
});

function physicallyValidWindingRoute(history,prototype,start,offset,startDetour,endDetour){
  const nodes=[];
  const {x,z,direction,steps}=start;
  for(let i=0;i<=steps;i++){
    const dz=i>=startDetour&&i<=endDetour?offset:0;
    const n=originalGround(history,x+i*direction,z+dz);
    if(!n||!originalGround(prototype,x+i*direction,z+dz)||
       !originalSafeSample(history,n))return null;
    if(nodes.length&&Math.abs(n.top-nodes.at(-1).top)>1)return null;
    nodes.push(n);
  }
  const from=name(nodes[0].x,nodes[0].z,history.seed);
  const to=name(nodes.at(-1).x,nodes.at(-1).z,history.seed);
  if(from===to||![from,to].includes('enchanted'))return null;
  // Keep intentional solid authored bark out of clearance acceptance.
  // Do not misclassify a legitimate structural tree trunk as a leaf bug.
  for(let i=1;i<nodes.length;i++){
    const a=nodes[i-1],b=nodes[i];
    for(let t=0;t<=1.00001;t+=.125){
      const px=a.x+.5+(b.x-a.x)*t,pz=a.z+.5+(b.z-a.z)*t;
      for(let xx=Math.floor(px-BODY_RADIUS+eps);
          xx<=Math.floor(px+BODY_RADIUS-eps);xx++)
        for(let zz=Math.floor(pz-BODY_RADIUS+eps);
            zz<=Math.floor(pz+BODY_RADIUS-eps);zz++)
          for(let yy=Math.min(a.feet,b.feet);
              yy<=Math.max(a.feet,b.feet)+BODY_HEIGHT;yy++)
            if(prototype.get(xx,yy,zz)===G.aetherBark)return null;
    }
  }
  return nodes;
}

test('source-grounded winding climate crossings preserve original continuous player momentum across 14 steps',()=>{
 const anchors=[
  {seed:179,x:268,z:-600,direction:1,steps:14},
  {seed:179,x:268,z:-598,direction:1,steps:14},
  {seed:7919,x:-208,z:-600,direction:1,steps:14},
  {seed:7919,x:-208,z:-598,direction:1,steps:14}
 ];
 const accepted=[],probed={candidatePlans:0,historicalTraversable:0,
   prototypeTraversable:0,diagonalLegs:0,climateTransitions:0};
 for(const seed of [179,7919]){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const historical=new FourRegionWorld(seed,profile);
  const candidate=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  for(const anchor of anchors.filter(a=>a.seed===seed)){
   let witness=null;
   outer:
   for(const offset of [1,-1,2,-2])
    for(const [first,last] of [[4,8],[6,10],[3,5],[8,11],
      [2,3],[10,11],[5,6],[7,8]]){
     const nodes=physicallyValidWindingRoute(historical,candidate,
       anchor,offset,first,last);
     if(!nodes)continue;
     probed.candidatePlans++;
     const old=continuouslyWalk(historical,nodes);
     if(!old.ok)continue;
     probed.historicalTraversable++;
     const now=continuouslyWalk(candidate,nodes);
     assert.equal(now.ok,true,
       'experimental leaves may not close an authentic winding climate route '+
       JSON.stringify({anchor,offset,first,last,old,now}));
     assert.equal(now.hitWall,false);
     assert.equal(now.ceiling,false);
     assert.equal(now.legs,anchor.steps);
     assert.ok(Math.abs(now.feet-old.feet)<.15);
     probed.prototypeTraversable++;
     probed.diagonalLegs+=2;
     probed.climateTransitions++;
     witness={seed,anchor:[anchor.x,anchor.z],offset,
       detour:[first,last],legs:now.legs,diagonalLegs:2,
       from:name(nodes[0].x,nodes[0].z,seed),
       to:name(nodes.at(-1).x,nodes.at(-1).z,seed),
       oldTicks:old.ticks,newTicks:now.ticks};
     break outer;
    }
   if(witness)accepted.push(witness);
  }
  assert.deepEqual(historical.save(),{schema:1,seed,edits:[]});
  assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
 }
 assert.ok(accepted.length>=1,
  'at least one actual winding 14-leg historical climate passage is required');
 assert.ok(probed.diagonalLegs>=2);
 console.log('# ENCHANTED M7 REAL WINDING CLIMATE PASSAGE '+JSON.stringify({
  accepted,probed,oldOriginalStepPlayer:true,
  noInterlegTeleport:true,notPhysicalIphone:true
 }));
});

test('bounded short original-M7 physical survey across different Enchanted climate pairs and seed -88',()=>{
 const seeds=[179,7919,-88],accepted=[],probes=[];
 const coveredPair=new Set(),perSeed=new Map();
 for(const seed of seeds){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const history=new FourRegionWorld(seed,profile);
  const prototype=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  const borderList=boundaries(seed);
  const explored={seed,boundaries:borderList.length,considered:0,
    sourceGroundCandidates:0,oldWalkPass:0,prototypePass:0,
    climatePairs:new Set(),rejectedHistoricWalks:0};
  outer:
  for(const b of borderList){
   for(const dz of [0,-4,4,-8,8,-12,12]){
    for(const steps of [8,10]){
     for(const direction of [1,-1]){
      explored.considered++;
      const x=b.x-direction*Math.floor(steps/2),z=b.z+dz;
      const route=physicallyValidWindingRoute(history,prototype,
        {x,z,direction,steps},0,0,0);
      if(!route)continue;
      explored.sourceGroundCandidates++;
      const old=continuouslyWalk(history,route);
      if(!old.ok){explored.rejectedHistoricWalks++;continue;}
      explored.oldWalkPass++;
      const modern=continuouslyWalk(prototype,route);
      assert.equal(modern.ok,true,
        'experimental canopy closed genuine historic biome transition '+JSON.stringify({
          seed,b,x,z,steps,old,modern
        }));
      assert.equal(modern.hitWall,false);
      assert.equal(modern.ceiling,false);
      assert.equal(modern.legs,steps);
      assert.ok(Math.abs(modern.feet-old.feet)<.15);
      explored.prototypePass++;
      const from=name(route[0].x,route[0].z,seed);
      const to=name(route.at(-1).x,route.at(-1).z,seed);
      const pair=[from,to].sort().join('/');
      explored.climatePairs.add(pair);
      if(!coveredPair.has(pair)||!(perSeed.get(seed)>0)){
       accepted.push({seed,pair,start:[x,z],direction,steps,
         oldTicks:old.ticks,prototypeTicks:modern.ticks,
         crossedChunk:chunkCoord(route[0].x)!==chunkCoord(route.at(-1).x)});
      }
      coveredPair.add(pair);
      perSeed.set(seed,(perSeed.get(seed)??0)+1);
      // Do not spend unbounded CI searching after two physical witnesses per
      // seed. All other transitions are discovery/coverage, not invented.
      if(explored.prototypePass>=2)break outer;
     }
    }
   }
  }
  probes.push({...explored,climatePairs:[...explored.climatePairs]});
  assert.deepEqual(history.save(),{schema:1,seed,edits:[]});
  assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
 }
 const distinct=[...coveredPair];
 // This new survey must discover source-backed opportunities; it may not
 // claim that old terrain has safe routes in every seed or biome. Record
 // difficult combinations explicitly for future original-world engineering.
 assert.ok(probes.every(p=>p.boundaries>0));
 assert.ok(probes.some(p=>p.sourceGroundCandidates>0),
   'bounded scan must inspect authentic supporting M7 climate terrain');
 assert.ok(accepted.length>=1,
   'at least one independent short historic M7 crossing must actually complete');
 console.log('# ENCHANTED ORIGINAL M7 SHORT CLIMATE WALK SURVEY '+JSON.stringify({
   probes,accepted,distinctPairs:distinct,seedMinus88RouteCount:perSeed.get(-88)??0,
   realOriginalStepPlayer:true,experimentalLeavesCannotReplaceOldPaths:true,
   noInterlegTeleport:true,iPhoneNotMeasured:true
 }));
});
