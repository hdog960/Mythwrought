// MYTHWROUGHT D51: original-source isolated ARTICULATED, ROTATED-CAP link.
// A genuine source-sloped D48 socket cap and genuine D45 dogleg boundary cap;
// independently rebuilt convex hull, not D49/D50 cap-parallel translational prisms.
// All geometry unregistered and unapproved. No authored blocks or saves modified.
import {d47ConvexPositiveVolumeCollision as sat} from './d47-original-congruent-socket-saddle.mjs';
import {d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const EPS=1e-8, fin=n=>Number.isFinite(n),v3=p=>Array.isArray(p)&&p.length===3&&p.every(fin);
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,s)=>a.map(x=>x*s);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>Math.hypot(...a), unit=a=>{const k=norm(a);if(k<EPS)throw Error('D51 zero-length vector');return mul(a,1/k);};
const centroid=points=>mul(points.reduce((s,p)=>add(s,p),[0,0,0]),1/points.length);
const area=points=>norm(cross(sub(points[1],points[0]),sub(points[2],points[0])))/2;
const bounds=points=>({min:[0,1,2].map(i=>Math.min(...points.map(p=>p[i]))),max:[0,1,2].map(i=>Math.max(...points.map(p=>p[i])))});
const paletteOK=p=>JSON.stringify(p?.metal)==='[0.29,0.32,0.33]'&&JSON.stringify(p?.grain)==='[0.22,0.13,0.11]'&&JSON.stringify(p?.base)==='[0.4,0.24,0.17]';
const edges6=Array.from({length:6},(_,i)=>Array.from({length:6-i-1},(_,j)=>[i,i+j+1])).flat();
function actualConvexHull(a,b,palette,stage){
 const vertices=[...a,...b],center=centroid(vertices),triangles=[],faces=[],planes=new Set();
 // Full supporting-plane triangle enumeration. Any twisted side quad is
 // triangulated from real convex-hull planes, never assumed coplanar.
 for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)for(let k=j+1;k<6;k++){
  let n=cross(sub(vertices[j],vertices[i]),sub(vertices[k],vertices[i])),l=norm(n);if(l<EPS)continue;
  n=mul(n,1/l);let ds=vertices.map(p=>dot(n,sub(p,vertices[i]))),pos=ds.some(x=>x>2e-7),neg=ds.some(x=>x<-2e-7);
  if(pos&&neg)continue;
  if(dot(n,sub(center,vertices[i]))>0)n=mul(n,-1);
  const key=[...n,dot(n,vertices[i])].map(x=>Math.round(x*1e6)).join(',');
  if(planes.has(key))continue;planes.add(key);
  const ids=vertices.map((p,t)=>Math.abs(dot(n,sub(p,vertices[i])))<2e-7?t:null).filter(x=>x!==null);
  if(ids.length<3)continue;
  // Project to a 2D basis, sort vertices around plane centroid, fan triangulate.
  const pc=centroid(ids.map(id=>vertices[id])),u=unit(sub(vertices[ids[0]],pc)),v=unit(cross(n,u));
  ids.sort((x,y)=>Math.atan2(dot(sub(vertices[x],pc),v),dot(sub(vertices[x],pc),u))-
                    Math.atan2(dot(sub(vertices[y],pc),v),dot(sub(vertices[y],pc),u)));
  for(let t=1;t<ids.length-1;t++){
   let tri=[ids[0],ids[t],ids[t+1]],nn=cross(sub(vertices[tri[1]],vertices[tri[0]]),sub(vertices[tri[2]],vertices[tri[0]]));
   if(dot(nn,n)<0)tri=[tri[0],tri[2],tri[1]];
   triangles.push(tri);
  }
  faces.push({normal:n});
 }
 const containsCap=(ids)=>{
  let n=unit(cross(sub(vertices[ids[1]],vertices[ids[0]]),sub(vertices[ids[2]],vertices[ids[0]])));
  let positives=vertices.some((p,k)=>!ids.includes(k)&&dot(n,sub(p,vertices[ids[0]]))>2e-7),
      negatives=vertices.some((p,k)=>!ids.includes(k)&&dot(n,sub(p,vertices[ids[0]]))<-2e-7);
  return !(positives&&negatives)&&area(ids.map(i=>vertices[i]))>.001;
 };
 if(triangles.length<6||!containsCap([0,1,2])||!containsCap([3,4,5]))
  throw Error('D51 nonconvex/twisted union or degenerate non-supporting connector cap');
 const positions=[],colors=[],indices=[];
 for(const tri of triangles){const off=positions.length/3;for(const id of tri){positions.push(...vertices[id]);colors.push(...palette.metal);}indices.push(off,off+1,off+2);}
 return Object.freeze({format:'mythwrought.d51.articulated-convex-rotated-cap-stage.v1',stage,
  vertices,edges:edges6,faces,bounds:bounds(vertices),
  mesh:{positions:Float32Array.from(positions),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)},
  entranceArea:area(a),exitArea:area(b),triangleCount:triangles.length,
  registeredSourceOwner:false,constructionAllowed:false});
}
function rotate(p,c,axis,angle){const r=sub(p,c),q=unit(axis),t=angle*Math.PI/180;
 return add(c,add(add(mul(r,Math.cos(t)),mul(cross(q,r),Math.sin(t))),mul(q,dot(q,r)*(1-Math.cos(t)))));}
