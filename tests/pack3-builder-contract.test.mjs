// Pack 3 structure-blueprint handoff for future village/town/city builders.
// No settlement assembly, world edits, or integration of other block packs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {PACK3_BUILDER_SYMBOLS,PACK3_BUILDER_IDS,resolvePack3BuilderAsset,
 planPack3BuilderStructure} from '../src/builder-assets/pack3.mjs';
import {createPack3RuntimeStage} from '../src/builder-assets/pack3-runtime.mjs';
import {BIOME130_REGISTERED_IDS} from '../src/biome130-registry.mjs';
const air=seed=>({seed,edits:new Map(),get:()=>BLOCK.AIR});
test('all 17 approved symbolic families compile to real source-true geometry for settlement prefabs',()=>{
 const planned=PACK3_BUILDER_SYMBOLS.map((symbol,i)=>({
  asset:symbol,at:[i%6,Math.floor(i/6),0],
  orientation:i<4?0:i%4
 }));
 const result=planPack3BuilderStructure(planned,{origin:[-34,10,24]});
 assert.equal(result.cells.length,17);
 assert.ok(result.worldBoxes.length>17);
 assert.equal(result.livePlaced,false);assert.equal(result.saveWritten,false);
 const unique=new Set(result.cells.map(c=>c.at.join(',')));
 assert.equal(unique.size,17);
 const world=air(179),runtime=createPack3RuntimeStage(world,{worldId:'pack3-settlement-preview'});
 const handoff=result.cells.map(c=>({at:c.at,asset:c.asset,orientation:c.yaw}));
 assert.equal(runtime.placeMany(handoff),17);
 for(let i=0;i<result.cells.length;i++){
  const cell=result.cells[i],physical=resolvePack3BuilderAsset(cell.asset,cell.yaw);
  assert.equal(physical.blockId,PACK3_BUILDER_IDS[i]);
  assert.deepEqual(runtime.readShape(...cell.at).boxes,cell.shape.boxes);
  assert.equal(runtime.get(cell.at)?.id,physical.blockId);
  assert.equal(runtime.get(cell.at)?.yaw,cell.yaw);
 }
 assert.equal(world.edits.size,0);
 assert.equal(runtime.serialize().includes('pack3:'),true);
 assert.equal(result.worldBoxes.every(p=>p.box.every(Number.isFinite)),true);
});
test('building manifests reject unresolved or duplicate symbols/cells before runtime placement',()=>{
 const world=air(100),runtime=createPack3RuntimeStage(world,{worldId:'pack3-settlement-rejection'});
 for(const bad of ['pack3:099','pack1:023','biome130:023','pack3:080'])
  assert.throws(()=>planPack3BuilderStructure([{asset:bad,at:[0,0,0]}]));
 assert.throws(()=>planPack3BuilderStructure([{asset:'pack3:023',at:[0,0,0],orientation:'west'}]),RangeError);
 assert.throws(()=>planPack3BuilderStructure([
  {asset:'pack3:027',at:[0,0,0]},
  {asset:'pack3:028',at:[0,0,0]}
 ]),/Duplicate/);
 assert.equal(runtime.size(),0);
});
test('two symbolic catalogs cannot silently collide on future shared production ID registration',()=>{
 const ids=new Set(PACK3_BUILDER_IDS),symbols=new Set(PACK3_BUILDER_SYMBOLS);
 assert.equal(ids.size,17);assert.equal(symbols.size,17);
 assert.equal(BIOME130_REGISTERED_IDS.some(id=>ids.has(id)),false);
 for(const id of [...ids])assert.ok(id>=109&&id<=125);
 for(const symbol of [...symbols])assert.match(symbol,/^pack3:\d{3}$/);
});
