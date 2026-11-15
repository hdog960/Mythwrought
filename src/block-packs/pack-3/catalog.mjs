// Pack 3 Gate A: ONE opt-in, read-only candidate asset catalog for review.
// CANDIDATE ONLY. NOT a central block registry, save migration, mesh engine,
// build palette, world generator or approved install surface.
import {PACK3_ROOFING_ASSETS} from './roofing-materials.mjs';
import {PACK3_ROOF_GEOMETRY,pack3GeometryById} from './roof-geometry.mjs';
import {PACK3_FORTIFIED_ASSETS,pack3FortifiedById} from './fortified-pieces.mjs';
import {PACK3_ORNAMENTAL_ASSETS,pack3OrnamentalById} from './ornamental-pieces.mjs';
import {PACK3_MONUMENTAL_ASSETS,pack3MonumentalById} from './monumental-pieces.mjs';
export const PACK3_CANDIDATE_ASSETS=Object.freeze([
  ...PACK3_ROOFING_ASSETS,...PACK3_ROOF_GEOMETRY,...PACK3_FORTIFIED_ASSETS,
  ...PACK3_ORNAMENTAL_ASSETS,...PACK3_MONUMENTAL_ASSETS
]);
export const PACK3_CANDIDATE_IDS=Object.freeze(PACK3_CANDIDATE_ASSETS.map(a=>a.id));
const BY_ID=new Map(PACK3_CANDIDATE_ASSETS.map(a=>[a.id,a]));
// Surface roof entries 109–112 lack rotation-state in schema 1; fail closed
// rather than silently pretending they persist yaw. Shaped entries support 0..3.
export function pack3CandidateById(id,rotation=0){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw new RangeError('Pack 3 rotation must be 0..3');
  if(!Number.isInteger(id)||id<109||id>158||id===255)return null;
  if(id<=112)return rotation===0?BY_ID.get(id)??null:null;
  if(id<=115)return pack3GeometryById(id,rotation);
  if(id<=118)return pack3FortifiedById(id,rotation);
  if(id<=122)return pack3OrnamentalById(id,rotation);
  if(id<=125)return pack3MonumentalById(id,rotation);
  return null;
}
export function pack3CandidateShape(id,rotation=0){
  const a=pack3CandidateById(id,rotation);
  if(!a)return null;
  // Existing :00 shape contract only needs local box unions; no full cube.
  return a.shape??Object.freeze({boxes:a.boxes});
}
export function pack3CandidateMeshDescriptor(id,rotation=0){
  const a=pack3CandidateById(id,rotation);
  if(!a)return null;
  // Opt-in :12 contract. This does not run a mesh or create a live block.
  return Object.freeze({prototypeOnly:true,placeable:false,boxes:a.boxes});
}
export function pack3CandidateReviewManifest(){
  return Object.freeze(PACK3_CANDIDATE_ASSETS.map(a=>Object.freeze({
    id:a.id,roster:a.roster,name:a.name,kind:a.kind,boxCount:a.boxes.length,
    rotations:a.id<=112?Object.freeze([0]):Object.freeze([0,1,2,3]),
    integrated:false,liveRegistered:false
  })));
}
