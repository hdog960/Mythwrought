// D52: independent exterior-approach terminal path for the D51 rotated-cap joint.
// A source-only test of REAL convex solid volumes. Never a fastener, rating,
// registered owner, ground support, world mutation or construction approval.
import {d47ConvexPositiveVolumeCollision as sat} from './d47-original-congruent-socket-saddle.mjs';
import {deriveD51DoglegActualBoundaryCap} from './d51-articulated-true-endface-link.mjs';
import {d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const EPS=1e-8, v=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const add=(a,b)=>a.map((x,i)=>x+b[i]), sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,k)=>a.map(x=>x*k);
const dot=(a,b)=>a.reduce((z,x,i)=>z+x*b[i],0), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const mag=a=>Math.hypot(...a),unit=a=>{const n=mag(a);if(n<EPS)throw Error('D52 zero thickness/normal');return mul(a,1/n);};
const center=a=>mul(a.reduce((t,p)=>add(t,p),[0,0,0]),1/a.length);
const area=a=>mag(cross(sub(a[1],a[0]),sub(a[2],a[0])))/2;
const bbox=p=>({min:[0,1,2].map(i=>Math.min(...p.map(x=>x[i]))),max:[0,1,2].map(i=>Math.max(...p.map(x=>x[i])))});
const box=(lo,hi)=>{const vertices=[];for(const x of [lo[0],hi[0]])for(const y of [lo[1],hi[1]])for(const z of [lo[2],hi[2]])vertices.push([x,y,z]);
 return {vertices,edges:[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]],faces:[{normal:[1,0,0]},{normal:[0,1,0]},{normal:[0,0,1]}]};};
const obb=o=>{let p=[];for(const a of [-1,1])for(const b of [-1,1])for(const c of [-1,1]){
 let x=[...o.center];for(const [i,k] of [a,b,c].entries())x=add(x,mul(o.axes[i],o.half[i]*k));p.push(x);}
 return {...box([0,0,0],[1,1,1]),vertices:p,faces:o.axes.map(normal=>({normal}))};};
const paletteOK=p=>JSON.stringify(p?.metal)==='[0.29,0.32,0.33]'&&JSON.stringify(p?.base)==='[0.4,0.24,0.17]'&&JSON.stringify(p?.grain)==='[0.22,0.13,0.11]';
const edges=Array.from({length:6},(_,i)=>Array.from({length:5-i},(_,j)=>[i,i+j+1])).flat();
/** Generate real 3D supporting convex-hull faces, not made-up faces of a
 * twisted triangular prism. Both triangle caps must be exterior planes. */
function hull(low,high,palette,stage){
 const vertices=[...low,...high],mid=center(vertices),planes=new Set(),triangles=[],faces=[];
 for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)for(let k=j+1;k<6;k++){
  let n=cross(sub(vertices[j],vertices[i]),sub(vertices[k],vertices[i]));if(mag(n)<EPS)continue;n=unit(n);
  const distances=vertices.map(p=>dot(n,sub(p,vertices[i])));
  if(distances.some(x=>x>2e-7)&&distances.some(x=>x< -2e-7))continue;
  if(dot(n,sub(mid,vertices[i]))>0)n=mul(n,-1);
  const key=[...n,dot(n,vertices[i])].map(x=>Math.round(x*1e6)).join(',');
  if(planes.has(key))continue;planes.add(key);
  const ids=vertices.map((p,t)=>Math.abs(dot(n,sub(p,vertices[i])))<2e-7?t:null).filter(x=>x!==null);
  if(ids.length<3)continue;
  const pc=center(ids.map(t=>vertices[t])),u=unit(sub(vertices[ids[0]],pc)),w=unit(cross(n,u));
  ids.sort((a,b)=>Math.atan2(dot(sub(vertices[a],pc),w),dot(sub(vertices[a],pc),u))-
                   Math.atan2(dot(sub(vertices[b],pc),w),dot(sub(vertices[b],pc),u)));
  for(let z=1;z<ids.length-1;z++){let tri=[ids[0],ids[z],ids[z+1]],nn=cross(sub(vertices[tri[1]],vertices[tri[0]]),sub(vertices[tri[2]],vertices[tri[0]]));
   if(dot(nn,n)<0)tri=[tri[0],tri[2],tri[1]];triangles.push(tri);}faces.push({normal:n});
 }
 const supports=ids=>{const n=unit(cross(sub(vertices[ids[1]],vertices[ids[0]]),sub(vertices[ids[2]],vertices[ids[0]])));
  const vals=vertices.filter((p,i)=>!ids.includes(i)).map(p=>dot(n,sub(p,vertices[ids[0]])));
  return !(vals.some(x=>x>2e-7)&&vals.some(x=>x< -2e-7))&&area(ids.map(t=>vertices[t]))>.001;};
 if(triangles.length<6||!supports([0,1,2])||!supports([3,4,5]))throw Error('D52 non-supporting, zero-volume or nonconvex cap pair');
 const positions=[],colors=[],indices=[];for(const tri of triangles){let at=positions.length/3;for(const id of tri){positions.push(...vertices[id]);colors.push(...palette.metal);}indices.push(at,at+1,at+2);}
 return Object.freeze({format:'mythwrought.d52.real-convex-exterior-approach-stage.v1',stage,vertices,edges,faces,bounds:bbox(vertices),
  entranceArea:area(low),exitArea:area(high),triangleCount:triangles.length,
  mesh:{positions:Float32Array.from(positions),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)},constructionAllowed:false});
}
/** The final link starts OUTSIDE the *true D45 exterior face* and ends
 * pointwise on the source-derived positive-area physical boundary. Stage 3
 * links D51's actual second-stage exit to that exterior staging cap. */
