// Real original M7 candidate vs historical physics: continuous multi-step
// player journeys with diagonal movement and actual varying terrain.
// No teleports BETWEEN legs: one unmodified player object and stepPlayer.
// Filter routes only by what the historic original physics can traverse;
// new experimental leaves may not block them (unless deliberately solid bark).
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {collides,BODY_RADIUS,BODY_HEIGHT,BLOCK} from '../../src/voxel.mjs';
import {stepPlayer,GROUND_PROBE} from '../../src/physics.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

const seed=179, profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
const original=new FourRegionWorld(seed,profile);
const prototype=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
const sites=[
  {name:'starspire',x:-38,z:-525},
  {name:'moonwillow',x:-36,z:-499},
  {name:'ancient-giant',x:20,z:-525}
];
const patterns=[
  [[1,1],[1,0],[0,1]],
  [[-1,1],[-1,0],[0,1]],
  [[1,-1],[1,0],[0,-1]],
  [[-1,-1],[-1,0],[0,-1]],
  [[1,0],[1,1],[0,1]],
  [[-1,0],[-1,-1],[0,-1]],
  [[0,1],[-1,1],[-1,0]],
  [[0,-1],[1,-1],[1,0]]
];
const eps=1e-5;
function cap(x,z){
 const column=prototype._columnPlan(x,z);
 return column.size?Math.max(...column.keys()):null;
}
function bodyIntersectsBark(px,feet,pz){
 for(let x=Math.floor(px-BODY_RADIUS+eps);x<=Math.floor(px+BODY_RADIUS-eps);x++)
  for(let z=Math.floor(pz-BODY_RADIUS+eps);z<=Math.floor(pz+BODY_RADIUS-eps);z++)
   for(let y=Math.floor(feet+eps);y<=Math.floor(feet+BODY_HEIGHT-eps);y++)
    if(prototype.get(x,y,z)===G.aetherBark)return true;
 return false;
}
function barkAlongNodes(nodes){
 for(let i=1;i<nodes.length;i++){
  const a=nodes[i-1],b=nodes[i];
  const minY=Math.min(a.y,b.y)+1,maxY=Math.max(a.y,b.y)+1;
  for(let t=0;t<=1.0001;t+=.125){
   const px=a.x+.5+(b.x-a.x)*t,pz=a.z+.5+(b.z-a.z)*t;
   // Include all body heights between the two real physical caps so that
   // an intentional tree trunk cannot be mistaken for a leaf regression.
   for(let feet=minY;feet<=maxY;feet++){
    if(bodyIntersectsBark(px,feet,pz))return true;
   }
  }
 }
 return false;
}
function pathFor(x,z,pattern){
 const points=[{x,z,y:cap(x,z)}];
 for(const [dx,dz] of pattern){
  x+=dx;z+=dz;points.push({x,z,y:cap(x,z)});
 }
 if(points.some(p=>p.y===null||p.y>WORLD_MAX_Y-3))return null;
 const diffs=points.slice(1).map((p,i)=>p.y-points[i].y);
 if(diffs.some(d=>Math.abs(d)>1))return null;
 // Every route must have meaningful terrain variation as well as
 // genuine diagonal movement, with at least 3 connected player legs.
 if(!diffs.some(d=>d!==0))return null;
 if(!pattern.some(([dx,dz])=>dx!==0&&dz!==0))return null;
 return points;
}
function atStart(world,n){
 const px=n.x+.5,pz=n.z+.5,feet=n.y+1;
 return !collides(world,px,feet,pz)&&
   collides(world,px,feet-GROUND_PROBE,pz);
}
function actuallyWalk(world,nodes){
 const first=nodes[0];
 const p={x:first.x+.5,z:first.z+.5,feet:first.y+1,
   yaw:0,pitch:0,vX:0,vZ:0,vY:0,onGround:true,coyote:0,jumpBuffer:0};
 let ticks=0,wall=false,ceiling=false,stepped=0,legs=0;
 for(let i=1;i<nodes.length;i++){
  const target=nodes[i],tx=target.x+.5,tz=target.z+.5;
  let reached=false;
  for(let step=0;step<46;step++){
   // Steer toward the next real M7 point, retaining authentic horizontal
   // momentum, gravity and collision as a player would.
   p.yaw=Math.atan2(tx-p.x,tz-p.z);
   const report=stepPlayer(world,p,{forward:1,strafe:0,jump:false},.025);
   ticks++;wall ||= report.hitWall;
   ceiling ||= report.ceiling;
   if(report.stepped)stepped++;
   if(wall||ceiling||collides(world,p.x,p.feet,p.z))
    return {ok:false,wall,ceiling,ticks,legs,feet:p.feet};
   const distance=Math.hypot(p.x-tx,p.z-tz);
   if(distance<=.24){
    // Do not reset motion or position between legs.
    reached=true;legs++;break;
   }
  }
  if(!reached)return {ok:false,wall,ceiling,ticks,legs,feet:p.feet};
 }
 return {ok:true,wall,ceiling,stepped,ticks,legs,
   feet:p.feet,x:p.x,z:p.z,progress:legs};
}

