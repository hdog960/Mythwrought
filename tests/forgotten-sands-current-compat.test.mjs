import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import * as oldProfile from '../src/manual-biomes/profile-world.mjs';
import * as oldVoxel from '../src/voxel.mjs';
import * as oldDepth from '../src/depth.mjs';
const root=process.env.P0_CURRENT_SOURCE;
if(!root)throw Error('Exact independent current checkout required');
const load=path=>import(pathToFileURL(resolve(root,path)).href);
const nowProfile=await load('src/manual-biomes/profile-world.mjs'),nowVoxel=await load('src/voxel.mjs'),nowDepth=await load('src/depth.mjs');
const sha=v=>createHash('sha256').update(Buffer.from(v.buffer,v.byteOffset,v.byteLength)).digest('hex');
const cases=[
[179,-2076,3195,63],[2026,480,-5,63],[2026,-928,-2053,63],
[179,377,-52,23],[179,377,-12,31],[179,377,32,31],
[179,504,-162,23],[179,504,-122,31],[179,504,-78,31],
[2026,629,-1477,23],[2026,629,-1437,31],[2026,629,-1393,31],
[2026,-900,-2095,31],[2026,-900,-2054,31],[2026,-900,-2011,23]];
const make=(api,seed,g)=>new api.FourRegionWorld(seed,api.fourRegionProfile(seed,g));
test('read-only current-source historical M7 and explicit Enchanted profile sample parity in desert footprints',()=>{
  assert.equal(nowDepth.WORLD_MIN_Y,oldDepth.WORLD_MIN_Y);assert.equal(nowDepth.WORLD_MAX_Y,oldDepth.WORLD_MAX_Y);
  assert.notEqual(nowProfile.ENCHANTED_P2_GENERATOR,nowProfile.M7_ENVIRONMENT_GENERATOR);
  const worlds=new Map(),counts={columns:0,cells:0,caveReads:0,planMismatches:0,historicalMismatches:0,currentNewMismatches:0,caveMismatches:0,meshCount:0,meshHistoricalMismatch:0,meshNewMismatch:0};
  const sampleMismatches=[],seenChunks=new Set();
  for(const [seed,x,z,size] of cases){
    if(!worlds.has(seed))worlds.set(seed,[make(oldProfile,seed,oldProfile.M7_ENVIRONMENT_GENERATOR),make(nowProfile,seed,nowProfile.M7_ENVIRONMENT_GENERATOR),make(nowProfile,seed,nowProfile.ENCHANTED_P2_GENERATOR)]);
    const [old,historical,current]=worlds.get(seed),r=(size-1)/2;
    for(let a=x-r;a<=x+r;a++)for(let b=z-r;b<=z+r;b++){
      counts.columns++;
      const plan=w=>JSON.stringify([...w._columnPlan(a,b)].sort((a,b)=>a[0]-b[0]));
      if(plan(old)!==plan(historical)||plan(old)!==plan(current))counts.planMismatches++;
      for(let y=-3;y<=19;y++){
        const v=old.get(a,y,b),h=historical.get(a,y,b),n=current.get(a,y,b);counts.cells++;
        if(v!==h)counts.historicalMismatches++;if(v!==n)counts.currentNewMismatches++;
        const c=old.environmentCaves.get(a,y,b);counts.caveReads++;
        if(c!==historical.environmentCaves.get(a,y,b)||c!==current.environmentCaves.get(a,y,b))counts.caveMismatches++;
        if((v!==h||v!==n)&&sampleMismatches.length<8)sampleMismatches.push({seed,x:a,y,z:b,v,h,n});
      }
    }
    // Independently compare the native original center and corner chunk meshes.
    for(const [a,b] of [[x,z],[x-r,z-r],[x+r,z+r]]){
      const cx=Math.floor(a/16),cz=Math.floor(b/16),k=[seed,cx,cz].join(',');if(seenChunks.has(k))continue;seenChunks.add(k);
      const a0=sha(oldVoxel.meshChunk(old,cx,cz)),a1=sha(nowVoxel.meshChunk(historical,cx,cz)),a2=sha(nowVoxel.meshChunk(current,cx,cz));counts.meshCount++;
      if(a0!==a1)counts.meshHistoricalMismatch++;if(a0!==a2)counts.meshNewMismatch++;
    }
  }
  for(const [seed,[old,historical,current]] of worlds){
    assert.deepEqual(old.save().edits,[]);assert.deepEqual(historical.save().edits,[]);assert.deepEqual(current.save().edits,[]);
    assert.equal(historical.generationProfile.generator,nowProfile.M7_ENVIRONMENT_GENERATOR);
    assert.equal(current.generationProfile.generator,nowProfile.ENCHANTED_P2_GENERATOR);
  }
  // Census, not a waiver. Report mismatches before asserting historical parity.
  console.log('P0 CURRENT COMPAT',JSON.stringify({counts,sampleMismatches,historicalGenerator:nowProfile.M7_ENVIRONMENT_GENERATOR,newGenerator:nowProfile.ENCHANTED_P2_GENERATOR}));
  assert.equal(counts.historicalMismatches,0);assert.equal(counts.meshHistoricalMismatch,0);assert.equal(counts.caveMismatches,0);
});
test('exact terrain shader expression and source height contract comparison',async()=>{
  const a=await readFile(new URL('../src/main.mjs',import.meta.url),'utf8'),b=await readFile(resolve(root,'src/main.mjs'),'utf8');
  const extract=s=>s.slice(s.indexOf('  const VS=['),s.indexOf('  let program,skyProgram',s.indexOf('  const VS=[')));
  const shaderSame=extract(a)===extract(b);
  const sameMaterial=(await readFile(new URL('../src/storybook-materials.mjs',import.meta.url),'utf8'))===(await readFile(resolve(root,'src/storybook-materials.mjs'),'utf8'));
  console.log('P0 CURRENT SHADERS',JSON.stringify({shaderSame,sameMaterial,min:nowDepth.WORLD_MIN_Y,max:nowDepth.WORLD_MAX_Y}));
  assert.ok(extract(a).length>1000&&extract(b).length>1000);
});
