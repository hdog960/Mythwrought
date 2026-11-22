import test from 'node:test';
import assert from 'node:assert/strict';
import {stageOriginalSkyEcology} from '../../src/floating-islands/sky-ecology-stage.mjs';
const full=[0,0,0,1,1,1],trees={
  'windbent-pine':{trunk:370,leaves:379},
  'cloudleaf-tree':{trunk:376,leaves:385},
  'starbloom-tree':{trunk:375,leaves:384},
  glowmoss:{'ground-cover':287}
};
function setup({plan={placements:[{kind:'windbent-pine',group:'canopy',x:12000,y:51,z:-14000}]},
  playerEdits=new Map(),playerRotations=new Map(),groundY=50}={}){
  let token='seed179#live',epoch=4,worldRevision=1,fingerprint='real-generator-unavailable';
  const revisions=new Map(),protectedCells=new Set(),baseRotation=new Map();
  let worldReads=0,surfaceChecks=0;
  const naturalGet=(x,y,z)=>x===12001&&y===90&&z===-14001?370:y===groundY?3:0;
  const get=(x,y,z)=>{worldReads++;const k=`${x},${y},${z}`;
    return playerEdits.has(k)?playerEdits.get(k):naturalGet(x,y,z);};
  const physicalHost={world:{get}};
  const source={physicalWorld:physicalHost.world,
    readIdentity:()=>({seed:179,worldToken:token,generatorFingerprint:fingerprint,epoch}),
    readWorldRevision:()=>worldRevision,
    sectionRevision:k=>revisions.get(k)??1,
    naturalGet,
    naturalRotationAt:(x,y,z)=>baseRotation.get(`${x},${y},${z}`)??0,
    get,verifyCompleteIsland:()=>{surfaceChecks++;return true;},
    isProtectedCell:()=>false,
    validateId:id=>[0,3,370,379,375,384,376,385,287].includes(id)?id:null,
    rotationAllowed:id=>id>=256};
  const materials={
    blockFor:id=>id===3?{solid:true,boxes:[full]}:null,
    assetFor:(kind,role)=>trees[kind]?.[role],
    isPhysicalAsset:id=>[370,379,375,384,376,385,287].includes(id),
    filterSupportedVegetation:plan=>{
      const rows=plan.placements.filter(p=>p.group==='canopy'?
        Boolean(trees[p.kind]?.trunk):Boolean(trees[p.kind]?.['ground-cover']));
      return {placements:rows,omitted:plan.placements.length-rows.length};
    }
  };
  const stage=extra=>stageOriginalSkyEcology({physicalHost,source,materials,seed:179,
    plan,playerEdits,playerRotations,...extra});
  return {stage,source,physicalHost,materials,playerEdits,playerRotations,protectedCells,revisions,
    baseRotation,changeWorld:v=>{token=v;},changeRevision:v=>{worldRevision=v;},
    changeEpoch:v=>{epoch=v;},changeFingerprint:v=>{fingerprint=v;},
    get worldReads(){return worldReads},get surfaceChecks(){return surfaceChecks}};
}
test('real original-source ecology composition builds immutable natural voxel and physical host inputs',()=>{
  const x=setup(),stage=x.stage();
  assert.equal(stage.overlay.naturalAt(12000,51,-14000),370);
  assert.equal(stage.physicalHostInput.skyGet(12000,51,-14000),370);
  assert.equal(stage.physicalHostInput.skyEdits.size,0);
  assert.equal(stage.worldWrites,0);assert.equal(stage.skySaveWrites,0);
  assert.equal(stage.renderOnlyMeshes,0);assert.equal(stage.shadowPasses,0);
  assert.ok(x.surfaceChecks>0);
});
test('genuine merged world reader identity is required, not a lookalike source function',()=>{
  const x=setup();x.source.physicalWorld={get:x.physicalHost.world.get};
  assert.throws(()=>x.stage(),/same immutable original physical-world source/);
});
test('player AIR edit already loaded into original physical host takes precedence',()=>{
  const x=setup({playerEdits:new Map([['12000,51,-14000',0]])});
  const stage=x.stage();
  assert.equal(stage.physicalHostInput.skyGet(12000,51,-14000),370);
  assert.equal(stage.overlay.get(12000,51,-14000),0);
  assert.equal(stage.physicalHostInput.skyEdits.get('12000,51,-14000'),0);
});
test('root-support AIR edit blocks entire tree before ecology reaches overlay',()=>{
  const x=setup({playerEdits:new Map([['12000,50,-14000',0]])});
  const r=x.stage();assert.equal(r.certificate.candidate.treeCount,0);
  assert.equal(r.overlay.naturalCells.length,0);
});
test('player sidecar not present in original physical world is rejected before certificates',()=>{
  const x=setup({playerEdits:new Map([['12000,51,-14000',0]])});
  x.physicalHost.world.get=()=>370;
  assert.throws(()=>x.stage(),/not reflected in the original physical host/);
  assert.equal(x.surfaceChecks,0);
});
test('rotation at source original generated nonflora block is preserved exactly',()=>{
  const x=setup();x.baseRotation.set('12001,90,-14001',2);
  const result=x.stage();
  assert.equal(result.overlay.rotationAt(12001,90,-14001),2);
  assert.equal(result.physicalHostInput.skyRotationAt(12001,90,-14001),2);
});
test('invalid generated rotation is refused rather than coerced to cube geometry',()=>{
  const x=setup();x.baseRotation.set('12001,90,-14001',4);
  const result=x.stage();assert.throws(()=>result.overlay.rotationAt(12001,90,-14001),/unapproved original/);
});
test('new world identity invalidates staged original mesh input before rendering',()=>{
  const x=setup(),result=x.stage();x.changeWorld('seed2026#new');
  assert.throws(()=>result.physicalHostInput.assertFresh(),/overlay stale/);
});
test('world edit revision change invalidates certified ecology stage after it returns',()=>{
  const x=setup(),result=x.stage();x.changeRevision(2);
  assert.throws(()=>result.physicalHostInput.assertFresh(),/overlay stale/);
});
test('source callback that switches epoch during original physical plan refuses certificate',()=>{
  const x=setup(),old=x.physicalHost.world.get;
  x.physicalHost.world.get=(a,b,c)=>{x.changeEpoch(99);return old(a,b,c)};
  assert.throws(()=>x.stage(),/changed during foliage planning/);
});
test('large signed original coordinates remain natural and never touch Schema-1 saves',()=>{
  const x=setup({plan:{placements:[{kind:'glowmoss',group:'ground-cover',x:-12000,y:51,z:13000}]}});
  const r=x.stage();assert.equal(r.overlay.get(-12000,51,13000),287);
  assert.equal(r.overlay.metrics.groundSaveWrites,0);
});
test('deterministic stage does not retain caller-owned mutable player Map',()=>{
  const edits=new Map([['12000,51,-14000',0]]),x=setup({playerEdits:edits});
  const result=x.stage();edits.delete('12000,51,-14000');
  assert.equal(result.overlay.get(12000,51,-14000),0);
  assert.equal(result.physicalHostInput.skyEdits.get('12000,51,-14000'),0);
});
test('natural eco source stays separate from user edits when preparing original mesher',()=>{
  const edits=new Map([['12000,51,-14000',0]]),x=setup({playerEdits:edits});
  const result=x.stage();
  assert.equal(result.physicalHostInput.skyGet(12000,51,-14000),370);
  assert.equal(result.physicalHostInput.skyEdits.get('12000,51,-14000'),0);
  assert.equal(result.physicalHostInput.skyRotationAt(12000,51,-14000),0);
});

test('original Y19/20 ground mesh and adjacent terrain chunks must be invalidated',()=>{
  const x=setup({groundY:19,plan:{placements:[{kind:'glowmoss',group:'ground-cover',x:0,y:20,z:0}]}});
  const r=x.stage();
  assert.equal(r.overlay.get(0,20,0),287);
  assert.ok(r.overlay.affectedGroundKeys.includes('0,0'));
  assert.ok(r.overlay.affectedGroundKeys.includes('-1,0'));
  assert.ok(r.overlay.affectedGroundKeys.includes('0,-1'));
  assert.equal(r.overlay.metrics.groundMeshInvalidations,3);
});
test('adjacent sky occlusion revisions outside the original flora certificate are fenced',()=>{
  const x=setup({groundY:19,plan:{placements:[{kind:'glowmoss',group:'ground-cover',x:0,y:20,z:0}]}});
  const stage=x.stage();
  assert.ok(!stage.overlay.certifiedSkyKeys.includes('sky:-1,0,0'));
  x.revisions.set('sky:-1,0,0',99);
  assert.throws(()=>stage.overlay.assertFresh(),/overlay stale after section/);
});
