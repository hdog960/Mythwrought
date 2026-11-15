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

// A separate stone buttress must actually attach to the intended fortress wall
// when placed in the neighboring cell on the wall's ornamental/front side.
// The merlon above the wall must still attach, and the central arrow slit must
// stay genuinely open. Test true face area, not projection or corner grazing.
test('fortress wall footing joins neighboring buttress and supports battlement at all four turns',()=>{
  const worldBoxes=(id,turn,cell)=>pack3CandidateById(id,turn).boxes.map(b=>
    b.map((v,i)=>v+cell[i%3]));
  const faceArea=(first,second)=>{
    let total=0;
    for(const a of first)for(const b of second)for(let axis=0;axis<3;axis++){
      if(Math.abs(a[axis+3]-b[axis])>1e-10 &&
        Math.abs(b[axis+3]-a[axis])>1e-10)continue;
      const others=[0,1,2].filter(i=>i!==axis);
      total+=Math.max(0,Math.min(a[others[0]+3],b[others[0]+3])-
        Math.max(a[others[0]],b[others[0]]))*
        Math.max(0,Math.min(a[others[1]+3],b[others[1]+3])-
        Math.max(a[others[1]],b[others[1]]));
    }
    return total;
  };
  for(let turn=0;turn<4;turn++){
    const wall=worldBoxes(116,turn,[0,0,0]);
    const buttressOffsets=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]];
    const buttress=worldBoxes(118,turn,buttressOffsets[turn]);
    const battlement=worldBoxes(117,turn,[0,1,0]);
    const buttressArea=faceArea(wall,buttress);
    assert.ok(buttressArea>1e-6,
      `No load-bearing wall/buttress face contact at turn ${turn}; area ${buttressArea}`);
    assert.ok(faceArea(wall,battlement)>1e-6,
      `No physical wall/battlement contact at turn ${turn}`);
    assert.equal(filled(pack3CandidateShape(116,turn),.5,.65,.5),false,
      `Footing repair unexpectedly blocked arrow slit at turn ${turn}`);
    assert.equal(filled(pack3CandidateShape(117,turn),.5,.7,.5),false,
      `Footing repair unexpectedly blocked central crenel at turn ${turn}`);
  }
});

// A pitched roof terminates at its highest step on either side of its ridge.
// Compare the EXACT occupied structural and coping cross-sections, not sampled
// pixels: a tall slope facing an undersized ridge leaves a visible vertical
// ledge and a bad collision/selection seam even if both touch at the bottom.
test('Hearthclay Crown Ridge mates to both opposing pitched roofs for all quarter turns', async()=>{
  const {pack3GeometryById}=await import('../../../src/block-packs/pack-3/roof-geometry.mjs');
  const mismatch=(a,b,axis,faceA,faceB,tone)=>{
    const other=[0,1,2].filter(i=>i!==axis);
    const parts=[...a.parts,...b.parts].filter(p=>p.tone===tone);
    const coord=other.map(i=>[...new Set([0,1,...parts.flatMap(p=>[p.box[i],p.box[i+3]])])].sort((x,y)=>x-y));
    const filled=(asset,face,u,v)=>asset.parts.some(({box,tone:kind})=>
      kind===tone&&box[axis]<=face&&box[axis+3]>=face&&
      u>=box[other[0]]&&u<box[other[0]+3]&&
      v>=box[other[1]]&&v<box[other[1]+3]);
    let area=0;
    for(let i=1;i<coord[0].length;i++)for(let j=1;j<coord[1].length;j++){
      const u=(coord[0][i-1]+coord[0][i])/2,v=(coord[1][j-1]+coord[1][j])/2;
      if(filled(a,faceA,u,v)!==filled(b,faceB,u,v))
        area+=(coord[0][i]-coord[0][i-1])*(coord[1][j]-coord[1][j-1]);
    }
    return area;
  };
  for(let yaw=0;yaw<4;yaw++){
    const ridge=pack3GeometryById(115,yaw),axis=yaw%2===0?0:2;
    const firstFace=yaw<2?0:1;
    for(const [arm,face,partnerYaw] of [
      [0,firstFace,(yaw+3)%4], [1,1-firstFace,(yaw+1)%4]
    ]){
      const slope=pack3GeometryById(113,partnerYaw);
      for(const tone of ['body','edge']){
        const area=mismatch(ridge,slope,axis,face,1-face,tone);
        assert.equal(area,0,
          `Ridge seam mismatch for ${tone}: yaw ${yaw}, arm ${arm}, area ${area}`);
      }
    }
    const center=ridge.shape.boxes.some(b=>.5>b[0]&&.5<b[3]&&.4>b[1]&&.4<b[4]&&.5>b[2]&&.5<b[5]);
    assert.equal(center,false,'Ridge should retain its recessed open underside');
  }
});


// Architectural paint and coping are physical strips, not a texture decal.
// A structurally joined hip can still have broken color/solid rail courses:
// inspect exact per-tone cross-sections at both adjoining roof sides.
test('Hearthclay hip corner edge and crest trims remain continuous at both rotated roof joins', async()=>{
  const {pack3GeometryById}=await import('../../../src/block-packs/pack-3/roof-geometry.mjs');
  const sides=[[[0,1],[2,1],[0,-1],[2,-1]],[[2,1],[0,-1],[2,-1],[0,1]]];
  const areaMismatch=(a,b,axis,face,otherFace,tone)=>{
    const dims=[0,1,2].filter(d=>d!==axis);
    const relevant=[...a.parts,...b.parts].filter(p=>p.tone===tone);
    const grids=dims.map(d=>[...new Set([0,1,...relevant.flatMap(p=>[p.box[d],p.box[d+3]])])]
      .sort((x,y)=>x-y));
    const painted=(asset,plane,u,v)=>asset.parts.some(part=>{
      if(part.tone!==tone)return false;
      const b=part.box;
      return b[axis]<=plane&&b[axis+3]>=plane&&
        u>=b[dims[0]]&&u<b[dims[0]+3]&&
        v>=b[dims[1]]&&v<b[dims[1]+3];
    });
    let mismatch=0;
    for(let i=1;i<grids[0].length;i++)for(let j=1;j<grids[1].length;j++){
      const u=(grids[0][i-1]+grids[0][i])/2;
      const v=(grids[1][j-1]+grids[1][j])/2;
      if(painted(a,face,u,v)!==painted(b,otherFace,u,v))
        mismatch+=(grids[0][i]-grids[0][i-1])*(grids[1][j]-grids[1][j-1]);
    }
    return mismatch;
  };
  for(let yaw=0;yaw<4;yaw++)for(let arm=0;arm<2;arm++){
    const [axis,dir]=sides[arm][yaw],face=dir>0?1:0;
    const hip=pack3GeometryById(114,yaw);
    const stair=pack3GeometryById(113,(yaw+(arm?3:0))%4);
    for(const tone of ['edge','crest']){
      const mismatch=areaMismatch(hip,stair,axis,face,1-face,tone);
      assert.equal(mismatch,0,
        `Hip-to-stair ${tone} trim mismatches at yaw ${yaw}, arm ${arm}: ${mismatch} cell-unit²`);
    }
  }
  assert.ok(pack3GeometryById(114).boxes.length<=32,
    'Coping detail must remain within the merged shape descriptor 32-box budget');
});
