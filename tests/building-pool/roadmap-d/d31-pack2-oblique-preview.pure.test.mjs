import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique,d31OBBIntersectsAABB,d31PreviewHitsAABB,
 d31RayOwnerPreview,d31TransformOriginalPack2Mesh,d31RayPreviewTriangles,d31OBBsOverlap}
 from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
const originalOwner=[
 [0,.26,.26,1,.74,.74],[0,.20,.20,.14,.80,.80],[.86,.20,.20,1,.80,.80]
];
const geom=(a=[0.5,6.5,.5],b=[3.5,5.5,.5],axis='x')=>
 deriveD31OriginalPack2Oblique(a,b,axis,originalOwner);
test('D31 owner-derived X and Z diagonal preserves three real source-section boxes but never claims registered owner rotation',()=>{
 const x=geom(),z=geom([.5,6.5,.5],[.5,5.5,3.5],'z');
 for(const a of [x,z]){
  assert.equal(a.ownerOBBs.length,3);assert.ok(a.centerlineLength>3);
  assert.equal(a.sourceAxialScaleModified,true);
  assert.equal(a.registeredPack2DiagonalVariant,false);
  assert.equal(a.staticallyRated,false);
  assert.ok(a.bounds.max[1]<7&&a.bounds.min[1]>5);
  const middle=a.start.map((v,i)=>(v+a.end[i])/2),ray=a.ownerOBBs[0].axes[2],
   origin=middle.map((v,i)=>v+ray[i]*2),direction=ray.map(v=>-v);
  assert.ok(Math.abs(d31RayOwnerPreview(a,origin,direction,4)-1.76)<1e-5);
 }
 assert.equal(d31PreviewHitsAABB(x,[1,5,0],[2,7,1]),true);
 assert.equal(d31PreviewHitsAABB(x,[1,7,0],[2,8,1]),false);
 assert.equal(d31PreviewHitsAABB(x,[1,2,0],[2,4.5,1]),false);
});
test('D31 15-axis SAT rejects separated, neighboring and touching boxes, catches real wall and joint penetration',()=>{
 const g=geom();assert.equal(d31PreviewHitsAABB(g,[1,5,0],[2,7,1]),true);
 assert.equal(d31PreviewHitsAABB(g,[8,5,0],[9,7,1]),false);
 const c=g.ownerOBBs[0],away={...c,center:c.center.map((v,i)=>v+[10,0,0][i])};
 assert.equal(d31OBBsOverlap(c,c),true);assert.equal(d31OBBsOverlap(c,away),false);
 assert.throws(()=>d31OBBIntersectsAABB(c,[0,0,0],[0,1,1]),/invalid/);
});
test('D31 derived mesh preserves original RGB and vertex triangles and collider-picking distance, while refusing false input',()=>{
 const g=geom();
 // One original-section rectangular core source mesh assembled as 12 triangles;
 // full genuine original Pack2 colors/156 triangle owner is checked in native source tests.
 const faces=[
 [[0,.26,.26],[0,.74,.26],[0,.74,.74],[0,.26,.74]],
 [[1,.26,.26],[1,.26,.74],[1,.74,.74],[1,.74,.26]],
 [[0,.26,.26],[1,.26,.26],[1,.74,.26],[0,.74,.26]],
 [[0,.26,.74],[0,.74,.74],[1,.74,.74],[1,.26,.74]],
 [[0,.26,.26],[0,.26,.74],[1,.26,.74],[1,.26,.26]],
 [[0,.74,.26],[1,.74,.26],[1,.74,.74],[0,.74,.74]]];
 const p=[],rgb=[],idx=[];
 for(const quad of faces){const n=p.length/3;for(const q of quad){p.push(...q);rgb.push(.4,.24,.17);}idx.push(n,n+1,n+2,n,n+2,n+3);}
 const source={positions:Float32Array.from(p),colors:Float32Array.from(rgb),indices:Uint16Array.from(idx)};
 const preview=d31TransformOriginalPack2Mesh(g,source),start=g.start.map((v,i)=>(v+g.end[i])/2),normal=g.ownerOBBs[0].axes[2],
  ray=start.map((v,i)=>v+normal[i]*2),dir=normal.map(x=>-x);
 assert.deepEqual(Array.from(preview.colors),Array.from(source.colors));
 assert.equal(preview.indices.length,source.indices.length);
 const physical=d31RayOwnerPreview(g,ray,dir,4),render=d31RayPreviewTriangles(preview,ray,dir,4);
 assert.ok(Math.abs(render-physical)<.00001);
 assert.throws(()=>deriveD31OriginalPack2Oblique([0,6,0],[0,6,0],'x',originalOwner),/length/);
 assert.throws(()=>deriveD31OriginalPack2Oblique([0,6,0],[6,5,0],'x',originalOwner),/length/);
 assert.throws(()=>deriveD31OriginalPack2Oblique([0,6,0],[2,5,0],'x',[[0,0,0,1,1,1]]),/owner boxes/);
 assert.throws(()=>d31TransformOriginalPack2Mesh(g,{positions:[],colors:[],indices:[0]}),/bounded/);
});
test('D31 refuses counterfeit vertical posts and preserves the original physical one-cell ID62 shape',async()=>{
 const {deriveD31OriginalPack2Vertical}=await import('../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs');
 const post=[[.33,0,.33,.67,1,.67],[.23,0,.23,.77,.14,.77],[.27,.86,.27,.73,1,.73]];
 const v=deriveD31OriginalPack2Vertical([3.2,6.5,.5],[3.2,5.5,.5],post);
 assert.equal(v.sourceOwnerId,62);assert.equal(v.sourceOwnerShapePreserved,true);
 assert.equal(v.ownerOBBs.length,3);assert.equal(v.centerlineLength,1);
 assert.equal(v.placementAllowed,false);assert.ok(v.bounds.min[1]===5.5&&v.bounds.max[1]===6.5);
 assert.equal(d31PreviewHitsAABB(v,[3,7,0],[4,8,1]),false);
 assert.throws(()=>deriveD31OriginalPack2Vertical([3,6.5,.5],[4,5.5,.5],post),/vertical/);
 assert.throws(()=>deriveD31OriginalPack2Vertical([3,6.5,.5],[3,4.5,.5],post),/vertical/);
});
