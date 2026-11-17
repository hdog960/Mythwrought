import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './m3-state-knowledge-webgl2-cdp-gallery.mjs';

test('eleven independently source-authored castle/palace embassy archive observatory programs each render real WebGL2 exterior and cutaway at three mobile landscape sizes',{timeout:360000},async()=>{
 const result=await runGallery();
 assert.equal(result.actualViews,66);
 assert.equal(result.distinctOutputNames,66);
 assert.equal(new Set(result.results.map(x=>x.name)).size,66);
 assert.ok(result.results.every(x=>x.name.includes('-v'+x.id.split(':').at(-1)+'-')));
 assert.ok(result.distinctScreenHashes>=63);
 assert.deepEqual([...new Set(result.results.map(x=>x.id))],
  ["r4:castle-palace:temperate:medium:02","r4:castle-palace:snow:large:02","r4:embassy:desert:medium:01","r4:embassy:enchanted-forest:small:01","r4:grand-archive:mountain:large:01","r4:grand-archive:temperate:medium:01","r4:observatory:snow:small:01","r4:observatory:desert:large:01","r4:castle-palace:temperate:large:03","r4:embassy:mountain:medium:01","r4:grand-archive:snow:medium:01"]);
 assert.deepEqual([...new Set(result.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.ok(result.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.equal(result.authoredGeneratorGitBlob,'ce3ce3222e64eee85bc4060d2907440c2afc7d4c');
 assert.equal(result.realIphoneTested,false);
 assert.equal(result.productionPhysicalFamilyRenderer,false);
 assert.equal(result.creatorArtApproved,false);
});
