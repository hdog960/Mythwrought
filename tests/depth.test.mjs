import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,baseBlock,VoxelWorld,meshChunk,WORLD_MAX_Y,WORLD_MIN_Y as LEGACY_PUBLIC_MIN_Y} from '../src/voxel.mjs';
import {meshDepthSection,invalidateDepthMeshCache} from '../src/depth-mesh.mjs';
import {caveRoute} from '../src/experimental-cave-route.mjs';
import {
  WORLD_MIN_Y,LEGACY_WORLD_MIN_Y,LEGACY_WORLD_HEIGHT,WORLD_DEPTH_MULTIPLIER,
  DEPTH_SECTION_HEIGHT,LOWEST_SECTION,MAX_ACTIVE_SECTIONS,
  sectionForY,sectionBounds,sectionWindow,surfaceOpeningNearby,sectionChunkRadius,verticalEditSections,depthMeshKey
} from '../src/depth.mjs';

test('tenfold depth keeps exact original Y coordinates intact',()=>{
  assert.equal(WORLD_MAX_Y,19);
  assert.equal(LEGACY_WORLD_MIN_Y,-3);
  assert.equal(LEGACY_PUBLIC_MIN_Y,-3,'existing cave generators must retain original lower bound');
  assert.equal(WORLD_DEPTH_MULTIPLIER,10);
  assert.equal(WORLD_MAX_Y-WORLD_MIN_Y+1,LEGACY_WORLD_HEIGHT*10);
  assert.equal(WORLD_MIN_Y,-210);
  assert.equal(sectionBounds(0).minY,-3);
  assert.equal(sectionBounds(0).maxY,19);
  assert.equal(depthMeshKey(-2,5,0),'-2,5');
  assert.equal(depthMeshKey(-2,5,-1),'-2,5,-1');
});

test('vertical sections partition the full range without gaps or double cells',()=>{
  let total=0,previousMin=WORLD_MAX_Y+1;
  for(let s=0;s>=LOWEST_SECTION;s--){
    const {minY,maxY}=sectionBounds(s);
    assert.equal(maxY,previousMin-1,'gap or overlap at '+s);
    assert.ok(maxY-minY+1<=Math.max(LEGACY_WORLD_HEIGHT,DEPTH_SECTION_HEIGHT));
    for(let y=minY;y<=maxY;y++)assert.equal(sectionForY(y),s);
    total+=maxY-minY+1;previousMin=minY;
  }
  assert.equal(previousMin,WORLD_MIN_Y);
  assert.equal(total,LEGACY_WORLD_HEIGHT*10);
  for(const y of [WORLD_MIN_Y-1,WORLD_MAX_Y+1,NaN,Infinity])
    assert.equal(sectionForY(y),null);
  assert.throws(()=>sectionBounds(1));
  assert.throws(()=>sectionBounds(LOWEST_SECTION-1));
});

test('GPU section selection is bounded and original surface window preserved',()=>{
  assert.deepEqual(sectionWindow(10),[0]);
  assert.deepEqual(sectionWindow(3),[0]);
  assert.deepEqual(sectionWindow(2),[0],'legacy caves without a floor breach remain 25 chunks');
  assert.deepEqual(sectionWindow(2,true),[0,-1],'preload first deep section near player excavation');
  assert.deepEqual(sectionWindow(-1),[0],'legacy authored caves preserve original streaming');
  assert.deepEqual(sectionWindow(-1,true),[0,-1]);
  assert.deepEqual(sectionWindow(-6),[-1,0,-2]);
  assert.deepEqual(sectionWindow(-210),[LOWEST_SECTION,LOWEST_SECTION+1]);
  for(let y=WORLD_MIN_Y;y<=WORLD_MAX_Y;y++)
    assert.ok(sectionWindow(y).length<=MAX_ACTIVE_SECTIONS);
});

test('Y seam invalidation includes both sides and keeps interior edits local',()=>{
  assert.deepEqual(verticalEditSections(6),[0]);
  assert.deepEqual(verticalEditSections(-3),[0,-1]);
  assert.deepEqual(verticalEditSections(-4),[-1,0]);
  assert.deepEqual(verticalEditSections(-19),[-1,-2]);
  assert.deepEqual(verticalEditSections(-20),[-2,-1]);
  assert.deepEqual(verticalEditSections(-210),[LOWEST_SECTION]);
  assert.deepEqual(verticalEditSections(-211),[]);
});

