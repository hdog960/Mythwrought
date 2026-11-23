// Original-source V8 physical/material descriptor audit ONLY: no material IDs,
// chunk mesh, live V7 dispatch, WebGL draw, save or voxel mutations.
// The 9-float vertex layout is sourced from genuine src/voxel.mjs. This audit
// computes a FULL-CUBE-EQUIVALENT CPU staging proxy, not actual V8 GPU bytes.
// Future non-cube vegetation geometry requires separate mesh/registry approval.
import {MOUNTAIN_V8_PLANT_PATTERNS} from './mountain-v8-vegetation-cells.mjs';
export const MOUNTAIN_V8_PROXY_VERTEX_FLOATS=9;
export const MOUNTAIN_V8_PROXY_FACE_BYTES=6*9*4;
const valid=n=>Number.isSafeInteger(n);
const caps=Object.freeze(['snow','alpine-grass','slate','gneiss','scree']);
const terrainMaterials=Object.freeze(['stone','dirt',...caps]);
const plantMaterials=Object.freeze([
  'flower','flower-petal','heather','heather-tip','conifer-trunk',
  'conifer-needles'
]);
const allMaterials=Object.freeze([...terrainMaterials,...plantMaterials]);
export const MOUNTAIN_V8_DESCRIPTOR_MATERIALS=allMaterials;
const neighbors=Object.freeze([
  Object.freeze([1,0,0]),Object.freeze([-1,0,0]),
  Object.freeze([0,1,0]),Object.freeze([0,-1,0]),
  Object.freeze([0,0,1]),Object.freeze([0,0,-1])
]);
const directions=Object.freeze([[1,0],[-1,0],[0,1],[0,-1]]);
const key=(x,y,z)=>x+','+y+','+z;
export function auditMountainV8PhysicalDescriptors(proposal,physical,seam,
  {plant=null}={}){
  if(!proposal||!physical||!seam||proposal.safeToIntegrate!==false||
    proposal.generatorIdentityRequired!=='v8-new-opt-in'||
    physical.safeToIntegrate!==false||
    physical.requiresApprovedV8BlockMapping!==true||
    seam.safeToIntegrate!==false||
    seam.generatorIdentityRequired!=='v8-new-opt-in'||
    seam.physicallyVerified!==true||!valid(seam.verifiedCells)||
    seam.verifiedCells<5||seam.verifiedCells>90||
    ![proposal.x,proposal.z,proposal.seed,proposal.top,proposal.legacyTop]
      .every(valid)||!caps.includes(proposal.cap)||
    proposal.top<proposal.legacyTop||
    physical.x!==proposal.x||physical.z!==proposal.z||
    physical.top!==proposal.top||physical.legacyTop!==proposal.legacyTop||
    physical.cap!==proposal.cap||
    !valid(physical.estimatedCells)||physical.estimatedCells<1||
    physical.estimatedCells>18||
    physical.estimatedCells!==proposal.top-proposal.legacyTop+1||
    !Array.isArray(physical.writes)||
    physical.writes.length!==physical.estimatedCells||
    !seam.center||seam.center.x!==proposal.x||
    seam.center.z!==proposal.z||seam.center.top!==proposal.top||
    seam.center.cap!==proposal.cap||
    !Array.isArray(seam.neighbors)||seam.neighbors.length!==4||
    !Array.isArray(seam.exposedFaces)||seam.exposedFaces.length>8||
    !valid(seam.greatestStep)||seam.greatestStep>2)return null;
  const column=physical.writes;
  for(let i=0;i<column.length;i++){
    const cell=column[i];
    if(!cell||cell.x!==proposal.x||cell.z!==proposal.z||
      cell.y!==proposal.legacyTop+i||
      cell.material!==(cell.y===proposal.top?proposal.cap:
        proposal.cap==='alpine-grass'&&cell.y>=proposal.top-2?'dirt':'stone'))
      return null;
  }
  // A fully verified source certificate already reads original five columns.
  // Independently check exposed face direction, material and high-side Y.
  let pos=0,maxStep=0;
  for(let i=0;i<4;i++){
    const n=seam.neighbors[i],d=directions[i];
    if(!n||n.x!==proposal.x+d[0]||n.z!==proposal.z+d[1]||
      !valid(n.top)||!caps.includes(n.cap))return null;
    const delta=Math.abs(proposal.top-n.top);
    if(delta>2)return null;
    maxStep=Math.max(maxStep,delta);
    const centerHigher=proposal.top>n.top;
    const higher=centerHigher?seam.center:n;
    const outward=centerHigher?d:[-d[0],-d[1]];
    for(let y=Math.min(proposal.top,n.top)+1;
        y<=Math.max(proposal.top,n.top);y++){
      const face=seam.exposedFaces[pos++];
      const material=y===higher.top?higher.cap:
        higher.cap==='alpine-grass'&&y>=higher.top-2?'dirt':'stone';
      if(!face||face.x!==higher.x||face.z!==higher.z||face.y!==y||
        face.material!==material||!Array.isArray(face.toward)||
        face.toward.length!==2||face.toward[0]!==outward[0]||
        face.toward[1]!==outward[1])return null;
    }
  }
  if(pos!==seam.exposedFaces.length||maxStep!==seam.greatestStep)return null;
  let plantCells=[];
  if(plant!==null){
    if(!plant||plant.safeToIntegrate!==false||
      plant.needsApprovedV8MaterialRegistry!==true||
      proposal.cap!=='alpine-grass'||!proposal.vegetation||
      plant.kind!==proposal.vegetation||
      !Array.isArray(plant.site)||plant.site.length!==3||
      plant.site[0]!==proposal.x||plant.site[1]!==proposal.top||
      plant.site[2]!==proposal.z||
      !valid(plant.estimatedCells)||plant.estimatedCells<1||
      plant.estimatedCells>18||!Array.isArray(plant.cells)||
      plant.cells.length!==plant.estimatedCells||
      !valid(proposal.estimatedExtraCells)||
      plant.estimatedCells>proposal.estimatedExtraCells||
      proposal.estimatedExtraCells>18)return null;
    // Material membership alone is insufficient: the original source-owned
    // flower, heather and dwarf-conifer use exact relative positions and
    // materials. A forged full-cube descriptor must never pass this gate.
    const pattern=MOUNTAIN_V8_PLANT_PATTERNS[proposal.vegetation];
    if(!pattern||pattern.length!==plant.estimatedCells)return null;
    for(let i=0;i<pattern.length;i++){
      const [dx,dy,dz,material]=pattern[i],cell=plant.cells[i];
      if(!cell||cell.x!==proposal.x+dx||cell.y!==proposal.top+dy||
         cell.z!==proposal.z+dz||cell.material!==material)return null;
    }
    plantCells=plant.cells;
  }
  const cells=new Map(),materialCells=Object.fromEntries(
    allMaterials.map(m=>[m,0]));
  for(const [i,cell] of [...column,...plantCells].entries()){
    if(!cell||![cell.x,cell.y,cell.z].every(valid)||
      !allMaterials.includes(cell.material)||
      (i<column.length&&!terrainMaterials.includes(cell.material))||
      (i>=column.length&&(!plantMaterials.includes(cell.material)||
        cell.y<=proposal.top)))return null;
    const k=key(cell.x,cell.y,cell.z);
    if(cells.has(k))return null;
    cells.set(k,cell);
    materialCells[cell.material]++;
  }
  let proxyFaces=0;
  const materialFaces=Object.fromEntries(allMaterials.map(m=>[m,0]));
  for(const cell of cells.values())for(const [dx,dy,dz] of neighbors){
    if(!cells.has(key(cell.x+dx,cell.y+dy,cell.z+dz))){
      proxyFaces++;materialFaces[cell.material]++;
    }
  }
  const naiveFaces=cells.size*6,culledInternalPairs=(naiveFaces-proxyFaces)/2;
  const proxyStagingBytes=proxyFaces*MOUNTAIN_V8_PROXY_FACE_BYTES;
  const naiveStagingBytes=naiveFaces*MOUNTAIN_V8_PROXY_FACE_BYTES;
  if(!valid(proxyFaces)||proxyFaces>naiveFaces||!valid(culledInternalPairs)||
    !valid(proxyStagingBytes)||!valid(naiveStagingBytes)||
    proxyStagingBytes>36*6*MOUNTAIN_V8_PROXY_FACE_BYTES||
    Object.values(materialFaces).reduce((a,b)=>a+b,0)!==proxyFaces||
    Object.values(materialCells).reduce((a,b)=>a+b,0)!==cells.size)return null;
  return Object.freeze({
    x:proposal.x,z:proposal.z,cap:proposal.cap,
    terrainCells:column.length,plantCells:plantCells.length,
    uniqueCells:cells.size,sourceCertifiedSeamFaces:pos,
    materialCells:Object.freeze(materialCells),
    materialCubeProxyFaces:Object.freeze(materialFaces),
    naiveCubeProxyFaces:naiveFaces,
    exposedCubeProxyFaces:proxyFaces,culledInternalPairs,
    naiveCubeProxyBytes:naiveStagingBytes,
    exposedCubeProxyBytes:proxyStagingBytes,
    vertexFloats:MOUNTAIN_V8_PROXY_VERTEX_FLOATS,
    fullCubeProxyOnly:true,actualV8GPUBytesMeasured:false,
    requiresApprovedV8MaterialRegistry:true,
    safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'
  });
}
