import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,meshChunk,raycast,collides} from '../src/voxel.mjs';
import {sectionBounds,sectionForY,sectionWindow,verticalEditSections,WORLD_MAX_Y} from '../src/depth.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {definePrototypePyramid,prototypePyramidBlock} from '../src/manual-biomes/forgotten-sands-monument-prototype.mjs';
import {P0_UPPER_MIN_Y,P0_UPPER_MAX_Y,P0_PREFLIGHT_VOXEL_LIMIT,
  p0UpperSectionBounds,p0UpperSectionForY,p0SectionsForEdit,p0SectionKey,
  meshP0UpperSection,createP0UpperOnlyView,preflightP0UpperOnly,
  planP0VerticalResidence} from '../src/manual-biomes/forgotten-sands-upper-probe.mjs';

test('original depth ABI stays byte-identical while new bounds are research-only',()=>{
  assert.equal(WORLD_MAX_Y,19);
  assert.deepEqual(sectionBounds(0),{minY:-3,maxY:19});
  assert.equal(sectionForY(20),null);
  assert.deepEqual(sectionWindow(10),[0]);
  assert.equal(P0_UPPER_MIN_Y,20);
  assert.equal(P0_UPPER_MAX_Y,147);
  assert.deepEqual(p0UpperSectionBounds(1),{minY:20,maxY:35});
  assert.deepEqual(p0UpperSectionBounds(2),{minY:36,maxY:51});
  assert.deepEqual(p0UpperSectionBounds(8),{minY:132,maxY:147});
  assert.equal(p0UpperSectionForY(19),null);
  assert.equal(p0UpperSectionForY(20),1);
  assert.equal(p0UpperSectionForY(35.9),1);
  assert.equal(p0UpperSectionForY(36),2);
  assert.equal(p0UpperSectionForY(147.999),8);
  assert.equal(p0UpperSectionForY(148),null);
  assert.equal(p0SectionKey(-2,3,0),'-2,3');
  assert.equal(p0SectionKey(-2,3,1),'-2,3,1');
  assert.throws(()=>p0UpperSectionBounds(0));
  assert.throws(()=>p0SectionKey(0,0,-1));
});

test('vertical section invalidation names both sides of original and upper seams',()=>{
  for(const y of [-210,-19,-4,-3,0,18])
    assert.deepEqual(p0SectionsForEdit(y),verticalEditSections(y));
  assert.deepEqual(p0SectionsForEdit(19),[0,1]);
  assert.deepEqual(p0SectionsForEdit(20),[1,0]);
  assert.deepEqual(p0SectionsForEdit(35),[1,2]);
  assert.deepEqual(p0SectionsForEdit(36),[2,1]);
  assert.deepEqual(p0SectionsForEdit(147),[8]);
  assert.deepEqual(p0SectionsForEdit(148),[]);
});

test('original native meshChunk and native depth mesher share an occluded Y19/20 face',()=>{
  const world={seed:179,get:(x,y,z)=>x===0&&z===0&&(y===19||y===20)?BLOCK.STONE:BLOCK.AIR};
  const surface=meshChunk(world,0,0);
  const above=meshP0UpperSection(world,0,0,1);
  assert.equal(surface.length,5*6*9);
  assert.equal(above.length,5*6*9);
  assert.ok([...above].every(Number.isFinite));
  assert.ok([...above].filter((_,i)=>i%9===1).every(y=>y>=20&&y<=21));
  const separate={seed:179,get:(x,y,z)=>x===0&&z===0&&y===20?BLOCK.STONE:BLOCK.AIR};
  assert.equal(meshP0UpperSection(separate,0,0,1).length,6*6*9);
});

