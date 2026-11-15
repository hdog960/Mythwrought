import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {pack2NormalizeState} from '../src/pack2-integration.mjs';
import {createManual14Layer} from '../src/builder-assets/manual14-layer.mjs';
import {stepPlayer,STEP_HEIGHT} from '../src/physics.mjs';

// Keep fixtures below WORLD_MAX_Y=19 so a real two-cell wall and ceiling
// can be authored and verified instead of silently rejecting out-of-range edits.
function seededFloor(){
 const world=new Pack2LiveWorld(new VoxelWorld(179));
 for(let x=496;x<=510;x++)for(let z=496;z<=510;z++)
  assert.equal(world.set(x,15,z,BLOCK.STONE),true);
 return world;
}
function player(x=500.5,z=500.5,yaw=Math.PI/2){
 return {x,z,feet:16,yaw,pitch:0,vX:0,vZ:0,vY:0,
  onGround:true,coyote:.09,jumpBuffer:0};
}
function walk(world,p,frames=75,dt=1/60){
 const steps=[],positions=[];
 for(let i=0;i<frames;i++){
  steps.push(stepPlayer(world,p,{forward:1,strafe:0,jump:false},dt));
  positions.push({x:p.x,z:p.z,feet:p.feet});
  assert.equal(collides(world,p.x,p.feet,p.z),false,'Stepping embedded the player at frame '+i);
 }
 return {steps,positions};
}
test('source-authentic Pack 2 river-shingle gravel climbs without JUMP at its actual uneven top',()=>{
 const world=seededFloor(),startSave=JSON.stringify(world.save());
 assert.equal(world.get(502,16,500),BLOCK.AIR);
 assert.equal(world.placePack2(502,16,500,69,pack2NormalizeState(69)),true);
 const p=player(),out=walk(world,p);
 assert.equal(out.steps.some(x=>x.jumped),false);
 assert.ok(out.steps.some(x=>x.stepped),'The authored gravel shape must have walkable clearance');
 assert.ok(out.positions.some(x=>x.x>502.1&&x.feet>16.7&&x.feet<17.01),
  'Player never reached the gravel top while walking');
 assert.ok(p.x>502.5,'Walking should pass the gravel rather than snagging before it');
 assert.equal(JSON.stringify(world.save()),startSave,'Physics must not alter schema-1 saves');
});
test('real Pack 1 two-riser stair climbs both half heights in sequence without jumping',()=>{
 const world=seededFloor();
 const layer=createManual14Layer(world);
 assert.equal(layer.placeMany([{asset:'pack1:008',numericId:16,at:[500,16,502],orientation:0}]),1);
 world.manual14Layer=layer;
 world.manual14Collision=body=>layer.collision(body);
 const p=player(500.5,500.5,0),out=walk(world,p,92);
 assert.equal(out.steps.some(x=>x.jumped),false);
 assert.ok(out.positions.some(x=>x.z>501.8&&x.feet>16.49&&x.feet<16.73),
  'Front stair half must be traversable at its authored half-block height');
 assert.ok(out.positions.some(x=>x.z>502.3&&x.feet>16.95&&x.feet<17.02),
  'Rear stair half must be traversable without jumping');
 assert.ok(out.steps.filter(x=>x.stepped).length>=2,'Each riser should step independently');
 assert.ok(p.z>503,'Player must pass the far edge of the actual stair');
});
test('full-height plank retains its existing walk-up behavior and jump remains optional',()=>{
 const world=seededFloor();
 assert.equal(world.placePack2(502,16,500,59,pack2NormalizeState(59)),true);
 const p=player(),out=walk(world,p);
 assert.ok(out.steps.some(x=>x.stepped));
 assert.ok(out.positions.some(x=>x.feet>16.99&&x.x>502));
 assert.ok(p.x>502.5);
});
test('two-block wall and low headroom still reject auto-step; no clipping or free climbing',()=>{
 const wall=seededFloor();
 assert.equal(wall.set(502,16,500,BLOCK.STONE),true);
 assert.equal(wall.set(502,17,500,BLOCK.STONE),true);
 const blocked=player(),attempt=walk(wall,blocked,80);
 assert.equal(attempt.steps.some(x=>x.stepped),false);
 assert.ok(blocked.x<=502-.28+.01);
 const ceiling=seededFloor();
 const layer=createManual14Layer(ceiling);
 layer.placeMany([{asset:'pack1:008',numericId:16,at:[500,16,502],orientation:0}]);
 ceiling.manual14Layer=layer;
 ceiling.manual14Collision=body=>layer.collision(body);
 assert.equal(ceiling.set(500,18,502,BLOCK.STONE),true);
 const p=player(500.5,500.5,0),r=walk(ceiling,p,85);
 assert.ok(r.positions.every(x=>x.feet<=16.51),
  'Stairs cannot force the player through a ceiling above the second riser');
 assert.ok(p.z<=502.72,'Low ceiling must block passage to the upper tread');
 assert.equal(STEP_HEIGHT,1.01,'Never raise automatic step height to climb taller walls');
});
