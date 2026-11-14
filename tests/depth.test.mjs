import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,baseBlock,VoxelWorld,meshChunk,WORLD_MIN_Y,WORLD_MAX_Y} from '../src/voxel.mjs';
import {meshDepthSection} from '../src/depth-mesh.mjs';
import {
  LEGACY_WORLD_MIN_Y,LEGACY_WORLD_HEIGHT,WORLD_DEPTH_MULTIPLIER,
  DEPTH_SECTION_HEIGHT,LOWEST_SECTION,MAX_ACTIVE_SECTIONS,
  sectionForY,sectionBounds,sectionWindow,verticalEditSections,depthMeshKey
} from '../src/depth.mjs';

test('tenfold depth keeps exact original Y coordinates intact',()=>{
  assert.equal(WORLD_MAX_Y,19);
  assert.equal(LEGACY_WORLD_MIN_Y,-3);
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
  assert.deepEqual(sectionWindow(-1),[0,-1]);
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
