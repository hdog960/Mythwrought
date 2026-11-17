import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-silhouettes-webgl2-cdp-gallery.mjs';

test('eight newly authored biome-specific civic/guild 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,48);
 assert.ok(result.distinctScreenHashes>=46);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:temperate:small:03","r4:civic-hall:desert:large:02","r4:civic-hall:snow:small:03","r4:civic-hall:mountain:medium:03","r4:guildhall:desert:small:02","r4:guildhall:snow:large:01","r4:guildhall:enchanted-forest:medium:02","r4:guildhall:mountain:small:02"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'ee4886e188b0139704dde1ee339ad9c4f61c9a7b');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
