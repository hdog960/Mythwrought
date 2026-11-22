// MYTHWROUGHT #291 — isolated near+far GPU / world-save publication barrier MODEL.
// This module cannot be imported into the live renderer: every dependency
// must be explicitly mock-only. It neither imports nor changes original GL,
// cave source, the WebGL error queue, game saves, or player physics.
// A production version requires C6 ownership approval and an independently
// proven native buffer rollback, durable storage and foreground draw gate.

const MOCK = '__mythwrought291MockOnly';
const goodId = x => typeof x === 'string' && x.length > 0 && x.length <= 256;
const validRevision = x => Number.isSafeInteger(x) && x >= 0;
const failed = (stage, reason, recovered = false) => Object.freeze({
  phase: recovered ? 'restored-mock' : 'blocked', stage,
  reason: String(reason), drawBlocked: !recovered,
  sourceOnly: true, liveIntegrationApproved: false,
  originalGlErrorPolicyUnchanged: true,
  nativeBufferRollbackProven: false,
  durableSaveAtomicityProven: false,
  originalGameIntegrationTested: false
});
// Never confuse a requested draw block with a verified native draw block.
const sealed = (report, actuallyBlocked) => Object.freeze({ ...report,
  drawBlocked: actuallyBlocked, requiresExternalRenderLoopStop: !actuallyBlocked
});
const success = Object.freeze({
  phase: 'committed-mock', drawBlocked: false, sourceOnly: true,
  liveIntegrationApproved: false, originalGlErrorPolicyUnchanged: true,
  nativeBufferRollbackProven: false, durableSaveAtomicityProven: false,
  originalGameIntegrationTested: false
});
const sync = (value, phase) => {
  if (value && typeof value.then === 'function')
    throw Error('291_BARRIER_ASYNC_NOT_ALLOWED_' + phase);
  return value;
};

