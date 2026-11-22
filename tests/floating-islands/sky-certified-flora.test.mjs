import test from 'node:test';
import assert from 'node:assert/strict';
import {planCertifiedSkyVegetation} from '../../src/floating-islands/sky-certified-flora.mjs';

const full=[0,0,0,1,1,1];
const ids={
  'windbent-pine':{trunk:370,leaves:379},
  'cloudleaf-tree':{trunk:376,leaves:385},
  'starbloom-tree':{trunk:375,leaves:384},
  glowmoss:{'ground-cover':287}
};
const t=(kind,x=12000,y=51,z=-14000)=>({kind,group:'canopy',x,y,z});
const ground=(kind,x=12005,y=51,z=-14005)=>({kind,group:'ground-cover',x,y,z});
function setup(placements=[t('windbent-pine')]){
  let sourceSeed=179,worldToken='seed179:original',generatorFingerprint='source-M7-exact:mock',epoch=8,
    worldRevision=4,sourceReads=0,sectionReads=0,verified=0,writes=0;
  let verifyIsland=true,supportId=3;
  const revisions=new Map(),protectedCells=new Set(),blockedCells=new Map();
  const source={
    readIdentity:()=>({seed:sourceSeed,worldToken,generatorFingerprint,epoch}),
    readWorldRevision:()=>worldRevision,
    sectionRevision:key=>{sectionReads++;return revisions.get(key)??1;},
    verifyCompleteIsland:()=>{verified++;return verifyIsland;},
    get:(x,y,z)=>{sourceReads++;return blockedCells.get(`${x},${y},${z}`)??(y===50?supportId:0);},
    isProtectedCell:(x,y,z)=>protectedCells.has(`${x},${y},${z}`)
  };
  const materials={
    assetFor:(kind,role)=>ids[kind]?.[role],
    isPhysicalAsset:id=>Number.isInteger(id)&&id>0&&id<=385,
    blockFor:id=>id===3?{solid:true,boxes:[full]}:id===287?{solid:false,boxes:[[0,0,0,1,.11,1]]}:
      id===379?{solid:false,boxes:[[.25,0,.25,.75,1,.75]]}:null,
    filterSupportedVegetation:plan=>{
      const rows=plan.placements.filter(p=>p.group==='canopy'?
        ids[p.kind]?.trunk&&ids[p.kind]?.leaves:ids[p.kind]?.['ground-cover']);
      return {placements:rows,omitted:plan.placements.length-rows.length};
    }
  };
  const plan={placements};
  const run=(over={})=>planCertifiedSkyVegetation({seed:179,plan,source,materials,...over});
  return {run,plan,source,materials,revisions,protectedCells,blockedCells,
    setWorldToken:x=>{worldToken=x;},setFingerprint:x=>{generatorFingerprint=x;},
    setEpoch:x=>{epoch=x;},setSeed:x=>{sourceSeed=x;},setWorldRevision:x=>{worldRevision=x;},
    setVerifyIsland:x=>{verifyIsland=x;},setSupportId:x=>{supportId=x;},
    get reads(){return sourceReads},get revisionsRead(){return sectionReads},
    get verified(){return verified},get writes(){return writes}};
}

