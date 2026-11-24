// Detached far-shell research: actual exposed proposed voxel faces only.
// No collision, placement, mutation, production registration or global fog.
import {BLOCK} from '../voxel.mjs';
import {p0UpperSectionForY} from './forgotten-sands-upper-probe.mjs';
export const P0_FAR_MAX_BYTES=512*1024;
const section=y=>y<=19?0:p0UpperSectionForY(y);
const key=(x,y,z)=>[Math.floor(x/16),Math.floor(z/16),section(y)].join(',');
const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,0,1],[0,0,-1]];
const color=[[.43,.46,.50],[.40,.43,.47],[.53,.56,.60],[.45,.48,.52],[.41,.44,.48]];
export function buildP0FarShell(world,view,modules,nearKeys){
  if(!Array.isArray(modules)||modules.length>3||!Array.isArray(nearKeys)||nearKeys.length>34)throw Error('Invalid far envelope');
  const near=new Set(nearKeys.map(k=>k.key)),rows=new Map(),columns=new Map();
  let sourceFaces=0,nearOmitted=0,inspected=0;
  const pos=(x,z)=>x+','+z;
  for(const m of modules){
    if(![m.x,m.z,m.size,m.height].every(Number.isSafeInteger)||m.size<15||m.size>63||m.size%2!==1||m.height>54)throw Error('Invalid far module');
    const r=(m.size-1)/2;
    for(let z=m.z-r;z<=m.z+r;z++)for(let x=m.x-r;x<=m.x+r;x++){
      let top=-1;
      for(let y=0;y<=17+m.height;y++){const id=view.get(x,y,z);if(id!==BLOCK.AIR&&world.get(x,y,z)===BLOCK.AIR)top=y;inspected++;}
      columns.set(pos(x,z),top);
    }
  }
  // Only outer height-envelope faces, not underground/interior cavity walls.
  for(const m of modules){
    const r=(m.size-1)/2;
    for(let z=m.z-r;z<=m.z+r;z++)for(let x=m.x-r;x<=m.x+r;x++){
      const top=columns.get(pos(x,z));
      for(let y=0;y<=top;y++){
        const id=view.get(x,y,z);
        if(id===BLOCK.AIR||world.get(x,y,z)!==BLOCK.AIR)continue;
        for(let d=0;d<dirs.length;d++){
          const [dx,dy,dz]=dirs[d];
          if(d===2?y!==top:(columns.get(pos(x+dx,z+dz))??-1)>=y)continue;
          if(view.get(x+dx,y+dy,z+dz)!==BLOCK.AIR)continue;
          if(near.has(key(x,y,z))){nearOmitted++;continue;}
          sourceFaces++;
          // Merge runs within a single plane and row. No filled gaps.
          const plane=d===0?x+1:d===1?x:d===2?y+1:d===3?z+1:z;
          const row=d===2?z:y,along=d<2?z:x;
          const k=[d,plane,row].join(',');if(!rows.has(k))rows.set(k,[]);rows.get(k).push(along);
        }
      }
    }
  }
  const vertices=[],rectangles=[];
  function emit(d,p,row,a,b){
    let points;
    if(d<2)points=[[p,row,a],[p,row,b],[p,row+1,b],[p,row+1,a]];
    else if(d===2)points=[[a,p,row],[b,p,row],[b,p,row+1],[a,p,row+1]];
    else points=[[a,row,p],[b,row,p],[b,row+1,p],[a,row+1,p]];
    for(const i of [0,1,2,0,2,3])vertices.push(...points[i],...color[d],i===0||i===3?0:b-a,i<2?0:1,3);
    rectangles.push(Object.freeze({d,p,row,a,b}));
    if(vertices.length*4>P0_FAR_MAX_BYTES)throw Error('Far shell byte cap');
  }
  for(const [k,vals] of [...rows].sort((a,b)=>a[0].localeCompare(b[0]))){
    const [d,p,row]=k.split(',').map(Number);vals.sort((a,b)=>a-b);
    let a=vals[0],b=a+1;
    for(const v of vals.slice(1)){if(v===b)b++;else if(v>b){emit(d,p,row,a,b);a=v;b=v+1;}}
    emit(d,p,row,a,b);
  }
  return Object.freeze({vertices:new Float32Array(vertices),rectangles:Object.freeze(rectangles),sourceFaces,nearOmitted,inspected});
}
export function planP0FarSlot(near,{feet,shaft=false,nearBytes=0,farBytes=0}={}){
  if(!Array.isArray(near)||near.length>34||!Number.isFinite(feet)||![nearBytes,farBytes].every(n=>Number.isSafeInteger(n)&&n>=0))throw Error('Invalid far slot');
  // Never steal required original near slots. No far representation underground,
  // in shaft mode, or when original upper residency already fills its budget.
  const allowed=feet>=0&&!shaft&&near.length<27&&farBytes>0&&farBytes<=P0_FAR_MAX_BYTES&&nearBytes+farBytes<=2610144;
  return Object.freeze({allowed,buffers:near.length+(allowed?1:0),vertexBytes:nearBytes+(allowed?farBytes:0)});
}
