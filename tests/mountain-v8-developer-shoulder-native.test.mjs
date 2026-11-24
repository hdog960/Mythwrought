import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {BLOCK,meshChunk,terrainHeight} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR,M7_ENVIRONMENT_GENERATOR,restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {MOUNTAIN_V8_EXISTING_PINE as pine} from '../src/manual-biomes/mountain-v8-runtime-conifers.mjs';
import {createHash} from 'node:crypto';
const oldRoot=process.env.MOUNTAIN_V8_PREVIOUS_ROOT;
assert.ok(oldRoot);
const old=await import(pathToFileURL(path.join(oldRoot,'src/manual-biomes/profile-world.mjs')).href);
const oldVoxel=await import(pathToFileURL(path.join(oldRoot,'src/voxel.mjs')).href);
const seed=179,profile=fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR);
const current=new FourRegionWorld(seed,profile),previous=new old.FourRegionWorld(seed,old.fourRegionProfile(seed,old.M8_MOUNTAIN_GENERATOR));
const m7=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const top=(p,x,z)=>p.size?Math.max(...p.keys()):terrainHeight(x,z,seed);
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
test('actual source mountain shoulder transects feather accepted height differences toward M7',()=>{
 let sampled=0,changed=0,closer=0,oldError=0,newError=0,largestOld=0,largestNew=0;
 const examples=[];
 // Real seed179 near west mountain boundary; sample many transects at
 // both signs of z, with five original biome samples per candidate.
 for(let z=-180;z<=180;z+=9)for(let x=-350;x<=-180;x+=2){
   const r=v6BiomeAt(x,z,seed);
   if(r?.name!=='mountain'||r.weight<.82||r.weight>=.99)continue;
   const oldPlan=previous._columnPlan(x,z),basePlan=m7._columnPlan(x,z);
   const next=current._columnPlan(x,z);
   const a=top(oldPlan,x,z),b=top(basePlan,x,z),c=top(next,x,z);
   const delta=Math.abs(a-b),now=Math.abs(c-b);
   sampled++;oldError+=delta;newError+=now;
   largestOld=Math.max(largestOld,delta);largestNew=Math.max(largestNew,now);
   assert.ok(c>=Math.min(a,b)&&c<=Math.max(a,b),JSON.stringify({x,z,a,b,c}));
   assert.ok(now<=delta);
   if(c!==a){changed++;if(now<delta)closer++;if(examples.length<5)examples.push({x,z,before:a,shoulder:b,after:c});}
 }
 console.log('V8 actual shoulder census',JSON.stringify({sampled,changed,closer,oldError,newError,largestOld,largestNew,examples}));
 assert.ok(sampled>20&&changed>0&&closer>0&&newError<oldError);
});
test('interior seed179 natural tree and terrain source remain canonical',()=>{
 assert.deepEqual([...current._columnPlan(-470,5)],[...previous._columnPlan(-470,5)]);
 assert.equal(current.get(-470,13,5),pine.trunk);
 assert.equal(current.get(-470,12,5),BLOCK.GRASS);
 assert.deepEqual(current.mountainV8SupportedTreeCells(-470,13,5),previous.mountainV8SupportedTreeCells(-470,13,5));
 assert.deepEqual(current.save().edits,[]);
 assert.deepEqual(restoreFourRegionWorld(current.save(),profile).save(),current.save());
});
test('historical M7 exact original mesh bytes and original Desert halo remain unchanged',()=>{
 const p=new old.FourRegionWorld(seed,old.fourRegionProfile(seed,old.M7_ENVIRONMENT_GENERATOR));
 for(const [cx,cz] of [[-50,-112],[-30,0]])assert.equal(hash(meshChunk(m7,cx,cz)),hash(oldVoxel.meshChunk(p,cx,cz)));
 assert.ok(desertSeamEditAffectedChunks(m7,-786,-1774,4).some(c=>c.cx===-50&&c.cz===-112));
 assert.ok(!desertSeamEditAffectedChunks(current,-786,-1774,4).some(c=>c.cx===-50&&c.cz===-112));
});
test('V8 actual natural cave AIR and deep substrate remain unchanged',()=>{
 for(const [x,y,z] of [[40,9,63],[-16,-20,-1],[0,-100,0],[-786,4,-1774]])assert.equal(current.get(x,y,z),previous.get(x,y,z));
 assert.equal(current.get(40,9,63),BLOCK.AIR);
});
test('V8 actual unified terrain mesh has valid finite original nine-float ABI and stays within upload guard',()=>{
 const m=meshChunk(current,-30,0);
 assert.ok(m instanceof Float32Array&&m.length>0&&m.length%9===0&&m.every(Number.isFinite));
 assert.ok(m.byteLength<=8*1024*1024);
 console.log('V8 unified terrain mesh bytes',m.byteLength);
});
