// Isolated, read-only future rare-city LANDING-SIDE DISTRICT candidate.
// Not a full city floor: the 16 genuine horizontal galleries bisect the
// old ellipse, so the landing's disconnected quarter must not be branded a
// connected complete city. NO settlements, voxel writes, saves or PWA edits.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {auditSelectedInterlevelTopology}
 from './source-network-topology.mjs';
import {compileMainGalleryPedestrianClearance,
 compileSelectedStairPedestrianClearance}
 from './combined-stair-footprints.mjs';
import {isCandidateGeologyMaterial}
 from './protected-entrance-envelope.mjs';
const INT=Number.isSafeInteger;
const KEY=(i,j)=>i+','+j;
const OFFSETS=Object.freeze([[-1,0],[1,0],[0,-1],[0,1]]);
const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const fail=(seed,rx,rz,reason,extra={})=>Object.freeze({
 ok:false,sitePresent:true,seed,rx,rz,reason,...extra,
 wholeHistoricalCityFloorApproved:false,actualSettlementPlaced:false,
 playerWalkingVerified:false,worldChanged:false
});
const yes=x=>x===true;
const sourceFlag=(fn,role,x,y,z)=>{
 const v=fn(x,y,z);
 if(typeof v!=='boolean')throw TypeError(
  'Nonboolean original M7 district '+role+' source');
 return v;
};
export function planGalleryEasementCityDistrict(seed,rx,rz,{
 selectedDeepProposals=null,sourceAuditedCityAccessRoute=null,
 marginCells=1,maxDistrictColumns=10000,minLandingTiles=80
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  ![marginCells,maxDistrictColumns,minLandingTiles].every(INT)||
  marginCells<0||marginCells>2||
  maxDistrictColumns<9||maxDistrictColumns>10000||
  minLandingTiles<1||minLandingTiles>1000||
  !(selectedDeepProposals===null||
   (Array.isArray(selectedDeepProposals)&&
    selectedDeepProposals.length===3))||
  !(sourceAuditedCityAccessRoute===null||
   (sourceAuditedCityAccessRoute?.ok===true&&
    Array.isArray(sourceAuditedCityAccessRoute.segments))))
  throw TypeError('Invalid detached gallery-easement district input');
 if((selectedDeepProposals===null)!==
    (sourceAuditedCityAccessRoute===null))
  throw TypeError('Four-hub deep stairs and city access must be supplied together');
 const plan=planUnderworldRegion(seed,rx,rz),city=plan.cityCandidate;
 if(!city)return Object.freeze({sitePresent:false,seed,rx,rz,
  sourceTerrainNotQueried:true,worldChanged:false});
 const floorY=city.y-8,landing=Object.freeze({
  x:city.x+20,y:floorY+1,z:city.z+20
 });
 const main=compileMainGalleryPedestrianClearance(seed,rx,rz);
 if(!main.ok)return fail(seed,rx,rz,'MAIN_GALLERY_INDEX_UNSAFE',{
  mainRefusal:main.reason});
 let selected=null,topology=null;
 if(selectedDeepProposals!==null){
  topology=auditSelectedInterlevelTopology(
   seed,rx,rz,selectedDeepProposals);
  if(!topology.ok)return fail(seed,rx,rz,
   'DISTRICT_FOUR_HUB_TOPOLOGY_UNSAFE',{topologyReason:topology.reason});
  selected=compileSelectedStairPedestrianClearance([
   ...selectedDeepProposals,sourceAuditedCityAccessRoute
  ]);
  if(!selected.ok)return fail(seed,rx,rz,
   'DISTRICT_SELECTED_ROUTES_MUTUALLY_UNSAFE',{
    routeReason:selected.reason});
  for(const proposal of [...selectedDeepProposals,
   sourceAuditedCityAccessRoute]){
   const fit=main.inspect(proposal);
   if(!fit.ok)return fail(seed,rx,rz,
    'DISTRICT_SELECTED_ROUTE_BLOCKS_MAIN_GALLERY',{
     routeReason:fit.reason});
  }
 }
 const within=(x,z)=>{
  const nx=(x-city.x)/(city.rx*.55),nz=(z-city.z)/(city.rz*.55);
  return nx*nx+nz*nz<=1;
 };
 const minI=Math.floor((city.x-city.rx*.55-landing.x)/3)-1,
  maxI=Math.ceil((city.x+city.rx*.55-landing.x)/3)+1,
  minJ=Math.floor((city.z-city.rz*.55-landing.z)/3)-1,
  maxJ=Math.ceil((city.z+city.rz*.55-landing.z)/3)+1;
 // Every safe tile is exactly 3x3 horizontal cells. The additional margin
 // is only a protected no-build easement, never counted as placed flooring.
 // All 15 support/headroom heights are checked, for all four route types.
 const valid=new Map(),refusals={
  envelope:0,worldBounds:0,mainGallery:0,selectedRoute:0
 };
 let examinedTiles=0;
 for(let i=minI;i<=maxI;i++)for(let j=minJ;j<=maxJ;j++){
  const x=landing.x+i*3,z=landing.z+j*3;
  examinedTiles++;
  let reason=null;
  check:for(let dx=-1-marginCells;dx<=1+marginCells;dx++)
   for(let dz=-1-marginCells;dz<=1+marginCells;dz++){
    const cx=x+dx,cz=z+dz;
    if(!within(cx,cz)){reason='envelope';break check}
    for(let y=floorY-5;y<=floorY+9;y++){
     if(y< -210||y>19){reason='worldBounds';break check}
     const role=y<=floorY?'support':'clearance';
     if(main.inspectCell(cx,y,cz,role)){
      reason='mainGallery';break check;
     }
     if(selected?.inspectCell(cx,y,cz,role)){
      reason='selectedRoute';break check;
     }
    }
   }
  if(reason)refusals[reason]++;
  else valid.set(KEY(i,j),Object.freeze({i,j,x,z}));
 }
 if(!valid.has('0,0'))return fail(seed,rx,rz,
  'HISTORICAL_LANDING_THREE_WIDE_BLOCKED',{
   examinedTiles,eligibleTiles:valid.size,
   rejectedTiles:Object.freeze(refusals),sourceTerrainNotQueried:true
  });
 // 4-connected tile centers (step THREE). This is stronger than a
 // single-voxel path: each accepted connection shares a full 3-cell face.
 const queue=['0,0'],visited=new Set(),centers=[];
 for(let at=0;at<queue.length;at++){
  const id=queue[at];
  if(visited.has(id))continue;
  visited.add(id);
  const t=valid.get(id);
  if(!t)throw Error('Disconnected tile enqueued');
  centers.push(t);
  for(const [di,dj] of OFFSETS){
   const next=KEY(t.i+di,t.j+dj);
   if(valid.has(next)&&!visited.has(next))queue.push(next);
  }
 }
 const columns=centers.length*9,needed=columns*15;
 if(centers.length<minLandingTiles)return fail(seed,rx,rz,
  'LANDING_DISTRICT_TOO_SMALL',{
   centerTileCount:centers.length,columns,sourceTerrainNotQueried:true
  });
 // Any full component over the allowed original query budget is refused,
 // never silently truncated to a superficially connected subsection.
 if(columns>maxDistrictColumns)return fail(seed,rx,rz,
  'DISTRICT_SOURCE_PREFLIGHT_BUDGET',{
   centerTileCount:centers.length,columns,requiredSourceChecks:needed,
   maxDistrictColumns,sourceTerrainNotQueried:true
  });
 return Object.freeze({ok:true,seed,rx,rz,sitePresent:true,
  kind:'three-wide-landing-side-gallery-easement-district',
  landing,cityCenter:Object.freeze({x:city.x,z:city.z}),
  floorY,marginCells,examinedTiles,eligibleTiles:valid.size,
  disconnectedTileCount:valid.size-centers.length,
  centerTileCount:centers.length,columns,requiredSourceChecks:needed,
  threeWideTileConnectivityVerified:true,
  threeWideLandingFootprintPreserved:true,
  tileConnectionMode:'4_CONNECTED_SHARED_3_CELL_FACE',
  geometryClearanceComparedToAll16MainGalleries:true,
  selectedFourHubDeepLinksGeometryChecked:topology?.ok===true,
  selectedCityAccessGeometryChecked:selected?.ok===true,
  selectedStairRouteCount:selected?.routeCount??0,
  sourceSafeFourHubDeepLinksNotVerifiedByThisPlanner:true,
  rejectedTiles:Object.freeze(refusals),
  tileCenters:Object.freeze(centers),
  fullOriginalEllipseNotApproved:true,
  detachedCityCenterInSeparateGalleryDividedComponent:true,
  districtDoesNotReplaceHistoricalFullCityPad:true,
  playerWalkingVerified:false,actualTerrainExcavated:false,
  actualSettlementPlaced:false,sourceTerrainNotQueried:true,
  worldChanged:false});
}
// This stage is run ONLY after the original-M7 city source selector has
// furnished real 16,25,34 source-owned deep links and the checked access
// detour. Source ownership of the proof is authenticated by its native caller;
// do not substitute a synthesized proof and claim genuine M7.
export function auditSourceProtectedGalleryEasementDistrict(seed,rx,rz,{
 source,sourceOwnedDeepSelection,maxTotalSourceChecks=150000,
 marginCells=1,maxDistrictColumns=10000,minLandingTiles=80
}={}){
 if(!source||typeof source!=='object'||
  ROLES.some(role=>typeof source[role]!=='function')||
  !INT(maxTotalSourceChecks)||maxTotalSourceChecks<1000||
  maxTotalSourceChecks>150000)
  throw TypeError('Invalid original M7 district source audit');
 const deep=sourceOwnedDeepSelection;
 if(!deep||deep.ok!==true||deep.seed!==seed||deep.rx!==rx||
  deep.rz!==rz||deep.joined?.ok!==true||
  deep.joined.completeFourHubCandidateTopologyVerified!==true||
  deep.joined.completeDeepLinkSourceOwnershipVerified!==true||
  !Array.isArray(deep.deepProposals)||deep.deepProposals.length!==3||
  !INT(deep.sourceChecks)||deep.sourceChecks<1||
  deep.sourceChecks>maxTotalSourceChecks||
  deep.joined.sourceAuditedCityAccessRouteGeometry?.ok!==true)
  return fail(seed,rx,rz,'MISSING_SOURCE_OWNED_FOUR_HUB_CITY_APPROACH',{
   sourceChecks:deep?.sourceChecks??0,originalM7ReaderIdentityByCallerOnly:true
  });
 const proposed=planGalleryEasementCityDistrict(seed,rx,rz,{
  selectedDeepProposals:deep.deepProposals,
  sourceAuditedCityAccessRoute:
   deep.joined.sourceAuditedCityAccessRouteGeometry,
  marginCells,maxDistrictColumns,minLandingTiles
 });
 if(!proposed.ok)return Object.freeze({...proposed,
  sourceChecks:deep.sourceChecks,originalM7ReaderIdentityByCallerOnly:true});
 const available=maxTotalSourceChecks-deep.sourceChecks;
 if(proposed.requiredSourceChecks>available)return fail(seed,rx,rz,
  'DISTRICT_TOTAL_ORIGINAL_SOURCE_BUDGET',{
   sourceChecks:deep.sourceChecks,requiredSourceChecks:
    proposed.requiredSourceChecks,maxTotalSourceChecks,
   centerTileCount:proposed.centerTileCount
  });
 let floorSourceChecks=0,solidSupport=0,existingAir=0,excavation=0;
 const count={originalEdits:0,protectedLandmarks:0,authored:0,
  authoredAirSupport:0,oldNaturalAirSupport:0,oreOrUnsafe:0,
  inconsistentAuthoredAir:0};
 for(const center of proposed.tileCenters){
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
   for(let y=proposed.floorY-5;y<=proposed.floorY+9;y++){
    const x=center.x+dx,z=center.z+dz,
     kind=y<=proposed.floorY?'support':'clearance';
    floorSourceChecks++;
    let reason=null;
    if(sourceFlag(source.editedAt,'edit',x,y,z)){
     count.originalEdits++;reason='PLAYER_EDIT';
    }else{
     const authored=source.authoredAt(x,y,z);
     if(authored!==undefined&&(!INT(authored)||authored<0))
      throw TypeError('Invalid original M7 district authored material');
     if(authored!==undefined&&authored!==0){
      count.authored++;reason='AUTHORED_SOURCE';
     }else if(kind==='support'&&authored===0){
      count.authoredAirSupport++;reason='AUTHORED_AIR_SUPPORT';
     }else if(sourceFlag(source.protectedAt,'landmark',x,y,z)){
      count.protectedLandmarks++;reason='PROTECTED_LANDMARK';
     }else{
      const material=source.naturalAt(x,y,z);
      if(!INT(material)||material<0)
       throw TypeError('Invalid original M7 district material');
      if(!isCandidateGeologyMaterial(material)){
       count.oreOrUnsafe++;reason='UNSAFE_MATERIAL';
      }else if(authored===0&&material!==0){
       count.inconsistentAuthoredAir++;reason='AUTHORED_AIR_MISMATCH';
      }else if(kind==='support'){
       if(material===0){
        count.oldNaturalAirSupport++;reason='OLD_AIR_SUPPORT';
       }else solidSupport++;
      }else if(material===0)existingAir++;
      else excavation++;
     }
    }
    if(reason)return fail(seed,rx,rz,
     'DISTRICT_ORIGINAL_M7_SOURCE_REFUSAL',{
      sourceRefusal:reason,
      firstRejectedCell:Object.freeze({x,y,z,kind}),
      floorSourceChecks,
      sourceChecks:deep.sourceChecks+floorSourceChecks,
      originalFourHubSourceChecks:deep.sourceChecks,
      sourceRefusalCounts:Object.freeze({...count}),
      geometricDistrictColumns:proposed.columns,
      originalM7ReaderIdentityByCallerOnly:true
     });
   }
 }
 if(floorSourceChecks!==proposed.requiredSourceChecks)
  throw Error('Three-wide original district source visit census drifted');
 return Object.freeze({
  ok:true,seed,rx,rz,sitePresent:true,
  kind:proposed.kind,centerTileCount:proposed.centerTileCount,
  columns:proposed.columns,marginCells:proposed.marginCells,
  requiredSourceChecks:proposed.requiredSourceChecks,
  floorSourceChecks,sourceChecks:deep.sourceChecks+floorSourceChecks,
  originalFourHubSourceChecks:deep.sourceChecks,maxTotalSourceChecks,
  sourceRefusalCounts:Object.freeze(count),solidSupport,
  existingAir,excavation,
  threeWideTileConnectivityVerified:true,
  geometryClearanceComparedToAll16MainGalleries:true,
  threeDeepLinksAndCityAccessGeometryChecked:true,
  originalDeepLinkAndAccessSourceRightsProvidedByCaller:true,
  originalM7ReaderIdentityByCallerOnly:true,
  originalFullCityFloorStillRejected:true,
  detachedCityCenterConnectedToLanding:false,
  originalVoxelWorldUnmodified:true,
  actualPlayerWalkingUnverified:true,
  settlementActuallyPlaced:false,
  releaseApproved:false,worldChanged:false
 });
}
