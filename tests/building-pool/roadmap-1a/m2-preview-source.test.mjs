import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m2-preview.html',import.meta.url),'utf8');
const js=readFileSync(new URL('./m2-preview.mjs',import.meta.url),'utf8');
const shader=readFileSync(new URL('./m2-preview-mesh.mjs',import.meta.url),'utf8');
test('M2 preview reads genuine 1A authored modules and unambiguously labels proxy WebGL2',()=>{
 for(const name of ['legacy-buildings.mjs','m1-inn-exemplars.mjs','m2-originals.mjs','m2-housing-tranche.mjs','m2-housing-wave2.mjs','m2-housing-wave3.mjs'])
  assert.ok(js.includes(name),name);
 assert.match(js,/getContext\('webgl2'/);
 assert.match(html,/source physical AABB mode/);
 assert.match(html,/id="geometry"/);
 assert.match(js,/makeM2SourceAABBMesh/);
 assert.match(shader,/physicalFamilyMeshesRendered:false/);
 assert.match(html,/id="blueprint"/);
 assert.match(html,/id="view"/);
 assert.doesNotMatch(html,/http[s]?:\/\/|iframe/);
});
