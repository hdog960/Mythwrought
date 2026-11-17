import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {planLegacyMountRepairOptions} from '../../../src/building-pool/roadmap-3a/legacy-mount-repair-options.mjs';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {geometryFingerprint} from '../../../src/building-pool/roadmap-3a/legacy-validation.mjs';
test('30 legacy mounts: 15 non-overlapping stone face candidates; 15 blocked hollow-flue supports',()=>{
 const originals=createLegacyBlacksmithPool(),before=new Map(originals.map(b=>[b.id,geometryFingerprint(b)]));
 const r=planLegacyMountRepairOptions();
 assert.equal(r.models,15);assert.equal(r.totalSupportBlockers,30);
 assert.equal(r.masonryFaceCandidates,15);
 assert.equal(r.hollowFlueConflicts,15);
 assert.equal(r.appliedModifications,0);assert.equal(r.buildable,false);assert.equal(r.releaseApproved,false);
 for(const x of r.options){
  assert.equal(x.proposals.length,2);
  const face=x.proposals.find(p=>p.forFamily==='pack4:064');
  const flue=x.proposals.find(p=>p.forFamily==='pack4:063');
  assert.ok(face.provisionalFeasible&&face.sourceCellFree&&face.clearPassage);
  assert.equal(face.assetProposal,'pack1:002');assert.equal(face.applied,false);
  assert.ok(flue.solidUnderChimneyBlocksFlue);
  assert.equal(flue.assetProposal,null);assert.equal(flue.applied,false);
 }
 for(const b of createLegacyBlacksmithPool())
  assert.equal(geometryFingerprint(b),before.get(b.id),'source-exact blacksmith geometry remains immutable');
 const out=join(process.cwd(),'artifacts/building-roadmap-3a-regional');
 mkdirSync(out,{recursive:true});
 writeFileSync(join(out,'BLACKSMITH_MOUNT_OPTIONS.json'),JSON.stringify(r,null,2)+'\n');
});
