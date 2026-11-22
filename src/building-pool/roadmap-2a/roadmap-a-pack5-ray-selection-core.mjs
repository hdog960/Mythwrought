/**
 * Roadmap A source-only original Pack5 selection/collision/mesh ray witness.
 * Analytical axis-parallel rays through explicitly sampled preview surfaces.
 * Not the actual game raycaster, GPU render, placement, or structural approval.
 */
const requireTrue=(ok,why)=>{if(!ok)throw Error('Roadmap A Pack5 ray witness denied: '+why);};
const coords=Object.freeze([0.02,0.1,0.5,0.9,0.98]);
const symbols=Object.freeze({
 'pack5:079':['chalk-lime','hand-troweled'],
 'pack5:080':['hearth-running-bond','kiln-soldier-course'],
 'pack5:081':['sunburst-encaustic','moonwoven-glaze']
});
const isBox=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
 [0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const subtract=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export function sourceRayBoxDistance(origin,direction,box){
 requireTrue(Array.isArray(origin)&&Array.isArray(direction)&&origin.length===3&&
  direction.length===3&&[...origin,...direction].every(Number.isFinite)&&
  dot(direction,direction)>0&&isBox(box),'bounded original source AABB/ray required');
 let lo=-Infinity,hi=Infinity;
 for(let axis=0;axis<3;axis++){
  if(direction[axis]===0){
   if(origin[axis]<box[axis]||origin[axis]>box[axis+3])return null;
   continue;
  }
  const a=(box[axis]-origin[axis])/direction[axis];
  const b=(box[axis+3]-origin[axis])/direction[axis];
  lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));
  if(hi<lo)return null;
 }
 return hi<0?null:Math.max(0,lo);
}
export function sourceRayTriangleDistance(origin,direction,a,b,c){
 requireTrue([origin,direction,a,b,c].every(x=>Array.isArray(x)&&x.length===3&&x.every(Number.isFinite))&&
  dot(direction,direction)>0,'finite original triangle and ray required');
 const e1=subtract(b,a),e2=subtract(c,a),p=cross(direction,e2),det=dot(e1,p);
 if(Math.abs(det)<1e-12)return null;
 const tvec=subtract(origin,a),inv=1/det,u=dot(tvec,p)*inv;
 if(u < -1e-7||u>1+1e-7)return null;
 const q=cross(tvec,e1),v=dot(direction,q)*inv;
 if(v < -1e-7||u+v>1+1e-7)return null;
 const t=dot(e2,q)*inv;
 return t>=-1e-7?Math.max(0,t):null;
}
function nearestBox(origin,direction,boxes){
 let dist=null;
 for(const b of boxes){
  const d=sourceRayBoxDistance(origin,direction,b);
  if(d!==null&&(dist===null||d<dist))dist=d;
 }
 return dist;
}
function validMesh(mesh){
 if(!mesh||!(Array.isArray(mesh.positions)||ArrayBuffer.isView(mesh.positions))||
  !(Array.isArray(mesh.indices)||ArrayBuffer.isView(mesh.indices))||
  !Number.isSafeInteger(mesh.vertexCount)||mesh.vertexCount<1||mesh.vertexCount>1536||
  !Number.isSafeInteger(mesh.triangles)||mesh.triangles<1||mesh.triangles>768||
  mesh.positions.length!==mesh.vertexCount*3||mesh.indices.length!==mesh.triangles*3||
  Array.from(mesh.positions).some(v=>!Number.isFinite(v)||v < -0.000001||v>1.000001)||
  Array.from(mesh.indices).some(v=>!Number.isSafeInteger(v)||v<0||v>=mesh.vertexCount))
  return false;
 return true;
}
function nearestTriangle(origin,direction,mesh){
 let nearest=null;
 const p=mesh.positions,ind=mesh.indices;
 const vertex=ix=>[p[ix*3],p[ix*3+1],p[ix*3+2]];
 for(let i=0;i<ind.length;i+=3){
  const d=sourceRayTriangleDistance(origin,direction,
   vertex(ind[i]),vertex(ind[i+1]),vertex(ind[i+2]));
  if(d!==null&&(nearest===null||d<nearest))nearest=d;
 }
 return nearest;
}
/**
 * Read-only 150-ray per source-preview fixture sampling witness:
 * 6 exterior directions x 5 x 5 deterministic face samples.
 * No caller-selected ray grid, random world seed, or A5 blueprint interpretation.
 */
