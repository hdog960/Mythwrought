// Candidate physical desert voxel families. No live registry/world/save writes.
// 4x4x4 per-face color indices provide deterministic material microstructure.
const palette={
  'biome130:001':{name:'Pale dune sand',colors:['#eed8a4','#d6b97b','#f9e8bc','#bda06e'],hardness:0.18,friction:0.72,pattern:'ripple'},
  'biome130:002':{name:'Red dune sand',colors:['#ca7955','#a9533e','#e9a16d','#86483b'],hardness:0.2,friction:0.75,pattern:'crosswind'},
  'biome130:003':{name:'Desert hardpan',colors:['#bd956c','#917251','#d4b48b','#705942'],hardness:0.85,friction:0.91,pattern:'crackle'},
  'biome130:004':{name:'Cracked salt-flat crust',colors:['#f2e8d7','#d4cfbd','#fff8e9','#9e9c91'],hardness:0.48,friction:0.8,pattern:'salt'}
};
const MASK=0xffffffff;
function hash(a,b,c,d){let x=(Math.imul(a+17,0x9e3779b1)^Math.imul(b+29,0x85ebca77)^Math.imul(c+43,0xc2b2ae3d)^d)>>>0;x^=x>>>16;x=Math.imul(x,0x7feb352d)>>>0;x^=x>>>15;return x>>>0;}
function texel(kind,face,u,v){
  const h=hash(u,v,face,kind);
  if(kind===1)return ((v+Math.floor(u/2))%4===0)?1:(h%9===0?2:0);
  if(kind===2)return ((u+2*v+face)%5===0)?3:(h%7===0?2:0);
  if(kind===3)return (u===1&&v===2)||(u===3&&v===0)?3:(h%5===0?2:0);
  const crack=(u===1&&v!==0)||(v===2&&u>1);
  return crack?3:(h%8===0?2:0);
}
export const DESERT_CANDIDATE_IDS=Object.freeze(Object.keys(palette));
export function desertCandidate(id){
 const p=palette[id];if(!p)throw new RangeError('Unknown desert candidate');
 const ordinal=Number(id.slice(-3));const faces=Array.from({length:6},(_,face)=>Object.freeze(Array.from({length:16},(_,i)=>texel(ordinal,face,i%4,i>>2))));
 return Object.freeze({symbolicId:id,proposedFutureId:255+ordinal,name:p.name,kind:'physical-voxel-candidate',
  texture:Object.freeze({resolution:4,palette:Object.freeze([...p.colors]),faces:Object.freeze(faces)}),
  shape:Object.freeze({boxes:Object.freeze([Object.freeze([0,0,0,1,1,1])]),rotation:0}),
  physical:Object.freeze({solid:true,selectable:true,removable:true,placeable:true,transparent:false,attachment:'ground-or-neighbor',hardness:p.hardness,friction:p.friction}),
  status:'BLOCKED BY ENGINE',integration:'requires widened-ID registry and :00 targeting/placement/save ABI'});
}
export function candidateFixture(){
 const cells=new Map();
 return Object.freeze({
  place(x,y,z,id){desertCandidate(id);const key=[x,y,z].join(',');if(cells.has(key))return false;cells.set(key,id);return true;},
  select(x,y,z){return cells.get([x,y,z].join(','))??null;},
  remove(x,y,z){const key=[x,y,z].join(',');const old=cells.get(key)??null;cells.delete(key);return old;},
  snapshot(){return JSON.stringify([...cells.entries()].sort(([a],[b])=>a.localeCompare(b)));},
  restore(json){const entries=JSON.parse(json);if(!Array.isArray(entries))throw new TypeError('Invalid candidate snapshot');const next=new Map();for(const [key,id] of entries){desertCandidate(id);if(typeof key!=='string'||next.has(key))throw new TypeError('Invalid cell');next.set(key,id);}cells.clear();for(const [key,id] of next)cells.set(key,id);}
 });
}
