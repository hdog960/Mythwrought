import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-additional-webgl2-cdp-gallery.mjs';

test('two additional original 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:240000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,12);
 assert.ok(result.distinctScreenHashes>=10);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ['r4:civic-hall:desert:medium:02','r4:guildhall:mountain:small:01']);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'17a3ab83669445d394b32de65ff84046db11871c');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