export function auditSourceOnlyPack5AxisRayFidelity(fixture){
 requireTrue(fixture&&typeof fixture==='object'&&!Array.isArray(fixture)&&
  fixture.previewFixtureOnly===true&&fixture.selectedForRoadmapASource===false&&
  Object.hasOwn(symbols,fixture.symbol)&&symbols[fixture.symbol].includes(fixture.variant)&&
  Number.isInteger(fixture.orientation)&&fixture.orientation>=0&&fixture.orientation<=3&&
  fixture.livePlaceable===false&&fixture.saveWritten===false&&
  fixture.worldPlaced===false&&fixture.creatorAccepted===false&&
  !Object.hasOwn(fixture,'buildingId')&&!Object.hasOwn(fixture,'sourceBlueprintId'),
  'only explicit original unapproved Pack5 test fixture variants and yaws');
 requireTrue(Array.isArray(fixture.selectionBoxes)&&fixture.selectionBoxes.length>0&&
  fixture.selectionBoxes.length<=64&&fixture.selectionBoxes.every(isBox)&&
  Array.isArray(fixture.collisionBoxes)&&fixture.collisionBoxes.length>0&&
  fixture.collisionBoxes.length<=64&&fixture.collisionBoxes.every(isBox)&&
  validMesh(fixture.mesh),'original physical selection/collision/mesh geometry missing');
 const summary={sampleRays:0,collisionHits:0,selectionHits:0,authoredTriangleHits:0,
  colliderWithoutSelection:0,selectionWithoutCollider:0,
  selectionRecessedBehindCollider:0,selectionAheadOfCollider:0,
  selectionAndColliderCoincident:0,selectionTriangleMismatch:0,bothMiss:0};
 const faces=[],witnesses=[];
 for(let axis=0;axis<3;axis++)for(const positive of [false,true]){
  const other=[0,1,2].filter(i=>i!==axis);
  const face={axis,side:positive?'+':'-',rays:0,colliderWithoutSelection:0,
   selectionRecessedBehindCollider:0,selectionAheadOfCollider:0,selectionTriangleMismatch:0};
  for(const u of coords)for(const v of coords){
   const origin=[0,0,0],direction=[0,0,0];
   origin[axis]=positive?2:-1;origin[other[0]]=u;origin[other[1]]=v;
   direction[axis]=positive?-1:1;
   const coll=nearestBox(origin,direction,fixture.collisionBoxes);
   const sel=nearestBox(origin,direction,fixture.selectionBoxes);
   const tri=nearestTriangle(origin,direction,fixture.mesh);
   summary.sampleRays++;face.rays++;
   if(coll!==null)summary.collisionHits++;
   if(sel!==null)summary.selectionHits++;
   if(tri!==null)summary.authoredTriangleHits++;
   let issue=null;
   if((sel===null)!==(tri===null)||
      (sel!==null&&tri!==null&&Math.abs(sel-tri)>0.000002)){
    summary.selectionTriangleMismatch++;face.selectionTriangleMismatch++;
    issue='AUTHORED_TRIANGLE_VERSUS_SELECTION_RAY_DISAGREEMENT';
   }
   if(coll!==null&&sel===null){
    summary.colliderWithoutSelection++;face.colliderWithoutSelection++;
    issue??='COLLIDER_ONLY_SOURCE_RAY';
   }else if(coll===null&&sel!==null){
    summary.selectionWithoutCollider++;
    issue??='SELECTION_WITHOUT_COLLIDER_SOURCE_RAY';
   }else if(coll!==null&&sel!==null){
    if(sel>coll+0.000002){
     summary.selectionRecessedBehindCollider++;face.selectionRecessedBehindCollider++;
     issue??='SELECTION_RECESSED_BEHIND_COLLIDER';
    }else if(sel<coll-0.000002){
     summary.selectionAheadOfCollider++;face.selectionAheadOfCollider++;
     issue??='SELECTION_PRECEDES_COLLIDER';
    }else summary.selectionAndColliderCoincident++;
   }else summary.bothMiss++;
   if(issue&&witnesses.length<32)witnesses.push({axis,side:face.side,u,v,
    collisionDistanceBlockUnits:coll,selectionDistanceBlockUnits:sel,
    triangleDistanceBlockUnits:tri,classification:issue});
  }
  faces.push(face);
 }
 requireTrue(summary.sampleRays===150&&faces.length===6&&
  summary.selectionHits+summary.bothMiss+summary.colliderWithoutSelection<=150&&
  summary.colliderWithoutSelection+summary.selectionWithoutCollider+
   summary.selectionRecessedBehindCollider+summary.selectionAheadOfCollider+
   summary.selectionAndColliderCoincident+summary.bothMiss===150,
  'incomplete or double-counted deterministic original face ray census');
 return {schema:'mythwrought.roadmap-a.pack5-original-selection-collision-rays.v1',
  symbol:fixture.symbol,explicitPreviewVariant:fixture.variant,explicitPreviewYaw:fixture.orientation,
  sampleGrid:coords.slice(),faceResults:faces,raySummary:summary,firstBoundedWitnesses:witnesses,
  originalAuthoredTrianglesComparedWithOriginalSelection:true,
  partialFaceAndInsetRiskIsNotRealGameplayFailureProof:true,
  analyticalSourceRaysNotLiveEngineRaycast:true,
  originalA5SourceVariantOrYawChosen:false,actualGPUShaderOrPixelVisibilityMeasured:false,
  realWorldCollisionOrTargetingAccepted:false,
  originalProducersOrGameCodeModified:false,schema1OrPwaChanged:false,
  sourceOnly:true,readyForWorldPlacement:false,creatorAccepted:false};
}
