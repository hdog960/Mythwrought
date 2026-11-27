import test from 'node:test';
import assert from 'node:assert/strict';
import {ShatteredPeaksTerraceWorld} from '../src/manual-biomes/shattered-peaks-terrace.mjs';
import {planPhysicalMountainVista} from '../src/manual-biomes/shattered-peaks-physical-vista.mjs';
import {checkVistaBudget} from '../src/manual-biomes/shattered-peaks-vista.mjs';
import {planHeightStream} from '../src/world-height-stream.mjs';
import {runtimeMeshKey,runtimeSectionForY} from '../src/world-height.mjs';
import {meshChunk} from '../src/voxel.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from '../src/manual-biomes/mountain-v8-materials.mjs';
import {validateUpperSectionGeometry} from '../src/world-height-budget.mjs';
const w=new ShatteredPeaksTerraceWorld(179),x=-548,z=17,cx=Math.floor(x/16),cz=Math.floor(z/16);
const legacy=[];for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++)legacy.push({cx:a,cz:b,section:0});
const selected=planHeightStream(w,{x:x+.5,z:z+.5,feet:150},legacy);
const owner=(x,y,z)=>runtimeMeshKey(Math.floor(x/16),Math.floor(z/16),runtimeSectionForY(y));
// Reserve an actual unoccupied selection, not merely decrement a counter.
const omitted=selected.findLast(c=>c.section>0&&!w.upperNaturalOccupied(runtimeMeshKey(c.cx,c.cz,c.section)));
assert.ok(omitted);
const retained=selected.filter(c=>c!==omitted);
const nearKeys=new Set(retained.map(c=>runtimeMeshKey(c.cx,c.cz,c.section)));
const dirs=[[0,1,0],[-1,0,0],[1,0,0],[0,0,-1],[0,0,1],[0,-1,0]];
function verify(result,radius){
 assert.ok(result.ok,JSON.stringify(result.stats??result));
 const expected=new Set(),actual=new Set(),near=Array(6).fill(0),count=Array(6).fill(0);
 for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){
  const a=x+dx,b=z+dz;
  for(let y=20;y<=256;y++)if(w.get(a,y,b))for(let f=0;f<6;f++){
   const [i,j,k]=dirs[f];if(w.get(a+i,y+j,b+k))continue;
   if(nearKeys.has(owner(a,y,b))){near[f]++;continue;}
   expected.add([f,a,y,b].join(','));count[f]++;
  }
 }
 for(const q of result.quads)for(let v=q.v;v<q.v1;v++)for(let u=q.u;u<q.u1;u++){
  const h=q.f===0||q.f===5,xx=h||q.f>=3?x-radius+u:q.plane-Number(q.f===2);
  const yy=h?q.plane-Number(q.f===0):20+v;
  const zz=h?z-radius+v:q.f<=2?z-radius+u:q.plane-Number(q.f===4);
  const k=[q.f,xx,yy,zz].join(',');
  assert.ok(!actual.has(k),'duplicate '+k);actual.add(k);
  assert.ok(expected.has(k),'false physical face '+k);
 }
 assert.equal(actual.size,expected.size);assert.deepEqual(result.stats.counts,count);assert.deepEqual(result.stats.nearCounts,near);
 assert.equal(validateUpperSectionGeometry(result.vertices,new Float32Array()),result.stats.bytes);
}
let original;
test('actual full-volume source parity and genuine reserved slot',()=>{
 original=planPhysicalMountainVista(w,{x,z,nearKeys});verify(original,24);
 let detailedUpperBytes=0,detailedUpperOwners=0;
 for(const c of retained)if(c.section>0&&w.upperNaturalOccupied(runtimeMeshKey(c.cx,c.cz,c.section))){
  const v=meshChunk(w,c.cx,c.cz,c.section);detailedUpperBytes+=v.byteLength;detailedUpperOwners+=Number(v.byteLength>0);
 }
 assert.ok(checkVistaBudget(original,{detailedUpperBytes,detailedUpperOwners,totalDetailedOwners:retained.length}));
 console.log('SP5_PHYSICAL_VISTA',JSON.stringify({...original.stats,detailedUpperBytes,detailedUpperOwners,totalDetailedOwners:retained.length}));
});
test('mined holes and placed mountain cubes are reflected without stale or duplicate faces',()=>{
 assert.ok(original?.ok);
 let cell;
 for(let dz=-8;dz<=8&&!cell;dz++)for(let dx=-8;dx<=8;dx++){
  const a=x+dx,b=z+dz,p=w.terraceColumn(a,b);
  if(p?.topY>22&&!nearKeys.has(owner(a,p.topY,b))){cell=[a,p.topY,b];break;}
 }
 assert.ok(cell);
 const [a,y,b]=cell,id=w.get(a,y,b);
 assert.ok(w.set(a,y,b,0));assert.ok(w.set(a,y+2,b,M.stone));
 const edited=planPhysicalMountainVista(w,{x,z,nearKeys});verify(edited,24);
 assert.notDeepEqual(edited.vertices,original.vertices);
 assert.ok(w.set(a,y,b,id));assert.ok(w.set(a,y+2,b,0));
 assert.equal(w.edits.size,0);
 const restored=planPhysicalMountainVista(w,{x,z,nearKeys});assert.deepEqual(restored.vertices,original.vertices);
 const tiny=planPhysicalMountainVista(w,{x,z,nearKeys,byteLimit:216});assert.equal(tiny.ok,false);assert.equal(tiny.vertices,null);
 console.log('SP5_EDIT_VISTA',JSON.stringify({cell,edited:edited.stats,restoredBytes:restored.stats.bytes}));
});
