// PM2/PM3 isolated candidate. No live sources; fixture data cannot enter a world ledger.
import { SKILLS, getSkill } from './registry.mjs';
import { CANDIDATE_CURVE, calculateExperienceGain, experienceProgress } from './experience.mjs';
export const LEDGER_VERSION = 1;
export const RECEIPT_LIMIT = 4096; // prototype ceiling; never evict receipts to grant XP
const CURVE = 'pm-cubic-candidate-v1';
const cap = CANDIDATE_CURVE.at(-1);
const id = x => typeof x === 'string' && /^[a-zA-Z0-9:_./-]{1,96}$/.test(x);
const exact = (x, keys) => x !== null && typeof x === 'object' && !Array.isArray(x) &&
  Object.keys(x).length === keys.length && keys.every(k => Object.hasOwn(x,k));
const safeXp = x => Number.isSafeInteger(x) && x >= 0 && x <= cap;
const emptyXp = () => Object.fromEntries(SKILLS.map(s => [s.id,0]));
const key = (source, action) => source + '|' + action;
const deny = reason => Object.freeze({ok:false,reason});
function load(scope, snapshot) {
  const xp = emptyXp(), receipts = new Map();
  if (snapshot === undefined) return {xp,receipts};
  if (!exact(snapshot,['version','curve','scope','xp','receipts']) ||
      snapshot.version !== LEDGER_VERSION || snapshot.curve !== CURVE || snapshot.scope !== scope ||
      !exact(snapshot.xp,Object.keys(xp)) || !Array.isArray(snapshot.receipts) ||
      snapshot.receipts.length > RECEIPT_LIMIT) throw Error('Invalid ledger snapshot');
  for (const r of snapshot.receipts) {
    if (!exact(r,['source','action','skill','applied']) || !id(r.source) || !id(r.action) ||
        !getSkill(r.skill) || !safeXp(r.applied) || receipts.has(key(r.source,r.action)))
      throw Error('Invalid receipt');
    xp[r.skill] += r.applied;
    if (!safeXp(xp[r.skill])) throw Error('Receipt total exceeds cap');
    receipts.set(key(r.source,r.action),Object.freeze({...r}));
  }
  if (Object.keys(xp).some(k => xp[k] !== snapshot.xp[k])) throw Error('Receipt totals differ');
  return {xp,receipts};
}
// The host owns readContext and verifier closures. Never expose them or the ledger to UI events.
// This is local application integrity, not protection against a user editing JS or localStorage.
export function createExperienceLedger({scope, readContext, snapshot, fixtureRules=[]}={}) {
  if (!id(scope) || !/^(fixture|world):.+$/.test(scope) || typeof readContext !== 'function' ||
      !Array.isArray(fixtureRules)) throw Error('Invalid ledger host');
  const fixture = scope.startsWith('fixture:');
  if (!fixture && (fixtureRules.length || snapshot !== undefined)) throw Error('Live activation/restore not enabled');
  const {xp,receipts} = load(scope,snapshot), sources = new Map();
  let busy = false;
  function contextMatches() {
    const c = readContext();
    return c?.scope === scope && c.mode === 'survival' && c.writable === true;
  }
  for (const r of fixtureRules) {
    if (!exact(r,['source','skill','amount','verify']) || !id(r.source) || sources.has(r.source) ||
        !getSkill(r.skill) || !safeXp(r.amount) || r.amount === 0 || typeof r.verify !== 'function')
      throw Error('Invalid fixture rule');
    const {source,skill,amount,verify} = r;
    sources.set(source, evidence => {
      if (busy) return deny('reentrant');
      busy = true;
      try {
        if (!contextMatches()) return deny('context');
        // Canonical ID must be resolved by the trusted owner, not copied from arbitrary payloads.
        const action = verify(evidence);
        if (!id(action)) return deny('unverified');
        const k = key(source,action);
        if (receipts.has(k)) return deny('duplicate');
        if (receipts.size >= RECEIPT_LIMIT) return deny('receipt-capacity');
        const gain = calculateExperienceGain(xp[skill],amount);
        if (!contextMatches()) return deny('context');
        // No host callbacks between receipt and XP mutation.
        receipts.set(k,Object.freeze({source,action,skill,applied:gain.applied}));
        xp[skill] = gain.after.xp;
        return Object.freeze({ok:true,skill,action,gain});
      } catch { return deny('authority-error'); }
      finally { busy = false; }
    });
  }
  return Object.freeze({
    progress(skill) { return getSkill(skill) ? experienceProgress(xp[skill]) : null; },
    source(name) { return sources.get(name) ?? null; },
    snapshot() { return Object.freeze({version:LEDGER_VERSION,curve:CURVE,scope,
      xp:Object.freeze({...xp}),receipts:Object.freeze([...receipts.values()])}); },
  });
}
