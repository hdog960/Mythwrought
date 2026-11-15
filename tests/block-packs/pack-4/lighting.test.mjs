import test from 'node:test';
import assert from 'node:assert/strict';
import {
 PACK4_LIGHT_ASSETS,PACK4_LIGHT_IDS,PACK4_LIGHT_FAMILIES,
 PACK4_LIGHT_STRIDE,lightingAsset,lightingShape,lightingPreviewMesh,
 lightingMountOffset,lightingSaveState,restoreLightingSaveState
} from '../../../src/block-packs/pack-4/lighting.mjs';

const ids=PACK4_LIGHT_ASSETS.map(asset=>asset.id);
const volume=boxes=>boxes.reduce((sum,b)=>
  sum+(b[3]-b[0])*(b[4]-b[1])*(b[5]-b[2]),0);
const allWithinCell=boxes=>boxes.every(b=>b.length===6&&
  b.every(n=>n>=0&&n<=1&&Number.isFinite(n))&&
  b.slice(0,3).every((n,i)=>n<b[i+3]));
function hitBox(origin,dir,b){
 let low=-Infinity,high=Infinity;
 for(let a=0;a<3;a++){
  if(Math.abs(dir[a])<1e-9){
   if(origin[a]<b[a]||origin[a]>b[a+3])return false;
  }else{
   const p=(b[a]-origin[a])/dir[a],q=(b[a+3]-origin[a])/dir[a];
   low=Math.max(low,Math.min(p,q));
   high=Math.min(high,Math.max(p,q));
  }
 }
 return high>=Math.max(0,low);
}
const hits=(shape,origin,dir)=>
  shape.selection.some(b=>hitBox(origin,dir,b));

