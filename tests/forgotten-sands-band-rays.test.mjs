import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareP0MixedGroup} from '../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../src/manual-biomes/forgotten-sands-second-site.mjs';
import {buildP0GroundedVista} from '../src/manual-biomes/forgotten-sands-grounded-vista.mjs';
// Exact diagnostic screenshot camera from failed artifact15045014884;
// compare nearest far surface along center of each sampled screen pixel.
function rayHit(rectangles,eye,px,py){
 const pitch=.11,aspect=956/440,tan=Math.tan(72*Math.PI/360),
  x=(2*(px+.5)/956-1)*aspect*tan,y=(1-2*(py+.5)/440)*tan,
  dir=[Math.cos(pitch)-Math.sin(pitch)*y,Math.sin(pitch)+Math.cos(pitch)*y,x];
 let nearest=null;
 for(const r of rectangles){
  const axis=r.d<2?0:r.d===2?1:2;if(Math.abs(dir[axis])<1e-10)continue;
  const t=(r.p-eye[axis])/dir[axis];if(t<=0||t>100.06||nearest&&t>=nearest.t)continue;
  const p=eye.map((v,i)=>v+t*dir[i]),along=r.d<2?p[2]:p[0],row=r.d===2?p[2]:p[1];
  if(along<r.a||along>r.b||row<r.row||row>r.end)continue;
  nearest={t,d:r.d,kind:r.kind,p:r.p,along,row};
 }
 return nearest;
}
test('authenticated wide screenshot line pixel rays identify nearest exact source face versus uncovered gap',()=>{
 const {world,spec,group}=prepareP0MixedGroup(1),mid=spec.modules[1],eye=[mid.x-48,17,mid.z],
  near=p0BenchmarkWindow(Math.floor(eye[0]/16),Math.floor(eye[2]/16),15),
  s=buildP0GroundedVista(world,group.view,spec.modules,near,{eye}),samples=[];
 for(const x of [400,460,500,540,590,800])for(const y of [270,271,272,289,290,291]){
  const hit=rayHit(s.rectangles,eye,x,y);assert.ok(hit,'No exact source rectangle under sampled stone pixel');
  samples.push({x,y,d:hit.d,kind:hit.kind,plane:hit.p,t:Number(hit.t.toFixed(4))});
 }
 const bands=samples.filter(q=>q.y===271||q.y===290),adjacent=samples.filter(q=>q.y!==271&&q.y!==290);
 console.log('P0 BAND RAYS',JSON.stringify({bands,adjacent,topBand:bands.filter(q=>q.d===2&&q.kind===0).length,topAdjacent:adjacent.filter(q=>q.d===2&&q.kind===0).length}));
 assert.equal(samples.length,36);
});
