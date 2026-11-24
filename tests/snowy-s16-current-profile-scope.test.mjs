// Focused CURRENT compact-menu/Enchanted-P2 production compatibility.
// Uses genuine original native meshes, not a simulated mesh or new generator.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR}
 from '../current-readonly/src/manual-biomes/profile-world.mjs';
import {meshChunk} from '../current-readonly/src/voxel.mjs';
import {composeSnowS16FutureProfileMesh} from '../src/manual-biomes/snowy-s16-current-release-mesh-compose.mjs';
const bytes=m=>Buffer.from(m.buffer,m.byteOffset,m.byteLength);
const bits=m=>new Uint32Array(m.buffer,m.byteOffset,m.length);
// Test identity ONLY, never added to any registry or exposed to UI.
const futureGenerator='mythwrought-five-surface-regions-v7-snow-test-only';
test('Current release exact existing M7 and Enchanted-P2 mesh parity, future profile scope remains unregistered',async()=>{
 const root=await mkdtemp(join(tmpdir(),'snow-s16-current-'));
 try{
  await cp('current-readonly/src',join(root,'src'),{recursive:true});
  const path=join(root,'src','voxel.mjs'),source=await readFile(path,'utf8');
  for(const generator of [M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR])
   assert.throws(()=>composeSnowS16FutureProfileMesh(source,{futureGenerator:generator}),/future Snow identity/);
  assert.throws(()=>fourRegionProfile(179,futureGenerator),/Unknown biome generator/);
  const candidate=composeSnowS16FutureProfileMesh(source,{futureGenerator});
  await writeFile(path,candidate);
  for(const filename of ['snowy-s10-single-mesh-scratch-pigment.mjs','snowy-s14-edge-pigment.mjs'])
   await cp('src/manual-biomes/'+filename,join(root,'src','manual-biomes',filename));
  const alternate=(await import(pathToFileURL(path).href)).meshChunk;
  let compared=0,chunks=0;
  for(const generator of [M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR]){
   for(const seed of [179,2026]){
    const w=new FourRegionWorld(seed,fourRegionProfile(seed,generator)),before=JSON.stringify(w.save());
    // A caller cannot accidentally opt historical worlds in by adding a
    // certificate callback. It must never be invoked for existing IDs.
    Object.defineProperty(w,'snowS15CertifiedNeedleAt',{value:()=>{throw Error('Existing profile called future reader')}});
    for(const [cx,cz] of [[-2,32],[-3,-33],[20,-114]]){
     const a=meshChunk(w,cx,cz),b=alternate(w,cx,cz);
     assert.deepEqual(bytes(a),bytes(b),'Current historical profile changed '+generator+' '+seed+' '+cx+','+cz);
     compared+=a.byteLength;chunks++;
    }
    assert.equal(JSON.stringify(w.save()),before);
   }
  }
  // A disposable render-only view over a genuine existing source world,
  // NOT an actual new generator. No save or profile registration possible.
  const w=new FourRegionWorld(2026,fourRegionProfile(2026,M7_ENVIRONMENT_GENERATOR));
  const before=JSON.stringify(w.save());
  assert.equal(w.get(323,10,-1815),272);
  const view=Object.create(w);
  Object.defineProperties(view,{generationProfile:{value:Object.freeze({...w.generationProfile,generator:futureGenerator})},
   save:{value:()=>{throw Error('Unregistered render-only preview cannot save')}},
   set:{value:()=>{throw Error('Unregistered render-only preview cannot write')}}});
  const a=meshChunk(w,20,-114),b=alternate(view,20,-114),aa=bits(a),bb=bits(b);
  assert.equal(a.length,b.length);
  let changedRgbVertices=0;
  for(let i=0;i<a.length;i+=9){
   for(const j of [0,1,2,6,7,8])assert.equal(aa[i+j],bb[i+j],'NonRGB future edge lanes changed');
   if([3,4,5].some(j=>aa[i+j]!==bb[i+j]))changedRgbVertices++;
  }
  assert.ok(changedRgbVertices>0);
  assert.equal(JSON.stringify(w.save()),before);
  assert.throws(()=>view.save(),/cannot save/);
  assert.throws(()=>fourRegionProfile(2026,futureGenerator),/Unknown biome generator/);
  console.log('SNOW_S16_CURRENT_PROFILE_SCOPE '+JSON.stringify({chunks,comparedBytes:compared,
   oldM7AndEnchantedP2Exact:true,futurePreviewChangedRgbVertices:changedRgbVertices,
   futurePreviewVertices:a.length/9,allNonRgbBitsExact:true,sourceWorldUnchanged:true,
   futureGeneratorUnregistered:true,actualFutureWorldAcceptance:false}));
 }finally{await rm(root,{recursive:true,force:true});}
});
