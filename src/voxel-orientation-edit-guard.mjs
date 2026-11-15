// Opt-in edit/orientation transaction seam. No live-world or schema-1 hookup.
// A host supplies its existing synchronous block reader and edit writer.
// Only successful, identity-changing edits invalidate orientation; callers can
// force invalidation for a same-ID replacement of a physically different shape.
import {cellKey} from './voxel-orientation-sidecar.mjs';

export function makeOrientationEditGuard({readBlock,writeBlock,sidecar}) {
  if(typeof readBlock!=='function'||typeof writeBlock!=='function'||
    !sidecar||typeof sidecar.clear!=='function'||typeof sidecar.get!=='function')
    throw new TypeError('Invalid orientation edit dependencies');
  let writing=false;
  function read(cell) {
    const id=readBlock(...cell);
    if(!Number.isSafeInteger(id)||id<0||id>255) throw new TypeError('Invalid world block');
    return id;
  }
  return Object.freeze({
    // No writer call on a rejected stale precondition. writeBlock must return
    // true on success; false means rejected without mutation. Throwing writers
    // must be atomic or roll themselves back before returning control.
    edit(cell,nextId,{expectedId,replaceSameId=false}={}) {
      cellKey(cell);
      if(!Number.isSafeInteger(nextId)||nextId<0||nextId>=255)
        throw new TypeError('Invalid replacement block');
      if(expectedId!==undefined&&(!Number.isSafeInteger(expectedId)||expectedId<0||expectedId>255))
        throw new TypeError('Invalid expected block');
      if(writing) throw new Error('Reentrant orientation edit');
      const before=read(cell);
      if(expectedId!==undefined&&before!==expectedId) return Object.freeze({applied:false,reason:'stale'});
      if(before===nextId&&!replaceSameId) return Object.freeze({applied:false,reason:'unchanged'});
      writing=true;
      try {
        const result=writeBlock(...cell,nextId);
        if(result!==true) return Object.freeze({applied:false,reason:'rejected'});
        // Fail closed if the host did not actually write the requested block.
        if(read(cell)!==nextId) throw new Error('Writer acknowledged an inconsistent block');
        sidecar.clear(cell);
        return Object.freeze({applied:true,previousId:before,nextId});
      } finally {writing=false;}
    },
    // For host-owned edits performed elsewhere: drop a stale rotation without
    // writing any world cell. Same-ID shape replacements must call clear().
    reconcile(cell,expectedId) {
      cellKey(cell);
      if(!Number.isSafeInteger(expectedId)||expectedId<1||expectedId>=255)
        throw new TypeError('Invalid expected block');
      if(read(cell)!==expectedId) {sidecar.clear(cell);return false;}
      return true;
    }
  });
}
