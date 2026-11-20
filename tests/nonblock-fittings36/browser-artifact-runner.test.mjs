import test from 'node:test';
import assert from 'node:assert/strict';
import {planFittingsBrowserArtifacts,runFittingsBrowserArtifacts} from '../../src/nonblock-fittings36/browser-artifact-runner.mjs';

test('60 unique filenames map five source scenes, three sizes and four stages',()=>{
 const p=planFittingsBrowserArtifacts();
 assert.equal(p.length,60);assert.equal(new Set(p.map(x=>x.filename)).size,60);
 assert.deepEqual([...new Set(p.map(x=>x.width+'x'+x.height))],['667x375','844x390','932x430']);
 for(const stage of ['visible','selected','removed','restored'])
  assert.equal(p.filter(x=>x.stage===stage).length,15);
});
test('runner fails closed without real browser document and external evidence sinks',()=>{
 assert.throws(()=>runFittingsBrowserArtifacts({}),/browser document/);
 assert.throws(()=>runFittingsBrowserArtifacts({documentRef:{createElement(){}}}),/callbacks/);
});
