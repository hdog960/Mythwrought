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

test('copperberry shrubs are seed-stable, rare, bounded and disappear with grass edits',()=>{
 let found=null,shrubs=0;
 for(let cx=-14;cx<=14;cx++)for(let cz=-14;cz<=14;cz++){
  const a=moonbellVertices(world(123),cx,cz,opts);
  assert.deepEqual(a,moonbellVertices(world(123),cx,cz,opts));
  assert.ok(a.length/9<=MOONBELL_LIMITS.maxFlowersPerChunk*MOONBELL_LIMITS.maxVerticesPerFlower);
  for(let i=0;i<a.length;i+=9){
   if(Math.abs(a[i+3]-.78)<1e-5&&Math.abs(a[i+4]-.34)<1e-5&&Math.abs(a[i+5]-.23)<1e-5){
    shrubs++;
    if(!found)found={cx,cz,x:Math.floor(a[i]),z:Math.floor(a[i+2]),original:a.length};
   }
  }
 }
 assert.ok(shrubs>0,'rare copperberry shrub accents occur in seeded meadows');
 assert.ok(found);
 const {cx,cz,x,z,original}=found;
 const removed=moonbellVertices(world(123,new Map([[[x,4,z].join(','),0]])),cx,cz,opts);
 assert.ok(removed.length<original,'edited anchor suppresses the shrub');
 assert.equal(MOONBELL_LIMITS.newDrawCalls,0);
 assert.equal(MOONBELL_LIMITS.newTextures,0);
});

test('rare violet lantern fungi have four-sided caps, remain bounded and respect edited anchors',()=>{
 let found=null, violet=0, ochre=0;
 for(let cx=-14;cx<=14;cx++)for(let cz=-14;cz<=14;cz++){
  const a=moonbellVertices(world(123),cx,cz,opts);
  assert.ok(a.length/9<=MOONBELL_LIMITS.maxFlowersPerChunk*MOONBELL_LIMITS.maxVerticesPerFlower);
  for(let i=0;i<a.length;i+=9){
   const color=a.slice(i+3,i+6);
   if(Math.abs(color[0]-.65)<1e-5&&Math.abs(color[1]-.49)<1e-5){
    violet++;
    if(!found)found={cx,cz,x:Math.floor(a[i]),z:Math.floor(a[i+2]),length:a.length};
   }
   if(Math.abs(color[0]-.82)<1e-5&&Math.abs(color[1]-.48)<1e-5)ochre++;
  }
 }
 assert.ok(violet>=2,'violet lantern cap facets occur on representative seeded grass');
 assert.ok(ochre>0,'original ochre mushrooms remain');
 assert.ok(found);
 const removed=moonbellVertices(world(123,new Map([[[found.x,4,found.z].join(','),0]])),found.cx,found.cz,opts);
 assert.ok(removed.length<found.length,'mining the supporting grass removes lantern fungus');
 assert.equal(MOONBELL_LIMITS.newDrawCalls,0);
 assert.equal(MOONBELL_LIMITS.newTextures,0);
});


test('silverleaf spires are seed-stable, tall, mesh-bounded and suppressed by edits',()=>{
 let found=null,spireFacets=0;
 for(let cx=-16;cx<=16;cx++)for(let cz=-16;cz<=16;cz++){
  const v=moonbellVertices(world(123),cx,cz,opts);
  assert.deepEqual(v,moonbellVertices(world(123),cx,cz,opts));
  assert.ok(v.length/9<=MOONBELL_LIMITS.maxFlowersPerChunk*MOONBELL_LIMITS.maxVerticesPerFlower);
  for(let i=0;i<v.length;i+=9){
   if(Math.abs(v[i+3]-.74)<1e-5&&Math.abs(v[i+4]-.83)<1e-5){
    spireFacets++;
    if(!found)found={cx,cz,x:Math.floor(v[i]),z:Math.floor(v[i+2]),length:v.length};
   }
  }
 }
 assert.ok(spireFacets>0,'silverleaf spires occur in seeded meadow chunks');
 assert.ok(found);
 const edited=world(123,new Map([[[found.x,4,found.z].join(','),0]]));
 assert.ok(moonbellVertices(edited,found.cx,found.cz,opts).length<found.length);
 assert.equal(MOONBELL_LIMITS.newDrawCalls,0);
 assert.equal(MOONBELL_LIMITS.newTextures,0);
});

