// :24 deep cave candidate. Deterministic physical AIR corridors in all four depth bands.
// Opt-in reader: legacy [-3,19], save schema and engine streaming are untouched.
import {WORLD_MIN_Y,WORLD_MAX_Y,LEGACY_WORLD_MIN_Y} from './depth.mjs';
import {BLOCK,worldKey,collides} from './voxel.mjs';
const SIDE=40,PERIMETER=SIDE*4,STEPS=(LEGACY_WORLD_MIN_Y-WORLD_MIN_Y-1)*4;
export const DEEP_CAVE_ORIGIN=Object.freeze({x:64,z:64});
export const DEEP_CAVE_BANDS=Object.freeze([[-4,-45],[-46,-100],[-101,-155],[-156,WORLD_MIN_Y]]);
function position(i,origin){
  const n=i%PERIMETER;
  if(n<SIDE)return {x:origin.x+n,z:origin.z};
  if(n<2*SIDE)return {x:origin.x+SIDE,z:origin.z+n-SIDE};
  if(n<3*SIDE)return {x:origin.x+SIDE-(n-2*SIDE),z:origin.z+SIDE};
  return {x:origin.x,z:origin.z+SIDE-(n-3*SIDE)};
}
export function deepCaveRoute(origin=DEEP_CAVE_ORIGIN){
  const result=[];
  for(let i=0;i<=STEPS;i++){
    const {x,z}=position(i,origin),floor=Math.max(WORLD_MIN_Y+1,LEGACY_WORLD_MIN_Y-1-Math.floor(i/4));
    result.push({x,z,floor,feet:floor+1,step:i});
  }
  return result;
}
function cells(origin){
  const map=new Map(),route=deepCaveRoute(origin);
  const put=(x,y,z,id)=>{
    if(y>=LEGACY_WORLD_MIN_Y||y<WORLD_MIN_Y||y>WORLD_MAX_Y)return;
    const key=worldKey(x,y,z);
    // AIR wins over another segment's floor at a crossing; segments are
    // separated vertically by 40+ blocks except neighboring ramp steps.
    if(id===BLOCK.AIR||id===BLOCK.DEEPSTONE||!map.has(key))map.set(key,id);
  };
  for(const p of route){
    for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
      // Retain native stone at the floor until all air carving is complete.
      for(let dy=1;dy<=4;dy++)put(p.x+dx,p.floor+dy,p.z+dz,BLOCK.AIR);
    }
  }
  // Four broad rest chambers distributed down the descent, each linked
  // directly to the walking route; no floating, disconnected air pockets.
  for(const target of [-30,-75,-130,-185]){
    const p=route.find(s=>s.floor===target);
    if(!p)continue;
    for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){
      if(dx*dx+dz*dz>36)continue;
      put(p.x+dx,target,p.z+dz,BLOCK.DEEPSTONE);
      for(let dy=1;dy<=6;dy++)put(p.x+dx,target+dy,p.z+dz,BLOCK.AIR);
    }
  }
  // Restore the precise centerline's support after overlapping corridor cuts.
  // This avoids a lower ramp step accidentally erasing the higher step's floor.
  for(const p of route)put(p.x,p.floor,p.z,BLOCK.DEEPSTONE);
  return map;
}
const cache=new Map();
function geometry(origin){
  const key=origin.x+','+origin.z;
  if(!cache.has(key)){cache.set(key,cells(origin));if(cache.size>3)cache.delete(cache.keys().next().value);}
  return cache.get(key);
}
export function deepCaveWorld(world,origin=DEEP_CAVE_ORIGIN){
  if(!world||!Number.isInteger(origin.x)||!Number.isInteger(origin.z))throw Error('Invalid deep cave reader');
  const carved=geometry(origin);
  return {seed:world.seed,edits:world.edits,get(x,y,z){
    if(world.edits?.has(worldKey(x,y,z)))return world.get(x,y,z);
    if(y>=LEGACY_WORLD_MIN_Y||y<WORLD_MIN_Y||y>WORLD_MAX_Y)return world.get(x,y,z);
    return carved.get(worldKey(x,y,z))??world.get(x,y,z);
  }};
}
export function deepCaveEvidence(world,origin=DEEP_CAVE_ORIGIN){
  const reader=deepCaveWorld(world,origin),route=deepCaveRoute(origin);
  const bands=DEEP_CAVE_BANDS.map(([top,bottom])=>{
    const samples=route.filter(p=>p.floor<=top&&p.floor>=bottom);
    const failures=samples.filter(p=>reader.get(p.x,p.floor,p.z)===BLOCK.AIR||
      reader.get(p.x,p.feet,p.z)!==BLOCK.AIR||
      reader.get(p.x,p.feet+1,p.z)!==BLOCK.AIR||
      collides(reader,p.x+.5,p.feet,p.z+.5));
    return {top,bottom,samples:samples.length,failures:failures.length,
      first:samples[0]??null,last:samples.at(-1)??null};
  });
  return {bands,routeLength:route.length,entryRequiresLegacyFloorEdit:true,
    connectedByConstruction:true,walkable:bands.every(b=>b.samples>0&&b.failures===0)};
}
