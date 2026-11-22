// MYTHWROUGHT Builder D23: genuine Pack4 bench/table source-original physical
// placement proof at authored W16/W17 original fixture cells. Read-only.
// Never changes original cells, room/nav graph, live source registry or saves.
const F=Object.freeze({north:0,east:1,south:2,west:3});
const fixtures=Object.freeze({
 'pack4:058':Object.freeze({id:171,feature:'unapproved-bench',triangles:156}),
 'pack4:059':Object.freeze({id:172,feature:'unapproved-scribe-table',triangles:228})
});
const key=p=>p.join(',');
const vec=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const b6=a=>Array.isArray(a)&&a.length===6&&a.every(Number.isFinite)&&
 [0,1,2].every(i=>a[i]>=0&&a[i]<a[i+3]&&a[i+3]<=1);
const sameBoxes=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&
 a.every((v,i)=>b6(v)&&b6(b[i])&&v.every((x,j)=>Math.abs(x-b[i][j])<=1e-7));
function realWorldVertices(at,group){
 if(!(group instanceof Float32Array)||group.length%30!==0||
    group.length>320*30)throw Error('Original Pack4 furnishing typed mesh invalid');
 const v=new Float32Array(group);
 for(let i=0;i<v.length;i+=10){
  for(let j=0;j<3;j++){
   const n=group[i+j];
   if(!Number.isFinite(n)||n<0||n>1)
    throw Error('Original Pack4 furnishing vertex leaves its original cell');
   v[i+j]=n+at[j];
  }
  const normal=Math.hypot(group[i+3],group[i+4],group[i+5]);
  if(!Number.isFinite(normal)||Math.abs(normal-1)>.001)
   throw Error('Original Pack4 furnishing physical normal invalid');
  for(let j=6;j<10;j++)if(!Number.isFinite(group[i+j])||group[i+j]<0||group[i+j]>1)
   throw Error('Original Pack4 furnishing authored color invalid');
 }
 return v;
}
export function auditD23OriginalFurnishedInteriorSource(blueprint,{
 resolvePack4FurnishingShape,resolvePack4Asset,
 maxFixtureSamples=2,maxPreviewBytes=96*1024
}={}){
 if(!blueprint||blueprint.worldPlaced!==false||blueprint.integrated!==false||
    blueprint.creatorApproved!==false||!Array.isArray(blueprint.cells)||
    !Array.isArray(blueprint.navigation))
   throw Error('D23 physical interior needs unchanged original 4B unregistered source');
 if(typeof resolvePack4FurnishingShape!=='function'||typeof resolvePack4Asset!=='function')
   throw TypeError('Original real Pack4 furnishing geometry providers mandatory');
 if(!Number.isSafeInteger(maxFixtureSamples)||maxFixtureSamples<1||maxFixtureSamples>2||
    !Number.isSafeInteger(maxPreviewBytes)||maxPreviewBytes<4096||maxPreviewBytes>96*1024)
   throw RangeError('D23 original furniture phone CPU preview budget invalid');
 const source=new Map();
 for(const c of blueprint.cells){
  if(!vec(c.at)||source.has(key(c.at)))throw Error('D23 duplicate original source physical cell');
  source.set(key(c.at),c);
 }
 const nav=new Set();
 for(const n of blueprint.navigation){
  if(!vec(n.at)||nav.has(key(n.at)))throw Error('D23 duplicate or invalid original navigation coordinate');
  nav.add(key(n.at));
 }
 const authored=blueprint.cells.filter(c=>c.role==='fixture');
 if(authored.length!==2||new Set(authored.map(x=>x.asset)).size!==2)
   throw Error('D23 expected original independent bench and scribe table, not synthetic furnishings');
 let previewBytes=0,geometryTriangles=0;const receipts=[],physical=[];
 for(const c of authored){
  const spec=fixtures[c.asset];
  if(!spec||c.feature!==spec.feature||!Object.hasOwn(F,c.facing)||
     c.at[1]!==2||nav.has(key(c.at)))
   throw Error('Original furnished source fixture is unregistered, absent or blocks navigation');
  const [x,y,z]=c.at,base=source.get(key([x,y-1,z]));
  if(base?.role!=='floor'||base.asset!=='live:wood')
   throw Error('Original Pack4 fixture not grounded on genuine source wood floor');
  const at=resolvePack4Asset(c.asset,{candidateId:spec.id,rotation:c.facing});
  const shape=resolvePack4FurnishingShape(spec.id,F[c.facing]);
  if(!at||at.id!==spec.id||at.ref!==c.asset||
     at.rotation!==F[c.facing]||at.hasRealPhysicalGeometry!==true||
     at.registeredInLiveGame!==false||at.previewMesh?.stride!==10||
     !(at.previewMesh.opaque instanceof Float32Array)||
     !(at.previewMesh.translucent instanceof Float32Array)||
     shape?.id!==at.id||shape?.rotation!==at.rotation||
     !sameBoxes(shape.visible?.map(x=>x.bounds),at.visible?.map(x=>x.bounds))||
     !sameBoxes(shape.selection,at.selection)||
     !sameBoxes(shape.collision,at.collision))
   throw Error('Pack4 original furnishing source builder/collision/picking mismatch');
  if(!Array.isArray(shape.collision)||shape.collision.length<2)
   throw Error('Original Pack4 furnishing source lacks physical collision geometry');
  let floorContact=0;for(const box of shape.collision){
   if(!b6(box))throw Error('Pack4 original furnishing collision AABB invalid');
   if(box[1]===0)floorContact+=(box[3]-box[0])*(box[5]-box[2]);
  }
  if(floorContact<=.01)throw Error('Original Pack4 furnishing has no physical foot-to-floor contact');
  const tri=(at.previewMesh.opaque.length+at.previewMesh.translucent.length)/30;
  if(!Number.isSafeInteger(tri)||tri!==spec.triangles||
     at.previewMesh.translucent.length!==0)
   throw Error('Original Pack4 authored bench/table native physical mesh triangle census changed');
  // The original walking point can approach the furniture cell, but none of
  // its authored positions is inside that source-occupied Y2 fixture cell.
  const neighboringWalkways=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dz])=>
    nav.has(key([x+dx,y,z+dz]))).length;
  if(!neighboringWalkways)throw Error('Original source furniture has no adjacent walking approach');
  const receipt=Object.freeze({at:Object.freeze([...c.at]),originalAsset:c.asset,
    sourceNumericId:spec.id,sourceFeature:c.feature,sourceFacing:c.facing,
    originalAuthorFloorSourceAsset:base.asset,originalY1FloorContactArea:floorContact,
    originalCollisionSourceParts:shape.collision.length,
    originalSelectionSourceParts:shape.selection.length,
    sourceVisibleParts:shape.visible.length,
    originalAuthoredTriangleCount:tri,
    originallyAdjacentWalkwayCoordinates:neighboringWalkways,
    actualSourceFixtureCellNotNavigation:true,
    noOtherWorldCellOccupied:true,
    sourceFloorContactProven:true,
    originalFurnishingCollisionAndSelectionExactlyMatchOwner:true,
    nativePlayerCollisionUnaccepted:true,realRendererUnaccepted:true,
    worldPlaced:false});
  receipts.push(receipt);
  if(physical.length<maxFixtureSamples){
   const actualOpaque=realWorldVertices(c.at,at.previewMesh.opaque);
   const actualGlass=realWorldVertices(c.at,at.previewMesh.translucent);
   const bytes=actualOpaque.byteLength+actualGlass.byteLength;
   previewBytes+=bytes;
   if(previewBytes>maxPreviewBytes)throw Error('D23 original Pack4 original interior source CPU preview overflow');
   geometryTriangles+=tri;
   physical.push(Object.freeze({at:Object.freeze([...c.at]),sourceId:spec.id,
    originalPack4OpaqueWorldMesh:actualOpaque,
    originalPack4TranslucentWorldMesh:actualGlass,
    actualOriginalSourceMeshBytes:bytes,
    originalNativeTriangles:tri,
    exactPhysicalPack4SourceCopied:true,originalGameplayCollisionAccepted:false,
    realOriginalGameWebGL2Accepted:false,worldPlaced:false}));
  }
 }
 return Object.freeze({format:'mythwrought.builder-d.d23.original-furniture-material-source.v1',
  blueprintId:blueprint.id,originalAuthoredFixtureCount:receipts.length,
  originalSourceFixtures:Object.freeze(receipts),
  originalPack4PhysicalSamples:Object.freeze(physical),
  originalPack4SourceSampleCount:physical.length,
  genuineOriginalSourceTriangles:geometryTriangles,
  genuineOriginalSourceMeshBytes:previewBytes,
  sourceOriginalBenchAndTableFootingVerified:true,
  noOriginalNavigationCellsOccupied:true,noAuthoredSourceCellsOverwritten:true,
  sourceOriginalWallRoofsUnchanged:true,
  originalWorldColliderGameplayUnaccepted:true,rendererPickingUnaccepted:true,
  originalGameWebGL2Unaccepted:true,iphonePwaUnaccepted:true,
  sourceSaveSchemaUnchanged:true,worldPlaced:false});
}
