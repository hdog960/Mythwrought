// :24 upper cave candidate. No live registration, surface edits or save writes.
import {BLOCK,worldKey} from '../voxel.mjs';
import {WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from '../depth.mjs';

export const UPPER_SITES=Object.freeze([
  Object.freeze({name:'Windcut Gallery',x:64,z:-96}),
  Object.freeze({name:'Hollowbend Loop',x:-112,z:64})
]);
const key=(x,y,z)=>worldKey(x,y,z);
const same=(a,b)=>a===b;
export function upperCaveCells({seed=179,site=UPPER_SITES[0],descentReservation,protectedCells,editedCells,legacyCells}={}){
  // The reservation is mandatory: no inferred geographic separation from :36.
  if(!(descentReservation instanceof Map)||!(protectedCells instanceof Set)||
     !(editedCells instanceof Set)||typeof legacyCells!=='function')
    return Object.freeze({ok:false,reason:'SOURCE_RESERVATION_OR_EDIT_HISTORY_MISSING',cells:new Map()});
  const cells=new Map(),route=[],conflicts=[],columns=new Map();
  const solid=BLOCK.DEEPSTONE,air=BLOCK.AIR;
  const put=(x,y,z,id)=>{
    if(y>=LEGACY_WORLD_MIN_Y||y<-45||y<WORLD_MIN_Y+1)return;
    const k=key(x,y,z);
    // One-cell safety halo around every :36 reservation, even if same ID.
    for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++)
      if(descentReservation.has(key(x+dx,y+dy,z+dz))){conflicts.push(k);return;}
    if(protectedCells.has(k)||editedCells.has(k)||legacyCells(x,y,z)!==null){conflicts.push(k);return;}
    const prev=cells.get(k);
    if(prev!==undefined&&!same(prev,id)){conflicts.push(k);return;}
    cells.set(k,id);
  };
  const plan=(x,z,floor,height)=>{
    const k=x+','+z,old=columns.get(k);
    if(!old)columns.set(k,{x,z,floor,ceiling:Math.min(-4,floor+height)});
    else { old.floor=Math.max(old.floor,floor); old.ceiling=Math.max(old.ceiling,Math.min(-4,floor+height)); }
  };
  const carve=(x,z,floor,width=1,height=4)=>{
    if(floor>-8||floor<-40)return;
    for(let lateral=-width;lateral<=width;lateral++){
      const xx=x,zz=z+lateral;
      plan(xx,zz,floor,height);
    }
  };
  // Supported 3-wide descending nave, six horizontal cells per vertical step.
  // This is below the protected legacy surface. Opening remains manual only.
  for(let d=0;d<=120;d++){
    const floor=-8-Math.floor(d/6);
    const x=site.x+d,z=site.z+Math.round(3*Math.sin(d/13));
    carve(x,z,floor,1,4);route.push(Object.freeze({x,z,floor}));
  }
  // A pair of broad loop arms, with distinct offset gallery silhouettes.
  for(let d=38;d<=94;d++){
    const floor=-8-Math.floor(d/6);
    const x=site.x+d;
    const offset=Math.round(10*Math.sin(Math.PI*(d-38)/56));
    const base=site.z+Math.round(3*Math.sin(d/13));
    carve(x,base+offset,floor,1,5);
    carve(x,base-offset,floor,1,5);
  }
  // High-roof alcoves, only below the protected layer.
  for(const center of [{d:48,z:14,r:6},{d:85,z:-13,r:8},{d:110,z:3,r:9}]){
    const floor=-8-Math.floor(center.d/6);
    for(let dx=-center.r;dx<=center.r;dx++)for(let dz=-center.r;dz<=center.r;dz++){
      const radial=(dx*dx+dz*dz)/(center.r*center.r);
      if(radial>1)continue;
      const x=site.x+center.d+dx,z=site.z+center.z+dz;
      plan(x,z,floor,4+Math.floor(3*(1-radial)));
    }
  }
  // A third, long lateral mineral gallery leads to a broad sheltered vault.
  // The branch joins the central nave at d=108, stays on its supported
  // -26 floor, and crosses several independent streaming chunk boundaries.
  // It never reaches the protected surface or the :36 descent footprint.
  {
    // Begin where all three entrance columns share the same supported
    // -26 floor; the former d=108 start intersected a higher ramp step at
    // x=site.x+107 and left one side of the mineral branch unsupported.
    const d=110, x=site.x+d, floor=-8-Math.floor(d/6);
    const base=site.z+Math.round(3*Math.sin(d/13));
    const direction=site.x<0?-1:1;
    for(let step=0;step<=34;step++){
      const zz=base+direction*step;
      for(let dx=-1;dx<=1;dx++)plan(x+dx,zz,floor,5);
    }
    const endZ=base+direction*34;
    for(let dx=-10;dx<=10;dx++)for(let dz=-8;dz<=8;dz++){
      const radial=(dx/10)**2+(dz/8)**2;
      if(radial>1)continue;
      plan(x+dx,endZ+direction*dz,floor,5+Math.floor(4*(1-radial)));
    }
  }
  // Resolve overlapping passages by column, before writing any voxels. A higher
  // supported floor wins over a lower passage's headroom; never leave a
  // contradictory AIR/stone write or an unsupported raised floor.
  for(const {x,z,floor,ceiling} of columns.values()){
    put(x,floor,z,solid);
    for(let y=floor+1;y<=ceiling;y++)put(x,y,z,air);
  }
  if(conflicts.length)return Object.freeze({ok:false,reason:'PROTECTED_OR_CONFLICTING_CELLS',conflictCount:conflicts.length,cells:new Map()});
  return Object.freeze({ok:true,site:site.name,seed,cells,route:Object.freeze(route),
    openingProposal:Object.freeze({x:site.x,y:LEGACY_WORLD_MIN_Y,z:site.z,requiresManualApproval:true}),
    handoffProposal:Object.freeze({x:site.x+120,z:site.z+Math.round(3*Math.sin(120/13)),floor:-28,owner:':24',connectedTo36:false})});
}
export function upperCaveOverlay(world,options){
  const candidate=upperCaveCells(options);
  if(!candidate.ok)return candidate;
  return Object.freeze({...candidate,getBlock(x,y,z){
    const k=key(x,y,z);
    return candidate.cells.has(k)?candidate.cells.get(k):world.getBlock(x,y,z);
  }});
}
