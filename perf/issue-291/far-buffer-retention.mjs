// MYTHWROUGHT #291 — isolated, pure selective C6 far-wall retention planner.
// This is NOT wired into production or another developer's cave module.
// It neither owns WebGL handles nor calls WebGL. Integrate only with the cave
// owner's approval and original WebGL2 / screenshot / rollback acceptance.
//
// Contract: AFTER the voxel edit but BEFORE the next draw, recompute the
// source-authentic ray plan. Pass old and new ordered selected descriptors.
// Never reuse a buffer when the ray plan, its source composition or the
// current near-mesh readiness is uncertain. Existing GL guard operations,
// staging rollback and original sources must remain untouched.

export const FAR_RETENTION_LIMITS = Object.freeze({ maxChunks: 4, maxBytes: 1024 * 1024 });
const PARTS = Object.freeze(['companion', 'seamCompanion', 'wideWitnessCompanion']);

const integer = Number.isInteger;
const validCoordinate = n => integer(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER;
const list = x => Array.isArray(x) ? x : null;
function isOriginalSourceKey(source, depthMeshKey) {
  try { return source.key === depthMeshKey(source.cx, source.cz, source.section); }
  catch { return false; }
}

// Import and inject CURRENT original engine utilities on integration; never
// duplicate the true 16-wide section and seam decisions in the renderer.
export function affectedFarSourceKeys({ x, y, z }, {
  editAffectedChunks, verticalEditSections, depthMeshKey
} = {}) {
  if (![x, y, z].every(validCoordinate) ||
      typeof editAffectedChunks !== 'function' ||
      typeof verticalEditSections !== 'function' ||
      typeof depthMeshKey !== 'function')
    throw Error('FAR_RETENTION_INVALID_EDIT_OR_SOURCE_DEPENDENCIES');
  const sections = verticalEditSections(y);
  const chunks = editAffectedChunks(x, z);
  if (!list(sections) || sections.length === 0 || !sections.every(integer) ||
      !list(chunks) || chunks.length === 0 || !chunks.every(c => integer(c?.cx) && integer(c?.cz)))
    throw Error('FAR_RETENTION_INVALID_SOURCE_SEAM_PLAN');
  const result = new Set();
  for (const section of sections) for (const { cx, cz } of chunks) {
    const key = depthMeshKey(cx, cz, section);
    if (typeof key !== 'string' || !key.length)
      throw Error('FAR_RETENTION_INVALID_SOURCE_KEY');
    result.add(key);
  }
  return result;
}

function descriptorParts(source, depthMeshKey) {
  if (!source || typeof source !== 'object' ||
      typeof source.key !== 'string' || !source.key.length ||
      !['cx', 'cz', 'section'].every(k => integer(source[k])) ||
      !isOriginalSourceKey(source, depthMeshKey)) return null;
  const parts = [source];
  for (const kind of PARTS) {
    const p = source[kind];
    if (p !== undefined && p !== null) {
      if (typeof p !== 'object' || typeof p.key !== 'string' || !p.key.length ||
          !['cx', 'cz', 'section'].every(k => integer(p[k])) ||
          !isOriginalSourceKey(p, depthMeshKey)) return null;
      parts.push(p);
    }
  }
  if (new Set(parts.map(x => x.key)).size !== parts.length) return null;
  return parts;
}

function signature(source, depthMeshKey) {
  const parts = descriptorParts(source, depthMeshKey);
  if (!parts) return null;
  // Ordered primary + companion slots. The live mesh is the concatenation of
  // the original physical source sections in precisely this order.
  const components = [source, ...PARTS.map(p => source[p] ?? null)];
  return JSON.stringify(components.map(p => p ? [p.key, p.cx, p.cz, p.section] : null));
}

// Never call this planner with private engine state modified between the old
// snapshot and the newly recomputed plan. The caller MUST fail closed if it
// cannot prove that all currently resident buffers were originally constructed
// from the old plan, in the same iteration/draw order.
export function planFarWallEditRetention({
  beforeSelected, afterSelected, resident, affectedKeys, nearReady, depthMeshKey,
  maxChunks = FAR_RETENTION_LIMITS.maxChunks,
  maxBytes = FAR_RETENTION_LIMITS.maxBytes
} = {}) {
  const current = list(resident) ?? [];
  const allResidentKeys = current.map(x => x?.key).filter(k => typeof k === 'string');
  const reject = reason => ({
    mode: 'invalidate-all', reason,
    retainKeys: [], releaseKeys: allResidentKeys,
    // The original source-ray coverage MUST be recalculated for each edit.
    requiresFreshSourceRayPlan: true,
    noWebGLCallExecuted: true,
    safeForIntegration: false
  });
  if (!list(resident) || current.some(x => !x || typeof x.key !== 'string'))
    return reject('unknown-resident-state');
  if (nearReady !== true) return reject('near-meshes-not-confirmed-ready');
  if (typeof depthMeshKey !== 'function' ||
      !list(beforeSelected) || !list(afterSelected) || !(affectedKeys instanceof Set) ||
      [...affectedKeys].some(k => typeof k !== 'string')) return reject('missing-authoritative-plan-or-dependencies');
  if (!integer(maxChunks) || !integer(maxBytes) || maxChunks < 1 || maxBytes < 1 ||
      maxChunks > FAR_RETENTION_LIMITS.maxChunks || maxBytes > FAR_RETENTION_LIMITS.maxBytes)
    return reject('unsupported-residency-budget');
  if (beforeSelected.length > maxChunks || afterSelected.length > maxChunks ||
      current.length > maxChunks) return reject('oversize-selected-source-plan');
  const oldSignatures = beforeSelected.map(x => signature(x, depthMeshKey));
  const newSignatures = afterSelected.map(x => signature(x, depthMeshKey));
  if (oldSignatures.some(x => x === null) || newSignatures.some(x => x === null))
    return reject('malformed-source-descriptor');
  const oldKeys = beforeSelected.map(x => x.key), newKeys = afterSelected.map(x => x.key);
  if (new Set(oldKeys).size !== oldKeys.length || new Set(newKeys).size !== newKeys.length)
    return reject('duplicate-source-selection');
  if (oldSignatures.length !== newSignatures.length ||
      oldSignatures.some((x, i) => x !== newSignatures[i]))
    return reject('ray-plan-or-concatenation-changed');
  if (current.some((c, i) => c.key !== oldKeys[i]))
    return reject('resident-order-not-original-prefix');
  if (current.some(c => !integer(c.bytes) || c.bytes <= 0 || c.bytes > maxBytes) ||
      current.reduce((n, c) => n + c.bytes, 0) > maxBytes)
    return reject('unverified-source-buffer-budget');
  // Retain a strictly ordered prefix. Invalidation of an earlier primary
  // necessarily discards its resident suffix so later staged reuploads can
  // preserve the original Map iteration / coplanar LEQUAL draw ordering.
  const earliestDirty = current.findIndex((c, i) =>
    descriptorParts(afterSelected[i], depthMeshKey).some(source => affectedKeys.has(source.key)));
  const count = earliestDirty < 0 ? current.length : earliestDirty;
  return {
    mode: count === current.length ? 'retain-all' : count === 0 ? 'invalidate-all' : 'retain-prefix',
    reason: earliestDirty < 0 ? 'identical-source-plan-and-unaffected-geometry'
      : 'edited-source-requires-ordered-suffix-rebuild',
    retainKeys: current.slice(0, count).map(x => x.key),
    releaseKeys: current.slice(count).map(x => x.key),
    requiresFreshSourceRayPlan: true,
    noWebGLCallExecuted: true,
    safeForIntegration: false
  };
}
