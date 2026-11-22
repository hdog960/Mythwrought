import test from 'node:test';
import assert from 'node:assert/strict';
import {stageOriginalSkyEcology} from '../../src/floating-islands/sky-ecology-stage.mjs';
import {createSkySidecar,planSkyCellEdit,readSkyEdit,exportSkySidecar,
  restoreSkySidecar,SKY_SIDECAR_FORMAT} from '../../src/floating-islands/sky-sidecar.mjs';
const y=70,x=-12000,z=13000;
function ecology(){
  const source={
    readIdentity:()=>({seed:179,worldToken:'w',generatorFingerprint:'source-v1',epoch:1}),
    readWorldRevision:()=>0,sectionRevision:()=>1,naturalGet:(a,b,c)=>b===y-1?3:0,
    validateId:id=>[0,3,370,379,287].includes(id)?id:null,
    rotationAllowed:id=>id>=256,isProtectedCell:()=>false,verifyCompleteIsland:()=>true,
  };
  const physicalHost={world:{get:source.naturalGet}};
  source.physicalWorld=physicalHost.world;
  const materials={
    blockFor:id=>id===3?{solid:true,boxes:[[0,0,0,1,1,1]]}:null,
    assetFor:(kind,role)=>kind==='windbent-pine'?role==='trunk'?370:role==='leaves'?379:null:
      kind==='glowmoss'&&role==='ground-cover'?287:null,
    isPhysicalAsset:id=>[370,379,287].includes(id),
    filterSupportedVegetation:plan=>({placements:plan.placements,omitted:0})
  };
  const stage=stageOriginalSkyEcology({physicalHost,source,materials,seed:179,
    plan:{placements:[{x,y,z,kind:'windbent-pine',group:'canopy'}]}});
  return {stage,source};
}
function edit(state,id,ctx,coord=[x,y,z]){
  return planSkyCellEdit(state,{x:coord[0],y:coord[1],z:coord[2],id,
    expectedRevision:state.revision,worldId:'w',generatorFingerprint:'source-v1'},ctx);
}
test('exact existing provisional sidecar can mine a source-generated tree trunk to AIR',()=>{
  const {stage,source}=ecology(),ctx={naturalAt:stage.overlay.naturalAt,
    validateId:source.validateId,rotationAllowed:source.rotationAllowed};
  const state=createSkySidecar({seed:179,worldId:'w',generatorFingerprint:'source-v1'});
  assert.equal(readSkyEdit(state,x,y,z,ctx).id,370);
  const mined=edit(state,0,ctx);
  assert.equal(mined.changed,true);
  assert.deepEqual(readSkyEdit(mined.state,x,y,z,ctx),{id:0,rotation:0,edited:true});
  assert.equal(stage.overlay.naturalAt(x,y,z),370);
  assert.equal(stage.overlay.metrics.groundSaveWrites,0);
});
test('save/JSON/restore preserves mined AIR and keeps generator baseline intact',()=>{
  const {stage,source}=ecology(),ctx={naturalAt:stage.overlay.naturalAt,
    validateId:source.validateId,rotationAllowed:source.rotationAllowed};
  const root=createSkySidecar({seed:179,worldId:'w',generatorFingerprint:'source-v1'});
  const edited=edit(root,0,ctx).state;
  const dump=exportSkySidecar(edited,ctx);
  assert.equal(dump.format,SKY_SIDECAR_FORMAT);
  assert.ok(!('schema' in dump)); // no original Schema-1 mutation
  const loaded=restoreSkySidecar(JSON.parse(JSON.stringify(dump)),
    {seed:179,worldId:'w',generatorFingerprint:'source-v1'},ctx);
  assert.equal(readSkyEdit(loaded,x,y,z,ctx).id,0);
  assert.equal(readSkyEdit(root,x,y,z,ctx).id,370);
  assert.equal(dump.edits.length,1);
});
test('placing the original registered trunk value again removes redundant player edit',()=>{
  const {stage,source}=ecology(),ctx={naturalAt:stage.overlay.naturalAt,
    validateId:source.validateId,rotationAllowed:source.rotationAllowed};
  const first=createSkySidecar({seed:179,worldId:'w',generatorFingerprint:'source-v1'});
  const mined=edit(first,0,ctx).state;
  const replaced=edit(mined,370,ctx).state;
  assert.equal(replaced.edits.length,0);
  assert.equal(replaced.revision,2);
  assert.equal(readSkyEdit(replaced,x,y,z,ctx).id,370);
});
test('real source registration checks reject unregistered user block IDs',()=>{
  const {stage,source}=ecology(),ctx={naturalAt:stage.overlay.naturalAt,
    validateId:source.validateId,rotationAllowed:source.rotationAllowed};
  const state=createSkySidecar({seed:179,worldId:'w',generatorFingerprint:'source-v1'});
  assert.throws(()=>edit(state,65534,ctx),/source-registered physical block/);
});
test('different generator fingerprint refuses restored old-world mined foliage',()=>{
  const {stage,source}=ecology(),ctx={naturalAt:stage.overlay.naturalAt,
    validateId:source.validateId,rotationAllowed:source.rotationAllowed};
  const state=createSkySidecar({seed:179,worldId:'w',generatorFingerprint:'source-v1'});
  const exportData=exportSkySidecar(edit(state,0,ctx).state,ctx);
  assert.throws(()=>restoreSkySidecar(exportData,
    {seed:179,worldId:'w',generatorFingerprint:'future-codex-v2'},ctx),/wrong source world/);
});
test('real sidecar min/max heights do not corrupt original Y19 ground boundary',()=>{
  const {stage,source}=ecology(),ctx={naturalAt:stage.overlay.naturalAt,
    validateId:source.validateId,rotationAllowed:source.rotationAllowed};
  const state=createSkySidecar({seed:179,worldId:'w',generatorFingerprint:'source-v1'});
  assert.throws(()=>edit(state,0,ctx,[x,19,z]),/invalid cell/);
  assert.throws(()=>edit(state,0,ctx,[x,257,z]),/invalid cell/);
  assert.equal(stage.overlay.metrics.worldWrites,0);
});
