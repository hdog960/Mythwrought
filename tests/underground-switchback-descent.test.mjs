import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {WORLD_MIN_Y} from '../src/depth.mjs';
import {descentWorld,descentRoute,descentEvidence,descentConnectivity} from '../src/underground-switchback-descent.mjs';
for(const seed of [179,1,2026,-77])test('four depth bands have solid floors and two-block air: '+seed,()=>{
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const bands=descentEvidence(world);
  assert.equal(bands.length,4);
  for(const b of bands){assert.ok(b.count>30,JSON.stringify(b));assert.equal(b.invalid,0,JSON.stringify(b));}
  const route=descentRoute();
  assert.ok(route.at(-1).floor<=WORLD_MIN_Y+8);
  assert.equal(JSON.stringify(world.save()),before);
});
test('player edits override cave and persist through schema-1 save/restore',()=>{
  const world=new VoxelWorld(179),p=descentRoute()[400];
  assert.equal(world.set(p.x,p.feet,p.z,BLOCK.WOOD),true);
  const snapshot=world.save(),restored=VoxelWorld.restore(snapshot);
  assert.deepEqual(restored.save(),snapshot);
  assert.equal(descentWorld(restored).get(p.x,p.feet,p.z),BLOCK.WOOD);
  assert.ok(descentEvidence(restored).some(b=>b.invalid>0));
});
test('legacy terrain and unopened surface floor are untouched',()=>{
  const world=new VoxelWorld(179),reader=descentWorld(world);
  for(const [x,y,z] of [[192,-3,192],[192,0,192],[208,8,208],[220,12,220]])
    assert.equal(reader.get(x,y,z),world.get(x,y,z));
});

for(const seed of [179,1,2026,-77])test('ordered four-band descent connectivity '+seed,()=>{
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const audit=descentConnectivity(world);
  assert.equal(audit.connected,true,JSON.stringify(audit.failures.slice(0,5)));
  assert.equal(audit.bands.length,4);
  assert.ok(audit.bands.every(n=>n>30));
  assert.equal(audit.surfaceConnected,false);
  assert.equal(JSON.stringify(world.save()),before);
});
test('player-edited obstruction makes full-depth route fail',()=>{
  const world=new VoxelWorld(179),p=descentRoute()[350];
  assert.equal(world.set(p.x,p.feet,p.z,BLOCK.WOOD),true);
  const audit=descentConnectivity(world);
  assert.equal(audit.connected,false);
  assert.ok(audit.failures.some(f=>f.reason==='blocked-or-unsupported'));
});
test('edited missing floor makes full-depth route fail',()=>{
  const world=new VoxelWorld(179),p=descentRoute()[550];
  assert.equal(world.set(p.x,p.floor,p.z,BLOCK.AIR),true);
  const audit=descentConnectivity(world);
  assert.equal(audit.connected,false);
});

test('first descending step has full headroom below untouched legacy floor',()=>{
  const world=new VoxelWorld(179),reader=descentWorld(world),route=descentRoute();
  const first=route[0];
  assert.ok(first.feet+3<-3,'four-cell tunnel must remain below legacy -3');
  for(let h=1;h<=4;h++)assert.equal(reader.get(first.x,first.floor+h,first.z),BLOCK.AIR);
  assert.notEqual(reader.get(first.x,first.floor,first.z),BLOCK.AIR);
  assert.equal(reader.get(first.x,-3,first.z),world.get(first.x,-3,first.z));
  assert.equal(descentConnectivity(world).connected,true);
});

// A broad chamber's floor must never plug the descending approach corridor.
test('all four chamber approaches remain traversable after floor composition',()=>{
  const world=new VoxelWorld(179),reader=descentWorld(world),route=descentRoute();
  for(const floor of [-30,-80,-130,-180]){
    const approach=route.filter(p=>Math.abs(p.floor-floor)<=2);
    assert.ok(approach.length>=12,'expected multiple descent steps near '+floor);
    for(const p of approach){
      assert.notEqual(reader.get(p.x,p.floor,p.z),BLOCK.AIR,'missing floor at '+p.floor);
      for(let h=1;h<=2;h++)assert.equal(reader.get(p.x,p.floor+h,p.z),BLOCK.AIR,
        'chamber blocked route at '+p.floor+' head offset '+h);
    }
  }
});

test('eight outward grottoes have supported, clear galleries and distinct chambers',()=>{
  const world=new VoxelWorld(179),reader=descentWorld(world),route=descentRoute();
  for(const depth of [-30,-80,-130,-180]){
    const p=route.find(q=>q.floor===depth);
    assert.ok(p,'missing anchor at '+depth);
    const lx=p.x-192,lz=p.z-192;
    const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    for(let branch=0;branch<2;branch++){
      for(const along of [5,10,15,22]){
        const out=Math.min(along,12),turn=branch===1?Math.max(0,along-12):0;
        const x=p.x+outward[0]*out+tangent[0]*turn;
        const z=p.z+outward[1]*out+tangent[1]*turn;
        assert.equal(reader.get(x,depth,z),BLOCK.DEEPSTONE,'gallery floor '+depth+'/'+branch+'/'+along);
        for(let h=1;h<=3;h++)assert.equal(reader.get(x,depth+h,z),BLOCK.AIR,
          'gallery headroom '+depth+'/'+branch+'/'+along);
      }
    }
  }
  assert.equal(descentConnectivity(world).connected,true);
});

test('four underground levels have a physically clear outer return loop',()=>{
  const world=new VoxelWorld(179),reader=descentWorld(world),route=descentRoute();
  for(const depth of [-30,-80,-130,-180]){
    const anchor=route.find(p=>p.floor===depth);
    assert.ok(anchor,'missing depth anchor '+depth);
    const lx=anchor.x-192,lz=anchor.z-192;
    const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    for(let t=0;t<=10;t++){
      const x=anchor.x+outward[0]*19+tangent[0]*t;
      const z=anchor.z+outward[1]*19+tangent[1]*t;
      assert.equal(reader.get(x,depth,z),BLOCK.DEEPSTONE,'loop floor '+depth+'/'+t);
      for(let h=1;h<=3;h++)
        assert.equal(reader.get(x,depth+h,z),BLOCK.AIR,'loop headroom '+depth+'/'+t+'/'+h);
    }
  }
  assert.equal(descentConnectivity(world).connected,true);
});
