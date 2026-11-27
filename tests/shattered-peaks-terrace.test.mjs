import test from 'node:test';
import assert from 'node:assert/strict';
import {ShatteredPeaksTerraceWorld,protectedDistance,SP2_SLOPE,SP2_HALO,SP2_TILE_LIMIT} from '../src/manual-biomes/shattered-peaks-terrace.mjs';
import {meshChunk,collides,raycast} from '../src/voxel.mjs';
import {runtimeMeshKey,runtimeSectionForY,runtimeSectionBounds} from '../src/world-height.mjs';
import {planHeightStream} from '../src/world-height-stream.mjs';
import {validateUpperSectionGeometry,admitUpperGpuBatch,UPPER_STAGE_BYTES,UPPER_RESIDENT_BYTES} from '../src/world-height-budget.mjs';
test('distance transform agrees with independent brute force including diagonal and tile seam distances',()=>{
 const n=31,mask=new Uint8Array(n*n).fill(1),vetoes=[[0,3],[15,15],[23,7],[30,30]];
 for(const [x,z] of vetoes)mask[z*n+x]=0;
 const d=protectedDistance(mask,n);
 for(let z=0;z<n;z++)for(let x=0;x<n;x++)assert.equal(d[z*n+x],Math.min(...vetoes.map(([a,b])=>Math.max(Math.abs(x-a),Math.abs(z-b)))));
});
const w=new ShatteredPeaksTerraceWorld(179);
let witness=null;
test('real M8 exclusions survive; coherent terrace field preserves connected added cells',()=>{
 let admitted=0,veto=0,trimmed=0,upper=0,rawMax=0,topMax=0,worstRawCliff=0,worstTerraceCliff=0,adjacentVeto=0;
 for(let z=-48;z<=48;z++)for(let x=-576;x<=-448;x++){
  const a=w.originalAdmission(x,z),p=w.terraceColumn(x,z);
  if(!a){
   assert.equal(p,null);veto++;
   if((x+z)%7===0){assert.equal(w.get(x,19,z),w.originalNatural(x,19,z));assert.equal(w.get(x,20,z),0);}
   continue;
  }
  assert.ok(p);admitted++;rawMax=Math.max(rawMax,a.topY);topMax=Math.max(topMax,p.topY);
  if(p.topY<a.topY)trimmed++;
  if(p.topY>=20)upper++;
  if(!witness||p.topY>witness.topY)witness={x,z,...p};
  assert.ok(p.topY>=p.cap&&p.topY<=a.topY);
  if(p.clearance===1){adjacentVeto++;assert.equal(p.topY,p.cap);}
  for(const [dx,dz] of [[1,0],[0,1],[-1,0],[0,-1]]){
   const b=w.terraceColumn(x+dx,z+dz);
   if(!b){assert.equal(p.topY,p.cap);worstRawCliff=Math.max(worstRawCliff,a.topY-p.cap);worstTerraceCliff=Math.max(worstTerraceCliff,p.topY-p.cap);}
  }
  if((x+z)%19===0){
   for(let y=p.cap;y<=p.topY;y++)assert.notEqual(w.get(x,y,z),0);
   assert.equal(w.get(x,p.topY+1,z),0);
  }
 }
 assert.ok(admitted>0&&veto>0&&trimmed>0&&adjacentVeto>0);
 assert.ok(worstRawCliff>0&&worstTerraceCliff===0);
 assert.ok(w.cachedTerraceTiles<=SP2_TILE_LIMIT);
 console.log('SP2_TERRACE_SURVEY',JSON.stringify({admitted,veto,trimmed,upper,rawMax,topMax,adjacentVeto,worstRawCliff,worstTerraceCliff,witness}));
});
test('real mesh, streaming selection, coverage and edit precedence for highest admitted terrace',()=>{
 assert.ok(witness);
 const {x,z,cap,topY}=witness;
 assert.ok(topY>cap);
 assert.ok(collides(w,x+.5,topY,z+.5));
 assert.ok(raycast(w,[x+.5,topY+3,z+.5],[0,-1,0],5));
 const orig=w.get(x,topY,z);
 assert.equal(w.set(x,topY,z,0),true);assert.equal(w.get(x,topY,z),0);
 assert.equal(w.terraceColumn(x,z).topY,topY);
 assert.equal(w.set(x,topY,z,orig),true);assert.equal(w.edits.size,0);
 const cx=Math.floor(x/16),cz=Math.floor(z/16),legacy=[];
 for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++)legacy.push({cx:a,cz:b,section:0});
 const selected=planHeightStream(w,{x:x+.5,feet:topY+1,z:z+.5},legacy);
 const keys=new Set(selected.map(c=>runtimeMeshKey(c.cx,c.cz,c.section)));
 assert.equal(keys.size,selected.length);assert.ok(selected.length<=25);
 const occupied=selected.filter(c=>c.section>0&&w.upperNaturalOccupied(runtimeMeshKey(c.cx,c.cz,c.section)));
 assert.ok(occupied.length<=8);
 let meshBytes=0,maxBytes=0,actualNonempty=0,requested=0,missing=0;
 const resident=new Map();
 for(const c of occupied){
  const vertices=meshChunk(w,c.cx,c.cz,c.section),water=new Float32Array(0);
  const bytes=validateUpperSectionGeometry(vertices,water),key=runtimeMeshKey(c.cx,c.cz,c.section);
  const result=admitUpperGpuBatch(resident,[{key,section:c.section,vertices,water}]);
  assert.ok(result.staged<=UPPER_STAGE_BYTES&&result.bytes<=UPPER_RESIDENT_BYTES);
  resident.set(key,{section:c.section,count:vertices.length/9,waterCount:0});
  meshBytes+=bytes;maxBytes=Math.max(maxBytes,bytes);actualNonempty+=Number(bytes>0);
 }
 // Coverage witness: explicitly count source top cells without a resident
 // owner. This is NOT camera visibility or a visual acceptance claim.
 for(let dz=-24;dz<=24;dz++)for(let dx=-24;dx<=24;dx++){
  const p=w.terraceColumn(x+dx,z+dz);
  if(!p||p.topY<20)continue;
  requested++;
  if(!keys.has(runtimeMeshKey(Math.floor((x+dx)/16),Math.floor((z+dz)/16),runtimeSectionForY(p.topY))))missing++;
 }
 console.log('SP2_STREAM_WITNESS',JSON.stringify({selected:selected.length,occupied:occupied.length,actualNonempty,meshBytes,maxBytes,requestedTopCells:requested,missingTopCells:missing}));
 assert.throws(()=>w.save());
});