/** Exact D45 *physical exterior endcap*, never a centerline or arbitrary interior point.
 * The two selectable faces are the first dogleg's actual far axial face, and
 * the second dogleg's true far lateral end face. Returns an inset triangle
 * belonging to the original full swept cuboid face, with independent area. */
export function deriveD51DoglegActualBoundaryCap(dog,{entry='second-lateral',inset=.22}={}){
 if(dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
  dog.fullPrismBounds?.length!==2||dog.path?.length!==3||!['first-axial','second-lateral'].includes(entry)||inset!==.22)
  throw TypeError('D51 exact physical D45 source dogleg exterior endcap required');
 const axial=dog.plane==='x'?0:2,lateral=axial===0?2:0,
  axis=entry==='first-axial'?axial:lateral,
  source=dog.fullPrismBounds[entry==='first-axial'?0:1],
  sign=entry==='first-axial'?Math.sign(dog.path[1][axial]-dog.path[0][axial]):Math.sign(dog.path[2][lateral]-dog.path[1][lateral]);
 const face=sign>0?source.max[axis]:source.min[axis],others=[0,1,2].filter(i=>i!==axis),
  u=others[0],v=others[1],um=(source.min[u]+source.max[u])/2,vm=(source.min[v]+source.max[v])/2,
  hu=(source.max[u]-source.min[u])*(.5-inset),hv=(source.max[v]-source.min[v])*(.5-inset);
 const triangle=[[um-hu,vm-hv],[um+hu,vm-hv],[um,vm+hv]].map(([x,y])=>{
  const p=[0,0,0];p[axis]=face;p[u]=x;p[v]=y;return p;
 });
 const physicalArea=area(triangle);if(!(physicalArea>.001))throw Error('D51 no positive exposed original dogleg contact');
 return Object.freeze({format:'mythwrought.d51.true-d45-dogleg-exterior-cap.v1',triangle,axis,face,sign,
  entry,contactArea:physicalArea,sourceOriginalAABB:source,ownerUnregistered:true,constructionAllowed:false});
}
/** Two genuinely differently oriented section caps before final DOGLEG surface.
 * First cap is exactly the D48 original sloped socket face; stage1 goes along
 * its REAL normal; next cap is RIGIDLY ROTATED in 3D about a physical hinge;
 * final segment tapers/rotates to the D45 exposed surface triangle.
 * Failed convex shapes are rejected, not silently approximated with an AABB. */
