// Roadmap #240: genuine controller turns through original :36 grotto return loops
// and :24 upper mineral gallery/vault branches, four seeds, no player teleports.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,collides} from '../src/voxel.mjs';
import {stepPlayer,COYOTE_TIME} from '../src/physics.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
import {descentRoute,DESCENT_ORIGIN} from '../src/underground-switchback-descent.mjs';
import {UPPER_SITES} from '../src/cave-approaches/upper-network.mjs';
const SEEDS=[179,1,2026,-77];
function walk(world,route,label){
 assert.ok(route.length>5,'No actual sidepath '+label);
 const start=route[0];
 const p={x:start.x+.5,z:start.z+.5,feet:start.floor+1,yaw:0,pitch:0,
   vX:0,vY:0,vZ:0,onGround:true,coyote:COYOTE_TIME,jumpBuffer:0};
 assert.equal(collides(world,p.x,p.feet,p.z),false,label+' starts blocked');
 let frames=0;
 function go(q,index,direction){
  const x=q.x+.5,z=q.z+.5;
  assert.ok(Math.hypot(x-p.x,z-p.z)<2.2,label+' has disconnected source waypoint '+index);
  let n=0;
  while(Math.hypot(x-p.x,z-p.z)>.23&&n<140){
   p.yaw=Math.atan2(x-p.x,z-p.z);
   stepPlayer(world,p,{forward:1,strafe:0,jump:false},1/60);
   frames++;n++;
   assert.equal(collides(world,p.x,p.feet,p.z),false,
     label+' player collided at '+direction+' '+index);
   assert.ok(p.feet>=-210&&p.feet<=25,label+' player left world');
  }
  assert.ok(n<140,label+' actual player stuck at '+direction+' '+index+
    ' '+JSON.stringify({goal:q,player:p}));
  for(let j=0;j<4;j++)stepPlayer(world,p,{forward:0,strafe:0,jump:false},1/60);
 }
 for(let i=1;i<route.length;i++)go(route[i],i,'out');
 for(let i=route.length-2;i>=0;i--)go(route[i],i,'return');
 assert.ok(Math.hypot(p.x-start.x-.5,p.z-start.z-.5)<.24,
   label+' cannot return to source');
 assert.ok(Math.abs(p.feet-start.floor-1)<1.2,label+' wrong final height');
 return {frames,legs:route.length*2-2};
}
function grotto(depth){
 const anchor=descentRoute().find(p=>p.floor===depth);
 if(!anchor)throw Error('Missing original depth '+depth);
 const lx=anchor.x-DESCENT_ORIGIN.x,lz=anchor.z-DESCENT_ORIGIN.z;
 const out=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
 const tang=[out[1],-out[0]];
 const at=(d,t)=>({x:anchor.x+out[0]*d+tang[0]*t,
   z:anchor.z+out[1]*d+tang[1]*t,floor:depth});
 const path=[];
 for(let d=0;d<=19;d++)path.push(at(d,0));
 for(let t=1;t<=10;t++)path.push(at(19,t));
 for(let d=18;d>=12;d--)path.push(at(d,10));
 for(let t=9;t>=0;t--)path.push(at(12,t));
 for(let d=11;d>=0;d--)path.push(at(d,0));
 return path;
}
for(const seed of SEEDS){
 test('real controller four historic switchback grotto loops and return '+seed,()=>{
  const old=new VoxelWorld(seed),before=JSON.stringify(old.save());
  const world=createStagedCaveRuntime(seed,null,{approved:true}).world;
  const results=[];
  for(const depth of [-30,-80,-130,-180]){
   const path=grotto(depth);
   assert.equal(path.length,59,'Historical return path changed');
   results.push({depth,...walk(world,path,'grotto '+depth+' seed '+seed)});
  }
  assert.equal(JSON.stringify(old.save()),before,'Original saved world modified');
  console.log('CAVE FOUR HISTORICAL GROTTO CONTROLLER PASS',seed,JSON.stringify(results));
 });
 test('real controller enters each upper mineral gallery and vault then returns '+seed,()=>{
  const old=new VoxelWorld(seed),before=JSON.stringify(old.save());
  const world=createStagedCaveRuntime(seed,null,{approved:true}).world;
  const results=[];
  for(const site of UPPER_SITES){
   const d=110,floor=-8-Math.floor(d/6),side=site.x<0?-1:1;
   const z=site.z+Math.round(3*Math.sin(d/13));
   const nave=Array.from({length:111},(_,i)=>({
    x:site.x+i,z:site.z+Math.round(3*Math.sin(i/13)),
    floor:-8-Math.floor(i/6)
   }));
   const lateral=Array.from({length:34},(_,i)=>({
    x:site.x+d,z:z+side*(i+1),floor
   }));
   const path=[...nave,...lateral];
   results.push({site:site.name,...walk(world,path,'upper '+site.name+' seed '+seed)});
  }
  assert.equal(JSON.stringify(old.save()),before,'Original saved world modified');
  console.log('CAVE ORIGINAL UPPER MINERAL CONTROLLER PASS',seed,JSON.stringify(results));
 });
}
