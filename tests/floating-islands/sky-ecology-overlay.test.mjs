import test from 'node:test';
import assert from 'node:assert/strict';
import {planCertifiedSkyVegetation} from '../../src/floating-islands/sky-certified-flora.mjs';
import {createCertifiedSkyEcologyOverlay} from '../../src/floating-islands/sky-ecology-overlay.mjs';
import {skyIslandSectionForY,skyIslandMeshKey} from '../../src/floating-islands/sky-runtime-adapter.mjs';
const full=[0,0,0,1,1,1];
const TYPES={
  'windbent-pine':{trunk:370,leaves:379},'cloudleaf-tree':{trunk:376,leaves:385},
  'starbloom-tree':{trunk:375,leaves:384},glowmoss:{'ground-cover':287}
};
function fixture(placements=[{kind:'windbent-pine',group:'canopy',x:12000,y:51,z:-14000}]){
  let worldToken='seed179#live',fingerprint='immutable-Islands-generator-example',epoch=2,worldRev=5;
  const sectionRev=new Map(),blockChanges=new Map(),protectedCells=new Set();
  const k=(x,y,z)=>`${x},${y},${z}`;
  const naturalGet=(x,y,z)=>blockChanges.has(k(x,y,z))?blockChanges.get(k(x,y,z)):y===50?3:0;
  const world={
    readIdentity:()=>({seed:179,worldToken,generatorFingerprint:fingerprint,epoch}),
    readWorldRevision:()=>worldRev,sectionRevision:k=>sectionRev.get(k)??1,
    naturalGet,
    get:naturalGet,
    isProtectedCell:(x,y,z)=>protectedCells.has(k(x,y,z)),
    verifyCompleteIsland:()=>true,
    validateId:n=>[0,3,287,370,379,375,384,376,385].includes(n)?n:null,
    rotationAllowed:n=>n>=256
  };
  const materials={
    blockFor:n=>n===3?{solid:true,boxes:[full]}:null,
    assetFor:(kind,role)=>TYPES[kind]?.[role],
    isPhysicalAsset:n=>n>0&&n<=385,
    filterSupportedVegetation:p=>{
      const accepted=p.placements.filter(q=>q.group==='canopy'?Boolean(TYPES[q.kind]?.trunk):
        Boolean(TYPES[q.kind]?.['ground-cover']));
      return {placements:accepted,omitted:p.placements.length-accepted.length};
    }
  };
  const plan={placements};
  const cert=()=>planCertifiedSkyVegetation({seed:179,plan,source:world,materials});
  const stage=(extra={})=>createCertifiedSkyEcologyOverlay({certificate:cert(),source:world,...extra});
  return {world,cert,stage,blockChanges,protectedCells,sectionRev,
    changeWorld:s=>{worldToken=s;},changeFingerprint:s=>{fingerprint=s;},
    changeEpoch:n=>{epoch=n;},changeRevision:n=>{worldRev=n;}};
}
test('authenticated natural pine becomes real trunk and leaf voxels, never player edits',()=>{
  const x=fixture(),o=x.stage();
  assert.equal(o.readCell(12000,51,-14000).id,370);
  assert.equal(o.readCell(12000,51,-14000).layer,'ecology');
  assert.ok(o.naturalCells.some(row=>row.id===379));
  assert.equal(o.copyPlayerEdits().size,0);
  assert.equal(o.metrics.worldWrites,0);assert.equal(o.metrics.skySaveWrites,0);
});
test('moss is source-authored physical flora and has no invented grass IDs',()=>{
  const x=fixture([{kind:'glowmoss',group:'ground-cover',x:12010,y:51,z:-14010}]);
  const o=x.stage();assert.equal(o.get(12010,51,-14010),287);
  assert.equal(o.readCell(12010,51,-14010).layer,'ecology');
});
test('mining a natural trunk uses explicit AIR edit precedence while natural baseline survives',()=>{
  const x=fixture(),pos='12000,51,-14000',e=new Map([[pos,0]]);
  const o=x.stage({playerEdits:e});
  assert.equal(o.naturalAt(12000,51,-14000),370);
  assert.equal(o.get(12000,51,-14000),0);
  assert.equal(o.readCell(12000,51,-14000).layer,'player');
  assert.equal(o.copyPlayerEdits().get(pos),0);
});
test('original player placement overrides real canopy and retains native rotation',()=>{
  const x=fixture(),c=x.cert();const leaf=c.candidate.edits.find(r=>r.id===379);
  assert.ok(leaf);const cell=`${leaf.x},${leaf.y},${leaf.z}`;
  const o=createCertifiedSkyEcologyOverlay({certificate:c,source:x.world,
    playerEdits:new Map([[cell,370]]),playerRotations:new Map([[cell,3]])});
  assert.equal(o.naturalAt(leaf.x,leaf.y,leaf.z),379);
  assert.equal(o.get(leaf.x,leaf.y,leaf.z),370);
  assert.equal(o.rotationAt(leaf.x,leaf.y,leaf.z),3);
});
test('natural generator stone always remains authoritative where ecology has no block',()=>{
  const x=fixture(),o=x.stage();assert.equal(o.get(12000,50,-14000),3);
  assert.equal(o.readCell(12000,50,-14000).layer,'generator');
});
test('player saved edit views are unaliased copies and cannot modify cached natural flora',()=>{
  const x=fixture(),user=new Map([['12000,51,-14000',0]]),o=x.stage({playerEdits:user});
  user.clear();o.copyPlayerEdits().clear();
  assert.equal(o.get(12000,51,-14000),0);
  assert.equal(o.copyPlayerEdits().size,1);
});
test('mined entire tree leaf does not cause unrelated natural tree to disappear',()=>{
  const a={kind:'windbent-pine',group:'canopy',x:12000,y:51,z:-14000};
  const b={kind:'cloudleaf-tree',group:'canopy',x:12015,y:51,z:-14015};
  const x=fixture([a,b]),cert=x.cert();
  assert.equal(cert.candidate.treeCount,2);
  const leaf=cert.candidate.edits.find(r=>r.id===379),cell=`${leaf.x},${leaf.y},${leaf.z}`;
  const o=createCertifiedSkyEcologyOverlay({certificate:cert,source:x.world,playerEdits:new Map([[cell,0]])});
  assert.equal(o.get(leaf.x,leaf.y,leaf.z),0);
  assert.ok(o.naturalCells.some(r=>r.id===385));
  assert.equal(o.metrics.worldWrites,0);
});
test('right-of-origin source coordinates beyond signed 10,000 preserve exact source keys',()=>{
  const x=fixture(),o=x.stage();
  assert.ok(o.certifiedSkyKeys.some(k=>k.startsWith('sky:750,-875,')));
  assert.equal(o.naturalAt(12000,51,-14000),370);
});
test('negative coordinates and 3D seam share physical original section grammar',()=>{
  const x=fixture([{kind:'windbent-pine',group:'canopy',x:0,y:35,z:0}]);
  const old=x.world.naturalGet;x.world.naturalGet=(a,b,c)=>b===34?3:0;
  x.world.get=(a,b,c)=>b===34?3:0;
  const o=x.stage();
  assert.ok(o.certifiedSkyKeys.includes('sky:-1,-1,0'));
  assert.ok(o.certifiedSkyKeys.includes('sky:0,0,1'));
  assert.ok(o.affectedSkyKeys.length>0);
});
test('stale generator identity after source cert rejects even if coordinates match',()=>{
  const x=fixture(),c=x.cert();x.changeFingerprint('new-islands-v7');
  assert.throws(()=>createCertifiedSkyEcologyOverlay({certificate:c,source:x.world}),/stale source proof/);
});
test('original-world change after certificate rejects stale ecology',()=>{
  const x=fixture(),c=x.cert();x.changeWorld('seed2026#live');
  assert.throws(()=>createCertifiedSkyEcologyOverlay({certificate:c,source:x.world}),/stale source proof/);
});
test('world edit revision change after certification rejects stale ecology',()=>{
  const x=fixture(),c=x.cert();x.changeRevision(6);
  assert.throws(()=>createCertifiedSkyEcologyOverlay({certificate:c,source:x.world}),/stale source proof/);
});
test('single section edit revision mutation invalidates exact canopy key',()=>{
  const x=fixture(),c=x.cert(),key=c.sourceProof.sectionRevisions[0][0];
  x.sectionRev.set(key,2);
  assert.throws(()=>createCertifiedSkyEcologyOverlay({certificate:c,source:x.world}),/section revision changed/);
});
test('source mutating during flora overlay construction rejects untrusted read result',()=>{
  const x=fixture(),c=x.cert();const old=x.world.naturalGet;
  x.world.naturalGet=(a,b,d)=>{x.changeRevision(9);return old(a,b,d)};
  assert.throws(()=>createCertifiedSkyEcologyOverlay({certificate:c,source:x.world}),/source mutated/);
});
test('section revision mutating during geometry source sampling rejects proposal',()=>{
  const x=fixture(),c=x.cert(),old=x.world.naturalGet;
  x.world.naturalGet=(a,b,d)=>{x.sectionRev.set(c.sourceProof.sectionRevisions[0][0],2);return old(a,b,d)};
  assert.throws(()=>createCertifiedSkyEcologyOverlay({certificate:c,source:x.world}),/section changed during/);
});
test('future section revision invalidates previously constructed overlay on demand',()=>{
  const x=fixture(),o=x.stage();assert.equal(o.assertFresh(),true);
  x.sectionRev.set(o.certifiedSkyKeys[0],2);
  assert.throws(()=>o.assertFresh(),/overlay stale/);
});
test('generator churn after overlay invalidates before next renderer mesh publication',()=>{
  const x=fixture(),o=x.stage();x.changeEpoch(9);
  assert.throws(()=>o.assertFresh(),/overlay stale/);
});
test('duplicate candidate geometry cannot overwrite another natural cell',()=>{
  const x=fixture(),c=x.cert();const row=c.candidate.edits[0];
  const dup={...c,candidate:{...c.candidate,edits:[row,row]}};
  assert.throws(()=>createCertifiedSkyEcologyOverlay({certificate:dup,source:x.world}),/duplicate natural/);
});
test('unverified flora coordinate outside true section revision footprint is denied',()=>{
  const x=fixture(),c=x.cert();const row={...c.candidate.edits[0],x:-9000};
  const forged={...c,candidate:{...c.candidate,edits:[row]}};
  assert.throws(()=>createCertifiedSkyEcologyOverlay({certificate:forged,source:x.world}),/outside certified/);
});
test('player edit keys must be canonical and cannot alias an AIR override',()=>{
  const x=fixture();for(const bad of ['012000,51,-14000','12000.0,51,-14000','12000,051,-14000','12000,19,-14000']){
    assert.throws(()=>x.stage({playerEdits:new Map([[bad,0]])}),/noncanonical/);
  }
});
test('unregistered player edit IDs and orphaned rotations are hard rejected',()=>{
  const x=fixture();assert.throws(()=>x.stage({playerEdits:new Map([['12000,51,-14000',5555]])}),/unregistered/);
  assert.throws(()=>x.stage({playerRotations:new Map([['12000,51,-14000',2]])}),/bounded, separate/);
});
test('provisional player sidecar cap is enforced and remains separate from natural flora quota',()=>{
  const x=fixture(),edits=new Map();for(let i=0;i<8193;i++)edits.set(`${i},70,0`,0);
  assert.throws(()=>x.stage({playerEdits:edits}),/bounded, separate/);
  const good=x.stage({playerEdits:new Map([['12000,51,-14000',0]])});
  assert.ok(good.metrics.certifiedCells>1);
  assert.equal(good.metrics.playerOverrides,1);
});
test('signed halo invalidations reach x/z and y neighbor sections across all seams',()=>{
  const x=fixture([{kind:'windbent-pine',group:'canopy',x:0,y:35,z:0}]);
  x.world.naturalGet=(a,b,c)=>b===34?3:0;x.world.get=x.world.naturalGet;
  const o=x.stage();assert.ok(o.affectedSkyKeys.includes('sky:-1,0,0'));
  assert.ok(o.affectedSkyKeys.includes('sky:0,0,1'));
});
test('uncertified altered geometry ID cannot appear, even when within supported ID range',()=>{
  const x=fixture(),c=x.cert(),row={...c.candidate.edits[0],id:65534};
  assert.throws(()=>createCertifiedSkyEcologyOverlay({certificate:{...c,candidate:{...c.candidate,edits:[row]}},source:x.world}),/unsupported original/);
});
test('original ground lighting and existing sky cycle remain untouched',()=>{
  const x=fixture(),o=x.stage();assert.equal(o.lightingPolicy.darkenGroundUnderIslands,false);
  assert.equal(o.lightingPolicy.shadowDrawPasses,0);
  assert.equal(o.metrics.gpuUploads,0);
  assert.ok(!Object.hasOwn(o,'set')&&!Object.hasOwn(o,'save'));
});
test('exact sky section geometry boundary is unchanged at Y35/36',()=>{
  assert.equal(skyIslandSectionForY(35),0);
  assert.equal(skyIslandSectionForY(36),1);
  assert.equal(skyIslandMeshKey(-1,-1,1),'sky:-1,-1,1');
});
