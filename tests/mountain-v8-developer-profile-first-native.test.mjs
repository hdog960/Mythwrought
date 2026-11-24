import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {BLOCK,meshChunk,worldKey,terrainHeight} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,M8_MOUNTAIN_GENERATOR,
 M7_ENVIRONMENT_GENERATOR,M6_BALANCED_GENERATOR,M5_EXPERIMENTAL_GENERATOR,
 FOUR_REGION_GENERATOR,M3_FOUR_REGION_GENERATOR,M2_FOUR_REGION_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {exportFourRegionWorld,inspectFourRegionExport,loadFourRegionWorld,
 saveFourRegionWorld,activateFourRegionProfile,BIOME_PROFILE_SUFFIX} from '../src/manual-biomes/profile-storage.mjs';
import {saveFingerprint} from '../src/persistence.mjs';
import {worldSlotKey} from '../src/seeds.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {mountainV8TileRoot} from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
const root=process.env.MYTHWROUGHT_P3_MAIN_ROOT;
if(!root)throw Error('Exact production checkout required');
const orig=await import(pathToFileURL(path.join(root,'src/manual-biomes/profile-world.mjs')).href);
const oldVoxel=await import(pathToFileURL(path.join(root,'src/voxel.mjs')).href);
const seed=179,profile=fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR);
const oldProfile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
const v8=new FourRegionWorld(seed,profile),m7=new FourRegionWorld(seed,oldProfile);
const original=new orig.FourRegionWorld(seed,orig.fourRegionProfile(seed,orig.M7_ENVIRONMENT_GENERATOR));
const top=w=>Math.max(...w.keys());
function findDelta(){
 for(const [tx0,tz0] of [[-88,24],[-80,-8]])for(let tz=tz0;tz<tz0+8;tz++)
 for(let tx=tx0;tx<tx0+8;tx++){
  const {rootX:x,rootZ:z}=mountainV8TileRoot(tx,tz,seed);
  const p=v8._columnPlan(x,z),q=m7._columnPlan(x,z);
  if(p.size&&q.size&&JSON.stringify([...p])!==JSON.stringify([...q])&&
    top(p)>=terrainHeight(x,z,seed)&&p.get(top(p))!==BLOCK.AIR)
   return {x,z,y:top(p),id:p.get(top(p))};
 }
 throw Error('No real Mountain V8 natural terrain delta found');
}
const site=findDelta();
const storage=()=>{const data=new Map();return {data,get length(){return data.size;},key(i){return [...data.keys()][i]??null;},getItem(k){return data.get(k)??null;},setItem(k,v){data.set(k,String(v));},removeItem(k){data.delete(k);}};};
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
test('distinct V8 identity and unchanged six historical explicit profiles/default',()=>{
 assert.notEqual(M8_MOUNTAIN_GENERATOR,M7_ENVIRONMENT_GENERATOR);
 assert.equal(fourRegionProfile(seed).generator,orig.fourRegionProfile(seed).generator);
 for(const generator of [M2_FOUR_REGION_GENERATOR,M3_FOUR_REGION_GENERATOR,FOUR_REGION_GENERATOR,M5_EXPERIMENTAL_GENERATOR,M6_BALANCED_GENERATOR,M7_ENVIRONMENT_GENERATOR]){
  const a=new FourRegionWorld(seed,fourRegionProfile(seed,generator));
  const b=new orig.FourRegionWorld(seed,orig.fourRegionProfile(seed,generator));
  assert.deepEqual(a.generationProfile,b.generationProfile);
  assert.deepEqual(a.save(),b.save());
  for(const [x,y,z] of [[0,5,0],[site.x,site.y,site.z],[40,9,63],[-16,-20,-1]])
   assert.equal(a.get(x,y,z),b.get(x,y,z),generator);
 }
});
test('actual V8 natural generation changes original physical mountain column with zero saved edits',()=>{
 const {x,y,z,id}=site;
 assert.equal(v6BiomeAt(x,z,seed).name,'mountain');
 assert.equal(v8.get(x,y,z),id);
 assert.notDeepEqual([...v8._columnPlan(x,z)],[...m7._columnPlan(x,z)]);
 assert.deepEqual(v8.save().edits,[]);
 const fresh=new FourRegionWorld(seed,profile);
 assert.equal(fresh.get(x,y,z),id);
 assert.deepEqual([...fresh._columnPlan(x,z)],[...v8._columnPlan(x,z)]);
 console.log('Mountain V8 source delta',JSON.stringify(site));
});
test('real mining delta and schema-1 restoration use the distinct V8 natural baseline',()=>{
 const w=new FourRegionWorld(seed,profile),{x,y,z,id}=site;
 assert.equal(w.set(x,y,z,BLOCK.AIR),true);
 assert.equal(w.get(x,y,z),BLOCK.AIR);
 assert.equal(w.naturalAndLandmarkBlock(x,y,z),id);
 assert.ok(w.edits.has(worldKey(x,y,z)));
 const r=restoreFourRegionWorld(w.save(),profile);
 assert.equal(r.get(x,y,z),BLOCK.AIR);
 assert.equal(r.naturalAndLandmarkBlock(x,y,z),id);
 assert.deepEqual(r.save(),w.save());
 const exported=inspectFourRegionExport(exportFourRegionWorld(w));
 assert.deepEqual(exported.save(),w.save());
 assert.equal(exported.generationProfile.generator,M8_MOUNTAIN_GENERATOR);
});
test('durable profile-aware save and reload in isolated in-memory storage fixture',()=>{
 const s=storage(),raw=JSON.stringify(profile),record=JSON.stringify({version:1,checksum:saveFingerprint(raw),raw});
 const key=worldSlotKey(seed)+BIOME_PROFILE_SUFFIX;
 // Existing V8 metadata fixture, NOT browser new-world admission.
 s.setItem(key,record);s.setItem(key+'-journal',record);
 const w=loadFourRegionWorld(s,seed).world;
 assert.equal(w.generationProfile.generator,M8_MOUNTAIN_GENERATOR);
 assert.equal(w.set(site.x,site.y,site.z,BLOCK.AIR),true);
 const status=saveFourRegionWorld(s,w);
 assert.equal(status.ok,true,JSON.stringify(status));
 const reload=loadFourRegionWorld(s,seed).world;
 assert.deepEqual(reload.save(),w.save());
 assert.deepEqual(reload.generationProfile,profile);
 assert.equal(reload.get(site.x,site.y,site.z),BLOCK.AIR);
});
test('generic V8 browser seed creation remains blocked pending real cross-store ownership',()=>{
 const s=storage();
 assert.throws(()=>activateFourRegionProfile(s,2026,{explicitNewWorld:true,generator:M8_MOUNTAIN_GENERATOR}),/not yet enabled/);
 assert.equal(s.length,0);
});
test('original cave AIR and deep substrate preserved; original M7-only RGB halo not granted to V8',()=>{
 for(const [x,y,z] of [[40,9,63],[-16,-20,-1],[0,-100,0],[-786,4,-1774]])
  assert.equal(v8.get(x,y,z),m7.get(x,y,z));
 assert.equal(m7.get(40,9,63),BLOCK.AIR);
 assert.equal(v8.get(40,9,63),BLOCK.AIR);
 assert.ok(desertSeamEditAffectedChunks(m7,-786,-1774,4).some(c=>c.cx===-50&&c.cz===-112));
 assert.ok(!desertSeamEditAffectedChunks(v8,-786,-1774,4).some(c=>c.cx===-50&&c.cz===-112));
});
test('actual original mesh ABI and historic M7 Desert mesh bytes are unchanged; V8 CPU mesh within upload guard',()=>{
 const a=meshChunk(m7,-50,-112),b=oldVoxel.meshChunk(original,-50,-112);
 assert.equal(hash(a),hash(b));
 const mesh=meshChunk(v8,Math.floor(site.x/16),Math.floor(site.z/16));
 assert.ok(mesh instanceof Float32Array&&mesh.length>0&&mesh.length%9===0);
 assert.ok(mesh.byteLength<=8*1024*1024);
 console.log('V8 actual CPU mesh bytes',mesh.byteLength);
});
