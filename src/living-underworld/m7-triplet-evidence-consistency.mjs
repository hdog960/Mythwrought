// Pure fail-closed provenance arithmetic for three read-only ORIGINAL M7
// research JSON documents. These checks NEVER authenticate a terrain reader:
// the pinned native runner must first prove exact checkout/source identity.
// Crucially, a self-declared "ok" JSON flag is not enough without actual
// gallery, city and core-versus-halo arithmetic.
const INT=Number.isSafeInteger;
const NAT=n=>INT(n)&&n>=0;
const FIELDS=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const SOURCE_VETOES=Object.freeze([
 'oreOrUnsafe','authoredSolid','authoredAirMismatch','originalEdit','landmark'
]);
const SUM=(rows,key)=>rows.reduce((n,r)=>n+r[key],0);
const hist=o=>{
 if(!o||typeof o!=='object'||Array.isArray(o))return null;
 let total=0;
 for(const [key,count] of Object.entries(o)){
  if(!/^(0|[1-9][0-9]*)$/.test(key)||!NAT(Number(key))||!NAT(count))
   return null;
  total+=count;
  if(!Number.isSafeInteger(total))return null;
 }
 return total;
};
const roles=o=>o&&FIELDS.every(k=>NAT(o[k]))&&
 Object.keys(o).length===FIELDS.length;
