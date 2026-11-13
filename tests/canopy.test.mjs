import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,terrainHeight,meshChunk,CHUNK_SIZE} from '../src/voxel.mjs';
import {woodlandCanopyVertices,woodlandTreeStyle,woodlandSentinelChunk,woodlandDistrict,woodlandTreeProfile,CANOPY_LIMITS} from '../src/canopy.mjs';

const base=(x,y,z,seed)=>new VoxelWorld(seed).get(x,y,z);
const options={chunkSize:CHUNK_SIZE,heightAt:terrainHeight,baseAt:base,grass:BLOCK.GRASS,air:BLOCK.AIR};
test('canopy is deterministic, finite, chunk-local and bounded without saved edits',()=>{
  const world=new VoxelWorld(179),before=JSON.stringify(world.save());
  let found=0;
  for(let cx=-4;cx<=4;cx++)for(let cz=-4;cz<=4;cz++){
    const a=woodlandCanopyVertices(world,cx,cz,options);
    const b=woodlandCanopyVertices(world,cx,cz,options);
    assert.deepEqual(a,b);
    assert.equal(a.length%CANOPY_LIMITS.stride,0);
    assert.ok(a.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
    for(let i=0;i<a.length;i+=9){
      assert.ok(Number.isFinite(a[i])&&Number.isFinite(a[i+1])&&Number.isFinite(a[i+2]));
      assert.ok(a[i]>=cx*16&&a[i]<(cx+1)*16);
      assert.ok(a[i+2]>=cz*16&&a[i+2]<(cz+1)*16);
    }
    if(a.length)found++;
  }
  assert.ok(found>0,'at least one sculpted canopy should be visible in seeded landscape');
  assert.equal(JSON.stringify(world.save()),before);
  assert.equal(CANOPY_LIMITS.newDrawCalls,0);
});
test('mining natural tree anchors or building into canopy removes visuals on remesh',()=>{
  const world=new VoxelWorld(179);
  let match;
  for(let cx=-4;cx<=4&&!match;cx++)for(let cz=-4;cz<=4&&!match;cz++){
    const before=woodlandCanopyVertices(world,cx,cz,options);
    if(!before.length)continue;
    // Find the tree's original trunk anchor from the repeated base vertices.
    const x=Math.floor(before[0]),z=Math.floor(before[2]),h=terrainHeight(x,z,world.seed);
    if(world.get(x,h,z)!==BLOCK.GRASS)continue;
    match={cx,cz,x,z,h,before};
  }
  assert.ok(match);
  const {cx,cz,x,z,h,before}=match;
  assert.ok(meshChunk(world,cx,cz).length>=before.length);
  assert.equal(world.set(x,h,z,BLOCK.AIR),true);
  // Four candidates can fill two tree slots. Removing the first tree may
  // reveal a previously capped replacement, so vertex count need not drop.
  // Verify the *specific original trunk geometry* is gone instead.
  const afterRemoval=woodlandCanopyVertices(world,cx,cz,options);
  assert.notDeepEqual(afterRemoval,before,'editing the original anchor must remesh the woodland');
  let oldTrunkStillPresent=false;
  for(let i=0;i<afterRemoval.length;i+=CANOPY_LIMITS.stride){
    if(afterRemoval[i]===before[0]&&afterRemoval[i+1]===before[1]&&afterRemoval[i+2]===before[2]){
      oldTrunkStillPresent=true;break;
    }
  }
  assert.equal(oldTrunkStillPresent,false,'mined tree trunk must not survive a replacement tree');
  const saved=world.save(),restored=VoxelWorld.restore(saved);
  assert.deepEqual(woodlandCanopyVertices(restored,cx,cz,options),woodlandCanopyVertices(world,cx,cz,options));
  assert.equal(world.set(x,h,z,BLOCK.GRASS),true);
  assert.deepEqual(woodlandCanopyVertices(world,cx,cz,options),before);
});

test('seeded woodland includes distinct original evergreen and broadleaf silhouettes without altering world edits',()=>{
  const world=new VoxelWorld(179),before=JSON.stringify(world.save());
  const styles=new Set();
  for(let cx=-8;cx<=8;cx++)for(let cz=-8;cz<=8;cz++){
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    const x=Math.floor(mesh[0]),z=Math.floor(mesh[2]);
    styles.add(woodlandTreeStyle(x,z,world.seed));
    if(styles.size===2)break;
  }
  assert.deepEqual([...styles].sort(),['broadleaf','evergreen']);
  assert.equal(JSON.stringify(world.save()),before);
  assert.equal(woodlandTreeStyle(10,-4,179),woodlandTreeStyle(10,-4,179));
});

test('sculpted roots and sunlit facets stay inside editable chunk budget and preserve saves',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  let broad=0,ever=0;
  for(let cx=-7;cx<=7;cx++)for(let cz=-7;cz<=7;cz++){
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    assert.equal(mesh.length%CANOPY_LIMITS.stride,0);
    assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
    const style=woodlandTreeStyle(Math.floor(mesh[0]),Math.floor(mesh[2]),world.seed);
    if(style==='broadleaf')broad++;else ever++;
    // Every authored foliage/root vertex remains finite and local.
    for(let i=0;i<mesh.length;i+=9){
      assert.ok(Number.isFinite(mesh[i])&&Number.isFinite(mesh[i+1])&&Number.isFinite(mesh[i+2]));
      assert.ok(mesh[i]>=cx*CHUNK_SIZE&&mesh[i]<(cx+1)*CHUNK_SIZE);
      assert.ok(mesh[i+2]>=cz*CHUNK_SIZE&&mesh[i+2]<(cz+1)*CHUNK_SIZE);
    }
  }
  assert.ok(broad>0&&ever>0,'both rooted silhouettes must exist');
  assert.equal(JSON.stringify(world.save()),saved,'render-only woodland may not mutate saves');
});

