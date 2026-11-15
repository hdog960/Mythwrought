import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld} from '../../../src/voxel.mjs';
import {PACK_2_IDS} from '../../../src/block-packs/pack-2/definitions.mjs';
import {PACK_2_JOINERY_IDS} from '../../../src/block-packs/pack-2/joinery.mjs';
import {PACK_2_GROUND_IDS} from '../../../src/block-packs/pack-2/ground.mjs';
import {PACK_2_INFRASTRUCTURE,PACK_2_INFRASTRUCTURE_IDS,infrastructureAsset,
  infrastructureCell,parseInfrastructureCell,infrastructureShape,
  infrastructureOccupies,infrastructurePreviewMesh}
  from '../../../src/block-packs/pack-2/infrastructure.mjs';
import {Pack2Fixture,PACK_2_FIXTURE_IDS} from './fixture.mjs';

test('three unique physical infrastructure IDs 73–75 stay inside exclusive Pack 2 allocation',()=>{
  assert.deepEqual(PACK_2_INFRASTRUCTURE_IDS,[73,74,75]);
  assert.deepEqual(PACK_2_INFRASTRUCTURE.map(a=>a.roster),[43,44,46]);
  assert.equal(new Set(PACK_2_INFRASTRUCTURE.map(a=>a.family)).size,3);
  assert.equal(new Set(PACK_2_INFRASTRUCTURE.map(a=>a.finish)).size,3);
  const ids=[...PACK_2_IDS,...PACK_2_JOINERY_IDS,...PACK_2_GROUND_IDS,
    ...PACK_2_INFRASTRUCTURE_IDS];
  assert.equal(ids.length,17);
  assert.equal(new Set(ids).size,ids.length);
  assert.deepEqual(PACK_2_FIXTURE_IDS.slice(0,17),ids);
  assert.equal(PACK_2_FIXTURE_IDS.length,18);
  assert.ok(ids.every(id=>id>=59&&id<=108&&id!==255));
  assert.deepEqual(Object.values(BLOCK).sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8]);
});
test('every infrastructure variant exposes actual bounded collision and selection AABBs',()=>{
  for(const a of PACK_2_INFRASTRUCTURE)
    for(const variant of a.variants)for(let rotation=0;rotation<a.rotations;rotation++){
      const sh=infrastructureShape(a.id,{rotation,variant});
      assert.equal(sh.id,a.id);
      assert.equal(sh.units,'voxel-local');
      assert.equal(sh.selection,'union-of-boxes');
      assert.equal(sh.collision,'union-of-boxes');
      assert.equal(sh.candidateOnly,true);
      assert.ok(sh.boxes.length>=5&&sh.boxes.length<=32);
      for(const b of sh.boxes){
        assert.equal(b.length,6);
        for(let i=0;i<3;i++)assert.ok(b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1);
      }
      assert.ok(sh.parts.every(p=>a.palette[p.role]?.length===3));
    }
});
test('reinforced bridge railing has actual air gaps rather than plain timber fence occupancy',()=>{
  const st={variant:'through'};
  assert.ok(infrastructureOccupies(73,st,[.10,.94,.5]));
  assert.ok(infrastructureOccupies(73,st,[.5,.90,.5])); // broad handrail
  assert.ok(infrastructureOccupies(73,st,[.5,.55,.5])); // reinforced midrail
  assert.equal(infrastructureOccupies(73,st,[.5,.76,.5]),false);
  assert.equal(infrastructureOccupies(73,st,[.5,.37,.75]),false);
  assert.ok(infrastructureOccupies(73,st,[.12,.40,.5])); // load-bearing post
  assert.equal(infrastructureAsset(73).family,'bridge-railing');
  assert.notEqual(infrastructureAsset(73).family,'wooden-fences');
});
test('terminal bridge guardrail has a physical end plate; through version lacks it',()=>{
  assert.equal(infrastructureOccupies(73,{variant:'through'},[.035,.55,.5]),false);
  assert.ok(infrastructureOccupies(73,{variant:'terminal'},[.035,.55,.5]));
  assert.notDeepEqual(
    infrastructureShape(73,{variant:'through'}).boxes,
    infrastructureShape(73,{variant:'terminal'}).boxes);
  assert.equal(infrastructureShape(73,{rotation:2,variant:'terminal'}).id,73);
});
test('wide stone parapet is fully solid at human body height, with real overhanging coping',()=>{
  assert.ok(infrastructureOccupies(74,{variant:'solid'},[.5,.40,.5]));
  assert.ok(infrastructureOccupies(74,{variant:'solid'},[.5,.85,.11]));
  assert.equal(infrastructureOccupies(74,{variant:'solid'},[.5,.41,.10]),false);
  assert.ok(infrastructureShape(74,{variant:'solid'}).boxes.length>=4);
  assert.equal(infrastructureAsset(74).family,'stone-parapet');
});
test('parapet drain-slot variant contains a genuinely open transverse hole',()=>{
  assert.ok(infrastructureOccupies(74,{variant:'solid'},[.5,.39,.5]));
  assert.equal(infrastructureOccupies(74,{variant:'drain-slot'},[.5,.39,.5]),false);
  assert.ok(infrastructureOccupies(74,{variant:'drain-slot'},[.3,.39,.5]));
  assert.ok(infrastructureOccupies(74,{variant:'drain-slot'},[.5,.24,.5]));
  assert.ok(infrastructureOccupies(74,{variant:'drain-slot'},[.5,.55,.5]));
  assert.ok(infrastructureOccupies(74,{variant:'drain-slot'},[.5,.86,.5]));
  assert.equal(infrastructureOccupies(74,{rotation:1,variant:'drain-slot'},[.5,.39,.5]),false);
});
test('elevated boardwalk exposes real deck spaces, elevated joists and walkable boards',()=>{
  assert.equal(infrastructureOccupies(75,{},[.5,.6,.206]),false);
  assert.ok(infrastructureOccupies(75,{},[.5,.60,.30]));
  assert.ok(infrastructureOccupies(75,{},[.15,.30,.5]));
  assert.equal(infrastructureOccupies(75,{},[.5,.3,.5]),false);
  assert.equal(infrastructureOccupies(75,{},[.5,.80,.30]),false);
  assert.equal(infrastructureAsset(75).family,'wooden-boardwalk');
  assert.notEqual(infrastructureAsset(75).family,'wooden-planks');
});
test('boardwalk edge trim is a physical optional profile without new IDs',()=>{
  const point=[.055,.735,.5];
  assert.equal(infrastructureOccupies(75,{variant:'open-deck'},point),false);
  assert.ok(infrastructureOccupies(75,{variant:'edge-trim'},point));
  assert.equal(infrastructureShape(75,{variant:'edge-trim'}).id,75);
  assert.notDeepEqual(infrastructureShape(75,{rotation:0}).boxes,
    infrastructureShape(75,{rotation:1}).boxes);
});
test('rotation is constrained to distinct profiles, not new block IDs',()=>{
  for(const a of PACK_2_INFRASTRUCTURE){
    for(let rotation=0;rotation<a.rotations;rotation++)
      for(const variant of a.variants){
        const c=infrastructureCell(a.id,{rotation,variant});
        assert.equal(c.id,a.id);
        assert.deepEqual(parseInfrastructureCell(JSON.parse(JSON.stringify(c))),c);
      }
  }
  assert.equal(infrastructureAsset(74).rotations,2);
  assert.equal(infrastructureAsset(75).rotations,2);
  assert.equal(infrastructureAsset(73).rotations,4);
});
test('malformed state, old ID and redundant rotations fail closed',()=>{
  assert.throws(()=>infrastructureCell(4),RangeError);
  assert.throws(()=>infrastructureCell(72),RangeError);
  assert.throws(()=>infrastructureCell(76),RangeError);
  assert.throws(()=>infrastructureCell(74,{rotation:2}),RangeError);
  assert.throws(()=>infrastructureCell(75,{rotation:3}),RangeError);
  assert.throws(()=>infrastructureCell(73,{rotation:-1}),RangeError);
  assert.throws(()=>infrastructureCell(73,{rotation:1.5}),RangeError);
  assert.throws(()=>infrastructureCell(74,{variant:'castle-wall'}),RangeError);
  assert.throws(()=>parseInfrastructureCell({id:75,rotation:1,variant:'open-deck',open:true}),TypeError);
  assert.throws(()=>infrastructureOccupies(73,{},[NaN,.5,.5]),TypeError);
});
test('authentic isolated triangle meshes are deterministic, finite and bounded per variant',()=>{
  for(const a of PACK_2_INFRASTRUCTURE)for(const variant of a.variants)
    for(let rotation=0;rotation<a.rotations;rotation++){
      const state={rotation,variant};
      const mesh=infrastructurePreviewMesh(a.id,state);
      assert.ok(mesh.physicalQuads>12);
      assert.ok(mesh.decorationQuads>=2);
      assert.ok(mesh.triangles>=60&&mesh.triangles<=900,
        'triangle budget for '+a.key+'/'+variant+' '+mesh.triangles);
      assert.equal(mesh.triangles,2*(mesh.physicalQuads+mesh.decorationQuads));
      assert.equal(mesh.indices.length,mesh.triangles*3);
      assert.equal(mesh.positions.length,mesh.normals.length);
      assert.equal(mesh.positions.length,mesh.colors.length);
      assert.equal(mesh.positions.length/3,(mesh.physicalQuads+mesh.decorationQuads)*4);
      assert.ok([...mesh.positions,...mesh.normals,...mesh.colors].every(Number.isFinite));
      assert.ok([...mesh.colors].every(x=>x>=0&&x<=1));
      assert.ok([...mesh.positions].every(x=>x>=-.005&&x<=1.005));
      assert.deepEqual(mesh.positions,infrastructurePreviewMesh(a.id,state).positions);
    }
});
test('physical triangles and grain overlays maintain outward winding and normal parity',()=>{
  for(const a of PACK_2_INFRASTRUCTURE)for(const variant of a.variants){
    const m=infrastructurePreviewMesh(a.id,{variant});
    for(let i=0;i<m.indices.length;i+=3){
      const verts=[m.indices[i],m.indices[i+1],m.indices[i+2]]
        .map(index=>Array.from(m.positions.slice(index*3,index*3+3)));
      const u=verts[1].map((v,j)=>v-verts[0][j]);
      const v=verts[2].map((w,j)=>w-verts[0][j]);
      const n=Array.from(m.normals.slice(m.indices[i]*3,m.indices[i]*3+3));
      const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],
        u[0]*v[1]-u[1]*v[0]];
      assert.ok(cross.reduce((sum,x,j)=>sum+x*n[j],0)>0,
        'inverted triangle '+a.key+' '+variant+' at '+i);
    }
  }
});
test('fixture selects, rotates, places, targets and removes physical infrastructure by ray',()=>{
  const f=new Pack2Fixture();f.select(73);
  f.cycleVariant();assert.equal(f.selection().variant,'terminal');
  f.turn();assert.equal(f.selection().rotation,1);
  f.turn();assert.equal(f.selection().rotation,2);
  assert.ok(f.place([0,0,0]));
  assert.equal(f.read([0,0,0]).variant,'terminal');
  const hit=f.target([.5,.9,-1],[0,0,1],6);
  assert.equal(hit.id,73);
  assert.equal(hit.variant,'terminal');
  assert.ok(f.mineRay([.5,.9,-1],[0,0,1],6).removed);
  assert.equal(f.read([0,0,0]),null);
});
test('fixture hits solid parapet but passes through matching empty scupper at same ray',()=>{
  const f=new Pack2Fixture();f.select(74);f.cycleVariant();
  assert.equal(f.selection().variant,'drain-slot');
  assert.ok(f.place([0,0,0]));
  assert.equal(f.target([.5,.39,-1],[0,0,1],5),null);
  assert.equal(f.target([.25,.39,-1],[0,0,1],5).id,74);
  assert.equal(f.mineRay([.25,.39,-1],[0,0,1],5).removed,true);
});
test('fixture snapshots preserve 5-field timber/ground, 7-field joinery and new 6-field infrastructure',()=>{
  const f=new Pack2Fixture();
  f.select(59);assert.ok(f.place([0,1,0]));
  f.select(72);f.turn();assert.ok(f.place([2,1,0]));
  f.select(67);f.turn();f.toggleSelection();assert.ok(f.place([4,1,0]));
  f.select(75);f.turn();f.cycleVariant();assert.ok(f.place([6,1,0]));
  const snapshot=f.serialize();
  assert.deepEqual(snapshot.cells.map(row=>row.length),[5,5,7,6]);
  assert.deepEqual(snapshot.cells[3],[6,1,0,75,1,'edge-trim']);
  const restored=Pack2Fixture.restore(JSON.parse(JSON.stringify(snapshot)));
  assert.deepEqual(restored.serialize(),snapshot);
  assert.equal(restored.read([4,1,0]).open,true);
  assert.equal(restored.read([6,1,0]).variant,'edge-trim');
  assert.equal(new VoxelWorld().set(6,1,0,75),false);
  assert.throws(()=>VoxelWorld.restore(snapshot));
});
test('invalid infrastructure snapshot rows reject duplicates, extra fields and improper variants',()=>{
  const f=new Pack2Fixture(),base=f.serialize();
  const bad=[
    [[0,0,0,75,1]],
    [[0,0,0,75,2,'open-deck']],
    [[0,0,0,75,1,'edge-trim',true]],
    [[0,0,0,74,0,'slab']],
    [[0,0,0,73,0,'through'],[0,0,0,73,0,'terminal']],
    [[0,20,0,73,0,'through']]
  ];
  for(const cells of bad)assert.throws(()=>Pack2Fixture.restore({...base,cells}));
  assert.deepEqual(f.serialize(),base);
});
test('no module adds complete structures, fluid, gameplay or world placement',()=>{
  assert.equal(PACK_2_INFRASTRUCTURE.length,3);
  assert.ok(PACK_2_INFRASTRUCTURE.every(a=>a.integration.worldPlaced===false));
  assert.ok(PACK_2_INFRASTRUCTURE.every(a=>a.id>=73&&a.id<=75));
  assert.equal(infrastructureShape(75).candidateOnly,true);
  assert.equal(infrastructureShape(74).candidateOnly,true);
  assert.equal(infrastructureShape(73).candidateOnly,true);
});

