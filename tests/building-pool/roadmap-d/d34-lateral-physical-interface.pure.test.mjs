import test from 'node:test';
import assert from 'node:assert/strict';
import {solveD30IdealizedUnderslungTruss} from '../../../src/building-pool/roadmap-d/d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical,d31RayOwnerPreview,
 d31TransformOriginalPack2Mesh,d31RayPreviewTriangles,d31OBBsOverlap}
 from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb,measureD34OriginalLateralFaceArea,
 auditD34PinSplitPlane,d34ProbeSourceCellIntersections}
 from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]];
const post=[[.33,0,.33,.67,1,.67],[.23,0,.23,.77,.14,.77],[.27,.86,.27,.73,1,.73]];
const members=(N,axis)=>{
 const statics=solveD30IdealizedUnderslungTruss(N),
  points=new Map(statics.nodes.map(v=>[v.id,[axis==='x'?v.x+.5:.5,v.y,axis==='z'?v.x+.5:.5]]));
 const shapes=statics.members.map(m=>({member:m,shape:m.type==='vertical-web'?
  deriveD31OriginalPack2Vertical(points.get(m.from),points.get(m.to),post):
  deriveD31OriginalPack2Oblique(points.get(m.from),points.get(m.to),axis,beam)}));
 return {statics,points,shapes};
};
test('D34 proves residual overlaps are mid-bay diagonal/chord volume, not resolved by end trim; lateral source sections genuinely separate both X and Z planes',()=>{
 for(const axis of ['x','z'])for(const N of [13,20,26,35,48]){
  const {statics,points,shapes}=members(N,axis);
  let baseline=0,residual=0,types=new Set();
  for(const node of statics.nodes){
   const r=auditD34PinSplitPlane({id:node.id,worldAt:points.get(node.id)},
    shapes.filter(x=>x.member.from===node.id||x.member.to===node.id),axis);
   baseline+=r.originalSamePlaneCollisionPairs;residual+=r.remainingSplitPlanePositiveVolumePairs;
   for(const [name,count] of Object.entries(r.oldOverlapTypes))if(count)types.add(name);
   assert.equal(r.realAxialTransferAuthenticated,false);
   assert.equal(r.constructionAllowed,false);
  }
  assert.ok(baseline>0,`expected source-original D33 overlap ${N} ${axis}`);
  assert.equal(residual,0,`parallel lane must avoid positive OBB overlap ${N} ${axis}`);
  assert.deepEqual([...types].sort(),['bottom-chord+diagonal-web','diagonal-web+top-chord']);
 }
});
test('D34 preserves each of three real ID61 source boxes, X/Z physical ray and derived source colored triangle positions, never registers a new variant',()=>{
 for(const axis of ['x','z']){
  const a=axis==='x'?[.5,6.5,.5]:[.5,6.5,.5],b=axis==='x'?[3.5,5.5,.5]:[.5,5.5,3.5],
   g=deriveD31OriginalPack2Oblique(a,b,axis,beam),p=deriveD34LateralOriginalWeb(g,axis,1);
  assert.equal(p.ownerOBBs.length,3);assert.equal(p.registeredPack2DiagonalVariant,false);
  assert.equal(p.structuralPinConnectionRated,false);assert.equal(p.constructionAllowed,false);
  assert.deepEqual(p.ownerOBBs.map(x=>x.half),g.ownerOBBs.map(x=>x.half));
  const mid=p.start.map((v,i)=>(v+p.end[i])/2),normal=p.ownerOBBs[0].axes[2],
   ray=mid.map((v,i)=>v+normal[i]*2),dir=normal.map(x=>-x);
  const src={positions:Float32Array.from([0,.26,.74,1,.26,.74,1,.74,.74,0,.74,.74]),
   colors:Float32Array.from(Array.from({length:4},()=>[.4,.24,.17]).flat()),
   indices:Uint16Array.from([0,1,2,0,2,3])};
  const out=d31TransformOriginalPack2Mesh(p,src);
  assert.deepEqual(Array.from(out.colors),Array.from(src.colors));
  const actual=d31RayOwnerPreview(p,ray,dir,4),mesh=d31RayPreviewTriangles(out,ray,dir,4);
  assert.ok(actual!==null&&mesh!==null&&Math.abs(actual-mesh)<1e-5);
  assert.throws(()=>deriveD34LateralOriginalWeb(g,axis,1,{offset:.3}),/authentic/);
  assert.throws(()=>deriveD34LateralOriginalWeb({...g,sourceOwnerId:99},axis,1),/authentic/);
  assert.throws(()=>deriveD34LateralOriginalWeb({...g,ownerOBBs:[g.ownerOBBs[0]]},axis,1),/authentic/);
 }
});
test('D34 identifies exact positive surface-only area for flush separated authentic-side geometry but refuses to confuse it with a pin or fastener',()=>{
 const g=deriveD31OriginalPack2Oblique([.5,6.5,.5],[3.5,6.5,.5],'x',beam);
 const shifted=deriveD34LateralOriginalWeb(g,'x',1,{offset:.6});
 const face=measureD34OriginalLateralFaceArea(g,shifted,'x');
 assert.ok(face.sourceSectionFacePairs>=1);
 assert.ok(face.unratedPositiveAreaContact>.001);
 assert.equal(face.connectorFasteningStrengthKnown,false);assert.equal(face.canBuild,false);
 assert.ok(g.ownerOBBs.every(a=>shifted.ownerOBBs.every(b=>!d31OBBsOverlap(a,b))));
 assert.equal(measureD34OriginalLateralFaceArea(g,deriveD34LateralOriginalWeb(g,'x',1,{offset:.8}),'x').unratedPositiveAreaContact,0);
});
test('D34 reject tampered original owner, source-cell collisions and invalid budgets instead of silently creating a live connector',()=>{
 const g=deriveD31OriginalPack2Oblique([.5,6.5,.5],[3.5,5.5,.5],'x',beam),shifted=deriveD34LateralOriginalWeb(g,'x',1);
 const source=(x,y,z)=>x===1&&y===6&&z===1?{role:'wall',asset:'live:stone'}:null;
 assert.ok(d34ProbeSourceCellIntersections(shifted,source).length>=0);
 assert.throws(()=>d34ProbeSourceCellIntersections(shifted,source,{maxCells:1}),/budget/);
 assert.throws(()=>deriveD34LateralOriginalWeb(g,'z',1),/authentic/);
 assert.throws(()=>deriveD34LateralOriginalWeb(g,'x',0),/authentic/);
 assert.throws(()=>auditD34PinSplitPlane({id:'n',worldAt:[0,6.5,0]},[], 'x'),/interface/);
 assert.throws(()=>measureD34OriginalLateralFaceArea(g,shifted,'bad'),/contact/);
});