test('original depth mesher upper adapter culls X15/16 and Y35/36 seams',()=>{
  const horizontal={seed:179,get:(x,y,z)=>z===0&&y===22&&(x===15||x===16)?BLOCK.STONE:BLOCK.AIR};
  assert.equal(meshP0UpperSection(horizontal,0,0,1).length,5*6*9);
  assert.equal(meshP0UpperSection(horizontal,1,0,1).length,5*6*9);
  const vertical={seed:179,get:(x,y,z)=>x===0&&z===0&&(y===35||y===36)?BLOCK.STONE:BLOCK.AIR};
  assert.equal(meshP0UpperSection(vertical,0,0,1).length,5*6*9);
  assert.equal(meshP0UpperSection(vertical,0,0,2).length,5*6*9);
  assert.equal(meshP0UpperSection(vertical,-30,-30,2).length,0);
});

test('native M7 FourRegionWorld remains authoritative below 20, including canonical edits',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const original=new FourRegionWorld(seed,profile);
  const site=definePrototypePyramid({seed,x:15,z:-16,baseY:20,size:31,height:26});
  const baseline=[[15,19,-16],[15,0,-16],[-17,-3,16]].map(pos=>original.get(...pos));
  assert.equal(original.get(15,20,-16),BLOCK.AIR);
  const state=preflightP0UpperOnly(original,site);
  assert.equal(state.accepted,true,state.reason);
  assert.ok(state.scanned>0&&state.scanned<P0_PREFLIGHT_VOXEL_LIMIT);
  const bytes=JSON.stringify(original.save());
  const view=createP0UpperOnlyView(original,site);
  assert.equal(view.get(15,20,-16),prototypePyramidBlock(site,15,20,-16));
  assert.equal(original.get(15,20,-16),BLOCK.AIR);
  assert.deepEqual([[15,19,-16],[15,0,-16],[-17,-3,16]].map(pos=>view.get(...pos)),baseline);
  assert.equal(JSON.stringify(original.save()),bytes);
  assert.equal(typeof view.set,'undefined');
  assert.equal(typeof view.save,'undefined');
  assert.equal(collides(original,15.5,20,-15.5),false);
  assert.equal(collides(view,15.5,20,-15.5),true);
  const hit=raycast(view,[15.5,19.5,-15.5],[0,1,0],6);
  assert.equal(hit?.hit?.[1],20);
  assert.equal(original.set(15,19,-16,BLOCK.WOOD),true);
  assert.equal(view.get(15,19,-16),BLOCK.WOOD);
  const restored=restoreFourRegionWorld(original.save(),profile);
  assert.equal(restored.get(15,19,-16),BLOCK.WOOD);
  assert.equal(original.get(15,0,-16),baseline[1]);
});

test('native legacy VoxelWorld seed and schema-1 delta remain unaffected',()=>{
  const original=new VoxelWorld(2026);
  const site=definePrototypePyramid({seed:2026,x:-33,z:17,baseY:20,size:31,height:26});
  const before=JSON.stringify(original.save());
  const view=createP0UpperOnlyView(original,site);
  const above=meshP0UpperSection(view,-3,1,1);
  assert.equal(above.length%27,0);
  assert.ok(above.length>0);
  assert.ok(above.byteLength<4*1024*1024);
  assert.ok([...above].every(Number.isFinite));
  assert.equal(JSON.stringify(original.save()),before);
  const clone=VoxelWorld.restore(original.save());
  assert.equal(clone.get(-33,20,17),BLOCK.AIR);
});

test('whole-site admission refuses reserved or occupied upper blocks before any mesh',()=>{
  const site=definePrototypePyramid({seed:179,x:0,z:0,baseY:20,size:15,height:12});
  const base={seed:179,edits:new Map(),get:()=>BLOCK.AIR};
  assert.equal(preflightP0UpperOnly(base,site).accepted,true);
  assert.deepEqual(preflightP0UpperOnly({...base,seed:1},site).accepted,false);
  const occupied={...base,get:(x,y,z)=>x===0&&y===20&&z===0?BLOCK.STONE:BLOCK.AIR};
  assert.deepEqual(preflightP0UpperOnly(occupied,site).reason,'Existing upper occupancy');
  const denied=preflightP0UpperOnly(base,site,{veto:(x,y,z)=>x===0&&y===20&&z===0});
  assert.deepEqual(denied.reason,'Reserved or protected upper cell');
  assert.throws(()=>createP0UpperOnlyView(occupied,site),/refused/);
});