test('new deep rock remains physical and is individually editable',()=>{
  const w=new VoxelWorld(179);
  assert.equal(baseBlock(0,-4,0,179),BLOCK.STONE);
  assert.equal(baseBlock(0,-65,0,179),BLOCK.DEEPSTONE);
  assert.equal(w.get(0,WORLD_MIN_Y,0),BLOCK.DEEPSTONE);
  assert.equal(w.get(0,WORLD_MIN_Y-1,0),BLOCK.AIR);
  assert.equal(w.set(0,-90,0,BLOCK.AIR),true);
  assert.equal(w.get(0,-90,0),BLOCK.AIR);
  assert.equal(w.set(0,-90,0,BLOCK.CRYSTAL),true);
  assert.equal(w.get(0,-90,0),BLOCK.CRYSTAL);
  assert.equal(w.set(0,-90,0,BLOCK.DEEPSTONE),true);
  assert.equal(w.edits.has('0,-90,0'),false);
  assert.equal(w.set(0,WORLD_MIN_Y-1,0,BLOCK.AIR),false);
  assert.equal(w.set(0,WORLD_MAX_Y+1,0,BLOCK.AIR),false);
});

test('legacy surface voxels and schema-1 saved edits retain original coordinates',()=>{
  for(const seed of [179,-54,0,2147483647]){
    const w=new VoxelWorld(seed);
    const before=[];
    for(const y of [-3,-2,0,5,12,19])
      before.push(baseBlock(-17,y,16,seed));
    const prev=w.get(-17,6,16);
    assert.equal(w.set(-17,6,16,BLOCK.WOOD),true);
    assert.equal(w.set(-17,-78,16,BLOCK.AIR),true);
    const saved=JSON.parse(JSON.stringify(w.save()));
    assert.equal(saved.schema,1);
    const clone=VoxelWorld.restore(saved);
    assert.equal(clone.get(-17,6,16),BLOCK.WOOD);
    assert.equal(clone.get(-17,-78,16),BLOCK.AIR);
    assert.deepEqual([-3,-2,0,5,12,19].map(y=>baseBlock(-17,y,16,seed)),before);
    assert.equal(clone.set(-17,6,16,prev),true);
    assert.equal(clone.get(-17,6,16),prev);
  }
});

test('legacy surface mesher stays bounded to original 23 Y levels',()=>{
  const fake={seed:179,get:(x,y,z)=>x===0&&z===0&&y===19?BLOCK.STONE:BLOCK.AIR};
  const mesh=meshChunk(fake,0,0);
  assert.equal(mesh.length,6*6*9);
  assert.equal(meshDepthSection(fake,0,0,-1).length,0);
});

test('deep horizontal chunk seam excludes shared invisible faces',()=>{
  const fake={seed:179,get:(x,y,z)=>y===-23&&z===0&&(x===15||x===16)?BLOCK.STONE:BLOCK.AIR};
  const left=meshDepthSection(fake,0,0,-2),right=meshDepthSection(fake,1,0,-2);
  assert.equal(left.length,5*6*9);
  assert.equal(right.length,5*6*9);
  assert.ok([...left,...right].every(Number.isFinite));
});

test('deep vertical section seam excludes shared invisible faces',()=>{
  const fake={seed:179,get:(x,y,z)=>x===0&&z===0&&(y===-19||y===-20)?BLOCK.STONE:BLOCK.AIR};
  assert.equal(meshDepthSection(fake,0,0,-1).length,5*6*9);
  assert.equal(meshDepthSection(fake,0,0,-2).length,5*6*9);
});

test('deep shaft edits produce deterministic, finite, saved solid meshes',()=>{
  const a=new VoxelWorld(42);
  for(const y of [-69,-68,-67])a.set(0,y,0,BLOCK.AIR);
  const b=VoxelWorld.restore(a.save()),section=sectionForY(-68);
  const first=meshDepthSection(a,0,0,section);
  const second=meshDepthSection(b,0,0,section);
  assert.ok(first.length>0);
  assert.deepEqual(first,second);
  assert.equal(first.length%27,0);
  assert.ok(first.byteLength<8*1024*1024);
  assert.ok([...first].every(Number.isFinite));
  for(let i=8;i<first.length;i+=9)assert.equal(first[i],19);
});

test('preexisting authored cave floors retain their legacy -3 generation clamp',()=>{
  for(const seed of [179,0,-54,2147483647]){
    const route=caveRoute(seed,{x:64,z:64,length:28,width:3});
    for(const t of [0,5,15,25,28,100]){
      const top=route.entrance[1];
      assert.equal(route.floorAt(t),Math.max(-1,top-1-Math.floor(t/5)));
    }
    assert.equal(route.floorAt(100),-1,'depth ABI must not retarget :24 cave floor');
  }
});


test('deep streaming reads never instantiate a surface district or landmark',()=>{
  const w=new VoxelWorld(179);
  for(const y of [-4,-19,-20,-70,-120,-210]){
    assert.notEqual(w.get(-17,y,33),BLOCK.AIR);
  }
  assert.equal(w.landmarkCache.size,0);
  assert.equal(w.liveDistrictCache.size,0);
  assert.equal(w.set(-17,-120,33,BLOCK.AIR),true);
  assert.equal(w.get(-17,-120,33),BLOCK.AIR);
  assert.equal(w.landmarkCache.size,0);
  assert.equal(w.liveDistrictCache.size,0);
  const restored=VoxelWorld.restore(w.save());
  assert.equal(restored.get(-17,-120,33),BLOCK.AIR);
  assert.equal(restored.liveDistrictCache.size,0);
});

