// Original Mythwrought physics vs real M7 terrain on genuine one-block
// uphill and downhill routes beside source-authentic Phase2 tree sites.
// NO mock walking, synthetic flat terrain, physics overrides, save writes,
// gameplay source movement changes, browser, or physical iPhone claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK,BODY_HEIGHT,BODY_RADIUS,collides}
  from '../../src/voxel.mjs';
import {stepPlayer,STEP_HEIGHT,GROUND_PROBE} from '../../src/physics.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

const seed=179;
const treeSites=[
  {species:'starspire',x:-38,z:-525},
  {species:'moonwillow',x:-36,z:-499},
  {species:'ancient-giant',x:20,z:-525}
];
const dirs=[
  [1,0,Math.PI/2],[-1,0,-Math.PI/2],
  [0,1,0],[0,-1,Math.PI]
];
const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
const old=new FourRegionWorld(seed,profile);
const prototype=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
function cap(x,z){
  const m=prototype._columnPlan(x,z);
  return m.size?Math.max(...m.keys()):null;
}
function supported(world,x,z,feet){
  return !collides(world,x+.5,feet,z+.5)&&
    collides(world,x+.5,feet-GROUND_PROBE,z+.5);
}
function barkOnBodyRoute(x,z,feetA,feetB,dx,dz){
  const minFeet=Math.min(feetA,feetB),maxFeet=Math.max(feetA,feetB);
  for(const t of [0,.2,.4,.6,.8,1]){
    const px=x+.5+dx*t,pz=z+.5+dz*t;
    for(let bx=Math.floor(px-BODY_RADIUS+1e-5);bx<=Math.floor(px+BODY_RADIUS-1e-5);bx++)
      for(let bz=Math.floor(pz-BODY_RADIUS+1e-5);bz<=Math.floor(pz+BODY_RADIUS-1e-5);bz++)
        for(let by=Math.floor(minFeet);by<=Math.ceil(maxFeet+BODY_HEIGHT);by++)
          if(prototype.get(bx,by,bz)===G.aetherBark)return true;
  }
  return false;
}
function walk(world,x,z,feet,dx,dz,yaw){
  const p={x:x+.5,z:z+.5,feet,yaw,pitch:0,
    vX:0,vZ:0,vY:0,onGround:true,coyote:0,jumpBuffer:0};
  let wall=false,stepped=false,ceiling=false;
  for(let tick=0;tick<18;tick++){
    const out=stepPlayer(world,p,{forward:1,strafe:0,jump:false},.025);
    wall ||= out.hitWall;
    stepped ||= out.stepped;
    ceiling ||= out.ceiling;
    const progress=(p.x-(x+.5))*dx+(p.z-(z+.5))*dz;
    // Original physics has acceleration; stop at the first meaningful
    // entry into the adjacent block to avoid probing unrelated third cells.
    if(progress>=.72||wall)break;
  }
  return {progress:(p.x-(x+.5))*dx+(p.z-(z+.5))*dz,
    wall,stepped,ceiling,feet:p.feet,position:[p.x,p.z],
    collision:collides(world,p.x,p.feet,p.z)};
}

test('actual downhill and one-step uphill original M7 walking remains viable after candidate canopies',()=>{
  assert.equal(STEP_HEIGHT,1.01);
  assert.equal(BODY_HEIGHT,1.78);
  const routeStats=[], totals={up:0,down:0,compared:0,referenceWalkable:0};
  for(const site of treeSites){
    const per={up:0,down:0,species:site.species},proof=[];
    // Probe genuine original game terrain on both axes. Compare only
    // routes physically traversable in the original nonexperimental M7
    // version, excluding the intentionally solid new tree trunks.
    for(let x=site.x-8;x<=site.x+8;x++)
      for(let z=site.z-8;z<=site.z+8;z++){
        const startY=cap(x,z);
        if(startY===null||startY>WORLD_MAX_Y-3)continue;
        for(const [dx,dz,yaw] of dirs){
          const finishY=cap(x+dx,z+dz);
          if(finishY===null||Math.abs(finishY-startY)!==1||
             finishY>WORLD_MAX_Y-3)continue;
          const tag=finishY>startY?'up':'down';
          if(per[tag]>=8)continue;
          const feet=startY+1,nextFeet=finishY+1;
          if(!supported(old,x,z,feet)||
             !supported(old,x+dx,z+dz,nextFeet)||
             !supported(prototype,x,z,feet)||
             barkOnBodyRoute(x,z,feet,nextFeet,dx,dz))continue;
          const before=walk(old,x,z,feet,dx,dz,yaw);
          if(before.wall||before.ceiling||before.collision||
             before.progress<.72)continue;
          totals.referenceWalkable++;
          const after=walk(prototype,x,z,feet,dx,dz,yaw);
          assert.equal(after.wall,false,
            'experimental canopy may not block original traversable slope '+JSON.stringify({site,x,z,dx,dz,tag,before,after}));
          assert.equal(after.ceiling,false,'candidate foliage may not strike player head');
          assert.equal(after.collision,false,'original player cannot be embedded in solid canopy');
          assert.ok(after.progress>=.72,'player must traverse the same natural slope');
          assert.ok(Math.abs(after.feet-before.feet)<.12,
            'candidate canopy cannot change original walking altitude on a natural route');
          per[tag]++;totals[tag]++;totals.compared++;
          if(proof.length<4)proof.push({x,z,dx,dz,from:startY,to:finishY,
            beforeProgress:+before.progress.toFixed(3),
            afterProgress:+after.progress.toFixed(3),
            feet:+after.feet.toFixed(3),stepped:after.stepped});
        }
      }
    routeStats.push({...per,proof});
  }
  assert.ok(totals.up>=2,'must physically walk at least two true original M7 uphill routes');
  assert.ok(totals.down>=2,'must physically walk at least two true original M7 downhill routes');
  assert.ok(totals.compared>=8,'source sample must include substantial authentic traversable slope routes');
  assert.ok(routeStats.filter(s=>s.up+s.down>0).length>=2,
    'walking proof must cover more than one source-authentic forest tree neighborhood');
  assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
  assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
  console.log('# ENCHANTED REAL M7 HILLSIDE ROUTES '+JSON.stringify({
    seed,totals,routeStats,originalPhysics:true,syntheticWorld:false,
    historicalSavesUnchanged:true
  }));
});
