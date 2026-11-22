import test from 'node:test';
import assert from 'node:assert/strict';
import {blobId,auditAuthenticatedBoundary} from '../../src/auto-integration-support/nonblock-authenticated-boundary.mjs';
const sources=()=>Object.fromEntries(Object.entries({scene48:'src/nonblock-scene48/a.mjs',environments24:'src/nonblock-environments24/b.mjs',fittings36:'src/nonblock-fittings36/c.mjs'}).map(([k,path])=>[k,{head:'a'.repeat(40),files:[{path,text:'export const x=1;',blob:blobId('export const x=1;')}]}]));
const objects=()=>[{owner:'scene48',key:'nb1:grass:1:0,0,0:0',seed:1,anchor:[0,0,0],selectionAabb:[0,0,0,1,1,1],pickable:true,breakable:true,removable:true,tombstoneKey:'nb1:grass:1:0,0,0:0'}];
const callbacks=()=>({pick(){},remove(){},snapshot(){},restore(){}});
const run=(mutate=()=>{})=>{const e={sources:sources(),objects:objects(),callbacks:callbacks()};mutate(e);return auditAuthenticatedBoundary(e);};
test('authenticated fixture passes but NEVER certifies live bridge',()=>{const r=run();assert.equal(r.ok,true);assert.equal(r.live,false);assert.equal(r.real00Verified,false);});
test('Git blob identity deterministic',()=>assert.equal(blobId('hello'),'b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0'));
for(const [name,mutate] of [
 ['missing producer',e=>delete e.sources.fittings36],
 ['altered bytes',e=>e.sources.scene48.files[0].text='tampered'],
 ['cross-owner file',e=>e.sources.environments24.files[0].path='src/nonblock-scene48/x.mjs'],
 ['duplicate identity',e=>e.objects.push({...e.objects[0]})],
 ['numeric block ID',e=>e.objects[0].numericBlockId=99],
 ['unbreakable scenery',e=>e.objects[0].breakable=false],
 ['bad bounds',e=>e.objects[0].selectionAabb=[0,0,0,0,1,1]],
 ['protected edit',e=>e.objects[0].protectedEdit=true],
 ['missing :00 callback',e=>delete e.callbacks.restore],
 ['default spawning',e=>e.objects[0].defaultSpawn=true],
 ['orphan effect',e=>e.objects[0].kind='fx'],
 ['overlapping anchors',e=>e.objects.push({...e.objects[0],key:'nb1:fern:1:0,0,0:0',tombstoneKey:'nb1:fern:1:0,0,0:0'})],
])test('fail closed: '+name,()=>assert.equal(run(mutate).ok,false));
