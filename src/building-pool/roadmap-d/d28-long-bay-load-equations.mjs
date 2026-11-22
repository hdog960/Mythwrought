// D28 — symbolic load demand for an IDEAL simply supported roof chord.
// This does not assign allowable timber strength, a moment connection, safety
// factor, wind/snow loading, or a physically constructed truss.
const positive=(n)=>Number.isFinite(n)&&n>0;
/** interiorCells are unoccupied Y6 cells between two source-proven wall ends. */
export function calculateD28UnratedBayDemand(interiorCells,{unitLineLoad=1}={}){
 if(!Number.isSafeInteger(interiorCells)||interiorCells<13||interiorCells>48||!positive(unitLineLoad))
  throw RangeError('D28 unreviewed long-bay demand requires 13..48 cells and positive line load');
 const L=interiorCells+1;
 const reaction=unitLineLoad*L/2;
 const moment=unitLineLoad*L*L/8;
 const deflectionNumerator=5*unitLineLoad*L**4/384;
 if(![reaction,moment,deflectionNumerator].every(Number.isFinite))throw RangeError('D28 demand overflow');
 return Object.freeze({
  interiorBeamCells:interiorCells,clearCenterlineSpanCells:L,
  jointCountBetweenOneCellTimberSegments:Math.max(0,interiorCells-1),
  assumedUnitLineLoad:unitLineLoad,
  idealSimpleSupportReactionAtEachEnd:reaction,
  idealPeakBendingMomentDemand:moment,
  idealDeflectionNumeratorBeforeUnknownEI:deflectionNumerator,
  loadModel:'uniform line load, ideal simple supports, no verified continuity',
  timberAllowableMoment:null,timberAllowableShear:null,timberBendingStiffnessEI:null,
  jointMomentRating:null,verifiedRoofTributaryWidth:null,
  loadCapacityKnown:false,canBuildOrCertify:false
 });
}
const EPS=1e-9;
function valid(b){return Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
  [0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1)}
/** Exact union-of-rectangles area on a 0 or 1 cell boundary. */
export function d28CellEndFaceArea(boxes,axis,side){
 const a=axis==='x'?0:axis==='z'?2:-1;
 if(a<0||![0,1].includes(side)||!Array.isArray(boxes)||boxes.length<1||boxes.length>32||
   boxes.some(b=>!valid(b)))throw TypeError('D28 requires original finite x/z local-box union');
 const front=boxes.filter(b=>Math.abs(b[a+(side===1?3:0)]-side)<EPS);
 if(!front.length)return 0;
 const [u,v]=[0,1,2].filter(i=>i!==a);
 const us=[...new Set(front.flatMap(b=>[b[u],b[u+3]]))].sort((p,q)=>p-q),
 vs=[...new Set(front.flatMap(b=>[b[v],b[v+3]]))].sort((p,q)=>p-q);
 let sum=0;
 for(let i=0;i<us.length-1;i++)for(let j=0;j<vs.length-1;j++){
  const m=(us[i]+us[i+1])/2,n=(vs[j]+vs[j+1])/2;
  if(front.some(b=>m>b[u]+EPS&&m<b[u+3]-EPS&&n>b[v]+EPS&&n<b[v+3]-EPS))
   sum+=(us[i+1]-us[i])*(vs[j+1]-vs[j]);
 }
 return sum;
}
/** Contact geometrical acceptance only; unknown joint bending remains a hard veto. */
export function d28SameAxisJoinGeometry(boxes,axis){
 const near=d28CellEndFaceArea(boxes,axis,0),far=d28CellEndFaceArea(boxes,axis,1);
 if(near<=EPS||far<=EPS||Math.abs(near-far)>1e-8)
  throw Error('D28 pack timber face mismatch or one-sided contact');
 return Object.freeze({nearArea:near,farArea:far,adjacentFaceArea:Math.min(near,far),
  geometricContact:true,momentTransferCertified:false,buildingAllowed:false});
}
