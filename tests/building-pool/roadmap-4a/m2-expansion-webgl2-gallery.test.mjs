import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-expansion-webgl2-cdp-gallery.mjs';

test('six original temperate/snow/forest/mountain 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:240000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,36);
 assert.ok(result.distinctScreenHashes>=35);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:temperate:medium:02","r4:civic-hall:snow:small:02","r4:civic-hall:enchanted-forest:small:02","r4:guildhall:temperate:medium:01","r4:guildhall:snow:medium:01","r4:guildhall:mountain:medium:01"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'07e37a38b87caf4173eb72bda40c824b0e5b104f');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
