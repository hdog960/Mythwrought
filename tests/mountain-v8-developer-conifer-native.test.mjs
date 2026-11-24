import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,meshChunk,raycast,terrainHeight,worldKey} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR,M7_ENVIRONMENT_GENERATOR,restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {biome130Block,BIOME130_REGISTERED_IDS} from '../src/biome130-registry.mjs';
import {ENVIRONMENT_GROUND} from '../src/environment-ground.mjs';
import {MANUAL_FIVE_PACK_NUMERIC_IDS} from '../src/builder-assets/manual-five-pack.mjs';
import {MOUNTAIN_V8_PINE as pine} from '../src/manual-biomes/mountain-v8-runtime-conifers.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {mountainV8TileRoot} from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
const seed=179,profile=fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR),w=new FourRegionWorld(seed,profile);
let site;
function find(){
 if(site)return site;
 // Bounded actual natural mountain chunk search; prioritize known seed179 atlas.
 for(const [cx0,cz0,n] of [[-44,12,4],[-40,-4,4],[-40,-8,16],[-40,8,16],[-48,-8,16]])
 for(let cz=cz0;cz<cz0+n;cz++)for(let cx=cx0;cx<cx0+n;cx++){
  if(v6BiomeAt(cx*16+8,cz*16+8,seed)?.name!=='mountain')continue;
  w._mountainV8ConiferAt(cx*16+8,19,cz*16+8);
  const cells=w._mountainV8ConiferChunks.get(cx+','+cz);
  if(!cells?.size)continue;
  for(const [key,id] of cells){
   if(id!==pine.trunk)continue;
   const [x,y,z]=key.split(',').map(Number);
   if(cells.get(worldKey(x,y-1,z))===pine.trunk)continue;
   site={cx,cz,x,y,z,cells:new Map(cells)};
   console.log('actual V8 natural conifer',JSON.stringify({cx,cz,x,y,z,count:cells.size}));
   return site;
  }
 }
 throw Error('No genuine natural conifer in bounded real mountain search');
}
test('existing pine physical material ownership and broad manual reservation remain separate',()=>{
 assert.deepEqual(pine,{trunk:511,needles:512});
 assert.equal(biome130Block(370).name,'Pine logs');
 assert.equal(biome130Block(370).solid,true);
 assert.equal(biome130Block(379).solid,false);
 const ids=[...Object.values(BLOCK),...MANUAL_FIVE_PACK_NUMERIC_IDS,...BIOME130_REGISTERED_IDS,...Object.values(ENVIRONMENT_GROUND),255,65535];
 assert.equal(ids.length,258);assert.equal(new Set(ids).size,258);
 assert.ok(MANUAL_FIVE_PACK_NUMERIC_IDS.every(id=>id>=9&&id<=226));
});
test('real natural conifer uses full authored pattern within negative owner chunk with no saved edits',()=>{
 const {cx,cz,x,y,z,cells}=find();
 assert.equal([...cells.values()].filter(id=>id===pine.trunk||id===pine.needles).length%13,0);
 const own=[...cells].filter(([k])=>{const [a,b,c]=k.split(',').map(Number);return Math.abs(a-x)<=1&&Math.abs(c-z)<=1&&b>=y&&b<=y+4;});
 assert.equal(own.length,13);
 assert.equal(own.filter(([,id])=>id===pine.trunk).length,3);
 assert.equal(own.filter(([,id])=>id===pine.needles).length,10);
 assert.equal(w.get(x,y-1,z),503);
 for(const [k,id] of own){
  const [a,b,c]=k.split(',').map(Number);
  assert.equal(Math.floor(a/16),cx);assert.equal(Math.floor(c/16),cz);
  assert.equal(v6BiomeAt(a,c,seed).name,'mountain');
  assert.equal(w.get(a,b,c),id);
 }
 assert.deepEqual(w.save().edits,[]);
});
test('fresh V8 world reconstructs complete deterministic conifer, historical M7 does not install V8 layer',()=>{
 const {x,y,z,cx,cz,cells}=find();
 const fresh=new FourRegionWorld(seed,profile);
 assert.equal(fresh.get(x,y,z),pine.trunk);
 assert.deepEqual([...fresh._mountainV8ConiferChunks.get(cx+','+cz)],[...cells]);
 const old=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
 assert.equal(old.hasNaturalNonCubeShapes,false);
 assert.equal(old._mountainV8ConiferChunks,undefined);
 assert.notEqual(old.get(x,y,z),pine.trunk);
});
test('actual natural pine ray uses narrow source shape even with zero edit rows and through original Pack2 wrapper',()=>{
 const {x,y,z}=find();
 const eye=[x+.001,y+.5,z+.5],dir=[1,0,0];
 for(const world of [w,new Pack2LiveWorld(w)]){
  const hit=raycast(world,eye,dir,1);
  assert.ok(hit);assert.deepEqual(hit.hit,[x,y,z]);
  assert.ok(hit.distance>.01&&hit.distance<1,JSON.stringify(hit));
 }
 assert.equal(w.biomeCellCount,0);
});
test('natural noncube mining edit persists and restores without changing unedited source tree',()=>{
 const {x,y,z}=find(),fresh=new FourRegionWorld(seed,profile);
 assert.equal(fresh.get(x,y,z),pine.trunk);
 assert.equal(fresh.set(x,y,z,BLOCK.AIR),true);
 assert.equal(fresh.get(x,y,z),BLOCK.AIR);
 const restored=restoreFourRegionWorld(fresh.save(),profile);
 assert.equal(restored.get(x,y,z),BLOCK.AIR);
 assert.equal(restored.naturalAndLandmarkBlock(x,y,z),pine.trunk);
 assert.deepEqual(restored.save(),fresh.save());
});
test('real V8 conifer chunk uses original packed mesh and remains below upload ceiling',()=>{
 const {cx,cz}=find(),m=meshChunk(w,cx,cz);
 assert.ok(m instanceof Float32Array&&m.length>0&&m.length%9===0);
 assert.ok(m.byteLength<=8*1024*1024);
 console.log('actual V8 conifer chunk CPU bytes',m.byteLength);
});
