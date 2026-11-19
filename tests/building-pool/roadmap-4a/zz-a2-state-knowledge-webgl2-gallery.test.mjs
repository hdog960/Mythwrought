import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:castle-palace:mountain:large:03","r4:castle-palace:enchanted-forest:medium:03","r4:castle-palace:desert:small:03","r4:embassy:temperate:large:03","r4:embassy:snow:medium:03","r4:embassy:mountain:small:03","r4:grand-archive:enchanted-forest:large:03","r4:grand-archive:mountain:medium:03","r4:grand-archive:desert:small:03","r4:observatory:snow:large:03","r4:observatory:temperate:medium:03","r4:observatory:enchanted-forest:small:03"];
test('A2: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(r.distinctScreenHashes>=70);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'9f0e648b648d586ecf2c49c1cf04dd73802676a8');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
