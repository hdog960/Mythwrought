// Actual engine ownership and streaming geometry, read-only projection.
// No runtime registration, budget bypass, construction, or GL claims.
import {chunkCoord,chunkWindow,BLOCK} from '../voxel.mjs';
import {sectionForY,sectionBounds,sectionWindow,sectionChunkRadius,depthMeshKey,
 verticalEditSections,LOWEST_SECTION} from '../depth.mjs';
import {editAffectedChunks} from '../chunks.mjs';
import {GALLERY_CONSTRUCTION_LIMITS as limits} from './physical-gallery-construction.mjs';
const xyz=k=>k.split(',').map(Number),key=(x,y,z)=>x+','+y+','+z;
const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const owner=(x,y,z)=>{
 const s=sectionForY(y);if(s===null)throw Error('GALLERY_FACE_OUTSIDE_ENGINE_DEPTH');
 return depthMeshKey(chunkCoord(x),chunkCoord(z),s);
};
const decode=k=>{const [cx,cz,s=0]=xyz(k);return {cx,cz,s};};
const add=(m,k,n)=>m.set(k,(m.get(k)??0)+n);
export function actualGallerySectionCosts(cuts,naturalAt){
 const counts=new Map(),deltas=new Map();
 for(const k of cuts){
  const [x,y,z]=xyz(k),o=owner(x,y,z);
  if(naturalAt(x,y,z)===BLOCK.AIR)throw Error('OLD_AIR_IN_CUT_UNION');
  add(counts,o,1);
  for(const [dx,dy,dz] of dirs){
   const a=x+dx,b=y+dy,c=z+dz;
   if(cuts.has(key(a,b,c)))continue;
   if(naturalAt(a,b,c)===BLOCK.AIR)add(deltas,o,-1);
   else add(deltas,owner(a,b,c),1);
  }
 }
 return [...new Set([...counts.keys(),...deltas.keys()])].sort().map(k=>({
  key:k,...decode(k),cuts:counts.get(k)??0,delta:deltas.get(k)??0,
  faces:Math.max(0,deltas.get(k)??0)}));
}
export function engineWantedSections(cx,cz,active,shaft=false){
 const feet=sectionBounds(active).minY;
 const sections=sectionWindow(feet,shaft);
 return sections.flatMap(s=>chunkWindow(cx*16,cz*16,sectionChunkRadius(s,sections[0]))
  .map(p=>depthMeshKey(p.cx,p.cz,s)));
}
const haloSize=s=>18*18*(sectionBounds(s).maxY-sectionBounds(s).minY+3);
export function auditGalleryEngineWorkingSet(rows){
 const byKey=new Map(rows.map(r=>[r.key,r]));
 if(byKey.size!==rows.length)throw Error('DUPLICATE_ENGINE_OWNER');
 const centers=new Set();
 // Enumerate every possible horizontal center whose real wanted set can
 // intersect a changed section; all other centers have zero gallery cost.
 for(const r of rows)
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)
   centers.add(key(r.cx+dx,0,r.cz+dz));
 let windows=0,maxResidentFaces=0,maxResidentCuts=0,maxResidentSections=0;
 let maxEditStagedFaces=0,maxEditGenerationHalo=0,maxFullReplacementFaces=0;
 let maxFullReplacementHalo=0,maxOneArrivalHalo=0,peak=null,peakEdit=null;
 const total=(ks,field)=>ks.reduce((n,k)=>n+(byKey.get(k)?.[field]??0),0);
 // Normal streaming evicts unwanted owners before new uploads (main stream).
 // Therefore arrival peak is bounded by the complete new wanted set, not
 // the union of old and new windows. Edits stage replacements alongside
 // old GPU buffers; count every staged copy, not only distinct owners.
 for(const c of centers){
  const [cx,,cz]=xyz(c);
  for(let active=LOWEST_SECTION;active<=0;active++)
   for(const shaft of active===0?[false,true]:[false]){
    const wanted=engineWantedSections(cx,cz,active,shaft),set=new Set(wanted);
    const faces=total(wanted,'faces'),cuts=total(wanted,'cuts');
    if(!faces&&!cuts)continue;
    windows++;maxResidentCuts=Math.max(maxResidentCuts,cuts);
    maxResidentSections=Math.max(maxResidentSections,wanted.length);
    if(faces>maxResidentFaces){maxResidentFaces=faces;peak={cx,cz,active,shaft,wanted,faces,cuts};}
    maxFullReplacementFaces=Math.max(maxFullReplacementFaces,faces*2);
    maxFullReplacementHalo=Math.max(maxFullReplacementHalo,wanted.reduce((n,k)=>n+haloSize(decode(k).s),0));
    maxOneArrivalHalo=Math.max(maxOneArrivalHalo,...wanted.map(k=>haloSize(decode(k).s)));
    // Actual refreshEditedMeshes uses verticalEditSections * editAffectedChunks.
    // Enumerate section interiors and both boundary heights, and horizontal
    // interior, edges and corners in every wanted owner. Staging uses old
    // resident buffers plus replacement copies; missing chunks never stage.
    // Any edit with no resident affected chunk has zero staged cost.
    const editOwners=new Set();
    for(const k of wanted){
     const {cx:x,cz:z,s}=decode(k);
     for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
      for(let ds=-1;ds<=1;ds++){
       const a=s+ds;if(a>=LOWEST_SECTION&&a<=0)editOwners.add(depthMeshKey(x+dx,z+dz,a));
      }
    }
    for(const k of editOwners){
     const {cx:x,cz:z,s}=decode(k),b=sectionBounds(s);
     for(const y of new Set([b.minY,b.maxY,Math.floor((b.minY+b.maxY)/2)]))
      for(const ox of [0,8,15])for(const oz of [0,8,15]){
       const staged=verticalEditSections(y).flatMap(a=>editAffectedChunks(x*16+ox,z*16+oz)
        .map(p=>depthMeshKey(p.cx,p.cz,a))).filter(k=>set.has(k));
       const growth=faces+total(staged,'faces');
       const halo=staged.reduce((n,k)=>n+haloSize(decode(k).s),0);
       if(growth>maxEditStagedFaces){maxEditStagedFaces=growth;peakEdit={cx,cz,active,shaft,
        edit:[x*16+ox,y,z*16+oz],staged,faces:growth};}
       maxEditGenerationHalo=Math.max(maxEditGenerationHalo,halo);
      }
    }
   }
 }
 const maxOwnerFaces=Math.max(0,...rows.map(r=>r.faces));
 return {windows,maxResidentFaces,maxResidentCuts,maxResidentSections,maxOwnerFaces,
  maxEditStagedFaces,maxEditGenerationHalo,maxOneArrivalHalo,maxFullReplacementFaces,maxFullReplacementHalo,
  peak,peakEdit,globalCuts:rows.reduce((n,r)=>n+r.cuts,0),
  globalPositiveFaces:rows.reduce((n,r)=>n+r.faces,0),
  galleryResidentAndSingleEditWithinNumericLimits:maxResidentFaces<=limits.faceGrowth&&
   maxResidentCuts<=limits.ownedCarves&&maxOwnerFaces<=limits.perChunkFaceGrowth&&
   maxEditStagedFaces<=limits.faceGrowth&&maxEditGenerationHalo<=limits.originalNaturalReads,
  arbitraryReplacementBatchQualified:false,combinedFutureOverlaysQualified:false,
  actualGPUQualified:false,constructionAdmission:false};
}
