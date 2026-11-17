// Candidate-only opt-in producer evidence provenance validator. Never touches production.
const sha = /^[0-9a-f]{40}$/;
const lanes = [':24', ':36', ':48'];
const safe = Number.isSafeInteger;
export function validateProducerEvidence(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new TypeError('manifest object required');
  const failures = [];
  const producers = manifest.producers;
  if (!producers || typeof producers !== 'object' || Array.isArray(producers)) throw new TypeError('producer map required');
  for (const lane of lanes) {
    const p = producers[lane];
    if (!p || typeof p !== 'object' || Array.isArray(p)) { failures.push(`${lane}:missing`); continue; }
    if (!sha.test(p.head ?? '')) failures.push(`${lane}:unverified-head`);
    if (typeof p.sourcePath !== 'string' || !/^(src|tests)\/[a-zA-Z0-9_./-]+$/.test(p.sourcePath) || p.sourcePath.includes('..')) failures.push(`${lane}:invalid-source-path`);
    if (p.fixtureKind !== 'producer-export') failures.push(`${lane}:not-source-driven`);
    if (typeof p.exportName !== 'string' || !/^[A-Za-z_$][\w$]*$/.test(p.exportName)) failures.push(`${lane}:invalid-export`);
  }
  const fixtures = manifest.fixtures;
  if (!Array.isArray(fixtures) || fixtures.length === 0) failures.push('missing-fixtures');
  else {
    const seen = new Set();
    for (const f of fixtures) {
      if (!f || !safe(f.seed) || f.seed < 0 || typeof f.name !== 'string' || !f.name.trim()) { failures.push('invalid-fixture'); continue; }
      const k = `${f.seed}:${f.name}`;
      if (seen.has(k)) failures.push('duplicate-fixture');
      seen.add(k);
      if (!lanes.every(l => f.lanes?.includes(l))) failures.push(`incomplete-cross-lane:${k}`);
    }
  }
  return Object.freeze({ok:failures.length===0, failures:Object.freeze(failures), status:failures.length===0?'SOURCE-MANIFEST-VALID-EXECUTION-NOT-VERIFIED':'NOT-VERIFIED'});
}
