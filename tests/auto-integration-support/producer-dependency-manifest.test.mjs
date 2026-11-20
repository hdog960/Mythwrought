import test from 'node:test';
import assert from 'node:assert/strict';
import {validateProducerDependencyManifest} from '../../src/auto-integration-support/producer-dependency-manifest.mjs';
const sha='a'.repeat(40),digest='b'.repeat(64);
const make=()=>({producers:Object.fromEntries(['surface','caves','objects'].map((lane,i)=>[lane,{head:sha,pr:i+1,files:[{path:'src/'+lane+'/index.mjs',sha256:digest}]}]))});
test('valid pinned manifest never certifies integration',()=>{const r=validateProducerDependencyManifest(make());assert.equal(r.ok,true);assert.equal(r.integrationVerified,false);assert.equal(r.browserVerified,false);assert.equal(r.provenanceOnly,true);});
test('missing lane and missing digest fail closed',()=>{const m=make();delete m.producers.caves;m.producers.surface.files[0].sha256='';const r=validateProducerDependencyManifest(m);assert.equal(r.ok,false);assert.match(r.errors.join(' '),/caves: missing producer/);assert.match(r.errors.join(' '),/missing SHA-256/);});
test('unsafe path, duplicate file and invalid head fail',()=>{const m=make();m.producers.objects.head='not-a-commit';m.producers.objects.files=[{path:'../escape',sha256:digest},{path:'src/ok.mjs',sha256:digest},{path:'src/ok.mjs',sha256:digest}];const r=validateProducerDependencyManifest(m);assert.equal(r.ok,false);assert.match(r.errors.join(' '),/unsafe source path/);assert.match(r.errors.join(' '),/duplicate source path/);assert.match(r.errors.join(' '),/invalid exact commit/);});
test('self-certified browser evidence is rejected',()=>{const m=make();m.evidence={browserVerified:true};assert.equal(validateProducerDependencyManifest(m).ok,false);});
