// MYTHWROUGHT D50: UNREGISTERED, SOURCE-ONLY three-stage lateral bypass.
// Geometrical experiment only. Does not install/rate a fastener, footing or roof.
import {d47ConvexPositiveVolumeCollision as sat} from './d47-original-congruent-socket-saddle.mjs';
import {d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const EPS=1e-8;
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const v3=a=>Array.isArray(a)&&a.length===3&&a.every(finite);
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,k)=>a.map(x=>x*k);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(...a),unit=a=>{let k=len(a);if(k<EPS)throw Error('D50 zero-length convex axis');return mul(a,1/k)};
const center=a=>mul(a.reduce((s,p)=>add(s,p),[0,0,0]),1/a.length);
const area=a=>len(cross(sub(a[1],a[0]),sub(a[2],a[0])))/2;
const bounds=p=>({min:[0,1,2].map(i=>Math.min(...p.map(x=>x[i]))),max:[0,1,2].map(i=>Math.max(...p.map(x=>x[i])))});
const edges=[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[0,3],[1,4],[2,5]];
const trigs=[[0,2,1],[3,4,5],[0,1,4],[0,4,3],[1,2,5],[1,5,4],[2,0,3],[2,3,5]];
function prism(a,b,color,stage){
 const delta=sub(center(b),center(a)),n=unit(cross(sub(a[1],a[0]),sub(a[2],a[0])));
 if(Math.abs(dot(delta,n))<1e-7)throw Error('D50 unphysical flat tangential prism');
 const verts=[...a,...b],positions=[],colors=[],indices=[];
 for(const tri of trigs){const offset=positions.length/3;for(const i of tri){positions.push(...verts[i]);colors.push(...color)}indices.push(offset,offset+1,offset+2)}
 return Object.freeze({format:'mythwrought.d50.unregistered-convex-3stage-segment.v1',stage,
  vertices:verts,edges,faces:[{normal:n},{normal:mul(n,-1)},
   ...[[0,1],[1,2],[2,0]].map(([i,j])=>({normal:unit(cross(sub(a[j],a[i]),delta))}))],
  bounds:bounds(verts),delta,capArea:area(a),
  mesh:{positions:Float32Array.from(positions),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)},
  originalPack2PaletteOnly:true,registeredOwner:false,constructionAllowed:false});
}
function box(lo,hi){const v=[];for(const x of [lo[0],hi[0]])for(const y of [lo[1],hi[1]])for(const z of [lo[2],hi[2]])v.push([x,y,z]);
 return {vertices:v,edges:[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]],faces:[{normal:[1,0,0]},{normal:[0,1,0]},{normal:[0,0,1]}]};}
function obb(o){const v=[];for(const u of [-1,1])for(const w of [-1,1])for(const t of [-1,1]){
  let p=[...o.center];for(const [i,k] of [u,w,t].entries())p=add(p,mul(o.axes[i],o.half[i]*k));v.push(p)}
 return {...box([0,0,0],[1,1,1]),vertices:v,faces:o.axes.map(normal=>({normal}))};}
const paletteOK=p=>JSON.stringify(p?.metal)==='[0.29,0.32,0.33]'&&JSON.stringify(p?.base)==='[0.4,0.24,0.17]'&&JSON.stringify(p?.grain)==='[0.22,0.13,0.11]';
/** Upper supporting plane distance of the ACTUAL D45 swept first/second AABBs,
 * measured relative to D48 outer cap (not guessed dogleg center alone). */
