import test from 'node:test';
import assert from 'node:assert/strict';
import {moonbellVertices,MOONBELL_LIMITS} from '../src/moonbells.mjs';
const heightAt=()=>4,baseAt=(x,y,z)=>y===4?1:0;
function world(seed=123,edits=new Map()){return {seed,get(x,y,z){return edits.get([x,y,z].join(','))??baseAt(x,y,z);}};}
const opts={heightAt,baseAt};
test('moonbell patches repeat by seed, remain finite and stay inside chunk',()=>{
 let found=0;
 for(let cx=-4;cx<5;cx++)for(let cz=-4;cz<5;cz++){
  const a=moonbellVertices(world(),cx,cz,opts),b=moonbellVertices(world(),cx,cz,opts);
  assert.deepEqual(a,b);assert.equal(a.length%9,0);
  assert.ok(a.length/9<=MOONBELL_LIMITS.maxFlowersPerChunk*MOONBELL_LIMITS.maxVerticesPerFlower);
  for(let i=0;i<a.length;i+=9){
   assert.ok(a[i]>=cx*16&&a[i]<(cx+1)*16);
   assert.ok(a[i+2]>=cz*16&&a[i+2]<(cz+1)*16);
   assert.ok(a[i+1]>4&&a[i+1]<6);
   for(let k=0;k<9;k++)assert.ok(Number.isFinite(a[i+k]));
  }
  found+=a.length;
 }
 assert.ok(found>0,'some reachable meadow blooms exist');
});
test('mined anchors and player roof edits remove flowers without touching saves',()=>{
 let selected;
 for(let cx=-5;cx<=5&&!selected;cx++)for(let cz=-5;cz<=5&&!selected;cz++){
  const v=moonbellVertices(world(),cx,cz,opts);
  if(v.length)selected={cx,cz,x:Math.floor(v[18]),z:Math.floor(v[20])};
 }
 assert.ok(selected);
 const {cx,cz,x,z}=selected;
 const mined=new Map([[ [x,4,z].join(','),0 ]]);
 const roof=new Map([[ [x,5,z].join(','),3 ]]);
 const original=moonbellVertices(world(),cx,cz,opts);
 assert.ok(moonbellVertices(world(123,mined),cx,cz,opts).length<original.length);
 assert.ok(moonbellVertices(world(123,roof),cx,cz,opts).length<original.length);
 assert.equal(world(123,mined).get(x,4,z),0);
});

test('fern silhouettes are seeded, budgeted and removed with their grass anchor',()=>{
 let sample;
 for(let cx=-9;cx<=9&&!sample;cx++)for(let cz=-9;cz<=9&&!sample;cz++){
  const vertices=moonbellVertices(world(123),cx,cz,opts);
  // Fern fronds use a distinct dark-green leaf tint from the moonbell petals.
  for(let i=0;i<vertices.length;i+=9){
   if(Math.abs(vertices[i+3]-.30)<1e-5&&Math.abs(vertices[i+4]-.54)<1e-5){
    sample={cx,cz,x:Math.floor(vertices[i]),z:Math.floor(vertices[i+2]),vertices};break;
   }
  }
 }
 assert.ok(sample,'at least one deterministic fern grows in representative meadow chunks');
 const {cx,cz,x,z,vertices}=sample;
 const removed=moonbellVertices(world(123,new Map([[[x,4,z].join(','),0]])),cx,cz,opts);
 assert.ok(removed.length<vertices.length,'removing supporting grass removes fern-bearing decoration');
 assert.ok(vertices.length/9<=MOONBELL_LIMITS.maxFlowersPerChunk*MOONBELL_LIMITS.maxVerticesPerFlower);
});

test('rare golden starblooms have distinct six-petal silhouettes within the shared mesh budget',()=>{
 let starTriangles=0,blueTriangles=0;
 for(let cx=-12;cx<=12;cx++)for(let cz=-12;cz<=12;cz++){
  const a=moonbellVertices(world(123),cx,cz,opts);
  for(let i=0;i<a.length;i+=9){
   if(a[i+3]>.96&&a[i+4]>.85&&a[i+5]>.53)starTriangles++;
   if(a[i+5]>.9&&a[i+3]<.9&&a[i+4]>.6)blueTriangles++;
  }
  assert.ok(a.length/9<=MOONBELL_LIMITS.maxFlowersPerChunk*MOONBELL_LIMITS.maxVerticesPerFlower);
 }
 assert.ok(starTriangles>=6,'golden six-petal flowers are present across representative seeds');
 assert.ok(blueTriangles>0,'original blue/lilac bellflowers remain present');
 assert.equal(MOONBELL_LIMITS.newDrawCalls,0);
 assert.equal(MOONBELL_LIMITS.newTextures,0);
});
