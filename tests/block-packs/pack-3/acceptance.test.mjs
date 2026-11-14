import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK3_CANDIDATE_ASSETS,PACK3_CANDIDATE_IDS,pack3CandidateById,
  pack3CandidateShape,pack3CandidateMeshDescriptor,pack3CandidateReviewManifest}
  from '../../../src/block-packs/pack-3/catalog.mjs';
import {PACK3_ROSTER,validatePack3Manifest}
  from '../../../src/block-packs/pack-3/manifest.mjs';
import {createPack3Fixture,restorePack3Fixture,ROOF_MATERIAL_FIXTURE_FORMAT}
  from '../../../src/block-packs/pack-3/fixture.mjs';
import {createPack3RoofGeometryFixture,restorePack3RoofGeometryFixture}
  from '../../../src/block-packs/pack-3/roof-geometry-fixture.mjs';
import {createPack3FortifiedFixture,restorePack3FortifiedFixture}
  from '../../../src/block-packs/pack-3/fortified-fixture.mjs';
import {createPack3OrnamentalFixture,restorePack3OrnamentalFixture}
  from '../../../src/block-packs/pack-3/ornamental-fixture.mjs';
import {createPack3MonumentalFixture,restorePack3MonumentalFixture}
  from '../../../src/block-packs/pack-3/monumental-fixture.mjs';
const filled=(shape,x,y,z)=>shape.boxes.some(b=>
  x>=b[0]&&x<b[3]&&y>=b[1]&&y<b[4]&&z>=b[2]&&z<b[5]);
