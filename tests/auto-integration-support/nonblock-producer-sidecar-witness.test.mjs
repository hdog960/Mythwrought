import test from 'node:test';
import assert from 'node:assert/strict';
import {auditProducerSidecar} from '../../src/auto-integration-support/nonblock-producer-sidecar-witness.mjs';
const provenance={verifiedByRunner:true,headSha:'a'.repeat(40),blobSha:'b'.repeat(40),path:'src/nonblock-scene48/nonblock-object-v1.mjs'};
test('fails closed without authenticated provenance',async()=>{assert.equal((await auditProducerSidecar({})).code,'SOURCE_NOT_AUTHENTICATED')});
test('rejects a declaration without source exports',async()=>{assert.equal((await auditProducerSidecar({producer:{},provenance})).code,'EXPORT_ABI_MISMATCH')});
test('rejects fake ABI version',async()=>{assert.equal((await auditProducerSidecar({producer:{NONBLOCK_OBJECT_VERSION:'wrong'},provenance})).code,'EXPORT_ABI_MISMATCH')});
test('rejects unsafe seed before running producer',async()=>{const producer={NONBLOCK_OBJECT_VERSION:'nonblock-object-v1',...Object.fromEntries(['describeNonblockObject','nonblockInstanceKey','createNonblockSidecar','pickNonblockRay'].map(k=>[k,()=>{}]))};assert.equal((await auditProducerSidecar({producer,provenance,seed:1.5})).code,'INVALID_SEED')});
test('source-provenance flag is never inferred from SHA strings',async()=>{assert.equal((await auditProducerSidecar({provenance:{...provenance,verifiedByRunner:false}})).code,'SOURCE_NOT_AUTHENTICATED')});
