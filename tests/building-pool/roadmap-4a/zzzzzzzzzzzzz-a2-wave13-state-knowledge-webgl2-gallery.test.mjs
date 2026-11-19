import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave13-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:embassy:enchanted-forest:large:02","r4:grand-archive:enchanted-forest:medium:03","r4:grand-archive:mountain:medium:01","r4:observatory:desert:small:02","r4:observatory:enchanted-forest:small:02","r4:observatory:enchanted-forest:large:01","r4:observatory:mountain:medium:03"];
test('A2 Wave13 final seven original state/knowledge source candidates render 42 genuine Chromium WebGL2 exterior/cutaway screenshots across three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,42);assert.equal(r.distinctOutputNames,42);
 assert.equal(new Set(r.results.map(x=>x.name)).size,42);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.equal(r.distinctScreenHashes,42);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'55d5a5ccf5d51aba547ca0fd97d24744ded2e3a3');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
