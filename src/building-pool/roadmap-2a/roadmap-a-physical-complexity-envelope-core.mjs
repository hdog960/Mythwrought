/** Strict SOURCE-ONLY conditional physical geometry envelope for 79 immutable Roadmap A designs.
 * An envelope describes the hypothetical expansion of original source cells into
 * one UNSELECTED Manual Pack5 asset instance each. It is NOT an executable plan,
 * optimized render mesh, actual GPU measurement, collision plan, or structure.
 */
const EXPECT=Object.freeze({designs:79,cells:1115590,plaster:105584,masonry:117048,tile:34751,missingVariants:257449});
const ROLES=Object.freeze([
 {symbol:'pack5:079',key:'sourcePlasterAsWholeWalls',total:EXPECT.plaster,role:'wall-mount-surface'},
 {symbol:'pack5:080',key:'sourceBrickAsRoof',total:EXPECT.masonry,role:'full-solid-masonry-as-roof'},
 {symbol:'pack5:081',key:'sourceThinTileAsFloor',total:EXPECT.tile,role:'thin-supported-tile-as-floor'}
]);
function requireTrue(condition,reason){if(!condition)throw Error('Roadmap A physical envelope blocked: '+reason);}
const natural=x=>Number.isSafeInteger(x)&&x>=0;
const sum=a=>a.reduce((x,y)=>x+y,0);
const counters=()=>({sourceCells:0,conditionalMinBoxes:0,conditionalMaxBoxes:0,
 conditionalMinTriangles:0,conditionalMaxTriangles:0,conditionalMinVertices:0,conditionalMaxVertices:0});