test('adjacent bridge railings touch handrail cap end-to-end in all four orientations',()=>{
  // A physical bridge guardrail is not continuous if its cap ends .02
  // inside both cell faces: adjacent units leave a .04 voxel-wide gap.
  const directions=[[1,0,0],[0,0,1],[-1,0,0],[0,0,-1]];
  for(let rotation=0;rotation<4;rotation++)for(const variant of ['through','terminal']){
    const state={rotation,variant},shape=infrastructureShape(73,state);
    const cap=shape.parts.find(part=>part.role==='cap');
    assert.ok(cap,'a guardrail needs a physical top handrail');
    const movement=directions[rotation],axis=rotation%2===0?0:2;
    const sign=movement[axis],side=axis===0?2:0;
    const a=cap.box,b=a.map((value,index)=>value+movement[index%3]);
    const facingA=a[axis+(sign===1?3:0)];
    const facingB=b[axis+(sign===1?0:3)];
    const label='guardrail rotation '+rotation+' variant '+variant;
    assert.equal(facingA,sign===1?1:0,label+' cap must reach its cell face');
    assert.equal(facingB,facingA,label+' neighboring cap must touch');
    const heightOverlap=Math.max(0,Math.min(a[4],b[4])-Math.max(a[1],b[1]));
    const widthOverlap=Math.max(0,
      Math.min(a[side+3],b[side+3])-Math.max(a[side],b[side]));
    assert.ok(heightOverlap*widthOverlap>=.089,label+' needs positive face contact');
    assert.ok(infrastructurePreviewMesh(73,state).triangles<=740,
      label+' must preserve existing small-mesh budget');
  }
});
