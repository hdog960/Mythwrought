import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-frontier-districts-webgl2-cdp-gallery.mjs';

test('eight newly authored biome-specific civic/guild 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,48);
 assert.ok(result.distinctScreenHashes>=46);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:desert:large:05","r4:civic-hall:snow:small:05","r4:civic-hall:enchanted-forest:large:04","r4:civic-hall:mountain:medium:05","r4:guildhall:temperate:large:04","r4:guildhall:desert:medium:04","r4:guildhall:snow:large:04","r4:guildhall:mountain:large:04"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'f36c85f657a6a523858249502d5d3d743cab3069');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
