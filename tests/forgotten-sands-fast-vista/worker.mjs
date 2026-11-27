import {prepareP0MixedGroup,p0BenchmarkMesh} from '../../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../../src/manual-biomes/forgotten-sands-second-site.mjs';
import {createP0FastVista} from '../../src/manual-biomes/forgotten-sands-fast-vista.mjs';
let state=null,near=[],eye=null,epoch=0,cache=null;
self.onmessage=e=>{try{
  const m=e.data;
  if(m.type==='prepare'){state=prepareP0MixedGroup(m.index);const mid=state.spec.modules[1];cache=createP0FastVista(state.world,state.group.view,state.spec.modules,{eye:[mid.x-48,17,mid.z],snapshotCurrent:state.group.snapshotCurrent});self.postMessage({type:'prepared',seed:state.spec.seed,stats:cache.stats});return;}
  if(m.type==='window'){
    epoch=m.epoch;const mid=state.spec.modules[1];eye=[mid.x-m.distance,17,mid.z];
    near=p0BenchmarkWindow(Math.floor(eye[0]/16),Math.floor(eye[2]/16),15);
    self.postMessage({type:'window',epoch,eye,near});return;
  }
  if(m.epoch!==epoch)throw Error('Stale request');
  if(m.type==='near'){
    const k=near.find(k=>k.key===m.key);if(!k)throw Error('Invalid near key');
    const v=p0BenchmarkMesh(state.group.view,k.cx,k.cz,k.s);self.postMessage({type:'near',epoch,key:k.key,vertices:v},[v.buffer]);return;
  }
  if(m.type==='far'){
    const vertices=cache.copyVertices();self.postMessage({type:'far',epoch,vertices,ranges:cache.ranges,stats:cache.stats},[vertices.buffer]);return;
  }
  throw Error('Unknown request');
}catch(e){self.postMessage({type:'fault',error:String(e.stack||e)});}};
