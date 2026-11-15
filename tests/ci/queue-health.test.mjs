import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeRuns} from '../../scripts/ci/queue-health.mjs';
test('queue status monitoring does not confuse running with queued',()=>{
 const q=summarizeRuns([{status:'queued',created_at:'2026-11-15T19:00:00Z'},{status:'in_progress',created_at:'2026-11-15T19:00:00Z'},{status:'completed'}],Date.parse('2026-11-15T20:00:00Z'));
 assert.deepEqual(q,{sampled:3,queued:1,running:1,old:1,warning:false});
 assert.equal(summarizeRuns(Array.from({length:8},()=>({status:'queued'}))).warning,true);
});
