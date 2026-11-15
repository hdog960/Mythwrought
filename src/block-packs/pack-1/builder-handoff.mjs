// Pack 1-only, read-only construction handoff. No production registration or saves.
// The final integrator decides when these candidate IDs become live block types.
import {CORE_MASONRY} from './core-masonry.mjs';
import {STONE_SHAPES,stoneShapeDescriptor} from './stone-shapes.mjs';
import {GARDEN_COMPONENTS,gardenDescriptor} from './garden-components.mjs';
import {FOLIAGE_ASSETS,foliageDescriptor} from './physical-foliage.mjs';
import {FLORAL_CANDIDATES,floralDescriptor} from './floral-forms.mjs';
import {candidateFaceTexture} from './webgl2-candidates.mjs';

const groups=Object.freeze([
  ['masonry',CORE_MASONRY],['stone',STONE_SHAPES],
  ['garden',GARDEN_COMPONENTS],['foliage',FOLIAGE_ASSETS],
  ['floral',FLORAL_CANDIDATES]
]);
export const PACK1_BUILDER_CATALOG=Object.freeze(groups.flatMap(([family,definitions])=>
  definitions.map(({id,roster,slug,name,attachment})=>Object.freeze({
    id,roster,slug,name,family,
    // Building plans use roster symbols, NOT numeric voxel IDs.
    symbolicRef:'pack1:'+String(roster).padStart(3,'0'),
    support:attachment==='vertical-face'?'vertical-face':'none',
    candidateOnly:true,productionRegistered:false
  }))).sort((a,b)=>a.id-b.id));
const byId=new Map(PACK1_BUILDER_CATALOG.map(item=>[item.id,item]));
const bySymbol=new Map();
for(const item of PACK1_BUILDER_CATALOG){
  const list=bySymbol.get(item.symbolicRef)??[];
  list.push(item);bySymbol.set(item.symbolicRef,list);
}
for(const [symbol,list] of bySymbol)bySymbol.set(symbol,Object.freeze(list));
export const PACK1_BUILDER_FAMILY_REFS=Object.freeze([...bySymbol.keys()].sort());
const EMPTY=Object.freeze([]);
export function pack1BuilderFamilyCandidates(ref){
  return typeof ref==='string'&&/^pack1:\d{3}$/.test(ref)
    ?bySymbol.get(ref)??EMPTY:EMPTY;
}
// Fail closed on family-level ambiguity: a builder must explicitly select
// which distinct candidate variant it needs, never silently pick the first.
export function resolvePack1BuilderFamily(ref,{candidateId=null,rotation=0,variant='lower'}={}){
  const options=pack1BuilderFamilyCandidates(ref);
  if(!options.length)throw new RangeError('Unknown Pack 1 symbolic family');
  if(candidateId===null&&options.length!==1)
    throw new Error('Ambiguous Pack 1 family requires explicit candidateId: '+ref);
  const asset=candidateId===null?options[0]:options.find(x=>x.id===candidateId);
  if(!asset)throw new RangeError('Candidate ID is not part of symbolic Pack 1 family '+ref);
  return pack1BuilderShape(asset.id,{rotation,variant});
}
if(byId.size!==30||PACK1_BUILDER_CATALOG.some((e,i)=>e.id!==i+9)||bySymbol.size!==21)
  throw new Error('Pack 1 builder catalog requires 30 IDs and 21 roster family symbols');

