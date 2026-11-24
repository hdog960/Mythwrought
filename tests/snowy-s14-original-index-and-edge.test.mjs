// Authentic original Desert-P3 M7 source; all world mutations below are
// confined to a throwaway in-memory object, never a saved player world.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {VoxelWorld,terrainHeight,collides,meshChunk}
 from '../production-readonly/src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,restoreFourRegionWorld}
 from '../production-readonly/src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../production-readonly/src/manual-biomes/v6-balanced-biomes.mjs';
import {planEnvironmentalScenery} from '../production-readonly/src/nonblock/staged-habitats.mjs';
import {describeCandidateObject} from '../production-readonly/src/nonblock/candidate-scene.mjs';
import {createSnowS12ClimateBoundTreeFactory} from '../src/manual-biomes/snowy-s12-natural-conifer-prototypes.mjs';
import {createSnowS13CertifiedForest,S13_WINDOW} from '../src/manual-biomes/snowy-s13-certified-forest-overlay.mjs';
import {createSnowS14IndexedForest} from '../src/manual-biomes/snowy-s14-indexed-forest.mjs';
import {createSnowS14EdgePigment} from '../src/manual-biomes/snowy-s14-edge-pigment.mjs';
import {createSnowS10MeshResidentPigment} from '../src/manual-biomes/snowy-s10-single-mesh-scratch-pigment.mjs';

const key=(x,y,z)=>[x,y,z].join(',');
const quantile=(s,p)=>Math.round(s.slice().sort((a,b)=>a-b)[Math.ceil(s.length*p)-1]*100)/100;
function timings(worlds,cx,cz){
 const samples=worlds.map(()=>[]);
 for(const w of worlds)meshChunk(w,cx,cz);
 for(let n=0;n<16;n++)for(let j=0;j<3;j++){
  const k=(n+j)%3,start=performance.now();
  meshChunk(worlds[k],cx,cz);
  samples[k].push(performance.now()-start);
 }
 return samples.map(s=>({p50:quantile(s,.5),p95:quantile(s,.95),samples:s}));
}
test('S14 indexed full-tree native mesh byte parity, live-edit veto and paired timing',()=>{
 for(const seed of [179,2026]){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),w=new FourRegionWorld(seed,profile);
  const before=JSON.stringify(w.save());
  const deps={biomeAt:v6BiomeAt,terrainHeight,collides,
   proposedSnowTree:createSnowS12ClimateBoundTreeFactory(seed,v6BiomeAt),
   legacyNatural:(x,y,z)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(w,x,y,z),
   planScenery:planEnvironmentalScenery,describeScene:describeCandidateObject};
  const certificate=createSnowS13CertifiedForest(w,deps);
  const {overlay,allocatedBytes,bounds}=createSnowS14IndexedForest(w,certificate);
  const occupied=new Set(certificate.manifest.cells.map(([x,,z])=>Math.floor(x/16)+','+Math.floor(z/16)));
  const chunks=new Set(S13_WINDOW.map(([cx,cz])=>cx+','+cz));
  for(const k of occupied){
   const [cx,cz]=k.split(',').map(Number);
   // Include external owner and all face-neighbor chunks to cover culling.
   for(const [dx,dz] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]])chunks.add((cx+dx)+','+(cz+dz));
  }
  const costs=[];
  let bytes=0;
  for(const k of chunks){
   const [cx,cz]=k.split(',').map(Number);
   const old=meshChunk(certificate.overlay,cx,cz),next=meshChunk(overlay,cx,cz);
   assert.equal(old.byteLength,next.byteLength);
   assert.deepEqual(Buffer.from(next.buffer,next.byteOffset,next.byteLength),
    Buffer.from(old.buffer,old.byteOffset,old.byteLength),'Exact Float32 mesh bytes '+k);
   bytes+=old.byteLength;
   if(occupied.has(k)&&S13_WINDOW.some(([a,b])=>a===cx&&b===cz)){
    const [original,stringOverlay,indexed]=timings([w,certificate.overlay,overlay],cx,cz);
    costs.push({chunk:[cx,cz],original,stringOverlay,indexed,meshBytes:next.byteLength});
   }
  }
  assert.equal(JSON.stringify(w.save()),before);
  assert.deepEqual(restoreFourRegionWorld(w.save(),profile).save(),w.save());
  assert.throws(()=>overlay.set(0,0,0,4),/read-only/);
  const [x,y,z,id]=certificate.manifest.cells[0];
  assert.equal(overlay.get(x,y,z),id);
  w.set(x,y,z,3);
  assert.equal(w.get(x,y,z),3);
  assert.equal(overlay.get(x,y,z),3,'Late player stone edit must override candidate');
  console.log('SNOW_S14_INDEXED_FOREST '+JSON.stringify({seed,cells:certificate.manifest.cells.length,
    parityChunks:chunks.size,comparedMeshBytes:bytes,allocatedBytes,bounds,costs,
    lateEditProtected:true,originalSaveUnchangedBeforeDisposableEdit:true}));
 }
});

