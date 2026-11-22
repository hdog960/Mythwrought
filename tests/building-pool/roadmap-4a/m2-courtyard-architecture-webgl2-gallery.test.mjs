import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-courtyard-architecture-webgl2-cdp-gallery.mjs';

test('eight newly authored biome-specific civic/guild 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,48);
 assert.ok(result.distinctScreenHashes>=46);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:temperate:medium:03","r4:civic-hall:desert:small:03","r4:civic-hall:snow:large:03","r4:civic-hall:enchanted-forest:small:03","r4:guildhall:temperate:large:02","r4:guildhall:desert:large:02","r4:guildhall:enchanted-forest:large:02","r4:guildhall:mountain:medium:02"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'affdc213f3e59e25aa1ce3b9f0260faa571defe3');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
