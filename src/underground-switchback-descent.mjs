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
    // Begin below the protected legacy -3 layer: the first four-cell-high
    // passage must not rely on carving legacy terrain for headroom.
    const floor=LEGACY_WORLD_MIN_Y-5-Math.floor(i/4);
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
  // Two outward galleries per depth. Both begin on the OUTSIDE of the
  // switchback perimeter, so the descending route cannot subsequently place
  // a higher step's supporting stone inside either gallery. The second turns
  // tangentially after leaving the route, giving each grotto its own chamber.
  for(const depth of [-30,-80,-130,-180]){
    const anchor=route.find(p=>p.floor===depth);
    if(!anchor)continue;
    const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
    const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    for(let branch=0;branch<2;branch++){
      const points=[];
      for(let along=0;along<=22;along++){
        const out=Math.min(along,12),turn=branch===1?Math.max(0,along-12):0;
        points.push([anchor.x+outward[0]*out+tangent[0]*turn,
                     anchor.z+outward[1]*out+tangent[1]*turn]);
      }
      const [cx,cz]=points.at(-1);
      for(const [i,[x,z]] of points.entries())for(let across=-2;across<=2;across++){
        const cross=branch===1&&i>12?outward:tangent;
        const px=x+cross[0]*across;
        const pz=z+cross[1]*across;
        set(px,depth,pz,BLOCK.DEEPSTONE);
        for(let h=1;h<=5;h++)set(px,depth+h,pz,BLOCK.AIR);
      }
      for(let dx=-7;dx<=7;dx++)for(let dz=-7;dz<=7;dz++){
        if(dx*dx+dz*dz>49)continue;
        set(cx+dx,depth,cz+dz,BLOCK.DEEPSTONE);
        for(let h=1;h<=6;h++)set(cx+dx,depth+h,cz+dz,BLOCK.AIR);
      }
    }
  }
  // An outer cross-gallery connects the two side grottoes into a real loop,
  // so explorers can return by a different route rather than backtracking.
  // Keep the loop outside the descending perimeter and on the same floor.
  for(const depth of [-30,-80,-130,-180]){
    const anchor=route.find(p=>p.floor===depth);
    if(!anchor)continue;
    const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
    const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    // Branch zero ends at outward=12, tangent=0. Branch one ends at
    // outward=12, tangent=10. The outer passage joins their chamber edges.
    for(let t=0;t<=10;t++)for(let across=-2;across<=2;across++){
      const x=anchor.x+outward[0]*(19+across)+tangent[0]*t;
      const z=anchor.z+outward[1]*(19+across)+tangent[1]*t;
      set(x,depth,z,BLOCK.DEEPSTONE);
      for(let h=1;h<=5;h++)set(x,depth+h,z,BLOCK.AIR);
    }
  }
  // A broad stepped echo hall between the middle and lower grotto bands.
  // Its outer placement avoids the main spiral. Two terraces descend by one
  // voxel each, with a continuous five-wide, five-high walking approach.
  // This is authored AIR and DEEPSTONE, not a render-only decoration.
  {
    const depth=-105,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      for(let d=0;d<=42;d++){
        const floor=depth-Math.min(2,Math.floor(d/14));
        for(let across=-2;across<=2;across++){
          const x=anchor.x+outward[0]*d+tangent[0]*across;
          const z=anchor.z+outward[1]*d+tangent[1]*across;
          set(x,floor,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=6;h++)set(x,floor+h,z,BLOCK.AIR);
        }
      }
      for(let d=28;d<=44;d++)for(let across=-10;across<=10;across++){
        if((d-36)*(d-36)+across*across>100)continue;
        const floor=depth-2;
        const x=anchor.x+outward[0]*d+tangent[0]*across;
        const z=anchor.z+outward[1]*d+tangent[1]*across;
        set(x,floor,z,BLOCK.DEEPSTONE);
        for(let h=1;h<=9;h++)set(x,floor+h,z,BLOCK.AIR);
      }
    }
  }
  // Deepest-band crescent refuge: an outward approach opens into a broad,
  // asymmetrical cavern with a second smaller pocket. This is real voxel
  // topology at Y=-195, safely above the bedrock margin. No new IDs.
  {
    const depth=-195,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,r,height)=>{
        for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){
          if(a*a+b*b>r*r)continue;
          const x=anchor.x+outward[0]*(d+a)+tangent[0]*(t+b);
          const z=anchor.z+outward[1]*(d+a)+tangent[1]*(t+b);
          set(x,depth,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,depth+h,z,BLOCK.AIR);
        }
      };
      for(let d=0;d<=30;d++)carve(d,0,2,5);
      carve(31,0,11,10);
      carve(40,10,7,7);
      for(let t=0;t<=10;t++)carve(39,t,2,5);
    }
  }
  // Alcove floors can intersect the sloping approach at a different height.
  // Recarve the entire ordered player corridor AFTER the chambers, then
  // restore its support. Otherwise chamber floors seal three or more steps.
  // Two passes prevent a later step's support from being mistaken for air
  // while keeping all authored floor voxels solid.
  for(const p of route)for(let h=1;h<=4;h++)set(p.x,p.floor+h,p.z,BLOCK.AIR);
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

