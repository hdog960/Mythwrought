// Snow #019–021: isolated physical candidate definitions. NOT registered live blocks.
const definitions = Object.freeze([
 {number:19,name:'Frozen surface crust',boxes:[[0,0,0,1,.18,1]],palette:['#e9f8fc','#c3e3ee','#91c0d5','#ffffff'],pattern:'fractured-glaze',opacity:1,solid:true,hardness:.48},
 {number:20,name:'Clear lake ice',boxes:[[0,0,0,1,1,1]],palette:['#e0fbff','#b1e8f4','#85cadf','#f8ffff'],pattern:'long-clear-fractures',opacity:.46,solid:true,hardness:.8},
 {number:21,name:'Blue glacier ice',boxes:[[0,0,0,1,1,1]],palette:['#c4f2ff','#77c9ee','#3289c4','#e6ffff'],pattern:'deep-bubble-bands',opacity:.78,solid:true,hardness:1.3}
]);
const byId = new Map(definitions.map(d=>['biome130:'+String(d.number).padStart(3,'0'),d]));
const validRotation = r=>Number.isInteger(r)&&r>=0&&r<4;
const rotate = (x,z,r)=>{for(let i=0;i<r;i++) [x,z]=[1-z,x];return [x,z];};
export const FROZEN_IDS=Object.freeze([...byId.keys()]);
export function frozenCandidate(id,rotation=0){
 const d=byId.get(id);if(!d)throw new RangeError('Unknown frozen candidate');
 if(!validRotation(rotation))throw new RangeError('Invalid rotation');
 const boxes=d.boxes.map(([x0,y0,z0,x1,y1,z1])=>{
  const [a,b]=rotate(x0,z0,rotation),[c,e]=rotate(x1,z1,rotation);
  return Object.freeze([Math.min(a,c),y0,Math.min(b,e),Math.max(a,c),y1,Math.max(b,e)]);
 });
 return Object.freeze({symbolicId:id,proposedFutureId:255+d.number,name:d.name,rotation,
  shape:Object.freeze({boxes:Object.freeze(boxes),bounds:Object.freeze([0,0,0,1,Math.max(...boxes.map(b=>b[4])),1])}),
  material:Object.freeze({palette:Object.freeze([...d.palette]),pattern:d.pattern,opacity:d.opacity,hardness:d.hardness,transparent:d.opacity<1,renderPass:d.opacity<1?'transparent':'opaque',doubleSided:false}),
  physical:Object.freeze({targetable:true,selectable:true,placeable:true,removable:true,solid:d.solid,attachment:'ground'}),
  status:'BLOCKED BY ENGINE',runtime:'NOT REGISTERED; widened-ID, transparent mesher and :00 interaction ABI required'});
}
export function frozenFaceSample(id,face,u,v,seed=0){
 const d=frozenCandidate(id);
 if(!Number.isInteger(face)||face<0||face>5||![u,v,seed].every(Number.isFinite))throw new RangeError('Invalid sample');
 const x=Math.floor(u*32),y=Math.floor(v*32);
 const noise=(Math.imul(x+37,73856093)^Math.imul(y+13,19349663)^Math.imul(seed+face*17,83492791))>>>0;
 const fracture=(x+2*y+seed)%11===0?3:0;
 const strata=id==='biome130:021'?Math.floor((u+v)*9)%3:0;
 return d.material.palette[((noise>>>11)+fracture+strata)&3];
}
// Deterministic outward-wound boundary mesh; no shared renderer or world writes.
// Each box is independent; these candidates each have one box.
export function frozenMesh(id,rotation=0){
 const boxes=frozenCandidate(id,rotation).shape.boxes,vertices=[],normals=[],indices=[];
 const faces=[
  {axis:0,sign:-1,corners:[[0,0],[0,1],[1,1],[1,0]]},
  {axis:0,sign:1,corners:[[0,0],[1,0],[1,1],[0,1]]},
  {axis:1,sign:-1,corners:[[0,0],[1,0],[1,1],[0,1]]},
  {axis:1,sign:1,corners:[[0,0],[0,1],[1,1],[1,0]]},
  {axis:2,sign:-1,corners:[[0,0],[0,1],[1,1],[1,0]]},
  {axis:2,sign:1,corners:[[0,0],[1,0],[1,1],[0,1]]}
 ];
 for(const b of boxes)for(const f of faces){
  const base=vertices.length/3,axes=[0,1,2].filter(a=>a!==f.axis);
  for(const uv of f.corners){const p=[0,0,0];p[f.axis]=b[f.axis+(f.sign===1?3:0)];p[axes[0]]=b[axes[0]+uv[0]*3];p[axes[1]]=b[axes[1]+uv[1]*3];vertices.push(...p);const n=[0,0,0];n[f.axis]=f.sign;normals.push(...n);}
  // Correct winding is verified and repaired based on geometric cross product.
  const a=vertices.slice(base*3,base*3+3),c=vertices.slice(base*3+3,base*3+6),e=vertices.slice(base*3+6,base*3+9);
  const u=c.map((v,i)=>v-a[i]),v=e.map((w,i)=>w-a[i]);
  const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  const flip=cross[f.axis]*f.sign<0;
  indices.push(...(flip?[base,base+2,base+1,base,base+3,base+2]:[base,base+1,base+2,base,base+2,base+3]));
 }
 return {vertices,normals,indices,transparent:frozenCandidate(id).material.transparent};
}
// Local reversible edit fixture, never production save serialization.
export function frozenFixture(){
 const cells=new Map();
 const key=(x,y,z)=>{if(![x,y,z].every(Number.isSafeInteger))throw new TypeError('Coordinates must be safe integers');return x+','+y+','+z;};
 return Object.freeze({
  place(x,y,z,id,rotation=0){frozenCandidate(id,rotation);const k=key(x,y,z);if(cells.has(k))return false;cells.set(k,{id,rotation});return true;},
  select(x,y,z){const v=cells.get(key(x,y,z));return v?{...v}:null;},
  remove(x,y,z){const k=key(x,y,z),v=cells.get(k);cells.delete(k);return v?{...v}:null;},
  snapshot(){return JSON.stringify([...cells].sort(([a],[b])=>a.localeCompare(b)));},
  restore(json){const entries=JSON.parse(json);if(!Array.isArray(entries))throw new TypeError('Invalid snapshot');const next=new Map();
   for(const [k,v] of entries){const coords=k.split(',').map(Number);if(coords.length!==3||key(...coords)!==k||next.has(k))throw new TypeError('Invalid entry');frozenCandidate(v.id,v.rotation);next.set(k,{id:v.id,rotation:v.rotation});}
   cells.clear();for(const [k,v]of next)cells.set(k,v);
  }
 });
}