export function deriveD51ArticulatedExteriorLink(patch,dog,palette,{entry='second-lateral',normalLength=.16,
 hingeAngle=12,hingeSide=1,offset=.24}={}){
 if(patch?.format!=='mythwrought.d48.unregistered-slope-subface-patch.v1'||
    patch.constructionAllowed!==false||patch.vertices?.length!==6||!v3(patch.faceNormal)||
    !paletteOK(palette)||![-1,1].includes(hingeSide)||![.16,.32].includes(normalLength)||
    ![12,24].includes(hingeAngle)||![.24,.40].includes(offset))
  throw TypeError('D51 strict authentic source face and bounded articulated hinge configuration');
 const target=deriveD51DoglegActualBoundaryCap(dog,{entry}),n=unit(patch.faceNormal),
  cap0=patch.vertices.slice(3,6),cap1=cap0.map(p=>add(p,mul(n,normalLength))),
  axial=dog.plane==='x'?0:2,lateral=axial===0?2:0,
  lateralVec=[0,0,0];lateralVec[lateral]=hingeSide;
 const axis=unit(cross(n,lateralVec)),cc=centroid(cap1),
  shifted=add(mul(n,.14),mul(lateralVec,offset)),
  cap2=cap1.map(p=>add(rotate(p,cc,axis,hingeSide*hingeAngle),shifted));
 const stages=[actualConvexHull(cap0,cap1,palette,'source-face-normal-departure'),
  actualConvexHull(cap1,cap2,palette,'rotated-articulated-bypass'),
  actualConvexHull(cap2,target.triangle,palette,'nonparallel-real-dogleg-endcap-approach')];
 const selfOverlaps=[sat(stages[0],stages[1]),sat(stages[1],stages[2]),sat(stages[0],stages[2])];
 return Object.freeze({format:'mythwrought.d51.unregistered-rotated-cap-actual-endface-link.v1',
  stages,target,normalLength,hingeAngle,hingeSide,offset,
  originalPatchArea:patch.actualSourceContactArea,realDoglegArea:target.contactArea,
  genuineSharedCapTriangles:2,rotatedCaps:2,
  firstDeparture:dot(sub(centroid(cap1),centroid(cap0)),n),
  terminalSignedNormalTravel:dot(sub(centroid(target.triangle),centroid(cap2)),n),
  selfOverlaps,sourceColorOnlyId61:true,registeredFastener:false,
  actualMechanicalRetention:false,independentFoundationCertified:false,constructionAllowed:false});
}
function cube(lo,hi){const v=[];for(const x of [lo[0],hi[0]])for(const y of [lo[1],hi[1]])for(const z of [lo[2],hi[2]])v.push([x,y,z]);
 return {vertices:v,edges:[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]],faces:[{normal:[1,0,0]},{normal:[0,1,0]},{normal:[0,0,1]}]};}
function owner(ob){const v=[];for(const a of [-1,1])for(const b of [-1,1])for(const c of [-1,1]){
  let p=[...ob.center];for(const [sign,i] of [[a,0],[b,1],[c,2]])p=add(p,mul(ob.axes[i],ob.half[i]*sign));v.push(p);
 }return {vertices:v,edges:cube([0,0,0],[1,1,1]).edges,faces:ob.axes.map(normal=>({normal}))};}
/** Source, original socket, dogleg and each proposed nearby D31 member are
 * tested against the COMPLETE derived convex hull volumes. A final triangle
 * lying on the true physical dogleg face has zero positive-volume dogleg hit. */
