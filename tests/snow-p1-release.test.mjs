import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {FourRegionWorld,fourRegionProfile,SNOW_P1_GENERATOR,ENCHANTED_P2_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {ExperimentalSnowS17World} from '../s18-readonly/src/manual-biomes/snowy-s17-experimental-world.mjs';
import {FourRegionWorld as OldWorld,fourRegionProfile as oldProfile} from '../s18-readonly/src/manual-biomes/profile-world.mjs';
import {meshChunk as oldMesh} from '../s18-readonly/src/voxel.mjs';
import {meshChunk,BLOCK} from '../src/voxel.mjs';
import {SNOW_WIND_RENDER_TAG} from '../src/environment-ground.mjs';
import {STORYBOOK_ART_RULES,STORYBOOK_MATERIAL_FRAGMENT_SHADER} from '../src/storybook-materials.mjs';
import {M2_WORLD_MODE,planM2WorldChoice,openM2World,saveM2World,exportM2World,inspectM2WorldExport} from '../src/manual-biomes/m2-runtime-bridge.mjs';
import {readFourRegionProfile} from '../src/manual-biomes/profile-storage.mjs';
import {worldSlotKey,SELECTED_SEED_KEY} from '../src/seeds.mjs';
const bytes=m=>Buffer.from(m.buffer,m.byteOffset,m.byteLength);
function storage(){
 const values=new Map();
 return {get length(){return values.size},key:i=>[...values.keys()][i]??null,
  getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k),values};
}
test('Snow P1 explicit fresh-only profile, real mining/building persistence, old slots and export parity',()=>{
 const store=storage();
 const old=openM2World(store,planM2WorldChoice('179',M2_WORLD_MODE.CREATE_ENCHANTED_P2,{confirmed:true}));
 assert.equal(old.base.generationProfile.generator,ENCHANTED_P2_GENERATOR);
 assert.equal(old.world.set(0,18,0,BLOCK.STONE),true);
 assert.equal(saveM2World(store,old.world).ok,true);
 const protectedRows=[...store.values].filter(([k])=>k.startsWith(worldSlotKey(179)));
 const create=seed=>planM2WorldChoice(String(seed),M2_WORLD_MODE.CREATE_SNOW_P1,{confirmed:true});
 assert.throws(()=>planM2WorldChoice('2026',M2_WORLD_MODE.CREATE_SNOW_P1),/confirmation/);
 assert.throws(()=>openM2World(store,create(179)));
 const seed=2026,opened=openM2World(store,create(seed)),w=opened.world;
 assert.equal(opened.created,true);assert.equal(w.base.generationProfile.generator,SNOW_P1_GENERATOR);
 assert.equal(w.base.enchantedTreesEnabled,true);
 const mine=[-44,11,499],build=[-44,17,499];
 assert.equal(w.get(...mine),407);assert.equal(w.base.snowS17NaturalNeedleAt(...mine),407);
 assert.equal(w.get(...build),0);
 assert.equal(w.set(...mine,0),true);assert.equal(w.set(...build,3),true);
 assert.equal(w.base.snowS17NaturalNeedleAt(...mine),undefined);
 const status=saveM2World(store,w);assert.equal(status.ok,true,JSON.stringify(status));
 assert.equal(readFourRegionProfile(store,seed).profile.generator,SNOW_P1_GENERATOR);
 const r=openM2World(store,planM2WorldChoice(String(seed)));
 assert.equal(r.world.get(...mine),0);assert.equal(r.world.get(...build),3);
 assert.deepEqual(r.world.save(),w.save());
 const imported=inspectM2WorldExport(exportM2World(r.world));
 assert.equal(imported.world.base.generationProfile.generator,SNOW_P1_GENERATOR);
 assert.deepEqual(imported.world.save(),w.save());
 assert.deepEqual(imported.world.pack2Snapshot(),w.pack2Snapshot());
 assert.equal(r.world.set(...mine,407),true);
 assert.equal(r.world.base.snowS17NaturalNeedleAt(...mine),407);
 assert.equal(saveM2World(store,r.world).ok,true);
 assert.throws(()=>openM2World(store,create(seed)));
 assert.deepEqual(protectedRows.map(([k])=>[k,store.getItem(k)]),protectedRows);
 assert.equal(openM2World(store,planM2WorldChoice('179')).base.generationProfile.generator,ENCHANTED_P2_GENERATOR);
 console.log('SNOW_P1_PERSISTENCE '+JSON.stringify({seed,mine,build,oldSlotRows:protectedRows.length,profile:r.base.generationProfile.generator,saveReloadExport:true,occupiedSeedRefused:true}));
});
test('Registered Snow exact accepted experimental natural meshes, old profiles and wind ownership',()=>{
 let newBytes=0,oldBytes=0,wind=0;
 for(const seed of [179,2026]){
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,SNOW_P1_GENERATOR)),e=new ExperimentalSnowS17World(seed);
  for(const [cx,cz] of [[-3,31],[-2,32],[20,-114],[18,-128],[0,19],[-3,-33],[32,0]]){
   const a=meshChunk(w,cx,cz),b=oldMesh(e,cx,cz);
   assert.deepEqual(bytes(a),bytes(b),'Registered Snow differs from accepted S18 '+seed+' '+cx+','+cz);
   newBytes+=a.byteLength;
   for(let i=8;i<a.length;i+=9)if(a[i]===SNOW_WIND_RENDER_TAG)wind++;
  }
  for(const generator of [M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR]){
   const w=new FourRegionWorld(seed,fourRegionProfile(seed,generator)),o=new OldWorld(seed,oldProfile(seed,generator));
   for(const [cx,cz] of [[-3,31],[20,-114],[-3,-33]]){
    const a=meshChunk(w,cx,cz),b=oldMesh(o,cx,cz);
    assert.deepEqual(bytes(a),bytes(b));oldBytes+=a.byteLength;
    for(let i=8;i<a.length;i+=9)assert.notEqual(a[i],SNOW_WIND_RENDER_TAG);
   }
  }
 }
 assert.ok(wind>0);assert.equal(STORYBOOK_ART_RULES.renderOnlySnowWindMaterial,SNOW_WIND_RENDER_TAG);
 assert.ok(STORYBOOK_MATERIAL_FRAGMENT_SHADER.includes('vMat==44'));
 console.log('SNOW_P1_REGISTERED_PARITY '+JSON.stringify({newBytes,oldBytes,wind,tag:SNOW_WIND_RENDER_TAG}));
});
test('Both offline shells include exact Snow runtime dependencies and matching release',async()=>{
 const html=await readFile('index.html','utf8'),worker=await readFile('sw-m5.js','utf8'),update=await readFile('src/app-update.mjs','utf8');
 const manifest=JSON.parse(await readFile('nonblock-stage-assets.json','utf8')),stage=await readFile('sw-nonblock-stage.js','utf8');
 const release='20261124-snow-p1-v1';
 for(const s of [html,worker,update,stage])assert.ok(s.includes(release));
 assert.equal(manifest.version,release);
 const newPaths=['snowy-s17-fresh-source.mjs','snowy-s12-natural-conifer-prototypes.mjs','snowy-s14-edge-pigment.mjs','snowy-s10-single-mesh-scratch-pigment.mjs'].map(p=>'./src/manual-biomes/'+p);
 for(const p of newPaths){assert.ok(worker.includes(JSON.stringify(p)));assert.ok(manifest.assets[p]);}
 // Verify complete hash-addressed staging bank, not merely the new files.
 for(const [path,hash] of Object.entries(manifest.assets)){
  const raw=await readFile(path==='./'?'index.html':path);
  assert.equal(createHash('sha256').update(raw).digest('hex'),hash,'Staged asset mismatch '+path);
 }
 console.log('SNOW_P1_OFFLINE_CLOSURE '+JSON.stringify({release,assets:Object.keys(manifest.assets).length,newPaths}));
});
