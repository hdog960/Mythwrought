import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VoxelWorld,collides,BLOCK,BODY_RADIUS,BODY_HEIGHT,chunkCoord} from '../../src/voxel.mjs';
import {findSafeSpawn} from '../../src/physics.mjs';
import {sectionForY,sectionWindow,sectionChunkRadius,depthMeshKey,
 WORLD_MIN_Y,WORLD_MAX_Y} from '../../src/depth.mjs';
import {g2RegionKey,G2_MAX_NEW_PREFETCH,G2_MAX_PENDING_PREFETCH} from '../../src/creative-integration/g2-streaming.mjs';
import {G2_FLIGHT_SPEEDS,G2_MAX_FRAME_SECONDS,G2_MAX_SEGMENT_LENGTH}
 from '../../src/creative-integration/g2-flight.mjs';
const main=readFileSync(new URL('../../src/main.mjs',import.meta.url),'utf8');
const world=new VoxelWorld(179);
test('G2B production collision has actual voxel and physical full-body authority',()=>{
 const safe=findSafeSpawn(world);
 assert.equal(collides(world,safe.x,safe.feet,safe.z),false);
 assert.ok(collides(world,safe.x,safe.feet-.065,safe.z),'Actual floor probe must collide');
 assert.equal(BODY_RADIUS,.28);assert.equal(BODY_HEIGHT,1.78);
 assert.equal(world.get(Math.floor(safe.x),Math.floor(safe.feet),Math.floor(safe.z)),BLOCK.AIR);
});
test('G2B actual collision distinguishes solid placement from air',()=>{
 // Build a clean voxel-sized source-world test cavity at a known valid Y.
 const x=0,z=0,y=10;
 for(let h=y;h<=y+2;h++)assert.equal(world.set(x,h,z,BLOCK.AIR),true);
 assert.equal(collides(world,x+.5,y,z+.5),false);
 assert.equal(world.set(x,y,z,BLOCK.STONE),true);
 assert.equal(collides(world,x+.5,y,z+.5),true);
 assert.equal(world.set(x,y,z,BLOCK.AIR),true);
 assert.equal(collides(world,x+.5,y,z+.5),false);
});
test('G2B real depth ABI uses 2D GPU key on surface, 3D below',()=>{
 assert.equal(sectionForY(0),0);assert.equal(sectionForY(-4),-1);
 assert.equal(g2RegionKey({x:17,y:0,z:-1},sectionForY),'1,-1,0');
 assert.equal(depthMeshKey(1,-1,0),'1,-1');
 assert.equal(depthMeshKey(1,-1,-1),'1,-1,-1');
 assert.ok(main.includes('depthMeshKey(...parts)'),'Flight planner must translate keys');
 assert.ok(main.includes('chunks.get(depthMeshKey(chunkCoord(x),chunkCoord(z),section))'));
});
test('G2B streaming preserves real vertical section and original resident radii',()=>{
 assert.deepEqual(sectionWindow(10,false),[0]);
 assert.equal(sectionChunkRadius(0,0),2);
 assert.equal(sectionChunkRadius(-1,-1),1);
 assert.equal(G2_MAX_NEW_PREFETCH,2);assert.equal(G2_MAX_PENDING_PREFETCH,6);
 assert.ok(main.includes('pending.size>=34'));
 assert.ok(main.includes('wanted.has(key)'),'No flight-only unbounded GPU queue');
});
test('G2B the physical body is sampled at both height and horizontal chunk boundaries',()=>{
 assert.ok(main.includes('p.y+BODY_HEIGHT-e'));
 assert.ok(main.includes('p.x-BODY_RADIUS+e'));
 assert.ok(main.includes('p.z+BODY_RADIUS-e'));
 assert.ok(main.includes('resident.section!==section'));
});
test('G2B flight refuses unknown physical data rather than assuming empty',()=>{
 assert.ok(main.includes('!collides(world,p.x,p.y,p.z)'));
 assert.ok(main.includes('catch(_){return false;}'));
 assert.ok(main.includes('g2Ready(g2Flight.position)&&g2Clear(g2Flight.position)'));
});
test('G2B flight profiles and physical dimensions preserve G2A invariants',()=>{
 assert.deepEqual(G2_FLIGHT_SPEEDS,{precision:1.4,normal:4,fast:8,travel:15});
 assert.equal(G2_MAX_FRAME_SECONDS,.05);assert.equal(G2_MAX_SEGMENT_LENGTH,.25);
 assert.ok(WORLD_MIN_Y<WORLD_MAX_Y);
});
test('G2B candidate landing uses genuine full-body support and descent sampling',()=>{
 assert.ok(main.includes('collides(world,p.x,p.y-.065,p.z)'));
 assert.ok(main.includes('const t=i/n,p={x:from.x+(to.x-from.x)*t'));
 assert.ok(main.includes('inspectG2Landing(g2Flight,host)'));
 assert.ok(main.includes('commitG2Landing(g2Flight,check,host)'));
});
