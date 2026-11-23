import test from 'node:test';
import assert from 'node:assert/strict';
import {previewStatusObservationSequence as project} from '../src/resonance/devices48/status-observation-sequence-v1.mjs';
const frame=(tick,missing=0)=>({worldId:'world',networkId:'net',tick,revision:tick,produced:4,used:4-missing,stored:2,requested:4,missing,canActuate:false});
const base=()=>({worldId:'world',networkId:'net',observations:[frame(1),frame(2,2),frame(3)]});
test('ordered transitions and immutable frames',()=>{const r=project(base());assert.equal(r.ok,true);assert.equal(r.transitions,2);assert.equal(r.deficitFrames,1);assert.equal(r.state,'POWER OK');assert.equal(r.canActuate,false);assert.ok(Object.isFrozen(r.frames));assert.ok(Object.isFrozen(r.frames[0]));});
test('one deficit frame',()=>assert.equal(project({...base(),observations:[frame(1,1)]}).state,'POWER LOW'));
test('32-frame bound accepted',()=>assert.equal(project({...base(),observations:Array.from({length:32},(_,i)=>frame(i))}).ok,true));
for(const [name,mutate] of [
 ['invalid identity',r=>r.worldId='bad id'],['empty',r=>r.observations=[]],['too many',r=>r.observations=Array.from({length:33},(_,i)=>frame(i))],['world mismatch',r=>r.observations[1].worldId='other'],['network mismatch',r=>r.observations[1].networkId='other'],['duplicate tick',r=>r.observations[1].tick=1],['reordered tick',r=>r.observations[2].tick=0],['revision regression',r=>r.observations[2].revision=0],['negative count',r=>r.observations[0].produced=-1],['fractional count',r=>r.observations[0].stored=0.5],['demand mismatch',r=>r.observations[1].used=4],['forged authority',r=>r.observations[0].canActuate=true],['missing authority',r=>delete r.observations[0].canActuate],['null observation',r=>r.observations[1]=null],['huge count',r=>r.observations[0].stored=1e12]
])test(name,()=>{const r=base();mutate(r);const o=project(r);assert.equal(o.ok,false);assert.equal(o.canActuate,false)});
