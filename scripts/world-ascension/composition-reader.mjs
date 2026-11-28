// A read-only proof wrapper for the released generator. The region and cave
// source choices are explicit so they can be shared by Node and the loopback game.
export function openCompositionSurfaces(current, terrainHeight, {
  sands, frost, frostProfile, ponds, wilds, wildsProfile, peaks
}) {
  const { seed } = current;
  function historicalSurface(module) {
    return new module.FourRegionWorld(seed, module.fourRegionProfile(seed, module.M8_MOUNTAIN_GENERATOR));
  }
  const Desert = sands.createRestoredDesertResearchWorld(current.constructor, terrainHeight);
  const snow = new frost.FrostboundSixRegionsCandidate(seed), pond = ponds.surveyMirrorfrostPond(snow, 142, 322);
  if (pond?.ice.length !== 57) throw Error('Mirrorfrost composition witness changed');
  const frozen = ponds.openMirrorfrostPondWitness(snow, pond);
  const mountain = new peaks.ShatteredPeaksStrataWorld(seed);
  return { pond, frozen, surfaceSources: {
    desert: { candidate: new Desert(seed, current.generationProfile), original: current },
    snow: { candidate: frozen, original: historicalSurface(frostProfile) },
    enchanted: { candidate: new wilds.WildsFamilyResearchWorld(seed), original: historicalSurface(wildsProfile) },
    mountain: { candidate: mountain, original: { get: (...point) => mountain.originalNatural(...point) } }
  } };
}

export function openCompositionReader({
  current, surfaceSources, pond, frozen, cuts, v6BiomeAt, worldKey, legacyCeiling, air
}) {
  const conflicts = new Set();
  function read(x, y, z) {
    const value = current.get(x, y, z), key = worldKey(x, y, z);
    if (current.edits.has(key)) return value;
    if (y < 0) return cuts.has(key) ? air : value;
    if (y > legacyCeiling && value !== air) return value;
    if (current.environmentCaves.get(x, y, z) !== undefined) return value;
    const source = surfaceSources[v6BiomeAt(x, z, current.seed)?.name];
    if (!source) return value;
    const candidate = source.candidate.get(x, y, z);
    if (candidate === value) return value;
    if (source.original.get(x, y, z) !== value) {
      conflicts.add(key);
      return value;
    }
    return candidate;
  }
  const pondCells = new Set(pond.water.map(point => worldKey(...point)));
  const upperSources = Object.values(surfaceSources).map(source => source.candidate)
    .filter(source => typeof source.upperNaturalOccupied === 'function');
  const fixture = Object.create(current, {
    get: { value: read },
    naturalAndLandmarkBlock: { value: read },
    upperNaturalOccupied: { value: key => current.upperNaturalOccupied(key) ||
      upperSources.some(source => source.upperNaturalOccupied(key)) },
    upperNaturalRevision: { value: current.upperNaturalRevision },
    upperSourceProfile: { value: current.upperSourceProfile },
    upperSupportedCells: { value: (...point) => current.upperSupportedCells(...point) },
    environmentWaterState: { value(x, y, z) {
      if (pondCells.has(worldKey(x, y, z)) && read(x, y, z) === 76) return frozen.environmentWaterState(x, y, z);
      return current.environmentWaterState(x, y, z);
    } },
    environmentOasisWaterEntries: { value(cx, cz) {
      return [...current.environmentOasisWaterEntries(cx, cz), ...frozen.environmentOasisWaterEntries(cx, cz)
        .filter(([key]) => pondCells.has(key) && read(...key.split(',').map(Number)) === 76)];
    } },
    set: { value() { throw Error('World Ascension source fixture is read-only'); } },
    save: { value() { throw Error('World Ascension source fixture has no durable world profile'); } }
  });
  return { fixture, conflicts };
}
