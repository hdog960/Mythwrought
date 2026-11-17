import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m3-state-knowledge-webgl2-cdp-gallery.mjs';

test('fourteen independently source-authored castle/palace embassy archive observatory programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,84);
 assert.equal(result.distinctOutputNames,84);
 assert.equal(new Set(result.results.map(x=>x.name)).size,84);
 assert.ok(result.results.every(x=>x.name.includes('-v'+x.id.split(':').at(-1)+'-')));
 assert.ok(result.distinctScreenHashes>=81);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:castle-palace:temperate:medium:02","r4:castle-palace:snow:large:02","r4:embassy:desert:medium:01","r4:embassy:enchanted-forest:small:01","r4:grand-archive:mountain:large:01","r4:grand-archive:temperate:medium:01","r4:observatory:snow:small:01","r4:observatory:desert:large:01","r4:castle-palace:temperate:large:03","r4:embassy:mountain:medium:01","r4:grand-archive:snow:medium:01","r4:castle-palace:desert:small:01","r4:embassy:snow:large:01","r4:grand-archive:desert:large:01"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'878d2242ba996bc8125057d6179a637db9422f6d');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
