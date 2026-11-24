import test from 'node:test';
import assert from 'node:assert/strict';
import {ExperimentalSnowS17World} from '../src/manual-biomes/snowy-s17-experimental-world.mjs';
import {ExperimentalSnowS17World as PriorSnow} from '../s17-readonly/src/manual-biomes/snowy-s17-experimental-world.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {meshChunk} from '../src/voxel.mjs';
import {meshChunk as previousMesh} from '../s17-readonly/src/voxel.mjs';
import {FourRegionWorld as PriorWorld,fourRegionProfile as priorProfile} from '../s17-readonly/src/manual-biomes/profile-world.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER as shader} from '../src/storybook-materials.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER as oldShader} from '../s17-readonly/src/storybook-materials.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
const bytes=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);
test('Scoped S18 wind cap tag preserves all original lanes, old profiles and existing shader',()=>{
 const start=shader.indexOf('}else if(vMat==44)'),end=shader.indexOf('}else if(vMat>=40&&vMat<=43)',start);
 assert.ok(start>0&&end>start);
 assert.equal(shader.slice(0,start)+shader.slice(end),oldShader);
 let changed=0,compared=0,oldBytes=0;
 for(const seed of [179,2026]){
  const old=new PriorSnow(seed),w=new ExperimentalSnowS17World(seed);
  for(const [cx,cz] of [[-3,31],[-2,32],[20,-114],[18,-128],[0,19],[32,0],[-3,-33]]){
   const a=previousMesh(old,cx,cz),b=meshChunk(w,cx,cz);
   assert.equal(a.length,b.length);
   const aa=new Uint32Array(a.buffer,a.byteOffset,a.length),bb=new Uint32Array(b.buffer,b.byteOffset,b.length);
   for(let i=0;i<a.length;i+=9){
    for(let j=0;j<8;j++)assert.equal(aa[i+j],bb[i+j]);
    if(aa[i+8]===bb[i+8])continue;
    assert.equal(a[i+8],41);assert.equal(b[i+8],44);changed++;
    // Boundary vertices lie on a source cap; require an eligible exposed
    // natural winter cap in the incident voxel neighborhood.
    let eligible=false;
    for(const x of [Math.floor(a[i]),Math.ceil(a[i])-1])
     for(const y of [Math.floor(a[i+1]),Math.ceil(a[i+1])-1])
      for(const z of [Math.floor(a[i+2]),Math.ceil(a[i+2])-1]){
       const p=w._columnPlan(x,z),top=p.size?Math.max(...p.keys()):null;
       if(top===y&&[272,279].includes(p.get(y))&&w.get(x,y,z)===p.get(y)&&w.get(x,y+1,z)===0&&
          v6BiomeAt(x,z,seed)?.name==='snow'&&w.environmentCaves.get(x,y,z)===undefined)eligible=true;
      }
    assert.ok(eligible,'Retagged vertex lacks actual winter cap ownership');
   }
   compared+=a.byteLength;
  }
  for(const profile of [M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR]){
   const base=new PriorWorld(seed,priorProfile(seed,profile)),next=new FourRegionWorld(seed,fourRegionProfile(seed,profile));
   for(const [cx,cz] of [[-3,31],[20,-114],[-3,-33]]){
    const a=previousMesh(base,cx,cz),b=meshChunk(next,cx,cz);
    assert.deepEqual(bytes(a),bytes(b));
    for(let i=8;i<a.length;i+=9)assert.notEqual(a[i],44);
    oldBytes+=a.byteLength;
   }
  }
 }
 assert.ok(changed>0);
 console.log('SNOW_S18_SCOPED_WIND '+JSON.stringify({compared,retaggedVertices:changed,oldBytes,originalShaderExactOutsideNewBranch:true,experimentalOnly:true}));
});
