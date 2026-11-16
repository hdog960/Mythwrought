import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {WORLD_MIN_Y} from '../src/depth.mjs';
import {descentWorld,descentRoute,descentEvidence,descentConnectivity,descentVolumeEvidence,descentLoopConnectivity,descentEntranceApproach,descentEntranceHandoff} from '../src/underground-switchback-descent.mjs';
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

test('middle-depth echo hall has a continuous stepped entrance and broad lower terrace',()=>{
  for(const seed of [179,1,2026,-77]){
    const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
    const reader=descentWorld(world),anchor=descentRoute().find(p=>p.floor===-105);
    assert.ok(anchor);
    const lx=anchor.x-192,lz=anchor.z-192;
    const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    for(let d=0;d<=42;d++){
      const floor=-105-Math.min(2,Math.floor(d/14));
      // The narrow throat avoids the adjacent spiral's supporting wall.
      for(let across=-(d<4?0:2);across<=(d<4?0:2);across++){
        const x=anchor.x+outward[0]*d+tangent[0]*across;
        const z=anchor.z+outward[1]*d+tangent[1]*across;
        assert.equal(reader.get(x,floor,z),BLOCK.DEEPSTONE,'support '+seed+'/'+d+'/'+across);
        for(let h=1;h<=2;h++)
          assert.equal(reader.get(x,floor+h,z),BLOCK.AIR,'clearance '+seed+'/'+d+'/'+across+'/'+h);
      }
    }
    for(const across of [-8,0,8]){
      const x=anchor.x+outward[0]*36+tangent[0]*across;
      const z=anchor.z+outward[1]*36+tangent[1]*across;
      assert.equal(reader.get(x,-107,z),BLOCK.DEEPSTONE);
      assert.equal(reader.get(x,-106,z),BLOCK.AIR);
    }
    assert.equal(descentConnectivity(world).connected,true);
    assert.equal(JSON.stringify(world.save()),before);
  }
});

test('deepest crescent refuge has supported cavern, pocket and connected approach across seeds',()=>{
  for(const seed of [179,1,2026,-77]){
    const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
    const reader=descentWorld(world),anchor=descentRoute().find(p=>p.floor===-195);
    assert.ok(anchor,'missing deepest refuge anchor');
    const lx=anchor.x-192,lz=anchor.z-192;
    const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    const at=(d,t,y)=>reader.get(anchor.x+outward[0]*d+tangent[0]*t,y,
                                anchor.z+outward[1]*d+tangent[1]*t);
    for(let d=0;d<=30;d++){
      assert.equal(at(d,0,-195),BLOCK.DEEPSTONE,'approach floor '+d);
      for(let h=1;h<=2;h++)assert.equal(at(d,0,-195+h),BLOCK.AIR,'approach clearance '+d);
    }
    for(const [d,t] of [[31,0],[40,10],[39,5]]){
      assert.equal(at(d,t,-195),BLOCK.DEEPSTONE,'cavern support');
      for(let h=1;h<=5;h++)assert.equal(at(d,t,-195+h),BLOCK.AIR,'cavern headroom');
    }
    assert.equal(descentConnectivity(world).connected,true);
    assert.equal(JSON.stringify(world.save()),before);
  }
});

for(const seed of [179,1,2026,-77])test('physical authored cave volume has air AND stone in every band '+seed,()=>{
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const volumes=descentVolumeEvidence(world);
  assert.equal(volumes.length,4);
  for(const band of volumes){
    assert.ok(band.air>100,'entirely solid or missing cave air: '+JSON.stringify(band));
    assert.ok(band.solid>30,'missing physical supporting stone: '+JSON.stringify(band));
  }
  assert.equal(JSON.stringify(world.save()),before);
});

test('two intermediate vaults remain connected to the four-band physical descent',()=>{
  for(const seed of [179,1,2026,-77]){
    const world=new VoxelWorld(seed),reader=descentWorld(world),route=descentRoute();
    for(const spec of [{depth:-60,reach:30},{depth:-150,reach:35}]){
      const p=route.find(q=>q.floor===spec.depth);
      assert.ok(p,'missing intermediate anchor '+spec.depth);
      const lx=p.x-192,lz=p.z-192;
      const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
      for(let d=0;d<=spec.reach;d++){
        const x=p.x+outward[0]*d,z=p.z+outward[1]*d;
        assert.equal(reader.get(x,spec.depth,z),BLOCK.DEEPSTONE,
          'missing connected vault floor '+spec.depth+'/'+d);
        for(let h=1;h<=3;h++)assert.equal(reader.get(x,spec.depth+h,z),BLOCK.AIR,
          'blocked connected vault throat '+spec.depth+'/'+d+'/'+h);
      }
    }
    assert.equal(descentConnectivity(world).connected,true);
  }
});

