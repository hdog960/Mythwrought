import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {snowS11ResearchOnlyMaterial41 as propose,
  ORIGINAL_SNOW41_BRANCH as original,
  RESEARCH_S11_WIND_SNOW41 as replacement,S11_MATERIAL_CONTRACT}
 from '../src/manual-biomes/snowy-s11-original-snow41-wind-contours.mjs';

test('true pinned Desert-main shader only changes EXACT original Snow material41',async()=>{
 const actual=await readFile('production-readonly/src/storybook-materials.mjs','utf8');
 const proposed=propose(actual);
 assert.notEqual(proposed,actual);
 assert.equal(proposed.replace(replacement,original),actual,
  'Every other original shader branch/line must match byte for byte');
 assert.equal(actual.split(original).length-1,1);
 assert.equal(proposed.split(replacement).length-1,1);
 assert.equal(proposed.split('else if(vMat==41)').length-1,1);
 assert.ok(proposed.includes('else if(vMat==42)'));
 assert.ok(proposed.includes('else if(vMat==40)'));
 assert.ok(proposed.includes('vMat==13||vMat==14'));
 assert.ok(proposed.includes('uArtQuality<.5'));
 assert.ok(proposed.includes('float fog=smoothstep'));
 assert.equal(S11_MATERIAL_CONTRACT.material,41);
 assert.equal(S11_MATERIAL_CONTRACT.originalMaterial0GlacierUnchanged,true);
 assert.equal(S11_MATERIAL_CONTRACT.noNewTexture,true);
 assert.equal(S11_MATERIAL_CONTRACT.noNewDrawCalls,true);
});
test('S11 broad, low-grid world UV contours refuse modifications and malformed source',async()=>{
 const old=await readFile('production-readonly/src/storybook-materials.mjs','utf8');
 assert.ok(replacement.includes('vUv.x*.14'));
 assert.ok(replacement.includes('vUv.x*.041'));
 assert.ok(replacement.includes('.006*(grit-.5)'));
 assert.equal(replacement.includes('floor(vUv*15'),false);
 assert.equal(replacement.includes('texture('),false);
 assert.equal(replacement.includes('discard'),false);
 assert.equal(replacement.includes('outColor'),false);
 for(const m of [
   '',old.replace(original,''),
   old.replace(original,original+original),
   old.replace('newDrawCalls:0','newDrawCalls:1'),
   old.replace('newTextures:0','newTextures:1')
 ])assert.throws(()=>propose(m),/exact ORIGINAL/);
 assert.equal(S11_MATERIAL_CONTRACT.unregisteredWorldProfile,true);
});
