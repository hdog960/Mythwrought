// Actual source-authorized V8 natural tree mining. No synthetic trees.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,worldKey,meshChunk,raycast} from '../src/voxel.mjs';
import {applyBlockAction} from '../src/blocks.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR,M7_ENVIRONMENT_GENERATOR,restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {MOUNTAIN_V8_PINE as pine} from '../src/manual-biomes/mountain-v8-runtime-conifers.mjs';
import {MOUNTAIN_V8_PLANT_PATTERNS} from '../src/manual-biomes/mountain-v8-vegetation-cells.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {verticalEditSections,depthMeshKey} from '../src/depth.mjs';
const seed=179,x=-470,y=13,z=5,profile=fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR);
const natural=MOUNTAIN_V8_PLANT_PATTERNS['dwarf-conifer'].map(([dx,dy,dz,m])=>({cell:[x+dx,y-1+dy,z+dz],id:m==='conifer-trunk'?pine.trunk:pine.needles}));
const keys=c=>c.map(v=>v.join(',')).sort();
function fixture(){
 const base=new FourRegionWorld(seed,profile),world=new Pack2LiveWorld(base);
 for(const {cell,id} of natural)assert.equal(world.get(...cell),id,cell.join(','));
 assert.equal(world.get(x,y-1,z),503);
 return {base,world};
}
function mine(world,rebuild,at=y){
 return applyBlockAction(world,[x+.001,at+.5,z+.5],[1,0,0],'mine',BLOCK.STONE,
  {x:x-3,feet:at,z:z+.5},rebuild);
}
test('actual V8 natural trunk mining removes all thirteen original cells and persists canonical AIR edits',()=>{
 const {world,base}=fixture();
 const before=meshChunk(world,-30,0);let callbacks=0;
 const r=mine(world,(a,c,b,cells)=>{
  callbacks++;assert.deepEqual([a,b,c],[x,y,z]);
  assert.deepEqual(keys(cells),keys(natural.map(e=>e.cell)));
  assert.ok(cells.every(cell=>world.get(...cell)===BLOCK.AIR));
  // Rebuild real opaque CPU mesh once for the affected owner chunk.
  const after=meshChunk(world,-30,0);
  assert.ok(after.length%9===0&&after.byteLength<before.byteLength);
 });
 assert.equal(r.ok,true,r.reason);assert.equal(callbacks,1);
 assert.equal(world.save().edits.length,13);
 const restored=restoreFourRegionWorld(world.save(),profile);
 assert.deepEqual(restored.save(),world.save());
 for(const {cell,id} of natural){
  assert.equal(restored.get(...cell),BLOCK.AIR);
  assert.equal(restored.naturalAndLandmarkBlock(...cell),id);
 }
 assert.equal(base.biomeCellCount,0);
 console.log('V8 real supported conifer',JSON.stringify({root:[x,y,z],removed:r.affectedCells.length,beforeBytes:before.byteLength,afterBytes:meshChunk(world,-30,0).byteLength}));
});
test('ground support removal uses one real action with fourteen affected cells',()=>{
 const {world}=fixture();
 const eye=[x+.01,y+.01,z+.01],dir=[0,-1,0];
 const hit=raycast(world,eye,dir,2);
 assert.deepEqual(hit.hit,[x,y-1,z]);
 const r=applyBlockAction(world,eye,dir,'mine',BLOCK.STONE,{x:x-3,feet:y,z},(a,c,b,cells)=>{
  assert.deepEqual([a,b,c],[x,y-1,z]);assert.equal(cells.length,14);
  assert.equal(new Set(keys(cells)).size,14);
 });
 assert.equal(r.ok,true,r.reason);assert.equal(world.save().edits.length,14);
 assert.equal(world.get(x,y-1,z),BLOCK.AIR);
 assert.ok(natural.every(({cell})=>world.get(...cell)===BLOCK.AIR));
 const restored=restoreFourRegionWorld(world.save(),profile);
 assert.deepEqual(restored.save(),world.save());
});
test('real supported-tree failure restores original source and existing edit/rotation bytes',()=>{
 const {base,world}=fixture();
 const preserved=natural.find(e=>e.id===pine.needles).cell;
 assert.equal(world.set(...preserved,370,2),true);
 const before=JSON.stringify(world.save()),count=base.biomeCellCount;
 let calls=0;
 const r=mine(world,(a,c,b,cells)=>{
  calls++;assert.equal(cells.length,12);
  assert.equal(world.get(...preserved),370);
  throw Error('synthetic rebuild failure in actual block action');
 });
 assert.equal(r.ok,false);assert.match(r.error,/synthetic rebuild failure/);
 assert.equal(calls,1);
 assert.equal(JSON.stringify(world.save()),before);
 assert.equal(base.biomeCellCount,count);
 assert.equal(world.rotationAt(...preserved),2);
 assert.equal(world.get(x,y,z),pine.trunk);
 for(const {cell,id} of natural)if(cell.join(',')!==preserved.join(','))assert.equal(world.get(...cell),id);
});
test('player authored replacement and real Pack2 water survive natural tree removal',()=>{
 const {world}=fixture();
 const leaf=natural.filter(e=>e.id===pine.needles);
 const stone=leaf[0].cell,water=leaf[1].cell;
 assert.equal(world.set(...stone,BLOCK.STONE),true);
 assert.equal(world.set(...water,BLOCK.AIR),true);
 assert.equal(world.placePack2(...water,76,{level:3,flow:'still'}),true);
 const saved=JSON.stringify(world.pack2Snapshot());
 const r=mine(world,(a,c,b,cells)=>assert.equal(cells.length,11));
 assert.equal(r.ok,true,r.reason);
 assert.equal(world.get(...stone),BLOCK.STONE);
 assert.equal(world.get(...water),76);
 assert.equal(JSON.stringify(world.pack2Snapshot()),saved);
});
test('direct set and historical M7 remain single-cell; edited trunk is not a natural felling trigger',()=>{
 const {world,base}=fixture();
 assert.equal(world.set(x,y,z,BLOCK.AIR),true);
 assert.equal(world.get(x,y+1,z),pine.trunk);
 assert.equal(world.save().edits.length,1);
 assert.equal(world.set(x,y,z,BLOCK.STONE),true);
 assert.deepEqual(base.mountainV8SupportedTreeCells(x,y,z),[]);
 const old=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
 assert.deepEqual(old.mountainV8SupportedTreeCells(x,y,z),[]);
});
test('all natural felling cells have deterministic original dirty section union including negative chunk',()=>{
 const {world}=fixture();
 const affected=world.base.mountainV8SupportedTreeCells(x,y,z);
 const dirty=new Set();
 for(const [a,b,c] of affected)
  for(const section of verticalEditSections(b))
   for(const {cx,cz} of desertSeamEditAffectedChunks(world,a,c,b))
    dirty.add(depthMeshKey(cx,cz,section));
 assert.ok(dirty.has('-30,0'));
 assert.equal(affected.length,13);
 assert.equal(new Set(affected.map(c=>worldKey(...c))).size,13);
 console.log('V8 supported felling dirty keys',JSON.stringify([...dirty].sort()));
});
