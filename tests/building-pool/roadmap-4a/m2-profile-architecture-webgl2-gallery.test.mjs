import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-profile-architecture-webgl2-cdp-gallery.mjs';

test('eight newly authored biome-specific civic/guild 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,48);
 assert.ok(result.distinctScreenHashes>=46);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:temperate:small:04","r4:civic-hall:desert:medium:04","r4:civic-hall:snow:medium:03","r4:civic-hall:mountain:small:03","r4:guildhall:temperate:medium:02","r4:guildhall:desert:medium:02","r4:guildhall:snow:large:02","r4:guildhall:mountain:large:02"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'cf0126cedecdd5f9bd116a52962a3a54d8543740');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
