import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave12-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:embassy:snow:small:01","r4:embassy:enchanted-forest:small:03","r4:embassy:enchanted-forest:large:01","r4:embassy:mountain:small:02","r4:grand-archive:temperate:medium:03","r4:grand-archive:desert:small:01","r4:grand-archive:enchanted-forest:large:02","r4:grand-archive:mountain:small:02","r4:observatory:temperate:small:01","r4:observatory:desert:large:02","r4:observatory:snow:large:02","r4:observatory:mountain:medium:02"];
test('A2 twelfth tranche: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.equal(r.distinctScreenHashes,72);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'bbb15ab3619ab4f0a30927115d690e93b82ffa1e');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
