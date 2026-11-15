// Mythwrought Gate A — creator-approved Block Pack 2 physical geometry adapter.
// These 18 candidate sources are unchanged; this module is opt-in by the live
// world integration. It never writes to schema-1 saves or generates terrain.
import {PACK_2_ASSETS,pack2Asset,pack2Cell,pack2Shape,pack2PreviewMesh}
  from './block-packs/pack-2/definitions.mjs';
import {PACK_2_JOINERY,joineryAsset,joineryCell,joineryShape,joineryPreviewMesh}
  from './block-packs/pack-2/joinery.mjs';
import {PACK_2_GROUND,groundAsset,groundCell,groundShape,groundPreviewMesh}
  from './block-packs/pack-2/ground.mjs';
import {PACK_2_INFRASTRUCTURE,infrastructureAsset,infrastructureCell,
  infrastructureShape,infrastructurePreviewMesh}
  from './block-packs/pack-2/infrastructure.mjs';
import {WATER_ASSET,WATER_CANDIDATE_ID,waterCell,waterShape,waterPreviewMesh,waterRaycast}
  from './block-packs/pack-2/water.mjs';

const specs=Object.freeze([...PACK_2_ASSETS,...PACK_2_JOINERY,...PACK_2_GROUND,
  ...PACK_2_INFRASTRUCTURE,WATER_ASSET].sort((a,b)=>a.id-b.id));
const byId=new Map(specs.map(s=>[s.id,s]));
export const PACK2_LIVE_IDS=Object.freeze(specs.map(a=>a.id));
if(PACK2_LIVE_IDS.length!==18||PACK2_LIVE_IDS.some((id,i)=>id!==59+i))
  throw Error('Approved Pack 2 registry ID mismatch');
export const PACK2_LIVE_NAMES=Object.freeze(Object.fromEntries(
  specs.map(a=>[a.id,a.name])));
export const isPack2LiveId=id=>Number.isInteger(id)&&byId.has(id);
export const pack2IsFluid=id=>id===WATER_CANDIDATE_ID;
export const pack2IsHinged=id=>Boolean(joineryAsset(id)?.toggleable);
export const pack2Spec=id=>byId.get(id)||null;

export function pack2NormalizeState(id,untrusted){
  if(!isPack2LiveId(id))throw new RangeError('Unknown approved Pack 2 ID');
  const state=untrusted??{};
  if(state===null||typeof state!=='object'||Array.isArray(state))
    throw new TypeError('Invalid Pack 2 cell state');
  if(id===WATER_CANDIDATE_ID)return waterCell(state);
  if(infrastructureAsset(id))return infrastructureCell(id,state);
  if(groundAsset(id))return groundCell(id,state.rotation);
  if(joineryAsset(id))return joineryCell(id,state);
  return pack2Cell(id,state.rotation??0);
}
export function pack2ShapeOf(id,state={}){
  const s=pack2NormalizeState(id,state);
  if(id===WATER_CANDIDATE_ID)return waterShape(s);
  if(infrastructureAsset(id))return infrastructureShape(id,s);
  if(groundAsset(id))return groundShape(id,s.rotation);
  if(joineryAsset(id))return joineryShape(id,s);
  return pack2Shape(id,s.rotation);
}
export function pack2AuthoredMesh(id,state={}){
  const s=pack2NormalizeState(id,state);
  if(id===WATER_CANDIDATE_ID)return waterPreviewMesh(s);
  if(infrastructureAsset(id))return infrastructurePreviewMesh(id,s);
  if(groundAsset(id))return groundPreviewMesh(id,s.rotation);
  if(joineryAsset(id))return joineryPreviewMesh(id,s);
  return pack2PreviewMesh(id,s.rotation);
}
// Production renderer's existing 9-float vertex contract: xyz, RGB, uv, material.
// Mesh triangles, material colors, seams and decorations come exclusively from
// the approved original authored candidate renderers. No facades or box stand-ins.
// Reserved material 21 = approved opaque candidate color;
// reserved material 20 + triangle alpha = transparent water (separate draw pass).
export function pack2WorldVertices(id,state,cell){
  if(!Array.isArray(cell)||cell.length!==3||!cell.every(Number.isSafeInteger))
    throw new TypeError('Expected integer voxel origin');
  const mesh=pack2AuthoredMesh(id,state);
  const out=new Float32Array(mesh.indices.length*9);
  for(let i=0;i<mesh.indices.length;i++){
    const at=mesh.indices[i],p=at*3,k=i*9;
    out[k]=cell[0]+mesh.positions[p];
    out[k+1]=cell[1]+mesh.positions[p+1];
    out[k+2]=cell[2]+mesh.positions[p+2];
    out[k+3]=mesh.colors[p];out[k+4]=mesh.colors[p+1];out[k+5]=mesh.colors[p+2];
    out[k+6]=mesh.uv?mesh.uv[at*2]:mesh.positions[p];
    out[k+7]=mesh.uv?mesh.uv[at*2+1]:mesh.positions[p+2];
    out[k+8]=id===WATER_CANDIDATE_ID?20+mesh.alpha[at]:21;
  }
  return out;
}
function boxRay(box,eye,dir,cell,limit){
  const e=1e-9;let enter=-Infinity,exit=Infinity,axis=-1,sign=0;
  for(let i=0;i<3;i++){
    const lo=cell[i]+box[i],hi=cell[i]+box[i+3],d=dir[i];
    if(Math.abs(d)<e){if(eye[i]<lo-e||eye[i]>hi+e)return null;continue;}
    const a=(lo-eye[i])/d,b=(hi-eye[i])/d,near=Math.min(a,b),far=Math.max(a,b);
    if(near>enter){enter=near;axis=i;sign=a<b?-1:1;}
    exit=Math.min(exit,far);
    if(enter>exit+e)return null;
  }
  if(exit<0||enter>limit+e)return null;
  const normal=[0,0,0];if(enter>=0&&axis>=0)normal[axis]=sign;
  return {distance:Math.max(0,enter),normal};
}
export function pack2RayHit(id,state,eye,dir,cell,limit){
  if(id===WATER_CANDIDATE_ID)return waterRaycast(state,eye,dir,cell,limit);
  const shape=pack2ShapeOf(id,state);let best=null;
  for(const box of shape.boxes){
    const hit=boxRay(box,eye,dir,cell,limit);
    if(hit&&(!best||hit.distance<best.distance))best=hit;
  }
  return best;
}
export function pack2BodyIntersects(id,state,cell,player){
  if(id===WATER_CANDIDATE_ID)return false;
  const shape=pack2ShapeOf(id,state),{x,z,feet,radius,height}=player,e=1e-5;
  return shape.boxes.some(b=>
    x+radius>cell[0]+b[0]+e&&x-radius<cell[0]+b[3]-e&&
    feet+height>cell[1]+b[1]+e&&feet<cell[1]+b[4]-e&&
    z+radius>cell[2]+b[2]+e&&z-radius<cell[2]+b[5]-e);
}
export function pack2CycleState(id,state,action){
  const current=pack2NormalizeState(id,state),spec=pack2Spec(id);
  if(action==='rotate'){
    const specRotatable=(joineryAsset(id)||pack2Asset(id))?.rotatable;
    const steps=infrastructureAsset(id)?.rotations??groundAsset(id)?.orientation.turns??
      (specRotatable===false?1:4);
    if(steps<=1)return current;
    return pack2NormalizeState(id,{...current,rotation:(current.rotation+1)%steps});
  }
  if(action==='variant'){
    const variants=spec.variants||[];
    if(!variants.length)return current;
    const old=variants.indexOf(current.variant);
    return pack2NormalizeState(id,{...current,variant:variants[(old+1)%variants.length]});
  }
  if(action==='toggle'&&pack2IsHinged(id))
    return pack2NormalizeState(id,{...current,open:!current.open});
  if(action==='water-level'&&id===WATER_CANDIDATE_ID){
    const level=(current.level+1)%8;
    return waterCell({level,flow:level===0?'still':current.flow});
  }
  if(action==='water-flow'&&id===WATER_CANDIDATE_ID){
    const flows=['still','north','east','south','west'];
    const level=current.level||1;
    return waterCell({level,flow:flows[(flows.indexOf(current.flow)+1)%flows.length]});
  }
  return current;
}


