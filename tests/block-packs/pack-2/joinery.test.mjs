import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld} from '../../../src/voxel.mjs';
import {PACK_2_IDS} from '../../../src/block-packs/pack-2/definitions.mjs';
import {PACK_2_JOINERY,PACK_2_JOINERY_IDS,joineryAsset,joineryCell,joineryShape,
  joineryPreviewMesh,joineryOccupies,nextJoineryState,parseJoineryCell}
  from '../../../src/block-packs/pack-2/joinery.mjs';
import {PACK_2_FIXTURE_IDS,Pack2Fixture} from './fixture.mjs';

test('six distinct new physical IDs use 63–68 without duplicating the legacy or other packs',()=>{
  assert.deepEqual(PACK_2_JOINERY_IDS,[63,64,65,66,67,68]);
  assert.deepEqual(PACK_2_JOINERY.map(x=>x.roster),[16,17,18,19,20,21]);
  assert.equal(new Set(PACK_2_JOINERY.map(x=>x.kind)).size,6);
  assert.equal(new Set(PACK_2_JOINERY.map(x=>x.surface.pattern)).size,6);
  assert.equal(new Set([...PACK_2_IDS,...PACK_2_JOINERY_IDS]).size,10);
  assert.deepEqual(PACK_2_FIXTURE_IDS.slice(0,10),[59,60,61,62,63,64,65,66,67,68]);
  assert.equal(PACK_2_FIXTURE_IDS.length,18);
  assert.deepEqual(Object.values(BLOCK).sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8]);
});
test('every joinery variant has bounded physical target/collision boxes and finite preview',()=>{
  for(const spec of PACK_2_JOINERY){
    for(const variant of spec.variants){
      for(const open of spec.toggleable?[false,true]:[false]){
        const rotations=spec.rotatable?[0,1,2,3]:[0];
        for(const rotation of rotations){
          const state={rotation,variant,open},sh=joineryShape(spec.id,state);
          assert.ok(sh.candidateOnly&&sh.stateAffectsPhysicalTargeting);
          assert.ok(sh.boxes.length>0&&sh.boxes.length<=32);
          for(const b of sh.boxes){
            assert.equal(b.length,6);
            for(let k=0;k<3;k++)assert.ok(b[k]>=0&&b[k]<b[k+3]&&b[k+3]<=1);
          }
          const mesh=joineryPreviewMesh(spec.id,state);
          assert.ok(mesh.triangles>=12&&mesh.triangles<2000,
            spec.key+' '+JSON.stringify(state)+' '+mesh.triangles);
          assert.equal(mesh.indices.length/3,mesh.triangles);
          assert.equal(mesh.positions.length,mesh.normals.length);
          assert.equal(mesh.positions.length,mesh.colors.length);
          assert.equal(mesh.positions.length/3,(mesh.physicalQuads+mesh.decorationQuads)*4);
          assert.ok([...mesh.positions,...mesh.colors,...mesh.normals].every(Number.isFinite));
          assert.ok([...mesh.colors].every(x=>x>=0&&x<=1));
          assert.ok([...mesh.positions].every(x=>x>=-.005&&x<=1.005));
        }
      }
    }
  }
});
test('half-slabs are upper/lower occupancy variants of the SAME candidate ID',()=>{
  assert.ok(joineryOccupies(63,{variant:'lower'},[.5,.25,.5]));
  assert.equal(joineryOccupies(63,{variant:'lower'},[.5,.75,.5]),false);
  assert.ok(joineryOccupies(63,{variant:'upper'},[.5,.75,.5]));
  assert.equal(joineryOccupies(63,{variant:'upper'},[.5,.25,.5]),false);
  assert.deepEqual(joineryCell(63,{variant:'upper'}),{id:63,rotation:0,variant:'upper',open:false});
  assert.throws(()=>joineryCell(63,{rotation:1}),RangeError);
});
test('wooden stair retains two collision steps and rotates the elevated tread',()=>{
  const shape=joineryShape(64);
  assert.equal(shape.boxes.length,2);
  assert.ok(joineryOccupies(64,{rotation:0},[.5,.25,.1]));
  assert.equal(joineryOccupies(64,{rotation:0},[.5,.75,.1]),false);
  assert.ok(joineryOccupies(64,{rotation:0},[.5,.75,.9]));
  assert.ok(joineryOccupies(64,{rotation:1},[.1,.75,.5]));
  assert.equal(joineryOccupies(64,{rotation:1},[.9,.75,.5]),false);
  assert.equal(joineryOccupies(64,{variant:'upper'},[.5,.25,.1]),false);
});
test('fence leaves genuine open air in the spaces between posts and rails',()=>{
  assert.ok(joineryOccupies(65,{},[.15,.55,.5]));
  assert.equal(joineryOccupies(65,{},[.5,.54,.5]),false);
  assert.ok(joineryOccupies(65,{},[.5,.35,.5]));
  assert.ok(joineryOccupies(65,{},[.5,.73,.5]));
  assert.equal(joineryOccupies(65,{},[.5,.9,.5]),false);
  assert.equal(joineryOccupies(65,{rotation:1},[.5,.35,.5]),true);
});
test('hinged timber fence gate actually swings its selection and collision volume',()=>{
  assert.ok(joineryOccupies(66,{open:false},[.5,.34,.5]));
  assert.equal(joineryOccupies(66,{open:true},[.5,.34,.5]),false);
  assert.ok(joineryOccupies(66,{open:true},[.18,.34,.72]));
  assert.equal(joineryOccupies(66,{open:false},[.18,.34,.72]),false);
  const closed=joineryCell(66),opened=nextJoineryState(66,closed);
  assert.equal(opened.open,true);
  assert.deepEqual(nextJoineryState(66,opened),closed);
});
test('carved door leaf pivots to the side and leaves its former center unobstructed',()=>{
  assert.ok(joineryOccupies(67,{open:false},[.5,.5,.5]));
  assert.equal(joineryOccupies(67,{open:true},[.5,.5,.5]),false);
  assert.ok(joineryOccupies(67,{open:true},[.18,.5,.5]));
  assert.equal(joineryOccupies(67,{open:false},[.18,.5,.2]),false);
  assert.ok(joineryOccupies(67,{open:true},[.18,.5,.2]));
});
test('trapdoor transitions between horizontal walking panel and vertical hatch',()=>{
  assert.ok(joineryOccupies(68,{variant:'upper',open:false},[.5,.88,.5]));
  assert.equal(joineryOccupies(68,{variant:'upper',open:false},[.5,.5,.5]),false);
  assert.equal(joineryOccupies(68,{variant:'upper',open:true},[.5,.88,.5]),false);
  assert.ok(joineryOccupies(68,{variant:'upper',open:true},[.5,.5,.14]));
  assert.ok(joineryOccupies(68,{variant:'lower',open:false},[.5,.1,.5]));
  assert.equal(joineryOccupies(68,{variant:'lower',open:false},[.5,.88,.5]),false);
});
test('malformed IDs, rotations, variants and open state fail closed',()=>{
  assert.throws(()=>joineryCell(4),RangeError);
  assert.throws(()=>joineryCell(69),RangeError);
  assert.throws(()=>joineryCell(65,{variant:'upper'}),RangeError);
  assert.throws(()=>joineryCell(63,{open:true}),RangeError);
  assert.throws(()=>joineryCell(67,{open:'open'}),RangeError);
  assert.throws(()=>joineryCell(68,{rotation:4}),RangeError);
  assert.throws(()=>nextJoineryState(64),RangeError);
  assert.throws(()=>parseJoineryCell({id:66,rotation:0,variant:'standard',open:false,debug:1}),TypeError);
});
test('rotations and open/close states do not consume separate persistent IDs',()=>{
  for(const spec of PACK_2_JOINERY){
    const states=spec.toggleable?[false,true]:[false];
    for(const open of states){
      for(const rot of spec.rotatable?[0,1,2,3]:[0]){
        assert.equal(joineryShape(spec.id,{rotation:rot,open}).id,spec.id);
      }
    }
  }
});
test('fixture can place a closed gate, swing it, and ray target the moved physical volume',()=>{
  const f=new Pack2Fixture(); f.select(66);
  assert.equal(f.place([0,0,0]),true);
  let h=f.target([.5,.34,-1],[0,0,1],6);
  assert.equal(h.id,66);assert.equal(h.open,false);
  const opened=f.toggleCell([0,0,0]);assert.equal(opened.open,true);
  assert.equal(f.target([.5,.34,-1],[0,0,1],6),null);
  const hitMoved=f.target([.18,.34,-1],[0,0,1],6);
  assert.equal(hitMoved.id,66);assert.equal(hitMoved.open,true);
  assert.ok(f.mineRay([.18,.34,-1],[0,0,1],6).removed);
  assert.equal(f.read([0,0,0]),null);
});
test('fixture offers 10 selectable candidates and real isolated state controls',()=>{
  const f=new Pack2Fixture();
  f.select(64);f.turn();assert.equal(f.selection().rotation,1);
  f.cycleVariant();assert.equal(f.selection().variant,'upper');
  f.select(68);f.cycleVariant();assert.equal(f.selection().variant,'lower');
  f.toggleSelection();assert.equal(f.selection().open,true);
  assert.ok(f.place([5,1,3]));
  assert.equal(f.read([5,1,3]).open,true);
  assert.equal(f.toggleCell([5,1,3]).open,false);
  f.select(59);assert.throws(()=>f.toggleSelection(),RangeError);
});
test('old fixture snapshots remain readable, new state snapshots round-trip losslessly',()=>{
  const f=new Pack2Fixture();f.place([0,1,0]);
  const old=f.serialize();
  assert.deepEqual(old.cells[0],[0,1,0,59,0]);
  assert.deepEqual(Pack2Fixture.restore(JSON.parse(JSON.stringify(old))).serialize(),old);
  f.select(68);f.turn();f.cycleVariant();f.toggleSelection();
  assert.ok(f.place([2,1,0]));
  const full=f.serialize(),restored=Pack2Fixture.restore(JSON.parse(JSON.stringify(full)));
  assert.deepEqual(restored.serialize(),full);
  assert.deepEqual(full.cells[1],[2,1,0,68,1,'lower',true]);
  assert.equal(restored.read([2,1,0]).open,true);
  assert.equal(new VoxelWorld().set(2,1,0,68),false);
  assert.throws(()=>VoxelWorld.restore(full));
});
test('fixture rejects malformed state fields and duplicate coordinates on restore',()=>{
  const f=new Pack2Fixture(),base=f.serialize();
  assert.throws(()=>Pack2Fixture.restore({...base,cells:[[0,0,0,68,1,'upper']]}),TypeError);
  assert.throws(()=>Pack2Fixture.restore({...base,cells:[[0,0,0,68,1,'upper','yes']]}),RangeError);
  assert.throws(()=>Pack2Fixture.restore({...base,cells:[[0,0,0,68,1,'upper',true],[0,0,0,68,1,'upper',false]]}),TypeError);
  assert.throws(()=>Pack2Fixture.restore({...base,cells:[[0,0,0,59,0,'lower',false]]}),TypeError);
  assert.throws(()=>Pack2Fixture.restore({...base,cells:[[0,0,0,255,0]]}),RangeError);
});
test('all original material candidates preserve stable IDs and old fixture targeting',()=>{
  const f=new Pack2Fixture();f.select(62);f.place([0,0,0]);
  assert.equal(f.target([.95,.5,-1],[0,0,1]),null);
  assert.equal(f.target([.5,.5,-1],[0,0,1]).id,62);
  assert.equal(f.mineRay([.5,.5,-1],[0,0,1]).removed,true);
});

