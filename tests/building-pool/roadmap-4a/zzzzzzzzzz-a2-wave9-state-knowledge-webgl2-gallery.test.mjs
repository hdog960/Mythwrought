import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave9-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:castle-palace:enchanted-forest:small:03","r4:castle-palace:mountain:medium:02","r4:embassy:temperate:medium:03","r4:embassy:desert:large:02","r4:embassy:snow:small:02","r4:embassy:mountain:medium:03","r4:grand-archive:temperate:large:02","r4:grand-archive:desert:medium:03","r4:grand-archive:snow:small:02","r4:observatory:temperate:small:02","r4:observatory:enchanted-forest:medium:01","r4:observatory:mountain:large:01"];
test('A2 ninth tranche: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.equal(r.distinctScreenHashes,72);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'117d51e0e6ab94ce1a6b5cc4ff827131da6f5c52');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
