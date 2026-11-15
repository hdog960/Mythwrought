// Desert biome130 #013–015. Isolated candidate cells, not registered live blocks.
// Coordinates use [minX,minY,minZ,maxX,maxY,maxZ] within a unit voxel.
const definitions = Object.freeze({
 'biome130:013': {name:'Cactus trunk segments',palette:['#315f45','#477b4b','#8fa96a','#d1c78a'],hardness:.65,attachment:'ground-or-cactus',boxes:[
  [.29,0,.29,.71,1,.71],[.275,.04,.40,.29,.96,.46],[.71,.04,.54,.725,.96,.60],
  [.40,.05,.275,.46,.95,.29],[.54,.05,.71,.60,.95,.725]]},
 'biome130:014': {name:'Cactus branch segments',palette:['#286044','#518d55','#a2b879','#d2ce94'],hardness:.55,attachment:'cactus-neighbor',boxes:[
  [0,.36,.35,.78,.68,.65],[.62,.36,.35,.86,.93,.65],[.58,.85,.37,.86,1,.63],
  [.10,.34,.335,.58,.36,.35],[.14,.68,.65,.56,.70,.665]]},
 'biome130:015': {name:'Dried thorn scrub',palette:['#6c5d3c','#9c8650','#c3aa6c','#4d4c31'],hardness:.12,attachment:'ground',boxes:[
  [.46,0,.46,.54,.42,.54],[.26,.24,.46,.75,.31,.54],[.47,.18,.24,.54,.30,.77],
  [.20,.30,.28,.29,.61,.37],[.70,.28,.64,.79,.55,.73],[.34,.27,.64,.41,.48,.72]]}
});
function rotate([x,y,z],r){for(let i=0;i<r;i++)[x,z]=[1-z,x];return [x,y,z];}
function rotateBox(b,r){const a=rotate([b[0],b[1],b[2]],r),c=rotate([b[3],b[4],b[5]],r);
 return [Math.min(a[0],c[0]),b[1],Math.min(a[2],c[2]),Math.max(a[0],c[0]),b[4],Math.max(a[2],c[2])];}
function texture(id){const ordinal=Number(id.slice(-3));return Object.freeze(Array.from({length:6},(_,face)=>
 Object.freeze(Array.from({length:16},(_,p)=>{const u=p%4,v=p>>2;const rib=(ordinal===13&&u%2===0);
 const thorn=(ordinal===15&&(u===v||u+v===3));const h=(Math.imul(ordinal*31+face*17+u*7+v*13,2654435761)>>>0);
 return rib?1:thorn?3:(h%11===0?2:0);})))));}
export const DESERT_ORGANIC_IDS=Object.freeze(Object.keys(definitions));
export function desertOrganic(id,rotation=0){
 const d=definitions[id];if(!d)throw new RangeError('Unknown desert organic candidate');
 if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('Rotation 0..3 required');
 const boxes=d.boxes.map(b=>Object.freeze(rotateBox(b,rotation)));
 const bounds=Object.freeze([Math.min(...boxes.map(b=>b[0])),Math.min(...boxes.map(b=>b[1])),Math.min(...boxes.map(b=>b[2])),
 Math.max(...boxes.map(b=>b[3])),Math.max(...boxes.map(b=>b[4])),Math.max(...boxes.map(b=>b[5]))]);
 return Object.freeze({symbolicId:id,proposedFutureId:255+Number(id.slice(-3)),name:d.name,rotation,
  texture:Object.freeze({resolution:4,palette:Object.freeze([...d.palette]),faces:texture(id)}),
  shape:Object.freeze({boxes:Object.freeze(boxes),bounds}),
  physical:Object.freeze({selectable:true,removable:true,placeable:true,solid:true,transparent:false,attachment:d.attachment,hardness:d.hardness}),
  status:'BLOCKED BY ENGINE',integration:'symbolic opt-in only; requires :00 widened-ID and shape-aware interaction ABI'});
}
// Indexed cuboid mesh for deterministic opt-in previews; not a world renderer.
// Outward-wound triangles and matching face normals. Internal overlap is not boolean-unioned.
const faces=[
 {axis:0,side:0,n:[-1,0,0]}, {axis:0,side:1,n:[1,0,0]},
 {axis:1,side:0,n:[0,-1,0]}, {axis:1,side:1,n:[0,1,0]},
 {axis:2,side:0,n:[0,0,-1]}, {axis:2,side:1,n:[0,0,1]}
];
export function desertOrganicMesh(id,rotation=0){
 const d=desertOrganic(id,rotation),positions=[],normals=[],indices=[];
 for(const b of d.shape.boxes)for(const f of faces){
  const a=f.axis,other=[0,1,2].filter(k=>k!==a),u=other[0],v=other[1],constant=b[a+3*f.side];
  const corners=[[b[u],b[v]],[b[u+3],b[v]],[b[u+3],b[v+3]],[b[u],b[v+3]]];
  const start=positions.length/3;
  for(const [p,q] of corners){const xyz=[0,0,0];xyz[a]=constant;xyz[u]=p;xyz[v]=q;positions.push(...xyz);normals.push(...f.n);}
  const sign=(a===1?-1:1)*(f.side?1:-1);
  const order=sign===1?[0,1,2,0,2,3]:[0,2,1,0,3,2];
  indices.push(...order.map(i=>start+i));
 }
 return Object.freeze({positions,normals,indices,vertexCount:positions.length/3,triangleCount:indices.length/3});
}
export function desertOrganicFixture(){
 const cells=new Map(),key=(x,y,z)=>{if(![x,y,z].every(Number.isSafeInteger))throw new TypeError('Integer coordinates required');return [x,y,z].join(',');};
 return Object.freeze({
  place(x,y,z,id,rotation=0){desertOrganic(id,rotation);const k=key(x,y,z);if(cells.has(k))return false;cells.set(k,{id,rotation});return true;},
  select(x,y,z){const v=cells.get(key(x,y,z));return v?{...v}:null;},
  remove(x,y,z){const k=key(x,y,z),v=cells.get(k);cells.delete(k);return v?{...v}:null;},
  snapshot(){return JSON.stringify([...cells].sort(([a],[b])=>a.localeCompare(b)));},
  restore(json){const entries=JSON.parse(json);if(!Array.isArray(entries))throw new TypeError('Invalid snapshot');
   const next=new Map();for(const e of entries){if(!Array.isArray(e)||e.length!==2||typeof e[0]!=='string'||!/^[-]?\d+,[-]?\d+,[-]?\d+$/.test(e[0])||next.has(e[0]))throw new TypeError('Invalid entry');
    desertOrganic(e[1]?.id,e[1]?.rotation);next.set(e[0],{id:e[1].id,rotation:e[1].rotation});}
   cells.clear();for(const [k,v] of next)cells.set(k,v);}
 });
}