test('woodland floor detail uses decorative foliage and stone facets within GPU and save budgets',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  let found=false,stone=false,foliage=false;
  for(let cx=-6;cx<=6;cx++)for(let cz=-6;cz<=6;cz++){
    const vertices=woodlandCanopyVertices(world,cx,cz,options);
    if(!vertices.length)continue;
    found=true;
    for(let i=0;i<vertices.length;i+=CANOPY_LIMITS.stride){
      const material=vertices[i+8];
      if(material===3)stone=true;
      if(material===7)foliage=true;
      assert.ok(Number.isFinite(material));
    }
    assert.ok(vertices.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
  }
  assert.ok(found&&stone&&foliage,'seeded woodland includes grounded stone and foliage');
  assert.equal(JSON.stringify(world.save()),saved,'visual forest floor never mutates schema-1 edits');
});

// The broadleaf uses the tightest authored vertex budget; test its exact
// standalone allocation so future decoration cannot hide behind a sparse tree.
test('individual broadleaf mesh respects the 450-vertex cap even when alone',()=>{
  const world=new VoxelWorld(179);
  let inspected=0;
  for(let cx=-8;cx<=8;cx++)for(let cz=-8;cz<=8;cz++){
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    const x=Math.floor(mesh[0]),z=Math.floor(mesh[2]);
    if(woodlandTreeStyle(x,z,world.seed)!=='broadleaf')continue;
    // Remove every other tree's natural grass anchor in this chunk, leaving
    // the first authored broadleaf. This must not alter the persisted fixture.
    const h=terrainHeight(x,z,world.seed);
    const isolated=new VoxelWorld(179);
    for(let dx=0;dx<CHUNK_SIZE;dx++)for(let dz=0;dz<CHUNK_SIZE;dz++){
      const px=cx*CHUNK_SIZE+dx,pz=cz*CHUNK_SIZE+dz;
      if(px===x&&pz===z)continue;
      const py=terrainHeight(px,pz,world.seed);
      if(isolated.get(px,py,pz)===BLOCK.GRASS)isolated.set(px,py,pz,BLOCK.AIR);
    }
    const solo=woodlandCanopyVertices(isolated,cx,cz,options);
    assert.ok(solo.length>0,'the selected broadleaf survives isolation');
    assert.ok(solo.length/CANOPY_LIMITS.stride<=CANOPY_LIMITS.maxVerticesPerTree);
    inspected++;
    if(inspected===3)return;
  }
  assert.ok(inspected>0,'seeded world contains broadleaf fixtures');
});

