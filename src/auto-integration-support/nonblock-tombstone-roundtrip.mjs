// Opt-in fixture only. No save schema mutation, production import, or live binding.
const validKey = k => typeof k === 'string' && /^nb1:[^:]+:-?\d+:-?\d+,-?\d+,-?\d+:[0-3]$/.test(k);
export function verifyTombstoneRoundtrip({instances, pick, remove, serialize, restore, isVisible, sourceProof} = {}) {
  const errors = [];
  if (!sourceProof || sourceProof.authenticated !== true || ![':00', ':24', ':36', ':48'].every(k => typeof sourceProof[k] === 'string' && /^[a-f0-9]{40}$/.test(sourceProof[k]))) errors.push('SOURCE_PROOF_MISSING');
  if (!Array.isArray(instances) || instances.length < 2) errors.push('INSUFFICIENT_INSTANCES');
  for (const fn of [pick, remove, serialize, restore, isVisible]) if (typeof fn !== 'function') errors.push('MISSING_CALLBACK');
  if (errors.length) return {ok:false,status:'NOT_VERIFIED',errors};
  const keys = instances.map(x => x?.instanceKey);
  if (keys.some(k => !validKey(k)) || new Set(keys).size !== keys.length) return {ok:false,status:'NOT_VERIFIED',errors:['INVALID_OR_DUPLICATE_KEY']};
  try {
    const target = instances[0], survivor = instances[1];
    if (pick(target) !== target.instanceKey) errors.push('PICK_MISMATCH');
    if (errors.length) return {ok:false,status:'NOT_VERIFIED',errors};
    remove(target.instanceKey);
    if (isVisible(target.instanceKey)) errors.push('REMOVE_FAILED');
    if (!isVisible(survivor.instanceKey)) errors.push('SURVIVOR_REMOVED');
    const snapshot = serialize();
    if (snapshot === undefined || snapshot === null) errors.push('EMPTY_SNAPSHOT');
    if (!errors.length) {
      restore(snapshot);
      if (isVisible(target.instanceKey)) errors.push('TOMBSTONE_LOST_ON_RESTORE');
      if (!isVisible(survivor.instanceKey)) errors.push('SURVIVOR_LOST_ON_RESTORE');
    }
  } catch (e) { errors.push('CALLBACK_EXCEPTION'); }
  return {ok:errors.length===0,status:errors.length?'NOT_VERIFIED':'AUTHENTICATED_INPUT_FIXTURE_ONLY_NOT_SCHEMA1',errors};
}
