// Roadmap #240 C3: independent authored secondary lobe/arm player acceptance.
// Each endpoint originates in the protected historical #173 generator, not a
// handpicked marker painted onto an arbitrary new preview or teleported room.
// Real voxel support, >=4 AIR headroom, bounded BFS and production stepPlayer.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {descentRoute,DESCENT_ORIGIN} from '../src/underground-switchback-descent.mjs';
import {stepPlayer,COYOTE_TIME} from '../src/physics.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
const SEED=179;
const TARGETS=Object.freeze([
 ['Bifurcated Mineral Gallery / opposite arm',-120,27,7,-120],
 ['Fault Cathedral / upper second lobe',-170,36,11,-170],
 ['Rift Terraces / second offset chamber',-90,33,10,-92],
 ['Erosion Labyrinth / northern far pocket',-45,41,12,-45],
 ['Deep Fault Bypass / southern alternate arm',-185,30,-11,-185],
 ['Deep Fault Bypass / northern alternate arm',-185,30,11,-185],
 ['Braided Ravine / second channel',-70,33,10,-70],
 ['Forked Basalt Sanctuary / eastern side alcove',-160,31,13,-160],
 ['Shattered Shelf / remote lateral refuge',-145,66,15,-147],
 ['Bedrock Labyrinth / eastern secondary pocket',-200,67,12,-200],
 ['Broken-Column Grotto / sheltered side pocket',-35,37,-13,-35],
 ['Ribbed Fault Canyon / southern gully',-150,36,-11,-152],
 ['Vaulted Stone Fan / western fan lobe',-125,44,-13,-125],
 ['Folded Fault Amphitheater / northern arm',-190,34,13,-190],
 ['Bedrock Whisper Gallery / other protected lobe',-202,39,-31,-202],
 ['Crescent Refuge / secondary refugial pocket',-195,40,10,-195]
]);
const key=p=>p.x+','+p.z+','+p.floor;
function findPath(world,depth,d,t,floor){
 const source=descentRoute().find(p=>p.floor===depth);
 assert.ok(source,'Original cave source omitted '+depth);
 const lx=source.x-DESCENT_ORIGIN.x,lz=source.z-DESCENT_ORIGIN.z;
 const out=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0],
       tan=[out[1],-out[0]];
 const at=(dd,tt,y)=>({x:source.x+out[0]*dd+tan[0]*tt,
    z:source.z+out[1]*dd+tan[1]*tt,floor:y});
 const toLocal=p=>{
   const dx=p.x-source.x,dz=p.z-source.z;
   return {d:dx*out[0]+dz*out[1],t:dx*tan[0]+dz*tan[1]};
 };
 const start={x:source.x,z:source.z,floor:depth},target=at(d,t,floor);
 const open=p=>{
  const pos=toLocal(p);
  if(pos.d< -3||pos.d>100||Math.abs(pos.t)>48||
    p.floor<depth-5||p.floor>depth+2)return false;
  if(![BLOCK.DEEPSTONE,BLOCK.STONE].includes(world.get(p.x,p.floor,p.z)))return false;
  for(let h=1;h<=4;h++)if(world.get(p.x,p.floor+h,p.z)!==BLOCK.AIR)return false;
  return !collides(world,p.x+.5,p.floor+1,p.z+.5);
 };
 assert.ok(open(start),'Original source anchor no longer standable: '+depth);
 assert.ok(open(target),'Second authored lobe not standable: '+JSON.stringify({depth,d,t,floor,target}));
 const q=[start],paths=new Map([[key(start),null]]),positions=new Map([[key(start),start]]);
 let index=0;
 while(index<q.length&&index<100000&&!paths.has(key(target))){
  const now=q[index++];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])
   for(const dy of [0,-1,1]){
    const p={x:now.x+dx,z:now.z+dz,floor:now.floor+dy},id=key(p);
    if(paths.has(id)||!open(p))continue;
    paths.set(id,key(now));positions.set(id,p);q.push(p);
   }
 }
 assert.ok(paths.has(key(target)),
  'Unreachable SECONDARY historic cave arm: '+JSON.stringify({depth,d,t,floor,searched:index}));
 const path=[];
 for(let id=key(target);id!==null;id=paths.get(id))path.push(positions.get(id));
 path.reverse();
 assert.ok(path.length>8,'Secondary room collapsed to an adjacent facade cell');
 return path;
}
function walk(world,path,label){
 const q=path[0],p={x:q.x+.5,z:q.z+.5,feet:q.floor+1,
  yaw:0,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:COYOTE_TIME,jumpBuffer:0};
 let frames=0;
 const go=(goal,i,way)=>{
  let ticks=0;
  while(Math.hypot(goal.x+.5-p.x,goal.z+.5-p.z)>.23&&ticks<140){
   p.yaw=Math.atan2(goal.x+.5-p.x,goal.z+.5-p.z);
   stepPlayer(world,p,{forward:1,strafe:0,jump:false},1/60);
   ticks++;frames++;
   assert.ok(!collides(world,p.x,p.feet,p.z),label+' collided '+way+' '+i);
   assert.ok(p.feet>=-210&&p.feet<=25,label+' fell outside legacy depth');
  }
  assert.ok(ticks<140,label+' blocked player '+way+' '+i+
   ' '+JSON.stringify({goal,x:p.x,y:p.feet,z:p.z}));
  for(let j=0;j<4;j++)stepPlayer(world,p,{forward:0,strafe:0,jump:false},1/60);
 };
 for(let i=1;i<path.length;i++)go(path[i],i,'outward');
 for(let i=path.length-2;i>=0;i--)go(path[i],i,'return');
 assert.ok(Math.hypot(p.x-q.x-.5,p.z-q.z-.5)<.24,
   label+' did not actually return');
 assert.ok(Math.abs(p.feet-q.floor-1)<1.3,label+' wrong return floor');
 return frames;
}
let fixture;
function getWorld(){
 if(!fixture){const old=new VoxelWorld(SEED);
  fixture={old,bytes:JSON.stringify(old.save()),
   runtime:createStagedCaveRuntime(SEED,null,{approved:true})};}
 return fixture;
}
test('secondary historical lobe list is sourced, unique and not a feature replacement',()=>{
 assert.equal(TARGETS.length,16);
 assert.equal(new Set(TARGETS.map(x=>x[0])).size,TARGETS.length);
});
for(const [name,depth,d,t,floor] of TARGETS){
 test('REAL player reaches and returns from '+name+' on seed '+SEED,()=>{
  const {old,bytes,runtime}=getWorld();
  const path=findPath(runtime.world,depth,d,t,floor);
  const frames=walk(runtime.world,path,name);
  assert.ok(frames>path.length-1);
  assert.equal(JSON.stringify(old.save()),bytes,'Historical world saves changed');
  assert.equal(runtime.registeredInHomeScreen,false);
  console.log('CAVE HISTORIC SECONDARY ARM CONTROLLER PASS',
    name,'seed',SEED,'path',path.length,'frames',frames);
 });
}