test('real 3-leg uphill/downhill diagonal forest routes preserve original moving player access',()=>{
 const stats=[],totals={originalPass:0,prototypePass:0,upRoutes:0,
   downRoutes:0,mixedRoutes:0,diagonalLegs:0,attempted:0};
 for(const site of sites){
  const passed=[],counts={name:site.name,sourceWalkable:0,candidateWalkable:0};
  // Source-backed reproducible bounded discovery: original terrain columns,
  // genuine source cave/landmark reader, one original physics instance per
  // route and only nearby natural forest sites.
  outer:
  for(let x=site.x-6;x<=site.x+6;x++)for(let z=site.z-6;z<=site.z+6;z++)
   for(const pattern of patterns){
    if(passed.length>=3)break outer;
    const nodes=pathFor(x,z,pattern);
    if(!nodes||barkAlongNodes(nodes))continue;
    if(!nodes.every(n=>atStart(original,n)&&atStart(prototype,n)))continue;
    totals.attempted++;
    const baseline=actuallyWalk(original,nodes);
    if(!baseline.ok)continue;
    totals.originalPass++;counts.sourceWalkable++;
    const candidate=actuallyWalk(prototype,nodes);
    assert.equal(candidate.ok,true,
      'original continuous 3-leg source path blocked by experimental tree: '+
      JSON.stringify({site,nodes,baseline,candidate}));
    assert.equal(candidate.wall,false);
    assert.equal(candidate.ceiling,false);
    assert.equal(candidate.legs,3);
    assert.ok(Math.abs(candidate.feet-baseline.feet)<.15,
      'experimental canopy changed final original physics terrain elevation');
    counts.candidateWalkable++;totals.prototypePass++;
    const heights=nodes.slice(1).map((n,i)=>n.y-nodes[i].y);
    const up=heights.some(h=>h>0),down=heights.some(h=>h<0);
    if(up)totals.upRoutes++;
    if(down)totals.downRoutes++;
    if(up&&down)totals.mixedRoutes++;
    totals.diagonalLegs+=pattern.filter(([dx,dz])=>dx&&dz).length;
    passed.push({start:[x,z],heightDeltas:heights,
      diagonalLegs:pattern.filter(([dx,dz])=>dx&&dz).length,
      oldTicks:baseline.ticks,newTicks:candidate.ticks,
      oldFeet:+baseline.feet.toFixed(3),newFeet:+candidate.feet.toFixed(3)});
   }
  stats.push({...counts,passed});
 }
 assert.ok(totals.prototypePass>=3,
   'must finish a real multi-leg route beside each species, not just static AABBs');
 assert.ok(stats.every(v=>v.candidateWalkable>=1),
   'all three species need a fully navigable continuous diagonal M7 route');
 assert.ok(totals.upRoutes>=1&&totals.downRoutes>=1,
   'genuine hillside acceptance must include uphill AND downhill legs');
 assert.ok(totals.diagonalLegs>=3);
 assert.deepEqual(original.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED M7 CONTINUOUS DIAGONAL HILLSIDE '+JSON.stringify({
  seed,stats,totals,realStepPlayer:true,
  playerNotTeleportedBetweenLegs:true,
  physicalIphone:false
 }));
});

