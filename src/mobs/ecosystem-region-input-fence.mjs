// Freeze caller-supplied regional coordinates and observer for one source poll.
// Protection/residency/terrain callbacks must not silently rewrite a prepared
// natural-spawn region or player origin. No world or entity mutations here.
const axes=Object.freeze(['cx','cz','section','feet']);

export function captureOriginalRegionalInputs(region,observer){
  if(!region||!Array.isArray(observer)||observer.length!==3||
     !observer.every(Number.isFinite)||
     !['cx','cz','section'].every(key=>Number.isSafeInteger(region[key]))||
     !Number.isFinite(region.feet))
    throw new TypeError('Invalid original regional input snapshot');
  const frozenRegion=Object.freeze(Object.fromEntries(
    axes.map(key=>[key,region[key]])));
  return Object.freeze({
    region:frozenRegion,
    observer:Object.freeze([...observer])
  });
}

export function assertOriginalRegionalInputsUnchanged(captured,region,observer){
  if(!captured||!Object.isFrozen(captured)||
     !Object.isFrozen(captured.region)||
     !Object.isFrozen(captured.observer)||
     axes.some(key=>!Object.is(captured.region[key],region?.[key]))||
     !Array.isArray(observer)||observer.length!==3||
     captured.observer.some((value,i)=>!Object.is(value,observer[i])))
    throw new TypeError('Original regional source inputs changed during poll');
  return true;
}