// Transparent fluid is streamed separately from the opaque authored meshes.
// This keeps the established per-chunk opaque vertex format, chunk budgets,
// and old-world byte output unchanged. At most one extra GPU buffer is uploaded
// for each chunk that actually contains a placed water candidate.
export function pack2WaterSectionVertices(world,cx,cz,section){
  if(!world?.pack2Cells?.size)return new Float32Array();
  if(![cx,cz,section].every(Number.isInteger)||section>0)
    throw new TypeError('Invalid water chunk location');
  const result=[];let length=0;
  for(const [key,state] of world.pack2Cells){
    if(state.id!==WATER_CANDIDATE_ID)continue;
    const [x,y,z]=key.split(',').map(Number);
    const actualSection=y>=-3?0:Math.floor((y+3)/16);
    if(actualSection!==section||Math.floor(x/16)!==cx||Math.floor(z/16)!==cz)continue;
    // Remove only *identical* internal fluid side triangles; differing level
    // cells must retain their visible side faces and physical surface heights.
    const mesh=waterPreviewMesh(state),water=pack2WorldVertices(76,state,[x,y,z]);
    if(mesh.indices.length!==water.length/9)
      throw Error('Pack 2 water authored vertex count mismatch');
    const keep=[];
    for(let tri=0;tri<mesh.indices.length/3;tri++){
      let skip=false;
      if(tri>=2&&tri<=9){
        const indices=[mesh.indices[tri*3],mesh.indices[tri*3+1],mesh.indices[tri*3+2]];
        for(const [axis,side,delta] of [[0,0,-1],[0,1,1],[2,0,-1],[2,1,1]]){
          if(indices.every(i=>Math.abs(mesh.positions[i*3+axis]-side)<1e-6)){
            const neighbor=axis===0?
              world.getPack2State?.(x+delta,y,z):
              world.getPack2State?.(x,y,z+delta);
            if(neighbor?.id===76&&neighbor.level===state.level&&
              neighbor.flow===state.flow&&neighbor.source===state.source)skip=true;
          }
        }
      }
      if(!skip)keep.push(...water.subarray(tri*27,tri*27+27));
    }
    if(keep.length){result.push(keep);length+=keep.length;}
  }
  const out=new Float32Array(length);let offset=0;
  for(const arr of result){out.set(arr,offset);offset+=arr.length;}
  return out;
}