export function deriveD52ExteriorDoglegApproach(d51,dog,palette,{outwardDistance=.16,offset=0}={}){
 if(d51?.format!=='mythwrought.d51.unregistered-rotated-cap-actual-endface-link.v1'||
  d51.stages?.length!==3||d51.stages.some(s=>s?.vertices?.length!==6)||
  dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
  !paletteOK(palette)||![.16,.32,.56].includes(outwardDistance)||![-.12,0,.12].includes(offset))
  throw TypeError('D52 only exact D51 original cap/valid dogleg/Pack2 palette and bounded exterior staging');
 const originalCap=deriveD51DoglegActualBoundaryCap(dog,{entry:d51.target.entry}),normal=[0,0,0];
 normal[originalCap.axis]=originalCap.sign;
 const sideAxis=dog.plane==='x'?2:0,translation=mul(normal,outwardDistance);
 translation[sideAxis]+=offset;
 const sourceCap=d51.stages[1].vertices.slice(3,6),exteriorCap=originalCap.triangle.map(p=>add(p,translation));
 const third=hull(sourceCap,exteriorCap,palette,'source-to-exterior-staging-cap'),
  fourth=hull(exteriorCap,originalCap.triangle,palette,'exterior-normal-to-real-dogleg-face');
 const stages=[d51.stages[0],d51.stages[1],third,fourth],overlaps=[];
 for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)overlaps.push({i,j,positiveVolume:sat(stages[i],stages[j])});
 const finalTravel=dot(sub(center(originalCap.triangle),center(exteriorCap)),normal);
 return Object.freeze({format:'mythwrought.d52.uninstalled-four-stage-exterior-dogleg-link.v1',
  stages,originalCap,outwardDistance,offset,exteriorCap,originalD51:d51,
  realSocketContactArea:d51.originalPatchArea,realDoglegCapArea:originalCap.contactArea,
  genuineSharedTriangleCaps:3,normal,finalTravel,faceApproachedFromOutside:finalTravel<0,
  overlaps,registeredBlock:false,realMechanicalRetention:false,foundationRated:false,
  physicalGameplayTested:false,constructionAllowed:false});
}
/** Full convex-volume SAT against actual source cells/standing WALK, D36
 * socket, both D45 dogleg prisms and all authentic nearby D31 OBBs. */
