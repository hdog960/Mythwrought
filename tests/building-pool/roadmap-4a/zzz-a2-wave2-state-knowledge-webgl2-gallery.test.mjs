import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave2-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:castle-palace:snow:medium:03","r4:castle-palace:temperate:small:03","r4:castle-palace:enchanted-forest:large:02","r4:embassy:enchanted-forest:large:03","r4:embassy:desert:small:03","r4:embassy:snow:small:03","r4:grand-archive:temperate:large:03","r4:grand-archive:snow:small:03","r4:grand-archive:mountain:small:03","r4:observatory:desert:medium:03","r4:observatory:mountain:large:03","r4:observatory:temperate:small:03"];
test('A2 second tranche: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(r.distinctScreenHashes>=70);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'36032f13b5581e8b9de3408e6aaf5307366b8b4f');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
