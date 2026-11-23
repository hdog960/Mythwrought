// Snow S8: no live shader import or runtime mesh changes. Exact pinned
// source transform is tested as source text against actual post-Desert main.
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';
import {composeSnowS8NaturalDriftMaterial as drift,
  SNOW_S8_EXISTING_BRANCH as originalBranch,
  SNOW_S8_DRAFT_BRANCH as draftBranch,
  SNOW_S8_MATERIAL_TAG} from '../src/manual-biomes/snowy-s8-natural-drift-material-research.mjs';

test('a single original snow material branch changes; all original GLSL retained',async()=>{
 const source=await readFile('production-readonly/src/storybook-materials.mjs','utf8');
 const updated=drift(source);
 assert.equal(SNOW_S8_MATERIAL_TAG,41);
 assert.notEqual(source,updated);
 assert.equal(updated.replace(draftBranch,originalBranch),source);
 assert.equal(source.split(originalBranch).length-1,1);
 assert.equal(updated.split(draftBranch).length-1,1);
 for(const name of ['vMat==40','vMat==42','vMat==13','uArtQuality<.5',
     'uniform vec3 uFog','float hashCell','vec3 colored']){
   assert.ok(updated.includes(name),'Pinned original shader lost '+name);
 }
 assert.ok(draftBranch.includes('vUv.x*.115'));
 assert.ok(draftBranch.includes('.012*(grit-.5)'));
 assert.ok(!draftBranch.includes('texture('));
 assert.ok(!draftBranch.includes('discard'));
 assert.ok(!draftBranch.includes('gl_Frag'));
 assert.ok(!draftBranch.includes('hashCell('));
 assert.equal((updated.match(/vMat==41/g)||[]).length,1);
});
test('refuses modified, duplicate, missing or blank original shaders',async()=>{
 const original=await readFile('production-readonly/src/storybook-materials.mjs','utf8');
 for(const malformed of ['',original.replace(originalBranch,''),
   original+originalBranch,original.replace('vMat==41','vMat==44'),
   '<html>unknown</html>'])
   assert.throws(()=>drift(malformed),/exact pinned original/);
});
test('natural snow material shader is lower-frequency and isolated',async()=>{
 const original=await readFile('production-readonly/src/storybook-materials.mjs','utf8');
 const changed=drift(original);
 const start=changed.indexOf('else if(vMat==41){');
 const stop=changed.indexOf('else if(vMat==42)',start);
 assert.ok(start>0&&stop>start&&stop-start<500);
 const branch=changed.slice(start,stop);
 assert.ok(branch.includes('longDrift'));
 assert.ok(branch.includes('float longDrift=sin'));
 assert.ok(branch.includes('.012*(grit-.5)'));
 assert.equal(branch.includes('.065*(grit-.5)'),false);
 assert.equal(changed.includes("newDrawCalls:0"),true);
 assert.equal(changed.includes("newTextures:0"),true);
});
