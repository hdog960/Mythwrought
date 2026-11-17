// MYTHWROUGHT Creative integration G1 — PURE read-only catalog validation.
// No world, storage, registry, builder, release, or runtime mutation.
export const REGISTRY_SNAPSHOT_ABI='mythwrought.creative.registry-snapshot.v1';
export const MAX_REGISTERED_PLACEABLES=4096;
export const MAX_PHYSICAL_BOXES=128;
export const MAX_PHYSICAL_FOOTPRINT=16;

const ID=x=>Number.isSafeInteger(x)&&x>0 ||
  typeof x==='string'&&/^[A-Za-z][A-Za-z0-9_.:-]{1,127}$/.test(x);
const text=x=>typeof x==='string'&&x.trim().length>0&&x.length<=128;
const num=x=>typeof x==='number'&&Number.isFinite(x);
const reject=reason=>{throw new TypeError('G1 registry rejected: '+reason);};
export const typedPlaceableKey=id=>typeof id+':'+String(id);

function uniqueRotations(rotations){
  if(!Array.isArray(rotations)||!rotations.length||rotations.length>4)reject('rotations');
  const found=new Set();
  for(const n of rotations){if(!Number.isInteger(n)||n<0||n>3||found.has(n))reject('rotations');found.add(n);}
  if(!found.has(0))reject('missing neutral orientation');
  return Object.freeze([...rotations]);
}
function shapeBoxes(boxes,label){
  if(!Array.isArray(boxes)||boxes.length>MAX_PHYSICAL_BOXES)reject(label+' shape budget');
  return Object.freeze(boxes.map((b,index)=>{
    if(!Array.isArray(b)||b.length!==6||!b.every(num)||
       [0,1,2].some(i=>b[i]>=b[i+3]||b[i]<-4||b[i+3]>5))reject(label+' box '+index);
    return Object.freeze([...b]);
  }));
}
function shapeFootprint(values){
  if(!Array.isArray(values)||values.length<1||values.length>MAX_PHYSICAL_FOOTPRINT)reject('footprint');
  const found=new Set();
  return Object.freeze(values.map((c,index)=>{
    if(!c||typeof c!=='object'||Array.isArray(c)||
       !['dx','dy','dz'].every(k=>Number.isSafeInteger(c[k])&&Math.abs(c[k])<=8))
       reject('footprint coordinate '+index);
    const key=`${c.dx},${c.dy},${c.dz}`;
    if(found.has(key))reject('duplicate footprint cell');found.add(key);
    return Object.freeze({dx:c.dx,dy:c.dy,dz:c.dz});
  }));
}
export function validateRegistryEntries(entries){
  if(!Array.isArray(entries)||entries.length>MAX_REGISTERED_PLACEABLES)reject('snapshot size');
  const ids=new Set();
  return Object.freeze(entries.map((entry,index)=>{
    if(!entry||typeof entry!=='object'||Array.isArray(entry))reject('entry '+index);
    const {id,name,category,kind,source,placementRules}=entry;
    if(!ID(id))reject('stable ID '+index);
    const key=typedPlaceableKey(id);
    if(ids.has(key))reject('duplicate ID '+key);ids.add(key);
    if(!text(name)||!text(category)||!['block','object'].includes(kind))reject('metadata '+key);
    if(entry.registered!==true||entry.placeable!==true||entry.scenicOnly===true||
       entry.candidateOnly===true||entry.productionRegistered===false||entry.livePlaceable===false)
      reject('not runtime placeable '+key);
    if(!source||typeof source!=='object'||Array.isArray(source)||
       !['core','biome130','pack2'].includes(source.producer)||
       source.installedRegistry!=='src/blocks.mjs:BUILD_MATERIALS')
       reject('unverified registry source '+key);
    if(!placementRules||typeof placementRules!=='object'||Array.isArray(placementRules)||
       typeof placementRules.requiresSupport!=='boolean'||!text(placementRules.supportPolicy))
       reject('missing physical rules '+key);
    const footprint=shapeFootprint(placementRules.footprint);
    if(!footprint.some(v=>v.dx===0&&v.dy===0&&v.dz===0))reject('missing anchor '+key);
    const selectionBoxes=shapeBoxes(placementRules.selectionBoxes,'selection');
    const collisionBoxes=shapeBoxes(placementRules.collisionBoxes,'collision');
    if(!selectionBoxes.length)reject('unselectable '+key);
    const rotations=uniqueRotations(placementRules.rotations);
    return Object.freeze({id,name:name.trim(),category:category.trim(),kind,
      registered:true,placeable:true,scenicOnly:false,
      source:Object.freeze({producer:source.producer,installedRegistry:source.installedRegistry}),
      placementRules:Object.freeze({requiresSupport:placementRules.requiresSupport,
        supportPolicy:placementRules.supportPolicy,footprint,selectionBoxes,collisionBoxes,rotations})});
  }));
}
// Deterministic change detector, NOT a cryptographic authentication signature.
// Only the source-owning live registry can grant actual catalog authority.
export function catalogRevisionOf(entries){
  const encoded=JSON.stringify(entries);let h=2166136261;
  for(let i=0;i<encoded.length;i++){h^=encoded.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
  return `g1:${entries.length}:${encoded.length}:${h.toString(16).padStart(8,'0')}`;
}
export function sealReadOnlySnapshot(entries){
  const sorted=validateRegistryEntries(entries).slice().sort((a,b)=>
    typedPlaceableKey(a.id).localeCompare(typedPlaceableKey(b.id),'en'));
  const records=Object.freeze(sorted);
  return Object.freeze({abi:REGISTRY_SNAPSHOT_ABI,readOnly:true,
    origin:'merged-main-registered-materials',revision:catalogRevisionOf(records),records});
}
