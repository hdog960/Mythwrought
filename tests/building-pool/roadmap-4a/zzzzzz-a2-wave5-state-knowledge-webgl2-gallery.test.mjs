import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave5-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:castle-palace:temperate:small:02","r4:castle-palace:snow:medium:02","r4:castle-palace:enchanted-forest:large:03","r4:embassy:desert:large:01","r4:embassy:mountain:small:01","r4:embassy:enchanted-forest:medium:01","r4:grand-archive:desert:medium:01","r4:grand-archive:mountain:large:02","r4:grand-archive:snow:small:01","r4:observatory:temperate:large:01","r4:observatory:desert:small:01","r4:observatory:mountain:medium:01"];
test('A2 fifth tranche: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(r.distinctScreenHashes>=70);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'d3d155cd02ef0f596b93b6e8be5f75082fad18f1');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
