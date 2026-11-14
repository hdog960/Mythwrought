import test from 'node:test';
import assert from 'node:assert/strict';
import {allM1} from '../../../src/building-pool/roadmap-4/m1-blueprints.mjs';
import {candidatePreviewShape,candidatePreviewShapeCensus} from '../../../src/building-pool/roadmap-4/m1-preview-shapes.mjs';
const b=allM1();
const peek=(asset,facing='north')=>candidatePreviewShape({asset,facing,role:'fixture'});

test('source-referenced physical candidate box geometry is finite and inside unit-cell bounds',()=>{
  let checked=0;
  for(const design of b)for(const cell of design.cells){
    const {boxes}=candidatePreviewShape(cell);
    assert.ok(boxes.length>=1,design.id);
    for(const [x,y,z,X,Y,Z] of boxes){
      assert.ok([x,y,z,X,Y,Z].every(Number.isFinite),design.id);
      assert.ok(x>=0&&y>=0&&z>=0&&X<=1&&Y<=1&&Z<=1,design.id);
      assert.ok(x<X&&y<Y&&z<Z,design.id);
    }
    checked++;
  }
  assert.equal(checked,129484);
});

test('every Pack 3 regional roof uses its exact source-like ceramic/slate/thatch local boxes',()=>{
  assert.deepEqual(['pack3:023','pack3:024','pack3:025','pack3:026'].map(k=>peek(k).boxes.length),[9,7,7,10]);
  for(const ref of ['pack3:023','pack3:024','pack3:025','pack3:026']){
    const shape=peek(ref);
    assert.equal(shape.fidelity,'source-boxes');
    assert.deepEqual(shape.boxes[0],[0,0,0,1,.125,1]);
    assert.ok(shape.boxes.slice(1).every(box=>box[1]>=.125&&box[4]<.30),ref);
  }
});

test('side-facing Pack 4 window pane turns into an x-normal thin plane instead of unrotated z-plane',()=>{
  const east=peek('pack4:030','east');const west=peek('pack4:030','west');
  assert.equal(east.fidelity,'source-boxes');assert.equal(east.orientationStateNeeded,true);
  assert.ok(east.boxes.every(box=>box[3]-box[0]<.06), 'east window must be thin across x');
  assert.ok(west.boxes.every(box=>box[3]-box[0]<.06), 'west window must be thin across x');
  assert.ok(peek('pack4:030','north').boxes.every(box=>box[5]-box[2]<.10));
});

test('all raised steps and landings have source-referenced partial stair/slab boxes, not solid cube preview proxies',()=>{
  let stairs=0,landings=0;
  for(const design of b)for(const c of design.cells){
    if(c.role==='stair'){
      const shape=candidatePreviewShape(c);
      assert.equal(shape.fidelity,'source-boxes');assert.equal(shape.boxes.length,2);
      assert.equal(shape.orientationStateNeeded,true);
      stairs++;
    }
    if(c.role==='landing'){
      const shape=candidatePreviewShape(c);
      assert.equal(c.asset,'pack1:007');
      assert.equal(shape.fidelity,'source-boxes');
      assert.deepEqual(shape.boxes,[[0,0,0,1,.5,1]]);
      landings++;
    }
  }
  assert.equal(stairs,140);assert.equal(landings,35);
});

test('preview census explicitly labels unresolved future materials as approximation, not certified live collision',()=>{
  const result=b.map(candidatePreviewShapeCensus);
  assert.equal(result.reduce((x,s)=>x+s.cells,0),129484);
  assert.ok(result.every(s=>s.boxes>=s.cells));
  assert.ok(result.every(s=>!s.liveCollisionCertified&&!s.actualWebGL2PerfMeasured));
  assert.ok(result.some(s=>s.counts['unresolved-full-cell-proxy']>0));
  assert.ok(result.some(s=>s.orientationSaveBlockedCells>0));
});

test('naive source-box union preview upper bound explicitly exceeds optimistic full-cube memory estimates',async()=>{
  const {candidatePreviewUpperBound}=await import('../../../src/building-pool/roadmap-4/m1-preview-shapes.mjs');
  const perModel=b.map(candidatePreviewUpperBound);
  assert.equal(perModel.length,30);
  assert.ok(perModel.some(r=>r.primitiveBoxes>r.cells));
  assert.ok(perModel.every(r=>r.unindexedPositionColorBufferUpperBoundBytes===r.unindexedQuadUpperBound*144));
  assert.ok(perModel.every(r=>r.actualGPUByteAllocation===null&&r.actualWebGL2FrameTimeMs===null));
  assert.ok(perModel.some(r=>r.unindexedPositionColorBufferUpperBoundBytes>2_590_848));
});

test('template + instancing budget is materially lower than naïve repeated source-box uploads',async()=>{
  const {candidateBatchedPreviewBudget,candidatePreviewUpperBound}=await import('../../../src/building-pool/roadmap-4/m1-preview-shapes.mjs');
  let models=0;let maxBatched=0;let maxNaive=0;
  for(const design of b){
    const naïve=candidatePreviewUpperBound(design),batched=candidateBatchedPreviewBudget(design);
    assert.ok(batched.estimatedUploadBytes<naïve.unindexedPositionColorBufferUpperBoundBytes,design.id);
    assert.ok(batched.partialInstances>0&&batched.sharedShapeTemplates>0,design.id);
    assert.ok(batched.estimatedUploadBytes===batched.templateBytes+batched.instanceBytes+batched.fullCellBytes);
    assert.equal(batched.implementationStatus,'budget-model-only');
    assert.equal(batched.gpuMemoryMeasured,false);
    maxBatched=Math.max(maxBatched,batched.estimatedUploadBytes);
    maxNaive=Math.max(maxNaive,naïve.unindexedPositionColorBufferUpperBoundBytes);
    models++;
  }
  assert.equal(models,30);
  assert.ok(maxBatched<maxNaive/2,'same design data should avoid repeated roof asset vertex uploads');
});
