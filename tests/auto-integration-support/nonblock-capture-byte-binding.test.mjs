import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyRemovalCaptureBundle as verify} from '../../src/auto-integration-support/nonblock-capture-byte-binding.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const png=(w,h,marker)=>{const b=Buffer.alloc(28+marker);Buffer.from('89504e470d0a1a0a','hex').copy(b);b.writeUInt32BE(w,16);b.writeUInt32BE(h,20);b[b.length-1]=marker;return b};
const stage=(phase,visible,tombstones,extra={})=>{const bytes=JSON.stringify({phase,seed:'seed',visible,tombstones,worldEditKeys:['edit'],...extra});return {phase,bytes,sha256:hash(bytes)}};
const fixture=()=>({seed:'seed',target:'nb1:a',stages:[
 stage('before',['nb1:a','nb1:b'],['nb1:old']),
 stage('picked',['nb1:a','nb1:b'],['nb1:old'],{pickedKey:'nb1:a'}),
 stage('removed',['nb1:b'],['nb1:old','nb1:a'],{saveSchema:1,saveSeed:'seed',backupPreserved:true}),
 stage('reloaded',['nb1:b'],['nb1:old','nb1:a'],{saveSchema:1,saveSeed:'seed',backupPreserved:true})
],captures:[[667,375],[844,390],[932,430]].map(([w,h],i)=>{const b=png(w,h,i+1);return {dimensions:w+'x'+h,bytesBase64:b.toString('base64'),sha256:hash(b)}})});
const replace=(x,i,fn)=>{const obj=JSON.parse(x.stages[i].bytes);fn(obj);x.stages[i]=stage(obj.phase,obj.visible,obj.tombstones,obj)};
test('complete byte-consistent fixture is only structural, never live',()=>{const r=verify(fixture());assert.equal(r.ok,true);assert.equal(r.live,false)});
test('rejects altered trace bytes',()=>{const x=fixture();x.stages[2].bytes+=' ';assert.equal(verify(x).ok,false)});
test('rejects false trace digest',()=>{const x=fixture();x.stages[0].sha256='a'.repeat(64);assert.equal(verify(x).ok,false)});
test('rejects wrong pick',()=>{const x=fixture();replace(x,1,o=>o.pickedKey='nb1:b');assert.equal(verify(x).ok,false)});
test('rejects neighbor removal',()=>{const x=fixture();replace(x,2,o=>o.visible=[]);assert.equal(verify(x).ok,false)});
test('rejects reload respawn',()=>{const x=fixture();replace(x,3,o=>o.visible.push('nb1:a'));assert.equal(verify(x).ok,false)});
test('rejects lost historical edits',()=>{const x=fixture();replace(x,3,o=>o.worldEditKeys=[]);assert.equal(verify(x).ok,false)});
test('rejects missing schema backup',()=>{const x=fixture();replace(x,3,o=>o.backupPreserved=false);assert.equal(verify(x).ok,false)});
test('rejects tampered PNG',()=>{const x=fixture();x.captures[0].bytesBase64=png(667,375,9).toString('base64');assert.equal(verify(x).ok,false)});
test('rejects wrong PNG dimensions',()=>{const x=fixture();const b=png(668,375,1);x.captures[0].bytesBase64=b.toString('base64');x.captures[0].sha256=hash(b);assert.equal(verify(x).ok,false)});
test('rejects duplicated capture',()=>{const x=fixture();x.captures[1]={...x.captures[0],dimensions:'844x390'};assert.equal(verify(x).ok,false)});
test('rejects missing screenshot bytes',()=>{const x=fixture();x.captures[2].bytesBase64='';assert.equal(verify(x).ok,false)});