const cloneBoxes=(boxes,{empty=false}={})=>{
  if(!Array.isArray(boxes)||(!empty&&!boxes.length)||boxes.length>32)
    throw new TypeError('Invalid builder AABB set');
  return Object.freeze(boxes.map(b=>{
    if(!Array.isArray(b)||b.length!==6||b.some(v=>!Number.isFinite(v))||
      [0,1,2].some(i=>b[i]<0||b[i]>=b[i+3]||b[i+3]>1))
      throw new TypeError('Invalid builder shape box');
    return Object.freeze([...b]);
  }));
};
function validateOptions(id,rotation,variant){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw new RangeError('Pack 1 rotation must be a quarter turn 0..3');
  if(variant!=='lower'&&variant!=='upper')
    throw new RangeError('Pack 1 shape variant must be lower or upper');
  if(variant==='upper'&&id!==15&&id!==16)
    throw new RangeError('Upper variant only exists for slabs and stairs');
}
export function pack1BuilderShape(id,{rotation=0,variant='lower'}={}){
  const meta=byId.get(id);
  if(!meta)return null;
  validateOptions(id,rotation,variant);
  const d=id<=14?CORE_MASONRY[id-9].shape
    :id<=20?stoneShapeDescriptor(id,{rotation,variant})
    :id<=23?gardenDescriptor(id,{rotation})
    :id<=31?foliageDescriptor(id,{rotation})
    :floralDescriptor(id,{rotation});
  const boxes=cloneBoxes(d.boxes);
  // Plants are targetable without being opaque player-collision cubes.
  const selection=cloneBoxes(d.selection?.boxes??d.boxes);
  const collision=cloneBoxes(d.collision?.boxes??d.boxes,{empty:true});
  const parts=Object.freeze((d.parts??d.boxes.map(box=>({role:'stone',box})))
    .map(({role,box})=>Object.freeze({role,box:cloneBoxes([box])[0]})));
  return Object.freeze({
    ...meta, rotation:id<=14?0:rotation, variant,
    shape:Object.freeze({boxes}), selection:Object.freeze({boxes:selection}),
    collision:Object.freeze({boxes:collision}), parts,
    requiresOrientationSidecar:id>14&&rotation!==0,
    requiresVariantPersistence:variant==='upper',
    // Every entry is a single placement cell; shared voxel ID registration is deferred.
    cellSpan:Object.freeze([1,1,1]), schema:1,
    legacyEditFormat:'[x,y,z,id]'
  });
}
export function pack1BuilderPlacementPlan(id,{cell,rotation=0,variant='lower',wallMounted=false}={}){
  const shape=pack1BuilderShape(id,{rotation,variant});
  if(!shape)throw new RangeError('Unknown Pack 1 candidate block ID');
  if(!Array.isArray(cell)||cell.length!==3||!cell.every(Number.isSafeInteger))
    throw new TypeError('Builder cell must be three safe integers');
  if(shape.support==='vertical-face'&&!wallMounted)
    return Object.freeze({ok:false,id,reason:'supporting-vertical-face-required'});
  const orientation=shape.requiresOrientationSidecar
    ?Object.freeze({cell:Object.freeze([...cell]),blockId:id,turns:rotation}):null;
  const variantState=shape.requiresVariantPersistence
    ?Object.freeze({cell:Object.freeze([...cell]),blockId:id,variant}):null;
  return Object.freeze({
    ok:true,id,cell:Object.freeze([...cell]),
    legacyEditRow:Object.freeze([...cell,id]),
    // Requirements are NOT written to the production save by this pure planner.
    requiredOrientationSidecar:orientation,
    requiredVariantState:variantState,
    supportMustBeRevalidated:shape.support==='vertical-face',
    canonicalSchema1Only:orientation===null&&variantState===null,
    shape
  });
}
export function pack1CanonicalSchema1Edit(plan){
  if(!plan||plan.ok!==true||!Array.isArray(plan.legacyEditRow)||plan.legacyEditRow.length!==4)
    throw new TypeError('Invalid Pack 1 construction plan');
  if(!plan.canonicalSchema1Only||plan.requiredOrientationSidecar||plan.requiredVariantState)
    throw new Error('Noncanonical Pack 1 construction needs engine-persisted orientation/variant metadata');
  return [...plan.legacyEditRow];
}
export function pack1BuilderFaceTexture(id,role,face,size=24){
  if(!byId.has(id))throw new RangeError('Unknown Pack 1 candidate');
  return candidateFaceTexture(id,role,face,size);
}
