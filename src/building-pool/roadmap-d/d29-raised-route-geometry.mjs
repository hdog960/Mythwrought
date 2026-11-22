// MYTHWROUGHT D29 isolated read-only route validation; no original repo imports.
const KEY=(x,y,z)=>`${x},${y},${z}`;
const P=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const vertical=new Set(['foundation','floor','wall','column','partition','beam']);
const bearing=new Set(['wall','column','partition']);
const directions=Object.freeze([[1,0],[-1,0],[0,1],[0,-1]]);
export function indexD29OriginalRoof(blueprint){
 if(!blueprint||blueprint.integrated!==false||blueprint.worldPlaced!==false||
  blueprint.creatorApproved!==false||!Array.isArray(blueprint.cells)||
  !Array.isArray(blueprint.navigation))
  throw Error('D29 must use an unplaced, non-approved original blueprint');
 const cells=new Map(),nav=new Set(),floorXZ=new Set();
 for(const c of blueprint.cells){
  if(!P(c.at)||cells.has(KEY(...c.at)))throw Error('D29 duplicate/invalid real source voxel');
  cells.set(KEY(...c.at),c);
  if(c.at[1]===0&&c.role==='foundation')floorXZ.add(c.at[0]+','+c.at[2]);
 }
 for(const n of blueprint.navigation){
  if(!P(n.at)||n.mode!=='walk'||nav.has(KEY(...n.at)))throw Error('D29 duplicate/invalid original WALK node');
  nav.add(KEY(...n.at));
 }
 return {cells,nav,floorXZ,get:(x,y,z)=>cells.get(KEY(x,y,z))};
}
function grounded(get,[x,y,z]){
 if(y!==6||!bearing.has(get(x,6,z)?.role))return false;
 for(let h=0;h<=6;h++){
  const c=get(x,h,z);if(!c||!vertical.has(c.role))return false;
 }
 return get(x,0,z)?.role==='foundation'&&get(x,1,z)?.role==='floor';
}
/** Check one D28-listed original geometry route without modifying world cells. */
export function inspectD29OriginalRaisedRoute(source,span){
 const {get,nav,floorXZ}=source;
 if(typeof get!=='function'||!(nav instanceof Set)||!(floorXZ instanceof Set)||
  !span||!P(span.originalStartBearing)||!P(span.originalEndBearing)||
  !Number.isSafeInteger(span.Y6UnoccupiedOriginalColumns)||
  span.Y6UnoccupiedOriginalColumns<13||span.Y6UnoccupiedOriginalColumns>48||
  !['x','z'].includes(span.axis)||span.constructionApproved!==false||
  span.ratedLongSpan!==false)
  throw Error('D29 accepts only bounded, unapproved actual D28 original source route');
 const [sx,sy,sz]=span.originalStartBearing,[ex,ey,ez]=span.originalEndBearing,
  dx=span.axis==='x'?1:0,dz=span.axis==='z'?1:0,
  count=span.Y6UnoccupiedOriginalColumns;
 if(sy!==6||ey!==6||ex!==sx+(count+1)*dx||ez!==sz+(count+1)*dz||
  !grounded(get,span.originalStartBearing)||!grounded(get,span.originalEndBearing))
  throw Error('D29 actual long-bay endpoints lack exact Y0–Y6 rooted bearing or orientation');
 let originalY8=0,originalY9=0,eitherOriginal=0,
  blockedOverheadWalk=0,overheadY8=0,overheadY9=0;
 const corridor=[];
 for(let i=0;i<=count+1;i++){
  const x=sx+i*dx,z=sz+i*dz,at=[x,6,z];
  if(get(x,7,z)?.asset!=='live:wood'||get(x,7,z)?.role!=='roof'||
    get(x,7,z)?.feature!=='weather-plane')
   throw Error('D29 source Y7 live:wood roof underlay replaced');
  if(i>0&&i<=count){
   if(get(x,6,z))throw Error('D29 original Y6 AIR long bay has structural overlap');
   // The four courses separating Y2 walk from Y6 remain source-empty.
   const clearY2toY5=[2,3,4,5].every(y=>!get(x,y,z));
   if(clearY2toY5&&!nav.has(KEY(x,2,z)))
    throw Error('D29 missing original Y2 WALK for overhead bay');
   // A pre-existing interior partition/wall below Y6 is not a free WALK column
   // and must not be silently reinterpreted as one. Nothing below is edited.
   if(!clearY2toY5&&nav.has(KEY(x,2,z)))
    throw Error('D29 original Y2 WALK overlaps physically occupied interior');
   const a=Boolean(get(x,8,z)),b=Boolean(get(x,9,z));
   if(a)originalY8++;if(b)originalY9++;if(a||b)eitherOriginal++;
  }
  const nav8=nav.has(KEY(x,8,z)),nav9=nav.has(KEY(x,9,z));
  if(nav8||nav9)blockedOverheadWalk++;
  if(get(x,8,z)||nav8)overheadY8++;
  if(get(x,9,z)||nav9)overheadY9++;
  corridor.push(Object.freeze(at));
 }
 if(eitherOriginal!==span.originalRoofY8OrY9OccupiedColumns)
  throw Error('D29 original D28 Y8/Y9 upper-tier obstruction evidence changed');
 const footingSites=[];
 for(const end of [span.originalStartBearing,span.originalEndBearing]){
  const [x,,z]=end,sites=[];
  for(const [exteriorDx,exteriorDz] of directions){
   const ax=x+exteriorDx,az=z+exteriorDz,key=ax+','+az;
   if(floorXZ.has(key))continue; // not outside the authored foundation footprint
   // Any existing original cell at this coordinate prevents a clear extension.
   if(Array.from({length:10},(_,y)=>Boolean(get(ax,y,az))).some(Boolean))continue;
   sites.push(Object.freeze([ax,az]));
  }
  footingSites.push(Object.freeze(sites));
 }
 const mid=corridor[Math.floor(corridor.length/2)];
 if(!P(span.sourceMidpoint)||
    (Math.abs(mid[0]-span.sourceMidpoint[0])+Math.abs(mid[2]-span.sourceMidpoint[2])>1))
  throw Error('D29 original midpoint does not belong to claimed long-bay corridor');
 return Object.freeze({spanCells:count,axis:span.axis,
  realRootedOriginalEndpoints:2,originalY8OccupiedInterior:originalY8,
  originalY9OccupiedInterior:originalY9,
  originalEitherY8OrY9OccupiedInterior:eitherOriginal,
  upperCourseY8BlockedIncludingEnds:overheadY8,
  upperCourseY9BlockedIncludingEnds:overheadY9,
  authoredOverheadWalkConflicts:blockedOverheadWalk,
  continuousVacantOriginalY8Route:overheadY8===0,
  continuousVacantOriginalY9Route:overheadY9===0,
  bothRaisedCoursesVacant:overheadY8===0&&overheadY9===0,
  entirelySourceVacantOutsideFoundationSites:Object.freeze(footingSites),
  exteriorSiteIsUnbuiltAndTerrainUnverified:true,
  originalRoofCannotBeCutOrReplaced:true,
  originalNavigationIsImmutable:true,
  noApprovedRoofTrussMaterialOrRatedJoint:true,
  roofTopMovementAndCollisionUnreviewed:true,
  noNewFootingOrWorldCellCreated:true,constructionAllowed:false});
}
