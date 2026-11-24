import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR,M8_MOUNTAIN_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {meshChunk} from '../src/voxel.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
const root=process.env.MOUNTAIN_PRODUCTION_ROOT;
assert.ok(root);
const old=await import(pathToFileURL(path.join(root,'src/manual-biomes/profile-world.mjs')).href);
const vox=await import(pathToFileURL(path.join(root,'src/voxel.mjs')).href);
const hash=b=>createHash('sha256').update(b).digest('hex');
const bytes=m=>Buffer.from(m.buffer,m.byteOffset,m.byteLength);
const seed=179;
test('current production M7 and Enchanted P2 retain exact source, save and sampled mesh bytes',()=>{
 for(const gen of [M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR]){
  const a=new FourRegionWorld(seed,fourRegionProfile(seed,gen)),b=new old.FourRegionWorld(seed,old.fourRegionProfile(seed,gen));
  assert.deepEqual(a.save(),b.save());
  assert.equal(a.enchantedTreesEnabled,b.enchantedTreesEnabled);
  for(const [cx,cz] of [[-3,-33],[-30,0],[-50,-112]]){
    assert.equal(hash(bytes(meshChunk(a,cx,cz))),hash(bytes(vox.meshChunk(b,cx,cz))),gen+' '+cx+','+cz);
  }
 }
});
test('V8 inherits actual current forest trees without aliasing the historical profiles',()=>{
 const a=new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR)),b=new old.FourRegionWorld(seed,old.fourRegionProfile(seed,ENCHANTED_P2_GENERATOR));
 assert.equal(a.enchantedTreesEnabled,true);
 assert.notEqual(a.generationProfile.generator,b.generationProfile.generator);
 a._environmentTreeAt(-48,19,-528);b._environmentTreeAt(-48,19,-528);
 const aa=a._environmentTreeChunks.get('-3,-33'),bb=b._environmentTreeChunks.get('-3,-33');
 assert.ok(aa?.size>0&&bb?.size>0);
 assert.deepEqual([...aa],[...bb]);
 assert.equal(a.get(-470,13,5),370);
 assert.equal(a.mountainV8SupportedTreeCells(-470,13,5).length,13);
 assert.equal(a.save().edits.length,0);
 assert.ok(!desertSeamEditAffectedChunks(a,-786,-1774,4).some(c=>c.cx===-50&&c.cz===-112));
 console.log('V8 inherited forest cell count',aa.size);
});
test('candidate nonblock manifest verifies every actual asset and includes seven new Mountain modules',()=>{
 const m=JSON.parse(readFileSync(new URL('../nonblock-stage-assets.json',import.meta.url)));
 const read=p=>readFileSync(new URL('../'+(p==='./'?'index.html':p.slice(2)),import.meta.url));
 assert.equal(m.version,'20261124-v39-mountain09');
 for(const [p,h] of Object.entries(m.assets))assert.equal(hash(read(p)),h,p);
 assert.equal(Object.keys(m.assets).filter(p=>p.includes('/mountain-v8-')).length,7);
 console.log('V8 verified staged manifest entries',Object.keys(m.assets).length);
});
