/**
 * Roadmap A pure, source-only physical Pack5 integration blocker matrix.
 * No world imports, authored variant assignment, rendering, or source edits.
 */
const FIXED=Object.freeze({count:79,source207:207,remaining:213,cells:1115590,
 plaster:105584,brick:117048,tile:34751,missing:257449,roofWithoutWall:138698});
const expectedRoles=Object.freeze({
 'pack5:079':{policy:'wall',kind:'wall',reason:'SURFACE_PLASTER_IS_NOT_A_FULL_STRUCTURAL_WALL'},
 'pack5:080':{policy:'none',kind:'roof',reason:'SOLID_MASONRY_IS_NOT_AN_AUTHORED_ROOF_ASSEMBLY'},
 'pack5:081':{policy:'floor',kind:'floor',reason:'THIN_TILE_IS_NOT_A_FULL_STRUCTURAL_FLOOR'}
});
function must(x,msg){if(!x)throw Error('Roadmap A physical source gate: '+msg);}
const nat=x=>Number.isSafeInteger(x)&&x>=0;
const sum=a=>a.reduce((x,y)=>x+y,0);
export function buildRoadmapA79PhysicalHoldMatrix(census,realProducerVariants){
 must(census?.schema==='mythwrought.roadmap-a.2a-all79-four-yaw-real-pack5-source-support-census.v1','unknown census schema');
 must(census.originalA5207Intact&&census.original79SourcesIntact&&census.sourceOnly,'source provenance missing');
 must(census.buildings?.length===FIXED.count&&census.expectedMissingCanonicalSlots===FIXED.remaining,'A5 baseline or source count drift');
 must(census.productionRegistered===false&&census.physicalMaterialVariantsAssigned===false&&
  census.roofEngineeringAccepted===false&&census.actualCollisionAcceptance===false,'unexpected installed/approved producer');
 for(const [key,value] of Object.entries({sourceCells:FIXED.cells,plasterAsWholeWall:FIXED.plaster,
  brickMasonryAsSourceRoof:FIXED.brick,ceramicThinTileAsSourceFloor:FIXED.tile,
  allPack5CellsMissingAuthoredVariant:FIXED.missing,roofBaseWithoutImmediateWall:FIXED.roofWithoutWall}))
  must(census.totals?.[key]===value,'original source material count '+key);
 const yaw=census.actualRealProducerSupportOffsets;
 must(Array.isArray(yaw)&&yaw.length===4,'missing physical four-yaw source mount evidence');
 const orientations=new Set();
 for(const [i,y] of yaw.entries()){
  must(y.yaw===i&&y.variantAssigned===false&&Array.isArray(y.offset)&&
   y.offset.length===3&&y.offset.every(Number.isSafeInteger),'real producer yaw mapping');
  orientations.add(y.offset.join(','));
 }
 must(orientations.size===4,'duplicate source producer rotations');
 const producer={};
 for(const [symbol,role] of Object.entries(expectedRoles)){
  const examples=realProducerVariants?.[symbol];
  must(Array.isArray(examples)&&examples.length===2,'real Pack5 source-authored alternatives missing '+symbol);
  const seen=new Set();
  producer[symbol]=examples.map(opt=>{
   must(opt.symbol===symbol&&typeof opt.variant==='string'&&!seen.has(opt.variant)&&
     opt.variant.length>0&&opt.chosenForRoadmapA===false,'invented physical source variant '+symbol);
   seen.add(opt.variant);
   must(opt.supportPolicy===role.policy&&nat(opt.visibleBoxes)&&opt.visibleBoxes>0&&
    nat(opt.collisionBoxes)&&opt.collisionBoxes>0,'real Pack5 geometry semantics '+symbol);
   must(Array.isArray(opt.supportByYaw)&&opt.supportByYaw.length===4,'missing physical support by yaw '+symbol);
   for(let i=0;i<4;i++){
    const supports=opt.supportByYaw[i];
    must(Array.isArray(supports)&&supports.every(x=>Array.isArray(x)&&x.length===3&&x.every(Number.isSafeInteger)),
     'invalid real producer support '+symbol);
    if(symbol==='pack5:079')
     must(supports.length===1&&supports[0].join(',')===yaw[i].offset.join(','),
      'plaster source variant/backing differs at yaw '+i);
   }
   return {symbol,authoredVariant:opt.variant,realVisibleBoxCount:opt.visibleBoxes,
    realCollisionBoxCount:opt.collisionBoxes,actualSupportPolicy:role.policy,
    sourceSelectedThisOption:false,physicalGameAssetPlaced:false};
  });
 }
 const rows=[],byBiome={},byWave={},ids=new Set();
 for(const b of census.buildings){
  must(typeof b.id==='string'&&b.id.length>0&&!ids.has(b.id),'original blueprint ID drift');ids.add(b.id);
  must(b.anyChosenVariant===false&&b.anyChosenOrientation===false&&b.gameRegistered===false&&
   b.physicalPackBackingCertified===false&&b.roofBearingCertified===false&&b.creatorArtApproved===false,
   'physical source silently assigned, registered, or accepted '+b.id);
  for(const key of ['sourceVoxels','sourcePlasterAsWholeWalls','sourceBrickAsRoof',
   'sourceThinTileAsFloor','sourcePack5MissingVariant','sourceRoofBaseCells',
   'sourceRoofBaseCellsWithoutImmediateWall','sourceSymbolicDoorsNotPlaced'])
   must(nat(b[key]),'bad source count '+key+' '+b.id);
  must(b.sourceVoxels>4096&&b.sourcePack5MissingVariant<=b.sourceVoxels&&
   b.sourceRoofBaseCellsWithoutImmediateWall<=b.sourceRoofBaseCells,'source physical unit count '+b.id);
  must(/^[a-f0-9]{64}$/.test(b.sourceFileSHA256)&&/^[a-f0-9]{64}$/.test(b.sourceGeometrySHA256),
   'exact immutable A5 geometry/source SHA missing '+b.id);
  const originalYaw=b.physicalProducerPlasterFourPossibleYawBackings;
  must(Array.isArray(originalYaw)&&originalYaw.length===4,'missing four-yaw source physical backing '+b.id);
  const yawResults=originalYaw.map((v,i)=>{
   must(v.yaw===i&&v.hypotheticalOrientationOnly===true&&v.chosenOrientation===false&&
    v.realOriginalPack5SupportOffset?.join(',')===yaw[i].offset.join(','),
    'source physical support orientation mismatch '+b.id);
   must(v.sourceWholeWallPlasterCells===b.sourcePlasterAsWholeWalls&&
    nat(v.sourceNoBackingCount)&&v.sourceNoBackingCount<=b.sourcePlasterAsWholeWalls,
    'source physical backing count mismatch '+b.id);
   must(Object.values(v.classifications||{}).every(nat)&&
    sum(Object.values(v.classifications))===b.sourcePlasterAsWholeWalls&&
    v.sourceNoBackingCount===(v.classifications['no-source-voxel']??0),
    'source local neighbor census drift '+b.id);
   return {yaw:i,actualProducerSupportOffset:yaw[i].offset,
    sourceCellsWithoutBackingAtThisHypotheticalYaw:v.sourceNoBackingCount,
    hypotheticalSourceNoBackingPercent:b.sourcePlasterAsWholeWalls?
     Math.round(v.sourceNoBackingCount*10000/b.sourcePlasterAsWholeWalls)/100:0,
    orientationChosen:false,realWorldSupportCertified:false};
  });
  const minimum=Math.min(...yawResults.map(y=>y.sourceCellsWithoutBackingAtThisHypotheticalYaw));
  must(minimum===b.lowestSourceNoBackingCountAcrossFourPossibleYaws,'source physical backing hypothetical lower bound '+b.id);
  must(sum(Object.values(b.sourceRoofBaseUnderlyingKindCounts||{}))===b.sourceRoofBaseCells&&
   sum(Object.values(b.sourceThinTileBelowKinds||{}))===b.sourceThinTileAsFloor,
   'source roof or floor support evidence incomplete '+b.id);
  const holds=[];
  if(b.sourcePack5MissingVariant)holds.push('MANDATORY_PACK5_AUTHORED_VARIANT_CHOICE');
  if(b.sourcePlasterAsWholeWalls)holds.push('PLASTER_SURFACE_REQUIRES_REAL_STRUCTURAL_WALL');
  if(b.sourceBrickAsRoof)holds.push('SOLID_BRICK_AS_ROOF_REQUIRES_REAL_ROOF_ENGINEERING');
  if(b.sourceThinTileAsFloor)holds.push('THIN_TILE_REQUIRES_REAL_FLOOR_SUPPORT');
  if(b.sourceRoofBaseCellsWithoutImmediateWall)holds.push('ROOF_SPAN_REVIEW_NOT_PROVEN_FAILURE');
  if(b.sourceSymbolicDoorsNotPlaced)holds.push('SYMBOLIC_DOORS_NOT_INSTALLED');
  holds.push('MIXED_PACK_WORLD_PLACEMENT_NOT_VERIFIED','REAL_IPHONE_AND_CREATOR_ART_ON_HOLD');
  const record={id:b.id,wave:b.wave,biome:b.biome,category:b.category,
   originalGeometrySHA256:b.sourceGeometrySHA256,originalModuleSHA256:b.sourceFileSHA256,
   originalSourceCells:b.sourceVoxels,unassignedPack5SourceCells:b.sourcePack5MissingVariant,
   plasterSourceWallCells:b.sourcePlasterAsWholeWalls,brickSourceRoofCells:b.sourceBrickAsRoof,
   thinTileSourceFloorCells:b.sourceThinTileAsFloor,roofBasesWithoutImmediateSourceWall:b.sourceRoofBaseCellsWithoutImmediateWall,
   realProducerPossibleYawBackings:yawResults,
   minimumMissingSourceBackingAcrossUnchosenYaws:minimum,
   sourceCellCountGreaterThan4096DoesNotProveInstanceOverflow:true,
   physicalIntegrationHolds:holds,
   physicalVariantChosen:false,sourceOrientationChosen:false,
   realStructuralSupportCertified:false,physicalWorldRegistered:false,creatorArtApproved:false};
  rows.push(record);
  for(const [set,label] of [[byBiome,b.biome],[byWave,b.wave]]){
   must(typeof label==='string'&&label.length>0,'original source grouping label');
   set[label]??={designs:0,sourceCells:0,missingVariants:0,plaster:0,brickRoof:0,thinTile:0};
   set[label].designs++;set[label].sourceCells+=b.sourceVoxels;
   set[label].missingVariants+=b.sourcePack5MissingVariant;
   set[label].plaster+=b.sourcePlasterAsWholeWalls;
   set[label].brickRoof+=b.sourceBrickAsRoof;
   set[label].thinTile+=b.sourceThinTileAsFloor;
  }
 }
 must(ids.size===FIXED.count&&Object.keys(byBiome).length===5&&Object.keys(byWave).length===7,'original 79 source coverage changed');
 for(const [field,value] of [['originalSourceCells',FIXED.cells],['unassignedPack5SourceCells',FIXED.missing],
  ['plasterSourceWallCells',FIXED.plaster],['brickSourceRoofCells',FIXED.brick],
  ['thinTileSourceFloorCells',FIXED.tile],['roofBasesWithoutImmediateSourceWall',FIXED.roofWithoutWall]])
  must(sum(rows.map(x=>x[field]))===value,'original source audit aggregate changed '+field);
 rows.sort((a,b)=>b.unassignedPack5SourceCells-a.unassignedPack5SourceCells||
   b.plasterSourceWallCells-a.plasterSourceWallCells||
   b.brickSourceRoofCells-a.brickSourceRoofCells||a.id.localeCompare(b.id));
 return {schema:'mythwrought.roadmap-a.2a-real-producer-physical-integration-holds.v1',
  acceptedA5SourceCandidates:FIXED.source207,remainingUnwrittenSourceCandidates:FIXED.remaining,
  original79Count:FIXED.count,originalSourceCells:FIXED.cells,
  sourceOnly:true,unmodifiedRealProducerOptionsNotAssigned:producer,
  tickets:rows,byBiome,byWave,
  sourcePack5VariantChoicesRequired:FIXED.missing,
  plasterCellsRequireStructuralReview:FIXED.plaster,
  brickSourceRoofCellsRequireEngineering:FIXED.brick,
  thinTileSourceFloorCellsRequireAssemblyReview:FIXED.tile,
  roofBaseNoDirectSourceWallCountIsNotStructuralFailureProof:FIXED.roofWithoutWall,
  default4096IsInstancesNotSourceCells:true,
  realWorldPlacementAllowed:false,physicalVariantsAutoAssigned:false,
  creatorArtApproved:false,physicalIphoneGpuAccepted:false,saveSchema1Changed:false};
}
export function requireRoadmapA79PhysicalWorldPlacement(report){
 must(report?.schema==='mythwrought.roadmap-a.2a-real-producer-physical-integration-holds.v1','unknown physical approval report');
 throw Error('Roadmap A: source-only 79 physical producer integration prohibited pending explicit authored variants, real bearing and runtime acceptance');
}
