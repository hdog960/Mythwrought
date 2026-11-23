import test from 'node:test';
import assert from 'node:assert/strict';
import {VIEWPORTS48,admitResonanceHud48} from '../src/resonance/devices48/viewport-admission-v1.mjs';
const panel={x:220,y:8,width:220,height:40};
for(const viewport of VIEWPORTS48){
 test(`valid bounded preview ${viewport.width}`,()=>{const r=admitResonanceHud48({viewport,panel,reservedRects:[{x:0,y:280,width:120,height:90}],revision:1});assert.equal(r.admitted,true);assert.equal(r.authority,'display-only');assert.ok(Object.isFrozen(r));});
 test(`collision rejected ${viewport.width}`,()=>{const r=admitResonanceHud48({viewport,panel,reservedRects:[{...panel}],revision:2});assert.deepEqual(r.blockers,[0]);assert.equal(r.admitted,false);});
}
test('unsupported viewport rejected',()=>assert.throws(()=>admitResonanceHud48({viewport:{width:900,height:400},panel,reservedRects:[],revision:0}),/unsupported/));
test('out-of-bounds rejected',()=>assert.throws(()=>admitResonanceHud48({viewport:VIEWPORTS48[0],panel:{x:650,y:0,width:30,height:40},reservedRects:[],revision:0}),/rectangle/));
test('negative revision rejected',()=>assert.throws(()=>admitResonanceHud48({viewport:VIEWPORTS48[0],panel,reservedRects:[],revision:-1}),/revision/));
test('too many reservations rejected',()=>assert.throws(()=>admitResonanceHud48({viewport:VIEWPORTS48[0],panel,reservedRects:Array(33).fill(panel),revision:0}),/reservations/));
test('touching edges are not overlap',()=>{const r=admitResonanceHud48({viewport:VIEWPORTS48[0],panel,reservedRects:[{x:440,y:8,width:20,height:40}],revision:0});assert.equal(r.admitted,true)});
test('stable deterministic order',()=>{const args={viewport:VIEWPORTS48[0],panel,reservedRects:[panel,{x:0,y:0,width:20,height:20},panel],revision:7};assert.deepEqual(admitResonanceHud48(args).blockers,[0,2]);});