test('seeded forest-floor clusters vary without mutating either world',()=>{
  const first=new VoxelWorld(179),second=new VoxelWorld(180);
  const beforeA=JSON.stringify(first.save()),beforeB=JSON.stringify(second.save());
  let varied=0,visible=0;
  for(let cx=-3;cx<=3;cx++)for(let cz=-3;cz<=3;cz++){
    const a=woodlandCanopyVertices(first,cx,cz,options);
    const b=woodlandCanopyVertices(second,cx,cz,options);
    if(a.length||b.length)visible++;
    if(a.length!==b.length||a.some((value,i)=>value!==b[i]))varied++;
    for(const mesh of [a,b]){
      assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
      for(let i=0;i<mesh.length;i++)assert.ok(Number.isFinite(mesh[i]));
    }
  }
  assert.ok(visible>0&&varied>0,'woodland floor remains visibly seed-dependent');
  assert.equal(JSON.stringify(first.save()),beforeA);
  assert.equal(JSON.stringify(second.save()),beforeB);
});

test('rare golden sentinel pines create taller deterministic landmarks within unchanged mesh budgets',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  let sentinels=0,ordinary=0;
  for(let cx=-16;cx<=16;cx++)for(let cz=-16;cz<=16;cz++){
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    assert.deepEqual(mesh,woodlandCanopyVertices(world,cx,cz,options));
    assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
    if(woodlandSentinelChunk(cx,cz,world.seed)){
      sentinels++;
      let top=-Infinity;
      for(let i=1;i<mesh.length;i+=CANOPY_LIMITS.stride)top=Math.max(top,mesh[i]);
      const x=Math.floor(mesh[0]),z=Math.floor(mesh[2]);
      assert.ok(top>terrainHeight(x,z,world.seed)+6,'sentinel silhouette rises clearly above ordinary trees');
    }else ordinary++;
  }
  assert.ok(sentinels>4&&ordinary>30,'landmarks should be sparse but present');
  assert.equal(JSON.stringify(world.save()),saved);
  assert.equal(CANOPY_LIMITS.newDrawCalls,0);
  assert.equal(woodlandSentinelChunk(-2,3,179),woodlandSentinelChunk(-2,3,179));
});

test('sentinel crowns yield to high player-built blocks and restore deterministically',()=>{
  const world=new VoxelWorld(179);
  let target;
  for(let cx=-16;cx<=16&&!target;cx++)for(let cz=-16;cz<=16&&!target;cz++){
    if(!woodlandSentinelChunk(cx,cz,world.seed))continue;
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    const x=Math.floor(mesh[0]),z=Math.floor(mesh[2]);
    const h=terrainHeight(x,z,world.seed);
    target={cx,cz,x,z,h,mesh};
  }
  assert.ok(target,'find an unobstructed sentinel');
  const {cx,cz,x,z,h,mesh}=target;
  assert.equal(world.get(x,h+8,z),BLOCK.AIR);
  assert.equal(world.set(x,h+8,z,BLOCK.STONE),true);
  const obstructed=woodlandCanopyVertices(world,cx,cz,options);
  assert.ok(obstructed.length<mesh.length,'high placed blocks suppress overlapping sentinel');
  const restored=VoxelWorld.restore(world.save());
  assert.deepEqual(woodlandCanopyVertices(restored,cx,cz,options),obstructed);
  assert.equal(world.set(x,h+8,z,BLOCK.AIR),true);
  assert.deepEqual(woodlandCanopyVertices(world,cx,cz,options),mesh);
});


