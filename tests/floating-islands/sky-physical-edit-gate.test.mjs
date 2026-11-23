import test from 'node:test';
import assert from 'node:assert/strict';
import {stageOriginalSkyEcology} from '../../src/floating-islands/sky-ecology-stage.mjs';
import {createSkyEditSession} from '../../src/floating-islands/sky-edit-session.mjs';
import {planPhysicalSkyEdit} from '../../src/floating-islands/sky-physical-edit-gate.mjs';
import {skyIslandMeshKey,skyIslandSectionForY} from '../../src/floating-islands/sky-runtime-adapter.mjs';

function fixture({x=0,y=70,z=0,kind='windbent-pine',group='canopy'}={}){
  const point=[x,y,z],adjacent=[x+1,y,z];
  let worldToken='original179',fingerprint='unknown-codex-sky-v0',epoch=3,
    worldRevision=0,blockRevision=1,groundRevision=7,
    ready=true,rayReady=true,protectedCell=false,canPlace=true,worldCellOverride=null;
  const edits=new Map(),rotations=new Map();
  const get0=(a,b,c)=>b===y-1?3:0;
  const readIdentity=()=>({worldToken,generatorFingerprint:fingerprint,epoch,seed:179});
  let activeEye=null,activeBody=null;
  const source={readIdentity,readPlayerEye:()=>activeEye,readPlayerBody:()=>activeBody,readWorldRevision:()=>worldRevision,
    sectionRevision:()=>blockRevision,groundRevision:()=>groundRevision,
    naturalGet:get0,validateId:id=>[0,3,287,370,379,375,384,376,385].includes(id)?id:null,
    rotationAllowed:id=>id>=256,isProtectedCell:()=>protectedCell,
    verifyCompleteIsland:()=>true,isSkySectionResident:()=>ready,
    canRaycastLoaded:()=>rayReady,canPlaceCell:()=>canPlace};
  const physicalBefore={world:{get:(...v)=>edits.get(v.join(','))??get0(...v)}};
  source.physicalWorld=physicalBefore.world;
  const materials={blockFor:id=>id===3?{solid:true,boxes:[[0,0,0,1,1,1]]}:null,
    assetFor:(type,role)=>type==='windbent-pine'?role==='trunk'?370:role==='leaves'?379:null:
      type==='glowmoss'&&role==='ground-cover'?287:null,
    isPhysicalAsset:id=>[370,379,287].includes(id),
    filterSupportedVegetation:plan=>({placements:plan.placements,omitted:0})};
  const stage=stageOriginalSkyEcology({physicalHost:physicalBefore,source,materials,
    seed:179,plan:{placements:[{x,y,z,kind,group}]}});
  const overlay=stage.overlay;
  let hit={hit:[...point],adjacent:[...adjacent],distance:3};
  let rayCalls=0,rayHook=()=>{};
  const physicalHost={world:{get:(...v)=>worldCellOverride?.(...v)??overlay.get(...v)},
    physical:{raycast(...args){rayCalls++;rayHook(rayCalls,args);return hit;}}};
  source.physicalWorld=physicalHost.world;
  const session=createSkyEditSession({seed:179,worldId:'original179',
    generatorFingerprint:'unknown-codex-sky-v0',naturalAt:overlay.naturalAt,
    validateId:source.validateId,rotationAllowed:source.rotationAllowed});
  const skyKey=skyIslandMeshKey(Math.floor(x/16),Math.floor(z/16),skyIslandSectionForY(y));
  const resident=new Set([skyKey]);
  const groundKeys=new Set([`${Math.floor(x/16)},${Math.floor(z/16)}`]);
  const eye=[x+.5,y+.7,z+4],direction=[0,0,-1],body={x:x+.5,feet:y+2,z:z+1};
  activeEye=eye;activeBody=body;
  const plan=(options={})=>planPhysicalSkyEdit({session,overlay,source,physicalHost,
    action:'mine',eye,direction,loadedSkyKeys:resident,loadedGroundKeys:groundKeys,
    playerBody:body,...options});
  return {plan,session,overlay,source,physicalHost,point,adjacent,skyKey,
    resident,eye,direction,groundKeys,
    setHit:v=>{hit=v},setRayHook:v=>{rayHook=v},
    changePlayerEye:v=>{activeEye=v},changePlayerBody:v=>{activeBody=v},
    changeWorld:v=>{worldToken=v},changeFingerprint:v=>{fingerprint=v},
    changeEpoch:v=>{epoch=v},changeRevision:v=>{worldRevision=v},
    changeSection:v=>{blockRevision=v},changeGround:v=>{groundRevision=v},
    setReady:v=>{ready=v},setRayReady:v=>{rayReady=v},
    setProtected:v=>{protectedCell=v},setCanPlace:v=>{canPlace=v},
    overrideCell:v=>{worldCellOverride=v},get rayCalls(){return rayCalls}
  };
}

