import test from 'node:test';
import assert from 'node:assert/strict';
import {
 PACK4_CIVIC_IDS,PACK4_CIVIC_FAMILIES,PACK4_CIVIC_ASSETS,PACK4_CIVIC_STRIDE,
 civicAsset,civicShape,civicMountOffset,civicSaveState,restoreCivicSaveState,
 civicPreviewMesh
} from '../../../src/block-packs/pack-4/hearth-civic.mjs';

const ids=[176,177,178,179,180,181];
const v=bb=>bb.reduce((n,b)=>n+(b[3]-b[0])*(b[4]-b[1])*(b[5]-b[2]),0);
const good=b=>b.length===6&&b.every(n=>Number.isFinite(n)&&n>=0&&n<=1)&&
 b.slice(0,3).every((n,i)=>n<b[i+3]);
function filled(boxes,x,y,z){
 return boxes.some(b=>x>=b[0]&&x<=b[3]&&y>=b[1]&&y<=b[4]&&z>=b[2]&&z<=b[5]);
}
test('M4 reserves unique 176–181 inside Pack4 without protected sentinels',()=>{
 assert.deepEqual(PACK4_CIVIC_ASSETS.map(x=>x.id),ids);
 assert.deepEqual(PACK4_CIVIC_FAMILIES,[63,64,65,66,67,68]);
 assert.deepEqual(Object.values(PACK4_CIVIC_IDS).sort((a,b)=>a-b),ids);
 assert.ok(ids.every(x=>x>=159&&x<=208&&x>8&&x!==255));
 assert.equal(new Set(ids).size,6);
});
test('all six families are physically distinct, individual and explicitly nonfunctional for fluid/fire',()=>{
 const a=PACK4_CIVIC_ASSETS;
 assert.equal(new Set(a.map(x=>x.key)).size,6);
 assert.equal(new Set(a.map(x=>JSON.stringify(x.parts))).size,6);
 assert.deepEqual(a.map(x=>x.mount),['floor','wall-face','floor','wall-face','wall-face','floor']);
 for(const item of a){
  assert.ok(item.description.length>=70);
  assert.equal(item.independentlySelectable,true);
  assert.equal(item.independentlyRemovable,true);
  assert.equal(item.occludesWholeCell,false);
  assert.ok(Object.isFrozen(item)&&Object.isFrozen(item.parts)&&Object.isFrozen(item.parts[0].bounds));
  assert.ok(Object.values(item.engines).every(x=>x===false));
  assert.equal(civicAsset(item.id),item);
 }
 assert.equal(civicAsset(5),null);
});
for(const id of ids){
 test('ID '+id+' has valid partial physical selection, collision and non-colliding ornament',()=>{
  const s=civicShape(id);
  assert.equal(s.id,id);
  assert.equal(s.occludesWholeCell,false);
  assert.equal(s.renderPass,'opaque');
  assert.ok(s.selection.length>=5&&s.collision.length>=5);
  assert.ok(s.visible.length>=s.collision.length);
  assert.ok(s.visible.length>=s.selection.length);
  assert.ok(s.collision.every(good)&&s.selection.every(good));
  assert.ok(s.collision.every(b=>b.some((n,i)=>i<3&&b[i+3]-n<.96)),
    'no fake full-cube collider');
  assert.ok(s.visible.some(p=>p.collision===false),
    'decorative surface detail should not obstruct the player');
 });
 test('ID '+id+' preserves physical volumes, orientation and saved state across 4 rotations',()=>{
  const first=civicShape(id,0);
  for(let r=0;r<4;r++){
   const item=civicShape(id,r);
   assert.equal(item.visible.length,first.visible.length);
   assert.equal(item.selection.length,first.selection.length);
   assert.ok(item.visible.every(p=>good(p.bounds)));
   assert.ok(Math.abs(v(item.collision)-v(first.collision))<1e-6);
   const saved=JSON.parse(JSON.stringify(civicSaveState(id,r)));
   assert.deepEqual(restoreCivicSaveState(saved),{id,rotation:r});
   assert.deepEqual(civicShape(saved.id,saved.rotation),item);
  }
 });
 test('ID '+id+' meshes only genuine opaque source material within mobile preview budget',()=>{
  for(let r=0;r<4;r++){
   const mesh=civicPreviewMesh(id,r);
   const n=mesh.opaque.length/PACK4_CIVIC_STRIDE;
   assert.equal(mesh.stride,10);
   assert.equal(n,civicShape(id,r).visible.length*36);
   assert.ok(n>0&&n<1600,'avoid excessive per-part triangles');
   assert.equal(mesh.translucent.length,0);
   assert.equal(mesh.opaque.length%10,0);
   for(let p=0;p<mesh.opaque.length;p+=10){
    assert.ok([...mesh.opaque.slice(p,p+3)].every(x=>Number.isFinite(x)&&x>=0&&x<=1));
    assert.ok([...mesh.opaque.slice(p+3,p+6)].every(Number.isFinite));
    assert.ok([...mesh.opaque.slice(p+6,p+9)].every(x=>Number.isFinite(x)&&x>=0&&x<=1));
    assert.equal(mesh.opaque[p+9],1);
   }
  }
 });
}
test('single chimney course is actually hollow and no long chimney tower is assembled',()=>{
 const s=civicShape(176);
 assert.equal(filled(s.collision,.50,.50,.50),false,'hollow flue core');
 assert.equal(filled(s.selection,.50,.50,.50),false,'open flue is non-targetable');
 assert.equal(filled(s.collision,.20,.45,.50),true,'one actual stone side');
 assert.ok(s.visible.some(p=>p.material==='soot'));
 assert.ok(s.visible.some(p=>p.material==='limestone'));
});
test('fireplace exposes open front cavity, real side jambs, mantle and grate with no live fire',()=>{
 const s=civicShape(177);
 assert.equal(filled(s.collision,.5,.52,.26),false,'mouth must remain open');
 assert.equal(filled(s.collision,.14,.52,.30),true,'solid stone jamb');
 assert.equal(filled(s.collision,.5,.82,.50),true,'physical stone mantle');
 assert.ok(s.visible.some(p=>p.material==='iron'));
 assert.equal(civicAsset(177).engines.fire,false);
 assert.equal(civicAsset(177).engines.smoke,false);
 // A raised iron grate and soot bed formerly began at y=.20 while the
 // stone hearth base ended at y=.19, stranding five collidable components.
 // The firebox remains hollow, but the grate must join the hearth physically.
 const meets=(a,b)=>[0,1,2].every(k=>
  a[k]<=b[k+3]+1e-8&&b[k]<=a[k+3]+1e-8);
 for(let turn=0;turn<4;turn++){
  const boxes=civicShape(177,turn).collision;
  const seen=new Set([0]),queue=[0];
  while(queue.length){
   const n=queue.pop();
   for(let j=0;j<boxes.length;j++)if(!seen.has(j)&&meets(boxes[n],boxes[j])){
    seen.add(j);queue.push(j);
   }
  }
  assert.equal(seen.size,boxes.length,'grate floats above hearth at turn '+turn);
 }
});
test('well rim is a genuinely open quadrant, not a completed ring or square well',()=>{
 const s=civicShape(178);
 assert.equal(filled(s.collision,.63,.32,.63),false);
 assert.equal(filled(s.collision,.18,.31,.60),true);
 assert.equal(filled(s.collision,.60,.31,.18),true);
 assert.ok(s.visible.some(p=>p.material==='chalk'));
});
test('well roof is an isolated eave and rope-hooked timber corbel, not Pack3 tiled roof',()=>{
 const a=civicAsset(179),s=civicShape(179);
 assert.equal(a.mount,'wall-face');
 assert.equal(filled(s.collision,.5,.3,.5),false,'open air beneath corbel');
 assert.equal(filled(s.collision,.5,.88,.49),true,'actual roof eave');
 assert.ok(a.parts.some(p=>p.material==='brass'));
 assert.ok(a.parts.some(p=>p.material==='oxidizedCopper'));
 assert.equal(a.engines.animation,false);
});
test('pulley has physical radial wheel, discrete empty gaps and independent wall mounting',()=>{
 const a=civicAsset(180),s=civicShape(180);
 assert.equal(a.mount,'wall-face');
 assert.ok(a.parts.length>=20);
 assert.ok(a.parts.filter(p=>p.material==='oak').length>=6);
 assert.equal(filled(s.collision,.5,.50,.27),false,'wheel interior gaps remain empty');
 assert.equal(filled(s.collision,.5,.89,.27),true,'wheel upper rim physically occupied');
 assert.equal(a.engines.animation,false,'no fake working pulley');
 // Earlier wheel teeth had nine isolated AABBs: thin rim pieces were
 // separated from their neighbors and the actual radial spokes.
 const touching=(a,b)=>[0,1,2].every(axis=>
  a[axis]<=b[axis+3]+1e-8&&b[axis]<=a[axis+3]+1e-8);
 for(let rotation=0;rotation<4;rotation++){
  const boxes=civicShape(180,rotation).collision;
  const seen=new Set([0]),queue=[0];
  while(queue.length){
   const i=queue.pop();
   for(let j=0;j<boxes.length;j++)if(!seen.has(j)&&touching(boxes[i],boxes[j])){
    seen.add(j);queue.push(j);
   }
  }
  assert.equal(boxes.length,22);
  assert.equal(seen.size,boxes.length,
   'every tooth/spoke must belong to one physical wheel at turn '+rotation);
 }
});
test('fountain is dry, carved basin segment with a real open cavity and NO fluid update',()=>{
 const s=civicShape(181),a=civicAsset(181);
 assert.equal(a.engines.water,false);
 assert.equal(filled(s.collision,.50,.41,.50),false,'basin center is dry and empty');
 assert.equal(filled(s.collision,.17,.41,.50),true,'physical side wall');
 assert.equal(filled(s.collision,.5,.13,.5),true,'physical basin floor');
 assert.ok(a.parts.some(p=>p.material==='oxidizedCopper'));
});
test('floor and orientation-specific wall support offsets require independent support blocks',()=>{
 for(const id of [176,178,181])for(let r=0;r<4;r++)
  assert.deepEqual(civicMountOffset(id,r),[0,-1,0]);
 for(const id of [177,179,180])
  assert.deepEqual([0,1,2,3].map(r=>civicMountOffset(id,r)),
   [[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]]);
 // The earlier civic pieces had a 0.04–0.12 cell gap between their
 // supposed supporting neighbor and the nearest REAL physical sub-box.
 // Assert the targetable/collidable masonry or bracket reaches that face.
 for(let id=176;id<=181;id++)for(let rotation=0;rotation<4;rotation++){
  const offset=civicMountOffset(id,rotation);
  const axis=offset.findIndex(v=>v!==0);
  const face=offset[axis]>0?axis+3:axis;
  const boundary=offset[axis]>0?1:0;
  const shape=civicShape(id,rotation);
  for(const purpose of ['collision','selection']){
   assert.ok(shape[purpose].some(bounds=>Math.abs(bounds[face]-boundary)<1e-9),
    'civic '+id+' '+purpose+' not physically joined to support, r='+rotation);
   assert.ok(shape[purpose].length<=32,'shared AABB descriptor budget '+id);
  }
 }
});
test('malformed saved states and unreserved candidate IDs fail closed',()=>{
 for(const id of [0,5,159,175,182,208,209,255,-1,1.5,NaN]){
  assert.throws(()=>civicShape(id));
  assert.throws(()=>civicSaveState(id));
 }
 for(const r of [-1,4,.5,NaN,Infinity,'0',null])
  assert.throws(()=>civicShape(176,r));
 for(const s of [null,{},[],{id:176},{id:176,rotation:NaN},
  {id:181,rotation:'0'},{id:176,rotation:undefined},{id:255,rotation:1}])
  assert.throws(()=>restoreCivicSaveState(s));
});
