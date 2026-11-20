import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {verifyStageEvidenceGroup} from '../../scripts/ci/verify-nonblock-evidence.mjs';
import {candidateFamilies} from '../../src/nonblock/candidate-families.mjs';
import {OWNED_FITTING_IDS} from '../../src/nonblock/physical-fittings.mjs';
import {EFFECT_IDS} from '../../src/nonblock/candidate-effects.mjs';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex');

test('all 96 roster slots have exactly one scenery, effect or source-owner identity',()=>{
  const ids=[...candidateFamilies.keys(),...OWNED_FITTING_IDS,...EFFECT_IDS];
  assert.deepEqual([candidateFamilies.size,OWNED_FITTING_IDS.length,EFFECT_IDS.length],[72,12,12]);
  assert.equal(new Set(ids).size,96);
});

test('coordinator checks actual PNG bytes and fails closed on source or artifact corruption',async()=>{
  const root=await mkdtemp(join(tmpdir(),'mythwrought-evidence-'));
  try{
    await mkdir(join(root,'artifacts/example'),{recursive:true});
    const source='shape-v1',path='artifacts/example/runtime.png';
    const image=await readFile('docs/nonblock-integration/gallery/banner-refined.png');
    await writeFile(join(root,'source.mjs'),source);
    await writeFile(join(root,path),image);
    const data={sources:{'source.mjs':digest(source)},captures:[
      {path,width:932,height:430,sha256:digest(image)}
    ]};
    await writeFile(join(root,'artifacts/example/manifest.json'),JSON.stringify(data));
    const result=await verifyStageEvidenceGroup(root,'example');
    assert.equal(result.screenshots.length,1);
    await writeFile(join(root,'source.mjs'),'unexpected source');
    await assert.rejects(()=>verifyStageEvidenceGroup(root,'example'),/source digest mismatch/);
    await writeFile(join(root,'source.mjs'),source);
    image[48]^=1;
    // Matching a modified file hash does not bypass the original chunk CRCs.
    data.captures[0].sha256=digest(image);
    await writeFile(join(root,path),image);
    await writeFile(join(root,'artifacts/example/manifest.json'),JSON.stringify(data));
    await assert.rejects(()=>verifyStageEvidenceGroup(root,'example'),/CRC mismatch/);
  }finally{
    await rm(root,{recursive:true,force:true});
  }
});
