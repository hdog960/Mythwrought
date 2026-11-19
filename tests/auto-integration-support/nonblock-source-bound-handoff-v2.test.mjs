import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifySourceBoundHandoff} from '../../src/auto-integration-support/nonblock-source-bound-handoff-v2.mjs';
const s='a'.repeat(40);
const files={'src/nonblock-scene48/nonblock-object-v1.mjs':'export const a=1;',
'src/nonblock-environments24/v1-bridge.mjs':'export const b=1;',
'src/nonblock-environments24/v1-admission-policy.mjs':'export const c=1;',
'src/nonblock-fittings36/fittings-phase1.mjs':'export const d=1;',
'src/nonblock-fittings36/guarded-break-session.mjs':'export const e=1;'};
const make=()=>({contract:'nonblock-object-v1',mainHead:s,coreHead:s,productionEnabled:false,realRemovalEvidence:true,producers:Object.fromEntries(['48','24','36'].map(l=>[l,{head:s,files:Object.keys(files).filter(p=>p.startsWith('src/nonblock-'+({48:'scene48',24:'environments24',36:'fittings36'}[l])+'/')).map(path=>{const b=Buffer.from(files[path]);return {path,blobSha:createHash('sha1').update('blob '+b.length+'\\0'.replace('\\0','\0')).update(b).digest('hex')}})}]))});
test('fixture preflight is not live',()=>assert.deepEqual(verifySourceBoundHandoff(make(),files),{accepted:true,live:false,errors:[]}));
test('reject missing core identity',()=>{const m=make();delete m.coreHead;assert.equal(verifySourceBoundHandoff(m,files).accepted,false)});
test('reject no removal evidence',()=>{const m=make();m.realRemovalEvidence=false;assert.equal(verifySourceBoundHandoff(m,files).accepted,false)});
test('reject production enabled',()=>{const m=make();m.productionEnabled=true;assert.equal(verifySourceBoundHandoff(m,files).accepted,false)});
test('reject source tampering',()=>{const f={...files};f['src/nonblock-scene48/nonblock-object-v1.mjs']='tampered';assert.equal(verifySourceBoundHandoff(make(),f).accepted,false)});
test('reject missing family bridge',()=>{const m=make();m.producers['24'].files.pop();assert.equal(verifySourceBoundHandoff(m,files).accepted,false)});
test('reject wrong owner',()=>{const m=make();m.producers['36'].files[0].path='src/nonblock-scene48/nonblock-object-v1.mjs';assert.equal(verifySourceBoundHandoff(m,files).accepted,false)});
test('reject absent manifest',()=>assert.equal(verifySourceBoundHandoff(null,null).accepted,false));
