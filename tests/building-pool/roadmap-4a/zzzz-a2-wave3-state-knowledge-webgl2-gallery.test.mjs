import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave3-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:castle-palace:temperate:large:02","r4:castle-palace:desert:medium:03","r4:castle-palace:mountain:small:03","r4:embassy:snow:large:03","r4:embassy:temperate:small:03","r4:embassy:desert:medium:03","r4:grand-archive:snow:medium:03","r4:grand-archive:enchanted-forest:small:03","r4:grand-archive:mountain:large:03","r4:observatory:enchanted-forest:medium:03","r4:observatory:desert:large:03","r4:observatory:snow:small:03"];
test('A2 third tranche: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(r.distinctScreenHashes>=70);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'b2b3c508b75177d4bf56e10129fa197084799bb2');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
