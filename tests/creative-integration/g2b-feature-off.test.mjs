import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createG2FlightState,armG2Flight} from '../../src/creative-integration/g2-flight.mjs';
import {createG2ControlState,readG2ControlIntent} from '../../src/creative-integration/g2-control-state.mjs';
const main=readFileSync(new URL('../../src/main.mjs',import.meta.url),'utf8');
const html=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
test('G2B feature is OFF on initial boot, requires explicit user gesture',()=>{
 const s=createG2FlightState({position:{x:0,y:6,z:0},
  heightBounds:{minFeet:-210,maxFeet:20},worldToken:'seed:179'});
 assert.equal(s.mode,'off');
 assert.equal(armG2Flight(s,{enabled:false}).mode,'off');
 assert.equal(readG2ControlIntent(createG2ControlState()).forward,0);
 assert.ok(main.includes('g2Toggle.checked=false'));
 assert.ok(html.includes('type="checkbox" id="g2bFlightEnable"'));
});
test('G2B no G1 inventory activation or new flight save format',()=>{
 assert.ok(!main.includes("import {snapshot"));
 assert.ok(!main.includes("import './creative-integration/registry-snapshot.mjs'"));
 assert.ok(!main.includes("localStorage.setItem('mythwrought.g2b"));
 assert.ok(!main.includes('world.flight='));
});
test('G2B basic compatibility with saved-world loader is unchanged',()=>{
 assert.ok(main.includes('saveWorldSafe(localStorage,world)'));
 assert.ok(main.includes('savePack2LiveWorld(localStorage,world)'));
 assert.ok(main.includes("let world,storageReadOnly=false"));
 assert.ok(main.includes('if(storageReadOnly){'));
});
test('G2B source never creates independent mesh upload on flight',()=>{
 const start=main.indexOf('function g2Move(dt)');
 const end=main.indexOf('g2Toggle.checked=false',start);
 assert.ok(start>0&&end>start);
 const slice=main.slice(start,end);
 for(const banned of ['uploadPack2Chunk(', 'meshPlayableChunk(', 'gl.bufferData(', 'gl.drawArrays('])
   assert.ok(!slice.includes(banned),banned);
 assert.ok(slice.includes('pending.set(key,coords)'));
});
test('G2B disabled default retains ordinary movement and action bindings',()=>{
 assert.ok(main.includes('else{\n      const result=stepPlayer'));
 assert.ok(main.includes("bindGameplayAction('jump',jump)"));
 assert.ok(main.includes("bindGameplayAction('place',()=>edit('place'))"));
 assert.ok(main.includes('g2Active()'));
});
test('G2B rejects unsafe landing instead of enabling walking gravity',()=>{
 assert.ok(main.includes("if(!check.canLand){"));
 assert.ok(main.includes("if(!result.landed){"));
 assert.ok(main.includes("g2Controls=releaseG2ControlOwnership(g2Controls,{landed:true})"));
});
