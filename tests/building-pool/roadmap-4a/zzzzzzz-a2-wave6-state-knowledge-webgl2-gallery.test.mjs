import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave6-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:castle-palace:desert:medium:02","r4:castle-palace:snow:small:03","r4:castle-palace:mountain:large:02","r4:embassy:temperate:small:01","r4:embassy:snow:medium:01","r4:embassy:mountain:large:01","r4:grand-archive:desert:large:03","r4:grand-archive:enchanted-forest:small:02","r4:grand-archive:temperate:large:01","r4:observatory:snow:medium:01","r4:observatory:enchanted-forest:medium:02","r4:observatory:mountain:small:03"];
test('A2 sixth tranche: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.equal(r.distinctScreenHashes,72);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'0fcae15b0e47bb805638f9b845662685bf2d032e');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
