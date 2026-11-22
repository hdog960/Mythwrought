/**
 * Read-only, source-only support candidate audit for bounded, explicitly chosen
 * Pack5 *preview fixtures* (never a source building or world placement).
 * A full-cell collider touching a face is a candidate, NOT load-bearing proof.
 */
const fail=(reason)=>{throw Error('Roadmap A preview support: '+reason);};
const requireTrue=(x,reason)=>{if(!x)fail(reason);};
const int3=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const box6=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
  [0,1,2].every(i=>b[i]<b[i+3]);
const plus=(a,b)=>a.map((x,i)=>x+b[i]);
const key=a=>a.join(',');
const originalSymbols=new Set(['pack5:079','pack5:080','pack5:081']);
const policyFor={'pack5:079':'wall','pack5:080':'none','pack5:081':'floor'};
const originalVariants=Object.freeze({
  'pack5:079':['chalk-lime','hand-troweled'],
  'pack5:080':['hearth-running-bond','kiln-soldier-course'],
  'pack5:081':['sunburst-encaustic','moonwoven-glaze']
});
const originalWallOffsets=Object.freeze([[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]]);
const axisOf=d=>d.findIndex(n=>n!==0);
const validOffset=d=>int3(d)&&d.reduce((s,n)=>s+Math.abs(n),0)===1;
function fullBoundaryCollider(collisionBoxes, supportAt, attachmentAt){
  const delta=supportAt.map((v,i)=>v-attachmentAt[i]);
  const axis=axisOf(delta);
  const towardAttached=delta[axis]===1?-1:1;
  // No tolerance: a 0.999999 boundary is not a full-cell face.
  const plane=attachmentAt[axis]+(delta[axis]===1?1:0);
  const others=[0,1,2].filter(i=>i!==axis);
  return collisionBoxes.some(b=>
    b[axis+(towardAttached===1?3:0)]===plane&&
    others.every(j=>b[j]<=attachmentAt[j]&&b[j+3]>=attachmentAt[j]+1));
}
/** Each input must come from the actual unchanged Manual Five Pack resolver. */
export function auditExplicitPack5PreviewSupports(fixtures,{maxFixtures=96,maxBoxes=8192}={}){
  requireTrue(Number.isSafeInteger(maxFixtures)&&maxFixtures>=1&&maxFixtures<=256,'invalid fixture cap');
  requireTrue(Number.isSafeInteger(maxBoxes)&&maxBoxes>=1&&maxBoxes<=32768,'invalid collider budget');
  requireTrue(Array.isArray(fixtures)&&fixtures.length>0&&fixtures.length<=maxFixtures,'invalid fixture count');
  const occupied=new Map(),inputs=[];let totalBoxes=0;
  for(const [index,f] of fixtures.entries()){
    requireTrue(f&&typeof f==='object'&&!Array.isArray(f)&&f.previewFixtureOnly===true&&
      f.authorizedGameplayPlacement!==true&&f.selectedForRoadmapASource===false&&
      !Object.hasOwn(f,'buildingId')&&!Object.hasOwn(f,'sourceBlueprintId'),
      'source building or gameplay fixture forbidden');
    requireTrue(originalSymbols.has(f.symbol)&&originalVariants[f.symbol].includes(f.variant)&&
      policyFor[f.symbol]===f.supportPolicy&&Number.isInteger(f.orientation)&&
      f.orientation>=0&&f.orientation<=3&&int3(f.at)&&f.at.every(v=>Math.abs(v)<=4096),
      'explicit original symbol, variant, yaw, anchor and producer policy required');
    requireTrue(Array.isArray(f.occupiedOffsets)&&f.occupiedOffsets.length===1&&
      int3(f.occupiedOffsets[0])&&f.occupiedOffsets[0].every(v=>v===0),
      'this preview only supports genuine single-cell Pack5 surfaces');
    requireTrue(Array.isArray(f.supportOffsets)&&
      (f.supportPolicy==='none'?f.supportOffsets.length===0:f.supportOffsets.length===1)&&
      f.supportOffsets.every(validOffset),
      'missing/invalid required original producer support offsets');
    if(f.supportPolicy==='floor')requireTrue(key(f.supportOffsets[0])==='0,-1,0',
      'source tile floor support must be below');
    if(f.supportPolicy==='wall')requireTrue(key(f.supportOffsets[0])===key(originalWallOffsets[f.orientation]),
      'source wall support must equal authentic Pack5 rotated mount offset');
    requireTrue(Array.isArray(f.collisionBoxes)&&f.collisionBoxes.length>0&&
      f.collisionBoxes.every(box6),'original physical colliders missing');
    for(const b of f.collisionBoxes)
      requireTrue([0,1,2].every(i=>b[i]>=0&&b[i+3]<=1),
        'original physical colliders must stay inside the test asset cell');
    totalBoxes+=f.collisionBoxes.length;
    requireTrue(totalBoxes<=maxBoxes,'collider budget exceeded');
    const world=plus(f.at,[0,0,0]);const loc=key(world);
    requireTrue(!occupied.has(loc),'preview assets overlap occupied source cells');
    const collisionBoxes=f.collisionBoxes.map(b=>b.map((v,i)=>v+world[i%3]));
    const row={index,at:world,symbol:f.symbol,variant:f.variant,
      orientation:f.orientation,supportPolicy:f.supportPolicy,
      supportTargets:f.supportOffsets.map(d=>plus(world,d)),collisionBoxes};
    inputs.push(row);occupied.set(loc,row);
  }
  const details=[];const outcomes={'source-only-full-face-collider-candidate':0,
    'source-only-neighbor-partial-collider':0,'no-explicit-preview-neighbor':0};
  for(const row of inputs){
    for(const supportAt of row.supportTargets){
      const other=occupied.get(key(supportAt));
      let classification='no-explicit-preview-neighbor';
      if(other){
        classification=fullBoundaryCollider(other.collisionBoxes,supportAt,row.at)?
          'source-only-full-face-collider-candidate':'source-only-neighbor-partial-collider';
      }
      outcomes[classification]++;
      details.push({fixtureIndex:row.index,symbol:row.symbol,explicitPreviewVariant:row.variant,
        explicitPreviewOrientation:row.orientation,at:[...row.at],requiredSourceSupportAt:[...supportAt],
        neighborPreviewIndex:other?.index??null,
        neighborPreviewPhysicalAsset:other?.symbol??null,classification,
        physicalLoadBearingCertified:false,worldSupportCertified:false,
        variantChosenForRoadmapABuilding:false});
    }
  }
  return {schema:'mythwrought.roadmap-a.preview-real-pack5-support-candidates.v1',
    previewAssets:inputs.length,originalProducerColliderBoxes:totalBoxes,
    attachmentRequirements:details.length,classificationTotals:outcomes,details,
    candidateIsNotStructuralApproval:true,physicalWorldBuilt:false,
    worldCollisionChecked:false,physicalLoadBearingCertified:false,
    original79RoadmapASourcesTouched:false,sourceVariantsAutomaticallySelected:false,
    gameStructuresRegistered:false,sourceSaveChanged:false,
    realIPhoneGPUMeasured:false,creatorArtAccepted:false,
    readyForWorldPlacement:false};
}