export function inspectD50DoglegSlopedPlaneSeparation(patch,dog){
 if(patch?.format!=='mythwrought.d48.unregistered-slope-subface-patch.v1'||
    dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
    dog.fullPrismBounds?.length!==2||!v3(patch.faceNormal))throw TypeError('D50 exact D48 and D45 actual source geometry');
 const n=unit(patch.faceNormal),c=center(patch.vertices.slice(3,6));
 const extrema=dog.fullPrismBounds.map(b=>{
  let lo=0,hi=0;for(let i=0;i<3;i++){
   const a=b.min[i]-c[i],z=b.max[i]-c[i];lo+=Math.min(n[i]*a,n[i]*z);hi+=Math.max(n[i]*a,n[i]*z);
  }return {minSignedDistance:lo,maxSignedDistance:hi};});
 return Object.freeze({format:'mythwrought.d50.actual-dogleg-support-plane-separation.v1',
  bySweptPrism:extrema,allOriginalDoglegVolumeBehindPatchPlane:extrema.every(x=>x.maxSignedDistance< -EPS),
  onlyOriginalVolumeMeasured:true,otherPossibleRouteNotExcluded:true,constructionAllowed:false});
}
/** Three full convex triangular sweeps: original cap -> genuine normal escape ->
 * nonzero outward + lateral bypass -> true D45 1st or 2nd dogleg entry centroid.
 * No inserted face rotation, shell thickness waiver or artificial endpoint gap. */