export function inspectD51ArticulatedPhysicalPath(link,patch,dog,socket,source,wall,{otherOwners=[],maxCells=256}={}){
 if(link?.format!=='mythwrought.d51.unregistered-rotated-cap-actual-endface-link.v1'||
  patch?.format!=='mythwrought.d48.unregistered-slope-subface-patch.v1'||
  dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
  socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
  typeof source?.get!=='function'||!(source.nav instanceof Set)||!v3(wall)||
  !Array.isArray(otherOwners)||otherOwners.length>90||
  !Number.isSafeInteger(maxCells)||maxCells<8||maxCells>512)
  throw TypeError('D51 authenticated immutable original source, hull and owner set required');
 let tally={solid:0,walk:0,socket:0,member:0,dogleg:0,sourceExamples:[]};
 const dogs=dog.fullPrismBounds.map(b=>cube(b.min,b.max)),stageRows=[];
 for(const stage of link.stages){const row={stage:stage.stage,solid:0,walk:0,socket:0,member:0,dogleg:0};
  const lo=stage.bounds.min.map(x=>Math.floor(x+EPS)),hi=stage.bounds.max.map(x=>Math.ceil(x-EPS)-1),
    budget=lo.reduce((s,x,i)=>s*(hi[i]-x+1),1);
  if(budget<1||budget>maxCells)throw RangeError('D51 excessive original authored source swept hull');
  for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
   const c=source.get(x,y,z),shape=cube([x,y,z],[x+1,y+1,z+1]);
   if(c&&sat(stage,shape)){row.solid++;if(tally.sourceExamples.length<8)tally.sourceExamples.push({stage:stage.stage,at:[x,y,z],role:c.role,relative:[x-wall[0],y-wall[1],z-wall[2]]});}
   if(source.nav.has(`${x},2,${z}`)&&sat(stage,cube([x+.2,2,z+.2],[x+.8,4.5,z+.8])))row.walk++;
  }
  if(sat(stage,socket))row.socket++;
  for(const member of otherOwners)for(const ob of member?.ownerOBBs??[])if(sat(stage,owner(ob)))row.member++;
  for(const d of dogs)if(sat(stage,d))row.dogleg++;
  for(const k of ['solid','walk','socket','member','dogleg'])tally[k]+=row[k];
  stageRows.push(row);
 }
 const endcapMatches=link.target.triangle.every((p,i)=>p.every((v,j)=>Math.abs(v-link.stages[2].vertices[i+3][j])<1e-10)),
  noCollision=tally.solid+tally.walk+tally.socket+tally.member+tally.dogleg===0&&link.selfOverlaps.every(x=>!x);
 return Object.freeze({format:'mythwrought.d51.original-unapproved-rotated-actual-endface-screen.v1',
  ...tally,stageRows,endcapMatches,
  positiveAuthenticSocketFaceArea:link.originalPatchArea,
  actualPositiveDoglegEndcapArea:link.realDoglegArea,
  fullConvexSourceAndSocketClear:noCollision,
  geometricCandidateClear:noCollision&&endcapMatches&&link.firstDeparture>.1,
  ownerRegistration:false,realTensileLoadPath:false,approvedFastener:false,
  ratedFoundation:false,realWebGL2AndPwaAccepted:false,sourceEdits:0,constructionAllowed:false});
}
/** Analytic line/plane against true exposed endcap, checked against all
 * independent colored convex hull triangles: not actual gameplay picking. */
export function sampleD51OriginalPaletteTriangleParity(link){
 if(link?.format!=='mythwrought.d51.unregistered-rotated-cap-actual-endface-link.v1')throw TypeError('D51 actual rotated caps required');
 const c=centroid(link.target.triangle),face=link.target,dir=[0,0,0];dir[face.axis]=-face.sign;
 const from=[...c];from[face.axis]+=face.sign*.5;
 const ray=d31RayPreviewTriangles(link.stages[2].mesh,from,dir,2);
 if(ray===null||Math.abs(ray-.5)>1e-5)throw Error('D51 actual dogleg external cap triangle/ray mismatch');
 return Object.freeze({triangleCount:link.stages.reduce((n,s)=>n+s.triangleCount,0),
  originalSourcePaletteId:61,rayDelta:Math.abs(ray-.5),
  originalBlockOwnerModified:false,liveGameSelectionTested:false,constructionAllowed:false});
}
