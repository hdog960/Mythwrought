import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {openP0CompositeFixture} from '../src/manual-biomes/forgotten-sands-composite-fixture.mjs';
import {planP0EmptyOwnerExchange} from '../src/manual-biomes/forgotten-sands-empty-owner-exchange.mjs';
const root=process.env.P0_CURRENT_SOURCE;if(!root)throw Error('Exact current checkout required');
const load=p=>import(pathToFileURL(resolve(root,p)).href);
const [P,H,N,S,V,P2,I2]=await Promise.all(['src/manual-biomes/profile-world.mjs','src/world-height.mjs','src/world-height-natural-contract.mjs','src/world-height-stream.mjs','src/voxel.mjs','src/pack2-world.mjs','src/pack2-integration.mjs'].map(load));
test('current detached composite source: actual native meshes and body-preserving empty owner exchange',async()=>{
 let admitted=0;
 for(const index of [1,3]){
  const f=await openP0CompositeFixture(index,{P,H,N,reserved:()=>false,revision:()=>'detached-test-r1'}),w=new P2.Pack2LiveWorld(f.world);
  const mid=index===1?{x:504,z:-122}:{x:-900,z:-2054},cache=new Map(),results=[];
  for(const feet of [15,16,18,19])for(const distance of [48,32,16]){
   const player={x:mid.x-distance,feet,z:mid.z},cx=Math.floor(player.x/16),cz=Math.floor(player.z/16),legacy=[];
   for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++)legacy.push({cx:a,cz:b,section:0});
   const selected=S.planHeightStream(w,player,legacy),before=JSON.stringify(selected);
   // This fixture has no authored pack/manual layers or player edits.
   // Actual native solid meshes are generated. No water is assumed for
   // an upper empty owner only after the complete physical owner scan.
   const inspect=(s,k)=>{
    if(cache.has(k))return cache.get(k);
    const v=V.meshChunk(w,s.cx,s.cz,s.section);
    const water=I2.pack2WaterSectionVertices(w,s.cx,s.cz,s.section);
    const r={complete:true,solidBytes:v.byteLength,waterBytes:water.byteLength};cache.set(k,r);return r;
   };
   const args={selected,player,H,world:w,inspect,farBytes:index===1?149868:159624,sourceCurrent:()=>true};
   const r=planP0EmptyOwnerExchange(args);assert.equal(JSON.stringify(selected),before);
   if(r.allowed){
    admitted++;assert.ok(r.owners<=25);assert.ok(r.upperCount<=8);
    if(r.removed){
     const row=selected.find(s=>H.runtimeMeshKey(s.cx,s.cz,s.section)===r.removed);
     assert.ok(row.section>0);assert.equal(inspect(row,r.removed).solidBytes,0);
     assert.equal(H.upperOccupancy(w,r.removed),false);
     assert.ok(!H.physicalBodyRegions(player).some(s=>s.key===r.removed));
    }
    for(const s of selected)if(inspect(s,H.runtimeMeshKey(s.cx,s.cz,s.section)).solidBytes+inspect(s,H.runtimeMeshKey(s.cx,s.cz,s.section)).waterBytes>0)
     assert.ok(r.retained.includes(s));
   }
   results.push({feet,distance,selected:selected.length,allowed:r.allowed,reason:r.reason,removed:r.removed??null,owners:r.owners??null,bytes:r.bytes??null});
  }
  assert.deepEqual(f.world.save().edits,[]);
  console.log('P0 EMPTY EXCHANGE',JSON.stringify({index,results,meshes:cache.size,placementAuthority:false}));
 }
 console.log('P0 EMPTY EXCHANGE TOTAL',admitted);
 // Evidence of denial is a valid outcome; no mandatory positive admission.
});
test('unknown mesh or body placeholder never exchanged',()=>{
 const player={x:.5,z:.5,feet:19.1},body=H.physicalBodyRegions(player),selected=body.map(r=>({cx:r.cx,cz:r.cz,section:H.runtimeSectionForY(r.kind==='upper'?20:19)}));
 const args={selected,player,H,world:{},inspect:()=>({complete:false,solidBytes:0,waterBytes:0}),farBytes:36,sourceCurrent:()=>true};
 assert.equal(planP0EmptyOwnerExchange(args).allowed,false);
 assert.equal(planP0EmptyOwnerExchange({...args,sourceCurrent:()=>false}).reason,'stale-source');
});