/**
 * Physical, ordered descent audit. A valid chamber alone is insufficient:
 * every consecutive foot position must be a walkable, one-voxel step with
 * two clear body cells and a solid supporting voxel. Edits take precedence.
 * This deliberately does NOT certify a surface entrance or browser runtime.
 */
export function descentConnectivity(world,origin=DESCENT_ORIGIN){
  const reader=descentWorld(world,origin),route=descentRoute(origin);
  const failures=[],bands=[0,0,0,0];
  let highest=null,lowest=null;
  for(let i=0;i<route.length;i++){
    const p=route[i],prev=route[i-1];
    const band=p.floor>=-45?0:p.floor>=-100?1:p.floor>=-155?2:3;
    bands[band]++;
    if(highest===null)highest=p.floor;
    lowest=p.floor;
    if(reader.get(p.x,p.floor,p.z)===BLOCK.AIR||
       reader.get(p.x,p.feet,p.z)!==BLOCK.AIR||
       reader.get(p.x,p.feet+1,p.z)!==BLOCK.AIR)
      failures.push({step:i,reason:'blocked-or-unsupported'});
    if(prev){
      const horizontal=Math.abs(p.x-prev.x)+Math.abs(p.z-prev.z);
      const vertical=Math.abs(p.feet-prev.feet);
      if(horizontal!==1||vertical>1)
        failures.push({step:i,reason:'disconnected-step'});
      // A player stepping downward must also have an unobstructed head path
      // at the shared boundary; checking only destination feet misses this.
      if(reader.get(p.x,Math.max(p.feet,prev.feet)+1,p.z)!==BLOCK.AIR)
        failures.push({step:i,reason:'step-head-obstruction'});
    }
  }
  return {connected:failures.length===0&&bands.every(n=>n>0),
    failures,bands,highest,lowest,steps:route.length,
    surfaceConnected:false,reason:'surface throat requires :24 coordination and runtime proof'};
}

/** Fixed-seed physical voxel occupancy evidence, including authored side rooms.
 * Count only candidate-owned cells in each depth band; do not mistake a
 * populated route array for carved air or supporting stone. Player edits
 * override the candidate and are reflected in these counts.
 */
export function descentVolumeEvidence(world,origin=DESCENT_ORIGIN){
  const reader=descentWorld(world,origin),cells=descentCells(origin);
  const bands=[[-4,-45],[-46,-100],[-101,-155],[-156,WORLD_MIN_Y+1]];
  const counts=bands.map(([high,low])=>({high,low,air:0,solid:0,other:0}));
  for(const key of cells.keys()){
    const [x,y,z]=key.split(',').map(Number);
    const band=counts.find(b=>y<=b.high&&y>=b.low);
    if(!band)continue;
    const id=reader.get(x,y,z);
    if(id===BLOCK.AIR)band.air++;
    else if(id===BLOCK.DEEPSTONE||id===BLOCK.STONE)band.solid++;
    else band.other++;
  }
  return counts;
}
