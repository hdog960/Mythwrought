import test from 'node:test';
import assert from 'node:assert/strict';
import {auditTombstoneIdentity} from '../../src/auto-integration-support/nonblock-tombstone-matrix.mjs';
const objects=[{key:'scene48:a:1',seed:'s',selectable:true,breakable:true,persistent:true},{key:'nonblock:d:2',seed:'s',selectable:true,breakable:true,persistent:true}];
function fixture(items=objects){const tomb=new Set();return {instances:items,seed:'s',remove:k=>(tomb.add(k),true),reload:()=>({visibleKeys:items.map(x=>x.key).filter(k=>!tomb.has(k)),tombstones:[...tomb]})};}
test('isolated removal preserves tombstones and never certifies live',()=>{const r=auditTombstoneIdentity(fixture());assert.equal(r.ok,true);assert.equal(r.live,false);assert.equal(r.persistenceVerified,false);});
test('orientation suffix rejected',()=>{const f=fixture([{...objects[0],key:'scene48:a:1:r2'}]);assert.ok(auditTombstoneIdentity(f).errors.includes('noncanonical-key'));});
test('duplicate identity rejected',()=>assert.ok(auditTombstoneIdentity(fixture([objects[0],objects[0]])).errors.includes('duplicate-key')));
test('cross seed rejected',()=>assert.ok(auditTombstoneIdentity(fixture([{...objects[0],seed:'other'}])).errors.includes('seed-mismatch')));
test('missing hooks fail closed',()=>assert.ok(auditTombstoneIdentity({instances:objects,seed:'s'}).errors.includes('missing-external-hooks')));
test('unpersisted removal rejected',()=>{const f=fixture();f.reload=()=>({visibleKeys:objects.map(x=>x.key),tombstones:[]});assert.ok(auditTombstoneIdentity(f).errors.includes('tombstone-not-preserved'));});
test('missing break contract rejected',()=>assert.ok(auditTombstoneIdentity(fixture([{...objects[0],breakable:false}])).errors.includes('missing-lifecycle-contract')));
