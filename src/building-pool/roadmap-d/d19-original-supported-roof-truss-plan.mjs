// MYTHWROUGHT D19 — original 4B source-proven short roof-support truss proposals.
// Source-only and preview-only: DOES NOT modify any original world/source voxel,
// save, settlement, runtime registry, physical Pack owner or production build.
// The original W16/W17 roof's full weather-plane span remains unapproved.
// Real proposed timber is Pack2 roster pack2:015 / ID61; physical source owner
// must be called separately by the eventual integrator for actual construction.
const str=x=>x.join(',');
const bearing=new Set(['wall','partition','column']);
// A wall is NOT a roof foundation bearing when a window interrupts its Y=3
// masonry below. Require real continuous original columns from Y=6 down to 0.
const verticalBearing=new Set(['foundation','floor','wall','beam','partition','column']);
const validAt=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
// Original Pack2 ID61 is X-axis in zero/north rotation; east/quarter-turn rotates it along Z.
const directions=Object.freeze([{dx:1,dz:0,axis:'x',orientation:'north'},
                                {dx:0,dz:1,axis:'z',orientation:'east'}]);
export function planD19SourceProvenRoofTrusses(blueprint,{maxSpans=12,maxBeamCells=72,maxSpan=12,clearance=2}={}){
 if(!blueprint||!Array.isArray(blueprint.cells)||blueprint.creatorApproved!==false||
    blueprint.worldPlaced!==false||blueprint.integrated!==false||
    !Array.isArray(blueprint.bounds)||blueprint.bounds[1]<=7)
   throw Error('D19 proposals require a complete, unintegrated original 4B source blueprint');
 for(const [n,min,max] of [[maxSpans,1,12],[maxBeamCells,3,72],[maxSpan,2,12],[clearance,0,3]])
   if(!Number.isSafeInteger(n)||n<min||n>max)throw RangeError('D19 candidate bounds/cost violation');
 const at=new Map(),weather=[];let unsupported=0;
 for(const c of blueprint.cells){
  if(!validAt(c.at)||at.has(str(c.at)))throw Error('D19 source has duplicate/out-of-range original voxel');
  at.set(str(c.at),c);
 }
 const get=(x,y,z)=>at.get(x+','+y+','+z);
 const bearingToFoundation=(x,z)=>{
  for(let y=6;y>=0;y--){
   const c=get(x,y,z);
   if(!c||!verticalBearing.has(c.role))return false;
  }
  return true;
 };
 for(const c of blueprint.cells){
  if(c.role!=='roof'||c.feature!=='weather-plane')continue;
  weather.push(c);
  const [x,y,z]=c.at,below=get(x,y-1,z);
  if(!below||!bearing.has(below.role))unsupported++;
 }
 if(weather.length<100||unsupported<10)throw Error('D19 source roof census unexpected; no synthetic trusses');
 const walls=blueprint.cells.filter(c=>c.at[1]===6&&bearing.has(c.role))
   .sort((a,b)=>a.at[2]-b.at[2]||a.at[0]-b.at[0]);
 const keyed=new Map();
 for(const wall of walls){
  const [x, ,z]=wall.at;
  if(!bearingToFoundation(x,z))continue;
  for(const {dx,dz,axis,orientation} of directions){
   const points=[];
   for(let n=1;n<=maxSpan+1;n++){
    const px=x+n*dx,pz=z+n*dz;
    const cell=get(px,6,pz);
    if(cell){
     if(bearing.has(cell.role)&&bearingToFoundation(px,pz)&&
        points.length>=2&&points.length<=maxSpan){
      // Original structural bearing at BOTH endpoints, clear intermediate y=6,
      // original same-coordinate non-sky roof over every proposed beam.
      const token=points.map(str).join('|');
      keyed.set(token,{axis,orientation,start:wall.at,end:cell.at,
        points,spanCells:points.length});
     }
     break;
    }
    const roof=get(px,7,pz);
    if(!roof||roof.role!=='roof'||roof.feature!=='weather-plane')break;
    points.push([px,6,pz]);
   }
  }
 }
 const sorted=[...keyed.values()].sort((a,b)=>a.spanCells-b.spanCells||
   a.start[2]-b.start[2]||a.start[0]-b.start[0]||a.axis.localeCompare(b.axis));
 const barred=new Set(),spans=[],beams=[];
 for(const cand of sorted){
  if(spans.length>=maxSpans)break;
  if(beams.length+cand.spanCells>maxBeamCells)continue;
  if(cand.points.some(p=>barred.has(str(p))))continue;
  const copies=cand.points.map(p=>Object.freeze([...p]));
  const spanId=spans.length;
  spans.push(Object.freeze({spanId,axis:cand.axis,orientation:cand.orientation,
    spanCells:cand.spanCells,bearingStart:Object.freeze([...cand.start]),
    bearingEnd:Object.freeze([...cand.end]),sourceClearanceHeight:6,
    points:Object.freeze(copies),authoredRoofAboveEveryCell:true,
    bothBearingsReachUnbrokenOriginalFoundation:true,
    jointContinuityNeedsOriginalPhysicalReview:true,
    originalRoofLoadAcceptance:false}));
  for(const p of copies){
   const sourceCell=get(...p);if(sourceCell)throw Error('D19 would overlap original source voxel');
   const roof=get(p[0],7,p[2]);
   if(!roof||roof.role!=='roof'||roof.feature!=='weather-plane')
      throw Error('D19 has no source roof directly above proposed beam');
   beams.push(Object.freeze({at:p,kind:'proposed-original-source-support',
    role:'roof-cross-beam',asset:'pack2:015',candidateId:61,orientation:cand.orientation,
    sourcePack:2,spanId,worldPlaced:false,creatorApproved:false,
    originalSourceCellUnchanged:true,physicalMeshAcceptance:false}));
   for(let dx=-clearance;dx<=clearance;dx++)for(let dz=-clearance;dz<=clearance;dz++)
     barred.add([p[0]+dx,p[1],p[2]+dz].join(','));
  }
 }
 if(!spans.length||!beams.length)throw Error('No actually borne original short roof span exists');
 const openings=blueprint.openings.filter(o=>o.kind==='window');
 const facade=[];
 for(const o of openings){
  if(!validAt(o.at)||!['north','south','east','west'].includes(o.facing))
    throw Error('Original source missing window facade provenance');
  const [x,y,z]=o.at;
  const ab=(o.facing==='north'||o.facing==='south')?[[x-1,y,z],[x+1,y,z]]:
    [[x,y,z-1],[x,y,z+1]];
  const jambs=ab.filter(v=>bearing.has(get(...v)?.role)).length;
  facade.push(Object.freeze({at:Object.freeze([...o.at]),facing:o.facing,
    sourceJambs:jambs,requiresPhysicalSurroundReview:jambs<2,
    noJambs:jambs===0,originalGlazingSourceIntact:true}));
 }
 const jambCount=Object.freeze({both:facade.filter(x=>x.sourceJambs===2).length,
  one:facade.filter(x=>x.sourceJambs===1).length,
  none:facade.filter(x=>x.sourceJambs===0).length});
 return Object.freeze({
  format:'mythwrought.builder-d.d19.source-verified-proposed-roof-crossbeams.v1',
  blueprintId:blueprint.id,sourceCellCount:blueprint.cells.length,
  unchangedOriginalWeatherPlaneCells:weather.length,
  originalWeatherPlaneCellsWithoutVerticalBearing:unsupported,
  originalWindowJambCensus:jambCount,
  physicalWindowFrameReviewCandidates:Object.freeze(facade.filter(x=>x.sourceJambs<2)),
  originalWindowSourceCount:facade.length,
  proposedTrussSpans:Object.freeze(spans),proposedBeamCells:Object.freeze(beams),
  proposedBeamCount:beams.length,proposedSpanCount:spans.length,
  allSupportEndpointsOriginalPhysicalStructure:true,
  verifiedSourceBearingToFoundation:true,
  noExistingVoxelOverwrites:true,originalGeometryUnmodified:true,
  renderedPhysicalPack2MeshAccepted:false,
  fullRoofStructuralAcceptance:false,allWindowSurroundsAccepted:false,
  iPhonePerformanceAccepted:false,saveWritten:false,worldPlaced:false,
  gameplayIntegrated:false,creatorApproved:false
 });
}
