// Classification is intentionally fail-closed: anything outside the nine
// exclusive manual lanes runs the complete existing verification suite.
export const LANES = Object.freeze([
  'pack-1', 'pack-2', 'pack-3', 'pack-4', 'pack-5',
  'roadmap-1', 'roadmap-2', 'roadmap-3', 'roadmap-4',
]);

export function laneForPath(path) {
  if (typeof path !== 'string' || path.includes('\\') || path.includes('\n') ||
      path.split('/').some((segment) => segment === '' || segment === '.' || segment === '..')) return null;
  const block = /^(?:src|tests)\/block-packs\/(pack-[1-5])\/.+/.exec(path);
  if (block) return block[1];
  const building = /^(?:src|tests|docs)\/building-pool\/(roadmap-[1-4])\/.+/.exec(path);
  if (building) return building[1];
  return null;
}

export function classifyPaths(paths) {
  if (!Array.isArray(paths) || paths.length === 0) {
    return { mode: 'full', lanes: [], reason: 'empty-or-unavailable-diff' };
  }
  const owned = new Set();
  for (const path of paths) {
    const lane = laneForPath(path);
    if (!lane) return { mode: 'full', lanes: [], reason: 'shared-or-unrecognized-path' };
    owned.add(lane);
  }
  return {
    mode: 'isolated',
    lanes: LANES.filter((lane) => owned.has(lane)),
    reason: 'exclusive-lane-paths-only',
  };
}
