// :36 full-depth cave acceptance guard: each band must be physically walkable.
// This is an isolated candidate test; it does not register or deploy the cave.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {descentRoute,descentWorld,descentConnectivity,descentEvidence,descentVolumeEvidence} from '../src/underground-switchback-descent.mjs';

const SEEDS=[179,1,2026,-77];
const BANDS=[[-4,-45],[-46,-100],[-101,-155],[-156,-209]];
for(const seed of SEEDS){
  test('four-band route is physically continuous, save-neutral and populated: '+seed,()=>{
    const world=new VoxelWorld(seed);
    const snapshot=JSON.stringify(world.save());
    const reader=descentWorld(world);
    const route=descentRoute();
    const report=descentConnectivity(world);
    assert.equal(report.connected,true,JSON.stringify(report.failures.slice(0,8)));
    assert.equal(report.bands.length,4);
    const volumes=descentVolumeEvidence(world);
    for(let band=0;band<4;band++){
      const [high,low]=BANDS[band];
      const positions=route.filter(p=>p.floor<=high&&p.floor>=low);
      assert.ok(positions.length>10,'missing route in band '+band);
      assert.ok(volumes[band].air>100,'missing carved air in band '+band);
      assert.ok(volumes[band].solid>30,'missing solid footing in band '+band);
      for(const p of positions){
        assert.notEqual(reader.get(p.x,p.floor,p.z),BLOCK.AIR,'unsupported '+p.floor);
        for(let h=1;h<=4;h++)
          assert.equal(reader.get(p.x,p.floor+h,p.z),BLOCK.AIR,'blocked player body at '+p.floor);
      }
    }
    assert.equal(JSON.stringify(world.save()),snapshot,'candidate reader changed save');
  });
  for(let band=0;band<4;band++){
    test('saved obstruction invalidates band '+band+' at seed '+seed,()=>{
      const world=new VoxelWorld(seed);
      const [high,low]=BANDS[band];
      const positions=descentRoute().filter(p=>p.floor<=high&&p.floor>=low);
      const p=positions[Math.floor(positions.length/2)];
      assert.ok(p,'missing band waypoint');
      assert.equal(world.set(p.x,p.feet,p.z,BLOCK.WOOD),true);
      const saved=world.save();
      const restored=VoxelWorld.restore(saved);
      assert.equal(descentWorld(restored).get(p.x,p.feet,p.z),BLOCK.WOOD);
      const audit=descentConnectivity(restored);
      assert.equal(audit.connected,false,'obstruction must fail full-depth readiness');
      assert.ok(audit.failures.some(f=>f.reason==='blocked-or-unsupported'));
      assert.deepEqual(restored.save(),saved,'candidate audit modified saved edits');
    });
  }
}

for(const seed of SEEDS){
  for(let band=0;band<4;band++){
    test('saved overhead edit rejects four-cell route envelope, band '+band+' seed '+seed,()=>{
      const world=new VoxelWorld(seed);
      const [high,low]=BANDS[band];
      const positions=descentRoute().filter(p=>p.floor<=high&&p.floor>=low);
      const p=positions[Math.floor(positions.length/2)];
      assert.ok(p);
      assert.equal(world.set(p.x,p.feet+3,p.z,BLOCK.WOOD),true);
      const saved=world.save();
      const restored=VoxelWorld.restore(saved);
      assert.equal(descentWorld(restored).get(p.x,p.feet+3,p.z),BLOCK.WOOD);
      const report=descentConnectivity(restored);
      assert.equal(report.connected,false,'overhead obstruction must reject readiness');
      assert.ok(report.failures.some(f=>f.reason==='blocked-or-unsupported'&&f.height===3));
      assert.deepEqual(restored.save(),saved,'validation must not mutate player edits');
    });
  }
}

for(const seed of SEEDS){
  for(let band=0;band<4;band++){
    test('band evidence rejects saved ceiling and non-geological footing: '+seed+' / '+band,()=>{
      const [high,low]=BANDS[band];
      const p=descentRoute().find(q=>q.floor<=high&&q.floor>=low);
      assert.ok(p);
      const ceiling=new VoxelWorld(seed);
      assert.equal(ceiling.set(p.x,p.feet+3,p.z,BLOCK.WOOD),true);
      const ceilingSave=ceiling.save();
      assert.ok(descentEvidence(ceiling)[band].invalid>0,'fourth clearance cell must be checked');
      assert.deepEqual(ceiling.save(),ceilingSave);
      const floor=new VoxelWorld(seed);
      assert.equal(floor.set(p.x,p.floor,p.z,BLOCK.WOOD),true);
      const floorSave=floor.save();
      assert.ok(descentEvidence(floor)[band].invalid>0,'wood cannot count as geological support');
      assert.deepEqual(floor.save(),floorSave);
    });
  }
}
