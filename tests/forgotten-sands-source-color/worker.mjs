import {prepareP0MixedGroup} from '../../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../../src/manual-biomes/forgotten-sands-second-site.mjs';
import {createP0FastVista} from '../../src/manual-biomes/forgotten-sands-fast-vista.mjs';
import {recolorP0FarCache} from '../../src/manual-biomes/forgotten-sands-far-appearance.mjs';
import {openP0CompositeFixture} from '../../src/manual-biomes/forgotten-sands-composite-fixture.mjs';
import * as P from '../../.current-source/src/manual-biomes/profile-world.mjs';
import * as H from '../../.current-source/src/world-height.mjs';
import * as N from '../../.current-source/src/world-height-natural-contract.mjs';
import * as V from '../../.current-source/src/voxel.mjs';
import {Pack2LiveWorld} from '../../.current-source/src/pack2-world.mjs';
import {pack2WaterSectionVertices} from '../../.current-source/src/pack2-integration.mjs';
let state,world,cache,near=[],epoch=0;
self.onmessage=async e=>{try{
 const m=e.data;
 if(m.type==='prepare'){
  state=prepareP0MixedGroup(m.index);
  const f=await openP0CompositeFixture(m.index,{P,H,N,reserved:()=>false,revision:()=>'detached-color-v1'});
  world=new Pack2LiveWorld(f.world);const mid=state.spec.modules[1];
  cache=createP0FastVista(state.world,state.group.view,state.spec.modules,{eye:[mid.x-48,17,mid.z],snapshotCurrent:state.group.snapshotCurrent});
  self.postMessage({type:'prepared',seed:state.spec.seed,stats:cache.stats});return;
 }
 if(m.type==='window'){
  epoch=m.epoch;const mid=state.spec.modules[1],eye=[mid.x-m.distance,17,mid.z];
  near=p0BenchmarkWindow(Math.floor(eye[0]/16),Math.floor(eye[2]/16),15);
  self.postMessage({type:'window',epoch,eye,near});return;
 }
 if(m.epoch!==epoch)throw Error('Stale request');
 if(m.type==='near'){
  const k=near.find(k=>k.key===m.key);if(!k)throw Error('Invalid near key');
  const vertices=V.meshChunk(world,k.cx,k.cz,k.s),water=pack2WaterSectionVertices(world,k.cx,k.cz,k.s);
  if(water.length)throw Error('Opaque color fixture includes actual water; requires water pass');
  self.postMessage({type:'near',epoch,key:k.key,vertices},[vertices.buffer]);return;
 }
 if(m.type==='far'){
  const original=cache.copyVertices(),color=recolorP0FarCache(cache,state.world,state.group.view);
  if(color.unsupported)throw Error('Unsupported source color');
  const vertices=color.vertices;
  for(let i=0;i<vertices.length;i+=9)for(const a of [0,1,2,6,7,8])if(vertices[i+a]!==original[i+a])throw Error('Color altered geometry');
  self.postMessage({type:'far',epoch,original,vertices,ranges:cache.ranges,changed:color.changed},[original.buffer,vertices.buffer]);return;
 }
 throw Error('Unknown request');
}catch(e){self.postMessage({type:'fault',error:String(e.stack||e)});}};