test('actual physical pine canopy on original full-cube stone uses registered trunk and foliage IDs',()=>{
  const x=setup();const result=x.run();
  assert.equal(result.candidate.treeCount,1);
  assert.ok(result.candidate.edits.some(p=>p.id===370));
  assert.ok(result.candidate.edits.some(p=>p.id===379));
  assert.ok(result.candidate.edits.every(p=>p.x>11000&&p.z<-13000));
  assert.equal(result.omittedUnsupportedRoots.length,0);
  assert.equal(result.shadowPasses,0);
  assert.equal(result.worldWrites,0);
  assert.equal(result.saveWrites,0);
});
test('cutout pine needles under root are non-solid: tree is not planted on foliage',()=>{
  const x=setup();x.setSupportId(379);
  const r=x.run();assert.equal(r.candidate.edits.length,0);
  assert.equal(r.omittedUnsupportedRoots.length,1);
});
test('star-moss is physical yet non-solid and cannot certify a tree root',()=>{
  const x=setup();x.setSupportId(287);
  assert.equal(x.run().candidate.treeCount,0);
});
test('top of a thin pine post cannot support the large rooted center',()=>{
  const x=setup();x.setSupportId(22);
  x.materials.blockFor=id=>id===22?{solid:true,boxes:[[.45,0,.45,.55,1,.55]]}:null;
  assert.equal(x.run().candidate.edits.length,0);
});
test('real large top but split union of several solid boxes can support a root',()=>{
  const x=setup();x.setSupportId(22);
  x.materials.blockFor=id=>id===22?{solid:true,boxes:[
    [0,0,0,.5,1,1],[.5,0,0,1,1,1]]}:null;
  assert.equal(x.run().candidate.treeCount,1);
});
test('unsupported fake flora are omitted rather than given invented IDs',()=>{
  const x=setup([t('cloudleaf-tree'),ground('windgrass-tuft'),ground('glowmoss')]);
  const r=x.run();assert.equal(r.omittedUnregistered,1);
  assert.equal(r.candidate.treeCount,1);
  assert.ok(r.candidate.edits.some(e=>e.id===376));
  assert.ok(r.candidate.edits.some(e=>e.id===385));
  assert.ok(r.candidate.edits.some(e=>e.id===287));
});
test('complete source certification is mandatory; one missing section rejects',()=>{
  const x=setup();x.setVerifyIsland(false);
  assert.throws(()=>x.run(),/incomplete or unverified original island/);
  assert.equal(x.reads,0);
});
test('corrupt or missing physical original support box data fails closed',()=>{
  const x=setup();x.materials.blockFor=()=>({solid:true,boxes:[[0,0,0,2,1,1]]});
  assert.throws(()=>x.run(),/invalid original physical support boxes/);
});
test('source world mutation DURING support reading aborts proposed ecology',()=>{
  const x=setup();const old=x.source.get;
  x.source.get=(a,b,c)=>{x.setWorldRevision(5);return old(a,b,c);};
  assert.throws(()=>x.run(),/changed during foliage planning/);
});
test('source section revision mutation during candidate planning aborts proposal',()=>{
  const x=setup();const old=x.source.get;
  x.source.get=(a,b,c)=>{x.revisions.set('sky:750,-875,1',2);return old(a,b,c);};
  assert.throws(()=>x.run(),/changed during foliage planning/);
});
test('source fingerprint switch during physical material read blocks output',()=>{
  const x=setup();const old=x.materials.assetFor;
  x.materials.assetFor=(k,r)=>{x.setFingerprint('generator-other-world');return old(k,r);};
  assert.throws(()=>x.run(),/changed during foliage planning/);
});
test('exact 3-dimensional seam halo includes all eight x/z/section owner keys',()=>{
  const x=setup([t('windbent-pine',0,35,0)]);x.source.get=(a,b,c)=>b===34?3:0;
  const r=x.run();assert.equal(r.candidate.treeCount,1);
  const keys=r.sourceProof.sectionRevisions.map(row=>row[0]);
  assert.equal(keys.length,8);
  for(const k of ['sky:-1,-1,0','sky:-1,-1,1','sky:0,0,0','sky:0,0,1'])
    assert.ok(keys.includes(k));
});
test('root on a protected authored voxel cannot be used',()=>{
  const x=setup();x.protectedCells.add('12000,50,-14000');
  assert.equal(x.run().candidate.treeCount,0);
});
test('mined AIR at original island surface vetoes unsupported tree',()=>{
  const x=setup();x.blockedCells.set('12000,50,-14000',0);
  assert.equal(x.run().candidate.treeCount,0);
});
test('protected crown leaf refuses ENTIRE tree, not a partial trunk',()=>{
  const x=setup();x.protectedCells.add('12000,55,-14000');
  assert.equal(x.run().candidate.treeCount,0);
  assert.equal(x.run().candidate.edits.length,0);
});
test('world and revision proof is immutable and has no write capability',()=>{
  const x=setup(),r=x.run();
  assert.equal(r.sourceProof.worldToken,'seed179:original');
  assert.equal(r.sourceProof.generatorFingerprint,'source-M7-exact:mock');
  assert.equal(r.sourceProof.worldRevision,4);
  assert.ok(Object.isFrozen(r.sourceProof.sectionRevisions));
  assert.ok(Object.isFrozen(r.candidate.edits));
  assert.equal(x.writes,0);
});
test('bounded physical proposal rejects huge input and does not spawn by itself',()=>{
  const x=setup(Array.from({length:65},(_,i)=>ground('glowmoss',i,40,i)));
  assert.throws(()=>x.run(),/complete island physical source/);
});
test('true geometry ceiling denies overflowed canopy without partial cliff foliage',()=>{
  const x=setup([t('starbloom-tree',10,255,10)]);x.source.get=(a,b,c)=>b===254?3:0;
  const r=x.run();assert.equal(r.candidate.treeCount,0);
  assert.equal(r.candidate.edits.length,0);
});

test('surface certification callback cannot mutate original island identity unnoticed',()=>{
  const x=setup();x.source.verifyCompleteIsland=()=>{x.setWorldRevision(6);return true;};
  assert.throws(()=>x.run(),/changed during foliage planning/);
});

test('caller seed must match signed original source world seed, not simply token text',()=>{
  const x=setup();x.setSeed(2026);
  assert.throws(()=>x.run(),/seed differs from original world/);
  assert.equal(x.reads,0);
});
test('host callback cannot rewrite immutable source-certified anchor positions',()=>{
  const x=setup();x.source.verifyCompleteIsland=plan=>{
    plan.placements[0].x=13;return true;
  };
  assert.throws(()=>x.run(),/read only|Cannot assign/);
  assert.equal(x.reads,0);
});
