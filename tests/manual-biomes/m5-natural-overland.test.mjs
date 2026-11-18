import assert from 'node:assert/strict';
import {test} from 'node:test';
import {BLOCK} from '../../src/voxel.mjs';
import {FourRegionWorld,FOUR_REGION_GENERATOR,M2_FOUR_REGION_GENERATOR,
  M3_FOUR_REGION_GENERATOR,fourRegionProfile}
  from '../../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {loadExploration,mapCell,paintExploration,MAP_CELL_SIZE,mapStorageKey}
  from '../../src/exploration-map.mjs';
import {profiledDiscoveredCellInk}
  from '../../src/manual-biomes/exploration-ink.mjs';
import {planM5NaturalOverland,replayM5PhysicalWalk,M5_OVERLAND_TARGETS}
  from '../../src/manual-biomes/overland-walk-m5.mjs';

class Storage{
 state=new Map();
 get length(){return this.state.size;}
 getItem(k){return this.state.get(String(k))??null;}
 setItem(k,v){this.state.set(String(k),String(v));}
 removeItem(k){this.state.delete(String(k));}
}
const original=()=>new Pack2LiveWorld(new FourRegionWorld(179));
test('M5: source targets are exactly four physical cardinal biomes, no invented targets',()=>{
 assert.deepEqual(M5_OVERLAND_TARGETS.map(x=>x.name),
   ['desert','snow','mountain','enchanted']);
 for(const t of M5_OVERLAND_TARGETS){
   assert.ok(Math.hypot(t.x,t.z)>=480);
 }
 const world=original(),before=JSON.stringify(world.save());
 assert.throws(()=>planM5NaturalOverland(world,{target:'teleport'}),/Unknown/);
 assert.throws(()=>planM5NaturalOverland(world,{target:'desert',maxVisited:0}),/bounded/);
 assert.throws(()=>planM5NaturalOverland(world,{target:'desert',detourRadius:300}),/bounded/);
 assert.equal(JSON.stringify(world.save()),before);
});

test('M5: actual world bounded search cannot invent a successful route when budget exhausted',()=>{
 const world=original(),before=JSON.stringify(world.save());
 const p=planM5NaturalOverland(world,{target:'snow',maxVisited:1,maxSampled:6});
 assert.equal(p.ok,false,'bounded source search must report incomplete evidence');
 assert.equal(p.withoutTerrainEdits,true);
 assert.equal(typeof p.reason,'string');
 assert.equal(JSON.stringify(world.save()),before);
 assert.throws(()=>replayM5PhysicalWalk(world,p),/unsuccessful/);
});

test('M5: reconstructed path on genuine flat test WORLD requires actual stepPlayer replay',()=>{
 // Distinguish source algorithm unit check from the separate real FourRegionWorld
 // overland acceptance job. This artificial flat world may never be counted as
 // evidence that the game's distant authored biomes are traversable.
 const world={seed:179,get(_x,y,_z){return y<=0?BLOCK.STONE:BLOCK.AIR}};
 const result=planM5NaturalOverland(world,{target:'desert',maxVisited:2500,
   detourRadius:16,goalRadius:22});
 assert.equal(result.ok,true,JSON.stringify(result));
 assert.ok(result.path.length>=470);
 const physical=replayM5PhysicalWalk(world,result,{maxFramesPerCell:30});
 assert.equal(physical.ok,true,JSON.stringify(physical));
 assert.ok(physical.frames>result.path.length);
 assert.ok(physical.steps>=470);
});

test('M5: biome map source reads only real registered geology, and legacy uses unchanged ink',()=>{
 const versions=[M2_FOUR_REGION_GENERATOR,M3_FOUR_REGION_GENERATOR,FOUR_REGION_GENERATOR];
 for(const v of versions){
   const world=new Pack2LiveWorld(new FourRegionWorld(179,fourRegionProfile(179,v)));
   const sample=profiledDiscoveredCellInk(world,128,0,MAP_CELL_SIZE);
   assert.match(sample||'',/^#[0-9a-f]{6}$/i);
 }
 const legacy=new Pack2LiveWorld({
   seed:179,get(){throw Error('Legacy samples must not happen in new ink')}
 });
 assert.equal(profiledDiscoveredCellInk(legacy,128,0,MAP_CELL_SIZE),null);
});

test('M5: minimap fog MUST block all world voxel reads outside real discovered cells',()=>{
 const storage=new Storage(),seen=loadExploration(storage,179),source=original();
 const reads=[],world={
   seed:179,base:source.base,
   get(x,y,z){reads.push({x,y,z});return source.get(x,y,z)}
 };
 const styles=[];
 const ctx={
   imageSmoothingEnabled:false,fillStyle:'',
   fillRect(x,y,w,h){styles.push({x,y,w,h,color:this.fillStyle})},
   beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},stroke(){}
 };
 const canvas={width:192,height:192,getContext:()=>ctx};
 const avatar={x:512.5,z:.5,yaw:0};
 paintExploration(canvas,seen,world,avatar);
 assert.equal(reads.length,0,'fresh unvisited source must be entirely hidden');
 seen.reveal(avatar.x,avatar.z);
 assert.ok(seen.has(avatar.x,avatar.z));
 const prior=seen.seen.size;
 paintExploration(canvas,seen,world,avatar);
 assert.ok(reads.length>0);
 for(const {x,z} of reads){
   assert.ok(seen.has(x,z),'never read a fogged tile '+x+','+z);
 }
 assert.equal(seen.seen.size,prior,'painting must never reveal tiles');
 assert.equal(seen.flush(),true);
 assert.equal(JSON.parse(storage.getItem(mapStorageKey(179))).version,1);
 assert.equal(storage.getItem('mythwrought-v002-world-179'),null,
   'map discovery may never write canonical schema-1 saves');
 const restored=loadExploration(storage,179);
 assert.equal(restored.seen.size,prior);
 assert.equal(restored.has(512.5,.5),true);
 assert.equal(loadExploration(storage,7).seen.size,0,'another seed remains fogged');
});

test('M5: corrupted discovery records are read-only and cannot alter world profile/saves',()=>{
 const storage=new Storage(),k=mapStorageKey(179),raw='invalid json';
 storage.setItem(k,raw);
 const m=loadExploration(storage,179);
 assert.equal(m.readOnly,true);assert.equal(m.seen.size,0);
 m.reveal(512,0);
 assert.equal(m.flush(),false);
 assert.equal(storage.getItem(k),raw,'protected corrupt original remains unchanged');
});
