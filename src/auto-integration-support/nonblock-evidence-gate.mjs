// Opt-in, non-production :12 source provenance and lifecycle evidence gate.
// Never treats caller-provided SHAs or fixture callbacks as authenticated runtime evidence.
const HEX40 = /^[0-9a-f]{40}$/;
const REQUIRED = [':48', ':24', ':36', ':00'];
export function auditNonblockEvidence(input) {
  const errors = [];
  const refs = input?.refs ?? {};
  for (const lane of REQUIRED) {
    const item = refs[lane];
    if (!item || !HEX40.test(item.sha ?? '') || item.authenticated !== true ||
        item.method !== 'github-exact-ref') errors.push('unauthenticated-source:' + lane);
  }
  if (input?.mode !== 'isolated' || input?.productionRegistration !== false)
    errors.push('production-mode-forbidden');
  if (input?.schema !== 'nonblock-object-v1') errors.push('schema-mismatch');
  const objects = input?.objects;
  if (!Array.isArray(objects) || objects.length === 0) errors.push('objects-missing');
  const seen = new Set(), tombstones = new Set(input?.tombstones ?? []);
  for (const obj of Array.isArray(objects) ? objects : []) {
    if (!obj || typeof obj.key !== 'string' || !obj.key.startsWith('nb1:') ||
        seen.has(obj.key)) errors.push('duplicate-or-invalid-key');
    else seen.add(obj.key);
    if (obj?.kind === 'fx') {
      if (obj.effectMode !== 'ambient' && !(obj.effectMode === 'parent-linked' &&
          typeof obj.parentKey === 'string' && obj.parentKey.startsWith('nb1:')))
        errors.push('unowned-fx');
    } else if (obj?.pickable !== true || obj?.breakable !== true ||
               obj?.removable !== true || obj?.persistentTombstone !== true)
      errors.push('unbreakable-object');
    if (obj?.kind !== 'fx' && (!Array.isArray(obj?.selectionAabb) ||
        obj.selectionAabb.length !== 6 ||
        !obj.selectionAabb.every(Number.isFinite) ||
        obj.selectionAabb.some((v,i) => i < 3 && v >= obj.selectionAabb[i+3])))
      errors.push('invalid-selection-aabb');
    if (obj?.spawnedByDefault === true) errors.push('default-spawn-forbidden');
    if (obj?.overlapsProtectedEdit === true) errors.push('protected-edit-overlap');
    if (tombstones.has(obj?.key)) errors.push('tombstone-respawn');
  }
  if (input?.evidence?.realPick !== true || input?.evidence?.realBreak !== true ||
      input?.evidence?.realSchema1Reload !== true) errors.push('live-lifecycle-not-proven');
  if (input?.evidence?.chromiumWebgl2 !== true) errors.push('webgl2-not-proven');
  return Object.freeze({ok:errors.length===0, errors:[...new Set(errors)],
    status:errors.length===0 ? 'EVIDENCE_DECLARED_NOT_INDEPENDENTLY_VERIFIED' : 'NOT_VERIFIED'});
}
