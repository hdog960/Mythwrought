import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSourceAbi} from '../../src/auto-integration-support/nonblock-source-abi-gate.mjs';
const sha='a'.repeat(40),old='b'.repeat(40);
const sample=()=>({refs:{scene48:{head:sha},environment24:{head:old},fittings36:{head:old}},
 sources:{scene48:{path:'src/nonblock-scene48/nonblock-object-v1.mjs',blobSha:sha,text:'NONBLOCK_OBJECT_VERSION nonblockInstanceKey describeNonblockObject createNonblockSidecar'},
 environment24:{path:'src/nonblock-environments24/v1-bridge.mjs',blobSha:old,text:"export const COORDINATOR_SHA='"+sha+"'; exportEnvironmentV1 validateEnvironmentV1"},
 fittings36:{path:'src/nonblock-fittings36/guarded-break-session.mjs',blobSha:old,text:'createGuardedFittingSession inspectMount authorizeRemoval'}}});
test('source ABI preflight never certifies live integration',()=>{const r=auditSourceAbi(sample());assert.equal(r.ok,true);assert.equal(r.status,'SOURCE_ABI_PREFLIGHT_ONLY_NOT_LIVE');});
test('stale coordinator head fails closed',()=>{const x=sample();x.refs.scene48.head=old;assert.ok(auditSourceAbi(x).errors.includes('environment24:stale-coordinator-pin'));});
test('missing source bytes fail closed',()=>{const x=sample();delete x.sources.fittings36;assert.equal(auditSourceAbi(x).ok,false);});
test('wrong source path fails closed',()=>{const x=sample();x.sources.scene48.path='src/other.mjs';assert.equal(auditSourceAbi(x).ok,false);});
test('missing export fails closed',()=>{const x=sample();x.sources.environment24.text="export const COORDINATOR_SHA='"+sha+"'";assert.equal(auditSourceAbi(x).ok,false);});
test('production registration forbidden',()=>{const x=sample();x.productionRegistration=true;assert.equal(auditSourceAbi(x).ok,false);});