test('original shape-selected generated pine trunk can be mined to true AIR without saving the natural tree',()=>{
  const f=fixture(),r=f.plan();
  assert.equal(r.ok,true);assert.equal(r.proposedId,0);assert.equal(r.previousId,370);
  assert.equal(r.candidate.state.edits.length,1);
  assert.deepEqual(r.candidate.state.edits[0],[0,70,0,0,0]);
  assert.equal(f.overlay.naturalAt(...f.point),370);
  assert.equal(r.groundSaveWrites,0);assert.equal(r.skySaveWrites,0);
  assert.ok(r.meshInvalidations.skyKeys.includes(f.skyKey));
});
test('rotated physical block placement into native ray adjacent cell is separate authored player edit',()=>{
  const f=fixture();const r=f.plan({action:'place',blockId:379,rotation:2});
  assert.equal(r.ok,true);assert.deepEqual(r.target,f.adjacent);
  assert.deepEqual(r.candidate.state.edits[0],[1,70,0,379,2]);
  assert.equal(f.overlay.get(...f.adjacent),0);
  assert.equal(r.originalRayDistance,3);
});
test('original occupied adjacent sky cell blocks placement, including registered non-solid plants',()=>{
  const f=fixture();f.setHit({hit:[-1,70,0],adjacent:[0,70,0],distance:3});
  assert.match(f.plan({action:'place',blockId:3}).reason,/occupied/);
});
test('authentic placement/body-clearance rejection fails closed before any sidecar edit',()=>{
  const f=fixture();f.setCanPlace(false);
  const r=f.plan({action:'place',blockId:370,rotation:1});
  assert.equal(r.ok,false);assert.match(r.reason,/placement veto/);
  assert.equal(f.session.state.edits.length,0);
});
test('original protected cell cannot be mined despite a real native ray hit',()=>{
  const f=fixture();f.setProtected(true);
  assert.equal(f.plan().ok,false);assert.equal(f.rayCalls,1);
});
test('unloaded source ray path blocks mining before calling native raycast',()=>{
  const f=fixture();f.setRayReady(false);
  const r=f.plan();assert.equal(r.ok,false);assert.equal(f.rayCalls,0);
});
test('unloaded target GPU section cannot be treated as edited or selected',()=>{
  const f=fixture();f.setReady(false);
  assert.equal(f.plan().ok,false);assert.equal(f.session.state.edits.length,0);
});
test('Y19 ground selected for mining is never rewritten through sky-sidecar',()=>{
  const f=fixture();f.setHit({hit:[0,19,0],adjacent:[0,20,0],distance:2});
  assert.equal(f.plan().ok,false);
});
test('sidecar naturalAt MUST use exact certified generated ecology (not baseline Codex AIR)',()=>{
  const f=fixture(),wrong=createSkyEditSession({seed:179,worldId:'original179',
    generatorFingerprint:'unknown-codex-sky-v0',naturalAt:()=>0,
    validateId:f.source.validateId,rotationAllowed:f.source.rotationAllowed});
  assert.throws(()=>f.plan({session:wrong}),/exact certified natural ecology/);
});
test('a previously edited session cannot be reused against an older unedited ecology overlay',()=>{
  const f=fixture(),newSession=f.plan().candidate;
  assert.throws(()=>f.plan({session:newSession}),/player AIR\/rotation snapshot differs/);
});
test('world identity changes during native ray are refused instead of accepting stale target',()=>{
  const f=fixture();f.setRayHook(()=>f.changeWorld('new world'));
  assert.throws(()=>f.plan(),/stale|source changed/);
});
test('global edited-world revision changes during native ray are refused',()=>{
  const f=fixture();f.setRayHook(()=>f.changeRevision(1));
  assert.throws(()=>f.plan(),/source changed during sky edit planning|overlay stale/);
});
test('upper-section revision changes during second physical ray vetoes selected target',()=>{
  const f=fixture();f.setRayHook(n=>{if(n===2)f.changeSection(2)});
  assert.throws(()=>f.plan(),/source|section|stale/i);
});
test('silent mutation in physical-world cell reader is detected even if revision callback lies',()=>{
  const f=fixture();f.setRayHook(n=>{if(n===2)f.overrideCell(()=>0)});
  assert.throws(()=>f.plan(),/original selection source/);
});
test('original native ray target shift between first and second reading fails closed',()=>{
  const f=fixture();f.setRayHook(n=>{if(n===2)f.setHit({hit:[1,70,0],adjacent:[2,70,0],distance:2})});
  assert.throws(()=>f.plan(),/ray selection changed/);
});
test('original ray distance cannot exceed shape-aware 7-block reach',()=>{
  const f=fixture();f.setHit({hit:[...f.point],adjacent:[...f.adjacent],distance:7.5});
  assert.equal(f.plan().ok,false);
});
test('edit proposal stays source-fenced after return, including world revision changes',()=>{
  const f=fixture(),r=f.plan();assert.equal(r.assertFresh(),true);
  f.changeRevision(4);assert.throws(()=>r.assertFresh(),/source changed|overlay stale/);
});
test('source-fence captures exact upper section revision keys and valid authored seam effects',()=>{
  const f=fixture(),r=f.plan();
  assert.ok(r.sourceSkyRevisions.some(([k,v])=>k===f.skyKey&&v===1));
  assert.ok(r.meshInvalidations.skyKeys.includes(f.skyKey));
});
test('Y20 star moss mining invalidates original Y19 surface and checks actual ground revision',()=>{
  const f=fixture({x:0,y:20,z:0,kind:'glowmoss',group:'ground-cover'}),r=f.plan();
  assert.equal(r.ok,true);assert.ok(r.meshInvalidations.groundKeys.includes('0,0'));
  assert.equal(r.previousId,287);assert.ok(r.sourceGroundRevisions.some(([k,v])=>k==='0,0'&&v===7));
});
test('Y19 ground revision change after proposal invalidates the staged mining edit',()=>{
  const f=fixture({x:0,y:20,z:0,kind:'glowmoss',group:'ground-cover'}),r=f.plan();
  f.changeGround(8);assert.throws(()=>r.assertFresh(),/Y19 surface changed/);
});
test('Y19 ground revision authority is mandatory for Y20 source edit',()=>{
  const f=fixture({x:0,y:20,z:0,kind:'glowmoss',group:'ground-cover'});
  delete f.source.groundRevision;
  assert.throws(()=>f.plan(),/Y19\/20 surface revision/);
});
test('source-protected mined root or another actor overlay is not bypassed by input IDs',()=>{
  const f=fixture();f.overrideCell(()=>0);assert.equal(f.plan().ok,false);
});
test('unknown block ID or unapproved rotation is rejected by original sidecar registry',()=>{
  const f=fixture();assert.throws(()=>f.plan({action:'place',blockId:9999}),/source-registered physical block/);
  const g=fixture();assert.throws(()=>g.plan({action:'place',blockId:3,rotation:2}),/unapproved physical rotation/);
});
test('negative remote X/Z world 10k+ can be source selected, mined and invalidated',()=>{
  const f=fixture({x:-12000,y:155,z:14300}),r=f.plan();
  assert.equal(r.ok,true);assert.deepEqual(r.target,[-12000,155,14300]);
  assert.ok(r.meshInvalidations.skyKeys.some(k=>k.startsWith('sky:-750,893,')));
});
test('renderer cannot reuse a stale selection when target section is evicted between ray and commit',()=>{
  const f=fixture(),r=f.plan();f.setReady(false);
  assert.throws(()=>r.assertFresh(),/original selection source/);
});
test('no direct world, sidecar, renderer or PWA writes occur during plan',()=>{
  const f=fixture(),r=f.plan();
  for(const key of ['worldWrites','groundSaveWrites','skySaveWrites','gpuUploads'])assert.equal(r[key],0);
  assert.equal(f.session.state.edits.length,0);
  assert.equal(f.overlay.metrics.worldWrites,0);
});
test('Y20 at x/z seam fences original ground renderer on all three neighboring surface chunks',()=>{
  const f=fixture({x:0,y:20,z:0,kind:'glowmoss',group:'ground-cover'}),r=f.plan();
  assert.equal(r.ok,true);
  assert.deepEqual(new Set(r.sourceGroundRevisions.map(([k])=>k)),new Set(['0,0','-1,0','0,-1']));
  assert.ok(r.meshInvalidations.groundKeys.includes('0,0'));
});
test('Y20 x/z negative 16-boundary retains proper source ground-key canonical signs',()=>{
  const f=fixture({x:-16,y:20,z:-16,kind:'glowmoss',group:'ground-cover'}),r=f.plan();
  assert.equal(r.ok,true);
  assert.deepEqual(new Set(r.sourceGroundRevisions.map(([k])=>k)),new Set(['-1,-1','-2,-1','-1,-2']));
});

