// Detached exact-face distant representation. One Float32Array, 9 floats
// per rectangle instance, not per vertex. No gameplay ownership or writes.
import {p0CompressPlanes} from './forgotten-sands-grounded-vista.mjs';
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
function collect(world,view,modules,eye){
  if(!Array.isArray(eye)||eye.length!==3||!eye.every(Number.isFinite))throw Error('Invalid vista request');
  const shell=buildP0FarShell(world,view,modules,[]),rows=shell.rectangles.map(r=>({...r,kind:0,id:3}));
  const caps=new Map();
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
  return {rows,bounds,groundFaces,monumentFaces:shell.sourceFaces};
}
const owner=(x,y,z)=>[Math.floor(x/16),Math.floor(z/16),y<=19?0:1+Math.floor((y-20)/16)].join(',');
function coords(r,a){
  const {d,p,row}=r;
  return d<2?[p-(d===0?1:0),row,a]:d===2?[a,p-1,row]:[a,row,p-(d===3?1:0)];
}
export function createP0CachedVista(world,view,modules,{eye,snapshotCurrent}={}){
  if(typeof snapshotCurrent!=='function'||snapshotCurrent()!==true)throw Error('Detached source revision required');
  const t=performance.now(),data=collect(world,view,modules,eye),byOwner=new Map();
  let units=0;
  for(const r of data.rows)for(let a=r.a;a<r.b;a++){
    const k=owner(...coords(r,a));
    if(!byOwner.has(k))byOwner.set(k,[]);
    byOwner.get(k).push({...r,a,b:a+1});
    if(++units>65536)throw Error('Far cache face cap');
  }
  if(byOwner.size>256)throw Error('Far cache owner cap');
  const records=[],ranges=[];let count=0;
  for(const [k,rows] of [...byOwner].sort((a,b)=>a[0].localeCompare(b[0]))){
    const rects=p0CompressPlanes(rows),start=count;
    for(const r of rects){
      const rgb=r.kind===0?stone[r.d]:(palette[r.id]??palette[3]).map(v=>v*shades[r.d]);
      records.push(r.kind*5+r.d,r.p,r.row,...rgb,r.a,r.b,r.end);count++;
    }
    ranges.push(Object.freeze({key:k,start,count:count-start,faces:rows.length}));
  }
  const packed=new Float32Array(records);
  if(packed.byteLength>P0_FAR_MAX_BYTES)throw Error('Fixed far cache exceeds 512KiB');
  if(snapshotCurrent()!==true)throw Error('Stale detached source');
  const stats=Object.freeze({units,owners:ranges.length,records:count,bytes:packed.byteLength,groundFaces:data.groundFaces,monumentFaces:data.monumentFaces,buildMs:performance.now()-t});
  const assertCurrent=()=>{if(snapshotCurrent()!==true)throw Error('Stale detached source');};
  return Object.freeze({stats,bounds:Object.freeze(data.bounds),ranges:Object.freeze(ranges),
    copyVertices(){assertCurrent();return packed.slice();},
    select(keys){
      assertCurrent();
      if(!Array.isArray(keys)||keys.length>18||new Set(keys).size!==keys.length)throw Error('Invalid resident owners');
      const near=new Set(keys),visible=ranges.filter(r=>!near.has(r.key));
      return Object.freeze({ranges:Object.freeze(visible),faces:visible.reduce((n,r)=>n+r.faces,0),omitted:units-visible.reduce((n,r)=>n+r.faces,0)});
    }
  });
}
