import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-regional-courts-webgl2-cdp-gallery.mjs';

test('eight newly authored biome-specific civic/guild 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,48);
 assert.ok(result.distinctScreenHashes>=46);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:temperate:medium:05","r4:civic-hall:desert:large:04","r4:civic-hall:snow:medium:05","r4:civic-hall:enchanted-forest:small:04","r4:guildhall:temperate:small:04","r4:guildhall:desert:large:04","r4:guildhall:mountain:small:04","r4:guildhall:enchanted-forest:medium:04"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'a3964e449f7b9c51a85c7706146a2cfb9e5a9a3d');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
