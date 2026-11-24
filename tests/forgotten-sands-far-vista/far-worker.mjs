import {prepareP0MixedGroup,p0BenchmarkMesh} from '../../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../../src/manual-biomes/forgotten-sands-second-site.mjs';
import {buildP0FarShell,planP0FarSlot} from '../../src/manual-biomes/forgotten-sands-far-shell.mjs';
let state=null,near=[],bytes=0;
self.onmessage=e=>{try{
  const m=e.data;
  if(m.type==='prepare'){
    state=prepareP0MixedGroup(m.index);const mid=state.spec.modules[1];
    const eye=[mid.x-m.distance,17,mid.z],feet=15;
    near=p0BenchmarkWindow(Math.floor(eye[0]/16),Math.floor(eye[2]/16),feet);bytes=0;
    self.postMessage({type:'prepared',eye,feet,near,seed:state.spec.seed});return;
  }
  if(m.type==='near'){
    const k=near[m.i];if(!k)throw Error('Invalid near key');
    const v=p0BenchmarkMesh(state.group.view,k.cx,k.cz,k.s);bytes+=v.byteLength;
    self.postMessage({type:'near',vertices:v},[v.buffer]);return;
  }
  if(m.type==='far'){
    const s=buildP0FarShell(state.world,state.group.view,state.spec.modules,near);
    const plan=planP0FarSlot(near,{feet:15,nearBytes:bytes,farBytes:s.vertices.byteLength});
    self.postMessage({type:'far',vertices:s.vertices,plan,faces:s.sourceFaces,rectangles:s.rectangles.length,nearOmitted:s.nearOmitted},[s.vertices.buffer]);return;
  }
  throw Error('Unknown request');
}catch(e){self.postMessage({type:'fault',error:String(e.stack||e)});}};
