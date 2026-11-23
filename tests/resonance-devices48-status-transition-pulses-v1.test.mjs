import test from 'node:test';
import assert from 'node:assert/strict';
import {previewStatusTransitionPulses as preview} from '../src/resonance/devices48/status-transition-pulses-v1.mjs';
const f=(tick,missing=0)=>({worldId:'w',networkId:'n',tick,revision:tick,produced:5,used:5-missing,stored:2,requested:5,missing,canActuate:false});
const args=(...observations)=>({worldId:'w',networkId:'n',observations});
test('deterministic immutable transition-only pulses',()=>{const a=preview(args(f(1),f(2),f(3,2),f(4,2),f(5))),b=preview(args(f(1),f(2),f(3,2),f(4,2),f(5)));assert.deepEqual(a,b);assert.deepEqual(a.pulses.map(x=>x.kind),['initial-ok','shortage','recovery']);assert.deepEqual(a.pulses.map(x=>x.palette),['rune-blue','amber-gold','rune-blue']);assert.ok(Object.isFrozen(a.pulses));assert.ok(a.pulses.every(x=>Object.isFrozen(x)&&x.canActuate===false));assert.equal(a.rendererIntegrated,false);});
test('initial deficit',()=>assert.equal(preview(args(f(1,2))).pulses[0].kind,'initial-low'));
test('32 stable observations yield one pulse',()=>assert.equal(preview(args(...Array.from({length:32},(_,i)=>f(i)))).pulses.length,1));
test('exact budget accepted',()=>assert.equal(preview({...args(f(1),f(2,1),f(3)),maxPulses:3}).ok,true));
for(const [name,make] of [
 ['null',()=>null],['bad world',()=>({...args(f(1)),worldId:'other'})],['duplicate tick',()=>args(f(1),f(1))],['forged authority',()=>args({...f(1),canActuate:true})],['missing authority',()=>args((({canActuate,...rest})=>rest)(f(1)))],['bad demand',()=>args({...f(1),used:9})],['zero budget',()=>({...args(f(1)),maxPulses:0})],['fractional budget',()=>({...args(f(1)),maxPulses:1.5})],['oversize budget',()=>({...args(f(1)),maxPulses:33})],['too many observations',()=>args(...Array.from({length:33},(_,i)=>f(i)))],['budget overflow',()=>({...args(f(1),f(2,1),f(3)),maxPulses:2})],['cross-world',()=>args(f(1),{...f(2),worldId:'z'})]
])test(name,()=>{const r=preview(make());assert.equal(r.ok,false);assert.equal(r.canActuate,false)});
