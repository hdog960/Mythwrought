import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {BIOME130_REGISTERED_IDS,biome130Block} from '../src/biome130-registry.mjs';
import {PACK2_LIVE_IDS,pack2NormalizeState,pack2ShapeOf,pack2IsFluid} from '../src/pack2-integration.mjs';
import {MOUNTAIN_V8_MATERIAL_IDS,mountainV8Material} from '../src/manual-biomes/mountain-v8-materials.mjs';
import {createMobSourceRevision} from '../src/mobs/source-edit-epoch.mjs';
import {resolveOriginalVoxelShape,createOriginalOverlayReader} from '../src/age-of-valor/original-terrain.mjs';
import {createVoxelProjectileTrace} from '../src/age-of-valor/terrain-trace.mjs';
test('AV11 original catalog geometry and edited VoxelWorld read-only',()=>{
 const world=new VoxelWorld(179),cell=[1,200,0];let count=0;
 for(const block of BIOME130_REGISTERED_IDS)for(let rotation=0;rotation<4;rotation++){
 const d=biome130Block(block,rotation),v=resolveOriginalVoxelShape({world:{rotationAt:()=>rotation},block,cell});assert.equal(v.complete,true);assert.deepEqual(v.boxes,d.solid?d.boxes:[]);count++;}
 for(const block of PACK2_LIVE_IDS){const state=pack2NormalizeState(block,{}),v=resolveOriginalVoxelShape({world:{getPack2State:()=>state},block,cell});if(pack2IsFluid(block))assert.equal(v.complete,false);else {assert.equal(v.complete,true);assert.deepEqual(v.boxes,pack2ShapeOf(block,state).boxes);}count++;}
 for(const block of MOUNTAIN_V8_MATERIAL_IDS){const d=mountainV8Material(block),v=resolveOriginalVoxelShape({world,block,cell});assert.deepEqual(v.boxes,d.solid?d.boxes:[]);count++;}
 const identity={worldId:'fixture:w',profileId:'fixture:p',sourceId:'fixture:s',fixture:true};const readRevision=createMobSourceRevision(world);const trace=createVoxelProjectileTrace({world,identity,readRevision,residentCell:()=>true,resolveShape:resolveOriginalVoxelShape,readOverlays:createOriginalOverlayReader({world,readRevision})});
 const q={...identity,from:[0,200.5,.5],to:[2,200.5,.5],radius:.2};assert.equal(world.set(...cell,BLOCK.STONE),true);const saved=JSON.stringify(world.save());assert.ok(Math.abs(trace.trace(q).fraction-.4)<1e-8);assert.equal(JSON.stringify(world.save()),saved);assert.equal(world.set(...cell,BLOCK.AIR),true);assert.equal(trace.trace(q).fraction,null);world.pack5Collision=()=>false;assert.equal(trace.trace(q).complete,false);console.log('original geometry cases '+count);
});