export function deriveD50ThreeStageLateralCandidate(patch,dog,palette,{normalLength=.16,lateralReach=.48,lateralSign=1,targetIndex=0}={}){
 if(patch?.format!=='mythwrought.d48.unregistered-slope-subface-patch.v1'||patch.constructionAllowed!==false||
    patch.vertices?.length!==6||!v3(patch.faceNormal)||
    dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
    dog.constructionAllowed!==false||dog.path?.length!==3||!paletteOK(palette)||
    ![.16,.32].includes(normalLength)||![.48,.80].includes(lateralReach)||
    ![-1,1].includes(lateralSign)||![0,2].includes(targetIndex))
  throw TypeError('D50 immutable original sloped patch, physically bounded route, palette and entry required');
 const n=unit(patch.faceNormal),l=dog.plane==='x'?2:0,
  basis=[0,0,0];basis[l]=lateralSign;
 const tangent=unit(sub(basis,mul(n,dot(n,basis))));
 const cap0=patch.vertices.slice(3,6),cap1=cap0.map(p=>add(p,mul(n,normalLength))),
  bypass=add(mul(n,.08),mul(tangent,lateralReach)),cap2=cap1.map(p=>add(p,bypass));
 const target=dog.path[targetIndex],delta=sub(target,center(cap2)),cap3=cap2.map(p=>add(p,delta));
 const stages=[prism(cap0,cap1,palette.metal,'authentic-normal-departure'),
  prism(cap1,cap2,palette.metal,'lateral-bypass'),prism(cap2,cap3,palette.metal,'alternate-dogleg-entry')];
 const signedTurns=stages.map(s=>dot(s.delta,n));
 if(stages.some(s=>Math.abs(s.capArea-patch.actualSourceContactArea)>1e-6)||
    !cap1.every((p,i)=>p.every((v,j)=>Math.abs(v-stages[1].vertices[i][j])<1e-12))||
    !cap2.every((p,i)=>p.every((v,j)=>Math.abs(v-stages[2].vertices[i][j])<1e-12)))
  throw Error('D50 lost real coplanar source socket contact or full triangular bend cap');
 return Object.freeze({format:'mythwrought.d50.uninstalled-three-stage-alternate-entry.v1',stages,
  normalLength,lateralReach,lateralSign,targetIndex,realCapContactArea:patch.actualSourceContactArea,
  trueSharedEndcaps:2,signedFaceNormalTravel:signedTurns,entryPoint:[...target],
  selfOverlaps:[sat(stages[0],stages[1]),sat(stages[1],stages[2]),sat(stages[0],stages[2])],
  sourceMaterialId61ColorsOnly:true,registeredFastener:false,actualTensileRating:null,
  constructionAllowed:false});
}
export function inspectD50SourceAndSocketContinuity(c,patch,dog,socket,src,wall,{otherOwners=[],maxCells=256}={}){
 if(c?.format!=='mythwrought.d50.uninstalled-three-stage-alternate-entry.v1'||
  patch?.format!=='mythwrought.d48.unregistered-slope-subface-patch.v1'||
  dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
  socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
  typeof src?.get!=='function'||!(src.nav instanceof Set)||!v3(wall)||
  !Array.isArray(otherOwners)||otherOwners.length>90||!Number.isSafeInteger(maxCells)||maxCells<8||maxCells>512)
  throw TypeError('D50 genuine original D36/45/48 full convex source and bounded owner set required');
 const tally={authoredSolid:0,authoredWalk:0,existingSocket:0,otherProposedMembers:0,sourceBlockerExamples:[]},
  byStage=[],firstDog=box(dog.fullPrismBounds[0].min,dog.fullPrismBounds[0].max),
  secondDog=box(dog.fullPrismBounds[1].min,dog.fullPrismBounds[1].max);
 for(const body of c.stages){let row={stage:body.stage,authoredSolid:0,authoredWalk:0,existingSocket:0,otherProposedMembers:0};
  let lo=body.bounds.min.map(v=>Math.floor(v+EPS)),hi=body.bounds.max.map(v=>Math.ceil(v-EPS)-1),
   budget=lo.reduce((s,v,i)=>s*(hi[i]-v+1),1);
  if(budget<1||budget>maxCells)throw RangeError('D50 bounded original-source full-volume scan');
  for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
   const cell=src.get(x,y,z);if(cell&&sat(body,box([x,y,z],[x+1,y+1,z+1]))){row.authoredSolid++;
    if(tally.sourceBlockerExamples.length<8)tally.sourceBlockerExamples.push({at:[x,y,z],relative:[x-wall[0],y-wall[1],z-wall[2]],role:cell.role,stage:body.stage});}
   if(src.nav.has(`${x},2,${z}`)&&sat(body,box([x+.2,2,z+.2],[x+.8,4.5,z+.8])))row.authoredWalk++;
  }
  if(sat(body,socket))row.existingSocket++;
  for(const owner of otherOwners)for(const ob of owner?.ownerOBBs??[])if(sat(body,obb(ob)))row.otherProposedMembers++;
  for(const k of ['authoredSolid','authoredWalk','existingSocket','otherProposedMembers'])tally[k]+=row[k];
  byStage.push(row);
 }
 const dogOverlap=[sat(c.stages[2],firstDog),sat(c.stages[2],secondDog)],
  sourceClear=tally.authoredSolid===0&&tally.authoredWalk===0,
  allNonpenetrating=tally.existingSocket===0&&c.selfOverlaps.every(x=>!x),
  accepted=sourceClear&&allNonpenetrating&&tally.otherProposedMembers===0&&dogOverlap.some(Boolean)&&
    c.realCapContactArea>.008&&c.signedFaceNormalTravel[0]>0&&c.signedFaceNormalTravel[1]>0;
 return Object.freeze({format:'mythwrought.d50.original-unapproved-three-stage-screen.v1',...tally,byStage,
  positiveAreaAuthenticSocketCap:c.realCapContactArea,positiveAreaElbowEndcaps:2,
  doglegPhysicalOverlap:dogOverlap,actualSourceClear:sourceClear,
  noFullVolumeSocketIntrusion:tally.existingSocket===0,
  noPositiveVolumeStageSelfIntersections:c.selfOverlaps.every(x=>!x),
  physicalGeometryCandidateClear:accepted,
  ownerApprovedConnection:false,materialStrengthRated:false,registeredBlockId:null,
  realTerrainAndCaveFootingAuthenticated:false,productionPlayerNPCWebGLAndPwaTested:false,
  originalWorldWrites:0,constructionAllowed:false});
}
export function sampleD50OriginalPaletteMeshRay(c){
 if(c?.format!=='mythwrought.d50.uninstalled-three-stage-alternate-entry.v1')throw TypeError('D50 actual unregistered three-stage triangle geometry required');
 let deltaMax=0;for(const stage of c.stages){const high=stage.vertices.slice(3,6),p=center(high),axis=unit(stage.delta),from=add(p,mul(axis,.5)),
  t=d31RayPreviewTriangles(stage.mesh,from,mul(axis,-1),3);
  if(t===null||Math.abs(t-.5)>1e-5)throw Error('D50 original-palette triangle mesh vs analytic endcap ray mismatch');
  deltaMax=Math.max(deltaMax,Math.abs(t-.5));}
 return Object.freeze({triangleSamples:3,triangles:24,maxRayDelta:deltaMax,originalPaletteId:61,
  actualOriginalOwnerMeshUsed:false,realRuntimeRaycastPerformed:false,constructionAllowed:false});
}
