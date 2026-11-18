import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave4-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:castle-palace:temperate:medium:03","r4:castle-palace:snow:small:02","r4:castle-palace:desert:large:02","r4:embassy:temperate:medium:02","r4:embassy:mountain:large:02","r4:embassy:enchanted-forest:medium:02","r4:grand-archive:temperate:small:02","r4:grand-archive:desert:medium:02","r4:grand-archive:snow:large:02","r4:observatory:mountain:small:02","r4:observatory:snow:medium:02","r4:observatory:enchanted-forest:large:02"];
test('A2 fourth tranche: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(r.distinctScreenHashes>=70);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'96b168cd2ae1e4dc3a4ab8d9df5592c9327b1b4b');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
