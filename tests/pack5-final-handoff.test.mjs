import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BLOCK} from '../src/voxel.mjs';
import {orientedParts,rotateCellOffset} from '../src/block-packs/pack-5/fixture.mjs';
import {PACK5_BUILDER_CATALOG,resolvePack5BuilderAsset} from '../src/pack5-integration/catalog.mjs';
import {createPack5ConstructionLayer} from '../src/pack5-integration/construction-layer.mjs';
import {createPack5GpuStream} from '../src/pack5-integration/terrain-buffer.mjs';
import {planPack5BuilderBlueprint} from '../src/pack5-integration/blueprint-handoff.mjs';
import {savePack5SidecarSafe,loadPack5SidecarSafe} from '../src/pack5-integration/sidecar-storage.mjs';

const manifest=JSON.parse(readFileSync(new URL('../src/pack5-integration/final-integration-handoff.json',import.meta.url),'utf8'));
const cell=v=>v.join(',');
const mixedWorld=()=>{
  const solid=new Set();
  return {seed:731,solid,get(x,y,z){return solid.has(cell([x,y,z]))?BLOCK.STONE:BLOCK.AIR;}};
};
function supports(w,id,anchor,rotation,variant){
  const {descriptor}=resolvePack5BuilderAsset(id,variant);
  if(descriptor.attachment==='floor')for(const part of orientedParts(descriptor,rotation)){
    const c=part.cell.map((n,i)=>n+anchor[i]);w.solid.add(cell([c[0],c[1]-1,c[2]]));
  }
  if(descriptor.attachment==='wall'){
    const back=rotateCellOffset([0,0,-1],rotation);
    w.solid.add(cell(anchor.map((n,i)=>n+back[i])));
  }
  if(descriptor.attachment==='ceiling')
    w.solid.add(cell([anchor[0],anchor[1]+1,anchor[2]]));
}
function mockGl(){
  const uploads=[],draws=[],deleted=[];
  return {uploads,draws,deleted,ARRAY_BUFFER:34962,STATIC_DRAW:35044,
    FLOAT:5126,TRIANGLES:4,NO_ERROR:0,
    createBuffer(){return {};},deleteBuffer(b){deleted.push(b);},
    getError(){return 0;},bindBuffer(){},
    bufferData(_key,bytes){uploads.push(bytes.byteLength);},
    vertexAttribPointer(){},drawArrays(_mode,_start,count){draws.push(count);}};
}
function buildMixed(){
  const w=mixedWorld(),layer=createPack5ConstructionLayer(w),placements=[];
  for(let i=0;i<PACK5_BUILDER_CATALOG.length*2;i++){
    const family=PACK5_BUILDER_CATALOG[Math.floor(i/2)];
    const variant=family.variants[i%2];
    const rotation=i%4,anchor=[(i%6)*8,5,Math.floor(i/6)*8];
    supports(w,family.symbolicId,anchor,rotation,variant);
    const result=layer.place(family.symbolicId,anchor,rotation,variant);
    assert.equal(result.ok,true,family.symbolicId+'/'+variant+': '+result.reason);
    placements.push({asset:family.symbolicId,at:anchor,variant,orientation:rotation});
  }
  return {w,layer,placements};
}
test('combined handoff enumerates exactly the 18 source-owned symbolic identities without allocating production IDs',()=>{
  assert.equal(manifest.packNumber,5);
  assert.equal(manifest.families,18);
  assert.equal(manifest.symbols.length,18);
  assert.equal(manifest.legacyWorldSchema,1);
  assert.deepEqual(manifest.legacyNumericBlockIdsPreserved,[0,1,2,3,4,5,6,7,8]);
  assert.equal(manifest.builderContract.productionPlacement,false);
  assert.equal(manifest.builderContract.registeredInMain,false);
  const ids=PACK5_BUILDER_CATALOG.map(item=>item.symbolicId);
  assert.deepEqual(manifest.symbols.map(item=>item.symbolicId),ids);
  assert.equal(new Set(ids).size,18);
  assert.ok(manifest.symbols.every(row=>row.numericId===null));
  assert.ok(ids.every(id=>/^pack5:0(?:7[9]|8\d|9[0-6])$/.test(id)));
});
test('all 36 mixed source variants co-exist, orient, save, reload and hand off exact multi-cell geometry',()=>{
  const {w,layer,placements}=buildMixed();
  assert.equal(layer.count(),36);
  const symbolic=new Set(layer.list().map(row=>row.symbolicId));
  assert.equal(symbolic.size,18);
  const plan=planPack5BuilderBlueprint({id:'pack5:handoff:36',placements});
  assert.equal(plan.resolvedCount,36);
  assert.ok(plan.occupiedCount>=36);
  assert.ok(plan.placements.every(item=>item.numericId===null&&
    item.physical.hasRealPhysicalGeometry&&item.physical.selection.length>0&&
    item.physical.collision.length>0&&item.physical.supportVerified===false&&
    item.productionPlacement===false));
  for(const item of plan.placements){
    assert.ok(item.physical.occupiedCells.every(c=>c.every(Number.isSafeInteger)));
    assert.ok(item.physical.requiredSupports.every(c=>w.solid.has(cell(c))));
  }
  const json=JSON.stringify(layer.snapshot());
  const storage=new Map(),store={
    getItem:key=>storage.has(key)?storage.get(key):null,
    setItem(key,v){storage.set(key,v);},removeItem(key){storage.delete(key);}
  };
  const save=savePack5SidecarSafe(store,layer);
  assert.equal(save.count,36);
  const reloaded=createPack5ConstructionLayer(w);
  const result=loadPack5SidecarSafe(store,reloaded);
  assert.equal(result.count,36);
  assert.equal(JSON.stringify(reloaded.snapshot()),json);
  assert.ok([...storage.keys()].every(k=>k.startsWith('mythwrought.pack5.builder.seed.731')));
});
test('mixed-furnishing GPU pages remain byte and draw bounded with zero duplicate uploads at a fixed camera',()=>{
  const {layer}=buildMixed(),gl=mockGl();
  const stream=createPack5GpuStream(gl,layer);
  const eye=[20,5,20];let time=1000;
  for(let i=0;i<24;i++)stream.refresh(eye,time+=2000);
  const stats=stream.stats();
  assert.ok(stats.instances>0&&stats.instances<=36);
  assert.ok(stats.pages<=manifest.performanceContract.maximumDrawCalls);
  assert.ok(stats.bytes<=manifest.performanceContract.residentGpuBytes);
  assert.ok(stats.maxUploadedPageBytes<=manifest.performanceContract.pageUploadBytes);
  assert.ok(gl.uploads.every(b=>b<=manifest.performanceContract.pageUploadBytes));
  assert.ok(stats.budgetExcluded>=0&&stats.budgetExcluded<=36);
  const before=gl.uploads.length;
  stream.refresh(eye,time+2000);
  assert.equal(gl.uploads.length,before);
  const tris=stream.draw({atPos:0,atColor:1,atUv:2,atMat:3});
  assert.ok(tris>0&&stream.stats().drawCalls<=8);
  stream.dispose();
  assert.equal(stream.stats().bytes,0);
});

test('handoff manifest exposes source-owned fail-closed cross-pack physical preflight ABI',()=>{
  const abi=manifest.builderContract.shapeAwarePreflight;
  assert.equal(abi.api,'preflightPack5BuilderPlan');
  assert.equal(abi.existingPack5SourceApi,'collectPack5PlacedCollisionBoxes');
  assert.deepEqual(abi.expectedInputs,[
    'world','foreignOccupiedCells','existingPack5Cells',
    'foreignCollisionBoxes','existingPack5CollisionBoxes']);
  assert.equal(abi.optionalCertifiedStructuralInput,'verifiedStructuralSupports');
  assert.equal(abi.outcome,'shapeAwareDryRunClear');
  assert.ok(abi.remainsFalse.includes('integrationReady'));
  assert.ok(abi.remainsFalse.includes('crossPackPhysicalAcceptance'));
  assert.equal(manifest.numericBlockIdPolicy.startsWith('NO IDS'),true);
});
