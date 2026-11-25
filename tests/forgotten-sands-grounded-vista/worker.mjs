import {prepareP0MixedGroup,p0BenchmarkMesh} from '../../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../../src/manual-biomes/forgotten-sands-second-site.mjs';
import {buildP0GroundedVista,planP0FarSlot} from '../../src/manual-biomes/forgotten-sands-grounded-vista.mjs';
let state=null,near=[],eye=null,epoch=0;
self.onmessage=e=>{try{
  const m=e.data;
  if(m.type==='prepare'){state=prepareP0MixedGroup(m.index);self.postMessage({type:'prepared',seed:state.spec.seed});return;}
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
    const t=performance.now(),s=buildP0GroundedVista(state.world,state.group.view,state.spec.modules,near,{eye,unitMonuments:true}),plan=planP0FarSlot(near,{feet:15,nearBytes:m.nearBytes,farBytes:s.vertices.byteLength});
    self.postMessage({type:'far',epoch,vertices:s.vertices,plan,groundFaces:s.groundFaces,monumentFaces:s.monumentFaces,groundNearOmitted:s.groundNearOmitted,monumentNearOmitted:s.monumentNearOmitted,monumentRects:s.monumentRects,terrainRects:s.terrainRects,buildMs:performance.now()-t},[s.vertices.buffer]);return;
  }
  throw Error('Unknown request');
}catch(e){self.postMessage({type:'fault',error:String(e.stack||e)});}};
