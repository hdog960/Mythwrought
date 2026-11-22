import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-guild-civic-webgl2-cdp-gallery.mjs';

test('eight newly authored biome-specific civic/guild 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,48);
 assert.ok(result.distinctScreenHashes>=46);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:temperate:small:05","r4:civic-hall:desert:medium:05","r4:civic-hall:snow:small:04","r4:civic-hall:mountain:large:04","r4:guildhall:temperate:large:03","r4:guildhall:enchanted-forest:medium:03","r4:guildhall:desert:small:04","r4:guildhall:snow:large:03"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'860c244bb9909abae79be7be0b4e4a2f86dc8b82');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
