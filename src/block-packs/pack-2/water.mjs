// MYTHWROUGHT Pack 2 M5 — genuine FLUID VOLUME candidate, NOT a fluid simulator.
// ID 76 is a proposed independently selectable/erasable voxel. This module has NO
// world generation, ticking, block update, flood-fill, swimming or persistence hooks.
// Transparent volume geometry and per-state selection are backed by the same prism.
// The current live engine rejects ID 76; centralized integration owns all activation.
export const WATER_CANDIDATE_ID=76;
export const WATER_FLOW_DIRECTIONS=Object.freeze(['still','north','east','south','west']);
export const WATER_LEVELS=Object.freeze([0,1,2,3,4,5,6,7]);
const direction=Object.freeze({
  still:Object.freeze([0,0]),north:Object.freeze([0,-1]),east:Object.freeze([1,0]),
  south:Object.freeze([0,1]),west:Object.freeze([-1,0])
});
const freeze=Object.freeze;
const finite=x=>Number.isFinite(x);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],
  a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const subtract=(a,b)=>a.map((v,i)=>v-b[i]);
const normalize=v=>{const d=Math.hypot(...v);return v.map(x=>x/d);};
export const WATER_ASSET=freeze({
  id:WATER_CANDIDATE_ID,roster:45,key:'clear-rill-water',
  family:'physical-water-voxel',name:'Clear rill water volume',
  physicalType:'fluid-volume',solidCollision:false,rayTargetable:true,removable:true,
  fluidSimulationImplemented:false,worldGenerationEnabled:false,
  levels:8,sourceLevel:0,
  palette:freeze({
    shallows:freeze([.12,.49,.67]),depths:freeze([.055,.24,.38]),
    foam:freeze([.50,.78,.82]),bankReflection:freeze([.26,.63,.71])
  }),
  renderContract:freeze({
    pass:'transparent',blend:'src-alpha-one-minus-src-alpha',depthTest:true,
    depthWrite:false,doubleSided:false,neighborSurfaceCull:'engine-required',
    waterNeighborLevelSeams:'engine-required',transparentSorting:'engine-required',
    refraction:'engine-optional',underwaterFog:'engine-required',
    materialUniforms:freeze(['fluidLevel','flowVector','sourceFlag','worldTime']),
    timeDrivenUVOnly:'engine-required; no animation is implemented in this pack'
  }),
  physicsContract:freeze({
    category:'passable-fluid-not-solid',collision:'non-blocking-volume',
    selection:'exact-surface-prism-triangle-raycast',
    buoyancy:'engine-required',swim:'engine-required',
    liquidUpdates:'engine-required',sourceRules:'engine-required',
    hydraulicPropagation:'engine-required',noLocalSimulation:true
  }),
  saveContract:freeze({
    existingSchema1:'untouched',fixtureFormat:'isolated-pack2-v1',
    futureState:'level, flow, source within cell metadata sidecar',
    engineUpgrade:'engine-required; atomic and backwards-safe'
  })
});
export function waterCell({level=0,flow='still',source=level===0}={}){
  if(!Number.isInteger(level)||level<0||level>7)throw new RangeError('Water level must be an integer 0..7');
  if(!WATER_FLOW_DIRECTIONS.includes(flow))throw new RangeError('Invalid water flow direction');
  if(typeof source!=='boolean'||source!==(level===0)||
    (level===0&&flow!=='still'))
    throw new RangeError('Water source must be full-height and still');
  return freeze({id:WATER_CANDIDATE_ID,level,flow,source});
}
export function parseWaterCell(value){
  if(!value||Array.isArray(value)||typeof value!=='object'||
    Object.keys(value).sort().join(',')!=='flow,id,level,source'||
    value.id!==WATER_CANDIDATE_ID)throw new TypeError('Invalid water fixture record');
  return waterCell(value);
}
export function waterSurfaceHeight(state,x,z){
  const cell=waterCell(state);
  if(!finite(x)||!finite(z)||x<0||x>1||z<0||z>1)
    throw new RangeError('Surface coordinate outside a unit fluid cell');
  const base=(8-cell.level)/8; // 1.0 for source, 0.125 for thinnest valid flow
  const [dx,dz]=direction[cell.flow];
  return base-.0625*((x-.5)*dx+(z-.5)*dz);
}
export function waterCorners(state={}){
  const s=waterCell(state);
  return freeze([[0,0],[1,0],[1,1],[0,1]].map(([x,z])=>
    freeze([x,waterSurfaceHeight(s,x,z),z])));
}
export function waterVolumeContains(state,point){
  if(!Array.isArray(point)||point.length!==3||!point.every(finite))
    throw new TypeError('Expected finite local 3D point');
  const [x,y,z]=point;
  if(x<0||x>=1||z<0||z>=1||y<0)return false;
  return y<=waterSurfaceHeight(state,x,z);
}
export function waterShape(state={}){
  const cell=waterCell(state),corners=waterCorners(cell);
  const hMax=Math.max(...corners.map(p=>p[1]));
  return freeze({...cell,physicalType:'sloped-fluid-prism',
    solidCollision:false,collision:'passable-fluid-volume',
    selection:'exact-closed-prism-triangles',sourceRule:'engine-required',
    occupiedVolume:freeze({bottomY:0,topCorners:corners,
      heightAt:'waterSurfaceHeight(cell,x,z)',closed:true}),
    broadPhaseBox:freeze([0,0,0,1,hMax,1]),
    boxes:freeze([]), // Do NOT let a generic solid-box renderer treat water as stone.
    candidateOnly:true,fluidSimulationImplemented:false});
}
function volumeTriangles(s){
  const top=waterCorners(s),bottom=[[0,0,0],[1,0,0],[1,0,1],[0,0,1]];
  const [a,b,c,d]=bottom,[A,B,C,D]=top;
  return [
    [A,D,C,'surface'],[A,C,B,'surface'],
    [a,A,B,'side'],[a,B,b,'side'],
    [b,B,C,'side'],[b,C,c,'side'],
    [c,C,D,'side'],[c,D,d,'side'],
    [d,D,A,'side'],[d,A,a,'side'],
    [a,b,c,'bottom'],[a,c,d,'bottom']
  ];
}
export function waterPreviewMesh(state={}){
  const s=waterCell(state),pos=[],colors=[],normals=[],alpha=[],uv=[],indices=[];
  const vec=direction[s.flow];
  let physicalTriangles=0,detailTriangles=0;
  function emit(tri,role){
    const st=pos.length/3;
    const e1=subtract(tri[1],tri[0]),e2=subtract(tri[2],tri[0]);
    const n=normalize(cross(e1,e2));
    const rgb=role==='surface'?WATER_ASSET.palette.shallows:
      role==='bottom'?WATER_ASSET.palette.depths:
      role==='ripple'?WATER_ASSET.palette.foam:WATER_ASSET.palette.bankReflection;
    const a=role==='surface'?.58:role==='bottom'?.11:role==='ripple'?.25:.37;
    for(const p of tri){
      pos.push(...p);colors.push(...rgb);normals.push(...n);
      alpha.push(a);
      // UVs are world-independent candidate inputs; the renderer owns animation.
      uv.push(p[0],p[2]);
    }
    indices.push(st,st+1,st+2);
    if(role==='ripple')detailTriangles++;else physicalTriangles++;
  }
  for(const tri of volumeTriangles(s))emit(tri.slice(0,3),tri[3]);
  // Surface-anchored, directional pale current ripples: decorative render triangles
  // are NOT additional physical water, and cannot substitute for the fluid prism.
  for(const [i,t] of [.22,.51,.78].entries()){
    const crosswise=s.flow==='east'||s.flow==='west';
    const center=crosswise?[t,.31+i*.15]:[.27+i*.18,t];
    const half=.055,offset=.001;
    const rectangle=crosswise?[
      [center[0]-half,center[1]-.012],[center[0]+half,center[1]-.012],
      [center[0]+half,center[1]+.012],[center[0]-half,center[1]+.012]
    ]:[
      [center[0]-.012,center[1]-half],[center[0]+.012,center[1]-half],
      [center[0]+.012,center[1]+half],[center[0]-.012,center[1]+half]
    ];
    const verts=rectangle.map(([x,z])=>[x,waterSurfaceHeight(s,x,z)+offset,z]);
    emit([verts[0],verts[3],verts[2]],'ripple');
    emit([verts[0],verts[2],verts[1]],'ripple');
  }
  return freeze({positions:new Float32Array(pos),
    colors:new Float32Array(colors),normals:new Float32Array(normals),
    alpha:new Float32Array(alpha),uv:new Float32Array(uv),
    indices:new Uint16Array(indices),flowVector:freeze([...vec]),
    triangles:indices.length/3,physicalTriangles,detailTriangles,
    materialPass:'transparent',depthWrite:false,solidCollision:false,
    candidateOnly:true,allFluidGeometryBackedByVolume:true,
    waterLevel:s.level,source:s.source});
}
// Möller–Trumbore, two-sided: ray selection through transparent fluid surface.
// Narrow-phase is actual sloped closed-prism triangles; no inflated AABB false hits.
export function waterRaycast(state,origin,directionVector,cellOrigin=[0,0,0],reach=6){
  const s=waterCell(state);
  if(!Array.isArray(origin)||origin.length!==3||!origin.every(finite)||
    !Array.isArray(directionVector)||directionVector.length!==3||
    !directionVector.every(finite)||!Array.isArray(cellOrigin)||
    cellOrigin.length!==3||!cellOrigin.every(Number.isSafeInteger)||
    !finite(reach)||reach<0||reach>64)
    throw new TypeError('Invalid fluid selection ray');
  const len=Math.hypot(...directionVector);
  if(len<1e-9)throw new RangeError('Cannot raycast a zero-length vector');
  const d=directionVector.map(x=>x/len);
  const local=origin.map((x,i)=>x-cellOrigin[i]);
  if(waterVolumeContains(s,local))return freeze({distance:0,normal:freeze([0,0,0]),face:'inside-fluid'});
  const EPS=1e-8;let best=null;
  for(const [v0,v1,v2,face] of volumeTriangles(s)){
    const e1=subtract(v1,v0),e2=subtract(v2,v0);
    const p=cross(d,e2),det=dot(e1,p);
    if(Math.abs(det)<EPS)continue;
    const inv=1/det,tvec=subtract(local,v0);
    const u=dot(tvec,p)*inv;if(u<-EPS||u>1+EPS)continue;
    const q=cross(tvec,e1),v=dot(d,q)*inv;
    if(v<-EPS||u+v>1+EPS)continue;
    const t=dot(e2,q)*inv;
    if(t<-EPS||t>reach+EPS)continue;
    if(!best||t<best.distance-EPS){
      best=freeze({distance:Math.max(0,t),
        normal:freeze(normalize(cross(e1,e2))),face});
    }
  }
  return best;
}