test('same continuous original M7 four-leg loop climbs AND descends around a diagonal forest ridge',()=>{
 const cardinals=[[1,0],[-1,0],[0,1],[0,-1]];
 const diagonals=[[1,1],[1,-1],[-1,1],[-1,-1]];
 const loops=[];
 for(const a of cardinals)for(const b of diagonals){
   loops.push([a,b,[-a[0],-a[1]],[-b[0],-b[1]]]);
   loops.push([b,a,[-b[0],-b[1]],[-a[0],-a[1]]]);
 }
 const accepted=[],totals={attempted:0,historicPass:0,prototypePass:0,
   uphillLegs:0,downhillLegs:0,diagonalLegs:0};
 for(const site of sites){
   let example=null;
   outer:
   for(let x=site.x-8;x<=site.x+8;x++)
     for(let z=site.z-8;z<=site.z+8;z++)
       for(const steps of loops){
         const nodes=pathFor(x,z,steps);
         if(!nodes||barkAlongNodes(nodes))continue;
         const elevations=nodes.slice(1).map((n,i)=>n.y-nodes[i].y);
         if(!elevations.some(d=>d>0)||!elevations.some(d=>d<0))
           continue; // real combined ascent AND descent, not unrelated routes
         if(nodes.at(-1).x!==x||nodes.at(-1).z!==z)
           throw Error('Non-closed test route; expected one continuous loop');
         if(!nodes.every(n=>atStart(original,n)&&atStart(prototype,n)))
           continue;
         totals.attempted++;
         const baseline=actuallyWalk(original,nodes);
         if(!baseline.ok)continue; // physically original-source traversable only
         totals.historicPass++;
         const experimental=actuallyWalk(prototype,nodes);
         assert.equal(experimental.ok,true,
           'experimental enchanted foliage closed an existing mixed uphill/downhill route '+
           JSON.stringify({site,nodes,elevations,baseline,experimental}));
         assert.equal(experimental.wall,false);
         assert.equal(experimental.ceiling,false);
         assert.equal(experimental.legs,4);
         assert.ok(Math.abs(experimental.feet-baseline.feet)<.15,
           'same original terrain must yield the same final moving-player feet');
         totals.prototypePass++;
         totals.uphillLegs+=elevations.filter(d=>d>0).length;
         totals.downhillLegs+=elevations.filter(d=>d<0).length;
         totals.diagonalLegs+=steps.filter(([dx,dz])=>dx&&dz).length;
         example={species:site.name,start:[x,z],steps,elevations,
           oldTicks:baseline.ticks,newTicks:experimental.ticks,
           finalFeet:+experimental.feet.toFixed(3)};
         break outer;
       }
   accepted.push(example);
 }
 assert.ok(totals.prototypePass>=1,
   'at least one ORIGINAL physically traversed mixed-height diagonal ridge loop is required');
 assert.ok(totals.uphillLegs>=1&&totals.downhillLegs>=1,
   'the SAME continuous native player path must climb and descend');
 assert.ok(totals.diagonalLegs>=2,
   'two genuine diagonal legs must occur in the same 4-leg circuit');
 assert.deepEqual(original.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED M7 MIXED UP DOWN DIAGONAL CONTINUOUS LOOP '+JSON.stringify({
   seed,totals,accepted,unchangedOriginalStepPlayer:true,
   noTeleportBetweenLegs:true,physicalIphone:false
 }));
});
