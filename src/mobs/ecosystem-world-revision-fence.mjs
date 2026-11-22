// Read-only revision boundary for isolated MobEngine source admission.
// Sample BEFORE any original roster/protection/voxel callback, not after it.
// This verifies an authoritative caller-provided revision; it cannot make a
// constant revision callback authoritative or detect write-and-revert ABA.
export function captureOriginalWorldRevision(world){
  if(typeof world?.revision!=='function')
    throw new TypeError('Original world edit revision is required');
  const revision=world.revision();
  if(!Number.isSafeInteger(revision)||revision<0)
    throw new TypeError('Invalid original world revision');
  return revision;
}

export function assertOriginalWorldRevisionUnchanged(world,revision){
  if(!Number.isSafeInteger(revision)||revision<0)
    throw new TypeError('Invalid original world revision baseline');
  if(captureOriginalWorldRevision(world)!==revision)
    throw new TypeError('Original world changed during regional poll');
  return true;
}
