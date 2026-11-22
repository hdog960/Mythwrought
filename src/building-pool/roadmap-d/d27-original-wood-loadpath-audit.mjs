// MYTHWROUGHT D27: authentic original-source roof beam -> composite post ->
// full-cube live:wood interface. No world, save, renderer, or block registration.
import {pack2Shape,pack2Asset} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf,pack2RayHit,pack2BodyIntersects} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {FULL_CUBE,raycastShapes,validateShape} from '../../voxel-shape-interactions.mjs';
import {inspectBodyFit} from '../../voxel-shape-fit.mjs';
import {auditD26OriginalWoodRoofJoints} from './d26-livewood-roof-joint-contact.mjs';
import {composeD27Pack2WoodFace} from './d27-source-shape-composite.mjs';
const key=p=>p.join(',');
const at=(x,y,z)=>`${x},${y},${z}`;
const isPoint=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const V=new Set(['foundation','floor','wall','column','partition','beam']);
const B=new Set(['wall','column','partition']);
function originalIndex(building){
  const cells=new Map(),nav=new Set();
  for(const c of building.cells){
    if(!isPoint(c.at)||cells.has(key(c.at)))throw Error('D27 invalid or duplicated original cell');
    cells.set(key(c.at),c);
  }
  for(const n of building.navigation){
    if(!isPoint(n.at)||n.mode!=='walk'||nav.has(key(n.at)))throw Error('D27 duplicate original navigation');
    nav.add(key(n.at));
  }
  const get=(x,y,z)=>cells.get(at(x,y,z));
  const sourceWall=p=>isPoint(p)&&p[1]===6&&B.has(get(...p)?.role)&&
    ['live:stone','live:wood'].includes(get(...p)?.asset)&&
    Array.from({length:7},(_,y)=>V.has(get(p[0],y,p[2])?.role)).every(Boolean)&&
    get(p[0],0,p[2])?.role==='foundation'&&get(p[0],1,p[2])?.role==='floor';
  return {cells,get,nav,sourceWall};
}
function originalComposite(axis){
  const rot=axis==='x'?0:axis==='z'?1:null;
  if(rot===null||BLOCK.WOOD!==4||pack2Asset(61)?.roster!==15||pack2Asset(62)?.roster!==22)
    throw Error('D27 original Pack2/WOOD owner is unavailable');
  const beam=pack2Shape(61,rot).boxes,post=pack2Shape(62,0).boxes;
  if(JSON.stringify(beam)!==JSON.stringify(pack2ShapeOf(61,{rotation:rot}).boxes)||
     JSON.stringify(post)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
    throw Error('D27 Pack2 physical owner/renderer adapter drift');
  const composite=composeD27Pack2WoodFace(beam,post,axis,FULL_CUBE.boxes);
  if(!validateShape(composite)||composite.colliderBoxCount!==7||
     Math.abs(composite.roofFaceArea-.2116)>1e-8)
    throw Error('D27 original geometry missing exact full-cube wood contact');
  return composite;
}
// Works on original game collision AABB and source ray utility; this overlay is
// demonstrably NOT a registered gameplay block and never replaces Pack2 ID61.
export function d27PreviewSourceCollider(axis){return originalComposite(axis);}
export function d27PreviewColliderRay(axis,eye,direction,cell=[0,6,0],limit=6){
  const shape=originalComposite(axis);
  if(!isPoint(cell)||cell[1]!==6)throw TypeError('D27 ray requires Y6 source cell');
  return raycastShapes(eye,direction,(x,y,z)=>at(x,y,z)===key(cell)?shape:null,limit);
}
export function auditD27OriginalWoodLoadPaths(building,primary,secondary,d25,{sampleLimit=12}={}){
  if(!Number.isSafeInteger(sampleLimit)||sampleLimit<0||sampleLimit>32)
    throw RangeError('D27 bounded ray/collision sample limit');
  const d26=auditD26OriginalWoodRoofJoints(building,primary,secondary,d25,{maxPreviewSites:0});
  const index=originalIndex(building),shapes={x:originalComposite('x'),z:originalComposite('z')};
  // A previously validated D25 report cannot authorize deleting a real walk
  // node from its mutable input; re-admit the exact original navigation census.
  const roof=new Set(building.cells.filter(c=>c.at[1]===7&&c.role==='roof'&&
    c.feature==='weather-plane').map(c=>c.at[0]+','+c.at[2]));
  const walkXZ=new Set([...index.nav].filter(k=>{
    const p=k.split(',').map(Number);return roof.has(p[0]+','+p[2]);
  }).map(k=>{const p=k.split(',').map(Number);return p[0]+','+p[2];}));
  if(walkXZ.size!==d25.originalNavigableRoofColumns)
    throw Error('D27 original navigation changed after D25 source approval');
  const candidates=[['D19',primary.proposedTrussSpans],['D22',secondary.proposedTrussSpans],
    ['D25',d25.thirdLaneProposedSpans]];
  const physical={x:0,z:0},verified= {D19:0,D22:0,D25:0};
  const chosen=[],used=new Set();
  for(const [lane,spans] of candidates)for(const s of spans){
    if(!['x','z'].includes(s.axis)||!index.sourceWall(s.bearingStart)||
       !index.sourceWall(s.bearingEnd)||!Array.isArray(s.points)||
       s.points.length!==s.spanCells||!s.points.length||s.points.length>12||
       s.bothBearingsReachUnbrokenOriginalFoundation!==true)
      throw Error('D27 authentic foundation-to-Y6 bearing path missing');
    const [dx,dz]=s.axis==='x'?[1,0]:[0,1],shape=shapes[s.axis];
    if(s.bearingEnd[0]!==s.bearingStart[0]+(s.points.length+1)*dx||
       s.bearingEnd[2]!==s.bearingStart[2]+(s.points.length+1)*dz)
      throw Error('D27 truss endpoint geometric continuity broken');
    const expected=(s.axis==='x'?'north':'east');
    const cells=lane==='D19'?primary.proposedBeamCells:lane==='D22'?
      secondary.proposedBeamCells:d25.thirdLaneProposedCells;
    for(let i=0;i<s.points.length;i++){
      const p=s.points[i],k=key(p),[x,y,z]=p;
      if(!isPoint(p)||y!==6||x!==s.bearingStart[0]+(i+1)*dx||
         z!==s.bearingStart[2]+(i+1)*dz||used.has(k)||index.cells.has(k)||
         index.get(x,7,z)?.asset!=='live:wood'||
         !cells.some(c=>key(c.at)===k&&c.asset==='pack2:015'&&c.orientation===expected))
        throw Error('D27 source beam collision, missing wood roof or interrupted truss');
      used.add(k);verified[lane]++;physical[s.axis]++;
      if(chosen.length<sampleLimit)chosen.push({cell:p,axis:s.axis,shape,lane});
    }
    if(shape.nearEndFaceArea<=0||shape.farEndFaceArea<=0||shape.roofFaceArea<=0)
      throw Error('D27 endpoint or WOOD roof-face has no physical contact');
  }
  if(verified.D19!==d26.originalBeamCells.D19||
     verified.D22!==d26.originalBeamCells.D22||
     verified.D25!==d26.originalBeamCells.D25||
     used.size!==d26.verifiedGeometricProposedSites)
    throw Error('D27 exact original D26 span and beam count changed');
  // Source collision versus a standing player's low-Y2 envelope: a preview,
  // not a claim about the actual live movement system or all camera poses.
  let rayChecks=0,baselineSelection=0,standingBodyConflicts=0;
  for(const {cell,axis,shape} of chosen){
    const [x,y,z]=cell,rot=axis==='x'?0:1;
    const original=pack2ShapeOf(61,{rotation:rot});
    const rayOrigin=[x+.5,y+.5,z-1],rayDirection=[0,0,1];
    // Existing Pack2 renderer/picking parity on its own original beam.
    const originalRay=pack2RayHit(61,{rotation:rot},rayOrigin,rayDirection,cell,5);
    const originalVoxelRay=raycastShapes(rayOrigin,rayDirection,
      (a,b,c)=>at(a,b,c)===key(cell)?original:null,5);
    if(Boolean(originalRay)!==Boolean(originalVoxelRay)||
       (originalRay&&Math.abs(originalRay.distance-originalVoxelRay.distance)>1e-7))
      throw Error('D27 baseline source-original Pack2 raycast parity failed');
    baselineSelection++;
    // New same-cell collider is derived from the exact original owner union;
    // inspectBodyFit and raycastShapes use the actual game shared box readers.
    const body=[x+.2,2,z+.2,x+.8,3.8,z+.8];
    if(!inspectBodyFit(body,(a,b,c)=>at(a,b,c)===key(cell)?shape:null).fits||
       pack2BodyIntersects(61,{rotation:rot},cell,
       {x:x+.5,z:z+.5,feet:2,height:1.8,radius:.3}))standingBodyConflicts++;
    const contactRay=raycastShapes([x+.5,7.5,z+.5],[0,-1,0],
      (a,b,c)=>at(a,b,c)===key(cell)?shape:null,3);
    const canonicalWoodRay=raycastShapes([x+.5,8.5,z+.5],[0,-1,0],
      (a,b,c)=>at(a,b,c)===at(x,7,z)?FULL_CUBE:null,3);
    if(!contactRay||!canonicalWoodRay||Math.abs(contactRay.distance-.5)>1e-7||
       Math.abs(canonicalWoodRay.distance-.5)>1e-7)
      throw Error('D27 source composite selection or canonical WOOD cube top-face missing');
    rayChecks++;
  }
  if(standingBodyConflicts)throw Error('D27 source composite invaded sampled walking envelope');
  const unresolved=d25.afterD25HypotheticalBeyondRadius;
  if(!Number.isSafeInteger(unresolved)||unresolved<0||unresolved>d25.originalRoofCells)
    throw Error('D27 unresolved long-bay roof census invalid');
  return Object.freeze({format:'mythwrought.builder-d.d27.read-only-contact-load-path-census.v1',
    blueprintId:building.id,sourceMaterial:'live:wood',runtimeWoodBlockId:BLOCK.WOOD,
    originalBeamCount:d26.verifiedGeometricProposedSites,originalSpanCount:
       primary.proposedTrussSpans.length+secondary.proposedTrussSpans.length+d25.thirdLaneProposedSpans.length,
    beamByAxis:Object.freeze(physical),beamByLane:Object.freeze(verified),
    originalPack2BoxOwnerVerified:true,realOriginalWallBearingAndEndpointContactsVerified:true,
    compositeColliderBoxes:shapes.x.colliderBoxCount,sourceRoofContactAreaPerConnector:shapes.x.roofFaceArea,
    sourceWallBeamEndContactAreaPerEnd:shapes.x.nearEndFaceArea,
    sampledOriginalRayParity:baselineSelection,sampledCompositeRayAndWoodParity:rayChecks,
    sampledBodyConflicts:standingBodyConflicts,
    remainingRoofBeyondProximity:unresolved,unresolvedLongBayZones:d25.unresolvedRoofZoneCount,
    noFullHeightPierInsertion:true,worldEdited:false,saveChanged:false,
    sourceOnlyCompositeShapeNotInstalled:true,
    originalBlueprintBindingNotRuntimeRegistered:true,
    gravityLoadStructuralCapacityUnknown:true,allRoofLoadsAccepted:false,
    gameplayPlayerAIPhysicsAndPickingNotAccepted:true,webgl2NotAccepted:true,
    installedIphonePwaNotAccepted:true,releaseApproved:false});
}
