// Snow biome #016–018: opt-in candidate physical voxel definitions, NOT live block IDs.
// Each cell is independently addressable; no game-world registry or saves are modified.
const FAMILIES=Object.freeze([
 {id:'biome130:016',name:'Powder snow',palette:['#f7fcff','#dbeef7','#b8d8e9','#ffffff'],hardness:0.12,boxes:[[0,0,0,1,.64,1],[.08,.64,.12,.91,.76,.88]],texture:'soft-wind-stipple',solid:false},
 {id:'biome130:017',name:'Compacted snowpack',palette:['#eaf8fc','#a8d5e7','#74b1cf','#f8ffff'],hardness:.65,boxes:[[0,0,0,1,1,1]],texture:'compressed-horizontal-strata',solid:true},
 {id:'biome130:018',name:'Wind-sculpted snowdrifts',palette:['#f7ffff','#d2edf7','#95c9e1','#ffffff'],hardness:.24,boxes:[[0,0,0,1,.25,1],[.1,.25,.12,.94,.47,.9],[.24,.47,.19,.89,.66,.81],[.43,.66,.27,.82,.77,.7]],texture:'wind-ripple-crest',solid:false}
]);
export const SNOW_IDS=Object.freeze(FAMILIES.map(x=>x.id));
const rotate=([x,y,z],r)=>{for(let i=0;i<r;i++)[x,z]=[1-z,x];return [x,y,z];};
const finiteBox=b=>b.length===6&&b.every(Number.isFinite)&&b.every(v=>v>=0&&v<=1)&&b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5];
export function snowCandidate(id,rotation=0){
 const d=FAMILIES.find(x=>x.id===id);
 if(!d)throw new RangeError('Unknown snow candidate');
 if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('rotation 0..3');
 const boxes=d.boxes.map(b=>{const a=rotate([b[0],b[1],b[2]],rotation),c=rotate([b[3],b[4],b[5]],rotation);
 return Object.freeze([Math.min(a[0],c[0]),b[1],Math.min(a[2],c[2]),Math.max(a[0],c[0]),b[4],Math.max(a[2],c[2])]);});
 if(!boxes.every(finiteBox))throw new Error('Invalid geometry');
 const bounds=Object.freeze([Math.min(...boxes.map(b=>b[0])),0,Math.min(...boxes.map(b=>b[2])),Math.max(...boxes.map(b=>b[3])),Math.max(...boxes.map(b=>b[4])),Math.max(...boxes.map(b=>b[5]))]);
 return Object.freeze({symbolicId:id,proposedFutureId:255+Number(id.slice(-3)),name:d.name,rotation,
  material:Object.freeze({palette:Object.freeze([...d.palette]),texture:d.texture,opacity:1,hardness:d.hardness}),
  shape:Object.freeze({boxes:Object.freeze(boxes),bounds}),
  physical:Object.freeze({selectable:true,placeable:true,removable:true,solid:d.solid,attachment:'ground',targetable:true}),
  status:'BLOCKED BY ENGINE',runtime:'NOT REGISTERED; future widened-ID + :00 interaction ABI required'});
}
// Deterministic opaque six-face material sample; no renderer integration.
export function snowFaceSample(id,face,u,v,seed=0){
 const d=snowCandidate(id);
 if(!Number.isInteger(face)||face<0||face>5||![u,v,seed].every(Number.isFinite))throw new RangeError('Invalid sample');
 const x=Math.floor(u*32),y=Math.floor(v*32),n=Math.imul(x+17,73856093)^Math.imul(y+29,19349663)^Math.imul(seed+face*13,83492791);
 const band=id==='biome130:017'?(Math.floor(v*11)%4):id==='biome130:018'?(Math.floor((v+Math.sin(u*8)*.025)*13)%4):0;
 return d.material.palette[((n>>>8)&3)+band&3];
}
// Isolated reversible fixture. It does NOT write game schema-1 saves.
export function snowFixture(){
 const cells=new Map();
 const key=(x,y,z)=>{if(![x,y,z].every(Number.isSafeInteger))throw new TypeError('Integer coordinates required');return [x,y,z].join(',');};
 return Object.freeze({
  place(x,y,z,id,rotation=0){snowCandidate(id,rotation);const k=key(x,y,z);if(cells.has(k))return false;cells.set(k,{id,rotation});return true;},
  select(x,y,z){const v=cells.get(key(x,y,z));return v?{...v}:null;},
  remove(x,y,z){const k=key(x,y,z),v=cells.get(k);cells.delete(k);return v?{...v}:null;},
  snapshot(){return JSON.stringify([...cells].sort(([a],[b])=>a.localeCompare(b)));},
  restore(json){const entries=JSON.parse(json);if(!Array.isArray(entries))throw new TypeError('Invalid snapshot');const next=new Map();
   for(const entry of entries){if(!Array.isArray(entry)||entry.length!==2||typeof entry[0]!=='string')throw new TypeError('Invalid entry');
    const [k,v]=entry,coords=k.split(',').map(Number);if(coords.length!==3||key(...coords)!==k||next.has(k))throw new TypeError('Invalid coordinates');
    snowCandidate(v?.id,v?.rotation);next.set(k,{id:v.id,rotation:v.rotation});}
   cells.clear();for(const [k,v]of next)cells.set(k,v);
  }
 });
}
