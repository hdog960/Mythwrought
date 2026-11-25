import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,ENCHANTED_P2_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y} from '../../src/depth.mjs';
import {BLOCK,meshChunk} from '../../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {WILDS_PHYSICAL_MIN_Y,WILDS_PHYSICAL_MAX_Y,createWildsUpperResearchWorld,planWildsTowerPrototype} from '../../src/manual-biomes/enchanted-wilds-upper-world.mjs';
const seed=179, ground=new FourRegionWorld(seed,fourRegionProfile(seed,ENCHANTED_P2_GENERATOR),{experimentalEnchantedWilds:true});
test('15 physical upper sections, disjoint keys, original floor and full body seam',()=>{
 const h=createWildsUpperResearchWorld(ground);
 assert.equal(WORLD_MAX_Y,19);assert.equal(WORLD_MIN_Y,-210);
 assert.equal(WILDS_PHYSICAL_MAX_Y,256);assert.equal(WILDS_PHYSICAL_MIN_Y,-210);
 let next=20;
 for(let s=0;s<15;s++){const b=h.bounds(s);assert.equal(b.minY,next);for(let y=b.minY;y<=b.maxY;y++)assert.equal(h.sectionForY(y),s);next=b.maxY+1;}
 assert.equal(next,257);assert.equal(h.sectionForY(19),null);assert.equal(h.sectionForY(257),null);
 assert.equal(h.meshKey(-1,-1,0),'sky:-1,-1,0');
 assert.equal(h.bodyRegions({x:0,z:0,feet:35.5}).length,8);
 assert.equal(h.world.get(0,-210,0),ground.get(0,-210,0));
 assert.equal(h.world.get(0,-211,0),BLOCK.AIR);
 assert.throws(()=>h.save(),/not a durable/);
});
test('actual original collision, raycast and mesh accept edits at Y256 and remote coordinates',()=>{
 const h=createWildsUpperResearchWorld(ground), x=-10001,z=10003;
 assert.equal(h.world.get(x,256,z),0);
 assert.equal(h.setUpper(x,256,z,BLOCK.STONE),true);
 assert.equal(h.setUpper(x,257,z,BLOCK.STONE),false);
 assert.equal(h.setUpper(x,19,z,BLOCK.STONE),false);
 assert.equal(h.world.get(x,256,z),BLOCK.STONE);
 assert.equal(h.collides(x+.5,255.5,z+.5),true);
 assert.deepEqual(h.raycast([x+.5,256.5,z-2],[0,0,1],7)?.hit,[x,256,z]);
 const m=h.meshUpper(Math.floor(x/16),Math.floor(z/16),14);
 assert.equal(m.vertexCount,36);assert.equal(m.bytes,1296);
 assert.equal(h.setUpper(x,256,z,BLOCK.AIR),true);assert.deepEqual(h.editRows(),[]);
 assert.equal(h.meshUpper(Math.floor(x/16),Math.floor(z/16),14).bytes,0);
 console.log('WILDS UPPER CEILING',JSON.stringify({maxY:256,remote:[x,z],bytes:m.bytes,collision:true,ray:true}));
});
test('real rooted tower crosses Y19/20 and upper sections; native bark mining and seam mesh',()=>{
 let plan=null;
 outer:for(let z=-544;z<=-480;z+=4)for(let x=-64;x<=-16;x+=4){
  plan=planWildsTowerPrototype(ground,x,z,{height:28});if(plan)break outer;
 }
 assert.ok(plan,'real source-supported tower site required');
 const [x,floor,z]=plan.origin;
 assert.ok(floor<19&&plan.highestY>35);
 const h=createWildsUpperResearchWorld(ground,[plan]),cx=Math.floor(x/16),cz=Math.floor(z/16);
 for(let y=floor+1;y<=floor+28;y++)assert.equal(h.world.get(x,y,z),G.aetherBark);
 const a=h.meshUpper(cx,cz,0),b=h.meshUpper(cx,cz,1);
 assert.ok(a.bytes>0&&b.bytes>0&&a.vertices.every(Number.isFinite)&&b.vertices.every(Number.isFinite));
 const surface=h.meshSurface(cx,cz);assert.ok(surface.length>0);
 assert.deepEqual(h.raycast([x+.5,20.5,z-2],[0,0,1],7)?.hit,[x,20,z]);
 assert.equal(h.collides(x+.5,20,z+.5),true);
 assert.equal(h.setUpper(x,20,z,BLOCK.AIR),true);
 assert.equal(h.world.get(x,20,z),BLOCK.AIR);assert.equal(h.naturalAt(x,20,z),G.aetherBark);
 assert.deepEqual(h.editRows(),[[x,20,z,0]]);
 assert.equal(h.meshUpper(cx,cz,0).solidCount,a.solidCount-1);
 assert.equal(h.setUpper(x,20,z,G.aetherBark),true);assert.deepEqual(h.editRows(),[]);
 assert.deepEqual(h.meshUpper(cx,cz,0).vertices,a.vertices);
 assert.equal(ground.get(x,20,z),BLOCK.AIR);
 assert.deepEqual(h.meshSurface(31,-1),meshChunk(ground,31,-1));
 console.log('WILDS ROOTED TOWER',JSON.stringify({origin:plan.origin,highestY:plan.highestY,cells:plan.cells.length,upperBytes:[a.bytes,b.bytes],surfaceBytes:surface.byteLength}));
});
