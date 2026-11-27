import test from 'node:test';
import assert from 'node:assert/strict';
import {ShatteredPeaksTerraceWorld} from '../src/manual-biomes/shattered-peaks-terrace.mjs';
import {planShatteredUpperVista,checkVistaBudget} from '../src/manual-biomes/shattered-peaks-vista.mjs';
import {meshChunk} from '../src/voxel.mjs';
import {runtimeMeshKey,runtimeSectionForY} from '../src/world-height.mjs';
import {planHeightStream} from '../src/world-height-stream.mjs';
import {validateUpperSectionGeometry} from '../src/world-height-budget.mjs';
const w=new ShatteredPeaksTerraceWorld(179),x=-548,z=17,cx=Math.floor(x/16),cz=Math.floor(z/16);
const legacy=[];for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++)legacy.push({cx:a,cz:b,section:0});
const selected=planHeightStream(w,{x:x+.5,z:z+.5,feet:150},legacy);
const key=(x,y,z)=>runtimeMeshKey(Math.floor(x/16),Math.floor(z/16),runtimeSectionForY(y));
const nearKeys=new Set(selected.map(c=>runtimeMeshKey(c.cx,c.cz,c.section)));
let result;
test('exact source top and exposed side area, disjoint from real selected owners',()=>{
 result=planShatteredUpperVista(w,{x,z,nearKeys});
 let tops=0,nearTops=0,sides=0,nearSides=0;
 const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
 for(let dz=-24;dz<=24;dz++)for(let dx=-24;dx<=24;dx++){
  const wx=x+dx,wz=z+dz,p=w.terraceColumn(wx,wz);
  if(!p||p.topY<20)continue;
  assert.notEqual(w.get(wx,p.topY,wz),0);assert.equal(w.get(wx,p.topY+1,wz),0);
  if(nearKeys.has(key(wx,p.topY,wz)))nearTops++;else tops++;
  // Independent actual physical cell neighbor reads, not the heightfield.
  for(const [a,b] of dirs)for(let y=20;y<=p.topY;y++){
   if(w.get(wx+a,y,wz)!==0)continue;
   if(nearKeys.has(key(wx,y,wz)))nearSides++;else sides++;
  }
 }
 assert.deepEqual([result.stats.tops,result.stats.nearTops,result.stats.sideArea,result.stats.nearSideArea],[tops,nearTops,sides,nearSides]);
 assert.equal(tops,1637);assert.equal(nearTops,142);
 console.log('SP_VISTA_SOURCE',JSON.stringify({ok:result.ok,...result.stats}));
 if(!result.ok){assert.equal(result.vertices,null);return;}
 let area=0,topArea=0;const faces=new Set();
 for(const q of result.quads)for(let t=q.start;t<=q.end;t++){
  const wx=q.face>0&&q.face<=2?q.x:t,wz=q.face>0&&q.face<=2?t:q.z;
  for(let y=q.lo;y<=q.hi;y++){
   const f=[wx,y,wz,q.face].join(',');
   assert.ok(!faces.has(f));faces.add(f);
   assert.ok(!nearKeys.has(key(wx,y,wz)));assert.notEqual(w.get(wx,y,wz),0);
   if(q.face===0){assert.equal(w.get(wx,y+1,wz),0);topArea++;}
   else{const [a,b]=dirs[q.face-1];assert.equal(w.get(wx+a,y,wz+b),0);area++;}
  }
 }
 assert.equal(area,sides);assert.equal(topArea,tops);
 assert.equal(validateUpperSectionGeometry(result.vertices,new Float32Array()),result.stats.bytes);
});
test('preserve original budget and explicit edited-source veto; no extra slot by assumption',()=>{
 assert.ok(result);
 let bytes=0,owners=0;
 for(const c of selected)if(c.section>0&&w.upperNaturalOccupied(runtimeMeshKey(c.cx,c.cz,c.section))){
  const v=meshChunk(w,c.cx,c.cz,c.section);bytes+=v.byteLength;owners+=Number(v.byteLength>0);
 }
 const baseline={detailedUpperOwners:owners,totalDetailedOwners:selected.length,detailedUpperBytes:bytes};
 const admitted=checkVistaBudget(result,baseline);
 assert.equal(admitted,false);
 const reserve=checkVistaBudget(result,{...baseline,totalDetailedOwners:selected.length-1});
 console.log('SP_VISTA_BUDGET',JSON.stringify({baseline,admitted,reserve,bytes:result.stats.bytes}));
 const tiny=planShatteredUpperVista(w,{x,z,nearKeys,byteLimit:216});
 assert.equal(tiny.ok,false);assert.equal(tiny.vertices,null);
 const id=w.get(x,149,z);assert.notEqual(id,0);assert.ok(w.set(x,149,z,0));
 assert.throws(()=>planShatteredUpperVista(w,{x,z,nearKeys}),/Edited source/);
 assert.ok(w.set(x,149,z,id));assert.equal(w.edits.size,0);
});
