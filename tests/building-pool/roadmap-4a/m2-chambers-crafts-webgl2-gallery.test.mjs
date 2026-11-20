import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-chambers-crafts-webgl2-cdp-gallery.mjs';

test('eight newly authored biome-specific civic/guild 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,48);
 assert.ok(result.distinctScreenHashes>=46);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:temperate:large:05","r4:civic-hall:desert:small:05","r4:civic-hall:snow:large:05","r4:civic-hall:enchanted-forest:medium:05","r4:guildhall:temperate:medium:04","r4:guildhall:snow:medium:04","r4:guildhall:mountain:medium:04","r4:guildhall:enchanted-forest:small:03"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'b55739c8b5e822bf5c6cdce7acd8dbeb1169294b');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
