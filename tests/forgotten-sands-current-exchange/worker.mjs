import {prepareP0MixedGroup} from '../../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {createP0FastVista} from '../../src/manual-biomes/forgotten-sands-fast-vista.mjs';
import {recolorP0FarCache} from '../../src/manual-biomes/forgotten-sands-far-appearance.mjs';
import {openP0CompositeFixture} from '../../src/manual-biomes/forgotten-sands-composite-fixture.mjs';
import {planP0EmptyOwnerExchange} from '../../src/manual-biomes/forgotten-sands-empty-owner-exchange.mjs';
import * as P from '../../.current-source/src/manual-biomes/profile-world.mjs';
import * as H from '../../.current-source/src/world-height.mjs';
import * as N from '../../.current-source/src/world-height-natural-contract.mjs';
import * as V from '../../.current-source/src/voxel.mjs';
import {planHeightStream} from '../../.current-source/src/world-height-stream.mjs';
import {Pack2LiveWorld} from '../../.current-source/src/pack2-world.mjs';
import {pack2WaterSectionVertices} from '../../.current-source/src/pack2-integration.mjs';
let state,fixture,world,source,cache,colored,ranges,epoch=0,plan=null,before;
const canonical=k=>H.runtimeMeshKey(k.cx,k.cz,k.section);
const current=()=>JSON.stringify(fixture.world.save())===before&&world.pack2Cells.size===0;
const meshes=new Map();let retainedBytes=0;
function mesh(s,k){
 if(meshes.has(k))return meshes.get(k);
 const vertices=V.meshChunk(world,s.cx,s.cz,s.section),water=pack2WaterSectionVertices(world,s.cx,s.cz,s.section),bytes=vertices.byteLength+water.byteLength;
 if(bytes>2097152)throw Error('Fixture owner staging cap');
 while(meshes.size>=48||retainedBytes+bytes>8388608){
  const k=meshes.keys().next().value;if(k===undefined)throw Error('Fixture mesh cache budget');
  const old=meshes.get(k);retainedBytes-=old.vertices.byteLength+old.water.byteLength;meshes.delete(k);
 }
 const item={vertices,water};meshes.set(k,item);retainedBytes+=bytes;return item;
}
self.onmessage=async e=>{try{
 const m=e.data;
 if(m.type==='prepare'){
  state=prepareP0MixedGroup(m.index);
  fixture=await openP0CompositeFixture(m.index,{P,H,N,reserved:()=>false,revision:()=>'detached-exchange-webgl-v1'});
  world=new Pack2LiveWorld(fixture.world);source=new Pack2LiveWorld(new P.FourRegionWorld(fixture.world.seed,P.fourRegionProfile(fixture.world.seed,P.M8_MOUNTAIN_GENERATOR)));
  before=JSON.stringify(fixture.world.save());
  const mid=state.spec.modules[1];
  cache=createP0FastVista(source,world,state.spec.modules,{eye:[mid.x-48,17,mid.z],snapshotCurrent:current});
  colored=recolorP0FarCache(cache,source,world);if(colored.unsupported)throw Error('Unsupported current source RGB');
  ranges=cache.ranges.map(r=>{const [cx,cz,section]=r.key.split(',').map(Number);return {...r,key:H.runtimeMeshKey(cx,cz,section)};});
  self.postMessage({type:'prepared',seed:state.spec.seed,stats:cache.stats,farBytes:colored.vertices.byteLength});return;
 }
 if(m.type==='window'){
  epoch=m.epoch;const mid=state.spec.modules[1],player={x:mid.x-m.distance,z:mid.z,feet:m.feet};
  const legacy=V.chunkWindow(player.x,player.z,2).map(c=>({...c,section:0})),selected=planHeightStream(world,player,legacy);
  const inspect=(s,k)=>{const item=mesh(s,k);return {complete:true,solidBytes:item.vertices.byteLength,waterBytes:item.water.byteLength};};
  const a=planP0EmptyOwnerExchange({selected,player,H,world,inspect,farBytes:colored.vertices.byteLength,sourceCurrent:current});
  plan={selected,retained:a.allowed?a.retained:selected,allowed:a.allowed,removed:a.removed??null,reason:a.reason,owners:a.owners??selected.length,bytes:a.bytes??null};
  self.postMessage({type:'window',epoch,eye:[player.x,player.feet+2,player.z],near:plan.retained.map(s=>({cx:s.cx,cz:s.cz,s:s.section,key:canonical(s)})),plan:{allowed:plan.allowed,removed:plan.removed,reason:plan.reason,owners:plan.owners,bytes:plan.bytes},body:H.physicalBodyRegions(player).map(s=>s.key)});return;
 }
 if(m.epoch!==epoch)throw Error('Stale request');
 if(m.type==='near'){
  const s=plan.retained.find(s=>canonical(s)===m.key);if(!s)throw Error('Unknown retained owner');
  const item=mesh(s,m.key),vertices=item.vertices.slice(),water=item.water.slice();
  self.postMessage({type:'near',epoch,key:m.key,section:s.section,vertices,water},[vertices.buffer,water.buffer]);return;
 }
 if(m.type==='far'){
  if(!plan.allowed||!current())throw Error('Far not admitted');
  const vertices=colored.vertices.slice();self.postMessage({type:'far',epoch,vertices,ranges},[vertices.buffer]);return;
 }
 if(m.type==='invalidate'){
  if(!plan.allowed||!plan.removed)throw Error('No exchange to invalidate');
  const s=plan.selected.find(s=>canonical(s)===plan.removed),y=H.runtimeSectionBounds(s.section).minY;
  if(!world.set(s.cx*16,y,s.cz*16,3))throw Error('Disposable source edit refused');
  const occupied=H.upperOccupancy(world,plan.removed);if(!occupied||current())throw Error('Source invalidation not detected');
  let stale=false;try{cache.copyVertices();}catch{stale=true;}if(!stale)throw Error('Stale cache accepted');
  self.postMessage({type:'invalidated',epoch,occupied,stale,placementAuthority:false});return;
 }
 throw Error('Unknown request');
}catch(e){self.postMessage({type:'fault',error:String(e.stack||e)});}};
