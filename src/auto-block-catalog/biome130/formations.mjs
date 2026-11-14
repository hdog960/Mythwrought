// Isolated, non-registered physical desert formations #010–012.
// Coordinates are local unit-cell coordinates; no persistent block IDs are assigned.
const data=Object.freeze({
 'biome130:010':{name:'Fulgurite crystal shards',colors:['#3d343d','#77616c','#d7b69c','#f6d5a9'],boxes:[[.38,0,.38,.62,.84,.62],[.15,0,.43,.34,.57,.63],[.65,0,.25,.83,.68,.45]],hardness:1.7},
 'biome130:011':{name:'Natural gypsum rosettes',colors:['#eee1c7','#c7ac91','#fff4dc','#987c75'],boxes:[[.28,0,.28,.72,.18,.72],[.08,.08,.35,.92,.31,.55],[.35,.08,.08,.55,.31,.92],[.19,.12,.19,.81,.36,.39],[.19,.12,.61,.81,.36,.81]],hardness:.8},
 'biome130:012':{name:'Desert calcite crust',colors:['#eee0c5','#c5a98a','#fff6df','#ab8c6b'],boxes:[[.05,0,.05,.95,.12,.95],[.14,.12,.2,.45,.23,.47],[.57,.12,.52,.83,.29,.78],[.38,.12,.74,.62,.19,.91]],hardness:1.1}
});
const faceDefs=[
 [[0,1,2,3],[-1,0,0]],[[4,5,6,7],[1,0,0]],
 [[0,4,7,3],[0,-1,0]],[[1,2,6,5],[0,1,0]],
 [[0,1,5,4],[0,0,-1]],[[3,7,6,2],[0,0,1]]
];
function boxCorners(b){const [x0,y0,z0,x1,y1,z1]=b;return [[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]];}
function rotatePoint(p,r){let [x,y,z]=p;for(let i=0;i<r;i++)[x,z]=[1-z,x];return [x,y,z];}
export const FORMATION_IDS=Object.freeze(Object.keys(data));
export function desertFormation(id,rotation=0){
 const d=data[id];if(!d)throw new RangeError('Unknown formation');
 if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('Rotation must be 0..3');
 const boxes=d.boxes.map(b=>{const a=rotatePoint([b[0],0,b[2]],rotation),c=rotatePoint([b[3],0,b[5]],rotation);return Object.freeze([Math.min(a[0],c[0]),b[1],Math.min(a[2],c[2]),Math.max(a[0],c[0]),b[4],Math.max(a[2],c[2])]);});
 const bounds=[Math.min(...boxes.map(b=>b[0])),0,Math.min(...boxes.map(b=>b[2])),Math.max(...boxes.map(b=>b[3])),Math.max(...boxes.map(b=>b[4])),Math.max(...boxes.map(b=>b[5]))];
 return Object.freeze({symbolicId:id,proposedFutureId:255+Number(id.slice(-3)),name:d.name,rotation,
  colors:Object.freeze([...d.colors]),shape:Object.freeze({boxes:Object.freeze(boxes),bounds:Object.freeze(bounds)}),
  physical:Object.freeze({selectable:true,removable:true,placeable:true,solid:true,transparent:false,attachment:'ground',hardness:d.hardness}),
  status:'BLOCKED BY ENGINE',integration:'opt-in fixture only; requires widened-ID and :00 shape-aware interaction ABI'});
}
// Surface mesh prototype; each cuboid emits outward-wound triangles.
// Adjacent/intersecting boxes are intentionally NOT globally boolean-unioned.
export function formationMesh(id,rotation=0){
 const d=desertFormation(id,rotation),positions=[],normals=[],indices=[];
 for(const b of d.shape.boxes){const corners=boxCorners(b);for(const [quad,normal] of faceDefs){
  const start=positions.length/3;
  for(const index of quad){positions.push(...corners[index]);normals.push(...normal);}
  // Quads are ordered inward on the -X,+X faces; reverse those two to guarantee outward winding.
  const flip=normal[0]!==0;
  indices.push(...(flip?[start,start+2,start+1,start,start+3,start+2]:[start,start+1,start+2,start,start+2,start+3]));
 }}
 return Object.freeze({positions:Object.freeze(positions),normals:Object.freeze(normals),indices:Object.freeze(indices),vertexCount:positions.length/3,triangleCount:indices.length/3});
}
export function formationFixture(){
 const cells=new Map();const key=(x,y,z)=>{if(![x,y,z].every(Number.isSafeInteger))throw new TypeError('Integer cell coordinates required');return [x,y,z].join(',');};
 return Object.freeze({
  place(x,y,z,id,rotation=0){desertFormation(id,rotation);const k=key(x,y,z);if(cells.has(k))return false;cells.set(k,{id,rotation});return true;},
  select(x,y,z){const v=cells.get(key(x,y,z));return v?{...v}:null;},
  remove(x,y,z){const k=key(x,y,z),v=cells.get(k);cells.delete(k);return v?{...v}:null;},
  snapshot(){return JSON.stringify([...cells].sort(([a],[b])=>a.localeCompare(b)));},
  restore(json){const parsed=JSON.parse(json);if(!Array.isArray(parsed))throw new TypeError('Invalid snapshot');const next=new Map();for(const item of parsed){if(!Array.isArray(item)||item.length!==2||!Array.isArray(item[0].split(',')))throw new TypeError('Invalid entry');const [k,v]=item;const xyz=k.split(',').map(Number);if(xyz.length!==3||key(...xyz)!==k||next.has(k))throw new TypeError('Invalid coordinates');desertFormation(v.id,v.rotation);next.set(k,{id:v.id,rotation:v.rotation});}cells.clear();for(const [k,v] of next)cells.set(k,v);}
 });
}