test('GPU streaming near the legacy floor cannot grow to 43 chunk buffers',()=>{
  // Legacy surface 5x5 + first underground 3x3 => 34 total near a shaft.
  const surface=sectionWindow(2,true);
  assert.deepEqual(surface,[0,-1]);
  assert.deepEqual(surface.map(s=>sectionChunkRadius(s,surface[0])),[2,1]);
  assert.equal(surface.reduce((n,s)=>{
    const radius=sectionChunkRadius(s,surface[0]);
    return n+(radius*2+1)**2;
  },0),34);
  // Below the original floor there may be three visible height slices;
  // every one, including the overhead surface, must use only 3x3.
  for(const feet of [-3.1,-4,-19,-20,-100,-210]){
    const visible=sectionWindow(feet),active=visible[0];
    const sum=visible.reduce((n,s)=>{
      const radius=sectionChunkRadius(s,active);
      return n+(radius*2+1)**2;
    },0);
    assert.ok(sum<=27,feet+' resident chunks='+sum);
  }
  const normal=sectionWindow(10);
  assert.equal(normal.reduce((n,s)=>{
    const radius=sectionChunkRadius(s,normal[0]);
    return n+(radius*2+1)**2;
  },0),25);
  assert.throws(()=>sectionChunkRadius(1,0));
  assert.throws(()=>sectionChunkRadius(0,-999));
});

test('unmodified natural cave must remain 25 chunks; only an actual shaft opens deep streaming',()=>{
  const w=new VoxelWorld(179);
  // All original cave floors are at or above -3 and never implicitly open
  // the -3-to--4 boundary. No new graphics should load just because y<3.
  assert.equal(surfaceOpeningNearby(w,.5,.5),false);
  assert.deepEqual(sectionWindow(-1,surfaceOpeningNearby(w,.5,.5)),[0]);
  assert.equal(w.set(2,-3,1,BLOCK.AIR),true);
  assert.equal(surfaceOpeningNearby(w,.5,.5),true);
  assert.deepEqual(sectionWindow(-1,surfaceOpeningNearby(w,.5,.5)),[0,-1]);
  assert.equal(surfaceOpeningNearby(w,-12,-12),false);
  assert.equal(surfaceOpeningNearby(w,5.5,.5),false);
  const restored=VoxelWorld.restore(w.save());
  assert.equal(surfaceOpeningNearby(restored,.5,.5),true,
    'deep preload should survive schema-one reload of a mined surface shaft');
  assert.equal(w.set(2,-3,1,BLOCK.STONE),true);
  assert.equal(surfaceOpeningNearby(w,.5,.5),false,
    'restoring solid seeded floor removes GPU preload');
  assert.deepEqual(sectionWindow(1),[0]);
  assert.throws(()=>sectionWindow(0,'true'));
  assert.throws(()=>surfaceOpeningNearby(w,0,0,3));
});


test('incremental deep remesh is exactly equal to a fresh full remesh for rapid vertical and side/seam edits',()=>{
  const w=new VoxelWorld(179);
  const section=-5;
  // Prime all three affected chunk caches from an unedited genuine world.
  for(const [cx,cz] of [[0,0],[-1,0],[0,-1]])
    meshDepthSection(w,cx,cz,section);
  const digs=[
    [1,-77,1],[1,-78,1],[1,-79,1],[1,-80,1],
    [0,-79,0],[0,-78,0],[1,-79,0],[0,-79,1],
    [2,-80,2],[1,-79,1]
  ];
  for(const [x,y,z] of digs){
    const previous=w.get(x,y,z),next=previous===BLOCK.AIR?BLOCK.DEEPSTONE:BLOCK.AIR;
    assert.equal(w.set(x,y,z,next),true);
    for(const [cx,cz] of [[0,0],[-1,0],[0,-1]]){
      const incremental=meshDepthSection(w,cx,cz,section,{x,z});
      const fresh=meshDepthSection(VoxelWorld.restore(w.save()),cx,cz,section);
      assert.deepEqual(incremental,fresh,
        'column-cache geometry disagrees with authoritative world at '+[x,y,z,cx,cz]);
    }
  }
  // A failed GPU stage must discard columns generated from the rejected edit.
  w.set(1,-77,1,BLOCK.AIR);
  meshDepthSection(w,0,0,section,{x:1,z:1});
  w.set(1,-77,1,BLOCK.DEEPSTONE);
  invalidateDepthMeshCache(w);
  const rolledBack=meshDepthSection(w,0,0,section,{x:1,z:1});
  assert.deepEqual(rolledBack,meshDepthSection(VoxelWorld.restore(w.save()),0,0,section));
});
