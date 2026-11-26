import assert from 'node:assert/strict';
import test from 'node:test';
import {createObservedNavigationReadout} from '../src/navigation00/navigation-observed-readout-adapter.mjs';
const player={x:12.2,y:-9,z:34.8,yaw:Math.PI/2};
test('readout remains observation-only without surface',()=>{const r=createObservedNavigationReadout({player});assert.equal(r.readout.depth,null);assert.equal(r.readout.direction,'E');assert.equal(r.source,'observed-player-frame');});
test('observed same-column elevation yields depth',()=>{const r=createObservedNavigationReadout({player,worldSeed:17,observedSurface:{x:12.9,z:34.1,y:4,worldSeed:17}});assert.equal(r.readout.depth,13);});
test('rejects other-column and other-seed observations',()=>{assert.throws(()=>createObservedNavigationReadout({player,observedSurface:{x:13,z:34,y:4}}));assert.throws(()=>createObservedNavigationReadout({player,worldSeed:7,observedSurface:{x:12,z:34,y:4,worldSeed:8}}));});
test('rejects malformed observations and timestamps',()=>{assert.throws(()=>createObservedNavigationReadout({player,observedSurface:{x:12,z:34,y:NaN}}));assert.throws(()=>createObservedNavigationReadout({player,observedAt:-1}));});