test('one candidate catalog resolves exactly all seventeen roster families without ID aliasing',()=>{
  assert.equal(validatePack3Manifest(),true);
  assert.deepEqual(PACK3_CANDIDATE_IDS,Array.from({length:17},(_,i)=>109+i));
  assert.deepEqual(PACK3_ROSTER.map(a=>a.id),PACK3_CANDIDATE_IDS);
  assert.equal(new Set(PACK3_CANDIDATE_IDS).size,17);
  assert.equal(new Set(PACK3_CANDIDATE_ASSETS.map(a=>a.roster)).size,17);
  assert.equal(new Set(PACK3_CANDIDATE_ASSETS.map(a=>a.name)).size,17);
  assert.ok(Object.isFrozen(PACK3_CANDIDATE_ASSETS));
});
test('exclusive candidate lookup fails closed for absent ID and reserved sentinel',()=>{
  for(const id of [0,1,3,5,8,108,126,158,159,255,-1,1.5,NaN,Infinity])
    assert.equal(pack3CandidateById(id),null);
  for(const rot of [-1,4,1.5,NaN,Infinity])
    assert.throws(()=>pack3CandidateById(109,rot),RangeError);
});
test('roof surfaces are intentionally rotation 0 only; other physical components allow quarter turns',()=>{
  for(let id=109;id<=112;id++){
    assert.ok(pack3CandidateById(id,0));
    for(let r=1;r<=3;r++){
      assert.equal(pack3CandidateById(id,r),null);
      assert.equal(pack3CandidateShape(id,r),null);
      assert.equal(pack3CandidateMeshDescriptor(id,r),null);
    }
  }
  for(let id=113;id<=125;id++)for(let r=0;r<4;r++){
    const a=pack3CandidateById(id,r);
    assert.equal(a.id,id);assert.equal(a.rotation,r);
  }
});
test('all 56 supported ID/orientation pairs expose the same immutable collision and mesh boxes',()=>{
  let count=0;
  for(let id=109;id<=125;id++)for(let r=0;r<=(id<=112?0:3);r++){
    const a=pack3CandidateById(id,r),s=pack3CandidateShape(id,r);
    const p=pack3CandidateMeshDescriptor(id,r);
    count++;
    assert.equal(a.boxes,s.boxes);
    assert.equal(a.boxes,p.boxes);
    assert.equal(a.boxes,a.selection.boxes);
    assert.equal(a.boxes,a.collision.boxes);
    assert.equal(p.prototypeOnly,true);
    assert.equal(p.placeable,false);
    assert.ok(a.boxes.length>1&&a.boxes.length<=32);
    for(const [x,y,z,X,Y,Z] of a.boxes){
      assert.ok([x,y,z,X,Y,Z].every(Number.isFinite));
      assert.ok(x>=0&&y>=0&&z>=0&&X<=1&&Y<=1&&Z<=1);
      assert.ok(x<X&&y<Y&&z<Z);
    }
  }
  assert.equal(count,56);
});
test('candidate assets keep physical silhouettes, non-repeating IDs and meaningful distinct visual data',()=>{
  const signatures=new Set();
  for(const a of PACK3_CANDIDATE_ASSETS){
    assert.notDeepEqual(a.boxes,[[0,0,0,1,1,1]]);
    assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.parts));
    assert.equal(a.sourcePack??3,3);
    const signature=JSON.stringify(a.boxes);
    assert.equal(signatures.has(signature),false,a.name+' copied geometry');
    signatures.add(signature);
    assert.equal(a.status??'unmerged-candidate','unmerged-candidate');
    assert.ok(Object.values(a.colors).every(c=>/^#[0-9a-f]{6}$/i.test(c)));
  }
});
test('critical hollow silhouettes remain actual empty space, not cosmetic overlays',()=>{
  assert.equal(filled(pack3CandidateShape(116),.5,.65,.5),false,'arrow slit');
  assert.equal(filled(pack3CandidateShape(117),.5,.7,.5),false,'crenel');
  assert.equal(filled(pack3CandidateShape(121),.5,.5,.5),false,'arched window');
  assert.equal(filled(pack3CandidateShape(123),.5,.55,.5),false,'aqueduct channel');
  assert.equal(filled(pack3CandidateShape(125),.5,.26,.5),false,'statue leg gap');
  assert.equal(filled(pack3CandidateShape(123),.5,.15,.5),true,'channel floor');
  assert.equal(filled(pack3CandidateShape(125),.2,.55,.18),true,'shield projects');
});
test('uniform handoff manifest marks ALL entries as candidate-only and never live registered',()=>{
  const review=pack3CandidateReviewManifest();
  assert.equal(review.length,17);
  assert.ok(Object.isFrozen(review));
  for(const a of review){
    assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.rotations));
    assert.equal(a.integrated,false);
    assert.equal(a.liveRegistered,false);
    assert.equal(a.boxCount,pack3CandidateById(a.id).boxes.length);
    assert.deepEqual(a.rotations,a.id<=112?[0]:[0,1,2,3]);
  }
});
test('ALL candidate fixture snapshots lack player save schema and cannot cross-restore',()=>{
  const surfaces=createPack3Fixture(),slopes=createPack3RoofGeometryFixture();
  assert.equal(surfaces.place([1,2,3],109),true);
  assert.equal(slopes.place([2,2,3],113,1),true);
  const snapshots=[surfaces.snapshot(),slopes.snapshot()];
  assert.equal(snapshots[0].format,ROOF_MATERIAL_FIXTURE_FORMAT);
  assert.equal(snapshots[0].edits[0][3],109);
  for(const payload of snapshots){
    assert.equal(Object.hasOwn(payload,'schema'),false);
    for(const restore of [restorePack3Fixture,restorePack3RoofGeometryFixture,
      restorePack3FortifiedFixture,restorePack3OrnamentalFixture,
      restorePack3MonumentalFixture]){
      // Only the matching preview decoder is allowed to accept this input.
      const accepts=payload===snapshots[0]?restore===restorePack3Fixture:
        restore===restorePack3RoofGeometryFixture;
      if(accepts)assert.doesNotThrow(()=>restore(payload));
      else assert.throws(()=>restore(payload),TypeError);
    }
  }
  assert.throws(()=>restorePack3Fixture({...snapshots[0],schema:1}),TypeError);
  assert.throws(()=>restorePack3RoofGeometryFixture({...snapshots[1],schema:1}),TypeError);
});
test('missing generic functionality stays explicitly blocked, never falsely implemented',()=>{
  const channel=pack3CandidateById(123),spire=pack3CandidateById(124),statue=pack3CandidateById(125);
  assert.equal(channel.dependencies.flowSimulation,false);
  assert.equal(channel.dependencies.fluidLevelSupported,false);
  assert.equal(spire.dependencies.emitsLight,false);
  assert.equal(statue.dependencies.npc,false);
  for(const a of PACK3_CANDIDATE_ASSETS){
    if(a.persistence?.liveIdRegistered!==undefined)
      assert.equal(a.persistence.liveIdRegistered,false);
    if(a.persistence?.integrated!==undefined)
      assert.equal(a.persistence.integrated,false);
  }
});

