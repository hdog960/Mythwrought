import test from 'node:test';
import assert from 'node:assert/strict';
import {gitBlobSha,attestProducerSources} from '../../src/auto-integration-support/nonblock-source-byte-attestation.mjs';
const sha='a'.repeat(40);
const text={
 scene48:"export const NONBLOCK_OBJECT_VERSION='nonblock-object-v1'; export function nonblockInstanceKey(){} export function describeNonblockObject(){} export function createNonblockSidecar(){}",
 environment24:"export const COORDINATOR_SHA='"+sha+"'; export function exportEnvironmentV1(){} export function validateEnvironmentV1(){}",
 fittings36:"export function createGuardedFittingSession({inspectMount,authorizeRemoval}){}"
};
const paths={scene48:'src/nonblock-scene48/nonblock-object-v1.mjs',environment24:'src/nonblock-environments24/v1-bridge.mjs',fittings36:'src/nonblock-fittings36/guarded-break-session.mjs'};
function fixture(){return {heads:{scene48:sha,environment24:'b'.repeat(40),fittings36:'c'.repeat(40)},sources:Object.fromEntries(Object.entries(text).map(([lane,source])=>[lane,{path:paths[lane],text:source,blobSha:gitBlobSha(source)}]))};}
test('git blob digest matches known git SHA',()=>assert.equal(gitBlobSha('hello'),'b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0'));
test('valid byte-attested source is not live acceptance',()=>{const r=attestProducerSources(fixture());assert.equal(r.ok,true);assert.equal(r.realPickBreakReloadVerified,false);});
test('source tampering fails closed',()=>{const f=fixture();f.sources.scene48.text+=' ';assert.ok(attestProducerSources(f).errors.includes('scene48:blob-mismatch'));});
test('stale coordinator pin fails closed',()=>{const f=fixture();f.heads.scene48='d'.repeat(40);assert.ok(attestProducerSources(f).errors.includes('environment24:stale-coordinator-pin'));});
test('missing source fails closed',()=>{const f=fixture();delete f.sources.fittings36;assert.ok(attestProducerSources(f).errors.includes('fittings36:missing-exact-source'));});
test('production registration forbidden',()=>assert.ok(attestProducerSources({...fixture(),productionRegistration:true}).errors.includes('production-registration-forbidden')));
test('invented blob SHA fails',()=>{const f=fixture();f.sources.environment24.blobSha='f'.repeat(40);assert.ok(attestProducerSources(f).errors.includes('environment24:blob-mismatch'));});
test('missing export fails even with matching blob',()=>{const f=fixture();f.sources.scene48.text=f.sources.scene48.text.replace('export function createNonblockSidecar','function createNonblockSidecar');f.sources.scene48.blobSha=gitBlobSha(f.sources.scene48.text);assert.ok(attestProducerSources(f).errors.includes('scene48:missing-export:createNonblockSidecar'));});
