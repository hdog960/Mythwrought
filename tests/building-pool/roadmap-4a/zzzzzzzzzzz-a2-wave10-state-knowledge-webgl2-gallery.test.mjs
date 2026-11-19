import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave10-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:embassy:temperate:large:01","r4:embassy:desert:small:02","r4:embassy:snow:medium:02","r4:embassy:mountain:large:03","r4:grand-archive:temperate:small:03","r4:grand-archive:desert:large:02","r4:grand-archive:snow:medium:02","r4:grand-archive:enchanted-forest:medium:01","r4:observatory:temperate:large:02","r4:observatory:desert:medium:02","r4:observatory:snow:large:01","r4:observatory:enchanted-forest:small:01"];
test('A2 tenth tranche: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.equal(r.distinctScreenHashes,72);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'953458320fbd6e1fdde4a83839304ea8c2ec843e');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
