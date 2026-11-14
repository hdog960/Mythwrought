// Opt-in geometric prototypes. NOT PLACEABLE BLOCKS; no persistent IDs or world writes.
// Unit cell coordinates: x/y/z in [0,1], y up, orientation quarter turns about Y.
// A descriptor's boxes are the authoritative occupancy interface for :00.
const TYPES=new Set(['slab','stairs','slope','post','rail']);
const clamp=(n)=>Math.round(n*1e6)/1e6;
const box=(x0,y0,z0,x1,y1,z1)=>Object.freeze([x0,y0,z0,x1,y1,z1]);
const freezeBoxes=(boxes)=>Object.freeze(boxes.map(b=>box(...b)));
function base(kind,variant){
  if(kind==='slab')return [box(0,variant==='upper'?.5:0,0,1,variant==='upper'?1:.5,1)];
  if(kind==='stairs')return variant==='upper'
    ?[box(0,.5,0,1,1,1),box(0,0,.5,1,.5,1)]
    :[box(0,0,0,1,.5,1),box(0,.5,.5,1,1,1)];
  if(kind==='slope')return [box(0,0,0,1,.25,1),box(0,.25,.5,1,.5,1),box(0,.5,.75,1,.75,1),box(0,.75,.875,1,1,1)];
  if(kind==='post')return [box(.375,0,.375,.625,1,.625)];
  return [box(0,.25,.375,1,.375,.625),box(0,.625,.375,1,.75,.625)];
}
function rotatePoint(x,z,r){for(let i=0;i<r;i++){const a=x;x=1-z;z=a;}return [clamp(x),clamp(z)];}
function rotateBox(b,r){
  const corners=[[b[0],b[2]],[b[0],b[5]],[b[3],b[2]],[b[3],b[5]]].map(p=>rotatePoint(...p,r));
  return box(Math.min(...corners.map(p=>p[0])),b[1],Math.min(...corners.map(p=>p[1])),Math.max(...corners.map(p=>p[0])),b[4],Math.max(...corners.map(p=>p[1])));
}
export function shapeDescriptor(kind,{rotation=0,variant='lower'}={}){
  if(!TYPES.has(kind))throw new RangeError('Unknown shape prototype');
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('rotation must be 0..3');
  if(!['upper','lower'].includes(variant))throw new RangeError('variant');
  const boxes=freezeBoxes(base(kind,variant).map(b=>rotateBox(b,rotation)));
  return Object.freeze({kind,rotation,variant,prototypeOnly:true,placeable:false,boxes,
    bounds:box(0,0,0,1,1,1),units:'voxel',orientation:'quarter-turn-y',
    occupancy:'union-of-axis-aligned-boxes',saveState:null});
}
// Emits isolated box faces (including internal faces) for prototype inspection.
// Integrators may cull internal surfaces later; no renderer or mesher is modified.
export function prototypeMesh(descriptor){
  if(!descriptor?.prototypeOnly||!Array.isArray(descriptor.boxes))throw new TypeError('Expected shape descriptor');
  const positions=[],normals=[],indices=[];
  const faces=[
    {n:[-1,0,0],v:b=>[[b[0],b[1],b[2]],[b[0],b[1],b[5]],[b[0],b[4],b[5]],[b[0],b[4],b[2]]]},
    {n:[1,0,0],v:b=>[[b[3],b[1],b[5]],[b[3],b[1],b[2]],[b[3],b[4],b[2]],[b[3],b[4],b[5]]]},
    {n:[0,-1,0],v:b=>[[b[0],b[1],b[5]],[b[0],b[1],b[2]],[b[3],b[1],b[2]],[b[3],b[1],b[5]]]},
    {n:[0,1,0],v:b=>[[b[0],b[4],b[2]],[b[0],b[4],b[5]],[b[3],b[4],b[5]],[b[3],b[4],b[2]]]},
    {n:[0,0,-1],v:b=>[[b[3],b[1],b[2]],[b[0],b[1],b[2]],[b[0],b[4],b[2]],[b[3],b[4],b[2]]]},
    {n:[0,0,1],v:b=>[[b[0],b[1],b[5]],[b[3],b[1],b[5]],[b[3],b[4],b[5]],[b[0],b[4],b[5]]]}
  ];
  for(const b of descriptor.boxes)for(const face of faces){
    const v=face.v(b),start=positions.length/3;
    for(const p of v){positions.push(...p);normals.push(...face.n);}
    indices.push(start,start+1,start+2,start,start+2,start+3);
  }
  return {positions:new Float32Array(positions),normals:new Float32Array(normals),indices:new Uint16Array(indices),
    boxes:descriptor.boxes.length,triangles:indices.length/3};
}
