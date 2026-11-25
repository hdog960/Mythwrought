import test from 'node:test';import assert from 'node:assert/strict';
import {inspectSnapshotWorld,inspectM2WorldExport,exportM2World} from '../../src/manual-biomes/m2-runtime-bridge.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {importMountainV8IsolatedWorld} from '../../src/manual-biomes/mountain-v8-new-world-admission.mjs';
test('flat snapshots cannot bypass the profile import guard; verified profile remains exact',()=>{
 const w=new Pack2LiveWorld(new FourRegionWorld(20812,fourRegionProfile(20812,M8_MOUNTAIN_GENERATOR)));
 for(let id=500;id<=512;id++)assert.ok(w.set(id,-100,1,id));
 const raw=exportM2World(w);
 assert.equal(exportM2World(inspectSnapshotWorld(raw,20812)),raw);
 assert.throws(()=>inspectSnapshotWorld(JSON.stringify(w.save()),20812),/require verified profile/);
 assert.throws(()=>inspectSnapshotWorld(raw,20813),/seed mismatch/);
 assert.equal(exportM2World(inspectM2WorldExport(raw).world),raw);
});
test('unconfirmed or non-profile imports refuse before any storage access',async()=>{
 const storage={getItem(){throw Error('unexpected storage')}};
 await assert.rejects(importMountainV8IsolatedWorld('{}',{storage}),/confirmation/);
 await assert.rejects(importMountainV8IsolatedWorld(JSON.stringify({schema:1,seed:20812,edits:[]}),{storage,confirmed:true}),/Only a verified Mountain/);
});