test('150k-cell preflight cap explicitly refuses giant physical occupancy proofs',()=>{
  const site=definePrototypePyramid({seed:2026,x:-8,z:15,baseY:20,size:111,height:90});
  let reads=0;
  const outcome=preflightP0UpperOnly({seed:2026,get:()=>{reads++;return BLOCK.AIR;}},site);
  assert.equal(outcome.accepted,false);
  assert.match(outcome.reason,/cell cap/);
  assert.equal(outcome.scanned,P0_PREFLIGHT_VOXEL_LIMIT+1);
  assert.equal(reads,P0_PREFLIGHT_VOXEL_LIMIT);
});

test('resident plan preserves untouched surface and caps upper approach to 18/27',()=>{
  assert.equal(planP0VerticalResidence(10).residentBufferLimit,25);
  assert.deepEqual(planP0VerticalResidence(2,{openShaft:true}).sections,[0,-1]);
  assert.equal(planP0VerticalResidence(2,{openShaft:true}).residentBufferLimit,34);
  const near=planP0VerticalResidence(18,{nearUpperSite:true});
  assert.deepEqual(near.sections,[0,1]);
  assert.equal(near.residentBufferLimit,18);
  const climbed=planP0VerticalResidence(20,{nearUpperSite:true});
  assert.deepEqual(climbed.sections,[1,0,2]);
  assert.equal(climbed.residentBufferLimit,27);
  assert.equal(planP0VerticalResidence(40,{nearUpperSite:true}).residentBufferLimit,27);
  assert.equal(planP0VerticalResidence(147,{nearUpperSite:true}).residentBufferLimit,18);
  assert.throws(()=>planP0VerticalResidence(10,{nearUpperSite:true,openShaft:true}),/overlap/);
  assert.throws(()=>planP0VerticalResidence(148,{nearUpperSite:true}));
});

test('authentic M7 original surface RGB/vertex stream remains byte-identical behind upper view',()=>{
  for(const seed of [179,2026]){
    const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
    const real=new FourRegionWorld(seed,profile);
    const site=definePrototypePyramid({seed,x:15,z:-16,baseY:20,size:31,height:26});
    const view=createP0UpperOnlyView(real,site);
    for(const [cx,cz] of [[0,-1],[-1,0]]){
      // No old-world voxel changes are allowed; the accepted M7 RGB stream
      // must remain EXACT when upper cells are projected into an isolated view.
      const original=meshChunk(real,cx,cz),proxied=meshChunk(view,cx,cz);
      assert.deepEqual(proxied,original,
        'M7 RGB byte parity seed '+seed+' chunk '+cx+','+cz);
    }
  }
});

test('actual upper physical vertices are unchanged by reverse native chunk reads',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const original=new FourRegionWorld(seed,profile);
  const site=definePrototypePyramid({seed,x:15,z:-16,baseY:20,size:31,height:26});
  const view=createP0UpperOnlyView(original,site);
  const coords=[[-1,-2],[0,-2],[-1,-1],[0,-1],[1,-1],[1,0]];
  const capture=order=>new Map(order.map(([cx,cz])=>{
    const v=meshP0UpperSection(view,cx,cz,1);
    assert.equal(v.length%27,0);
    assert.ok(v.byteLength<4*1024*1024);
    return [cx+','+cz,v];
  }));
  const first=capture(coords),second=capture([...coords].reverse());
  assert.ok([...first.values()].some(v=>v.length>0));
  for(const [key,v] of first)assert.deepEqual(v,second.get(key),key);
});
