import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-regional-webgl2-cdp-gallery.mjs';

test('four original snow/forest/desert/mountain 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:240000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,24);
 assert.ok(result.distinctScreenHashes>=22);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:snow:medium:02","r4:guildhall:enchanted-forest:medium:01","r4:guildhall:desert:small:01","r4:civic-hall:mountain:medium:02"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'0906c749c481533950c037e6da9792362fa73ba8');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
