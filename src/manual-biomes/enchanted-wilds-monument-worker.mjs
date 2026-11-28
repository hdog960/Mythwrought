// Detached worker for deterministic Wilds tile surveys. It returns plans and
// native route evidence as data for the caller's source acceptance checks.
import { WildsFamilyResearchWorld } from './enchanted-wilds-family-source.mjs';
import { surveyWildsMonumentTile } from './enchanted-wilds-monument-tiles.mjs';

let active = null;

function finish(job, state, details = {}) {
  if (active !== job) return;
  active = null;
  self.postMessage({ requestId: job.requestId, state, ...details });
}

function slice(job) {
  if (active !== job) return;
  try {
    const result = surveyWildsMonumentTile(job.world, job.tx, job.tz, { ids: job.ids, cursor: job.cursor, limit: 64 });
    job.probes += result.probes;
    if (result.state === 'pending') {
      job.cursor = result.cursor;
      setTimeout(() => slice(job), 0);
      return;
    }
    finish(job, result.state, { identity: result.identity, probes: job.probes,
      plan: result.entry?.plan, route: result.route });
  } catch (error) {
    finish(job, 'error', { message: error.message });
  }
}

self.addEventListener('message', ({ data }) => {
  const { type, requestId } = data ?? {};
  if (typeof requestId !== 'string' || !requestId) return;
  if (type === 'cancel') {
    if (active?.requestId === requestId) finish(active, 'cancelled');
    return;
  }
  if (type !== 'scan') return;
  if (active) finish(active, 'cancelled');
  const { seed, tx, tz, ids } = data;
  try {
    active = { requestId, world: new WildsFamilyResearchWorld(seed), tx, tz, ids, cursor: null, probes: 0 };
    const job = active;
    setTimeout(() => slice(job), 0);
  } catch (error) {
    self.postMessage({ requestId, state: 'error', message: error.message });
  }
});
