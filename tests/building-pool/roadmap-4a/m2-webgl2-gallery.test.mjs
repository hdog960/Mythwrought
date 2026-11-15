import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-webgl2-cdp-gallery.mjs';

test('M2 original civic and guildhall source-authentic Chromium WebGL2 exteriors and cutaways at 3 landscape sizes', {timeout:240000}, async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,12);
 assert.equal(result.expectedViews,12);
 assert.ok(result.distinctScreenHashes>=10);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ['r4:civic-hall:temperate:small:02','r4:guildhall:temperate:small:01']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'bb3a641ea75beaa1a01bb19def41eceda7b6b3e1');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
