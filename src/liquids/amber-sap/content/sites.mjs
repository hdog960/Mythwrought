// Amber Sap B: read-only content plans. No source ticking or world writes.
import {AMBER_SAP_MATERIAL,createAmberBasin} from './visuals.mjs';
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const pos=p=>Object.freeze([...p]);
const key=p=>p.join(',');
const symbol=s=>typeof s==='string'&&/^[a-zA-Z0-9:_-]{1,80}$/.test(s);
const functions=(...fs)=>{if(fs.some(f=>typeof f!=='function'))throw new TypeError('Explicit content host required');};
const rgb=hex=>Object.freeze([1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255));
// Water B presentation v1 adapter; depth and blend flags are not a renderer.
export const AMBER_SAP_RENDER_MATERIAL=Object.freeze({id:'amber-sap',pass:'transparent',
  color:rgb(AMBER_SAP_MATERIAL.shallow),alpha:AMBER_SAP_MATERIAL.opacity,emissive:0,
  depthTest:true,depthWrite:false,cull:false,blend:'straight-alpha'});

// The tree owner supplies a real existing anchor, stable tree identity and
// finite stock. The result is a descriptor for Amber Sap A's createSapSource.
// A host must reserve tree/stock identity once and recheck the live attachment
// on every collection; this proposal never creates or reserves stock itself.
export function planAmberTap({treeId,anchor,face,stock,rate=1,target=8,
  isLoaded,isOpen,isTreeAnchor,canAttach}={}){
  functions(isLoaded,isOpen,isTreeAnchor,canAttach);
  if(!symbol(treeId)||!point(anchor)||!Array.isArray(face)||face.length!==2||
    !face.every(n=>int(n,-1,1))||Math.abs(face[0])+Math.abs(face[1])!==1||
    !int(stock,0,Number.MAX_SAFE_INTEGER)||!int(rate,1,8)||!int(target,1,8))
    throw new TypeError('Invalid finite tap descriptor');
  const outlet=[anchor[0]+face[0],anchor[1],anchor[2]+face[1]];
  if(!point(outlet)||isLoaded(...anchor)!==true||isLoaded(...outlet)!==true||
    isTreeAnchor(treeId,...anchor)!==true||isOpen(...outlet)!==true||
    canAttach(treeId,...outlet)!==true)return null;
  return Object.freeze({id:'amber-sap-tap',anchor:pos(anchor),outlet:pos(outlet),
    source:Object.freeze({x:outlet[0],y:outlet[1],z:outlet[2],treeId,stock,rate,target})});
}

// Validate an existing physical basin; no placements, terrain edits or
// source replenishment. All 41 shell voxels and nine interior cells must
// be loaded; only authorized liner material and passable interiors qualify.
export function inspectAmberBasin({origin,engine,isLoaded,isOpen,isLiner}={}){
  functions(engine?.getCell,isLoaded,isOpen,isLiner);
  if(!point(origin))throw new RangeError('Invalid basin origin');
  const basin=createAmberBasin({x:origin[0],y:origin[1],z:origin[2]});
  for(const p of basin.solid)if(isLoaded(...p)!==true||isLiner(...p)!==true||engine.getCell(...p)!==null)return null;
  const slots=[];let freeUnits=0;
  for(const p of basin.interior){
    if(isLoaded(...p)!==true||isOpen(...p)!==true)return null;
    const c=engine.getCell(...p);
    if(c!==null&&(c?.id!=='amber-sap'||!int(c.units,1,8)||!point([c.x,c.y,c.z])||key([c.x,c.y,c.z])!==key(p)))return null;
    const room=8-(c?.units??0);freeUnits+=room;
    slots.push(Object.freeze({position:p,expected:c,room}));
  }
  return Object.freeze({id:basin.id,origin:pos(origin),freeUnits,slots:Object.freeze(slots)});
}

// A finite plain-sap deposit plan sourced from an explicit host-owned stock
// record. All-or-none capacity/permission check, fixed basin order, <=9 writes.
// Expected cell identities and stock revision are transient preconditions;
// host must revalidate terrain and commit stock debit + inserts atomically.
// Core v1 has no such multi-insert transaction, so never execute this plan here.
export function planAmberDeposit({origin,engine,isLoaded,isOpen,isLiner,canDeposit,
  stockId,stockRevision,availableUnits,units}={}){
  functions(canDeposit);
  if(!symbol(stockId)||!int(stockRevision,0,Number.MAX_SAFE_INTEGER)||
    !int(availableUnits,0,Number.MAX_SAFE_INTEGER)||!int(units,1,72))throw new TypeError('Invalid deposit stock');
  if(units>availableUnits)return null;
  const basin=inspectAmberBasin({origin,engine,isLoaded,isOpen,isLiner});
  if(!basin||units>basin.freeUnits)return null;
  let left=units;const inserts=[];
  for(const slot of basin.slots){
    if(!left)break;
    if(!slot.room||canDeposit(...slot.position)!==true)continue;
    const n=Math.min(left,slot.room);left-=n;
    inserts.push(Object.freeze({position:slot.position,expected:slot.expected,id:'amber-sap',units:n}));
  }
  if(left)return null;
  return Object.freeze({id:'amber-sap-deposit-plan',origin:basin.origin,
    stock:Object.freeze({id:stockId,revision:stockRevision,expectedUnits:availableUnits,debit:units}),
    inserts:Object.freeze(inserts)});
}
