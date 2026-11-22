// D30 no-import, fail-closed geometric corridor admission.
// Every elevation is an UNRATED theoretical centerline.
const KEY=(x,y,z)=>`${x},${y},${z}`;
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const bearing=new Set(['wall','partition','column']);
const stable=new Set(['foundation','floor','wall','partition','column','beam']);
function rooted(get,x,z){
 if(!bearing.has(get(x,6,z)?.role)||!bearing.has(get(x,5,z)?.role))return false;
 if(get(x,0,z)?.role!=='foundation'||get(x,1,z)?.role!=='floor')return false;
 for(let y=0;y<=6;y++)if(!stable.has(get(x,y,z)?.role))return false;
 return true;
}
/**
 * A conservative *zero-thickness centerline corridor screen*, NOT player fit.
 * Never tries to force a truss through Y7 wood or through an original Y5/Y6
 * source cell. Actual member envelopes and load-rated attachment are UNKNOWN.
 */
export function inspectD30OriginalUnderslungCorridor(source,row){
 if(!source||typeof source.get!=='function'||!(source.nav instanceof Set)||
    !row||!point(row.sourceOriginalStartBearing)||!point(row.sourceOriginalEndBearing)||
    !Number.isSafeInteger(row.spanCells)||row.spanCells<13||row.spanCells>48||
    !['x','z'].includes(row.clearance?.axis)||
    row.clearance.realRootedOriginalEndpoints!==2||
    row.clearance.constructionAllowed!==false||
    row.unratedScreen?.structuralReleaseAccepted!==false||
    row.unratedScreen?.constructionAllowed!==false||
    row.loadPathDraftOnly!==true||row.longBayPhysicalLoadAcceptance!==false)
  throw Error('D30 requires real unapproved D29 source long-bay and geometry provenance');
 const [sx,sy,sz]=row.sourceOriginalStartBearing,
       [ex,ey,ez]=row.sourceOriginalEndBearing,
       dx=row.clearance.axis==='x'?1:0,dz=row.clearance.axis==='z'?1:0,
       N=row.spanCells,get=source.get;
 if(sy!==6||ey!==6||ex!==sx+(N+1)*dx||ez!==sz+(N+1)*dz||
    !rooted(get,sx,sz)||!rooted(get,ex,ez))
  throw Error('D30 original bottom and top chord anchors lack rooted Y5/Y6 wall contacts');
 let y5Occupied=0,walkAbove=0,fullWalk=0;
 const blocked=[],navCells=[];
 for(let i=0;i<=N+1;i++){
  const x=sx+i*dx,z=sz+i*dz;
  const roof=get(x,7,z);
  if(roof?.role!=='roof'||roof.feature!=='weather-plane'||roof.asset!=='live:wood')
   throw Error('D30 original source Y7 wood roof missing or overwritten');
  if(i>0&&i<=N){
   if(get(x,6,z))throw Error('D30 original upper chord overlaps authored Y6 voxel');
   if(get(x,5,z)){
    y5Occupied++;if(blocked.length<24)blocked.push(Object.freeze([x,5,z]));
   }
   if(source.nav.has(KEY(x,5,z))||source.nav.has(KEY(x,6,z)))walkAbove++;
   const fullyClear=[2,3,4,5].every(y=>!get(x,y,z));
   const hasWalk=source.nav.has(KEY(x,2,z));
   if(fullyClear&&!hasWalk)throw Error('D30 original corridor lost its walk node');
   if(!fullyClear&&hasWalk)throw Error('D30 would overlay an occupied author WALK source column');
   if(hasWalk){fullWalk++;if(navCells.length<16)navCells.push(Object.freeze([x,2,z]));}
  }
 }
 if(walkAbove)throw Error('D30 original Y5/Y6 upper walking route would be blocked');
 return Object.freeze({format:'mythwrought.builder-d.d30.original-under-roof-geometry-v1',
  axis:row.clearance.axis,interiorCells:N,sourceRootedWallEndpoints:2,
  originalY5InteriorObstructedCells:y5Occupied,
  originalY6InteriorObstructedCells:0,
  authoredY2WalkColumnsPreserved:fullWalk,
  originalY5Y6OverheadWalkConflicts:walkAbove,
  firstOriginalY5Obstructions:Object.freeze(blocked),
  sampledOriginalY2Walk:Object.freeze(navCells),
  originalY7FullCubeWoodUnchanged:true,originalY8Y9SourceTiersUnchanged:true,
  theoreticalCenterlineYRange:Object.freeze([5.5,6.5]),
  minimumSourceVerticalGapFromY2WalkPlane:3,
  exactOriginalY5Y6CourseFree:y5Occupied===0,
  actualPhysicalEnvelopeClearanceCertified:false,
  realPhysicalDiagonalPackOwnerAvailable:false,
  originalPlayerAndNPCBodyCollisionCertified:false,
  roofBearingMomentOrUpliftCapacityCertified:false,
  noProposedWorldVoxelCells:true,canPlaceTruss:false});
}