function plus(total,row){for(const k of Object.keys(row)){requireTrue(natural(row[k])&&natural(total[k]),'non-numeric conditional sum '+k);total[k]+=row[k];}}
export function buildRoadmapAConditionalPack5GeometryEnvelope(census,producerOptions){
 requireTrue(census?.schema==='mythwrought.roadmap-a.2a-all79-four-yaw-real-pack5-source-support-census.v1', 'unrecognized original source census');
 requireTrue(census.originalA5207Intact===true&&census.original79SourcesIntact===true&&
  census.physicalMaterialVariantsAssigned===false&&census.productionRegistered===false,
  'original A5 or source-only gate changed');
 requireTrue(census.buildings?.length===EXPECT.designs&&census.expectedMissingCanonicalSlots===213,
  'original protected 79/207 source records changed');
 requireTrue(Object.keys(census.exactOriginalSourceFileSHA256||{}).length===7,
  'original wave module SHA256 provenance missing');
 for(const hash of Object.values(census.exactOriginalSourceFileSHA256))
  requireTrue(/^[0-9a-f]{64}$/.test(hash),'invalid original source module fingerprint');
 requireTrue(census.totals?.sourceCells===EXPECT.cells&&
  census.totals.plasterAsWholeWall===EXPECT.plaster&&
  census.totals.brickMasonryAsSourceRoof===EXPECT.masonry&&
  census.totals.ceramicThinTileAsSourceFloor===EXPECT.tile&&
  census.totals.allPack5CellsMissingAuthoredVariant===EXPECT.missingVariants,
  'original source material census changed');
 const profile={};
 for(const role of ROLES){
  const examples=producerOptions?.[role.symbol];
  requireTrue(Array.isArray(examples)&&examples.length===2,
   'missing two original source-authored Pack5 examples '+role.symbol);
  const labels=new Set();
  const normalized=examples.map(example=>{
   requireTrue(example.symbol===role.symbol&&typeof example.variant==='string'&&
    example.variant.length>0&&!labels.has(example.variant)&&example.chosenForBlueprint===false,
    'unproven, duplicate, or silently selected physical material '+role.symbol);
   labels.add(example.variant);
   for(const field of ['visibleBoxCount','meshTriangleCount','meshVertexCount','collisionBoxCount'])
    requireTrue(natural(example[field])&&example[field]>0,
     'source-authored physical producer mesh statistic missing '+role.symbol+'/'+field);
   requireTrue(example.meshTriangleCount===12*example.visibleBoxCount&&
    example.meshVertexCount===24*example.visibleBoxCount,
    'original box-mesh producer triangle/vertex identity changed '+role.symbol);
   requireTrue(example.sampledFromActualPack5Surface===true&&
    example.supportPolicy===({ 'pack5:079':'wall','pack5:080':'none','pack5:081':'floor' })[role.symbol],
    'source material geometry/attachment provenance invalid '+role.symbol);
   requireTrue(Array.isArray(example.supportByYaw)&&example.supportByYaw.length===4&&
    example.supportByYaw.every(ys=>Array.isArray(ys)&&ys.every(v=>Array.isArray(v)&&v.length===3&&v.every(Number.isSafeInteger))),
    'four original source physical rotations not checked '+role.symbol);
   if(role.symbol==='pack5:079')for(let i=0;i<4;i++)
    requireTrue(example.supportByYaw[i].length===1&&
     example.supportByYaw[i][0].join(',')===census.actualRealProducerSupportOffsets[i].offset.join(','),
     'original plaster support yaw mismatch');
   return {authoredOnlyExampleVariant:example.variant,visibleBoxCount:example.visibleBoxCount,
    meshTriangles:example.meshTriangleCount,meshVertices:example.meshVertexCount,
    collisionBoxes:example.collisionBoxCount,sourceVariantAssigned:false};
  });
  profile[role.symbol]={symbol:role.symbol,sourceRole:role.role,
   twoUnchosenOriginalProducerAlternatives:normalized,
   minBoxes:Math.min(...normalized.map(v=>v.visibleBoxCount)),
   maxBoxes:Math.max(...normalized.map(v=>v.visibleBoxCount)),
   minTriangles:Math.min(...normalized.map(v=>v.meshTriangles)),
   maxTriangles:Math.max(...normalized.map(v=>v.meshTriangles)),
   minVertices:Math.min(...normalized.map(v=>v.meshVertices)),
   maxVertices:Math.max(...normalized.map(v=>v.meshVertices))};
 }
 const buildings=[],perRole={};
 for(const role of ROLES)perRole[role.symbol]={...counters(),originalRole:role.role};
 const seen=new Set(),aggregate=counters();let totalUnknownOther=0;
 for(const b of census.buildings){
  requireTrue(typeof b.id==='string'&&!seen.has(b.id),'duplicate original source design');
  seen.add(b.id);
  requireTrue(/^[0-9a-f]{64}$/.test(b.sourceFileSHA256)&&
   /^[0-9a-f]{64}$/.test(b.sourceGeometrySHA256)&&
   census.exactOriginalSourceFileSHA256[b.sourceFile]===b.sourceFileSHA256,
   'original A5 SHA provenance missing '+b.id);
  requireTrue(b.anyChosenVariant===false&&b.anyChosenOrientation===false&&
   b.physicalFullBuildingMeshInstantiated===false&&b.gameRegistered===false,
   'physical variant, world or game registration detected '+b.id);
  const sumKnown=sum(ROLES.map(r=>b[r.key]));
  requireTrue(natural(b.sourceVoxels)&&natural(b.sourcePack5MissingVariant)&&
   ROLES.every(r=>natural(b[r.key]))&&
   b.sourcePack5MissingVariant>=sumKnown&&b.sourceVoxels>=b.sourcePack5MissingVariant,
   'wrong or incomplete source role counts '+b.id);
  const otherMissing=b.sourcePack5MissingVariant-sumKnown;
  totalUnknownOther+=otherMissing;
  const total=counters(),roles=[];
  for(const role of ROLES){
   const cells=b[role.key],p=profile[role.symbol];
   const conditional={sourceCells:cells,
    conditionalMinBoxes:cells*p.minBoxes,conditionalMaxBoxes:cells*p.maxBoxes,
    conditionalMinTriangles:cells*p.minTriangles,conditionalMaxTriangles:cells*p.maxTriangles,
    conditionalMinVertices:cells*p.minVertices,conditionalMaxVertices:cells*p.maxVertices};
   plus(total,conditional);plus(perRole[role.symbol],conditional);
   roles.push({symbol:role.symbol,sourceRole:role.role,...conditional,
    sourceVariantsChosen:false,actualInstancesCreated:false});
  }
  plus(aggregate,total);
  buildings.push({id:b.id,biome:b.biome,wave:b.wave,category:b.category,
   originalSourceModuleSHA256:b.sourceFileSHA256,originalGeometrySHA256:b.sourceGeometrySHA256,
   allOriginalSourceVoxels:b.sourceVoxels,missingPack5VariantSourceCells:b.sourcePack5MissingVariant,
   otherPack5CellsOutsideTheThreeModeledRoles:otherMissing,
   conditionalRoleEnvelopes:roles,conditionalComplexityEnvelope:total,
   sourceCellCountExceeding4096IsNotAnInstanceCount:true,
   instantiatedPhysicalAssets:0,variantsChosen:false,
   actualCollisionWorldBuilt:false,realGPUUploaded:false,physicalIPhoneTested:false,
   creatorArtworkApproved:false});
 }
 for(const role of ROLES)requireTrue(perRole[role.symbol].sourceCells===role.total,
  'original producer source role total mismatch '+role.symbol);
 requireTrue(aggregate.sourceCells===EXPECT.plaster+EXPECT.masonry+EXPECT.tile&&
  totalUnknownOther===EXPECT.missingVariants-aggregate.sourceCells,
  'incomplete variantless Pack5 source cell accounting');
 requireTrue(Object.values(aggregate).every(natural)&&
  aggregate.conditionalMinBoxes<=aggregate.conditionalMaxBoxes&&
  aggregate.conditionalMinTriangles<=aggregate.conditionalMaxTriangles,
  'nonfinite physical producer conditional complexity envelope');
 buildings.sort((a,b)=>b.conditionalComplexityEnvelope.conditionalMaxTriangles-
  a.conditionalComplexityEnvelope.conditionalMaxTriangles||a.id.localeCompare(b.id));
 return {schema:'mythwrought.roadmap-a.conditional-original-pack5-geometry-envelope.v1',
  originalSourceDesigns:79,originalSourceOnlyA5207:207,unwrittenCanonicalSourceDesigns:213,
  originalSourceVoxels:EXPECT.cells,modelledThreeRoleSourceCells:aggregate.sourceCells,
  unresolvedOtherPack5VariantSourceCells:totalUnknownOther,
  originalProducerAlternativesNeverChosen:profile,byOriginalRole:perRole,
  hypotheticalSingleAssetPerOriginalCellEnvelope:aggregate,
  buildings,
  ASSUMPTION:'Only if each of the three role-specific original source cells became one unmerged original Pack5 asset instance. Other Pack5 cells excluded. No choice of variant or orientation, no engine mesh merge or batching model.',
  validForRealGpuOrFpsPredictions:false,validForRuntimeTriangleCounts:false,
  sourceVariantsChosen:false,physicalGeometryInstantiated:false,
  realWorldCollisionCertified:false,roofBearingCertified:false,
  sourceCellCountGreaterThan4096DoesNotProvePhysicalInstanceOverflow:true,
  gameplayStructureRegistrationAllowed:false,creatorArtApproved:false};
}
