// Pack 4-only read-only registry and manifest contract tests.
// Native Node must execute this on the candidate branch.
// Does NOT import Pack 4 candidates into the live game registry.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BLOCK} from '../../../src/voxel.mjs';
import {PACK4_WINDOW_ASSETS} from '../../../src/block-packs/pack-4/windows.mjs';
import {PACK4_LIGHT_ASSETS} from '../../../src/block-packs/pack-4/lighting.mjs';
import {PACK4_FURNISHING_ASSETS} from '../../../src/block-packs/pack-4/furnishings.mjs';

const manifest=JSON.parse(readFileSync(new URL(
 '../../../src/block-packs/pack-4/manifest.json',import.meta.url),'utf8'));
const authored=[...PACK4_WINDOW_ASSETS,...PACK4_LIGHT_ASSETS,...PACK4_FURNISHING_ASSETS];
test('all manifest families are reserved exactly once and in Pack 4 ranges',()=>{
 assert.equal(manifest.entries.length,22);
 assert.equal(new Set(manifest.entries.map(x=>x.roster)).size,22);
 assert.deepEqual(manifest.reservedIdBand,[159,208]);
 assert.deepEqual(manifest.protectedIds,[0,1,2,3,4,5,6,7,8,255]);
 assert.equal(manifest.implementedCandidateFamilies,
  manifest.entries.filter(x=>x.status==='candidate').length);
});
test('each source candidate has exactly one matching manifest family and ID',()=>{
 const ids=authored.map(x=>x.id).sort((a,b)=>a-b);
 assert.deepEqual(ids,manifest.assignedIds);
 assert.equal(new Set(ids).size,ids.length);
 assert.equal(manifest.candidateVariants,authored.length);
 for(const a of authored){
  const entry=manifest.entries.find(x=>x.roster===a.roster);
  assert.ok(entry,'Missing roster '+a.roster);
  assert.equal(entry.status,'candidate');
  assert.ok(entry.blockIds.includes(a.id));
 }
 for(const e of manifest.entries){
  assert.equal(new Set(e.blockIds).size,e.blockIds.length);
  assert.ok(e.blockIds.every(id=>ids.includes(id)));
  if(e.status==='planned')assert.deepEqual(e.blockIds,[]);
 }
});
test('candidate IDs are distinct from protected live blocks and sentinel 255',()=>{
 const activeIDs=new Set(Object.values(BLOCK));
 const assigned=manifest.assignedIds;
 assert.ok(assigned.every(id=>Number.isInteger(id)&&id>=159&&id<=208));
 assert.ok(assigned.every(id=>!activeIDs.has(id)&&id!==255));
 assert.ok(manifest.protectedIds.every(id=>!assigned.includes(id)));
});
test('pack files and dependencies remain lane-specific and development-only',()=>{
 for(const p of manifest.sourceFiles)assert.ok(p.startsWith('src/block-packs/pack-4/'));
 for(const p of manifest.testFiles)assert.ok(p.startsWith('tests/block-packs/pack-4/'));
 assert.ok(manifest.productionState.includes('NOT IN LIVE GAME'));
 assert.ok(manifest.restrictions.noMainEdits);
 assert.ok(manifest.restrictions.noWorldPlacement);
 assert.ok(manifest.restrictions.noAutoMerge);
});
