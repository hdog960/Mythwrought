// MYTHWROUGHT Builder D37 — original-source-only tensile load-path evidence.
// An unregistered D36 convex socket has positive geometric end contact, but
// original W16/W17 wall roots are IN TENSION under the D30 normalized gravity
// model. A touching, unattached wall pad has ZERO PROVEN tensile resistance.
// No rated connector, new registered ID, original edit, save or approval.
const EPS=1e-7;
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const vec=x=>Array.isArray(x)&&x.length===3&&x.every(finite);
const delta=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>Math.hypot(...a);
const unit=a=>{const l=norm(a);if(l<EPS)throw Error('D37 collapsed contact or root direction');return a.map(x=>x/l);};
const area4=p=>{if(!Array.isArray(p)||p.length!==4||p.some(x=>!vec(x)))throw TypeError('D37 exact four-corner source pad required');
 const a=delta(p[1],p[0]),b=delta(p[3],p[0]);const c=cross(a,b),area=norm(c);
 if(area<EPS||Math.abs(dot(unit(c),delta(p[2],p[1])))>EPS)throw Error('D37 degenerate or warped source cap');
 const expected=p[1].map((v,i)=>v+p[3][i]-p[0][i]);
 if(norm(delta(expected,p[2]))>EPS)throw Error('D37 cap not a physical parallelogram');
 return {area,normal:unit(c)};};
/** Recompute BOTH true source socket cap face areas and wall-plane admission;
 * counts from a sidecar or a label alone do NOT certify a real contact. */
export function inspectD37ExactWallAndWebCaps(socket){
 if(socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
    !Array.isArray(socket.wall)||socket.wall.length!==3||!socket.wall.every(Number.isSafeInteger)||socket.wall[1]!==6||
    !['x','z'].includes(socket.plane)||socket.ownerPaletteSourceId!==61||
    socket.approvedPack2Variant!==false||socket.realRatedJoint!==false||
    socket.constructionAllowed!==false)
  throw TypeError('D37 requires genuine UNREGISTERED D36 original wall-root socket');
 const a=area4(socket.wallCap),b=area4(socket.webCap);
 if(Math.abs(a.area-socket.sourceOriginalFaceAreaWall)>1e-7||
    Math.abs(b.area-socket.sourceOriginalCutFaceArea)>1e-7)
  throw Error('D37 source cap physical area cannot be forged by metadata');
 const axis=socket.plane==='x'?0:2,wallPlane=socket.wall[axis]+(socket.rootAtEnd?0:1);
 if(socket.wallCap.some(p=>Math.abs(p[axis]-wallPlane)>EPS))
  throw Error('D37 socket wall cap must touch UNCHANGED original WALL face plane');
 const cutNormal=socket.webCutNormal;
 if(!vec(cutNormal)||Math.abs(dot(a.normal,cutNormal))<.65||Math.abs(Math.abs(dot(b.normal,cutNormal))-1)>1e-6)
  throw Error('D37 original source web cut face or wall plane not physically oriented');
 // Original D36 generated convex socket remains source-only. A cap face is
 // contact geometry, NOT independent tensile anchorage or a fastening system.
 return Object.freeze({actualMeasuredWallFaceArea:a.area,actualMeasuredWebFaceArea:b.area,
  sourceWallFaceNormal:Object.freeze(a.normal),sourceCutFaceNormal:Object.freeze(b.normal),
  twoPositiveAreaGeometryFaces:true,independentWallAnchorProven:false,
  installedWebEndClampProven:false,ratedFastenerStrengthKnown:false,
  registeredCollider:false,constructionAllowed:false});
}
const MISSING=Object.freeze([
 'calibrated roof gravity and uplift loads',
 'approved source-owned fastener geometry and material',
 'rated wall-to-fastener tensile anchorage and pullout',
 'rated fastener-to-socket tension and shear',
 'rated socket-to-cut-web end clamp and tension',
 'wall-and-foundation tension and shear reactions',
 'roof diaphragm, lateral restraint and member buckling',
 'independently reviewed physical selection, collision and UV',
 'actual player and NPC movement and iPhone Home Screen acceptance'
]);
/** D30 normalized root axial force is tension positive; no fabricated unit
 * roof load or steel/timber/fastener rating is accepted as source evidence.
 * A force-load path cannot exist through frictionless one-sided face contact
 * when the web PULLS AWAY from the untouched wall. */
