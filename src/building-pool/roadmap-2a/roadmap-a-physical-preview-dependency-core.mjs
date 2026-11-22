/**
 * Pure source-only Pack5 support-dependency and hypothetical batching audit.
 * Consumes the original-preview support candidates, never a gameplay world.
 * A candidate full-face collider and dependency root are NOT load-bearing proof.
 */
const kind='mythwrought.roadmap-a.preview-real-pack5-support-candidates.v1';
const code='mythwrought.roadmap-a.preview-support-dependency-holds.v1';
const labels=Object.freeze(['source-only-full-face-collider-candidate','source-only-neighbor-partial-collider','no-explicit-preview-neighbor']);
function requireTrue(ok,what){if(!ok)throw Error('Roadmap A preview support dependency denied: '+what);}
const integer=x=>Number.isSafeInteger(x)&&x>=0;
export function auditRoadmapAPreviewSupportDependencyHolds(report,{maxInstances=4096}={}){
 requireTrue(report?.schema===kind&&report?.original79RoadmapASourcesTouched===false&&
  report.physicalWorldBuilt===false&&report.physicalLoadBearingCertified===false&&
  report.readyForWorldPlacement===false&&report.sourceVariantsAutomaticallySelected===false,
  'unrecognized or already-approved source-only support input');
 requireTrue(integer(report.previewAssets)&&report.previewAssets>0&&report.previewAssets<=96&&
  Array.isArray(report.details)&&integer(report.attachmentRequirements)&&
  report.details.length===report.attachmentRequirements,
  'source fixture/attachment count not bounded');
 requireTrue(Number.isSafeInteger(maxInstances)&&maxInstances>=1&&maxInstances<=4096,
  'original Manual Five Pack maximum instance size');
 const n=report.previewAssets,byOwner=new Map(),actual=Object.fromEntries(labels.map(k=>[k,0]));
 for(const detail of report.details){
  const id=detail?.fixtureIndex;
  requireTrue(integer(id)&&id<n&&!byOwner.has(id),'invalid or duplicated one-cell source attachment owner');
  requireTrue(labels.includes(detail.classification)&&detail.physicalLoadBearingCertified===false&&
   detail.worldSupportCertified===false&&detail.variantChosenForRoadmapABuilding===false,
   'unsupported physical classification or silently approved asset');
  const partner=detail.neighborPreviewIndex;
  const absent=detail.classification==='no-explicit-preview-neighbor';
  requireTrue(absent?partner===null:(integer(partner)&&partner<n&&partner!==id),
   'missing, outside, or self-supporting source asset');
  requireTrue(absent?detail.neighborPreviewPhysicalAsset===null:
   (typeof detail.neighborPreviewPhysicalAsset==='string'&&detail.neighborPreviewPhysicalAsset.startsWith('pack5:')),
   'source neighbor identity/count inconsistent');
  byOwner.set(id,detail);actual[detail.classification]++;
 }
 requireTrue(labels.every(k=>report.classificationTotals?.[k]===actual[k])&&
  Object.keys(report.classificationTotals||{}).length===labels.length,
  'original source support census category totals drifted');
 const groups=Array.from({length:Math.ceil(n/maxInstances)},(_,batch)=>({
  batch,firstFixture:batch*maxInstances,lastFixture:Math.min((batch+1)*maxInstances,n)-1,
  instances:Math.min(maxInstances,n-batch*maxInstances),
  sourceOnly:true,actualBuilderBatchCreated:false,readyForWorldPlacement:false}));
 const color=new Array(n).fill(0),chain=new Array(n),cyclic=new Set(),edges=[],cross=[];
 for(const [id,d] of byOwner){
  if(d.classification!=='source-only-full-face-collider-candidate')continue;
  const edge={dependentFixture:id,potentialBackingFixture:d.neighborPreviewIndex,
   dependentHypotheticalBatch:Math.floor(id/maxInstances),
   backingHypotheticalBatch:Math.floor(d.neighborPreviewIndex/maxInstances),
   sourceSupportCertified:false};
  edges.push(edge);
  if(edge.dependentHypotheticalBatch!==edge.backingHypotheticalBatch)cross.push(edge);
 }
 function visit(id,stack=[]){
  if(color[id]===2)return chain[id];
  if(color[id]===1){
   const idx=stack.indexOf(id);
   for(const member of stack.slice(idx<0?0:idx))cyclic.add(member);
   return {cycle:true,root:null,depth:0,blocked:true};
  }
  color[id]=1;
  const d=byOwner.get(id);
  let result;
  if(!d)result={cycle:false,root:id,depth:0,blocked:false};
  else if(d.classification==='no-explicit-preview-neighbor')
   result={cycle:false,root:null,depth:0,blocked:true};
  else if(d.classification==='source-only-neighbor-partial-collider')
   result={cycle:false,root:null,depth:0,blocked:true};
  else{
   const next=visit(d.neighborPreviewIndex,[...stack,id]);
   result={cycle:next.cycle,root:next.root,depth:next.depth+1,blocked:next.blocked};
  }
  color[id]=2;chain[id]=result;return result;
 }
 for(let i=0;i<n;i++)visit(i,[]);
 const fixtureHolds=Array.from({length:n},(_,id)=>{
  const d=byOwner.get(id),status=chain[id];
  let label;
  if(status.cycle)label='CYCLIC_PREVIEW_ATTACHMENT';
  else if(!d)label='NO_REQUIRED_PREVIEW_ATTACHMENT_NOT_WORLD_ANCHOR_PROOF';
  else if(d.classification==='no-explicit-preview-neighbor')label='MISSING_EXPLICIT_PREVIEW_SUPPORT';
  else if(d.classification==='source-only-neighbor-partial-collider')label='PARTIAL_COLLIDER_NOT_FULL_FACE_SUPPORT';
  else if(status.blocked)label='PREVIEW_CHAIN_REACHES_UNRESOLVED_SUPPORT';
  else label='PREVIEW_CHAIN_ENDS_AT_UNCERTIFIED_NO_ATTACHMENT_ROOT';
  return {fixtureIndex:id,hypotheticalBatch:Math.floor(id/maxInstances),
   supportHold:label,preliminaryDependencyDepth:status.depth,
   terminalPreviewRoot:status.root,
   physicalSupportCertified:false,actualWorldInstanceCreated:false};
 });
 return {schema:code,inputPreviewAssets:n,originalSourceSupportChecks:report.attachmentRequirements,
  originalCandidateAttachmentEdges:edges.length,sourceOnlyHypotheticalMaxInstanceBatch:maxInstances,
  hypotheticalBatches:groups,conditionalAttachmentEdges:edges,
  conditionalEdgesAcrossHypotheticalBatches:cross,
  conditionalCycles:[...cyclic].sort((a,b)=>a-b),fixtureHolds,
  sourceOnly:true,unapprovedFixtureSupportCandidates:true,
  partialOrMissingSourceSupportCount:actual['source-only-neighbor-partial-collider']+actual['no-explicit-preview-neighbor'],
  actualManualFivePackBlueprintPlanCreated:false,realWorldSupportsCertified:false,
  realPhysicalStructuralLoadsAccepted:false,sourceA5VariantsOrYawsChosen:false,
  worldOrSavesModified:false,realGpuOrIphoneMeasured:false,
  readyForGamePlacement:false};
}
