// Opt-in proof gate for collision geometry captured from a specific world snapshot.
// Does not access or change gameplay state.
export function validateTerrainSweepEvidence(evidence = {}) {
  const fail = reason => ({ok:false,reason});
  const {worldRevision, primary, secondary, bounds, maxShapes=4096} = evidence;
  const finitePoint = p => p && ['x','y','z'].every(k=>Number.isFinite(p[k]));
  if (typeof worldRevision !== 'string' || !worldRevision.trim() || !Number.isSafeInteger(maxShapes) || maxShapes<1 || maxShapes>4096) return fail('invalid-revision-or-budget');
  if (!bounds || !finitePoint(bounds.min) || !finitePoint(bounds.max) || ['x','y','z'].some(k=>bounds.min[k]>=bounds.max[k])) return fail('invalid-bounds');
  for (const [name,stage] of [['primary',primary],['secondary',secondary]]) {
    if (!stage || stage.worldRevision!==worldRevision || stage.complete!==true || !Array.isArray(stage.shapes) || stage.shapes.length>maxShapes) return fail(`${name}-unverified`);
    if (!finitePoint(stage.start) || !finitePoint(stage.end)) return fail(`${name}-invalid-path`);
    for (const k of ['x','y','z']) if (Math.min(stage.start[k],stage.end[k])<bounds.min[k] || Math.max(stage.start[k],stage.end[k])>bounds.max[k]) return fail(`${name}-out-of-bounds`);
    for (const b of stage.shapes) if (!b || !finitePoint(b.min) || !finitePoint(b.max) || ['x','y','z'].some(k=>b.min[k]>=b.max[k])) return fail(`${name}-invalid-shape`);
  }
  if (['x','y','z'].some(k=>primary.end[k]!==secondary.start[k])) return fail('disconnected-stages');
  return {ok:true,reason:'validated-contract',shapeCount:primary.shapes.length+secondary.shapes.length};
}
