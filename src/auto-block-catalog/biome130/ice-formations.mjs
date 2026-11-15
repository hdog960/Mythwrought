// M2 #025–027: physical snow-biome candidates. Opt-in only; NEVER registered in the live world.
const families=[
  {n:25,name:'Hanging icicles',attachment:'ceiling',opacity:.72,hardness:.55,palette:['#e4fbff','#a8e4f5','#74bddb','#f8ffff'],boxes:[[.38,.74,.38,.62,1,.62],[.42,.48,.42,.58,.74,.58],[.46,.18,.46,.54,.48,.54]]},
  {n:26,name:'Upright ice spikes',attachment:'ground',opacity:.82,hardness:.9,palette:['#c5f3ff','#7bd1ee','#398fbd','#f0ffff'],boxes:[[.19,0,.21,.81,.18,.79],[.3,.18,.3,.7,.52,.7],[.4,.52,.4,.6,.91,.6]]},
  {n:27,name:'Frozen waterfall formations',attachment:'wall',opacity:.68,hardness:1.1,palette:['#d2f8ff','#8fd4f0','#4f9fc8','#ecffff'],boxes:[[.12,0,.72,.88,1,1],[.24,0,.6,.39,.84,.72],[.57,.09,.58,.76,.93,.72]]}
];
const catalog=new Map(families.map(f=>['biome130:'+String(f.n).padStart(3,'0'),f]));
export const ICE_FORMATION_IDS=Object.freeze([...catalog.keys()]);
const validRotation=r=>{if(!Number.isInteger(r)||r<0||r>3)throw new RangeError('rotation 0..3 required');};
function rotatedBox(b,r){let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<r;i++){[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];}return [x0,y0,z0,x1,y1,z1];}
export function iceFormation(id,rotation=0){
 const f=catalog.get(id);if(!f)throw new RangeError('unknown ice formation');validRotation(rotation);
 const boxes=f.boxes.map(b=>Object.freeze(rotatedBox(b,rotation)));
 const bounds=Object.freeze([Math.min(...boxes.map(b=>b[0])),Math.min(...boxes.map(b=>b[1])),Math.min(...boxes.map(b=>b[2])),Math.max(...boxes.map(b=>b[3])),Math.max(...boxes.map(b=>b[4])),Math.max(...boxes.map(b=>b[5]))]);
 return Object.freeze({symbolicId:id,proposedFutureId:255+f.n,name:f.name,rotation,
  shape:Object.freeze({boxes:Object.freeze(boxes),bounds}),
  material:Object.freeze({palette:Object.freeze([...f.palette]),opacity:f.opacity,transparent:true,renderPass:'transparent',hardness:f.hardness}),
  physical:Object.freeze({targetable:true,selectable:true,placeable:true,removable:true,solid:true,attachment:f.attachment}),
  status:'BLOCKED BY ENGINE',runtime:'candidate only: :00 widened ID, shape targeting, save and transparent mesher required'});
}
export function iceFaceColor(id,face,u,v,seed=0){
 const f=iceFormation(id);if(!Number.isInteger(face)||face<0||face>5||![u,v,seed].every(Number.isFinite))throw new RangeError('invalid face sample');
 const x=Math.floor(u*32),y=Math.floor(v*32),noise=(Math.imul(x+11,73856093)^Math.imul(y+29,19349663)^Math.imul(seed+face*13,83492791))>>>0;
 return f.material.palette[((noise>>>14)+Math.floor(v*7))&3];
}
// Surface extraction: split every box at all box boundaries, discard internal faces.
export function iceFormationMesh(id,rotation=0){
 const boxes=iceFormation(id,rotation).shape.boxes;
 const cuts=[0,1,2].map(axis=>[...new Set([0,1,...boxes.flatMap(b=>[b[axis],b[axis+3]])])].sort((a,b)=>a-b));
 const inside=p=>boxes.some(b=>p.every((v,i)=>v>b[i]+1e-8&&v<b[i+3]-1e-8));
 const vertices=[],normals=[],indices=[];
 for(let axis=0;axis<3;axis++){
  const [u,v]=[0,1,2].filter(a=>a!==axis);
  for(const plane of cuts[axis])for(let i=0;i<cuts[u].length-1;i++)for(let j=0;j<cuts[v].length-1;j++){
   const loU=cuts[u][i],hiU=cuts[u][i+1],loV=cuts[v][j],hiV=cuts[v][j+1];
   const mid=[0,0,0];mid[axis]=plane;mid[u]=(loU+hiU)/2;mid[v]=(loV+hiV)/2;
   const a=[...mid],b=[...mid];a[axis]-=1e-6;b[axis]+=1e-6;
   const neg=inside(a),pos=inside(b);if(neg===pos)continue;
   const sign=neg?1:-1,base=vertices.length/3;
   for(const [cu,cv] of [[loU,loV],[hiU,loV],[hiU,hiV],[loU,hiV]]){
    const p=[0,0,0],n=[0,0,0];p[axis]=plane;p[u]=cu;p[v]=cv;n[axis]=sign;vertices.push(...p);normals.push(...n);
   }
   const p0=vertices.slice(base*3,base*3+3),p1=vertices.slice(base*3+3,base*3+6),p2=vertices.slice(base*3+6,base*3+9);
   const e1=p1.map((x,k)=>x-p0[k]),e2=p2.map((x,k)=>x-p0[k]);
   const cross=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];
   indices.push(...(cross[axis]*sign>0?[base,base+1,base+2,base,base+2,base+3]:[base,base+2,base+1,base,base+3,base+2]));
  }
 }
 return {vertices,normals,indices,transparent:true};
}
// Independent reversible symbolic fixture, not the production schema-1 persistence layer.
export function iceFormationFixture(){
 const cells=new Map();
 const key=(x,y,z)=>{if(![x,y,z].every(Number.isSafeInteger))throw new TypeError('invalid coordinate');return [x,y,z].join(',');};
 return Object.freeze({
  place(x,y,z,id,rotation=0){iceFormation(id,rotation);const k=key(x,y,z);if(cells.has(k))return false;cells.set(k,{id,rotation});return true;},
  select(x,y,z){const v=cells.get(key(x,y,z));return v?{...v}:null;},
  remove(x,y,z){const k=key(x,y,z),v=cells.get(k);cells.delete(k);return v?{...v}:null;},
  snapshot(){return JSON.stringify([...cells].sort(([a],[b])=>a.localeCompare(b)));},
  restore(json){const data=JSON.parse(json);if(!Array.isArray(data))throw new TypeError('invalid snapshot');const next=new Map();
   for(const entry of data){if(!Array.isArray(entry)||entry.length!==2)throw new TypeError('invalid entry');
    const [k,v]=entry;if(typeof k!=='string'||! /^-?\d+,-?\d+,-?\d+$/.test(k))throw new TypeError('invalid key');
    if(key(...k.split(',').map(Number))!==k||next.has(k)||!v||typeof v!=='object')throw new TypeError('invalid cell');
    iceFormation(v.id,v.rotation);next.set(k,{id:v.id,rotation:v.rotation});}
   cells.clear();for(const [k,v] of next)cells.set(k,v);
  }
 });
}
