// Mob-only edit epoch ledger. This DOES NOT install itself on the voxel world.
// A future, separately authorized world integration must report EVERY accepted
// source edit (voxel, Pack2 state, and other mutable collision overlays).
// Without complete writer coverage it cannot certify live game-world stability.
export function createMobSourceEditEpoch(initialRevision = 0) {
  if (!Number.isSafeInteger(initialRevision) || initialRevision < 0)
    throw new TypeError('Invalid initial mob source edit epoch');
  let epoch = initialRevision;
  function revision() { return epoch; }
  function recordAcceptedEdit(accepted) {
    if (typeof accepted !== 'boolean')
      throw new TypeError('Mob source edit outcome must be boolean');
    if (!accepted) return epoch;
    if (epoch === Number.MAX_SAFE_INTEGER)
      throw new RangeError('Mob source edit epoch exhausted');
    return ++epoch;
  }
  return Object.freeze({revision, recordAcceptedEdit});
}


// Collision-source invalidation, not a persisted edit counter. A successful
// in-memory write and its rollback BOTH invalidate an in-flight Mob read.
// Weak keys keep old worlds collectible; no save fields or geometry scans.
const sourceEpochs=new WeakMap();
export function markMobSourceMutation(owner){
  const next=(sourceEpochs.get(owner)??0)+1;
  if(!Number.isSafeInteger(next))throw new RangeError('Mob source epoch exhausted');
  sourceEpochs.set(owner,next);
}
export function createMobSourceRevision(world){
  if(!world||typeof world.get!=='function')throw new TypeError('Mob revision requires a readable world');
  const read=()=>[
    world.base,sourceEpochs.get(world)??0,sourceEpochs.get(world.base)??0,
    world.pack3Runtime,world.manual14Layer,world.manual14Collision,
    world.pack5Layer,world.pack5Collision,world.stagedNonblockCollision
  ];
  const ledger=createMobSourceEditEpoch();
  let last=read();
  return ()=>{
    const current=read();
    if(current.some((v,i)=>!Object.is(v,last[i]))){
      ledger.recordAcceptedEdit(true);
      last=current;
    }
    return ledger.revision();
  };
}
