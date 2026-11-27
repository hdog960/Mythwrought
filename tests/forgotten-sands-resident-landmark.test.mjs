import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {openP0CompositeFixture} from '../src/manual-biomes/forgotten-sands-composite-fixture.mjs';
import {annotateP0ResidentLandmarks,p0ResidentLandmarkWitness,p0ResidentLandmarkShaders} from '../src/manual-biomes/forgotten-sands-resident-landmark.mjs';
import {readFile} from 'node:fs/promises';
const root=process.env.P0_CURRENT_SOURCE;if(!root)throw Error('Exact current source required');
const load=p=>import(pathToFileURL(resolve(root,p)).href);
const [P,V,H,N,S,P2,I2,E]=await Promise.all(['src/manual-biomes/profile-world.mjs','src/voxel.mjs','src/world-height.mjs','src/world-height-natural-contract.mjs','src/world-height-stream.mjs','src/pack2-world.mjs','src/pack2-integration.mjs','src/mobs/source-edit-epoch.mjs'].map(load));
test('actual full25 low-surface plans retain all native triangles and bytes, tag only exact new physical monument faces',async()=>{
 for(const index of [1,3]){
  const f=await openP0CompositeFixture(index,{P,H,N,reserved:()=>false,revision:()=>'resident-r1'}),w=new P2.Pack2LiveWorld(f.world),source=new P2.Pack2LiveWorld(new P.FourRegionWorld(w.seed,P.fourRegionProfile(w.seed,P.M8_MOUNTAIN_GENERATOR)));
  const rev=E.createMobSourceRevision(w),epoch=rev(),current=()=>rev()===epoch,cache=new Map(),results=[];
  const mid=index===1?{x:504,z:-122}:{x:-900,z:-2054};
  for(const feet of [10,15])for(const distance of [48,32,25,16]){
   const player={x:mid.x-distance,feet,z:mid.z},legacy=V.chunkWindow(player.x,player.z,2).map(c=>({...c,section:0})),plan=S.planHeightStream(w,player,legacy),keys=plan.map(c=>H.runtimeMeshKey(c.cx,c.cz,c.section));
   assert.equal(keys.length,25);assert.ok(H.physicalBodyRegions(player).every(q=>keys.includes(q.key)));
   let triangles=0,farther=0,bytes=0,markedOwners=0;
   for(const c of plan){
    const k=H.runtimeMeshKey(c.cx,c.cz,c.section);
    if(!cache.has(k)){
     const v=V.meshChunk(w,c.cx,c.cz,c.section),tag=annotateP0ResidentLandmarks(v,{source,composed:w,owner:k,H,sourceCurrent:current});
     assert.equal(v.byteLength,tag.bytes);assert.equal(tag.extraOwners,0);
     const centroids=[];
     for(let i=0;i<v.length;i+=27){
      const changed=tag.vertices[i+8]<0;
      for(let j=0;j<27;j++){
       if(changed&&j%9===8)assert.equal(-tag.vertices[i+j]-1,v[i+j]);
       else assert.equal(tag.vertices[i+j],v[i+j]);
      }
      if(changed){assert.ok(p0ResidentLandmarkWitness(v,i,source,w,k,H));centroids.push([0,1,2].map(a=>(v[i+a]+v[i+9+a]+v[i+18+a])/3));}
     }
     assert.equal(centroids.length,tag.triangles);
     cache.set(k,{triangles:tag.triangles,centroids,bytes:v.byteLength+I2.pack2WaterSectionVertices(w,c.cx,c.cz,c.section).byteLength});
    }
    const a=cache.get(k);triangles+=a.triangles;bytes+=a.bytes;if(a.triangles)markedOwners++;
    farther+=a.centroids.filter(q=>Math.hypot(q[0]-player.x,q[1]-player.feet-2,q[2]-player.z)>29).length;
   }
   results.push({feet,distance,owners:keys.length,markedOwners,triangles,beyondOriginalFogStart:farther,bytes,extraOwners:0});
  }
  assert.ok(results.some(r=>r.beyondOriginalFogStart>0));assert.ok(current());
  const sample=f.witness.upper;assert.equal(w.set(...sample.slice(0,3),0),true);assert.equal(current(),false);
  assert.throws(()=>annotateP0ResidentLandmarks(new Float32Array(),{source,composed:w,owner:'stale',H,sourceCurrent:current}),/Invalid/);
  console.log('P0 RESIDENT LANDMARK',JSON.stringify({index,seed:w.seed,results,uniqueMeshes:cache.size,placementAuthority:false}));
 }
});
test('patch exact current shader expressions, preserve material and cave-fog contracts',async()=>{
 const main=await readFile(resolve(root,'src/main.mjs'),'utf8'),i=main.indexOf('  const VS=['),j=main.indexOf('  let program,skyProgram',i);
 const {STORYBOOK_MATERIAL_FRAGMENT_SHADER}=await load('src/storybook-materials.mjs'),nonblockGeometry=await load('src/nonblock/candidate-scene.mjs');
 const original=Function('STORYBOOK_MATERIAL_FRAGMENT_SHADER','nonblockGeometry',main.slice(i,j)+';return {terrainVertex:VS,terrainFragment:FS};')(STORYBOOK_MATERIAL_FRAGMENT_SHADER,nonblockGeometry);
 const s=p0ResidentLandmarkShaders(original);assert.notEqual(s.terrainVertex,original.terrainVertex);assert.notEqual(s.terrainFragment,original.terrainFragment);
 assert.ok(s.terrainVertex.includes('nativeMat=vLandmark==1?-aMat-1.0:aMat'));
 assert.ok(s.terrainFragment.includes('vLandmark==1&&uCaveHaze==0.0'));
 assert.ok(s.terrainFragment.includes('smoothstep(mix(29.0,9.0,uCaveHaze),mix(68.0,27.0,uCaveHaze),distanceToEye)'));
});