for(const seed of [179,1,2026,-77])test('four physical side loops remain traversable '+seed,()=>{
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const audit=descentLoopConnectivity(world);
  assert.equal(audit.levels.length,4);
  assert.equal(audit.connected,true,JSON.stringify(audit.levels.map(l=>({depth:l.depth,failures:l.failures.slice(0,3)}))));
  assert.equal(JSON.stringify(world.save()),before);
});
test('an edited obstruction invalidates its physical return loop',()=>{
  const world=new VoxelWorld(179);
  const anchor=descentRoute().find(p=>p.floor===-80);
  const lx=anchor.x-192,lz=anchor.z-192;
  const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
  const tangent=[outward[1],-outward[0]];
  const x=anchor.x+outward[0]*19+tangent[0]*5;
  const z=anchor.z+outward[1]*19+tangent[1]*5;
  assert.equal(world.set(x,-79,z,BLOCK.WOOD),true);
  const restored=VoxelWorld.restore(world.save());
  const audit=descentLoopConnectivity(restored);
  assert.equal(audit.connected,false);
  assert.ok(audit.levels.find(l=>l.depth===-80).failures.some(f=>f.part==='outer-return'));
});

for(const seed of [179,1,2026,-77])test('protected surface handoff has a four-step physical descent '+seed,()=>{
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const reader=descentWorld(world),steps=descentEntranceApproach();
  const handoff=descentEntranceHandoff();
  assert.equal(steps.length,5);
  assert.equal(handoff.requiresSurfaceOwner,true);
  assert.deepEqual(handoff.opening,{x:192,y:-3,z:188});
  assert.deepEqual(steps.at(-1),{x:192,z:192,floor:-8,feet:-7});
  assert.deepEqual(steps.at(-1),descentRoute()[0]);
  for(let i=0;i<steps.length;i++){
    const p=steps[i];
    assert.equal(reader.get(p.x,p.floor,p.z),BLOCK.DEEPSTONE,'step floor '+i);
    for(let y=p.feet;y<=Math.min(-4,p.feet+3);y++)
      assert.equal(reader.get(p.x,y,p.z),BLOCK.AIR,'below-legacy approach air '+i+'/'+y);
    if(i){
      assert.equal(p.z-steps[i-1].z,1);
      assert.equal(p.floor-steps[i-1].floor,-1);
    }
    for(let y=-3;y<=0;y++)
      assert.equal(reader.get(p.x,y,p.z),world.get(p.x,y,p.z),'legacy modified '+i+'/'+y);
  }
  assert.equal(JSON.stringify(world.save()),before);
});
test('surface breach remains unclaimed and player edits override candidate entrance',()=>{
  const world=new VoxelWorld(179),p=descentEntranceApproach()[2];
  assert.equal(world.set(p.x,p.feet,p.z,BLOCK.WOOD),true);
  const restored=VoxelWorld.restore(world.save());
  assert.equal(descentWorld(restored).get(p.x,p.feet,p.z),BLOCK.WOOD);
  assert.equal(descentEntranceHandoff().requiresSurfaceOwner,true);
});

test('entrance audit distinguishes candidate approach from unopened surface',async()=>{
  const {descentEntranceConnectivity}=await import('../src/underground-switchback-descent.mjs');
  for(const seed of [179,1,2026,-77]){
    const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
    const audit=descentEntranceConnectivity(world);
    // The legacy surface has not been opened by :24. Do not misreport
    // a candidate stair geometry as accessible from the playable surface.
    assert.equal(audit.approachConnected,false);
    assert.ok(audit.failures.some(f=>f.reason==='blocked-or-unsupported' || f.reason==='step-head-obstruction'),
      'unopened legacy throat must fail physical traversal');
    assert.equal(audit.surfaceConnected,false);
    assert.equal(audit.requiresSurfaceOwner,true);
    assert.deepEqual(audit.opening,{x:192,y:-3,z:188});
    assert.equal(JSON.stringify(world.save()),before);
  }
});
test('entrance audit rejects a saved obstruction and missing support',async()=>{
  const {descentEntranceConnectivity}=await import('../src/underground-switchback-descent.mjs');
  const p=descentEntranceApproach()[2];
  const blocked=new VoxelWorld(179);
  assert.equal(blocked.set(p.x,p.feet,p.z,BLOCK.WOOD),true);
  assert.equal(descentEntranceConnectivity(VoxelWorld.restore(blocked.save())).approachConnected,false);
  const unsupported=new VoxelWorld(179);
  assert.equal(unsupported.set(p.x,p.floor,p.z,BLOCK.AIR),true);
  assert.equal(descentEntranceConnectivity(VoxelWorld.restore(unsupported.save())).approachConnected,false);
});

