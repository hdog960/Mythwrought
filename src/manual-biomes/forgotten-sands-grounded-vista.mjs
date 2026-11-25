// Detached exact-face distant representation. One Float32Array, 9 floats
// per rectangle instance, not per vertex. No gameplay ownership or writes.
import {BLOCK} from '../voxel.mjs';
import {buildP0FarShell,planP0FarSlot,P0_FAR_MAX_BYTES} from './forgotten-sands-far-shell.mjs';
import {biome130Block} from '../biome130-registry.mjs';
const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,0,1],[0,0,-1]];
const stone=[[.43,.46,.50],[.40,.43,.47],[.53,.56,.60],[.45,.48,.52],[.41,.44,.48]];
// Source-family representative palette (far-only, not exact per-texel RGB).
const palette={1:[.35,.64,.32],2:[.48,.34,.24],3:[.48,.51,.55],
256:[.85,.72,.48],257:[.70,.38,.24],258:[.64,.49,.32],259:[.88,.84,.76],260:[.61,.37,.23],261:[.78,.60,.38],262:[.66,.41,.30],263:[.40,.30,.27],264:[.78,.65,.47]};
const shades=[.83,.72,1,.87,.78],full=id=>id===1||id===2||id===3||(id>=256&&id<=264&&biome130Block(id).solid&&biome130Block(id).boxes.some(b=>b.every((n,i)=>n===(i<3?0:1))));
const key=(x,z)=>[Math.floor(x/16),Math.floor(z/16),0].join(',');
export function p0CompressPlanes(rows){
  const planes=new Map();
  for(const r of rows){
    const k=[r.kind,r.id,r.d,r.p].join(',');if(!planes.has(k))planes.set(k,new Map());
    const p=planes.get(k);if(!p.has(r.row))p.set(r.row,new Set());
    for(let a=r.a;a<r.b;a++)p.get(r.row).add(a);
  }
  const rects=[];
  for(const [k,rows] of [...planes].sort((a,b)=>a[0].localeCompare(b[0]))){
    const [kind,id,d,p]=k.split(',').map(Number);
    for(const row of [...rows.keys()].sort((a,b)=>a-b)){
      const s=rows.get(row);
      for(const a of [...s].sort((a,b)=>a-b)){
        if(!s.has(a))continue;
        let b=a+1;while(s.has(b))b++;
        let end=row+1;
        for(;;end++){const next=rows.get(end);if(!next)break;let all=true;for(let u=a;u<b;u++)if(!next.has(u)){all=false;break;}if(!all)break;}
        for(let v=row;v<end;v++)for(let u=a;u<b;u++)rows.get(v).delete(u);
        rects.push(Object.freeze({kind,id,d,p,row,end,a,b}));
      }
    }
  }
  return Object.freeze(rects);
}
export function buildP0GroundedVista(world,view,modules,near,{eye}={}){
  if(!Array.isArray(eye)||eye.length!==3||!eye.every(Number.isFinite)||!Array.isArray(near)||near.length!==18)throw Error('Invalid vista request');
  const shell=buildP0FarShell(world,view,modules,near),rows=shell.rectangles.map(r=>({...r,kind:0,id:3}));
  const nearSet=new Set(near.map(k=>k.key)),caps=new Map();
  const bounds={minX:Math.min(Math.floor(eye[0])-8,...modules.map(m=>m.x-(m.size-1)/2-12)),
    maxX:Math.max(Math.floor(eye[0])+8,...modules.map(m=>m.x+(m.size-1)/2+12)),
    minZ:Math.min(Math.floor(eye[2])-8,...modules.map(m=>m.z-(m.size-1)/2-12)),
    maxZ:Math.max(Math.floor(eye[2])+8,...modules.map(m=>m.z+(m.size-1)/2+12))};
  if((bounds.maxX-bounds.minX+3)*(bounds.maxZ-bounds.minZ+3)>20000)throw Error('Ground vista envelope cap');
  const pos=(x,z)=>x+','+z;
  for(let z=bounds.minZ-1;z<=bounds.maxZ+1;z++)for(let x=bounds.minX-1;x<=bounds.maxX+1;x++){
    // Scan actual source occupancy, not guessed terrainHeight. A non-ground
    // obstacle is not turned into a fictional ground slab.
    let y=19;for(;y>=-3;y--)if(world.get(x,y,z)!==BLOCK.AIR)break;
    const id=world.get(x,y,z);caps.set(pos(x,z),{y,id,full:full(id)});
  }
  let groundFaces=0,groundColumns=0,groundNearOmitted=0;
  for(let z=bounds.minZ;z<=bounds.maxZ;z++)for(let x=bounds.minX;x<=bounds.maxX;x++){
    const cap=caps.get(pos(x,z));if(!cap.full)continue;
    if(nearSet.has(key(x,z))){groundNearOmitted++;continue;}
    groundColumns++;
    for(let y=cap.y;y>=Math.max(-3,cap.y-8);y--){
      const id=world.get(x,y,z);if(!full(id)||view.get(x,y,z)!==id)continue;
      for(let d=0;d<5;d++){
        const [dx,dy,dz]=dirs[d];
        if(d===2?y!==cap.y:(caps.get(pos(x+dx,z+dz))?.y??19)>=y)continue;
        if(view.get(x+dx,y+dy,z+dz)!==BLOCK.AIR)continue;
        const p=d===0?x+1:d===1?x:d===2?y+1:d===3?z+1:z,row=d===2?z:y,a=d<2?z:x;
        rows.push({kind:1,id,d,p,row,a,b:a+1});groundFaces++;
      }
    }
  }
  const rects=p0CompressPlanes(rows),vertices=new Float32Array(rects.length*9);
  let at=0,monumentRects=0,terrainRects=0;
  for(const r of rects){
    const rgb=r.kind===0?stone[r.d]:(palette[r.id]??palette[3]).map(v=>v*shades[r.d]);
    // layout aPos=[kind*5+direction,plane,rowStart], aColor=rgb,
    // aUv=[alongStart,alongEnd], aMat=rowEnd. Shader expands 6 corners.
    vertices.set([r.kind*5+r.d,r.p,r.row,...rgb,r.a,r.b,r.end],at);at+=9;
    if(r.kind===0)monumentRects++;else terrainRects++;
  }
  if(vertices.byteLength>P0_FAR_MAX_BYTES)throw Error('Grounded vista instance cap');
  return Object.freeze({vertices,rectangles:rects,bounds:Object.freeze(bounds),monumentFaces:shell.sourceFaces,groundFaces,groundColumns,groundNearOmitted,
    monumentNearOmitted:shell.nearOmitted,oldMonumentRects:shell.rectangles.length,monumentRects,terrainRects});
}
export {planP0FarSlot};
