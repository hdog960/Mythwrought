import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave8-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:castle-palace:snow:large:03","r4:castle-palace:enchanted-forest:medium:02","r4:castle-palace:mountain:small:02","r4:embassy:temperate:small:02","r4:embassy:desert:medium:02","r4:embassy:snow:large:02","r4:grand-archive:temperate:medium:02","r4:grand-archive:desert:small:02","r4:grand-archive:enchanted-forest:large:01","r4:observatory:temperate:medium:01","r4:observatory:snow:small:02","r4:observatory:enchanted-forest:large:03"];
test('A2 eighth tranche: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.equal(r.distinctScreenHashes,72);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'25b40b43e47896c9abc51322bf581fe2fe353b8e');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
