// MYTHWROUGHT D30: mathematical source-only Pratt-style pin truss, NOT a block
// or a registered physical structure. Dimensionless one-unit distributed roof
// load and one-unit EA are algebraic normalizers, NOT real loads or ratings.
// Centerlines occupy Y5.5 and Y6.5. True member thickness, joint, roof
// attachment, stability, lateral buckling and material capacities are UNKNOWN.
const finite=x=>Number.isFinite(x);
function integer(n,min,max,label){if(!Number.isSafeInteger(n)||n<min||n>max)throw RangeError(`D30 ${label} budget`);}
function solve(a,b){
 const n=b.length,sol=Float64Array.from(b);
 for(let i=0;i<n;i++){
  let pivot=i;
  for(let j=i+1;j<n;j++)if(Math.abs(a[j*n+i])>Math.abs(a[pivot*n+i]))pivot=j;
  if(Math.abs(a[pivot*n+i])<1e-11)throw Error('D30 pin truss geometric mechanism or singular source geometry');
  if(pivot!==i){for(let k=i;k<n;k++){
   const q=a[i*n+k];a[i*n+k]=a[pivot*n+k];a[pivot*n+k]=q;
  }const q=sol[i];sol[i]=sol[pivot];sol[pivot]=q;}
  const p=a[i*n+i];
  for(let j=i+1;j<n;j++){
   const factor=a[j*n+i]/p;a[j*n+i]=0;
   for(let k=i+1;k<n;k++)a[j*n+k]-=factor*a[i*n+k];
   sol[j]-=factor*sol[i];
  }
 }
 for(let i=n-1;i>=0;i--){
  let val=sol[i];for(let j=i+1;j<n;j++)val-=a[i*n+j]*sol[j];
  sol[i]=val/a[i*n+i];if(!finite(sol[i]))throw Error('D30 normalized pin-truss solver overflow');
 }
 return sol;
}
/** Single planar pin-jointed *hypothesis*, no approval or physical geometry. */
export function solveD30IdealizedUnderslungTruss(interiorCells,{maxPanelLength=4}={}){
 integer(interiorCells,13,48,'original wall-to-wall interior');
 integer(maxPanelLength,2,4,'maximum panel cell length');
 const L=interiorCells+1,p= Math.ceil(L/maxPanelLength), panel=L/p;
 if(p<4||p>25||panel>4+1e-9)throw Error('D30 source paneling cannot be bounded');
 // Top nodes run from original wall top to original wall top at Y6.5.
 // Bottom nodes only lie under interior Y6, at Y5.5.
 const nodes=[];
 for(let i=0;i<=p;i++)nodes.push(Object.freeze({id:`T${i}`,x:panel*i,y:6.5,kind:'top'}));
 for(let i=1;i<p;i++)nodes.push(Object.freeze({id:`B${i}`,x:panel*i,y:5.5,kind:'bottom'}));
 const top=i=>i,bottom=i=>p+i;
 const edges=[];
 const add=(a,b,type)=>{
  if(a===b)throw Error('D30 zero-length truss');
  const dx=nodes[b].x-nodes[a].x,dy=nodes[b].y-nodes[a].y,len=Math.hypot(dx,dy);
  if(len<1e-10||!finite(len))throw Error('D30 invalid truss member geometry');
  edges.push({a,b,type,length:len,cos:dx/len,sin:dy/len});
 };
 for(let i=0;i<p;i++)add(top(i),top(i+1),'top-chord');
 for(let i=1;i<p-1;i++)add(bottom(i),bottom(i+1),'bottom-chord');
 for(let i=1;i<p;i++)add(top(i),bottom(i),'vertical-web');
 add(top(0),bottom(1),'diagonal-web');
 for(let i=1;i<p-1;i++)add(bottom(i),top(i+1),'diagonal-web');
 add(bottom(p-1),top(p),'diagonal-web');
 if(edges.length!==2*nodes.length-3)throw Error('D30 pin truss member count not statically determinate');
 const ndof=nodes.length*2,restrained=new Set([0,1,top(p)*2+1]);
 const freedoms=[];for(let i=0;i<ndof;i++)if(!restrained.has(i))freedoms.push(i);
 const slots=new Map(freedoms.map((v,i)=>[v,i]));
 const n=freedoms.length,stiff=new Float64Array(n*n),load=new Float64Array(ndof);
 for(let i=0;i<=p;i++)load[top(i)*2+1]=-(i===0||i===p?panel/2:panel);
 for(const e of edges){
  const v=[e.a*2,e.a*2+1,e.b*2,e.b*2+1],d=[-e.cos,-e.sin,e.cos,e.sin];
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){
   const a=slots.get(v[i]),b=slots.get(v[j]);if(a!==undefined&&b!==undefined)
    stiff[a*n+b]+=d[i]*d[j]/e.length;
  }
 }
 const disp=solve(stiff,Float64Array.from(freedoms.map(i=>load[i]))),u=new Float64Array(ndof);
 for(let i=0;i<n;i++)u[freedoms[i]]=disp[i];
 const internal=new Float64Array(ndof);
 let maxTension=0,maxCompression=0,compressionBucklingEI=0,maxMemberSpan=0;
 const members=edges.map((e,i)=>{
  const axial=(((u[2*e.b]-u[2*e.a])*e.cos)+
   ((u[2*e.b+1]-u[2*e.a+1])*e.sin))/e.length;
  if(!finite(axial))throw Error('D30 normalized member axial response invalid');
  internal[2*e.a]-=axial*e.cos;internal[2*e.a+1]-=axial*e.sin;
  internal[2*e.b]+=axial*e.cos;internal[2*e.b+1]+=axial*e.sin;
  if(axial>0)maxTension=Math.max(maxTension,axial);
  else{maxCompression=Math.max(maxCompression,-axial);
   // Euler pin-ended idealization K=1, valid only if actual lateral bracing is established.
   compressionBucklingEI=Math.max(compressionBucklingEI,(-axial)*e.length**2/Math.PI**2);
  }
  maxMemberSpan=Math.max(maxMemberSpan,e.length);
  return Object.freeze({memberId:i,from:nodes[e.a].id,to:nodes[e.b].id,
   type:e.type,centerlineLength:e.length,normalizedAxialForce:axial,
   signedForceConvention:'tension-positive-compression-negative',
   approvedMaterial:false,approvedAxialJoint:false,approvedBucklingBracing:false});
 });
 let residual=0;for(const dof of freedoms)residual=Math.max(residual,Math.abs(internal[dof]-load[dof]));
 const reactions=[internal[1]-load[1],internal[top(p)*2+1]-load[top(p)*2+1]],
  hx=internal[0]-load[0],totalY=reactions[0]+reactions[1];
 if(residual>1e-6||Math.abs(totalY-L)>1e-6||Math.abs(hx)>1e-6||
   Math.abs(reactions[0]-L/2)>1e-6||Math.abs(reactions[1]-L/2)>1e-6)
  throw Error('D30 pin truss equilibrium or end reaction failure');
 const peakDisp=Math.max(...nodes.map((_,i)=>Math.abs(u[2*i+1])));
 return Object.freeze({format:'mythwrought.builder-d.d30.unrated-ideal-pin-web.v1',
  interiorSourceCells:interiorCells,spanCenterlineLength:L,panelCount:p,panelLength:panel,
  topChordY:6.5,bottomChordY:5.5,numberOfNodes:nodes.length,numberOfMembers:members.length,
  numberOfJointsRequiringValidatedAxialTransfer:nodes.length,
  maxTrussMemberLength:maxMemberSpan,
  nodes:Object.freeze(nodes),members:Object.freeze(members),
  normalizedOnly:true,unitLineLoadIsNotRealSourceRoofLoad:true,
  idealizedUnitEAIsNotRatedPhysicalStiffness:true,
  idealizedPeakTensionPerUnitRoofLineLoad:maxTension,
  idealizedPeakCompressionPerUnitRoofLineLoad:maxCompression,
  idealizedMinCompressionEIForPinnedUnbracedAssumptionPerUnitLoad:compressionBucklingEI,
  idealizedPeakVerticalDisplacementPerUnitLineLoadAndUnitEA:peakDisp,
  idealizedSimplySupportedPanelLocalTopChordMomentPerUnitLoad:panel**2/8,
  idealizedSimplySupportedPanelLocalTopChordShearPerUnitLoad:panel/2,
  bearingReactionPerUnitRoofLineLoad:Object.freeze(reactions),
  maximumFreeDegreeEquilibriumResidual:residual,
  roofToTopChordConnectionMustBeRated:true,
  realDiagonalOwnerAndCrossSectionMissing:true,
  ratedCompressionBucklingAndLateralBracingMissing:true,
  ratedAxialPinAndChordJointStrengthMissing:true,
  ratedRoofTributaryLoadAndLocalTopChordMomentMissing:true,
  actualPhysicalMemberThicknessAndPlayerCollisionNotAccepted:true,
  roofSupportCertified:false,constructionAllowed:false});
}
