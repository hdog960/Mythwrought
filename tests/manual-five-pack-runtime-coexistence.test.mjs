import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides,raycast} from '../src/voxel.mjs';
import {BIOME130_REGISTERED_IDS,biome130Block} from '../src/biome130-registry.mjs';
import {Pack2LiveWorld,savePack2LiveWorld} from '../src/pack2-world.mjs';
import {pack2NormalizeState} from '../src/pack2-integration.mjs';
import {createPack3LiveBridge} from '../src/builder-assets/pack3-live.mjs';
import {createPack5LiveAdapter} from '../src/pack5-integration/live-adapter.mjs';

function storage(){
 const map=new Map();
 return {getItem:k=>map.has(k)?map.get(k):null,
  setItem:(k,v)=>{map.set(k,String(v));},
  removeItem:k=>map.delete(k),keys:()=>[...map.keys()]};
}
test('real Pack 2 + Pack 3 + Pack 5 overlays coexist with biome130 and schema-1',()=>{
 const base=new VoxelWorld(179),world=new Pack2LiveWorld(base),store=storage();
 const water=[500,19,500],rock=[530,19,500],pier=[510,19,500],furnishing=[520,19,500];
 for(const cell of [water,rock,pier,furnishing])
  assert.equal(base.get(...cell),BLOCK.AIR,'source world must be free before test');
 assert.equal(world.placePack2(...water,76,pack2NormalizeState(76,{level:4,flow:'east'})),true);
 assert.equal(world.set(...rock,BIOME130_REGISTERED_IDS[0],1),true);
 const originallySaved=JSON.stringify(world.save());
 const physical=createPack3LiveBridge(world,store);
 assert.equal(physical.mutate({mode:'place',cell:pier,id:116,orientation:0,
  player:{x:1e6,feet:19,z:1e6},rebuild:()=>{}}).ok,true);
 assert.equal(physical.getAt(...pier).id,116);
 assert.equal(collides(world,500.5,19,500.5),false,'Passable Pack 2 water must stay passable with Pack 3 active');
 assert.equal(collides(world,510.15,19.4,500.5),true,'Pack 3 authored pier must collide');
 const interior=createPack5LiveAdapter(world,{storage:store});
 assert.equal(interior.layer.place('pack5:080',furnishing).ok,true);
 interior.save();
 world.pack5Collision=box=>interior.collision(box);
 assert.equal(collides(world,520.5,19.1,500.5),true,'Pack 5 physical furnish must collide');
 assert.equal(world.get(...pier),BLOCK.AIR,'Pack 3 overlay never writes a fake block to terrain');
 assert.equal(world.get(...furnishing),BLOCK.AIR,'Pack 5 overlay never writes a fake block to terrain');
 assert.equal(world.get(...water),76,'Pack 2 static water persists');
 assert.equal(world.get(...rock),BIOME130_REGISTERED_IDS[0],'Existing biome stays registered');
 assert.equal(biome130Block(world.get(...rock),1).symbol,'biome130:001');
 assert.equal(JSON.stringify(world.save()),originallySaved,'Old schema-1 saved-world bytes are unchanged');
 assert.equal(world.save().schema,1);
 assert.equal(savePack2LiveWorld(store,world).ok,true);
 assert.ok(store.keys().some(k=>k.includes('pack3-construction')),'Pack 3 separately persisted');
 assert.ok(store.keys().some(k=>k.includes('pack5.builder')),'Pack 5 separately persisted');
 assert.equal(raycast(world,[500.5,19.5,498.5],[0,0,1],6)?.hit.join(','),water.join(','),
  'Nearest Pack 2 water ray remains source-accurate with Pack 3 active elsewhere');
});
