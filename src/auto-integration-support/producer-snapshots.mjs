// Opt-in producer snapshot consistency checks; no production imports or writes.
// A producer must supply actual exported snapshots; fixtures alone are not proof.
const safe=Number.isSafeInteger;
const cell=p=>p&&['x','y','z'].every(k=>safe(p[k]));
const key=p=>`${p.x},${p.y},${p.z}`;
export function verifyProducerSnapshots({surface,caves,objects,seed}) {
  if (!safe(seed)||seed<0||!Array.isArray(surface)||!Array.isArray(caves)||!Array.isArray(objects))
    throw new TypeError('invalid producer snapshots');
  const errors=[],heights=new Map(),entrances=new Set(),ids=new Set();
  for (const s of surface) {
    if (!s||!safe(s.x)||!safe(s.z)||!safe(s.y)) {errors.push('surface:invalid-cell');continue;}
    const k=`${s.x},${s.z}`;
    if (heights.has(k)) errors.push('surface:duplicate-column');
    heights.set(k,s.y);
  }
  for (const c of caves) {
    if (!c||!cell(c.entrance)||!Array.isArray(c.path)||!c.path.length) {errors.push('cave:invalid-route');continue;}
    const k=`${c.entrance.x},${c.entrance.z}`,h=heights.get(k);
    if (h===undefined) errors.push('cave:unknown-surface-column');
    else if (c.entrance.y>h) errors.push('cave:entrance-above-surface');
    if (key(c.path[0])!==key(c.entrance)||!cell(c.path[0])) errors.push('cave:path-start-mismatch');
    entrances.add(key(c.entrance));
  }
  for (const o of objects) {
    if (!o||typeof o.id!=='string'||!o.id.startsWith('object:')||!cell(o.anchor)) {errors.push('object:invalid-descriptor');continue;}
    if (ids.has(o.id)) errors.push('object:duplicate-id');
    ids.add(o.id);
    const k=`${o.anchor.x},${o.anchor.z}`;
    if (!heights.has(k)&&!entrances.has(key(o.anchor))) errors.push('object:unknown-anchor-column');
  }
  return Object.freeze({ok:errors.length===0,errors:Object.freeze(errors),status:'SNAPSHOT-CONTRACT-ONLY-NOT-SOURCE-VERIFIED',seed});
}