export function inspectD52FullOriginalVolume(link,patch,dog,socket,source,wall,{otherOwners=[],maxCells=512}={}){
 if(link?.format!=='mythwrought.d52.uninstalled-four-stage-exterior-dogleg-link.v1'||
  patch?.format!=='mythwrought.d48.unregistered-slope-subface-patch.v1'||
  dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
  socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
  typeof source?.get!=='function'||!(source.nav instanceof Set)||!v(wall)||
  !Array.isArray(otherOwners)||otherOwners.length>90||
  !Number.isSafeInteger(maxCells)||maxCells<64||maxCells>1024)
  throw TypeError('D52 only genuine unmodified original W16/W17 source and physical hulls');
 const summary={solid:0,walk:0,socket:0,member:0,dogleg:0,firstOriginalSolid:null};
 const dogBoxes=dog.fullPrismBounds.map(b=>box(b.min,b.max)),rows=[];
 for(const part of link.stages){const row={stage:part.stage,solid:0,walk:0,socket:0,member:0,dogleg:0};
  const low=part.bounds.min.map(x=>Math.floor(x+EPS)),high=part.bounds.max.map(x=>Math.ceil(x-EPS)-1),
   budget=low.reduce((t,x,i)=>t*(high[i]-x+1),1);
  if(budget<1||budget>maxCells)throw RangeError('D52 real swept connector source-volume budget');
  for(let x=low[0];x<=high[0];x++)for(let y=low[1];y<=high[1];y++)for(let z=low[2];z<=high[2];z++){
   const c=source.get(x,y,z),b=box([x,y,z],[x+1,y+1,z+1]);
   if(c&&sat(part,b)){row.solid++;if(!summary.firstOriginalSolid)summary.firstOriginalSolid={at:[x,y,z],role:c.role,asset:c.asset,relative:[x-wall[0],y-wall[1],z-wall[2]],stage:part.stage};}
   if(source.nav.has(`${x},2,${z}`)&&sat(part,box([x+.2,2,z+.2],[x+.8,4.5,z+.8])))row.walk++;
  }
  if(sat(part,socket))row.socket++;
  for(const m of otherOwners)for(const ob of m?.ownerOBBs??[])if(sat(part,obb(ob)))row.member++;
  for(const d of dogBoxes)if(sat(part,d))row.dogleg++;
  for(const k of ['solid','walk','socket','member','dogleg'])summary[k]+=row[k];rows.push(row);
 }
 const exactTerminus=link.originalCap.triangle.every((p,i)=>p.every((x,k)=>Math.abs(link.stages[3].vertices[i+3][k]-x)<1e-10)),
  exactSocket=patch.vertices.slice(3,6).every((p,i)=>p.every((x,k)=>Math.abs(link.stages[0].vertices[i][k]-x)<1e-10)),
  selfOverlap=link.overlaps.filter(r=>r.positiveVolume),
  preexistingD51SourceSocketClear=rows[0].solid+rows[0].walk+rows[0].socket+rows[1].solid+rows[1].walk+rows[1].socket===0,
  allClear=summary.solid+summary.walk+summary.socket+summary.member+summary.dogleg===0&&selfOverlap.length===0&&exactTerminus&&exactSocket&&link.faceApproachedFromOutside;
 return Object.freeze({format:'mythwrought.d52.genuine-original-exterior-endcap-fail-closed-proof.v1',
  ...summary,rows,exactTerminus,exactSocket,preexistingD51SourceSocketClear,realEndcapArea:link.realDoglegCapArea,
  realSocketPatchArea:link.realSocketContactArea,positiveVolumeSelfOverlapPairs:selfOverlap,
  geometricConnectorClear:allClear,sourceCellsModified:0,sourceMaterialIDsAdded:0,
  realFastenerRated:false,realFoundationRated:false,realRoofBearingCertified:false,
  productionRendererColliderPwaAccepted:false,constructionAllowed:false});
}
/** Offline source palette ray, with true exposed dogleg face as the target. */
export function sampleD52ExteriorMeshRay(link){
 if(link?.format!=='mythwrought.d52.uninstalled-four-stage-exterior-dogleg-link.v1')throw TypeError('D52 real exterior endcap only');
 const centroid=center(link.originalCap.triangle),n=link.normal,from=add(centroid,mul(n,.09)),dir=mul(n,-1),
  t=d31RayPreviewTriangles(link.stages[3].mesh,from,dir,1);
 if(t===null||Math.abs(t-.09)>1e-5)throw Error('D52 true dogleg exterior face preview mesh/ray mismatch');
 return Object.freeze({sourcePaletteId61Only:true,rayDelta:Math.abs(t-.09),previewOnly:true,
  actualGameplayPickingPassed:false,constructionAllowed:false});
}