const add=(reasons,reason)=>{if(!reasons.includes(reason))reasons.push(reason);};
const keys=a=>a.map(x=>x.rx+','+x.rz);
export function inspectOriginalM7TripletAccounting({gallery,city,chunk}={}){
 const reasons=[];
 // Strict source readings: 16 authentic planned galleries per biome, with
 // separate real source method calls and complete material-ID classifications.
 const g=gallery,rows=g?.rows;
 if(!Array.isArray(rows)||rows.length!==5)add(reasons,'M7_GALLERY_COUNT_INVALID');
 else{
  const bad=rows.some(r=>{
   const counts=r?.sourceRejectionCounts;
   const materials=hist(r?.unsafeMaterialByBlockId);
   const readers=r?.originalReaderCallsByRole;
   const safe=NAT(r?.sourceSafeGalleries)&&NAT(r?.sourceRejectedGalleries)&&
    r.sourceSafeGalleries+r.sourceRejectedGalleries===16;
   const source=INT(r?.galleriesInspected)&&r.galleriesInspected===16&&
    NAT(r.inspectedSourceCells)&&r.inspectedSourceCells>0&&
    r.checkedPairs===120&&r.all16GallerySourcesDiagnosed===true&&
    r.completedFullSourceCellVetoCensus===true&&
    r.sourceCountMethod==='FULL_COMPLETED_GALLERY_SOURCE_VOXELS'&&
    roles(readers)&&NAT(r.genuineOriginalReaderCalls)&&
    r.genuineOriginalReaderCalls===FIELDS.reduce((n,k)=>n+readers[k],0)&&
    r.genuineOriginalReaderCalls>=r.inspectedSourceCells;
   const refusal=safe&&typeof r.sourceSafe==='boolean'&&
    r.sourceSafe===(r.sourceRejectedGalleries===0);
   const vetoes=materials!==null&&NAT(r.otherUnsafeMaterialCells)&&
    r.allUnsafeMaterialIdsEnumerated===(r.otherUnsafeMaterialCells===0)&&
    counts&&typeof counts==='object'&&NAT(counts.unsafeMaterial)&&
    materials+r.otherUnsafeMaterialCells===counts.unsafeMaterial;
   const asBuilt=NAT(r.oldM7AsBuiltBlockedHeadroomCells)&&
    NAT(r.oldM7AsBuiltMissingSupportCells)&&NAT(r.oldM7AsBuiltEditedCells)&&
    NAT(r.oldM7AsBuiltSourceCells)&&r.oldM7AsBuiltSourceCells>0&&
    hist(r.oldM7AsBuiltHeadroomBlockedByBlockId)!==null&&
    hist(r.oldM7AsBuiltUnsupportedFloorByBlockId)!==null&&
    NAT(r.oldM7AsBuiltBlockedMaterialIdOverflow)&&
    NAT(r.oldM7AsBuiltSupportMaterialIdOverflow)&&
    hist(r.oldM7AsBuiltHeadroomBlockedByBlockId)+
     r.oldM7AsBuiltBlockedMaterialIdOverflow===
      r.oldM7AsBuiltBlockedHeadroomCells&&
    hist(r.oldM7AsBuiltUnsupportedFloorByBlockId)+
     r.oldM7AsBuiltSupportMaterialIdOverflow===
      r.oldM7AsBuiltMissingSupportCells&&
    typeof r.oldM7AsBuiltGalleryDeckAndAirPresent==='boolean'&&
    (!r.oldM7AsBuiltGalleryDeckAndAirPresent||
     r.oldM7AsBuiltBlockedHeadroomCells===0&&
     r.oldM7AsBuiltMissingSupportCells===0&&r.oldM7AsBuiltEditedCells===0);
   return !(source&&refusal&&vetoes&&asBuilt);
  });
  if(bad)add(reasons,'M7_GALLERY_ROW_SOURCE_ARITHMETIC_INVALID');
  else{
   const sumHist=Object.create(null);
   for(const r of rows)for(const [id,n] of Object.entries(r.unsafeMaterialByBlockId))
    sumHist[id]=(sumHist[id]??0)+n;
   const allCounts=Object.entries(sumHist).every(([k,n])=>
    g.unsafeBlockIdTotals?.[k]===n)&&
    Object.keys(g.unsafeBlockIdTotals??{}).length===Object.keys(sumHist).length;
   if(g.sourceCells!==SUM(rows,'inspectedSourceCells')||
    g.totalOriginalM7ReaderMethodCalls!==SUM(rows,'genuineOriginalReaderCalls')||
    g.sourceSafeRegions!==rows.filter(r=>r.sourceSafe).length||
    g.sourceRefusals!==rows.filter(r=>!r.sourceSafe).length||
    g.asBuiltGalleryRegions!==rows.filter(r=>
     r.oldM7AsBuiltGalleryDeckAndAirPresent).length||
    g.diagnosedSafeGalleries!==SUM(rows,'sourceSafeGalleries')||
    g.diagnosedRejectedGalleries!==SUM(rows,'sourceRejectedGalleries')||
    g.diagnosedSafeGalleries+g.diagnosedRejectedGalleries!==80||
    g.unsafeMaterialIdsOverflowTotal!==SUM(rows,'otherUnsafeMaterialCells')||
    !allCounts||
    !roles(g.originalReaderCallCountsByRole)||
    FIELDS.some(k=>g.originalReaderCallCountsByRole[k]!==SUM(
     rows.map(r=>r.originalReaderCallsByRole),k)))
    add(reasons,'M7_GALLERY_AGGREGATES_DO_NOT_MATCH_ROWS');
  }
 }
 // Source-approved rare-city stage must be a genuine ordered 16/25/34
 // four-hub route, not a single successful unjoined proposal.
 const c=city;
 if(!Array.isArray(c?.rows)||c.rows.length!==2||
  new Set(keys(c.rows)).size!==2)
  add(reasons,'M7_CITY_SITE_INVENTORY_INVALID');
 else for(const r of c.rows){
  if(!NAT(r.fullJoinedCandidateOriginalM7SourceChecks)||
   !NAT(r.fullNetworkCombinationsInspected)||
   !NAT(r.joinedSourceChecks)||!NAT(r.fullPadSourceChecks)||
   typeof r.threeDeepLinksOriginalM7SourceSelected!=='boolean'||
   r.oldWorldModified!==false||r.cityPlaced!==false||
   r.actuallyBuiltAndWalked!==false)
   add(reasons,'M7_CITY_SOURCE_ACCOUNTING_INVALID');
  if(r.threeDeepLinksOriginalM7SourceSelected){
   if(!Array.isArray(r.threeDeepLinkSelectedIndexList)||
    r.threeDeepLinkSelectedIndexList.join(',')!=='16,25,34'||
    !Array.isArray(r.selectedDeepLinkConfigurations)||
    r.selectedDeepLinkConfigurations.length!==3||
    r.selectedDeepLinkConfigurations.map(x=>x.index).join(',')!=='16,25,34'||
    r.fullNetworkCombinationsInspected<1||
    r.fullJoinedCandidateOriginalM7SourceChecks<1||
    r.joinedFourHubCandidateTopologyApproved!==true||
    r.joinedFourHubSourceOwnershipApproved!==true||
    r.joinedCityTerraceAndActualApproachSourceSafe!==true)
    add(reasons,'M7_CITY_DEEP_LINK_TOPOLOGY_INCONSISTENT');
  }
 }
 // Five independently measured 16^3 ownership cores must individually
 // conserve candidate, source-approved, and refused core/halo requests.
 const k=chunk,cohort=k?.rows,aggregate=k?.aggregateSourceRisk;
 if(!Array.isArray(cohort)||cohort.length!==5)
  add(reasons,'M7_CHUNK_INVENTORY_INVALID');
 else{
  for(const r of cohort){
   const p=r?.origin;
   const cns=['candidateCarveCells','sourceAllowedCarveCells',
    'sourceRejectedCarveCells','ownedInteriorRequestedCarves',
    'ownedInteriorApprovedCarves','ownedInteriorRejectedCarves',
    'haloRequestedProposals','haloApprovedProposals',
    'haloRejectedProposals','approvedOnlyAddedFaces'];
   if(!p||!['x','y','z'].every(a=>INT(p[a])&&p[a]%16===0)||
    Math.floor(p.x/256)!==r.rx||Math.floor(p.z/256)!==r.rz||
    r.sourceHaloCells!==5832||cns.some(v=>!NAT(r[v]))||
    r.candidateCarveCells!==r.sourceAllowedCarveCells+
     r.sourceRejectedCarveCells||
    r.ownedInteriorRequestedCarves!==r.ownedInteriorApprovedCarves+
     r.ownedInteriorRejectedCarves||
    r.haloRequestedProposals!==r.haloApprovedProposals+
     r.haloRejectedProposals||
    r.candidateCarveCells!==r.ownedInteriorRequestedCarves+
     r.haloRequestedProposals||
    r.sourceAllowedCarveCells!==r.ownedInteriorApprovedCarves+
     r.haloApprovedProposals||
    r.sourceRejectedCarveCells!==r.ownedInteriorRejectedCarves+
     r.haloRejectedProposals||
    r.sourceCoreCutParity!==true||
    typeof r.ok!=='boolean'||r.oldWorldUnmodified!==true)
    add(reasons,'M7_CHUNK_CORE_HALO_ARITHMETIC_INVALID');
  }
  if(!aggregate||aggregate.checkedChunks!==5||
   aggregate.expectedChunks!==5||
   aggregate.sourceQueries!==SUM(cohort,'sourceHaloCells')||
   aggregate.approvedCarves!==SUM(cohort,'ownedInteriorApprovedCarves')||
   aggregate.unsafeCarves!==SUM(cohort,'sourceRejectedCarveCells')||
   aggregate.approvedHaloProposals!==SUM(cohort,'haloApprovedProposals')||
   aggregate.rejectedHaloProposals!==SUM(cohort,'haloRejectedProposals')||
   aggregate.faceGrowth!==SUM(cohort,'approvedOnlyAddedFaces')||
   k.sourceQueries!==SUM(cohort,'sourceHaloCells')||
   k.ownedInteriorApprovedCarves!==SUM(cohort,'ownedInteriorApprovedCarves')||
   k.sourceRejectedCarveCells!==SUM(cohort,'sourceRejectedCarveCells')||
   k.haloApprovedProposals!==SUM(cohort,'haloApprovedProposals')||
   k.haloRejectedProposals!==SUM(cohort,'haloRejectedProposals'))
   add(reasons,'M7_CHUNK_AGGREGATE_DOES_NOT_MATCH_ROWS');
 }
 return Object.freeze({
  ok:reasons.length===0,
  galleryAccountingReconciled:!reasons.some(r=>r.startsWith('M7_GALLERY')),
  cityAccountingReconciled:!reasons.some(r=>r.startsWith('M7_CITY')),
  chunkAccountingReconciled:!reasons.some(r=>r.startsWith('M7_CHUNK')),
  reasonCodes:Object.freeze(reasons),
  nativeOriginalM7SourceAuthenticatedHere:false,
  actualGameWalkingOrDeviceTested:false
 });
}
