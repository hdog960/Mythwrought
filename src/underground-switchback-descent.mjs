// :36 underground candidate: physically carved, edit-respecting switchback descent.
// Explicit opt-in reader; no surface generator, engine contract or save mutation.
import {WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from './depth.mjs';
import {BLOCK,worldKey} from './voxel.mjs';
export const DESCENT_ORIGIN=Object.freeze({x:192,z:192});
const SIDE=28,PERIMETER=4*SIDE;
export function descentRoute(origin=DESCENT_ORIGIN){
  const out=[];
  for(let i=0;i<(Math.abs(WORLD_MIN_Y-LEGACY_WORLD_MIN_Y)-7)*4;i++){
    const t=i%PERIMETER;
    const x=t<SIDE?t:t<2*SIDE?SIDE:t<3*SIDE?3*SIDE-t:0;
    const z=t<SIDE?0:t<2*SIDE?t-SIDE:t<3*SIDE?SIDE:4*SIDE-t;
    const floor=LEGACY_WORLD_MIN_Y-2-Math.floor(i/4);
    out.push({x:origin.x+x,z:origin.z+z,floor,feet:floor+1});
  }
  return out;
}
export function descentCells(origin=DESCENT_ORIGIN){
  const cells=new Map(),route=descentRoute(origin);
  const set=(x,y,z,id)=>{
    if(y>=LEGACY_WORLD_MIN_Y||y<WORLD_MIN_Y+1)return;
    cells.set(worldKey(x,y,z),id);
  };
  // Continuous 3-wide walk with four blocks of clearance. The 1:4 descent
  // is navigable as a series of one-voxel steps rather than a sheer shaft.
  for(const p of route)for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
    for(let h=1;h<=4;h++)set(p.x+dx,p.floor+h,p.z+dz,BLOCK.AIR);
  // Connected radial alcoves with broad flat floors at representative depths.
  for(const depth of [-30,-80,-130,-180]){
    const p=route.find(q=>q.floor===depth);
    if(!p)continue;
    for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){
      if(dx*dx+dz*dz>36)continue;
      for(let h=1;h<=6;h++)set(p.x+dx,depth+h,p.z+dz,BLOCK.AIR);
      set(p.x+dx,depth,p.z+dz,BLOCK.DEEPSTONE);
    }
  }
  // Restore centerline support after overlapping segments, including alcoves.
  for(const p of route)set(p.x,p.floor,p.z,BLOCK.DEEPSTONE);
  return cells;
}
export function descentWorld(world,origin=DESCENT_ORIGIN){
  if(!world||typeof world.get!=='function'||!(world.edits instanceof Map))throw Error('Invalid world');
  const cells=descentCells(origin);
  return {seed:world.seed,edits:world.edits,get(x,y,z){
    const key=worldKey(x,y,z);
    if(world.edits.has(key))return world.get(x,y,z);
    return cells.get(key)??world.get(x,y,z);
  }};
}
export function descentEvidence(world,origin=DESCENT_ORIGIN){
  const reader=descentWorld(world,origin),route=descentRoute(origin);
  const bands=[[-4,-45],[-46,-100],[-101,-155],[-156,WORLD_MIN_Y+1]];
  return bands.map(([high,low])=>{
    const steps=route.filter(p=>p.floor<=high&&p.floor>=low);
    const invalid=steps.filter(p=>reader.get(p.x,p.floor,p.z)===BLOCK.AIR||
      reader.get(p.x,p.feet,p.z)!==BLOCK.AIR||
      reader.get(p.x,p.feet+1,p.z)!==BLOCK.AIR);
    return {high,low,count:steps.length,invalid:invalid.length};
  });
}