// Strong guard: neither old nor later candidate preview formats ever advertise
// themselves to VoxelWorld.restore as schema-1 player save objects.
test('every one of five preview fixtures has a non-game format and no schema field',()=>{
  const fixtures=[
    [createPack3Fixture(),109,0],
    [createPack3RoofGeometryFixture(),113,1],
    [createPack3FortifiedFixture(),116,2],
    [createPack3OrnamentalFixture(),119,3],
    [createPack3MonumentalFixture(),123,0]
  ];
  const formats=new Set();
  for(const [f,id,r] of fixtures){
    assert.equal(f.place([2,4,6],id,r),true);
    const state=f.snapshot();
    assert.equal(Object.hasOwn(state,'schema'),false);
    assert.equal(typeof state.format,'string');
    assert.match(state.format,/^mythwrought-pack3-.*(?:preview|candidate)-v1$/);
    assert.equal(formats.has(state.format),false);
    formats.add(state.format);
  }
  assert.equal(formats.size,5);
});
test('rotated physical occupancy preserves 90-degree Y turn for all 13 shaped families',()=>{
  const samples=[.071,.193,.314,.439,.567,.691,.818,.939];
  for(let id=113;id<=125;id++)for(let r=0;r<4;r++){
    const current=pack3CandidateShape(id,r),next=pack3CandidateShape(id,(r+1)%4);
    for(const x of samples)for(const y of samples)for(const z of samples){
      assert.equal(filled(current,x,y,z),filled(next,1-z,y,x),
        `rotation occupancy mismatch at ID ${id}, rot ${r}, point ${x},${y},${z}`);
    }
  }
});


test('all five candidate-only restore codecs reject a production schema marker',()=>{
  const cases=[
    [createPack3Fixture,restorePack3Fixture,109,0],
    [createPack3RoofGeometryFixture,restorePack3RoofGeometryFixture,113,1],
    [createPack3FortifiedFixture,restorePack3FortifiedFixture,116,2],
    [createPack3OrnamentalFixture,restorePack3OrnamentalFixture,119,3],
    [createPack3MonumentalFixture,restorePack3MonumentalFixture,123,0]
  ];
  for(const [create,restore,id,rotation] of cases){
    const f=create(179);assert.equal(f.place([2,4,6],id,rotation),true);
    const snapshot=f.snapshot();
    assert.equal(Object.hasOwn(snapshot,'schema'),false);
    assert.deepEqual(restore(JSON.parse(JSON.stringify(snapshot))).snapshot(),snapshot);
    for(const schema of [1,2,undefined,null]){
      const tampered={...snapshot,schema};
      assert.throws(()=>restore(tampered),TypeError,
        `candidate ID ${id} accepted schema-marked preview`);
    }
  }
});


// An architectural voxel should be one face-connected solid union. Decorations
// with an air gap to their parent masonry would visually float and become
// separately targetable/collidable pieces. Check all supported orientations.
test('every physical candidate remains face-connected at each supported quarter turn',()=>{
  const e=1e-10;
  const joined=(a,b)=>{
    const overlap=[0,1,2].map(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i]));
    return overlap.every(n=>n>e)||
      overlap.filter(n=>n>e).length===2&&overlap.some(n=>Math.abs(n)<=e);
  };
  for(let id=109;id<=125;id++)for(let yaw=0;yaw<=(id<=112?0:3);yaw++){
    const boxes=pack3CandidateShape(id,yaw).boxes;
    const seen=new Set([0]),queue=[0];
    while(queue.length){
      const index=queue.pop();
      for(let j=0;j<boxes.length;j++)if(!seen.has(j)&&joined(boxes[index],boxes[j])){
        seen.add(j);queue.push(j);
      }
    }
    assert.equal(seen.size,boxes.length,`Disconnected solid parts: ID ${id} yaw ${yaw} (${seen.size}/${boxes.length} attached)`);
  }
});

