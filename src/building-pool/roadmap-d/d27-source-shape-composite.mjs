// MYTHWROUGHT D27: pure source-geometry operation; never a registered block.
// Exact original Pack2 ID61/62 boxes supplied by the owning original-source adapter.
// A positive-area WOOD face contact is a geometric condition, NOT an allowable load.
const EPS = 1e-7;
const valid = b => Array.isArray(b) && b.length === 6 && b.every(Number.isFinite) &&
  [0,1,2].every(i=>b[i]>=0 && b[i]<b[i+3] && b[i+3]<=1);
const interval = (a,b,i) => Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i]);
const overlap = (a,b) => [0,1,2].every(i=>interval(a,b,i)>EPS);
const meet = (a,b) => [0,1,2].every(i=>interval(a,b,i)>=-EPS) &&
  [0,1,2].filter(i=>interval(a,b,i)>EPS).length>=2;
function subtract(a,b){
  if(!overlap(a,b)) return [[...a]];
  const cut=[0,1,2].map(i=>[Math.max(a[i],b[i]),Math.min(a[i+3],b[i+3])]);
  const work=[...a],parts=[];
  for(let i=0;i<3;i++){
    if(work[i]<cut[i][0]-EPS){const p=[...work];p[i+3]=cut[i][0];parts.push(p);work[i]=cut[i][0];}
    if(work[i+3]>cut[i][1]+EPS){const p=[...work];p[i]=cut[i][1];parts.push(p);work[i+3]=cut[i][1];}
  }
  return parts;
}
// Exact area of the union of clipped rectangles on a plane, not the sum of
// overlapping post collars. Full-box slab is the independent WOOD reference.
function areaAtFace(boxes,axis,at){
  const others=[0,1,2].filter(i=>i!==axis);
  const relevant=boxes.filter(b=>Math.abs(b[axis+(at===1?3:0)]-at)<=EPS);
  if(!relevant.length)return 0;
  const [u,v]=others,us=[...new Set(relevant.flatMap(b=>[b[u],b[u+3]]))].sort((a,b)=>a-b),
        vs=[...new Set(relevant.flatMap(b=>[b[v],b[v+3]]))].sort((a,b)=>a-b);
  let result=0;
  for(let i=0;i<us.length-1;i++)for(let j=0;j<vs.length-1;j++){
    const m=(us[i]+us[i+1])/2,n=(vs[j]+vs[j+1])/2;
    if(relevant.some(b=>m>b[u]+EPS&&m<b[u+3]-EPS&&n>b[v]+EPS&&n<b[v+3]-EPS))
      result+=(us[i+1]-us[i])*(vs[j+1]-vs[j]);
  }
  return result;
}
/** Pure, individually bounded composite for ONE cell; caller must verify source ownership. */
export function composeD27Pack2WoodFace(beam,post,axis,roofCube=[[0,0,0,1,1,1]]){
  if((axis!=='x'&&axis!=='z')||!Array.isArray(beam)||beam.length!==3||
     !Array.isArray(post)||post.length!==3||
     !Array.isArray(roofCube)||roofCube.length!==1||
     [...beam,...post,...roofCube].some(b=>!valid(b))||
     JSON.stringify(roofCube)!=='[[0,0,0,1,1,1]]')
    throw Error('D27 requires exact bounded Pack2 owners and actual full-cube WOOD');
  const supplement=[];
  for(let p=0;p<post.length;p++){
    let pieces=[[...post[p]]];
    for(const member of beam)pieces=pieces.flatMap(piece=>subtract(piece,member));
    for(const box of pieces)supplement.push({sourcePostPart:p,box});
  }
  const combined=[...beam.map(b=>[...b]),...supplement.map(p=>p.box)];
  if(supplement.length<3||supplement.length>18||combined.length>32||
    supplement.some(p=>beam.some(b=>overlap(p.box,b))))
    throw Error('D27 cut post intersects real beam or exceeds 32-box engine budget');
  const reached=new Set(),queue=[0];
  while(queue.length){const i=queue.pop();if(reached.has(i))continue;reached.add(i);
    for(let j=0;j<combined.length;j++)if(!reached.has(j)&&meet(combined[i],combined[j]))queue.push(j);
  }
  if(reached.size!==combined.length)throw Error('D27 cut-post composite leaves detached pieces');
  const roofArea=areaAtFace(supplement.map(p=>p.box),1,1);
  const left=areaAtFace(beam,axis==='x'?0:2,0),right=areaAtFace(beam,axis==='x'?0:2,1);
  if(roofArea<=EPS||left<=EPS||right<=EPS||areaAtFace(beam,1,1)>EPS)
    throw Error('D27 missing independent post-to-real-wood or wall-to-beam face contact');
  // Real runtime collision expects a union-of-local-boxes. This preview is
  // exact for geometric occupancy, but NOT installed or assigned a Block ID.
  const frozenBoxes=Object.freeze(combined.map(b=>Object.freeze(b)));
  return Object.freeze({format:'mythwrought.builder-d.d27.composite-shape-unregistered.v1',
    axis,boxes:frozenBoxes,originalBeamBoxCount:beam.length,
    addedDerivedPostBoxCount:supplement.length,colliderBoxCount:frozenBoxes.length,
    roofFaceArea:roofArea,nearEndFaceArea:left,farEndFaceArea:right,
    originalWoodCubeAssumed:true,noPositiveBeamPostVolumeOverlap:true,
    materialAndGeometrySourceOnly:true,liveGameInstalled:false,
    loadBearingOrGravityStrengthCertified:false,releaseApproved:false});
}
export const d27PositiveVolumeOverlap=overlap;
