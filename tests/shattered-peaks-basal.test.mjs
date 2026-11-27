import test from 'node:test';
import assert from 'node:assert/strict';
import {ShatteredPeaksResearchWorld} from '../src/manual-biomes/shattered-peaks-basal.mjs';
import {planShatteredPeakColumn} from '../src/manual-biomes/shattered-peaks-sp1.mjs';
import {BLOCK,meshChunk,collides,raycast,terrainHeight,chunkWindow} from '../src/voxel.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from '../src/manual-biomes/mountain-v8-materials.mjs';
import {runtimeMeshKey,runtimeSectionForY,runtimeSectionBounds} from '../src/world-height.mjs';
import {planHeightStream} from '../src/world-height-stream.mjs';
import {validateUpperSectionGeometry,admitUpperGpuBatch,UPPER_STAGE_BYTES,UPPER_RESIDENT_BYTES} from '../src/world-height-budget.mjs';
const seed=179,w=new ShatteredPeaksResearchWorld(seed);
let witness=null;
function findWitness(){
 if(witness)return witness;
 for(let z=-24;z<=24;z++)for(let x=-544;x<=-480;x++){
  const p=w.basalColumn(x,z);
  if(p&&p.topY>35){witness={x,z,...p};return witness;}
 }
 throw Error('No naturally admitted M8 basal witness');
}
test('original M8 physical support and actual immutable bridge',()=>{
 const p=findWitness(),{x,z,cap,topY}=p;
 assert.equal(w.originalNatural(x,19,z),BLOCK.AIR);
 for(let y=cap-2;y<=topY;y++)assert.notEqual(w.get(x,y,z),0);
 assert.equal(w.get(x,topY+1,z),0);
 assert.equal(w.get(x,19,z),M.stone);
 assert.equal(w.originalNatural(x,19,z),0);
 assert.ok(collides(w,x+.5,19,z+.5));
 assert.equal(collides(w,x+.5,topY+1,z+.5),false);
 const hit=raycast(w,[x+.5,topY+3,z+.5],[0,-1,0],5);
 assert.ok(hit,'real voxel raycast must hit upper terrain');
 assert.throws(()=>w.save());
 console.log('SP_BASAL_WITNESS',JSON.stringify(p));
});
test('protected and unadmitted columns retain original physical cells',()=>{
 let veto=0,admitted=0;
 for(let x=-544;x<=-480;x+=4)for(let z=-24;z<=24;z+=4){
  if(!planShatteredPeakColumn(x,z,seed))continue;
  const p=w.basalColumn(x,z);
  if(p){admitted++;continue;}
  veto++;
  for(let y=terrainHeight(x,z,seed)-3;y<=19;y++)assert.equal(w.get(x,y,z),w.originalNatural(x,y,z));
  assert.equal(w.get(x,20,z),0);
 }
 assert.ok(admitted>0);console.log('SP_BASAL_SURVEY',JSON.stringify({admitted,veto}));
 for(let y=0;y<=19;y++)assert.equal(w.get(0,y,0),w.originalNatural(0,y,0));
 assert.equal(w.get(0,20,0),0);
});
test('original edit precedence over immutable bridge and upper source',()=>{
 const {x,z,topY}=findWitness();
 for(const y of [19,20,35,36,topY]){
  const original=w.get(x,y,z);assert.notEqual(original,0);
  assert.equal(w.set(x,y,z,0),true);assert.equal(w.get(x,y,z),0);
  assert.equal(w.naturalAndLandmarkBlock(x,y,z),original);
  assert.equal(w.set(x,y,z,original),true);assert.equal(w.get(x,y,z),original);
 }
 assert.equal(w.edits.size,0);
});
test('actual original mesh and bounded stream selection at admitted column',()=>{
 const {x,z,topY}=findWitness(),cx=Math.floor(x/16),cz=Math.floor(z/16);
 const legacy=[];for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++)legacy.push({cx:a,cz:b,section:0});
 const selected=planHeightStream(w,{x:x+.5,feet:topY+1,z:z+.5},legacy);
 assert.ok(selected.length<=25);
 const occupied=selected.filter(c=>c.section>0&&w.upperNaturalOccupied(runtimeMeshKey(c.cx,c.cz,c.section)));
 assert.ok(occupied.length>0&&occupied.length<=8);
 assert.equal(new Set(selected.map(c=>runtimeMeshKey(c.cx,c.cz,c.section))).size,selected.length);
 const sections=[...new Set([1,2,runtimeSectionForY(topY)])];
 let maxBytes=0,staged=0;const resident=new Map();
 for(const section of sections){
  const vertices=meshChunk(w,cx,cz,section),water=new Float32Array(0);
  const bytes=validateUpperSectionGeometry(vertices,water);
  maxBytes=Math.max(maxBytes,bytes);
  const key=runtimeMeshKey(cx,cz,section);
  const result=admitUpperGpuBatch(resident,[{key,section,vertices,water}]);
  assert.ok(result.staged<=UPPER_STAGE_BYTES&&result.bytes<=UPPER_RESIDENT_BYTES);
  staged=Math.max(staged,result.staged);resident.set(key,{section,count:vertices.length/9,waterCount:0});
 }
 assert.ok(maxBytes>0);
 console.log('SP_MESH_BUDGET',JSON.stringify({sections,selected:selected.length,occupied:occupied.length,maxBytes,maxSingleStaging:staged}));
});
