import test from 'node:test';
import assert from 'node:assert/strict';
import {createOriginalSkyFloraAuthority,planOriginalSkyEcology}
  from '../../src/floating-islands/sky-original-flora-authority.mjs';
const ids={'windbent-pine':{trunk:370,leaves:379},'cloudleaf-tree':{trunk:376,leaves:385},
 'starbloom-tree':{trunk:375,leaves:384},glowmoss:{'ground-cover':287}};
const blocks=new Map([
 [370,{blockId:370,solid:true,boxes:[[.25,0,.25,.75,1,.75]]}],
 [379,{blockId:379,solid:false,boxes:[[.16,.15,.3,.84,.94,.74]]}],
 [287,{blockId:287,solid:false,boxes:[[.06,0,.06,.94,.11,.94]]}],
 [376,{blockId:376,solid:true,boxes:[[.25,0,.25,.75,1,.75]]}],
 [385,{blockId:385,solid:false,boxes:[[.15,.2,.2,.85,.93,.8]]}],
 [375,{blockId:375,solid:true,boxes:[[.3,0,.3,.7,1,.7]]}],
 [384,{blockId:384,solid:false,boxes:[[.1,.2,.2,.9,.8,.8]]}]
]);
const m={assetFor:(kind,role)=>ids[kind]?.[role],
  isPhysicalAsset:id=>blocks.has(id),
  filterSupportedVegetation:plan=>({placements:plan.placements.filter(p=>
    p.group==='canopy'?ids[p.kind]?.trunk&&ids[p.kind]?.leaves:
      ids[p.kind]?.['ground-cover']),omitted:plan.placements.filter(p=>
        p.group==='canopy'?!ids[p.kind]?.trunk||!ids[p.kind]?.leaves:
          !ids[p.kind]?.['ground-cover']).length})};
const authority=()=>createOriginalSkyFloraAuthority({
  biome130Block:id=>blocks.get(id),isBiome130BlockId:id=>blocks.has(id),materials:m});
test('actual listed pine, moonwillow and blackwood are exactly original numeric block IDs',()=>{
  const a=authority();
  for(const [kind,log,leaves] of [['windbent-pine',370,379],['cloudleaf-tree',376,385],
    ['starbloom-tree',375,384]]){
    assert.equal(a.assetFor(kind,'trunk'),log);
    assert.equal(a.assetFor(kind,'leaves'),leaves);
    assert.equal(a.blockFor(log).solid,true);
    assert.equal(a.blockFor(leaves).solid,false);
  }
});
test('original star moss 287 is cutout/non-solid and never a tree foundation',()=>{
  const a=authority();assert.equal(a.blockFor(287).solid,false);
  assert.equal(a.assetFor('glowmoss','ground-cover'),287);
});
test('legacy original stone, grass and soil support trees, leaves and crystal do not',()=>{
  const a=authority();
  for(const id of [1,2,3,4,6,8])assert.equal(a.blockFor(id).solid,true);
  for(const id of [0,5,7,9,255,65535])assert.equal(a.blockFor(id),null);
});
test('forged original biome registration identity is refused before planting',()=>{
  const authority=createOriginalSkyFloraAuthority({
    biome130Block:id=>({blockId:id+1,solid:true,boxes:[[0,0,0,1,1,1]]}),
    isBiome130BlockId:()=>true,materials:m});
  assert.throws(()=>authority.blockFor(370),/mismatched/);
});
test('physically registered flora roles never fabricate missing flowers or grasses',()=>{
  const a=authority();
  const p={placements:[{kind:'windgrass-tuft',group:'ground-cover'},
    {kind:'glowmoss',group:'ground-cover'}]};
  const x=a.filterSupportedVegetation(p);
  assert.equal(x.omitted,1);assert.equal(x.placements[0].kind,'glowmoss');
  assert.equal(a.assetFor('skybell-flowers','ground-cover'),undefined);
});
test('original-world sky AIR override is used, never an alternate stale generator get()',()=>{
  const a=authority();let alternativeReads=0;
  const host={world:{get:(x,y,z)=>y===50?0:0}};
  const source={physicalWorld:host.world,readIdentity:()=>({seed:179,worldToken:'w',generatorFingerprint:'g',epoch:0}),
    readWorldRevision:()=>1,sectionRevision:()=>1,
    verifyCompleteIsland:()=>true,isProtectedCell:()=>false,
    get:()=>{alternativeReads++;return 3;}};
  const p={placements:[{kind:'windbent-pine',group:'canopy',x:0,y:51,z:0}]};
  const r=planOriginalSkyEcology({physicalHost:host,source,materials:a,seed:179,plan:p});
  assert.equal(r.candidate.treeCount,0);assert.equal(alternativeReads,0);
});
test('source merged original-world stone + real pine assets create physical tree proposals',()=>{
  const a=authority();
  const host={world:{get:(x,y,z)=>y===50?3:0}};
  const source={physicalWorld:host.world,readIdentity:()=>({seed:179,worldToken:'w',generatorFingerprint:'g',epoch:0}),
    readWorldRevision:()=>1,sectionRevision:()=>1,
    verifyCompleteIsland:()=>true,isProtectedCell:()=>false};
  const p={placements:[{kind:'windbent-pine',group:'canopy',x:13000,y:51,z:-12000}]};
  const r=planOriginalSkyEcology({physicalHost:host,source,materials:a,seed:179,plan:p});
  assert.equal(r.candidate.treeCount,1);
  assert.equal(r.candidate.renderOnlyMeshes,0);assert.equal(r.shadowPasses,0);
});
test('physical flora compatibility layer is source-only with zero writes and no save methods',()=>{
  const a=authority();assert.equal(Object.isFrozen(a),true);
  assert.ok(!Object.hasOwn(a,'save'));
  assert.ok(!Object.hasOwn(a,'spawn'));
});

test('source identity cannot be mixed with a different original physical world object',()=>{
  const a=authority();const host={world:{get:()=>0}},source={physicalWorld:{get:()=>0},
    readIdentity:()=>({seed:179,worldToken:'w',generatorFingerprint:'g',epoch:0}),
    readWorldRevision:()=>0,sectionRevision:()=>0,
    isProtectedCell:()=>false,verifyCompleteIsland:()=>true};
  assert.throws(()=>planOriginalSkyEcology({physicalHost:host,source,materials:a,seed:179,
    plan:{placements:[]}}),/actual merged original world/);
});
test('source reader functions keep their original receiver and world epoch',()=>{
  const a=authority(),host={world:{get:(x,y,z)=>y===50?3:0}};
  const source={physicalWorld:host.world,identity:{seed:179,worldToken:'w',generatorFingerprint:'g',epoch:0},
    rev:2,readIdentity(){return this.identity;},readWorldRevision(){return this.rev;},
    sectionRevision(){return this.rev;},isProtectedCell(){return false;},
    verifyCompleteIsland(){return true;}};
  const result=planOriginalSkyEcology({physicalHost:host,source,materials:a,seed:179,
    plan:{placements:[{kind:'windbent-pine',group:'canopy',x:100,y:51,z:100}]}});
  assert.equal(result.candidate.treeCount,1);
  assert.equal(result.sourceProof.worldRevision,2);
});
