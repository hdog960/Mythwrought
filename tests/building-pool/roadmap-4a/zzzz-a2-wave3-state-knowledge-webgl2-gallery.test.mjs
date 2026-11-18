import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './a2-wave3-state-knowledge-webgl2-cdp-gallery.mjs';
const expected=["r4:castle-palace:temperate:large:04","r4:castle-palace:desert:medium:04","r4:castle-palace:mountain:small:04","r4:embassy:snow:large:04","r4:embassy:temperate:small:04","r4:embassy:desert:medium:04","r4:grand-archive:snow:medium:04","r4:grand-archive:enchanted-forest:small:04","r4:grand-archive:mountain:large:04","r4:observatory:enchanted-forest:medium:04","r4:observatory:desert:large:04","r4:observatory:snow:small:04"];
test('A2 third tranche: twelve original 4A state/knowledge candidates render 72 genuine source-bound Chromium WebGL2 exterior/cutaway screenshots at all three iPhone landscape sizes',{timeout:450000},async()=>{
 const r=await runGallery();
 assert.equal(r.actualViews,72);assert.equal(r.distinctOutputNames,72);
 assert.equal(new Set(r.results.map(x=>x.name)).size,72);
 assert.deepEqual([...new Set(r.results.map(x=>x.id))],expected);
 assert.deepEqual([...new Set(r.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(r.distinctScreenHashes>=70);
 assert.ok(r.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(r.authoredGeneratorGitBlob,'a73db03f8a3f291d10cd4437a3a8b13e3e9d90b8');
 assert.equal(r.productionPhysicalFamilyRenderer,false);assert.equal(r.realIphoneTested,false);
 assert.equal(r.creatorArtApproved,false);assert.equal(r.integratedIntoGame,false);
});