test('caller cannot spoof a remote player eye to mine blocks across the world',()=>{
  const f=fixture();
  assert.throws(()=>f.plan({eye:[12000,240,-12000]}),/actual current original player eye/);
});
test('original player moving while selection callback runs cancels mine despite unchanged world revision',()=>{
  const f=fixture();f.setRayHook(n=>{if(n===2)f.changePlayerEye([1,71,4])});
  assert.throws(()=>f.plan(),/original player moved/);
});
test('placing with stale body position cannot bypass original player collision authority',()=>{
  const f=fixture();
  assert.throws(()=>f.plan({action:'place',blockId:370,playerBody:{x:999,feet:40,z:0}}),
    /actual current original player eye and body/);
});
test('host changing the same mutable native ray result on second call cannot rewrite selected target',()=>{
  const f=fixture(),same={hit:[...f.point],adjacent:[...f.adjacent],distance:3};
  f.setHit(same);f.setRayHook(n=>{if(n===2){same.hit[0]+=1;same.adjacent[0]+=1;}});
  assert.throws(()=>f.plan(),/original physical ray selection changed/);
});
test('host mutating the same live player body object during the ray is detected',()=>{
  const f=fixture(),liveBody={x:.5,feet:72,z:1};f.changePlayerBody(liveBody);
  f.setRayHook(n=>{if(n===2)liveBody.x+=.25});
  assert.throws(()=>f.plan(),/original player moved/);
});
