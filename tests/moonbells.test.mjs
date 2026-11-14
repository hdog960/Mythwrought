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
