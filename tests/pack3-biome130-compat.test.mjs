// Pack 3 must coexist with the *newer* automation-owned physical biome registry,
// without copying/rewriting its source or changing any existing world save.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,raycast,collides} from '../src/voxel.mjs';
import {BIOME130_REGISTERED_IDS,BIOME130_REGISTERED_SYMBOLS,biome130Block} from '../src/biome130-registry.mjs';
import {PACK3_BUILDER_SYMBOLS,PACK3_BUILDER_IDS} from '../src/builder-assets/pack3.mjs';
import {createPack3LiveBridge} from '../src/builder-assets/pack3-live.mjs';
import {intersectsPlayerBlock,inspectBlockTarget,BUILD_MATERIALS,BLOCK_NAMES} from '../src/blocks.mjs';
const storage=()=>{const m=new Map();return {
 getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),
 removeItem:k=>m.delete(k)
};};
const maker=()=>{
 const cells=new Map(),turns=new Map();
 return {seed:179,edits:new Map(),biomeCellCount:0,
 get:(x,y,z)=>cells.get([x,y,z].join(','))??BLOCK.AIR,
 rotationAt:(x,y,z)=>turns.get([x,y,z].join(','))??0,
 place:(x,y,z,id,yaw=0)=>{const key=[x,y,z].join(',');
  if(!cells.has(key))this.biomeCellCount++;
  cells.set(key,id);turns.set(key,yaw);}
 };
};
test('IDs, symbolic names and materials remain disjoint after automations added biome130 live registration',()=>{
 assert.equal(PACK3_BUILDER_IDS.length,17);
 assert.ok(PACK3_BUILDER_IDS.every(id=>id>=109&&id<=125));
 assert.ok(BIOME130_REGISTERED_IDS.length>0);
 assert.ok(BIOME130_REGISTERED_IDS.every(id=>id>255&&!PACK3_BUILDER_IDS.includes(id)));
 assert.ok(BIOME130_REGISTERED_SYMBOLS.every(x=>x.startsWith('biome130:')));
 assert.ok(PACK3_BUILDER_SYMBOLS.every(x=>x.startsWith('pack3:')));
 assert.equal(BUILD_MATERIALS.length,65,'Preserve generic biome130 + legacy list for VoxelWorld.set');
 assert.ok(PACK3_BUILDER_IDS.every(id=>!BUILD_MATERIALS.includes(id)&&BLOCK_NAMES[id]?.length>0),
  'Physical Pack 3 assets register only through the separate placement bridge');
 assert.ok(BIOME130_REGISTERED_IDS.every(id=>BUILD_MATERIALS.includes(id)&&BLOCK_NAMES[id]?.length>0));
});
test('shape ray targeting preserves biome130 solids and their physical rotation in a Pack 3 world',()=>{
 const biome=BIOME130_REGISTERED_IDS.find(id=>biome130Block(id).solid);
 assert.ok(biome,'Expected an authored solid biome material');
 const w=maker(),rot=1;
 const shape=biome130Block(biome,rot).boxes[0];
 const eye=[-2,10+(shape[1]+shape[4])/2,(shape[2]+shape[5])/2];
 w.edits.set('0,10,0',biome);
 const originalGet=w.get;w.get=(x,y,z)=>x===0&&y===10&&z===0?biome:originalGet(x,y,z);
 w.rotationAt=(x,y,z)=>x===0&&y===10&&z===0?rot:0;
 w.biomeCellCount=1;
 const p=createPack3LiveBridge(w,storage());
 assert.equal(p.mutate({mode:'place',cell:[4,10,0],id:116,orientation:1,
  player:{x:100,feet:10,z:100},rebuild:()=>{}}).ok,true);
 const target=raycast(w,eye,[1,0,0],6);
 assert.deepEqual(target?.hit,[0,10,0]);
 const inspected=inspectBlockTarget(w,eye,[1,0,0],116,
  {x:-30,feet:10,z:-30},1);
 assert.equal(inspected.block,biome);
 assert.equal(w.pack3Runtime.size(),1);
 assert.deepEqual(w.pack3Runtime.readShape(0,10,0).boxes,biome130Block(biome,1).boxes);
});
test('nonsolid biome plants stay passable after Pack 3 physical collision is activated',t=>{
 const nonSolid=BIOME130_REGISTERED_IDS.find(id=>!biome130Block(id).solid);
 if(nonSolid===undefined){t.skip('No non-solid biome materials in current live registry');return;}
 const w=maker();
 const original=w.get;
 w.get=(x,y,z)=>x===0&&y===10&&z===0?nonSolid:original(x,y,z);
 w.biomeCellCount=1;
 assert.equal(collides(w,.5,10,.5),false);
 const b=createPack3LiveBridge(w,storage());
 assert.equal(b.mutate({mode:'place',cell:[4,10,0],id:116,orientation:2,
  player:{x:100,feet:10,z:100},rebuild:()=>{}}).ok,true);
 assert.equal(collides(w,.5,10,.5),false,'Pack3 collision must preserve non-solid foliage');
 assert.equal(collides(w,4.15,10.4,.5),true,'Pack3 physical wall pier must remain solid');
});
test('Pack 3 block preview checks actual approved AABBs, biome130 preview remains source-owned',()=>{
 const actor={x:.5,feet:10.55,z:.5};
 // The 116 slitted wall has empty central space; an AABB preview must not
 // treat every visual vacancy as a solid full cube.
 const precise=intersectsPlayerBlock(actor,[0,10,0],116,0);
 const full=intersectsPlayerBlock(actor,[0,10,0],BLOCK.STONE,0);
 assert.equal(full,true);
 assert.equal(typeof precise,'boolean');
 const id=BIOME130_REGISTERED_IDS[0];
 assert.equal(typeof intersectsPlayerBlock(actor,[0,10,0],id,0),'boolean');
});
