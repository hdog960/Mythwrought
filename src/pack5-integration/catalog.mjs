/**
 * Builder-facing, opt-in Pack 5 catalog.
 * Source of truth: the 18 physical candidate families merged in PR #119.
 * This module creates NO persistent block IDs and writes NO game saves.
 */
import {validatePhysicalDescriptor} from '../block-packs/pack-5/fixture.mjs';
import {PACK5_SURFACE_FAMILIES,PACK5_SURFACES,surfaceBoxMesh} from '../block-packs/pack-5/architectural-surfaces.mjs';
import {RESIDENTIAL_FAMILIES,RESIDENTIAL_FURNITURE,furnitureBoxMesh} from '../block-packs/pack-5/residential-furnishings.mjs';
import {SHOP_FAMILIES,SHOP_FIXTURES,shopBoxMesh} from '../block-packs/pack-5/shop-workshop.mjs';
import {WORKSHOP_FAMILIES,WORKSHOP_FIXTURES,workshopBoxMesh} from '../block-packs/pack-5/workshop-fixtures.mjs';
import {CIVIC_FAMILIES,CIVIC_INTERIORS,civicBoxMesh} from '../block-packs/pack-5/civic-interiors.mjs';
import {SPECIALTY_FAMILIES,SPECIALTY_FIXTURES,specialtyBoxMesh} from '../block-packs/pack-5/fortified-specialties.mjs';

const groups=[
  [PACK5_SURFACE_FAMILIES,PACK5_SURFACES,surfaceBoxMesh],
  [RESIDENTIAL_FAMILIES,RESIDENTIAL_FURNITURE,furnitureBoxMesh],
  [SHOP_FAMILIES,SHOP_FIXTURES,shopBoxMesh],
  [WORKSHOP_FAMILIES,WORKSHOP_FIXTURES,workshopBoxMesh],
  [CIVIC_FAMILIES,CIVIC_INTERIORS,civicBoxMesh],
  [SPECIALTY_FAMILIES,SPECIALTY_FIXTURES,specialtyBoxMesh]
];
const registered=new Map();
export const PACK5_BUILDER_FAMILIES=Object.freeze(groups.flatMap(([families])=>families));
for(const [families,variants,mesh] of groups){
  for(const family of families){
    if(!validatePhysicalDescriptor(family) || registered.has(family.symbolicId))
      throw Error('Invalid or duplicate Pack 5 builder family');
    const authored=variants.filter(v=>v.symbolicId===family.symbolicId);
    if(authored.length!==2 || authored.some(v=>!validatePhysicalDescriptor(v)) ||
       new Set(authored.map(v=>v.variant)).size!==2)
      throw Error('Missing distinct Pack 5 authored variants');
    registered.set(family.symbolicId,Object.freeze({
      symbolicId:family.symbolicId,name:family.name,attachment:family.attachment,
      variants:Object.freeze(authored.map(v=>v.variant)),family,
      descriptors:Object.freeze(authored),mesh
    }));
  }
}
if(registered.size!==18 || [...registered.keys()].some((id,i)=>id!==
   'pack5:'+String(79+i).padStart(3,'0')))
  throw Error('Pack 5 builder catalog must contain precisely 079–096');

export const PACK5_BUILDER_CATALOG=Object.freeze([...registered.values()].map(
  ({symbolicId,name,attachment,variants})=>Object.freeze({symbolicId,name,attachment,variants})
));
export function resolvePack5BuilderAsset(symbolicId,variant=null){
  const entry=registered.get(symbolicId);
  if(!entry)throw Error('Unknown Pack 5 builder family');
  const chosen=variant===null?entry.variants[0]:variant;
  const descriptor=entry.descriptors.find(d=>d.variant===chosen);
  if(!descriptor)throw Error('Unknown Pack 5 builder variant');
  return {descriptor,mesh:entry.mesh,variant:chosen,entry};
}