export function screenD37OriginalRootTensilePath(socket,member,statics,memberShape){
 const caps=inspectD37ExactWallAndWebCaps(socket);
 if(!member||member.type!=='diagonal-web'||member.approvedAxialJoint!==false||
    !Number.isFinite(member.normalizedAxialForce)||member.normalizedAxialForce<=0||
    !statics?.normalizedOnly||statics.roofSupportCertified!==false||statics.constructionAllowed!==false||
    !Number.isSafeInteger(statics.panelCount)||statics.panelCount<4||
    !Array.isArray(statics.members)||!statics.members.some(m=>m===member)||
    !memberShape||!vec(memberShape.start)||!vec(memberShape.end))
  throw Error('D37 rejects non-original, non-tensile, forged or rated wall-root statics');
 const atStart=member.from==='T0',atEnd=member.to===`T${statics.panelCount}`;
 if(atStart===atEnd||socket.rootAtEnd!==atEnd)
  throw Error('D37 normalized tension must be at exactly ONE grounded D30 original wall root');
 const direction=unit(atStart?delta(memberShape.end,memberShape.start):delta(memberShape.start,memberShape.end));
 const axis=socket.plane==='x'?0:2,away=[0,0,0];away[axis]=atStart?1:-1;
 const outward=Math.max(0,dot(direction,away));
 if(outward<.6)throw Error('D37 root tensile force orientation does not pull AWAY from original wall');
 const demand=member.normalizedAxialForce;
 return Object.freeze({format:'mythwrought.d37.unrated-root-tensile-force-proof.v1',
  rootNode:atStart?member.from:member.to,spanInteriorCells:statics.interiorSourceCells,
  tensileAxialForcePerUnknownUnitRoofLineLoad:demand,
  outwardFromUnmodifiedWallForcePerUnknownLineLoad:demand*outward,
  normalForcePerUnknownLineLoad:demand*outward,
  wallFaceArea:caps.actualMeasuredWallFaceArea,webCutFaceArea:caps.actualMeasuredWebFaceArea,
  necessaryWallAnchorTensionStressCoefficient:demand*outward/caps.actualMeasuredWallFaceArea,
  necessaryWebCutTensionStressCoefficient:demand/caps.actualMeasuredWebFaceArea,
  bearingReactionPerUnknownLineLoad:Object.freeze([...statics.bearingReactionPerUnitRoofLineLoad]),
  unitRoofLoadIsNOTCalibrated:true,requiredTransferMode:'tensile anchorage, not compressive wall contact',
  originalWallPadSupportsProvenTension:false,sourceOwnerRatedMetalFastenerFound:false,
  twoFaceGeometryOnly:true,authenticatedRatedConnectionEdges:0,
  requiredEvidence:MISSING,materialRatingInvented:false,
  passesPhysicalStructuralApproval:false,constructionAllowed:false});
}
/** Original body-fit API accepts only ≤32 registered local axis-aligned boxes.
 * The convex D36 socket is NOT one of those blocks. Its AABB is used as a
 * conservative rejection envelope: false positives possible, no false
 * negatives for overlap with the convex socket. Does not certify player motion. */
export function inspectD37ConservativeOriginalBodyAdapter(socket,body,inspectBodyFit){
 if(socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
    !Array.isArray(body)||body.length!==6||!body.every(finite)||
    body.slice(0,3).some((x,i)=>x>=body[i+3])||typeof inspectBodyFit!=='function')
  throw TypeError('D37 actual original shape-fit reader and bounded player AABB required');
 const low=socket.bounds.min,high=socket.bounds.max;
 if(!vec(low)||!vec(high)||low.some((x,i)=>x>=high[i]))throw TypeError('D37 invalid exact socket bounds');
 const a=low.map(Math.floor),z=high.map(x=>Math.ceil(x-1e-9)-1),
   count=z.reduce((p,t,i)=>p*(t-a[i]+1),1);
 if(!Number.isSafeInteger(count)||count<1||count>32)throw RangeError('D37 conservative original runtime cell descriptor budget');
 const getShape=(x,y,k)=>{
  const q=[x,y,k];const box=[...low.map((v,i)=>Math.max(0,v-q[i])),...high.map((v,i)=>Math.min(1,v-q[i]))];
  if(box.slice(0,3).some((v,i)=>v>=box[i+3]))return null;
  return {boxes:[box]};
 };
 const result=inspectBodyFit(body,getShape,{maxCells:32});
 if(!result||typeof result.fits!=='boolean')throw Error('D37 original body-fit API returned counterfeit descriptor');
 return Object.freeze({conservativeAABBBodyFits:result.fits,originalRuntimeShapeFitAPICalled:true,
  actualConvexColliderRegistered:false,completePlayerMovementCertified:false,
  actorBodyDimensionsAuthenticated:false,passedForConstruction:false});
}
