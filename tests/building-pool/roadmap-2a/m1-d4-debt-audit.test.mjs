import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {inspect2AD4FloorDebt,M1_D4_AUDIT_ALL} from '../../../src/building-pool/roadmap-2a/m1-d4-debt-audit.mjs';
test('source exact 86 building D4 ledger holds 269 inherited problematic pairs, 30 exact floorplates, zero new high overlaps',()=>{
 assert.equal(M1_D4_AUDIT_ALL.length,86);
 const actual=inspect2AD4FloorDebt();
 assert.equal(actual.sources,86);assert.equal(actual.protectedOriginals,74);
 assert.equal(actual.grandfatheredHighOverlapPairs,269);
 assert.equal(actual.exactMatchingFloorPairs,30);
 assert.equal(actual.affectedBuildings,55);
 assert.equal(actual.newHighOverlapPairs,0,'new candidate would add a D4 near-duplicate');
 assert.equal(actual.allHighOverlapPairs,269);
 assert.equal(actual.artisticallyDistinct,false);
 assert.equal(actual.productionIntegrated,false);
 const dir=join(process.cwd(),'artifacts','roadmap-2a-d4-source-debt');
 mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'all86-full-D4-source-floor-IoU.json'),JSON.stringify({
  commit:process.env.GITHUB_SHA??null,sourceOnly:true,allDesigns:actual.sources,
  inheritedOriginalSource15Unchanged:true,preExistingHighOverlapPairs:actual.grandfatheredHighOverlapPairs,
  preExistingExactFloorMatches:30,newViolationPairs:0,
  creatorApproved:false,physicalMeshCertified:false,integrated:false,
  collisions:actual.collisions
 },null,2)+'\n');
});
test('D4 ledger detects an intentionally counterfeited floorplan among the newly authored six',()=>{
 const originals=M1_D4_AUDIT_ALL,from=originals[16],target=originals[80];
 const fake={...target,voxels:from.voxels.map(v=>({...v})),id:target.id};
 const r=inspect2AD4FloorDebt([...originals.slice(0,80),fake,...originals.slice(81)]);
 assert(r.newHighOverlapPairs>0,'recolored clone silently bypassed D4 near duplicate gate');
});
