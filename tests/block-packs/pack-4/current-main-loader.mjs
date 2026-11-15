// Pack 4's raw branch forked before checkpoint 007 added shared shape
// modules. Only raw-fork absence is a SKIP; broken imports from an otherwise
// present main checkout must FAIL, never be disguised as successful testing.
import {access} from 'node:fs/promises';

const deps={
 surface:['../../../src/shape-prototypes.mjs'],
 interaction:[
  '../../../src/voxel-shape-interactions.mjs',
  '../../../src/voxel-shape-fit.mjs',
  '../../../src/voxel-orientation-sidecar.mjs'
 ]
};
export async function loadCheckpoint007(t,{surface=false}={}){
 const required=surface?deps.surface:deps.interaction;
 try{
  await Promise.all(required.map(path=>access(new URL(path,import.meta.url))));
 }catch(error){
  if(error?.code==='ENOENT'){
   t.skip('Checkpoint 007 modules absent from raw Pack 4 fork; rerun on latest-main + PR combined checkout');
   return null;
  }
  throw error;
 }
 // Once the expected modules are confirmed present, any import/module error
 // is a real acceptance failure, not an environmental skip.
 if(surface){
  const {prototypeSurfaceMesh}=await import('../../../src/shape-prototypes.mjs');
  return {prototypeSurfaceMesh};
 }
 const [shape,fit,sidecar]=await Promise.all([
  import('../../../src/voxel-shape-interactions.mjs'),
  import('../../../src/voxel-shape-fit.mjs'),
  import('../../../src/voxel-orientation-sidecar.mjs')
 ]);
 return {
  validateShape:shape.validateShape,rotateShape:shape.rotateShape,
  raycastShapes:shape.raycastShapes,canPlaceShape:shape.canPlaceShape,
  inspectBodyFit:fit.inspectBodyFit,
  makeOrientationSidecar:sidecar.makeOrientationSidecar,
  restoreOrientationSidecar:sidecar.restoreOrientationSidecar
 };
}
