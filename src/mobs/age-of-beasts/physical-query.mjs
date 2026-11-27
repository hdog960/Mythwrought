// Isolated AB1/AB2 adapter: not mounted by production.
import {createWorldQuery} from '../world-query.mjs';
import {runtimeSectionForY} from '../../world-height.mjs';
import {inspectBodyVolume} from './body-contract.mjs';
export function createExpansionWorldQuery(reader,{resident,revision,observe,overlayRayHit,extraOverlayBlocked}={}){
 if(![resident,revision,observe,extraOverlayBlocked].every(x=>typeof x==='function'))
  throw TypeError('Expansion requires explicit owner residency, revision, environment and overlay authority');
 return createWorldQuery(reader,{resident,revision,observe,overlayRayHit,
  physical:{sectionAt:runtimeSectionForY,extraOverlayBlocked,
   inspectVolume:(p,b,g)=>inspectBodyVolume(p,{radius:b?.radius,height:b?.height,collision:b?.collision??'aabb'},g)}});
}