export function createMockNearFarEditBarrier({world, near, far, storage, gate, context} = {}) {
  for (const [name, adapter, methods] of [
    ['world', world, ['capture','edit','restore','digest']],
    ['near', near, ['capture','stage','commit','restore','digest']],
    ['far', far, ['capture','stage','commit','restore','digest']],
    ['storage', storage, ['capture','commit','restore','digest']],
    ['gate', gate, ['block','unblock','isBlocked']],
    ['context', context, ['current']]
  ]) {
    if (adapter?.[MOCK] !== true ||
        methods.some(method => typeof adapter[method] !== 'function'))
      throw Error('291_BARRIER_MOCK_ONLY_' + name);
  }
  if (!goodId(world.id) || !goodId(context.id) ||
      !validRevision(world.revision) || !validRevision(context.generation))
    throw Error('291_BARRIER_INVALID_ORIGINAL_TOKEN');

  const token = Object.freeze({worldId:world.id, worldRevision:world.revision,
    contextId:context.id, contextGeneration:context.generation});
  let phase = 'created', result = null;
  const current = () => context.current() === true && context.id === token.contextId &&
    context.generation === token.contextGeneration && world.id === token.worldId;
  const blocked = () => gate.isBlocked() === true;
  const checkGate = () => {
    if (!blocked()) throw Error('291_BARRIER_DRAW_GATE_NOT_BLOCKED');
  };
  const getDigest = adapter => sync(adapter.digest(), 'digest');
  const capture = adapter => sync(adapter.capture(), 'capture');
  const verify = (adapter, before) => getDigest(adapter) === before;
  const guarded = (name, fn) => {
    checkGate();
    if (!current()) throw Error('291_BARRIER_CONTEXT_LOST_' + name);
    return sync(fn(), name);
  };
  function execute({cell, replacement} = {}) {
    if (phase !== 'created') throw Error('291_BARRIER_ALREADY_EXECUTED');
    phase = 'blocking';
    try { sync(gate.block(), 'block'); checkGate(); }
    catch (error) {
      phase='fatal-stop-required';
      result=sealed({...failed('gate', error),phase},blocked());
      return result;
    }
    const saved = {};
    const captured = [];
    let stage='capture';
    const rollback = reason => {
      // A failed edit is not safe to draw until EVERY original domain is
      // restored and checked. Losing the GL context forbids GPU restore.
      const errors=[];
      const ctx=current();
      for (const [name, adapter] of [['far',far],['near',near],['world',world],['storage',storage]]) {
        if (!captured.includes(name)) continue;
        if ((name==='far'||name==='near') && !ctx) {
          errors.push(name+':original-context-lost'); continue;
        }
        try {
          if (!blocked()) gate.block();
          checkGate();
          sync(adapter.restore(saved[name]), 'restore-'+name);
          if (!verify(adapter,saved[name].digest)) errors.push(name+':restore-mismatch');
        } catch (error) {errors.push(name+':'+String(error.message||error));}
      }
      if (errors.length) {
        // Even if a third-party reopened the gate, an unverified restore
        // must not claim recovery or publish stale buffers.
        try {gate.block();}catch(_error){}
        phase='blocked';
        result=sealed(failed(stage,reason+'; rollback='+errors.join('|')),blocked());
        return result;
      }
      try {
        checkGate();sync(gate.unblock(), 'restore-unblock');
        if (blocked()) throw Error('restored-scene-still-blocked');
      } catch (error) {
        phase='blocked';result=sealed(failed(stage,'restore-unblock-failed: '+error.message),blocked());
        return result;
      }
      phase='restored-mock';result=failed(stage,reason,true);return result;
    };
    try {
      if (!current()) throw Error('original-world-or-context-changed');
      if (!Array.isArray(cell) || cell.length!==3 || !cell.every(Number.isSafeInteger))
        throw Error('invalid-source-cell');
      if (!Number.isSafeInteger(replacement)) throw Error('invalid-block-id');
      for (const [name, adapter] of [['world',world],['near',near],['far',far],['storage',storage]]) {
        saved[name]=capture(adapter);
        if (!saved[name] || typeof saved[name].digest!=='string' ||
            getDigest(adapter)!==saved[name].digest)
          throw Error('unverified-original-'+name+'-snapshot');
        captured.push(name);
      }
      stage='edit';
      guarded(stage,()=>world.edit(cell,replacement));
      if (world.revision!==token.worldRevision+1)
        throw Error('world-revision-not-exactly-one-edit');
      stage='near-stage';guarded(stage,()=>near.stage({cell,revision:world.revision}));
      stage='far-stage';guarded(stage,()=>far.stage({cell,revision:world.revision}));
      stage='near-commit';guarded(stage,()=>near.commit());
      stage='far-commit';guarded(stage,()=>far.commit());
      // Saves happen LAST after native resource commit while the draw gate
      // is still held. On storage failure restore ALL four domains. The
      // mock cannot prove browser storage atomicity or iOS pagehide behavior.
      stage='save';
      const intended = guarded(stage,()=>world.digest());
      guarded(stage,()=>storage.commit(intended));
      if (storage.digest()!==intended) throw Error('persisted-save-digest-mismatch');
      stage='publish';
      checkGate();
      if (!current() || world.revision!==token.worldRevision+1 ||
          storage.digest()!==world.digest())
        throw Error('world-context-or-save-changed-before-publication');
      sync(gate.unblock(), 'publish-unblock');
      if (blocked()) throw Error('publish-draw-gate-still-closed');
      phase='committed-mock'; result=success;return result;
    } catch(error) {return rollback(String(error.message||error));}
  }
  return Object.freeze({execute,
    state:()=>Object.freeze({phase,drawBlocked:blocked(),token,
      sourceOnly:true,liveIntegrationApproved:false,
      originalGlErrorPolicyUnchanged:true,
      nativeBufferRollbackProven:false,
      durableSaveAtomicityProven:false})});
}