// Each exported specialty provider is independently callable. Catalog-only ID
// validation is insufficient: constructing Map keys via string concatenation
// previously admitted strings, BigInts, and objects with custom toString().
test('direct asset providers reject coercible nonnumeric ID aliases', async()=>{
  const groups=[
    [113,await import('../../../src/block-packs/pack-3/roof-geometry.mjs'),'pack3GeometryById','pack3GeometryShape','pack3PrototypeGeometry'],
    [116,await import('../../../src/block-packs/pack-3/fortified-pieces.mjs'),'pack3FortifiedById','pack3FortifiedShape','pack3FortifiedPrototype'],
    [119,await import('../../../src/block-packs/pack-3/ornamental-pieces.mjs'),'pack3OrnamentalById','pack3OrnamentalShape','pack3OrnamentalPrototype'],
    [123,await import('../../../src/block-packs/pack-3/monumental-pieces.mjs'),'pack3MonumentalById','pack3MonumentalShape','pack3MonumentalPrototype']
  ];
  for(const [id,api,lookup,shape,proto] of groups){
    for(let yaw=0;yaw<4;yaw++){
      assert.equal(api[lookup](id,yaw)?.id,id);
      assert.equal(api[shape](id,yaw)?.boxes,api[lookup](id,yaw).boxes);
    }
    const aliases=[String(id),BigInt(id),{toString(){return String(id)}},
      new String(String(id)),Number.NaN,Infinity,undefined,null];
    for(const bad of aliases){
      assert.equal(api[lookup](bad,0),null,`${lookup} resolved nonnumeric ID ${String(bad)}`);
      assert.equal(api[shape](bad,0),null,`${shape} resolved nonnumeric ID ${String(bad)}`);
      assert.throws(()=>api[proto](bad,0),RangeError,`${proto} resolved nonnumeric ID ${String(bad)}`);
    }
  }
});

// Paired clay hip and straight-slope cells must share the same structural
// elevation at BOTH hip edges. Decorations may vary, but a mismatched load-
// bearing roof course creates a visible, unjoinable slit or sudden ledge.
// Check the *exact* exposed body occupancy on each shared plane, not a grid
// of approximate sample points, for every rotated hip orientation.
test('Hearthclay hip corner mates flush to pitched roof stairs on both arms at all four yaws',async()=>{
  const {pack3GeometryById}=await import('../../../src/block-packs/pack-3/roof-geometry.mjs');
  const xDirs=[[0,1],[2,1],[0,-1],[2,-1]];
  const zDirs=[[2,1],[0,-1],[2,-1],[0,1]];
  function mismatchedArea(a,b,axis,edgeA,edgeB){
    const others=[0,1,2].filter(k=>k!==axis);
    const bodyParts=[...a.parts,...b.parts].filter(p=>p.tone==='body');
    const grid=others.map(k=>[...new Set([0,1,...bodyParts.flatMap(p=>[
      p.box[k],p.box[k+3]])])].sort((x,y)=>x-y));
    const occupied=(asset,edge,u,v)=>asset.parts.some(p=>{
      if(p.tone!=='body')return false;
      const box=p.box;
      return box[axis]<=edge&&box[axis+3]>=edge&&
        u>=box[others[0]]&&u<box[others[0]+3]&&
        v>=box[others[1]]&&v<box[others[1]+3];
    });
    let area=0;
    for(let i=0;i<grid[0].length-1;i++)for(let j=0;j<grid[1].length-1;j++){
      const u=(grid[0][i]+grid[0][i+1])/2;
      const v=(grid[1][j]+grid[1][j+1])/2;
      if(occupied(a,edgeA,u,v)!==occupied(b,edgeB,u,v))
        area+=(grid[0][i+1]-grid[0][i])*(grid[1][j+1]-grid[1][j]);
    }
    return area;
  }
  for(let yaw=0;yaw<4;yaw++)for(let arm=0;arm<2;arm++){
    const direction=(arm?zDirs:xDirs)[yaw],axis=direction[0],face=direction[1]>0?1:0;
    const hip=pack3GeometryById(114,yaw);
    const stair=pack3GeometryById(113,(yaw+(arm?3:0))%4);
    const mismatch=mismatchedArea(hip,stair,axis,face,1-face);
    assert.equal(mismatch,0,
      `Unjoinable clay hip-to-pitch roof course: yaw ${yaw}, arm ${arm}, mismatched cross-section ${mismatch}`);
  }
});
