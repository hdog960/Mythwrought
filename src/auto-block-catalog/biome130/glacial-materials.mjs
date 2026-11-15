// M2 snow #022-024. Isolated physical candidate assets, NOT runtime-registered.
const records = Object.freeze([
 {n:22,name:'Dense packed glacier ice',boxes:[[0,0,0,1,1,1]],palette:['#b6e6f3','#72b5d3','#427baf','#d9f7ff'],pattern:'compressed-blue-bands',opacity:.9,hardness:1.8,attachment:'ground'},
 {n:23,name:'Frozen permafrost',boxes:[[0,0,0,1,1,1]],palette:['#777d79','#b4aca0','#665d61','#c2d8d8'],pattern:'frozen-earth-lenses',opacity:1,hardness:1.4,attachment:'ground'},
 {n:24,name:'Rime-coated stone',boxes:[[0,0,0,1,1,1],[.08,.88,.08,.92,1,.92]],palette:['#75838d','#cadce6','#eaf7fa','#526477'],pattern:'rime-rim',opacity:1,hardness:1.6,attachment:'ground'}
]);
const recordsById=new Map(records.map(d=>['biome130:'+String(d.n).padStart(3,'0'),d]));
export const GLACIAL_IDS=Object.freeze([...recordsById.keys()]);
const checkRotation=r=>{if(!Number.isInteger(r)||r<0||r>3)throw new RangeError('rotation must be 0..3');};
const rotate=(x,z,r)=>{for(let i=0;i<r;i++) [x,z]=[1-z,x];return [x,z];};
export function glacialCandidate(id,rotation=0){
 const d=recordsById.get(id);if(!d)throw new RangeError('Unknown candidate');
 checkRotation(rotation);
 const boxes=d.boxes.map(([x0,y0,z0,x1,y1,z1])=>{
  const [a,b]=rotate(x0,z0,rotation),[c,e]=rotate(x1,z1,rotation);
  return Object.freeze([Math.min(a,c),y0,Math.min(b,e),Math.max(a,c),y1,Math.max(b,e)]);
 });
 return Object.freeze({symbolicId:id,proposedFutureId:255+d.n,name:d.name,rotation,
  shape:Object.freeze({boxes:Object.freeze(boxes),bounds:Object.freeze([0,0,0,1,1,1])}),
  material:Object.freeze({palette:Object.freeze([...d.palette]),pattern:d.pattern,opacity:d.opacity,transparent:d.opacity<1,renderPass:d.opacity<1?'transparent':'opaque',hardness:d.hardness}),
  physical:Object.freeze({targetable:true,selectable:true,placeable:true,removable:true,solid:true,attachment:d.attachment}),
  status:'BLOCKED BY ENGINE',runtime:'symbolic only; requires :00 widened-ID/shape-aware ABI and manual incorporation'});
}
export function glacialFaceSample(id,face,u,v,seed=0){
 const d=glacialCandidate(id);
 if(!Number.isInteger(face)||face<0||face>5||![u,v,seed].every(Number.isFinite))throw new RangeError('Invalid face sample');
 const x=Math.floor(u*32),y=Math.floor(v*32);
 const noise=(Math.imul(x+17,73856093)^Math.imul(y+31,19349663)^Math.imul(seed+face*7,83492791))>>>0;
 const pattern=id===GLACIAL_IDS[0]?Math.floor((u*.75+v)*12):id===GLACIAL_IDS[1]?Math.floor(v*7)+Math.floor(u*3):((x%9===0||y%11===0)?2:0);
 return d.material.palette[((noise>>>15)+pattern)&3];
}
// Emit only exposed axis-aligned faces, including partial face coverage of rime cap.
export function glacialMesh(id,rotation=0){
 const boxes=glacialCandidate(id,rotation).shape.boxes;
 const cuts=[0,1,2].map(axis=>[...new Set([0,1,...boxes.flatMap(b=>[b[axis],b[axis+3]])])].sort((a,b)=>a-b));
 const inside=p=>boxes.some(b=>p.every((v,i)=>v>b[i]+1e-8&&v<b[i+3]-1e-8));
 const vertices=[],normals=[],indices=[];
 for(let axis=0;axis<3;axis++){
  const [u,v]=[0,1,2].filter(i=>i!==axis);
  for(const plane of cuts[axis])for(let ui=0;ui<cuts[u].length-1;ui++)for(let vi=0;vi<cuts[v].length-1;vi++){
   const loU=cuts[u][ui],hiU=cuts[u][ui+1],loV=cuts[v][vi],hiV=cuts[v][vi+1];
   const mid=[0,0,0];mid[axis]=plane;mid[u]=(loU+hiU)/2;mid[v]=(loV+hiV)/2;
   const eps=1e-6,neg=[...mid],pos=[...mid];neg[axis]-=eps;pos[axis]+=eps;
   const a=inside(neg),b=inside(pos);if(a===b)continue;
   const sign=a?1:-1,base=vertices.length/3;
   const corners=[[loU,loV],[hiU,loV],[hiU,hiV],[loU,hiV]];
   for(const [cu,cv] of corners){const p=[0,0,0],n=[0,0,0];p[axis]=plane;p[u]=cu;p[v]=cv;n[axis]=sign;vertices.push(...p);normals.push(...n);}
   const p0=vertices.slice(base*3,base*3+3),p1=vertices.slice(base*3+3,base*3+6),p2=vertices.slice(base*3+6,base*3+9);
   const e1=p1.map((x,i)=>x-p0[i]),e2=p2.map((x,i)=>x-p0[i]);
   const cross=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];
   indices.push(...(cross[axis]*sign>0?[base,base+1,base+2,base,base+2,base+3]:[base,base+2,base+1,base,base+3,base+2]));
  }
 }
 return {vertices,normals,indices,transparent:glacialCandidate(id).material.transparent};
}
// Isolated reversible symbolic fixture, NOT the production schema-1 save API.
export function glacialFixture(){
 const cells=new Map();
 const key=(x,y,z)=>{if(![x,y,z].every(Number.isSafeInteger))throw new TypeError('Invalid coordinate');return [x,y,z].join(',');};
 return Object.freeze({
  place(x,y,z,id,rotation=0){glacialCandidate(id,rotation);const k=key(x,y,z);if(cells.has(k))return false;cells.set(k,{id,rotation});return true;},
  select(x,y,z){const v=cells.get(key(x,y,z));return v?{...v}:null;},
  remove(x,y,z){const k=key(x,y,z),v=cells.get(k);cells.delete(k);return v?{...v}:null;},
  snapshot(){return JSON.stringify([...cells].sort(([a],[b])=>a.localeCompare(b)));},
  restore(json){const entries=JSON.parse(json);if(!Array.isArray(entries))throw new TypeError('Invalid snapshot');const next=new Map();
   for(const entry of entries){if(!Array.isArray(entry)||entry.length!==2)throw new TypeError('Invalid entry');const [k,value]=entry;
    if(typeof k!=='string'||!/^(-?\d+),(-?\d+),(-?\d+)$/.test(k))throw new TypeError('Invalid key');
    const xyz=k.split(',').map(Number);if(key(...xyz)!==k||next.has(k))throw new TypeError('Duplicate/invalid key');
    if(!value||typeof value!=='object')throw new TypeError('Invalid value');glacialCandidate(value.id,value.rotation);next.set(k,{id:value.id,rotation:value.rotation});}
   cells.clear();for(const [k,v]of next)cells.set(k,v);
  }
 });
}
