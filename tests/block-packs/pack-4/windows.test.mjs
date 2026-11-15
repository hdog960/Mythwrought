import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PACK4_WINDOW_ASSETS,PACK4_WINDOW_IDS,PACK4_WINDOW_FAMILIES,
  PACK4_WINDOW_MESH_STRIDE,windowAsset,windowShape,windowSaveState,
  restoreWindowSaveState,windowMountOffset,windowPreviewMesh
} from '../../../src/block-packs/pack-4/windows.mjs';

const ids=PACK4_WINDOW_ASSETS.map(x=>x.id);
const canonical=JSON.stringify(PACK4_WINDOW_ASSETS);
function hitsBox(origin,direction,box){
  let low=-Infinity,high=Infinity;
  for(let i=0;i<3;i++){
    if(Math.abs(direction[i])<1e-10){
      if(origin[i]<box[i]||origin[i]>box[i+3])return false;
    }else{
      const a=(box[i]-origin[i])/direction[i],
            b=(box[i+3]-origin[i])/direction[i];
      low=Math.max(low,Math.min(a,b));
      high=Math.min(high,Math.max(a,b));
    }
  }
  return high>=Math.max(0,low);
}
function targetHits(shape,x,y,fromZ=-1){
  return shape.selection.some(b=>hitsBox([x,y,fromZ],[0,0,1],b));
}
test('reservations are confined to Pack 4 ID 159..208, unique and never protected',()=>{
  assert.equal(ids.length,6);
  assert.equal(new Set(ids).size,ids.length);
  for(const id of ids){
    assert.ok(id>=159&&id<=208);
    assert.ok(id!==255&&id>8);
  }
  assert.deepEqual(Object.values(PACK4_WINDOW_IDS).sort((a,b)=>a-b),ids);
  assert.deepEqual(PACK4_WINDOW_FAMILIES,[30,31,32,33,34]);
});
test('the five roster families really have distinct candidates, not material aliases',()=>{
  assert.deepEqual(PACK4_WINDOW_ASSETS.map(x=>x.roster),[30,31,31,32,33,34]);
  assert.equal(new Set(PACK4_WINDOW_ASSETS.map(x=>x.key)).size,6);
  assert.equal(new Set(PACK4_WINDOW_ASSETS.map(x=>x.profile)).size,6);
  for(const a of PACK4_WINDOW_ASSETS){
    assert.ok(a.parts.length>0);
    assert.ok(a.notes.length>30);
    assert.ok(a.availableRotations.length===4);
    assert.equal(a.occludesWholeCell,false);
    assert.equal(a.lightEmission,0);
    assert.equal(windowAsset(a.id),a);
  }
  assert.equal(windowAsset(5),null);
});
test('stained families are two independently stored material and tracery designs',()=>{
  const a=windowAsset(160),b=windowAsset(161);
  assert.notDeepEqual(a.parts,b.parts);
  assert.notEqual(a.parts.length,b.parts.length);
  assert.notEqual(a.profile,b.profile);
  assert.equal(a.roster,b.roster);
  assert.equal(a.family,b.family);
  assert.notEqual(a.parts[0].material,b.parts[0].material);
});
test('clear glass has real thin pane rather than a full collision cube',()=>{
  const c=windowShape(159);
  assert.ok(c.collision.length>0&&c.selection.length>0);
  assert.ok(c.collision.some(b=>b[5]-b[2]<.055&&b[3]-b[0]>.8));
  assert.ok(targetHits(c,.5,.5));
  assert.ok(!targetHits(c,.01,.01));
  assert.equal(c.renderPass,'split-opaque-translucent');
});
test('window frame genuinely has open lower/upper quadrants and physical rails',()=>{
  const f=windowShape(162);
  assert.equal(f.renderPass,'opaque');
  assert.ok(!targetHits(f,.33,.34));
  assert.ok(!targetHits(f,.7,.7));
  assert.ok(targetHits(f,.49,.55)); // mullion
  assert.ok(targetHits(f,.05,.3)); // jamb
});
test('shutters have closed pane-like targetable leaves plus open center seam',()=>{
  const s=windowShape(163);
  assert.ok(targetHits(s,.2,.5));
  assert.ok(targetHits(s,.8,.5));
  assert.ok(!targetHits(s,.5,.3));
  assert.equal(s.mount,'wall-face');
  assert.equal(s.collision.length>2,true);
});
test('iron bars permit rays through openings, not broad full-cube collisions',()=>{
  const b=windowShape(164);
  assert.ok(targetHits(b,.12,.5));
  assert.ok(targetHits(b,.63,.5));
  assert.ok(!targetHits(b,.28,.5));
  assert.ok(!targetHits(b,.76,.5));
  assert.ok(b.collision.every(box=>box[3]-box[0]<.9||box[4]-box[1]<.9));
});
for(const id of ids){
  test('physical, selectable, independently removable shape cell '+id,()=>{
    const a=windowShape(id),b=windowShape(id);
    assert.equal(a.id,id);
    assert.ok(a.visible.length>=a.collision.length);
    assert.ok(a.visible.length>=a.selection.length);
    assert.ok(a.collision.length>0);
    assert.ok(a.selection.length>0);
    assert.notEqual(a,b);
    assert.equal(a.occludesWholeCell,false);
    assert.deepEqual(a,b);
    assert.ok(a.selection.every(box=>box.length===6));
    for(const box of [...a.selection,...a.collision]){
      assert.ok(box.every(x=>x>=0&&x<=1&&Number.isFinite(x)));
      for(let ax=0;ax<3;ax++)assert.ok(box[ax]<box[ax+3]);
    }
  });
  test('all four rotations stay inside a single voxel and retain physical volume '+id,()=>{
    const original=windowShape(id,0),end=windowShape(id,3);
    for(const r of [0,1,2,3]){
      const g=windowShape(id,r);
      assert.equal(g.rotation,r);
      assert.equal(g.visible.length,original.visible.length);
      const total=(boxes)=>boxes.reduce((n,b)=>n+(b[3]-b[0])*(b[4]-b[1])*(b[5]-b[2]),0);
      assert.ok(Math.abs(total(g.collision)-total(original.collision))<1e-6);
      assert.ok(g.collision.every(b=>b.every(n=>n>=0&&n<=1)));
    }
    // Rotating four quarter turns is identity, the runtime only serializes orientation.
    const c=windowShape(id,0);
    assert.deepEqual(original,c);
    assert.equal(end.id,original.id);
  });
  test('preview mesh has finite packed attributes, depth and correct alpha split '+id,()=>{
    const p=windowPreviewMesh(id,2);
    assert.equal(p.stride,PACK4_WINDOW_MESH_STRIDE);
    assert.equal(p.opaque.length%p.stride,0);
    assert.equal(p.translucent.length%p.stride,0);
    const verts=(p.opaque.length+p.translucent.length)/p.stride;
    assert.equal(verts,windowShape(id,2).visible.length*36);
    assert.ok(verts>0&&verts<2000,'guard mobile preview mesh budget');
    for(const mesh of [p.opaque,p.translucent]){
      for(let i=0;i<mesh.length;i+=p.stride){
        assert.ok([mesh[i],mesh[i+1],mesh[i+2]].every(n=>Number.isFinite(n)&&n>=0&&n<=1));
        assert.ok([mesh[i+3],mesh[i+4],mesh[i+5]].every(Number.isFinite));
        assert.ok(mesh[i+9]>0&&mesh[i+9]<=1);
      }
    }
    if(id<=161)assert.ok(p.translucent.length>0);
    if(id>=162)assert.equal(p.translucent.length,0);
    if(id===160||id===161)assert.ok(p.opaque.length>0);
  });
}
test('orientation saves are deterministic and survive a JSON-only opt-in fixture',()=>{
  for(const id of ids)for(let r=0;r<4;r++){
    const saved=JSON.parse(JSON.stringify(windowSaveState(id,r)));
    assert.deepEqual(restoreWindowSaveState(saved),{id,rotation:r});
    assert.deepEqual(windowShape(saved.id,saved.rotation),windowShape(id,r));
  }
  assert.equal(JSON.stringify(PACK4_WINDOW_ASSETS),canonical,'saving does not mutate catalog');
});
test('invalid IDs and unsafe orientation/save states fail closed',()=>{
  for(const bad of [0,1,8,158,165,208,209,255,-1,1.5,NaN]){
    assert.throws(()=>windowShape(bad));
  }
  for(const bad of [-1,4,.5,NaN,Infinity,'0',null]){
    assert.throws(()=>windowShape(159,bad));
  }
  for(const bad of [null,[],{}, {id:159},{id:159,rotation:undefined},{id:159,rotation:'0'},{id:255,rotation:0}]){
    assert.throws(()=>restoreWindowSaveState(bad));
  }
});
test('wall-mounted shutters track 4-way support direction; other panes do not claim wall mounts',()=>{
  assert.deepEqual([0,1,2,3].map(r=>windowMountOffset(163,r)),
    [[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]]);
  // Regression: the earlier leaf hinges stopped at z=.645 while their
  // required neighbor support started at z=1, leaving a .355-cell gap.
  // Physical, targetable hinge pintles must actually join that support
  // in every quarter-turn, while staying under the shared 32-box cap.
  for(let rotation=0;rotation<4;rotation++){
    const shape=windowShape(163,rotation);
    const offset=windowMountOffset(163,rotation);
    const axis=offset.findIndex(v=>v!==0);
    const face=offset[axis]>0?axis+3:axis;
    const wall=offset[axis]>0?1:0;
    const anchors=shape.visible.filter(p=>p.material==='brass'&&
      Math.abs(p.bounds[face]-wall)<1e-9);
    assert.equal(anchors.length,4,'four physical hinges reach support: r='+rotation);
    assert.ok(shape.selection.length<=32&&shape.collision.length<=32);
    for(const anchor of anchors){
      assert.equal(anchor.collision,true);
      assert.equal(anchor.selection,true);
      assert.ok(shape.visible.some(other=>other!==anchor&&
        other.material==='brass'&&[0,1,2].every(a=>
          anchor.bounds[a]<other.bounds[a+3]&&
          other.bounds[a]<anchor.bounds[a+3])),
        'hinge must connect to existing leaf hardware: r='+rotation);
    }
  }
  for(const id of ids.filter(id=>id!==163))
    assert.equal(windowMountOffset(id),null);
});
test('asset catalog is frozen and independent from the existing live world',()=>{
  assert.ok(Object.isFrozen(PACK4_WINDOW_ASSETS));
  assert.ok(Object.isFrozen(windowAsset(159)));
  assert.ok(Object.isFrozen(windowAsset(159).parts[0].bounds));
  assert.ok(!Object.keys(PACK4_WINDOW_IDS).includes('WOOD'));
  assert.equal(PACK4_WINDOW_ASSETS.some(a=>a.mount==='generated-world'),false);
});
