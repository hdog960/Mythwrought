import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m2-final-civic-guild-webgl2-cdp-gallery.mjs';

test('ten newly authored biome-specific civic/guild 4A civic/guild programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,60);
 assert.ok(result.distinctScreenHashes>=58);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:civic-hall:enchanted-forest:small:05","r4:civic-hall:enchanted-forest:large:05","r4:civic-hall:mountain:small:04","r4:civic-hall:mountain:small:05","r4:civic-hall:mountain:large:05","r4:guildhall:temperate:medium:03","r4:guildhall:snow:small:04","r4:guildhall:snow:medium:03","r4:guildhall:enchanted-forest:small:04","r4:guildhall:enchanted-forest:large:04"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'a28cb1ccd6eedc177aed43bc0145af45c313096d');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
