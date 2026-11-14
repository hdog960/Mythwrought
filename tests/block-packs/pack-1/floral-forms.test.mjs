import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FLORAL_IDS,FLORAL_CANDIDATES,floralDefinition,floralDescriptor,
  floralOccupies,floralTexture
} from '../../../src/block-packs/pack-1/floral-forms.mjs';
import {createFloralFixture,restoreFloralFixture}
  from '../../../src/block-packs/pack-1/floral-fixture.mjs';
const IDS=Object.values(FLORAL_IDS);
const s=(id,x,y,z,options={})=>floralOccupies(id,[x,y,z],options);
const sig=tex=>Buffer.from(tex.pixels).toString('hex');
function volume(boxes){
  const axes=[0,1,2].map(k=>[...new Set(boxes.flatMap(b=>[b[k],b[k+3]]))].sort((a,b)=>a-b));
  let result=0;
  for(let i=0;i<axes[0].length-1;i++)for(let j=0;j<axes[1].length-1;j++)
    for(let k=0;k<axes[2].length-1;k++){
      const lo=[axes[0][i],axes[1][j],axes[2][k]],hi=[axes[0][i+1],axes[1][j+1],axes[2][k+1]];
      const mid=lo.map((v,n)=>(v+hi[n])/2);
      if(boxes.some(b=>mid.every((v,n)=>v>=b[n]&&v<b[n+3])))
        result+=(hi[0]-lo[0])*(hi[1]-lo[1])*(hi[2]-lo[2]);
    }
  return result;
}
test('seven unique flower/mushroom IDs 32–38, each a separate independently targetable voxel',()=>{
  assert.deepEqual(IDS,[32,33,34,35,36,37,38]);
  assert.equal(FLORAL_CANDIDATES.length,7);
  assert.equal(new Set(IDS).size,7);
  assert.equal(FLORAL_CANDIDATES.filter(x=>x.family==='flower').length,4);
  assert.equal(FLORAL_CANDIDATES.filter(x=>x.family==='mushroom').length,3);
  for(const x of FLORAL_CANDIDATES){
    assert.ok(x.id>=32&&x.id<=58&&x.id!==255);
    assert.equal(x.roster,x.family==='flower'?53:54);
    assert.equal(x.individuallyPlaceable,true);
    assert.equal(x.individuallyRemovable,true);
    assert.equal(x.rayTargetable,true);
    assert.equal(x.growth,false);assert.equal(x.harvest,false);assert.equal(x.craft,false);
    assert.equal(x.edible,false);assert.equal(x.lightEmission,0);
    assert.equal(x.save.schema,1);
    assert.match(x.status,/NOT MERGED/);
  }
  assert.equal(floralDefinition(7),null);
});
test('all seven have distinct positive partial-cell unit volumes and separate material roles',()=>{
  const signatures=new Set();
  for(const id of IDS){
    const d=floralDescriptor(id);
    assert.equal(d.prototypeOnly,true);
    assert.equal(d.placeable,false);
    assert.equal(d.occupancy,'union-of-axis-aligned-boxes');
    assert.deepEqual(d.boxes,d.parts.map(x=>x.box));
    assert.ok(Object.isFrozen(d.boxes));
    assert.ok(d.boxes.length>=5&&d.boxes.length<=32);
    for(const p of d.parts){
      assert.ok(Object.isFrozen(p.box));
      for(let k=0;k<3;k++){
        assert.ok(p.box[k]>=0&&p.box[k]<p.box[k+3]&&p.box[k+3]<=1);
        assert.equal(p.box[k]*8,Math.round(p.box[k]*8),'1/8 voxel physical lattice');
        assert.equal(p.box[k+3]*8,Math.round(p.box[k+3]*8));
      }
    }
    const v=volume(d.boxes);
    assert.ok(v>.005&&v<.8,'not full cube / not zero volume '+id+' '+v);
    signatures.add(JSON.stringify(d.boxes));
  }
  assert.equal(signatures.size,7,'no duplicate physical silhouettes');
});
test('four flowers are different physical bloom profiles with stem, leaves and petals',()=>{
  for(const id of [32,33,34,35]){
    const d=floralDescriptor(id);
    assert.equal(d.kind,'flower');
    assert.ok(d.parts.some(p=>p.role==='stem'));
    assert.ok(d.parts.some(p=>p.role==='leaf'));
    assert.ok(d.parts.some(p=>p.role==='petal'));
    assert.equal(d.collision.boxes.length,0,'soft petals must not block walking');
    assert.ok(d.selection.boxes.length>=5,'soft does not mean unselectable');
    assert.equal(s(id,.01,.9,.01),false);
  }
  assert.equal(s(32,.5,.2,.5),true,'skybell stem');
  assert.equal(s(33,.5,.8,.5),true,'lily central bloom');
  assert.equal(s(34,.5,.88,.5),true,'moonstar center');
  assert.equal(s(35,.5,.88,.5),true,'thornrose layered center');
});
test('mushrooms have actual cap vs gill vs stalk and stem-only collision',()=>{
  for(const id of [36,37,38]){
    const d=floralDescriptor(id);
    assert.equal(d.kind,'mushroom');
    assert.ok(d.parts.some(p=>p.role==='stem'));
    assert.ok(d.parts.some(p=>p.role==='gill'));
    assert.ok(d.parts.some(p=>p.role==='cap'));
    assert.ok(d.collision.boxes.length>0);
    assert.ok(d.collision.boxes.length<d.selection.boxes.length);
    assert.equal(s(id,.02,.3,.02),false);
    const stem=d.parts.find(p=>p.role==='stem').box;
    const mid=[0,1,2].map(k=>(stem[k]+stem[k+3])/2);
    assert.equal(floralOccupies(id,mid,{mode:'collision'}),true);
  }
});
test('violet shelf has three separate elevated cap levels, not a static sphere',()=>{
  const d=floralDescriptor(37);
  const caps=d.parts.filter(p=>p.role==='cap');
  assert.equal(caps.length,3);
  assert.equal(new Set(caps.map(p=>p.box[1])).size,3);
  assert.equal(s(37,.5,1,.5),false,'space at top outer voxel boundary');
});
test('pearl gill appears pale but has no simulated light gameplay',()=>{
  assert.equal(floralDefinition(38).lightEmission,0);
  const d=floralDescriptor(38);
  assert.equal(d.lightEmission,0);
  assert.equal(d.cutout,true);
  assert.ok(d.parts.filter(p=>p.role==='gill').length>=3);
});
test('four rotations preserve occupied volume and expose honest save-state dependency',()=>{
  for(const id of IDS){
    const original=volume(floralDescriptor(id).boxes);
    for(const rotation of [0,1,2,3]){
      const d=floralDescriptor(id,{rotation});
      assert.ok(Math.abs(volume(d.boxes)-original)<1e-9,id+' rot '+rotation);
      assert.equal(d.orientationRequiresEngineSave,rotation!==0);
    }
  }
  assert.throws(()=>floralDescriptor(32,{rotation:4}),RangeError);
  assert.throws(()=>floralDescriptor(32,{rotation:.5}),RangeError);
});
test('per-part authored RGBA textures deterministic, opaque, and visually distinct',()=>{
  const swatches=new Set();
  for(const item of FLORAL_CANDIDATES){
    const roles=[...new Set(floralDescriptor(item.id).parts.map(p=>p.role))];
    for(const role of roles){
      for(const face of ['top','north']){
        const tex=floralTexture(item.id,role,face,24);
        assert.equal(tex.width,24);assert.equal(tex.height,24);
        assert.equal(tex.pixels.length,2304);
        assert.equal(sig(tex),sig(floralTexture(item.id,role,face,24)));
        const colors=new Set();
        for(let k=0;k<tex.pixels.length;k+=4){
          assert.equal(tex.pixels[k+3],255);
          colors.add(Array.from(tex.pixels.slice(k,k+3)).join(','));
        }
        assert.ok(colors.size>=15,item.name+' '+role+' lacks detail');
        swatches.add(sig(tex));
      }
    }
  }
  assert.ok(swatches.size>=28,'material differentiation inadequate');
});
test('textures reject invalid ID, foreign role, face and size, without huge allocation',()=>{
  for(const n of [8,16,24,32,64,128])
    assert.equal(floralTexture(32,'petal','top',n).pixels.length,n*n*4);
  assert.throws(()=>floralTexture(5),RangeError);
  assert.throws(()=>floralTexture(255),RangeError);
  assert.throws(()=>floralTexture(32,'cap'),RangeError);
  assert.throws(()=>floralTexture(36,'petal'),RangeError);
  assert.throws(()=>floralTexture(36,'cap','sideways'),RangeError);
  assert.throws(()=>floralTexture(36,'cap','top',129),RangeError);
  assert.throws(()=>floralTexture(36,'cap','top',7),RangeError);
});
test('fixture independently places and removes all seven, including single-cap targetability',()=>{
  const w=createFloralFixture();
  for(const [i,id] of IDS.entries()){
    assert.equal(w.place(i*2,3,0,id).ok,true);
    assert.equal(w.get(i*2,3,0),id);
    assert.equal(w.getShape(i*2,3,0).id,id);
    assert.equal(w.place(i*2,3,0,id).reason,'occupied');
  }
  assert.equal(w.size,7);
  assert.equal(w.place(20,3,0,7).reason,'unknown-id');
  assert.equal(w.place(20,20,0,32).reason,'invalid-coordinate');
  for(const [i,id] of IDS.entries())assert.equal(w.remove(i*2,3,0).id,id);
  assert.equal(w.size,0);
});
test('real box selection ray passes through empty space and hits stem and cap',()=>{
  const w=createFloralFixture();
  assert.equal(w.place(0,3,0,32).ok,true);
  assert.equal(w.place(2,3,0,36).ok,true);
  assert.equal(w.raycast([.01,3.4,-2],[0,0,1]),null);
  const sky=w.raycast([.5,3.3,-2],[0,0,1]);
  assert.equal(sky.id,32);
  assert.ok(sky.distance>2&&sky.distance<2.7);
  const stem=w.raycast([2.5,3.3,-2],[0,0,1]);
  assert.equal(stem.id,36);
  const cap=w.raycast([2.5,5,.5],[0,-1,0]);
  assert.equal(cap.id,36);
  assert.equal(cap.distance,1,'top cap reaches voxel top after eighth-cell quantization');
  assert.equal(w.raycast([10,3.3,-2],[0,0,1]),null);
  assert.throws(()=>w.raycast([0,0,0],[0,0,0]),RangeError);
});
test('isolated canonical schema-1-shaped edits restore seven species without new save keys',()=>{
  const w=createFloralFixture(-77);
  for(const [i,id] of IDS.entries())assert.equal(w.place(-i,3,i,id).ok,true);
  const saved=w.save();
  assert.deepEqual(Object.keys(saved),['schema','seed','edits']);
  assert.equal(saved.schema,1);assert.equal(saved.seed,-77);
  assert.equal(saved.edits.length,7);assert.ok(saved.edits.every(x=>x.length===4));
  const clone=restoreFloralFixture(JSON.parse(JSON.stringify(saved)));
  assert.deepEqual(clone.save(),saved);
  assert.equal(clone.remove(-4,3,4).id,36);
  assert.equal(w.get(-4,3,4),36);
});
test('rotated species refuses lossy schema-1 serialization',()=>{
  const w=createFloralFixture();
  assert.equal(w.place(1,3,0,33,{rotation:1}).ok,true);
  assert.equal(w.getShape(1,3,0).rotation,1);
  assert.throws(()=>w.save(),/central orientation persistence/);
  assert.equal(w.remove(1,3,0).id,33);
  assert.deepEqual(w.save(),{schema:1,seed:179,edits:[]});
});
test('invalid edit rows, duplicates and old world IDs must not enter fixture save',()=>{
  const seed={schema:1,seed:179,edits:[[0,3,0,32]]};
  assert.equal(restoreFloralFixture(seed).size,1);
  for(const row of [[0,3,0,32],[0,20,0,32],[1,3,0,7],[1,3,0,255],[1,3.5,0,33]])
    assert.throws(()=>restoreFloralFixture({...seed,edits:[...seed.edits,row]}));
  assert.throws(()=>restoreFloralFixture({...seed,schema:2}));
  assert.throws(()=>restoreFloralFixture({...seed,seed:1.2}));
  assert.throws(()=>restoreFloralFixture({...seed,edits:'invalid'}));
});
test('two fixtures never contaminate each other, game state, or live saves',()=>{
  const a=createFloralFixture(179),b=createFloralFixture(179);
  a.place(0,3,0,35);
  assert.equal(a.size,1);assert.equal(b.size,0);assert.equal(b.get(0,3,0),0);
  assert.deepEqual(b.save(),{schema:1,seed:179,edits:[]});
});