test('surface seam fails closed on unopened legacy terrain and does not mutate saves',async()=>{
  const {descentSurfaceSeam}=await import('../src/underground-switchback-descent.mjs');
  for(const seed of [179,1,2026,-77]){
    const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
    const seam=descentSurfaceSeam(world);
    assert.deepEqual(seam.opening,{x:192,y:-3,z:188});
    assert.equal(seam.runtimeVerified,false);
    assert.equal(seam.requiresSurfaceOwner,true);
    assert.equal(seam.clear,false,'legacy terrain must not masquerade as a surface opening');
    assert.ok(seam.failures.some(f=>f.reason==='surface-headroom'));
    assert.equal(JSON.stringify(world.save()),before);
  }
});
test('surface seam reports a saved player obstruction without overwriting it',async()=>{
  const {descentSurfaceSeam}=await import('../src/underground-switchback-descent.mjs');
  const world=new VoxelWorld(179),p=descentEntranceApproach()[0];
  assert.equal(world.set(p.x,p.feet,p.z,BLOCK.WOOD),true);
  const saved=world.save(),restored=VoxelWorld.restore(saved);
  const seam=descentSurfaceSeam(restored);
  assert.equal(seam.clear,false);
  assert.ok(seam.failures.some(f=>f.x===p.x&&f.y===p.feet&&f.z===p.z));
  assert.deepEqual(restored.save(),saved);
});

test('surface seam probes candidate carving below legacy and rejects saved deep edits',async()=>{
  const {descentSurfaceSeam,descentWorld}=await import('../src/underground-switchback-descent.mjs');
  const world=new VoxelWorld(179);
  const steps=descentEntranceApproach();
  const deep=steps.at(-1);
  const reader=descentWorld(world);
  assert.equal(reader.get(deep.x,deep.feet,deep.z),BLOCK.AIR,
    'candidate descent must carve the lower stair headroom');
  const baseline=descentSurfaceSeam(world);
  assert.ok(!baseline.failures.some(f=>f.x===deep.x&&f.y===deep.feet),
    'unmodified solid world must not hide the candidate-carved lower stair');
  assert.equal(world.set(deep.x,deep.feet,deep.z,BLOCK.WOOD),true);
  const saved=world.save(),restored=VoxelWorld.restore(saved);
  const blocked=descentSurfaceSeam(restored);
  assert.ok(blocked.failures.some(f=>f.x===deep.x&&f.y===deep.feet&&f.reason==='candidate-headroom'));
  assert.deepEqual(restored.save(),saved);
  assert.equal(blocked.runtimeVerified,false);
});

for(const seed of [179,1,2026,-77])test('lower mineral gallery forks and rejoins with physical support '+seed,()=>{
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const reader=descentWorld(world),anchor=descentRoute().find(p=>p.floor===-120);
  assert.ok(anchor,'missing lower-band route anchor');
  const lx=anchor.x-192,lz=anchor.z-192;
  const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
  const tangent=[outward[1],-outward[0]];
  const at=(d,t,y)=>reader.get(anchor.x+outward[0]*d+tangent[0]*t,y,
                              anchor.z+outward[1]*d+tangent[1]*t);
  for(let d=0;d<=12;d++){
    assert.equal(at(d,0,-120),BLOCK.DEEPSTONE,'vestibule support '+d);
    assert.equal(at(d,0,-119),BLOCK.AIR,'vestibule headroom '+d);
  }
  for(let d=12;d<=36;d++){
    const arc=Math.round(7*Math.sin(Math.PI*(d-12)/24));
    for(const t of [arc,-arc]){
      assert.equal(at(d,t,-120),BLOCK.DEEPSTONE,'arm support '+d+'/'+t);
      assert.equal(at(d,t,-119),BLOCK.AIR,'arm headroom '+d+'/'+t);
      assert.equal(at(d,t,-118),BLOCK.AIR,'arm body clearance '+d+'/'+t);
    }
  }
  assert.equal(at(38,0,-120),BLOCK.DEEPSTONE);
  assert.equal(at(38,0,-119),BLOCK.AIR);
  assert.equal(descentConnectivity(world).connected,true);
  assert.equal(JSON.stringify(world.save()),before);
});
test('saved player obstruction remains authoritative in lower mineral gallery',()=>{
  const world=new VoxelWorld(179),anchor=descentRoute().find(p=>p.floor===-120);
  const lx=anchor.x-192,lz=anchor.z-192;
  const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
  const tangent=[outward[1],-outward[0]];
  const x=anchor.x+outward[0]*24+tangent[0]*7;
  const z=anchor.z+outward[1]*24+tangent[1]*7;
  assert.equal(world.set(x,-119,z,BLOCK.WOOD),true);
  const restored=VoxelWorld.restore(world.save());
  assert.equal(descentWorld(restored).get(x,-119,z),BLOCK.WOOD);
});