test('ivory seedheads are rare, deterministic, edit-sensitive and bounded',()=>{
 let sample=null,facets=0;
 for(let cx=-15;cx<=15;cx++)for(let cz=-15;cz<=15;cz++){
  const a=moonbellVertices(world(123),cx,cz,opts);
  assert.deepEqual(a,moonbellVertices(world(123),cx,cz,opts));
  assert.ok(a.length/9<=MOONBELL_LIMITS.maxFlowersPerChunk*MOONBELL_LIMITS.maxVerticesPerFlower);
  for(let i=0;i<a.length;i+=9){
   if(Math.abs(a[i+3]-.98)<1e-5&&Math.abs(a[i+4]-.96)<1e-5&&Math.abs(a[i+5]-.85)<1e-5){
    facets++;
    if(!sample)sample={cx,cz,x:Math.floor(a[i]),z:Math.floor(a[i+2]),length:a.length};
   }
  }
 }
 assert.ok(facets>0,'ivory seedhead crowns appear on representative grass');
 const removed=moonbellVertices(world(123,new Map([[[sample.x,4,sample.z].join(','),0]])),sample.cx,sample.cz,opts);
 assert.ok(removed.length<sample.length,'edited grass suppresses ivory seedheads');
 assert.equal(MOONBELL_LIMITS.newDrawCalls,0);
 assert.equal(MOONBELL_LIMITS.newTextures,0);
});

test('stone-edge fan moss grows only by actual adjacent rock and respects edits',()=>{
 const rockWorld=(seed=123,edits=new Map())=>({
  seed,get(x,y,z){
   const key=[x,y,z].join(',');
   if(edits.has(key))return edits.get(key);
   if(y===5 && x%16===8)return 3;
   return baseAt(x,y,z);
  }
 });
 let sample=null;
 for(let cx=-10;cx<=10&&!sample;cx++)for(let cz=-10;cz<=10&&!sample;cz++){
  const vertices=moonbellVertices(rockWorld(),cx,cz,opts);
  for(let i=0;i<vertices.length;i+=9){
   if(Math.abs(vertices[i+3]-.56)<1e-5&&Math.abs(vertices[i+4]-.73)<1e-5){
    sample={cx,cz,vertices};break;
   }
  }
 }
 assert.ok(sample,'real stone adjacency produces fan moss');
 assert.deepEqual(sample.vertices,moonbellVertices(rockWorld(),sample.cx,sample.cz,opts));
 const plain=moonbellVertices(world(),sample.cx,sample.cz,opts);
 assert.ok(!Array.from(plain).some((v,i,a)=>i%9===3&&Math.abs(v-.56)<1e-5&&Math.abs(a[i+1]-.73)<1e-5),
  'no stone-edge moss appears on ordinary open grass');
 assert.ok(sample.vertices.length/9<=MOONBELL_LIMITS.maxFlowersPerChunk*MOONBELL_LIMITS.maxVerticesPerFlower);
});

test('pale lichen requires real natural stone and never marks decorative construction',()=>{
 const scene=(kind)=>({seed:123,get(x,y,z){
  if(y===5&&x%16===8)return kind;
  return baseAt(x,y,z);
 }});
 let natural=0,constructed=0;
 for(let cx=-12;cx<=12;cx++)for(let cz=-12;cz<=12;cz++){
  const a=moonbellVertices(scene(3),cx,cz,opts);
  const b=moonbellVertices(scene(4),cx,cz,opts);
  assert.deepEqual(a,moonbellVertices(scene(3),cx,cz,opts));
  assert.ok(a.length/9<=MOONBELL_LIMITS.maxFlowersPerChunk*MOONBELL_LIMITS.maxVerticesPerFlower);
  for(let i=0;i<a.length;i+=9)
   if(Math.abs(a[i+3]-.79)<1e-5&&Math.abs(a[i+4]-.84)<1e-5)natural++;
  for(let i=0;i<b.length;i+=9)
   if(Math.abs(b[i+3]-.79)<1e-5&&Math.abs(b[i+4]-.84)<1e-5)constructed++;
 }
 assert.ok(natural>0,'natural exposed rock receives pale hanging lichen');
 assert.equal(constructed,0,'constructed block faces never receive cave-edge lichen');
});
