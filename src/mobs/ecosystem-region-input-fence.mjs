// Freeze caller-supplied regional coordinates and observer for one source poll.
// Source callbacks must not rewrite an already-validated chunk, section, floor
// or observer. The read-only ticket is private to this module, not a birth.
const axes=Object.freeze(['cx','cz','section','feet']);
const certified=new WeakSet();

function unchanged(captured,region,observer){
  return axes.every(key=>Object.is(captured.region[key],region?.[key]))&&
    Array.isArray(observer)&&observer.length===3&&
    captured.observer.every((value,i)=>Object.is(value,observer[i]));
}

export function captureOriginalRegionalInputs(region,observer){
  if(!region||!Array.isArray(observer)||observer.length!==3)
    throw new TypeError('Invalid original regional input snapshot');
  // Snapshot before validation: validating caller getters and then reading
  // them AGAIN previously admitted a different region/observer as the source.
  const frozenRegion=Object.freeze(Object.fromEntries(
    axes.map(key=>[key,region[key]])));
  const frozenObserver=Object.freeze([...observer]);
  if(!['cx','cz','section'].every(key=>
      Number.isSafeInteger(frozenRegion[key]))||
     !Number.isFinite(frozenRegion.feet)||
     !frozenObserver.every(Number.isFinite))
    throw new TypeError('Invalid original regional input snapshot');
  const captured=Object.freeze({
    region:frozenRegion,observer:frozenObserver
  });
  // A getter may change its own later value or change an *other* field while
  // the frozen copy is being built. Never accept a moving input baseline.
  if(!unchanged(captured,region,observer))
    throw new TypeError('Original regional source inputs changed during capture');
  certified.add(captured);
  return captured;
}

export function assertOriginalRegionalInputsUnchanged(captured,region,observer){
  if(!captured||!certified.has(captured)||!unchanged(captured,region,observer))
    throw new TypeError('Original regional source inputs changed during poll');
  return true;
}

// Keep caller-owned source identities for the delayed original MobEngine
// admission audit. A prepared candidate is NOT an admission or an immutable
// guarantee that the live player/region have stayed put until settlement.
const settlementInputs=new WeakMap();

export function captureOriginalRegionalSettlementInputs(captured,region,observer){
  // A previously captured input certificate, rather than caller-supplied
  // forged coordinates, must own the transactional witness.
  assertOriginalRegionalInputsUnchanged(captured,region,observer);
  const witness=Object.freeze({});
  settlementInputs.set(witness,Object.freeze({captured,region,observer}));
  return witness;
}

export function assertOriginalRegionalSettlementInputsUnchanged(witness){
  const source=witness&&typeof witness==='object'?
    settlementInputs.get(witness):null;
  if(!source)
    throw new TypeError('Uncertified original regional settlement inputs');
  // Reject late observer movement or source region remapping before a
  // regional ticket claims a natural birth or advances a source cadence.
  return assertOriginalRegionalInputsUnchanged(
    source.captured,source.region,source.observer);
}
