import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,collides} from '../src/voxel.mjs';
import {stepPlayer,COYOTE_TIME} from '../src/physics.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
import {HISTORIC_NAMED_TARGETS,findNamedCavePlayerRoute}
 from '../src/manual-caves/named-destination-audit.mjs';
let pair;
function get(){
 if(!pair){const base=new VoxelWorld(179),bytes=JSON.stringify(base.save());
  pair={base,bytes,runtime:createStagedCaveRuntime(179,null,{approved:true})};}
 return pair;
}
function walk(world,path,label){
 const s=path[0],p={x:s.x+.5,z:s.z+.5,feet:s.floor+1,
  yaw:0,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:COYOTE_TIME,jumpBuffer:0};
 let frames=0;
 function toward(q,i,way){
  const goal={x:q.x+.5,z:q.z+.5};
  let n=0;
  while(Math.hypot(goal.x-p.x,goal.z-p.z)>.23&&n<140){
   p.yaw=Math.atan2(goal.x-p.x,goal.z-p.z);
   stepPlayer(world,p,{forward:1,strafe:0,jump:false},1/60);
   assert.equal(collides(world,p.x,p.feet,p.z),false,label+' clipped on '+way+' '+i);
   assert.ok(p.feet>=-210&&p.feet<=25,label+' left world bounds');
   n++;frames++;
  }
  assert.ok(n<140,label+' player blocked '+way+' '+i+' '+JSON.stringify({q,p}));
  for(let x=0;x<4;x++)stepPlayer(world,p,{forward:0,strafe:0,jump:false},1/60);
 }
 for(let i=1;i<path.length;i++)toward(path[i],i,'out');
 for(let i=path.length-2;i>=0;i--)toward(path[i],i,'return');
 assert.ok(Math.hypot(p.x-s.x-.5,p.z-s.z-.5)<.24,label+' no original return');
 assert.ok(Math.abs(p.feet-s.floor-1)<1.3,label+' wrong support elevation');
 return frames;
}
test('all 21 preserved named historic source labels are distinct, with unique target',()=>{
 assert.equal(HISTORIC_NAMED_TARGETS.length,21);
 assert.equal(new Set(HISTORIC_NAMED_TARGETS.map(x=>x.name)).size,21);
 assert.equal(new Set(HISTORIC_NAMED_TARGETS.map(x=>x.depth+','+x.d+','+x.t)).size,21);
});
for(const item of HISTORIC_NAMED_TARGETS){
 test('actual controller from original spiral to distinct named '+item.name+' and back',()=>{
  const {base,bytes,runtime}=get();
  const proof=findNamedCavePlayerRoute(runtime.world,item);
  assert.equal(proof.ok,true,JSON.stringify(proof));
  assert.equal(proof.name,item.name);
  assert.ok(proof.route.length>5,'Do not mistake an adjacent route cell for a distinct chamber');
  const frames=walk(runtime.world,proof.route,item.name);
  assert.ok(frames>proof.route.length-1);
  assert.equal(JSON.stringify(base.save()),bytes,'Old schema1 save mutated by chamber visit');
  assert.equal(runtime.registeredInHomeScreen,false);
  console.log('CAVE NAMED CHAMBER REAL CONTROLLER PASS',item.name,
   'frames',frames,'steps',proof.route.length);
 });
}
