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
import {PHYSICAL_MAX_Y,runtimeSectionForY,runtimeMeshKey,physicalBodyRegions} from '../../src/world-height.mjs';
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
 assert.equal(runtimeMeshKey(1,-1,0),'1,-1');
 assert.equal(runtimeMeshKey(1,-1,-1),'1,-1,-1');
 assert.equal(runtimeMeshKey(1,-1,1),'sky:1,-1,0');
 assert.equal(runtimeMeshKey(1,-1,15),'sky:1,-1,14');
 assert.ok(main.includes('runtimeMeshKey(...parts)'),'Flight planner must translate keys');
 assert.ok(main.includes('chunks.get(r.key)'));
});
test('G2B streaming preserves real vertical section and original resident radii',()=>{
 assert.deepEqual(sectionWindow(10,false),[0]);
 assert.equal(sectionChunkRadius(0,0),2);
 assert.equal(sectionChunkRadius(-1,-1),1);
 assert.equal(G2_MAX_NEW_PREFETCH,2);assert.equal(G2_MAX_PENDING_PREFETCH,6);
 assert.ok(main.includes('pending.size>=34'));
 assert.ok(main.includes('wanted.has(key)'),'No flight-only unbounded GPU queue');
});
test('G2B flight uses physical upper owners and refuses body above the new ceiling',()=>{
 assert.ok(main.includes('const G2_FLIGHT_MAX_FEET=PHYSICAL_MAX_Y+1-BODY_HEIGHT'));
 assert.ok(main.includes('const g2Section=runtimeSectionForY'));
 assert.ok(main.includes('p.y>G2_FLIGHT_MAX_FEET'));
 assert.ok(main.includes('maxFeet:G2_FLIGHT_MAX_FEET'));
 assert.equal(runtimeSectionForY(20),1);assert.equal(runtimeSectionForY(256),15);
 assert.equal(runtimeSectionForY(257),null);
 const max=PHYSICAL_MAX_Y+1-BODY_HEIGHT;
 assert.equal(max,255.22);
 assert.ok(physicalBodyRegions({x:.5,feet:max,z:.5}));
 assert.equal(physicalBodyRegions({x:.5,feet:max+.001,z:.5}),null);
 const w=new VoxelWorld(179);
 assert.equal(collides(w,.5,254,.5),false);
 assert.ok(w.set(0,255,0,BLOCK.STONE));
 assert.equal(collides(w,.5,254,.5),true);
});
test('G2B the physical body is sampled at both height and horizontal chunk boundaries',()=>{
 const regions=physicalBodyRegions({x:16,feet:19.5,z:0,radius:BODY_RADIUS,height:BODY_HEIGHT});
 const expected=[];
 for(const cx of [0,1])for(const cz of [-1,0])for(const section of [0,1])expected.push(runtimeMeshKey(cx,cz,section));
 assert.deepEqual(regions.map(r=>r.key).sort(),expected.sort());
 const high=physicalBodyRegions({x:-16,feet:35.5,z:16,radius:BODY_RADIUS,height:BODY_HEIGHT});
 assert.equal(high.length,8);
 assert.ok(high.every(r=>r.kind==='upper'&&[0,1].includes(r.section)));
 assert.ok(main.includes('physicalBodyRegions({x:p.x,feet:p.y,z:p.z,radius:BODY_RADIUS,height:BODY_HEIGHT})'));
 assert.ok(main.includes('regions.every(r=>{const c=chunks.get(r.key)'));
 assert.ok(main.includes('!!c&&(!!c.buffer||c.section>0&&c.count===0)'));
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
