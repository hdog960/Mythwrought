// Cave Roadmap #240 C3/C5: REAL unteleported surface -> bedrock -> exit.
// Uses the production stepPlayer() controller and actual authored voxel
// readers, not scripted world.position jumps. One exact seeded new Cave World
// and thousands of 60fps movement frames; no persistent saved world mutation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,collides,BLOCK} from '../src/voxel.mjs';
import {stepPlayer,COYOTE_TIME} from '../src/physics.mjs';
import {deepCaveRoute} from '../src/deep-cave-network.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';

const MAX_FRAMES=95000,PER_CELL=140;
function walkContinuous(world,route){
 const start=route[0],p={x:start.x+.5,z:start.z+.5,feet:start.feet,
  yaw:0,pitch:0,vX:0,vY:0,vZ:0,
  onGround:true,coyote:COYOTE_TIME,jumpBuffer:0};
 assert.ok(!collides(world,p.x,p.feet,p.z),'Surface cave mouth blocks real player');
 const accepted=[],rejected=[];
 let ticks=0,lowest=start.floor;
 function advance(to,i,phase){
  let frames=0;
  while(Math.hypot(p.x-to.x-.5,p.z-to.z-.5)>.22&&frames<PER_CELL){
   p.yaw=Math.atan2(to.x+.5-p.x,to.z+.5-p.z);
   const out=stepPlayer(world,p,{forward:1,strafe:0,jump:false},1/60);
   assert.ok(!collides(world,p.x,p.feet,p.z),'Actual player clipped '+phase+' '+i);
   assert.ok(Number.isFinite(p.feet)&&p.feet>=-210&&p.feet<=25,
    'Real player fell beyond game boundaries '+phase+' '+i+' '+p.feet);
   frames++;ticks++;
   lowest=Math.min(lowest,p.feet);
   if(ticks>MAX_FRAMES)throw Error('Physical controller exceeded traversal frame cap');
  }
  if(frames>=PER_CELL||Math.hypot(p.x-to.x-.5,p.z-to.z-.5)>.23)
   rejected.push({phase,i,goal:[to.x,to.floor,to.z],
    at:[p.x,p.feet,p.z],frames});
  else accepted.push({phase,i,at:[p.x,p.feet,p.z],frames});
  if(rejected.length)throw Error('Real cave motion blocked: '+JSON.stringify(rejected.slice(-1)));
  for(let n=0;n<4;n++)stepPlayer(world,p,{forward:0,strafe:0,jump:false},1/60);
 }
 for(let i=1;i<route.length;i++)advance(route[i],i,'descending');
 assert.ok(lowest<-195,'Never reached full bedrock route');
 for(let i=route.length-2;i>=0;i--)advance(route[i],i,'ascending');
 assert.ok(Math.hypot(p.x-start.x-.5,p.z-start.z-.5)<.23,
  'Player could not return to original surface cave mouth');
 assert.ok(Math.abs(p.feet-start.feet)<1.5,'Player did not regain source entrance elevation');
 return {frames:ticks,legs:accepted.length,lowest,routeLength:route.length};
}
test('REAL game controller continuously descends via authored mouth to bedrock -210 and returns, with untouched legacy save',()=>{
 const seed=179,legacy=new VoxelWorld(seed),before=JSON.stringify(legacy.save());
 const staging=createStagedCaveRuntime(seed,null,{approved:true}),world=staging.world;
 const entry=staging.entrancePlan.entrances.find(x=>x.name==='old-deep24');
 assert.ok(entry&&entry.route.length>=5,'Missing original four-source safe cave mouth');
 const spiral=deepCaveRoute();
 assert.ok(spiral.length>700,'Deep authored spiral unexpectedly missing');
 assert.equal(spiral[0].x,entry.route[0].x);
 assert.equal(spiral[0].z,entry.route[0].z);
 const combined=[...entry.route.slice().reverse(),
  ...spiral.slice(1)];
 for(let i=1;i<combined.length;i++){
  const a=combined[i-1],b=combined[i];
  assert.equal(Math.abs(a.x-b.x)+Math.abs(a.z-b.z),1,
   'Surface-to-bedrock cave path disconnected before player test: '+i);
  assert.ok(Math.abs(a.floor-b.floor)<=1,'Cave path demands impossible player-height step '+i);
  assert.notEqual(world.get(b.x,b.floor,b.z),BLOCK.AIR,'Cave floor unsupported '+i);
  assert.equal(world.get(b.x,b.floor+1,b.z),BLOCK.AIR,
    'Cave standing path blocked '+i);
 }
 const trace=walkContinuous(world,combined);
 assert.ok(trace.legs>1400);
 assert.equal(JSON.stringify(legacy.save()),before,'Historical world modified by physical traversal');
 assert.equal(staging.registeredInHomeScreen,false,'Native source acceptance cannot claim live deployment');
 console.log('MYTHWROUGHT CAVE TRUE END-TO-END PHYSICS',JSON.stringify(trace));
});
