import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {ROADMAP_A_VISUAL19_LEAN_ALTERNATIVES,ROADMAP_A_VISUAL19_LEAN_BASES,ROADMAP_A_VISUAL19_HEAVY_ALTERNATIVES} from '../../../src/building-pool/roadmap-2a/roadmap-a-silhouette-lean.mjs';
const gallery=fileURLToPath(new URL('./roadmap-a-visual19-lean-gallery.mjs',import.meta.url));
const html=fileURLToPath(new URL('./roadmap-a-visual19-lean-gallery.html',import.meta.url));
test('Roadmap A lean Chromium gallery binds actual lean source instead of undefined heavy study alias',()=>{
 const src=readFileSync(gallery,'utf8'),markup=readFileSync(html,'utf8');
 assert.match(src,/import \{ROADMAP_A_VISUAL19_LEAN_ALTERNATIVES\} from '\.\.\/\.\.\/\.\.\/src\/building-pool\/roadmap-2a\/roadmap-a-silhouette-lean\.mjs'/);
 assert.match(src,/const designs=\[\.\.\.ROADMAP_A_VISUAL19_LEAN_ALTERNATIVES\]/);
 assert.doesNotMatch(src,/const designs=\[\.\.\.ROADMAP_A_VISUAL19_ALTERNATIVES\]/,'Undefined variable would abort browser before page ready');
 assert.match(src,/window\.__MW2A_GALLERY=\{ready:true,skylineRevision:b\.sourceVisualRevision/);
 assert.match(markup,/src="\.\/roadmap-a-visual19-lean-gallery\.mjs"/);
 assert.equal(ROADMAP_A_VISUAL19_LEAN_ALTERNATIVES.length,19);
 assert.equal(ROADMAP_A_VISUAL19_LEAN_BASES.length,19);
 assert.equal(ROADMAP_A_VISUAL19_HEAVY_ALTERNATIVES.length,19);
 let heavyCells=0,leanCells=0;
 for(let i=0;i<19;i++){
   const base=ROADMAP_A_VISUAL19_LEAN_BASES[i],lean=ROADMAP_A_VISUAL19_LEAN_ALTERNATIVES[i],heavy=ROADMAP_A_VISUAL19_HEAVY_ALTERNATIVES[i];
   assert.equal(base.id,lean.id);
   assert.equal(base.id,heavy.id);
   assert.equal(lean.sourceVisualRevision.actualGPUCostAccepted,false);
   assert.equal(lean.sourceVisualRevision.creatorVisualApproval,false);
   heavyCells+=heavy.voxels.length-base.voxels.length;
   leanCells+=lean.voxels.length-base.voxels.length;
 }
 assert.equal(heavyCells,24015);
 assert.equal(leanCells,10987);
});
