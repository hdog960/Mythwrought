// MYTHWROUGHT Creative Builder Mode — Roadmap 9, M0 ONLY.
// Pure, detached interface guards. Nothing here installs controls, edits a world,
// writes storage, imports production registries or enables the feature.
export const CREATIVE_ADAPTER_ABI = 'mythwrought.creative.adapters.v1';
export const CREATIVE_ENABLED_BY_DEFAULT = false;
export const REQUIRED_CREATIVE_PORTS = Object.freeze({
  registry: Object.freeze(['listPlaceables']),
  controls: Object.freeze(['suspendExploration', 'readFlightIntent', 'restoreExploration']),
  streaming: Object.freeze(['isRegionReady', 'requestBoundedPrefetch']),
  edits: Object.freeze(['canEdit', 'tryPlace', 'tryRemove', 'applyEditBatch', 'queueMeshRefresh']),
  saves: Object.freeze(['loadCreativeEdits', 'saveCreativeEdits'])
});
export const OPTIONAL_CREATIVE_PORTS = Object.freeze({
  blueprints: Object.freeze(['listReadyBlueprints'])
});

// Structural introspection ONLY: a passing mock is never proof that the game
// provides the APIs, or that Creative Mode is enabled, integrated or safe to use.
export function inspectCreativePorts(ports) {
  const missing = [];
  for (const [port, methods] of Object.entries(REQUIRED_CREATIVE_PORTS)) {
    for (const method of methods) {
      if (typeof ports?.[port]?.[method] !== 'function') missing.push(port + '.' + method);
    }
  }
  if (ports?.saves?.worldSchema !== 1) missing.push('saves.worldSchema=1');
  if (ports?.registry?.provenance !== 'live-registered-placeables')
    missing.push('registry.provenance=live-registered-placeables');
  return Object.freeze({abi: CREATIVE_ADAPTER_ABI,
    shapeValid: missing.length === 0, missing: Object.freeze(missing),
    runtimeIntegrated: false, enabled: false});
}

function validId(id) {
  return Number.isSafeInteger(id) && id > 0 ||
    typeof id === 'string' && /^[A-Za-z][A-Za-z0-9_.:-]{1,127}$/.test(id);
}

// M3 will call an authorized live adapter. M0 deliberately takes ONLY its
// already-registered snapshot; it cannot generate IDs or query draft packs.
export function validateRegisteredPlaceables(snapshot) {
  if (!Array.isArray(snapshot)) throw TypeError('Runtime placeables must be an array');
  const seen = new Set();
  const result = snapshot.map((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry))
      throw TypeError('Malformed registered placeable at ' + index);
    const {id, name, category, kind, placementRules} = entry;
    if (!validId(id)) throw TypeError('Missing or invalid stable placeable ID at ' + index);
    const key = typeof id + ':' + id;
    if (seen.has(key)) throw Error('Duplicate registered placeable ID: ' + key);
    seen.add(key);
    if (entry.registered !== true || entry.placeable !== true || entry.scenicOnly === true)
      throw Error('Unregistered, non-placeable or scenic-only entry: ' + key);
    if (typeof name !== 'string' || !name.trim() ||
        typeof category !== 'string' || !category.trim() ||
        !['block', 'object'].includes(kind) ||
        !placementRules || typeof placementRules !== 'object' || Array.isArray(placementRules))
      throw TypeError('Incomplete placeable metadata: ' + key);
    return Object.freeze({...entry, placementRules: Object.freeze({...placementRules})});
  });
  return Object.freeze(result);
}
