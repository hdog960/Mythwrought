import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {auditCoordinatorDrift} from '../../src/auto-integration-support/nonblock-coordinator-drift.mjs';
const head='a'.repeat(40), old='b'.repeat(40);
function file(text){const bytes=Buffer.from(text);return {text,head,blob:createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\\0'),bytes])).digest('hex')};}
const make=()=>{const coordinator=file("export const NONBLOCK_OBJECT_VERSION='nonblock-object-v1';");
const environment=file("export const TARGET_CONTRACT='nonblock-object-v1'; export const COORDINATOR_SHA='"+head+"';");
const fittings=file("export const CONTRACT='nonblock-object-v1'; export const CONTRACT_SOURCE_SHA='"+coordinator.blob+"';");
return {coordinator,environment,fittings,expectedHeads:{coordinator:head,environment:head,fittings:head}};};
test('matching declarations pass as non-live',()=>{const r=auditCoordinatorDrift(make());assert.equal(r.ok,true);assert.equal(r.live,false)});
test('environment coordinator drift fails closed',()=>{const x=make();x.environment.text=x.environment.text.replace(head,old);x.environment=file(x.environment.text);assert.match(auditCoordinatorDrift(x).errors.join(','),/coordinator HEAD drift/)});
test('fittings coordinator blob drift fails closed',()=>{const x=make();x.fittings=file(x.fittings.text.replace(x.coordinator.blob,old));assert.match(auditCoordinatorDrift(x).errors.join(','),/blob drift/)});
test('tampered bytes rejected',()=>{const x=make();x.coordinator.text+='tamper';assert.match(auditCoordinatorDrift(x).errors.join(','),/blob bytes mismatch/)});
test('stale HEAD rejected',()=>{const x=make();x.expectedHeads.coordinator=old;assert.match(auditCoordinatorDrift(x).errors.join(','),/stale producer HEAD/)});
test('version mismatch rejected',()=>{const x=make();x.environment=file(x.environment.text.replace('nonblock-object-v1','v2'));assert.match(auditCoordinatorDrift(x).errors.join(','),/contract version mismatch/)});
