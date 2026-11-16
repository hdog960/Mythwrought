import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {createM2ThirdVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
import {planUnplacedThirdRoofBearingRemediations} from '../../../src/building-pool/roadmap-3a/m2-third-roof-bearing-options.mjs';
const hash=b=>createHash('sha256').update(JSON.stringify(b.modules)).digest('hex');
test('all 156 source-derived third-variant roof gap coordinates have explicit uninstalled proposals while preserving previous geometry',()=>{
 const before=createM2ThirdVariantPool().map(b=>[b.id,hash(b)]);
 const a=planUnplacedThirdRoofBearingRemediations();
 assert.equal(a.originalThirdVariants,30);
 assert.equal(a.previousRoofSamplesWithoutBearingWitness,156);
 assert.equal(a.sourceDerivedUnplacedCandidateCount,156);
 assert.equal(a.actualRoofSourceModifications,0);
 assert.equal(a.physicalSupportsInstalled,0);
 assert.equal(a.originalBlacksmithLegacyDefectsStillOpen,30);
 assert.equal(a.structuralEngineeringApproved,false);
 assert.equal(a.unsupportedSamplesAfterApprovedRepair,156);
 for(const m of a.models)for(const p of m.unplacedOptions){
  assert.equal(p.sourceGeometryEdited,false);
  assert.equal(p.engineeringApproved,false);
  assert.equal(p.physicalFamilyMaterialProposal,'pack2:015');
  assert.ok(p.nearestAuthoredStructuralSource);
  assert.ok(Number.isFinite(p.horizontalSpanToExistingStructure));
  assert.ok(p.horizontalSpanToExistingStructure>5);
  assert.equal(p.candidateUnplacedBeam[1],p.roof[1]-1);
  assert.equal(p.resolution,'PENDING_CREATOR_AND_STRUCTURAL_REVIEW');
 }
 assert.deepEqual(createM2ThirdVariantPool().map(b=>[b.id,hash(b)]),before);
 const out=join(process.cwd(),'artifacts/building-roadmap-3a-m2-fourth');
 mkdirSync(out,{recursive:true});
 writeFileSync(join(out,'THIRD_ROOF_BEARING_OPTIONS.json'),JSON.stringify(a,null,2)+'\n');
 console.log('Builder 3A non-destructive 156 source roof bearing options: 0 installed, 156 remain unapproved');
});
