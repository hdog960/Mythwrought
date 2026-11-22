// MYTHWROUGHT D22: SECONDARY original-source foundation-backed roof truss lane.
// Original protected D19 90 spans remain immutable. This produces a disjoint,
// bounded second tranche from genuine D19 clearance-0 source candidates.
// A roof PLAN is never a load-bearing certification, terrain placement or save.
import {planD19SourceProvenRoofTrusses} from './d19-original-supported-roof-truss-plan.mjs';
const key=a=>a.join(',');
const roles=new Set(['wall','partition','column']);
const columns=new Set(['foundation','floor','wall','beam','partition','column']);
function originalIndex(blueprint){
 if(!blueprint||blueprint.worldPlaced!==false||blueprint.integrated!==false||
    blueprint.creatorApproved!==false||!Array.isArray(blueprint.cells))
   throw Error('D22 secondary roof supports require unintegrated real original 4B source');
 const map=new Map();
 for(const c of blueprint.cells){
  if(!Array.isArray(c.at)||c.at.length!==3||!c.at.every(Number.isSafeInteger)||
     map.has(key(c.at)))throw Error('Duplicate or invalid source authored structural cell');
  map.set(key(c.at),c);
 }
 const at=(x,y,z)=>map.get(x+','+y+','+z);
 const wall=(p)=>{if(!Array.isArray(p)||p.length!==3||p[1]!==6||!roles.has(at(...p)?.role))return false;
  for(let y=6;y>=0;y--)if(!columns.has(at(p[0],y,p[2])?.role))return false;
  return true;
 };
 return {map,at,wall};
}
export function planD22SecondaryOriginalRoofTrusses(blueprint,{
 existing=null,maxNewSpans=12,maxNewBeamCells=72
}={}){
 if(!Number.isSafeInteger(maxNewSpans)||maxNewSpans<1||maxNewSpans>12||
    !Number.isSafeInteger(maxNewBeamCells)||maxNewBeamCells<4||maxNewBeamCells>72)
   throw RangeError('Secondary original truss bounded candidate budget invalid');
 const {map,at,wall}=originalIndex(blueprint);
 const base=existing??planD19SourceProvenRoofTrusses(blueprint);
 if(!base||base.blueprintId!==blueprint.id||base.verifiedSourceBearingToFoundation!==true||
    base.noExistingVoxelOverwrites!==true||
    !Array.isArray(base.proposedBeamCells)||!Array.isArray(base.proposedTrussSpans))
   throw Error('D22 secondary lane requires exact original foundation-certified D19 source');
 const baseline=new Set();
 for(const p of base.proposedBeamCells){
  if(!Array.isArray(p.at)||map.has(key(p.at))||baseline.has(key(p.at))||
    at(p.at[0],7,p.at[2])?.feature!=='weather-plane'||p.at[1]!==6)
   throw Error('Existing original D19 primary roof cell provenance invalid');
  baseline.add(key(p.at));
 }
 const dense=planD19SourceProvenRoofTrusses(blueprint,{
   maxSpans:12,maxBeamCells:72,maxSpan:12,clearance:0
 });
 const unique=new Set(),spans=[],cells=[];let veto=0,foundationValidated=0;
 for(const span of dense.proposedTrussSpans){
  if(spans.length>=maxNewSpans)break;
  if(cells.length+span.spanCells>maxNewBeamCells)continue;
  if(!wall(span.bearingStart)||!wall(span.bearingEnd)||
     !Array.isArray(span.points)||span.points.length!==span.spanCells||
     span.orientation!==(span.axis==='x'?'north':'east'))
   throw Error('Original alternate roof candidate lacks authentic foundation-bearing source path');
  let conflict=false;
  for(const p of span.points){
   if(!Array.isArray(p)||p.length!==3||p[1]!==6||!p.every(Number.isSafeInteger)||
      map.has(key(p))||at(p[0],7,p[2])?.role!=='roof'||
      at(p[0],7,p[2])?.feature!=='weather-plane')
     throw Error('Alternate roof span overwrites source or has no original weather-plane above');
   if(unique.has(key(p))||baseline.has(key(p)))conflict=true;
  }
  if(conflict){veto++;continue;}
  const id=spans.length;
  const pos=Object.freeze(span.points.map(p=>Object.freeze([...p])));
  spans.push(Object.freeze({spanId:id,axis:span.axis,orientation:span.orientation,
   spanCells:pos.length,bearingStart:Object.freeze([...span.bearingStart]),
   bearingEnd:Object.freeze([...span.bearingEnd]),points:pos,
   bothBearingsReachUnbrokenOriginalFoundation:true,
   originalRoofAboveEveryProposedCell:true,originalSourceCellsUnmodified:true,
   sourceFromDenseD19ClearanceZero:true,
   jointContinuityNeedsOriginalPhysicalReview:true,originalRoofLoadAcceptance:false}));
  for(const p of pos){
   unique.add(key(p));
   cells.push(Object.freeze({at:p,spanId:id,asset:'pack2:015',candidateId:61,
    sourcePack:2,axis:span.axis,orientation:span.orientation,
    originalSourceUnchanged:true,worldPlaced:false}));
  }
  foundationValidated++;
 }
 if(!spans.length)throw Error('No disjoint authentic original secondary truss cells');
 return Object.freeze({
  format:'mythwrought.builder-d.d22.original-secondary-foundation-anchored-trusses.v1',
  blueprintId:blueprint.id,sourceCellCount:blueprint.cells.length,
  originalPrimaryTrussSpansUnmodified:base.proposedTrussSpans.length,
  originalPrimaryBeamCellsUnmodified:base.proposedBeamCells.length,
  originalDenseSpansExamined:dense.proposedTrussSpans.length,
  rejectedOverlapsWithPrimaryOrSecondary:veto,
  genuinelyVerifiedNewFoundationSpans:foundationValidated,
  proposedTrussSpans:Object.freeze(spans),proposedBeamCells:Object.freeze(cells),
  proposedSpanCount:spans.length,proposedBeamCount:cells.length,
  originalMaterialRef:'pack2:015',originalMaterialNumericId:61,
  allOriginalSourceRoofCellsAbove:true,
  verifiedSourceBearingToFoundation:true,noExistingVoxelOverwrites:true,
  originalPrimaryAndNewBeamCellsDisjoint:true,
  originalWorldCellsUnchanged:true,originalSaveUntouched:true,
  phase2GeometryOnly:true,originalRoofPhysicalMaterialContactUnaccepted:true,
  exactOriginalPlayerCollisionUnaccepted:true,fullRoofLoadAccepted:false,
  originalGameWebGL2Unaccepted:true,iPhonePwaUnaccepted:true,
  creatorApproved:false,worldPlaced:false
 });
}
// Source-plane adjacency is NOT structural proof: this measures distance from
// Y7 authored roof cells to original full-foundation wall columns and optionally
// D21 source-contact candidates. No inferred support/load certification.
export function auditD22OriginalRoofPlaneReach(blueprint,primary,secondary=null,{
 radius=8
}={}){
 if(!Number.isSafeInteger(radius)||radius<1||radius>16)
   throw RangeError('Source-only roof proximity radius must be bounded');
 const {map,at,wall}=originalIndex(blueprint);
 if(!primary||primary.blueprintId!==blueprint.id||!Array.isArray(primary.proposedTrussSpans)||
    primary.verifiedSourceBearingToFoundation!==true)
   throw Error('Original source primary truss provenance missing');
 if(secondary&&(secondary.blueprintId!==blueprint.id||
    secondary.verifiedSourceBearingToFoundation!==true||
    secondary.originalPrimaryAndNewBeamCellsDisjoint!==true))
   throw Error('Original secondary truss provenance missing');
 const roof=new Set(blueprint.cells.filter(x=>x.at[1]===7&&
   x.role==='roof'&&x.feature==='weather-plane').map(x=>x.at[0]+','+x.at[2]));
 if(roof.size<100)throw Error('Original authored roof plane census invalid');
 const anchors=new Set();
 for(const c of blueprint.cells)if(c.at[1]===6&&wall(c.at)&&roof.has(c.at[0]+','+c.at[2]))
  anchors.add(c.at[0]+','+c.at[2]);
 const directSourceFootings=anchors.size;
 const append=(p)=>{for(const s of p.proposedTrussSpans){
   if(!s.bothBearingsReachUnbrokenOriginalFoundation||!wall(s.bearingStart)||!wall(s.bearingEnd)||
      !Array.isArray(s.points)||s.points.length!==s.spanCells)
    throw Error('Original roof proximity cannot count unauthenticated foundation paths');
   const mid=s.points[Math.floor(s.points.length/2)];
   if(mid[1]!==6||map.has(key(mid))||!roof.has(mid[0]+','+mid[2]))
    throw Error('Original roof proximity cannot count unsupported center roof cell');
   anchors.add(mid[0]+','+mid[2]);
 }};
 append(primary);if(secondary)append(secondary);
 const queue=[...anchors],dist=new Map(queue.map(k=>[k,0]));
 for(let i=0;i<queue.length;i++){
  const k=queue[i],d=dist.get(k);if(d===undefined)throw Error('invalid bounded source distance');
  const [x,z]=k.split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const next=(x+dx)+','+(z+dz);
   if(!roof.has(next)||dist.has(next))continue;
   dist.set(next,d+1);queue.push(next);
  }
 }
 const sample=[...dist.values()],near=sample.filter(x=>x<=radius).length,
 far=sample.filter(x=>x>radius).length,unreachable=roof.size-dist.size,
 farthest=sample.length?Math.max(...sample):null;
 return Object.freeze({format:'mythwrought.builder-d.d22.original-roof-plane-distance-v1',
  blueprintId:blueprint.id,authoredPlaneCellCount:roof.size,
  directFullFoundationWallRoofCells:directSourceFootings,
  countedSourceAnchorCoordinates:anchors.size,
  proximityRadius:radius,cellsWithinRadius:near,
  cellsBeyondRadius:far,sourcePlaneCellsUnreachable:unreachable,
  farthestSourceHorizontalSteps:farthest,
  allOriginalWeatherPlaneBodiesPreserved:true,
  roofPlaneAdjacencyNotStructuralLoadProof:true,
  originalFullRoofLoadAcceptance:false,
  combinedWorldStructureAccepted:false,worldPlaced:false});
}
