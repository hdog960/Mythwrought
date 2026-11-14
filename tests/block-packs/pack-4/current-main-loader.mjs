// Pack 4 isolated acceptance dependency loader.
// The original Pack 4 branch forks from checkpoint 006; checkpoint 007
// introduced these opt-in shared modules in main. A raw Pack 4 HEAD checkout
// must report SKIP, not an ERR_MODULE_NOT_FOUND failure or fake passing gate.
// Real compatibility acceptance requires current-main + PR source together.
export async function loadCheckpoint007(t,{surface=false}={}){
 try{
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
 }catch(error){
  if(error?.code==='ERR_MODULE_NOT_FOUND'){
   t.skip('Integrated checkpoint 007 modules absent from raw Pack 4 fork; run with current main plus Pack 4 PR overlay');
   return null;
  }
  throw error;
 }
}