test('adjoining split-rail fences physically connect both rails in all four rotations',()=>{
  // The original .10..90 rail spans left .20-cell holes between adjoining
  // fence tiles. Structural rails must meet at each cell boundary, while
  // the open air between lower and upper rails remains targetably empty.
  const moves=[[1,0,0],[0,0,1],[-1,0,0],[0,0,-1]];
  for(let rotation=0;rotation<4;rotation++){
    const state={rotation},shape=joineryShape(65,state),movement=moves[rotation];
    const railParts=shape.parts.filter(part=>part.role==='wood');
    assert.equal(railParts.length,2,'two physical split rails');
    const axis=rotation%2===0?0:2,sign=movement[axis];
    for(const rail of railParts){
      const a=rail.box,b=a.map((v,i)=>v+movement[i%3]);
      const boundary=sign===1?1:0;
      assert.equal(a[axis+(sign===1?3:0)],boundary,
        'rail must reach outgoing voxel face');
      assert.equal(b[axis+(sign===1?0:3)],boundary,
        'matching rail in neighboring voxel must touch');
      const axes=[0,1,2].filter(i=>i!==axis);
      const faceArea=axes.reduce((area,i)=>area*Math.max(0,
        Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])),1);
      assert.ok(faceArea>=.021,'physical end-face overlap expected');
    }
    assert.equal(joineryOccupies(65,state,[.5,.54,.5]),false,
      'middle fence opening must stay physically open');
    assert.ok(joineryPreviewMesh(65,state).triangles<=336,
      'do not inflate the original split-fence triangle budget');
  }
});
