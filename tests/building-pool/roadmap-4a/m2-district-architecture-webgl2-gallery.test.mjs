import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-district-architecture-webgl2-cdp-gallery.mjs';

test('eight newly authored biome-specific civic/guild 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,48);
 assert.ok(result.distinctScreenHashes>=46);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:temperate:large:03","r4:civic-hall:desert:large:03","r4:civic-hall:snow:medium:04","r4:civic-hall:enchanted-forest:medium:03","r4:guildhall:temperate:small:03","r4:guildhall:desert:small:03","r4:guildhall:snow:medium:02","r4:guildhall:mountain:small:03"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'ae655ce6aac9dc22f391b28970e49c75c9baa792');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
