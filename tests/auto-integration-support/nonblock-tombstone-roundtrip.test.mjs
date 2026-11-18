import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyTombstoneRoundtrip} from '../../src/auto-integration-support/nonblock-tombstone-roundtrip.mjs';
const sha='a'.repeat(40);
const proof={authenticated:true,':00':sha,':24':sha,':36':sha,':48':sha};
const objects=[{instanceKey:'nb1:scene36%3Aprop:1:0,0,0:0'},{instanceKey:'nb1:scene36%3Aprop:1:1,0,0:0'}];
function fixture(opts={}) { let removed=new Set(); return {instances:objects,sourceProof:proof,pick:x=>x.instanceKey,remove:k=>removed.add(k),serialize:()=>[...removed],restore:s=>{removed=new Set(s)},isVisible:k=>!removed.has(k),...opts}; }
test('isolated removal survives fixture restore and sibling remains',()=>{const r=verifyTombstoneRoundtrip(fixture());assert.equal(r.ok,true);assert.equal(r.status,'AUTHENTICATED_INPUT_FIXTURE_ONLY_NOT_SCHEMA1')});
test('fails closed without authenticated proof',()=>assert.deepEqual(verifyTombstoneRoundtrip(fixture({sourceProof:{}})).errors,['SOURCE_PROOF_MISSING']));
test('rejects duplicate identities',()=>assert.deepEqual(verifyTombstoneRoundtrip(fixture({instances:[objects[0],objects[0]]})).errors,['INVALID_OR_DUPLICATE_KEY']));
test('rejects missing callbacks',()=>assert.ok(verifyTombstoneRoundtrip(fixture({remove:null})).errors.includes('MISSING_CALLBACK')));
test('rejects lost tombstones on reload',()=>assert.ok(verifyTombstoneRoundtrip(fixture({serialize:()=>[]})).errors.includes('TOMBSTONE_LOST_ON_RESTORE')));
test('rejects incorrect pick',()=>assert.ok(verifyTombstoneRoundtrip(fixture({pick:()=>null})).errors.includes('PICK_MISMATCH')));
test('rejects removing unrelated object',()=>{const f=fixture();f.remove=()=>{};assert.ok(verifyTombstoneRoundtrip(f).errors.includes('REMOVE_FAILED'))});
