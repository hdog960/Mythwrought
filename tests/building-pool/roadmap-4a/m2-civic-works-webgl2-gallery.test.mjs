import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-civic-works-webgl2-cdp-gallery.mjs';

test('eight newly authored biome-specific civic/guild 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,48);
 assert.ok(result.distinctScreenHashes>=46);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:enchanted-forest:large:03","r4:civic-hall:mountain:large:03","r4:civic-hall:snow:large:04","r4:civic-hall:temperate:medium:04","r4:guildhall:enchanted-forest:small:02","r4:guildhall:snow:small:02","r4:guildhall:desert:large:03","r4:guildhall:mountain:medium:03"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'a1c2453dcbee7d7b35adb45cbfd12efe0620920c');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
