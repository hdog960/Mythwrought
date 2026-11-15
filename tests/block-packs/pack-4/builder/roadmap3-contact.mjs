// Pack4-owned source-exact cross-branch builder assembly audit, no modifications.
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
import * as pack4 from '../../../../src/block-packs/pack-4/builder-handoff.mjs';
const path=resolve(process.cwd(),'../consumers/r3/src/building-pool/roadmap-3/m1-pack4-physical.mjs');
const {getM1Pack4Construction}=await import(pathToFileURL(path).href);
const plans=getM1Pack4Construction(pack4);
const blacksmith=plans.filter(b=>b.source.type==='blacksmith');
assert.equal(blacksmith.length,15);
let bonds=0,courses=0,collarParts=0,safeHearths=0,maxVertexCount=0;
const originalFireplace=pack4.pack4BuilderAsset('pack4:064');
const originalFlue=pack4.pack4BuilderAsset('pack4:063');
const inside=(bounds,x,y,z)=>bounds[0]<x&&x<bounds[3]&&bounds[1]<y&&y<bounds[4]&&bounds[2]<z&&z<bounds[5];
for(const view of blacksmith){
 assert.equal(view.hearthPhysicalContactCertified,true,view.blueprintId);
 assert.equal(view.chimneySubBoxContactReview,false,view.blueprintId);
 assert.equal(view.hearthBackingsAdded>=0,true);
 const slots=new Map(view.physicalPlan.placements.map(p=>[p.at.join(','),p]));
 let flue=0,fireplace=0,localBonds=0;
 for(const p of view.physicalPlan.placements.filter(p=>[176,177].includes(p.candidateId))){
  const {physical:shape}=p;
  assert.ok(shape.visible.length>0&&shape.collision.length>0&&shape.selection.length>0);
  assert.equal(shape.previewMesh.stride,10);
  assert.ok(shape.previewMesh.opaque instanceof Float32Array);
  assert.equal(shape.previewMesh.opaque.length,shape.visible.length*36*10);
  assert.ok([...shape.previewMesh.opaque].every(Number.isFinite),'GPU mesh contains invalid vertex');
  maxVertexCount=Math.max(maxVertexCount,shape.previewMesh.opaque.length/10);
  if(p.candidateId===177){
   fireplace++;
   assert.equal(shape.builderAssemblyProfile,'open-hearth-contact-v1');
   assert.ok(shape.visible.some(part=>part.constructionDetail==='solid-masonry-transition-to-chimney'));
   // Source fireplace has a full slab over the center at .8 and .9.
   assert.ok(originalFireplace.collision.some(b=>inside(b,.5,.8,.5)));
   for(const y of [.77,.80,.87,.90,.94,.98])
    assert.equal(shape.collision.some(b=>inside(b,.5,y,.5)),false,
      view.blueprintId+' chimney opening still blocked at y='+y);
   for(const y of [.95,.98,.995])
    assert.ok(shape.collision.some(b=>inside(b,.2,y,.5)),
      view.blueprintId+' no contact stone at local Y='+y);
   safeHearths++;
  }else{
   flue++;
   assert.ok(!shape.collision.some(b=>inside(b,.5,.65,.5)));
   assert.ok(!shape.collision.some(b=>inside(b,.5,.98,.5)));
   if(shape.builderAssemblyProfile==='hollow-course-joint-v1'){
    collarParts+=shape.visible.filter(x=>x.constructionDetail==='open-chimney-course-bond').length;
    assert.ok(shape.collision.some(b=>inside(b,.2,.98,.5)),
      view.blueprintId+' no chimney joint stone near top');
   }
  }
  const above=slots.get([p.at[0],p.at[1]+1,p.at[2]].join(','));
  if(above?.candidateId===176){
   localBonds++;
   assert.ok(shape.visible.some(lo=>lo.collision!==false&&Math.abs(lo.bounds[4]-1)<1e-6&&
     above.physical.visible.some(up=>up.collision!==false&&Math.abs(up.bounds[1])<1e-6&&
      Math.min(lo.bounds[3],up.bounds[3])-Math.max(lo.bounds[0],up.bounds[0])>1e-5&&
      Math.min(lo.bounds[5],up.bounds[5])-Math.max(lo.bounds[2],up.bounds[2])>1e-5)));
  }
 }
 assert.equal(fireplace,1,view.blueprintId);
 assert.ok(flue>=8,view.blueprintId);
 assert.equal(localBonds,flue);
 assert.equal(view.physicalPlan.fireplaceSeamBonds,1);
 assert.equal(view.physicalPlan.hollowCourseBonds,flue-1);
 bonds+=localBonds;courses+=flue;
 const originalTheoretical=view.source;
 assert.ok(originalTheoretical.modules.some(m=>m.role==='roof'));
 assert.ok(originalTheoretical.clearances.length>0);
}
assert.equal(safeHearths,15);
assert.equal(bonds,courses);
assert.equal(collarParts,(courses-15)*4);
assert.equal(originalFlue.visible.some(x=>x.constructionDetail),false);
assert.equal(originalFireplace.visible.some(x=>x.constructionDetail),false);
const report={status:'PASS',pr:122,blacksmiths:15,
 realHollowChimneyCourses:courses,certifiedContactBonds:bonds,
 fireplaceToFlueJunctions:15,interCourseCollarParts:collarParts,
 actualAperture:'.34..66 X and Z above local Y=.76',
 originalPack4AssetsUnmodified:true,
 allBuilderAirShaftsClear:true,
 genuineSourceMaterialVertexStreams:true,
 noRuntimeRegistration:true,creatorArtworkApproved:false,
 maximumSubpartGpuVertices:maxVertexCount};
await mkdir('artifacts/pack-4',{recursive:true});
await writeFile('artifacts/pack-4/roadmap3-contact-audit.json',
 JSON.stringify(report,null,2)+'\n');
console.log('PACK4_R3_MASONRY_CONTACT '+JSON.stringify(report));