test('golden sentinel tips are distinct foliage facets without extra vertices or save writes',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  let found=false;
  for(let cx=-16;cx<=16&&!found;cx++)for(let cz=-16;cz<=16&&!found;cz++){
    if(!woodlandSentinelChunk(cx,cz,world.seed))continue;
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    for(let i=0;i<mesh.length;i+=CANOPY_LIMITS.stride){
      if(mesh[i+3]>.9&&mesh[i+4]>.75&&mesh[i+5]>.4&&mesh[i+5]<.6){found=true;break;}
    }
    assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
  }
  assert.ok(found,'a deterministic sentinel should show gold-tipped crown facets');
  assert.equal(JSON.stringify(world.save()),saved);
});

test('sentinel crown-star is an eight-spoke, bounded render-only landmark',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  let found=false;
  for(let cx=-16;cx<=16&&!found;cx++)for(let cz=-16;cz<=16&&!found;cz++){
    if(!woodlandSentinelChunk(cx,cz,world.seed))continue;
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    const x=Math.floor(mesh[0]),z=Math.floor(mesh[2]);
    const h=terrainHeight(x,z,world.seed);
    let spokes=0;
    for(let i=0;i<mesh.length;i+=27){
      const colors=[mesh[i+3],mesh[i+4],mesh[i+5]];
      if(colors[0]>.7&&colors[1]>.79&&colors[2]>.4&&colors[2]<.61){
        const ys=[mesh[i+1],mesh[i+10],mesh[i+19]];
        if(ys.some(y=>y>h+7))spokes++;
      }
    }
    assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
    assert.ok(spokes>=8,'sentinel crown-star must have eight high contrasting facets');
    found=true;
  }
  assert.ok(found,'a seeded sentinel must be visible');
  assert.equal(JSON.stringify(world.save()),saved,'crown-star never persists as voxels');
});

test('sentinel lower golden canopy band remains visible below the high crown-star',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  let found=false;
  for(let cx=-16;cx<=16&&!found;cx++)for(let cz=-16;cz<=16&&!found;cz++){
    if(!woodlandSentinelChunk(cx,cz,world.seed))continue;
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    const x=Math.floor(mesh[0]),z=Math.floor(mesh[2]);
    const h=terrainHeight(x,z,world.seed);
    let band=0;
    for(let i=0;i<mesh.length;i+=CANOPY_LIMITS.stride*3){
      const ys=[mesh[i+1],mesh[i+10],mesh[i+19]];
      const r=mesh[i+3],g=mesh[i+4],b=mesh[i+5];
      if(r>.7&&g>.75&&b>.35&&b<.5&&ys.every(y=>y>h+3.5&&y<h+5.1))band++;
    }
    assert.ok(band>=8,'eight contrasting mid-canopy facets remain below the crown-star');
    assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
    found=true;
  }
  assert.ok(found,'find a seeded sentinel with lower band');
  assert.equal(JSON.stringify(world.save()),saved);
});

test('sentinel landmark has a grounded eight-facet halo without save writes or budget growth',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  let found=false;
  for(let cx=-16;cx<=16&&!found;cx++)for(let cz=-16;cz<=16&&!found;cz++){
    if(!woodlandSentinelChunk(cx,cz,world.seed))continue;
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    const x=Math.floor(mesh[0]),z=Math.floor(mesh[2]),h=terrainHeight(x,z,world.seed);
    let facets=0;
    for(let i=0;i<mesh.length;i+=27){
      const ys=[mesh[i+1],mesh[i+10],mesh[i+19]];
      const r=mesh[i+3],g=mesh[i+4],b=mesh[i+5];
      if(r>.5&&r<.7&&g>.5&&g<.7&&b>.2&&b<.4&&ys.every(y=>y>h+1&&y<h+1.3))facets++;
    }
    assert.ok(facets>=8,'eight low moss/amber facets ground the sentinel visually');
    assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
    found=true;
  }
  assert.ok(found,'find an unobstructed sentinel halo');
  assert.equal(JSON.stringify(world.save()),saved);
});


