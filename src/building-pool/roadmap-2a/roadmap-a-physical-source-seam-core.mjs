/** Source-only conservative exact-quad seam witness for explicitly specified Pack5 test assets.
 * It NEVER rewrites source blueprints, constructs a mesh, or places a game block.
 * The reported potential face pairs are NOT approved rendering optimizations.
 */
const limit=(ok,msg)=>{if(!ok)throw Error('Roadmap A source-only seam guard: '+msg);};
const safePoint=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const finiteBox=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
 [0,1,2].every(i=>b[i]<b[i+3]);
const encode=n=>{
 limit(Number.isFinite(n)&&Math.abs(n)<1000000,'world-scale coordinate out of preview range');
 return (Math.round(n*1000000)/1000000).toFixed(6);
};
const face=(b,axis,positive)=>{
 const j=(axis+1)%3,k=(axis+2)%3;
 return {axis,positive,plane:b[axis+(positive?3:0)],rect:[b[j],b[k],b[j+3],b[k+3]]};
};
function faceKey(source,face){
 return [source.symbol,source.variant,source.orientation,source.material,
  source.color.map(encode).join(','),face.axis,encode(face.plane),
  ...face.rect.map(encode)].join('|');
}
// Rounded keys are ONLY a candidate bucket. A near-coincident face is NOT exact.
// Deliberately accept false negatives rather than remove an unproven visible face.
const exactFace=(a,b)=>
 a.source.symbol===b.source.symbol&&a.source.variant===b.source.variant&&
 a.source.orientation===b.source.orientation&&a.source.material===b.source.material&&
 a.face.plane===b.face.plane&&
 a.face.rect.every((n,i)=>n===b.face.rect[i])&&
 a.rgba.every((n,i)=>n===b.rgba[i]);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
/** Fixtures must have original producer geometry and EXPLICIT variants; no A5 source blueprint IDs. */
export function auditExactPack5SeamCandidates(fixtures,{maxFixtures=96,maxBoxes=8192}={}){
 limit(Number.isSafeInteger(maxFixtures)&&maxFixtures>=1&&maxFixtures<=256,'invalid fixture capacity');
 limit(Number.isSafeInteger(maxBoxes)&&maxBoxes>=1&&maxBoxes<=32768,'invalid physical box capacity');
 limit(Array.isArray(fixtures)&&fixtures.length>0&&fixtures.length<=maxFixtures,'fixture list/capacity invalid');
 const anchors=new Set(),faceBuckets=new Map();let boxes=0;
 const sourceIdentity=[];
 for(const [instanceIndex,fixture] of fixtures.entries()){
  limit(fixture&&fixture.previewFixtureOnly===true&&fixture.authorizedGameplayPlacement!==true&&
   !Object.hasOwn(fixture,'buildingId')&&!Object.hasOwn(fixture,'sourceBlueprintId'),
   'real building or world placement not permitted');
  limit(['pack5:079','pack5:080','pack5:081'].includes(fixture.symbol)&&
   typeof fixture.variant==='string'&&fixture.variant.length>0&&
   Number.isInteger(fixture.orientation)&&fixture.orientation>=0&&fixture.orientation<=3&&
   safePoint(fixture.at)&&fixture.at.every(n=>Math.abs(n)<=4096),
   'an exact original Pack5 asset, explicit variant, yaw and source-test anchor are required');
  limit(Array.isArray(fixture.art)&&fixture.art.length>0&&fixture.art.length<=64,
   'original producer art missing or excessive');
  const anchorKey=fixture.at.join(',');
  limit(!anchors.has(anchorKey),'overlapping test-asset anchor not permitted');
  anchors.add(anchorKey);
  sourceIdentity.push({instanceIndex,asset:fixture.symbol,authoredVariant:fixture.variant,
   explicitlyProvidedYaw:fixture.orientation,at:[...fixture.at],selectedForRoadmapASource:false});
  for(const [boxIndex,part] of fixture.art.entries()){
   limit(part&&finiteBox(part.bounds)&&part.bounds.every(v=>v>=-0.000001&&v<=1.000001)&&
    typeof part.material==='string'&&part.material.length>0&&
    Array.isArray(part.color)&&part.color.length===4&&
    part.color.every(x=>Number.isFinite(x)&&x>=0&&x<=1)&&part.color[3]===1,
    'fully opaque original in-cell source box/material required');
   const b=add(part.bounds.slice(0,3),fixture.at)
     .concat(add(part.bounds.slice(3),fixture.at));
   boxes++;
   limit(boxes<=maxBoxes,'source-only preview box limit exceeded');
   const source={symbol:fixture.symbol,variant:fixture.variant,
    orientation:fixture.orientation,material:part.material,color:part.color};
   for(let axis=0;axis<3;axis++)for(const positive of [false,true]){
    const f=face(b,axis,positive),key=faceKey(source,f);
    if(!faceBuckets.has(key))faceBuckets.set(key,{negative:[],positive:[]});
    faceBuckets.get(key)[positive?'positive':'negative'].push({instanceIndex,boxIndex,source:{...source},face:f,rgba:[...source.color]});
   }
  }
 }
 const candidates=[];
 for(const [key,group] of faceBuckets){
  const used=new Set();
  for(const plus of group.positive){
   const ix=group.negative.findIndex((minus,i)=>!used.has(i)&&minus.instanceIndex!==plus.instanceIndex&&exactFace(plus,minus));
   if(ix<0)continue;
   used.add(ix);
   candidates.push({faceIdentity:key,positive:plus,negative:group.negative[ix],
    fullyCoincidentOpposingOpaqueFaces:true,rendererOcclusionCertified:false});
  }
 }
 const originalQuads=boxes*6,removedQuads=candidates.length*2;
 limit(removedQuads<=originalQuads,'invalid paired-quad source coverage');
 return {schema:'mythwrought.roadmap-a.pack5-conservative-seam-candidates.v1',
  inputExplicitTestFixtures:fixtures.length,sourceAuthoredPhysicalBoxes:boxes,
  originalSourceQuadFaces:originalQuads,originalSourceTriangles:originalQuads*2,
  exactOpaqueOppositeFacePairs:candidates.length,
  hypotheticalPairedFaces:candidates.length*2,
  hypotheticalRemainingQuads:originalQuads-removedQuads,
  hypotheticalRemainingTriangles:(originalQuads-removedQuads)*2,
  candidates,sourceIdentity,
  onlyExactFullyCoincidentOpaquePairs:true,partialFacesNotRemoved:true,
  sourceVariantsAutomaticallyChosen:false,realRoadmapABuildingsImported:false,
  appliedToActualRenderer:false,realGeometryModified:false,
  collisionOrSupportModified:false,worldPlaced:false,saveWritten:false,
  actualGpuPerformanceMeasured:false,creatorArtAccepted:false,
  readyForProductionOrWorldPlacement:false};
}
