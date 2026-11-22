// Detached M7 source-test guard. This observes actual Schema-1 + Pack 2
// serialized state, but does NOT replace a production edit-revision counter.
// In particular, changes made and undone between reads cannot be detected.
function snapshot(world){
  if(typeof world?.save!=='function'||
     typeof world?.pack2Snapshot!=='function')
    throw new TypeError('Original M7 save and Pack2 snapshot required');
  const base=world.save(),overlay=world.pack2Snapshot();
  if(base?.schema!==1||!Array.isArray(base.edits)||
     overlay?.kind!=='mythwrought-pack2-overlay'||overlay.version!==1||
     !Array.isArray(overlay.cells)||overlay.seed!==base.seed)
    throw new TypeError('Invalid original M7 source snapshot');
  const serial=JSON.stringify([base,overlay]);
  if(typeof serial!=='string')
    throw new TypeError('Unserializable original M7 source snapshot');
  return serial;
}

export function createM7SourceMutationWitness(world){
  let previous=snapshot(world),counter=0;
  function revision(){
    const next=snapshot(world);
    if(next!==previous){
      if(counter===Number.MAX_SAFE_INTEGER)
        throw new TypeError('Original M7 mutation witness exhausted');
      previous=next;
      counter++;
    }
    return counter;
  }
  return Object.freeze({
    revision,
    assertUnchanged(){
      if(revision()!==0)
        throw new TypeError('Original M7 research world was edited');
      return true;
    }
  });
}