test('connected four-chunk woodland districts create seed-stable open vistas and groves',()=>{
  const seed=179,world=new VoxelWorld(seed),saved=JSON.stringify(world.save());
  const types=new Set();
  for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){
    const cx=dx*4,cz=dz*4,type=woodlandDistrict(cx,cz,seed);
    types.add(type);
    for(let x=cx;x<cx+4;x++)for(let z=cz;z<cz+4;z++){
      assert.equal(woodlandDistrict(x,z,seed),type,'district seams must not split four-chunk vistas');
      assert.deepEqual(woodlandCanopyVertices(world,x,z,options),woodlandCanopyVertices(world,x,z,options));
    }
  }
  assert.ok(types.has('open')&&types.has('grove')&&types.has('mixed'));
  assert.equal(JSON.stringify(world.save()),saved,'district art must not write world edits');
  assert.throws(()=>woodlandDistrict(1.5,0,seed),/Invalid woodland district/);
});

test('winding woodland sightlines create real canopy gaps inside connected groves without touching edits',()=>{
  const seed=179,world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  let corridor=0,flanks=0,corridorChunks=0,flankChunks=0,groves=0;
  for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){
    const startX=dx*4,startZ=dz*4;
    if(woodlandDistrict(startX,startZ,seed)!=='grove')continue;
    groves++;
    for(let lx=0;lx<4;lx++)for(let lz=0;lz<4;lz++){
      const mesh=woodlandCanopyVertices(world,startX+lx,startZ+lz,options);
      assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
      assert.deepEqual(mesh,woodlandCanopyVertices(world,startX+lx,startZ+lz,options));
      // Interior chunks follow a winding view corridor; exterior flanks
      // retain the thicker grove silhouette.
      if(lx===1||lx===2){corridor+=mesh.length;corridorChunks++;}
      else {flanks+=mesh.length;flankChunks++;}
    }
  }
  assert.ok(groves>=8,'sample enough independent seeded grove districts');
  assert.ok(flanks/flankChunks>corridor/corridorChunks*1.25,
    'grove flanks should retain visibly more foliage than the interior vista');
  assert.equal(JSON.stringify(world.save()),before,'sightlines remain render-only');
});

test('open glades and tall groves have deterministic distinct tree profiles within mesh and save limits',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  const seen=new Map();
  for(let cx=-16;cx<=16;cx++)for(let cz=-16;cz<=16;cz++){
    const profile=woodlandTreeProfile(cx,cz,world.seed);
    assert.equal(profile,woodlandDistrict(cx,cz,world.seed));
    assert.equal(profile,woodlandTreeProfile(cx,cz,world.seed));
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    assert.deepEqual(mesh,woodlandCanopyVertices(world,cx,cz,options));
    assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
    for(let i=0;i<mesh.length;i+=CANOPY_LIMITS.stride){
      assert.ok(Number.isFinite(mesh[i])&&Number.isFinite(mesh[i+1])&&Number.isFinite(mesh[i+2]));
      assert.ok(mesh[i]>=cx*CHUNK_SIZE&&mesh[i]<(cx+1)*CHUNK_SIZE);
      assert.ok(mesh[i+2]>=cz*CHUNK_SIZE&&mesh[i+2]<(cz+1)*CHUNK_SIZE);
    }
    if(mesh.length)seen.set(profile,(seen.get(profile)||0)+1);
  }
  assert.ok((seen.get('open')||0)>0,'open glades retain trees with low broad silhouettes');
  assert.ok((seen.get('grove')||0)>0,'dense groves retain taller canopy silhouettes');
  assert.ok((seen.get('mixed')||0)>0,'mixed districts bridge the two forest forms');
  assert.equal(JSON.stringify(world.save()),saved,'district art never changes saved edits');
  assert.equal(CANOPY_LIMITS.newDrawCalls,0);
});
