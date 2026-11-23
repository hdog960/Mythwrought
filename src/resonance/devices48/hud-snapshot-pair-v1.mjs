import {auditHudViewports48, REQUIRED_VIEWPORTS48} from './hud-multiview-audit-v1.mjs';

// Caller-provided geometry is deliberately untrusted. This gate proves only
// internally consistent source snapshots, never physical device measurement.
export function auditHudSnapshotPair48({before, after}) {
  const validate = snapshot => {
    if (!snapshot || typeof snapshot !== 'object' ||
        !Number.isSafeInteger(snapshot.tick) || snapshot.tick < 0 ||
        !Number.isSafeInteger(snapshot.revision) || snapshot.revision < 0 ||
        typeof snapshot.worldId !== 'string' || !snapshot.worldId.trim() ||
        typeof snapshot.layoutId !== 'string' || !snapshot.layoutId.trim() ||
        !Array.isArray(snapshot.fixtures) ||
        snapshot.fixtures.length !== REQUIRED_VIEWPORTS48.length)
      throw new TypeError('invalid-snapshot');
    // Do not allow mutable getter/proxy-like geometry to masquerade as a
    // stable snapshot. JSON-compatible plain records only, no accessors.
    const seen = new WeakSet();
    const clone = (value, depth=0) => {
      if (depth > 12) throw new TypeError('snapshot-depth');
      if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value !== 'object' || seen.has(value)) throw new TypeError('invalid-snapshot-value');
      if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype)
        throw new TypeError('nonplain-snapshot');
      seen.add(value);
      const out = Array.isArray(value) ? [] : {};
      for (const key of Reflect.ownKeys(value)) {
        if (typeof key !== 'string' || key === '__proto__') throw new TypeError('invalid-snapshot-key');
        const d = Object.getOwnPropertyDescriptor(value,key);
        if (!d || !Object.hasOwn(d,'value')) throw new TypeError('snapshot-accessor');
        out[key] = clone(d.value,depth+1);
      }
      seen.delete(value);
      return out;
    };
    const copy = clone(snapshot);
    return {copy, audit:auditHudViewports48(copy)};
  };
  const a=validate(before), b=validate(after);
  if (a.copy.worldId !== b.copy.worldId || a.copy.layoutId !== b.copy.layoutId ||
      a.copy.tick !== b.copy.tick || a.copy.revision !== b.copy.revision)
    throw new TypeError('snapshot-identity-drift');
  const canonical = x => x.copy.fixtures.map(f=>({
    viewport:f.viewport,panel:f.panel,reservedRects:f.reservedRects
  })).sort((u,v)=>u.viewport.width-v.viewport.width);
  const stable = JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
  return Object.freeze({
    authority:'display-only',
    admitted:stable && a.audit.admitted && b.audit.admitted,
    stable,
    before:a.audit,
    after:b.audit,
    reason:!stable?'geometry-changed':(!a.audit.admitted || !b.audit.admitted?'obstructed':'source-only-clear')
  });
}