const edges=[
 [179,'desert',[640,-1284],[640,-1283]],
 [179,'mountain',[-1812,-768],[-1811,-768]],
 [2026,'desert',[320,-1805],[320,-1804]],
 [2026,'mountain',[280,-2048],[281,-2048]]
];
function top(plan){
 let y=-Infinity,id=null;
 for(const [a,b] of plan)if(a>y){y=a;id=b;}
 return {top:y,id};
}
test('S14 four genuine original seam transects preserve protected geology and feather only original winter caps',()=>{
 let totalEdge=0,totalInterior=0;
 for(const [seed,target,a,b] of edges){
  const p=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),w=new FourRegionWorld(seed,p),before=JSON.stringify(w.save());
  const na=v6BiomeAt(...a,seed)?.name,nb=v6BiomeAt(...b,seed)?.name;
  assert.ok(na==='snow'&&nb===target||nb==='snow'&&na===target);
  const snow=na==='snow'?a:b,other=na==='snow'?b:a;
  const dx=snow[0]-other[0],dz=snow[1]-other[1];
  let reads=0,edge=0,interior=0,protectedCaps=0,empty=0,originalWinter=0;
  const pigment=createSnowS14EdgePigment(seed,(x,z,s)=>{reads++;return v6BiomeAt(x,z,s)});
  const baseline=createSnowS10MeshResidentPigment(seed,v6BiomeAt);
  const distances={},samples=[];
  for(let d=-8;d<=60;d++)for(let lateral=-4;lateral<=4;lateral++){
   const x=snow[0]+dx*d-dz*lateral,z=snow[1]+dz*d+dx*lateral;
   const plan=top(w._columnPlan(x,z)),{top:y,id}=plan;
   if(id===null){empty++;continue;}
   const args=[x,y,z,id,plan,w.get(x,y,z),w.get(x,y-1,z),w.get(x,y+1,z),
    w.edits.has(key(x,y,z)),w.edits.has(key(x,y-1,z)),
    w.environmentCaves.get(x,y,z),w.environmentCaves.get(x,y-1,z)];
   const base=baseline.colorAt(...args),next=pigment.colorAt(...args);
   if(id===258||id===401){protectedCaps++;assert.equal(next,undefined);}
   if(!base){assert.equal(next,undefined);continue;}
   originalWinter++;
   assert.ok([272,276,279].includes(id));
   const climate=v6BiomeAt(x,z,seed);assert.equal(climate.name,'snow');
   if(climate.weight>=.82){interior++;assert.deepEqual(next,base);}
   else{
    edge++;assert.notDeepEqual(next,base);
    assert.ok(next.every(v=>v>=0&&v<=1));
    distances[d]=(distances[d]??0)+1;
    if(samples.length<4)samples.push({x,y,z,id,d,weight:climate.weight,before:[...base],after:[...next]});
   }
   assert.equal(pigment.colorAt(...args.slice(0,8),true,...args.slice(9)),undefined);
  }
  assert.equal(reads,pigment.stats().climateReads);
  assert.equal(edge+interior,originalWinter);
  assert.equal(JSON.stringify(w.save()),before);
  assert.deepEqual(restoreFourRegionWorld(w.save(),p).save(),w.save());
  totalEdge+=edge;totalInterior+=interior;
  console.log('SNOW_S14_ORIGINAL_TRANSITION '+JSON.stringify({seed,target,snow,other,
    sampled:69*9,empty,protectedCaps,originalWinter,edge,interior,distances,samples,
    sourceClimateCalls:reads,originalSaveUnchanged:true,geometryUnchanged:true}));
 }
 assert.ok(totalEdge>0&&totalInterior>0,'Real source transects must exercise both snow edge and interior');
});
