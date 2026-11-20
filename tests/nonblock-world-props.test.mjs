import assert from 'node:assert/strict';
import test from 'node:test';
import {createWorldProp,WORLD_PROP_IDS} from '../src/nonblock-fittings36/world-props.mjs';

test('new fitting and prop emit distinct finite source geometry with deterministic variants',()=>{
  assert.equal(WORLD_PROP_IDS.length,7);
  const unique=new Set();
  for(const id of WORLD_PROP_IDS){
    for(const variant of [0,1,2,3]){
      const options={seed:107,anchor:[1,9,20],variant};
      const prop=createWorldProp(id,options);
      assert.deepEqual(prop,createWorldProp(id,options));
      const {positions,triangleCount,materials}=prop.mesh;
      assert.ok(triangleCount>=20&&triangleCount<=256,id);
      assert.equal(positions.length,triangleCount*9,id);
      assert.equal(materials.length,triangleCount,id);
      assert.ok(positions.every(Number.isFinite),id);
      assert.ok(materials.every(value=>value<prop.palette.length),id);
      for(let offset=0;offset<positions.length;offset+=9){
        const [a,b,c,d,e,f,g,h,i]=positions.slice(offset,offset+9);
        const u=[d-a,e-b,f-c],v=[g-a,h-b,i-c];
        assert.ok(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-7,id);
      }
      unique.add(positions.join());
    }
  }
  assert.equal(unique.size,WORLD_PROP_IDS.length*4);
});

test('ladder assemblies distinguish rigid wall holds from the ceiling-mounted rope ladder',()=>{
  const options={seed:1,anchor:[0,4,0],variant:2};
  const wall=createWorldProp('scene36:ladder-assembly',options);
  const rope=createWorldProp('scene36:rope-ladder',options);
  assert.equal(wall.attachment,'wall');
  assert.equal(rope.attachment,'ceiling');
  assert.equal(wall.climbable,true);
  assert.equal(rope.climbable,true);
  assert.throws(()=>createWorldProp('scene36:hanging-bell',{...options,variant:4}));
});

test('all seven authored props use the shared stage and required natural support cells',async()=>{
  const {describeCandidateObject,createCandidateScene}=await import('../src/nonblock/candidate-scene.mjs');
  const layout=WORLD_PROP_IDS.map((sceneId,index)=>({
    sceneId,anchor:[index*3,sceneId==='scene36:rope-ladder'||sceneId==='scene36:hanging-bell'?4:1,0]
  }));
  const supports=new Set(layout.flatMap(entry=>describeCandidateObject(179,entry).supports)
    .map(cell=>cell.join(',')));
  const scene=createCandidateScene(179,'legacy',layout,{
    storage:{getItem:()=>null},blockAt:(...p)=>supports.has(p.join(',')),voxelPick:()=>null
  });
  assert.equal(scene.visible().length,7);
  assert.equal(scene.visible().filter(o=>o.colliders.length>0).length,3);
});

test('ordinary movement climbs a mounted ladder and falls after the ladder disappears',async()=>{
  const {createCandidateScene}=await import('../src/nonblock/candidate-scene.mjs');
  const {stepPlayer}=await import('../src/physics.mjs');
  const isBlock=(x,y,z)=>y===0||x===0&&z===-1&&(y===1||y===2);
  const baseCells=new Set(['0,1,-1','0,2,-1']);
  const isSupported=(x,y,z)=>y===0||baseCells.has([x,y,z].join(','));
  const scene=createCandidateScene(179,'legacy',[
    {sceneId:'scene36:ladder-assembly',anchor:[0,1,0],variant:3}
  ],{storage:{getItem:()=>null},blockAt:isSupported,voxelPick:()=>null});
  const world={get:(...p)=>Number(isBlock(...p)),stagedNonblockClimb:scene.climbableAt};
  const player={x:.5,z:.3,feet:1,yaw:Math.PI,onGround:true,vX:0,vY:0,vZ:0,coyote:0,jumpBuffer:0};
  for(let n=0;n<30;n++)stepPlayer(world,player,{forward:1},1/60);
  assert.ok(player.feet>1.7,'The movement control must climb the installed ladder');
  const climbed=player.feet;
  baseCells.clear();
  for(let n=0;n<30;n++)stepPlayer(world,player,{forward:0},1/60);
  assert.ok(player.feet<climbed-.3,'The absent ladder no longer holds the player');
});
