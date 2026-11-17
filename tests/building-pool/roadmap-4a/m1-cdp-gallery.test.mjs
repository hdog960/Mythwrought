import test from 'node:test';
import assert from 'node:assert/strict';
import {runGallery} from './webgl2-cdp-gallery.mjs';

test('180 genuine source-driven Chromium WebGL2 candidate exterior/cutaway mobile landscape PNG proofs', {timeout:1200000},async()=>{
 const evidence=await runGallery();
 assert.equal(evidence.actualViews,180);
 assert.equal(evidence.expectedViews,180);
 assert.ok(evidence.distinctScreenHashes>=120);
 assert.ok(evidence.results.every(x=>x.drawCalls>0&&x.drawnTriangles>100&&x.pngSha256.length===64));
 assert.deepEqual([...new Set(evidence.results.map(x=>x.viewport.join('x')))],['667x375','844x390','932x430']);
 assert.equal(evidence.authoredGeneratorGitBlob,'14ecb6fcfbe5cfeea97976670d14afb93bc6fe45');
 assert.equal(evidence.productionPhysicalFamilyRenderer,false);
 assert.equal(evidence.realIphoneTested,false);
 assert.equal(evidence.integratedIntoGame,false);
});
