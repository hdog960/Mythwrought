// Mythwrought Pack 4 — purely isolated placement/selection/save exercise.
// This module does NOT call the production world, change existing saves,
// install IDs, or generate a single world block. It is a test-gallery adapter.
import {windowShape,windowSaveState,windowMountOffset} from './windows.mjs';
import {lightingShape,lightingSaveState,lightingMountOffset} from './lighting.mjs';
import {furnishingShape,furnishingSaveState,furnishingMountOffset} from './furnishings.mjs';
import {civicShape,civicSaveState,civicMountOffset} from './hearth-civic.mjs';
const includedIds=Object.freeze([159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181]);
const key=(x,y,z)=>x+','+y+','+z;
function validCell(cell){
 if(!Array.isArray(cell)||cell.length!==3||
    !cell.every(Number.isSafeInteger))
    throw RangeError('Pack 4 fixture coordinates must be safe integers');
 return [...cell];
}
function assertId(id){
 if(!includedIds.includes(id))throw RangeError('Unknown Pack 4 candidate ID');
}
export function pack4Shape(id,rotation=0){
 assertId(id);
 return id<=164?windowShape(id,rotation):
  id<=168?lightingShape(id,rotation):
  id<=175?furnishingShape(id,rotation):civicShape(id,rotation);
}
export function pack4MountOffset(id,rotation=0){
 assertId(id);
 return id<=164?windowMountOffset(id,rotation):
  id<=168?lightingMountOffset(id,rotation):
  id<=175?furnishingMountOffset(id,rotation):civicMountOffset(id,rotation);
}
export function pack4State(id,rotation=0){
 assertId(id);
 return id<=164?windowSaveState(id,rotation):
  id<=168?lightingSaveState(id,rotation):
  id<=175?furnishingSaveState(id,rotation):civicSaveState(id,rotation);
}
function hit(origin,direction,box,maxReach){
 let tMin=-Infinity,tMax=Infinity,normal=null;
 for(let axis=0;axis<3;axis++){
  const v=direction[axis],a=box[axis],b=box[axis+3];
  if(Math.abs(v)<1e-9){
   if(origin[axis]<a||origin[axis]>b)return null;
   continue;
  }
  let lo=(a-origin[axis])/v,hi=(b-origin[axis])/v;
  const sign=lo>hi?1:-1;
  if(lo>hi)[lo,hi]=[hi,lo];
  if(lo>tMin){tMin=lo;normal=axis===0?[sign,0,0]:axis===1?[0,sign,0]:[0,0,sign];}
  tMax=Math.min(tMax,hi);
  if(tMin>tMax)return null;
 }
 const dist=tMin>=0?tMin:tMax>=0?0:Infinity;
 return dist<=maxReach?{distance:dist,normal}:null;
}
function intersects(a,b){
 return [0,1,2].every(axis=>a[axis]<b[axis+3]-1e-7 &&
   a[axis+3]>b[axis]+1e-7);
}
export function createPack4Fixture(initialSupports=[]){
 const placed=new Map(),supports=new Set();
 for(const cell of initialSupports)supports.add(key(...validCell(cell)));
 function get(cell){
  return placed.get(key(...validCell(cell)))??null;
 }
 function place(cell,id,rotation=0){
  const [x,y,z]=validCell(cell);
  const shape=pack4Shape(id,rotation);
  const k=key(x,y,z);
  if(placed.has(k)||supports.has(k))return Object.freeze({ok:false,reason:'occupied'});
  const offset=pack4MountOffset(id,rotation);
  if(offset){
   const anchorCell=[x+offset[0],y+offset[1],z+offset[2]];
   if(!anchorCell.every(Number.isSafeInteger))
    return Object.freeze({ok:false,reason:'support beyond safe world coordinates'});
   const anchor=key(...anchorCell);
   if(!supports.has(anchor))
    return Object.freeze({ok:false,reason:'missing fixed support'});
  }
  const state=pack4State(id,rotation);
  placed.set(k,Object.freeze({...state,cell:Object.freeze([x,y,z])}));
  return Object.freeze({ok:true,cell:Object.freeze([x,y,z]),id,rotation});
 }
 function remove(cell){
  const k=key(...validCell(cell));
  const before=placed.get(k);
  if(!before)return Object.freeze({ok:false,reason:'empty'});
  placed.delete(k);
  return Object.freeze({ok:true,removed:Object.freeze({...before})});
 }
 function raycast(origin,direction,maxReach=6){
  if(!Array.isArray(origin)||!Array.isArray(direction)||
      origin.length!==3||direction.length!==3||
      ![...origin,...direction,maxReach].every(Number.isFinite)||
      maxReach<=0||maxReach>12)
    throw RangeError('Invalid Pack 4 fixture ray');
  const len=Math.hypot(...direction);
  if(!(len>1e-9))throw RangeError('Zero-length fixture ray');
  const dir=direction.map(v=>v/len);
  let nearest=null;
  for(const item of placed.values()){
   const shape=pack4Shape(item.id,item.rotation);
   for(const b of shape.selection){
    const translated=b.map((n,i)=>n+item.cell[i%3]);
    const found=hit(origin,dir,translated,maxReach);
    if(found&&(!nearest||found.distance<nearest.distance)){
     nearest=Object.freeze({cell:item.cell,id:item.id,rotation:item.rotation,
       distance:found.distance,normal:Object.freeze(found.normal??[0,0,0])});
    }
   }
  }
  return nearest;
 }
 function collidesWithAabb(aabb){
  if(!Array.isArray(aabb)||aabb.length!==6||!aabb.every(Number.isFinite))
   throw TypeError('Invalid collision bounds');
  for(const item of placed.values()){
   for(const b of pack4Shape(item.id,item.rotation).collision){
    const translated=b.map((n,i)=>n+item.cell[i%3]);
    if(intersects(aabb,translated))return true;
   }
  }
  return false;
 }
 function save(){
  // Only an isolated test snapshot, NOT the production world's save format.
  return Object.freeze({fixture:'mythwrought.pack4.fixture',schemaVersion:1,
   cells:[...placed.values()].map(i=>({cell:[...i.cell],id:i.id,rotation:i.rotation}))
      .sort((a,b)=>key(...a.cell).localeCompare(key(...b.cell)))});
 }
 function restore(snapshot){
  if(!snapshot||snapshot.fixture!=='mythwrought.pack4.fixture'||
    snapshot.schemaVersion!==1||!Array.isArray(snapshot.cells)||
    snapshot.cells.length>4096)throw TypeError('Invalid fixture save');
  const candidates=[];
  const occupied=new Set();
  for(const item of snapshot.cells){
   if(!item||!Object.hasOwn(item,'cell')||!Object.hasOwn(item,'id')||
      !Object.hasOwn(item,'rotation')||item.rotation===undefined)
    throw TypeError('Truncated fixture cell');
   const cell=validCell(item.cell),state=pack4State(item.id,item.rotation);
   const k=key(...cell);
   if(occupied.has(k)||supports.has(k))throw TypeError('Duplicated/blocked fixture cell');
   occupied.add(k);candidates.push({cell,...state});
  }
  for(const item of candidates){
   const off=pack4MountOffset(item.id,item.rotation);
   if(off&&(!item.cell.map((n,i)=>n+off[i]).every(Number.isSafeInteger)||
      !supports.has(key(...item.cell.map((n,i)=>n+off[i])))))
    throw TypeError('Unsupported fixture cell');
  }
  // Atomic: reject malformed data before replacing any valid live fixture cells.
  placed.clear();
  for(const item of candidates)
    placed.set(key(...item.cell),Object.freeze({...item,cell:Object.freeze(item.cell)}));
  return placed.size;
 }
 return Object.freeze({get,place,remove,raycast,collidesWithAabb,save,restore,
  count:()=>placed.size,availableIds:includedIds});
}
