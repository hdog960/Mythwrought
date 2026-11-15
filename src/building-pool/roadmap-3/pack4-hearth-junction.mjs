// Roadmap 3 builder-owned construction variant: open, contacting hearth flue.
// Works ONLY on preview construction plans with canonical Pack4 geometry injected.
// Does not edit Pack4 source IDs, production registration, engine saves or world.
const STRIDE=10,VERTICES_PER_BOX=36;
const hole=Object.freeze({x0:.34,x1:.66,z0:.34,z1:.66});
const n6=b=>b.length===6&&b.every(Number.isFinite)&&
 b.slice(0,3).every((v,i)=>v<b[i+3]);
const overlap=(a,b)=>Math.min(a[3],b[3])-Math.max(a[0],b[0])>1e-5&&
 Math.min(a[5],b[5])-Math.max(a[2],b[2])>1e-5;
const cellKey=pos=>pos.join(',');
const clone=(part,b,detail)=>Object.freeze({...part,
 bounds:Object.freeze([...b]),constructionDetail:detail});
const boundsAt=(bounds,[x,y,z])=>bounds.map((v,i)=>v+[x,y,z][i%3]);

// Remove only the central shaft from the two existing whole-width fireplace
// mantel slabs; keep every other canonical carved, grate, soot and jamb part.
// A simple added trim without the cutout would falsely claim an open flue.
function splitMantel(p){
 const [x0,y0,z0,x1,y1,z1]=p.bounds;
 const {x0:a,x1:b,z0:c,z1:d}=hole;
 if(!(x0<a&&b<x1&&z0<c&&d<z1))throw Error('Mantel exceeds expected hole');
 return [
  [x0,y0,z0,a,y1,z1],[b,y0,z0,x1,y1,z1],
  [a,y0,z0,b,y1,c],[a,y0,d,b,y1,z1]
 ].map(b=>clone(p,b,'authored-open-flue-aperture'));
}
function derived(source,parts,tag){
 const stride=source.previewMesh?.stride;
 const input=source.previewMesh?.opaque;
 if(stride!==STRIDE||!(input instanceof Float32Array)||
    input.length!==source.visible.length*VERTICES_PER_BOX*STRIDE)
  throw Error('Exact original Pack4 vertex stream required; symbolic geometry denied');
 const samples=new Map();
 for(let i=0;i<source.visible.length;i++){
  const p=source.visible[i];
  if(!samples.has(p.material))samples.set(p.material,{part:p,at:i});
 }
 const out=new Float32Array(parts.length*VERTICES_PER_BOX*STRIDE);
 let offset=0;
 for(const part of parts){
  const sample=samples.get(part.material);
  if(!sample||!n6(part.bounds)||!n6(sample.part.bounds))
   throw Error('Unrecognized Pack4 source material or invalid physical AABB');
  const old=sample.part.bounds,box=part.bounds;
  const start=sample.at*VERTICES_PER_BOX*STRIDE;
  for(let i=0;i<VERTICES_PER_BOX;i++){
   const q=start+i*STRIDE;
   for(let axis=0;axis<3;axis++)
    out[offset+axis]=box[axis]+
     (input[q+axis]-old[axis])/(old[axis+3]-old[axis])*
       (box[axis+3]-box[axis]);
   for(let j=3;j<STRIDE;j++)out[offset+j]=input[q+j];
   offset+=STRIDE;
  }
 }
 return Object.freeze({...source,visible:Object.freeze(parts),
  collision:Object.freeze(parts.filter(p=>p.collision!==false).map(p=>p.bounds)),
  selection:Object.freeze(parts.filter(p=>p.selection!==false).map(p=>p.bounds)),
  previewMesh:Object.freeze({opaque:out,translucent:new Float32Array(0),
    stride:STRIDE,note:'Source-exact Pack4 material shading; real remeshed masonry air shaft'}),
  builderAssemblyProfile:tag,registeredInLiveGame:false});
}
function fireplaceDetail(original){
 if(original.id!==177||original.rotation!==0)throw Error('Unsupported fireplace source/orientation');
 let split=0;
 const parts=[];
 for(const p of original.visible){
  // The two original full-width slabs span the flue and cannot be retained.
  const upperMantel=p.material==='chalk'&&Math.abs(p.bounds[4]-.94)<1e-6;
  const lintel=p.material==='limestone'&&Math.abs(p.bounds[4]-.88)<1e-6;
  if(upperMantel||lintel){parts.push(...splitMantel(p));split++;}
  else parts.push(p);
 }
 if(split!==2)throw Error('Original mantel/slab structure changed; review required');
 const source=original.visible.find(p=>p.material==='chalk');
 if(!source)throw Error('Missing exact Pack4 chalk material');
 for(const rect of [
  [.15,.94,.22,.34,1,.87],[.66,.94,.22,.85,1,.87],
  [.34,.94,.22,.66,1,.34],[.34,.94,.66,.66,1,.87]
 ])parts.push(clone(source,rect,'solid-masonry-transition-to-chimney'));
 return derived(original,parts,'open-hearth-contact-v1');
}
function chimneyDetail(original,hasNextCourse){
 if(original.id!==176||original.rotation!==0)throw Error('Unsupported chimney source/orientation');
 if(!hasNextCourse)return original;
 const source=original.visible.find(p=>p.material==='limestone');
 if(!source)throw Error('Missing Pack4 source limestone rim');
 // Original course cap stops at .96: terminate to the next course's true
 // y=0 side-wall geometry without filling the hollow center.
 const parts=[...original.visible];
 for(const box of [
  [.13,.96,.13,.29,1,.87],[.71,.96,.13,.87,1,.87],
  [.29,.96,.13,.71,1,.29],[.29,.96,.71,.71,1,.87]
 ])parts.push(clone(source,box,'open-chimney-course-bond'));
 return derived(original,parts,'hollow-course-joint-v1');
}
function clearShaft(shape){
 for(const y of [.77,.81,.90,.97,.995]){
  for(const b of shape.collision){
   if(b[0]<.5&&.5<b[3]&&b[1]<y&&y<b[4]&&b[2]<.5&&.5<b[5])
    return false;
  }
 }
 return true;
}
function contact(lower,upper){
 return lower.visible.some(a=>a.collision!==false&&Math.abs(a.bounds[4]-1)<1e-6&&
  upper.visible.some(b=>b.collision!==false&&Math.abs(b.bounds[1])<1e-6&&
   overlap(a.bounds,b.bounds)));
}
export function assemblePhysicalHearths(plan){
 if(!plan||!Array.isArray(plan.placements))throw TypeError('Physical Pack4 construction plan required');
 const byCell=new Map(plan.placements.map(p=>[cellKey(p.at),p]));
 const edited=[];
 let hearthCount=0,hollowCourseBonds=0,fireplaceSeamBonds=0;
 for(const placement of plan.placements){
  if(![176,177].includes(placement.candidateId)){edited.push(placement);continue;}
  const [x,y,z]=placement.at;
  let shape=placement.physical;
  if(placement.candidateId===177){
   const next=byCell.get(cellKey([x,y+1,z]));
   if(!next||next.candidateId!==176)
    throw Error('Fireplace lacks continuous hollow chimney above at '+placement.at);
   shape=fireplaceDetail(shape);
   hearthCount++;
   if(!clearShaft(shape)||!contact(shape,next.physical))
    throw Error('Fireplace-to-flue physical throat not open or contacting');
   fireplaceSeamBonds++;
  }else{
   const previous=byCell.get(cellKey([x,y-1,z]));
   const next=byCell.get(cellKey([x,y+1,z]));
   if(!previous||![176,177].includes(previous.candidateId))
    throw Error('Unsupported hollow-chimney course at '+placement.at);
   shape=chimneyDetail(shape,next?.candidateId===176);
   if(!clearShaft(shape))throw Error('Pack4 chimney center blocked');
   if(next?.candidateId===176&&!contact(shape,next.physical))
    throw Error('Chimney course masonry gap at '+placement.at);
   if(next?.candidateId===176)hollowCourseBonds++;
  }
  edited.push(Object.freeze({...placement,physical:shape,
   builderContactCertified:true,previewOnly:true}));
 }
 if(plan.resolvedCount>0&&hearthCount!==1)
  throw Error('Construction blueprint lacks the expected real source fireplace');
 const actuallyCertified=hearthCount===1;
 const output=Object.freeze({...plan,placements:Object.freeze(edited),
  masonryHearths:hearthCount,fireplaceSeamBonds,hollowCourseBonds,
  verticalFlueOpen:actuallyCertified,subBoxContactReview:!actuallyCertified,
  physicalAssemblyOnly:actuallyCertified,liveGameRegistered:false});
 return output;
}
export function verifyHearthAssemblyContact(plan){
 const byCell=new Map(plan.placements.map(p=>[cellKey(p.at),p]));
 let bonds=0,hearths=0;
 for(const p of plan.placements){
  if(p.candidateId===177){
   hearths++;
   if(!clearShaft(p.physical))throw Error('Mantel blocks real flue opening');
  }
  if(p.candidateId!==176&&p.candidateId!==177)continue;
  const upper=byCell.get(cellKey([p.at[0],p.at[1]+1,p.at[2]]));
  if(upper?.candidateId===176){
   if(!contact(p.physical,upper.physical))throw Error('Sub-box masonry does not contact vertically');
   bonds++;
  }
 }
 return Object.freeze({hearths,bonds,flueUnobstructed:true,contactCertified:true});
}