test('IDs 165..168 are unique, in Pack 4, and never protected IDs',()=>{
 assert.deepEqual(ids,[165,166,167,168]);
 assert.deepEqual(PACK4_LIGHT_FAMILIES,[35,36,37,38]);
 assert.deepEqual(Object.values(PACK4_LIGHT_IDS).sort((a,b)=>a-b),ids);
 assert.equal(new Set(ids).size,4);
 assert.ok(ids.every(id=>id>=159&&id<=208&&id!==255&&id>8));
});
test('four original families expose independent physical silhouettes',()=>{
 assert.deepEqual(PACK4_LIGHT_ASSETS.map(a=>a.mount),
  ['floor','wall-face','floor','wall-face']);
 assert.equal(new Set(PACK4_LIGHT_ASSETS.map(a=>a.key)).size,4);
 assert.ok(PACK4_LIGHT_ASSETS.every(a=>a.parts.length>=9));
 for(const asset of PACK4_LIGHT_ASSETS){
  assert.equal(asset.occludesWholeCell,false);
  assert.ok(asset.description.length>=45);
  assert.equal(lightingAsset(asset.id),asset);
  assert.ok(Object.isFrozen(asset.parts)&&Object.isFrozen(asset.parts[0]));
  assert.deepEqual(asset.availableRotations,[0,1,2,3]);
 }
 assert.equal(lightingAsset(5),null,'CRYSTAL 5 is not a crystal lantern');
 assert.notDeepEqual(PACK4_LIGHT_ASSETS[1].parts,PACK4_LIGHT_ASSETS[3].parts);
});
test('light emission is declared as integration metadata, not a working engine emitter',()=>{
 for(const asset of PACK4_LIGHT_ASSETS){
  assert.equal(asset.light.engineEnabled,false);
  assert.ok(asset.light.requires.includes('integration'));
  assert.ok(asset.light.rgb.length===3&&asset.light.rgb.every(v=>v>=0&&v<=1));
  assert.ok(asset.light.radius>0&&asset.light.radius<=8);
  assert.ok(asset.light.intensity>0&&asset.light.intensity<=2);
 }
 assert.notDeepEqual(PACK4_LIGHT_ASSETS[0].light.rgb,PACK4_LIGHT_ASSETS[2].light.rgb);
 assert.notDeepEqual(PACK4_LIGHT_ASSETS[2].parts,PACK4_LIGHT_ASSETS[3].parts);
});
for(const id of ids){
 test('ID '+id+' has real sub-cell occupancy and independently selectable fixtures',()=>{
  const s=lightingShape(id);
  assert.ok(s.selection.length>=2&&s.collision.length>=2);
  assert.ok(s.visible.length>=s.selection.length);
  assert.ok(s.visible.length>=s.collision.length);
  assert.equal(s.occludesWholeCell,false);
  assert.ok(allWithinCell(s.selection)&&allWithinCell(s.collision));
  assert.ok(s.collision.every(b=>b.some((n,i)=>i<3&&b[i+3]-n<.9)));
  assert.equal(hits(s,[.02,.5,-1],[0,0,1]),false,'no phantom full cube');
 });
 test('ID '+id+' supports all rotations with identical physical volumes and save replay',()=>{
  const before=lightingShape(id,0);
  for(const r of [0,1,2,3]){
   const now=lightingShape(id,r);
   assert.equal(now.rotation,r);
   assert.equal(now.collision.length,before.collision.length);
   assert.equal(now.selection.length,before.selection.length);
   assert.ok(allWithinCell(now.collision)&&allWithinCell(now.selection));
   assert.ok(Math.abs(volume(now.collision)-volume(before.collision))<1e-6);
   const saved=JSON.parse(JSON.stringify(lightingSaveState(id,r)));
   assert.deepEqual(restoreLightingSaveState(saved),{id,rotation:r});
   assert.deepEqual(lightingShape(saved.id,saved.rotation),now);
  }
 });
 test('ID '+id+' renders alpha-separated bounded packed WebGL geometry',()=>{
  for(const r of [0,1,2,3]){
   const p=lightingPreviewMesh(id,r);
   const n=(p.opaque.length+p.translucent.length)/PACK4_LIGHT_STRIDE;
   assert.equal(n,lightingShape(id,r).visible.length*36);
   assert.ok(n>0&&n<1500);
   assert.ok(p.opaque.length>0&&p.translucent.length>0);
   for(const arr of [p.opaque,p.translucent]){
    assert.equal(arr.length%PACK4_LIGHT_STRIDE,0);
    for(let i=0;i<arr.length;i+=PACK4_LIGHT_STRIDE){
     assert.ok([arr[i],arr[i+1],arr[i+2]].every(x=>Number.isFinite(x)&&x>=0&&x<=1));
     assert.ok([arr[i+3],arr[i+4],arr[i+5]].every(x=>Number.isFinite(x)&&Math.abs(x)<=1));
     assert.ok([arr[i+6],arr[i+7],arr[i+8],arr[i+9]].every(x=>x>0&&x<=1));
    }
   }
  }
 });
}
test('floor and wall-mount offsets resolve to the correct rotated supporting cell',()=>{
 for(const id of [165,167])for(const r of [0,1,2,3])
  assert.deepEqual(lightingMountOffset(id,r),[0,-1,0]);
 for(const id of [166,168])
  assert.deepEqual([0,1,2,3].map(r=>lightingMountOffset(id,r)),
   [[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]]);
 // Regression: lantern feet previously floated above y=0 and wall plates
 // ended at z=.96, leaving a gap before their mandatory support blocks.
 // Each candidate must have REAL collision/selection geometry touching its
 // support at all four rotations, not just a fixture permission flag.
 for(let id=165;id<=168;id++)for(let r=0;r<4;r++){
  const offset=lightingMountOffset(id,r);
  const axis=offset.findIndex(v=>v!==0);
  const face=offset[axis]>0?axis+3:axis;
  const boundary=offset[axis]>0?1:0;
  const s=lightingShape(id,r);
  for(const purpose of ['collision','selection']){
   assert.ok(s[purpose].some(b=>Math.abs(b[face]-boundary)<1e-9),
    'missing physical support contact '+id+' rotation '+r+' '+purpose);
   assert.ok(s[purpose].length<=32,'shared shape-box cap '+id+' '+purpose);
  }
 }
});
test('wall fixtures contain a backplate and physical forward support, not a whole structure',()=>{
 for(const id of [166,168]){
  const s=lightingShape(id);
  assert.ok(s.collision.some(b=>b[5]>.9&&b[2]>.8));
  assert.ok(s.collision.some(b=>b[2]<.6&&b[5]<.7));
  assert.equal(hits(s,[.5,.5,-1],[0,0,1]),true);
 }
});
test('flames and inner crystals have decorative non-colliding parts',()=>{
 const flame=lightingShape(168);
 assert.ok(flame.collision.every(b=>b[4]<=.8));
 assert.ok(flame.visible.some(p=>!p.collision&&p.bounds[4]===1));
 assert.ok(lightingShape(167).visible.some(p=>p.material==='crystalCore'&&!p.collision));
 // The four crystal lantern cage posts previously began at y=.23, above
 // the base ending at y=.14. They must now join the SAME physical body
 // under each rotation, not remain four disconnected visual columns.
 const touching=(a,b)=>[0,1,2].every(axis=>
  a[axis]<=b[axis+3]+1e-8&&b[axis]<=a[axis+3]+1e-8);
 for(let r=0;r<4;r++){
  const boxes=lightingShape(167,r).collision;
  const seen=new Set([0]),pending=[0];
  while(pending.length){
   const index=pending.pop();
   for(let j=0;j<boxes.length;j++)if(!seen.has(j)&&touching(boxes[index],boxes[j])){
    seen.add(j);pending.push(j);
   }
  }
  assert.equal(seen.size,boxes.length,
   'physical crystal cage must be one connected structure at turn '+r);
 }
});
test('invalid and truncated persisted states fail closed',()=>{
 for(const id of [0,5,158,164,169,209,255,-1,NaN,1.3]){
  assert.throws(()=>lightingShape(id));
  assert.throws(()=>lightingSaveState(id));
 }
 for(const r of [-1,4,2.5,NaN,Infinity,null,'1'])assert.throws(()=>lightingShape(165,r));
 for(const payload of [null,[],{}, {id:165},{id:166,rotation:NaN},
   {id:167,rotation:'0'},{id:166,rotation:undefined},{id:5,rotation:0}])
  assert.throws(()=>restoreLightingSaveState(payload));
});
